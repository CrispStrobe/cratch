import Foundation
import ExternalAccessory

// Classe BTSession qui gère la connexion Bluetooth via ExternalAccessory
class BTSession: Session {
    
    // Variables pour la session Bluetooth et son état
    private var connectedSession: EASession?  // Gère la session avec un accessoire
    private var state: SessionState = .initial  // Suivi de l'état de la session
    private var ouiPrefix: String  // Préfixe utilisé pour identifier des appareils spécifiques
    
    private let streamDelegateHelper: StreamDelegateHelper  // Aide pour gérer les événements de flux (Stream)
    private var messageQueue: [(Data, JSONRPCCompletionHandler)] = []  // File d'attente pour les messages en attente
    
    private var didRegisterForLocalNotifications = false  // Suivi si les notifications locales ont été enregistrées
    
    // État possible de la session
    private enum SessionState {
        case initial
        case discovery
        case connected
    }
    
    // Initialisation de la session avec un WebSocket
    required init(withSocket webSocket: WebSocket) throws {
        self.streamDelegateHelper = StreamDelegateHelper()
        self.ouiPrefix = ""
        try super.init(withSocket: webSocket)
        self.streamDelegateHelper.delegate = self  // Définit le délégué de Stream
    }
    
    // Déinitialisation : désinscription des notifications si elles étaient enregistrées
    deinit {
        if didRegisterForLocalNotifications {
            EAAccessoryManager.shared().unregisterForLocalNotifications()
        }
    }
    
    // Méthode pour gérer les appels JSON-RPC reçus
    override func didReceiveCall(_ method: String, withParams params: [String: Any], completion: @escaping JSONRPCCompletionHandler) throws {
        switch state {
        case .initial:
            if method == "discover" {
                // Vérifie les paramètres pour démarrer la découverte d'appareils
                if let major = params["majorDeviceClass"] as? UInt, let minor = params["minorDeviceClass"] as? UInt {
                    if let prefix = params["ouiPrefix"] as? String { self.ouiPrefix = prefix }
                    state = .discovery
                    discover(inMajorDeviceClass: major, inMinorDeviceClass: minor, completion: completion)
                } else {
                    completion(nil, JSONRPCError.invalidParams(data: "majorDeviceClass and minorDeviceClass required"))
                }
                return
            }
        case .discovery:
            if method == "connect" {
                // Connexion à un appareil spécifique via son identifiant
                if let peripheralId = params["peripheralId"] as? Int {
                    connect(toDevice: peripheralId, completion: completion)
                } else {
                    completion(nil, JSONRPCError.invalidParams(data: "peripheralId required"))
                }
                return
            }
        case .connected:
            if method == "send" {
                // Envoi d'un message à l'appareil connecté
                let decodedMessage = try EncodingHelpers.decodeBuffer(fromJSON: params)
                sendMessage(decodedMessage, completion: completion)
                return
            }
        }
        // Méthode non reconnue : passage à la classe de base
        try super.didReceiveCall(method, withParams: params, completion: completion)
    }
    
    // Gestion de la fermeture de la session
    override func sessionWasClosed() {
        // Ferme et retire les flux de la session
        connectedSession?.inputStream?.close()
        connectedSession?.inputStream?.remove(from: .main, forMode: .default)
        connectedSession?.inputStream?.delegate = nil
        
        connectedSession?.outputStream?.close()
        connectedSession?.outputStream?.remove(from: .main, forMode: .default)
        connectedSession?.outputStream?.delegate = nil
        
        connectedSession = nil
        
        super.sessionWasClosed()
    }
    
    // Découverte des périphériques Bluetooth
    private func discover(inMajorDeviceClass major: UInt, inMinorDeviceClass minor: UInt, completion: @escaping JSONRPCCompletionHandler) {
        sendDiscoveredPeripherals()  // Envoie la liste des périphériques connectés
        
        if !didRegisterForLocalNotifications {
            // Enregistre pour recevoir des notifications locales lors de la connexion d'un périphérique
            didRegisterForLocalNotifications = true
            EAAccessoryManager.shared().registerForLocalNotifications()
            NotificationCenter.default.addObserver(forName: .EAAccessoryDidConnect, object: nil, queue: .main) { [weak self] _ in
                self?.sendDiscoveredPeripherals()
            }
        }
        
        completion(nil, nil)
    }
    
    // Envoie la liste des périphériques découverts
    private func sendDiscoveredPeripherals() {
        let connectedAccessories = EAAccessoryManager.shared().connectedAccessories
        
        for accessory in connectedAccessories {
            let peripheralData: [String: Any] = [
                "peripheralId": accessory.connectionID,
                "name": accessory.name,
                "rssi": RSSI.unsupported.rawValue ?? 0  // RSSI non supporté
            ]
            // Envoie les informations du périphérique découvert
            DispatchQueue.main.async {
                self.sendRemoteRequest("didDiscoverPeripheral", withParams: peripheralData)
            }
        }
    }
    
    // Connexion à un périphérique spécifique via son identifiant
    private func connect(toDevice deviceId: Int, completion: @escaping JSONRPCCompletionHandler) {
        let connectedAccessories = EAAccessoryManager.shared().connectedAccessories
        
        // Recherche le périphérique et établit une session s'il est disponible
        guard let accessory = connectedAccessories.first(where: { $0.connectionID == deviceId }),
              let protocolString = accessory.protocolStrings.first,
              let session = EASession(accessory: accessory, forProtocol: protocolString) else {
            completion(nil, JSONRPCError.invalidRequest(data: "Device \(deviceId) not available for connection"))
            return
        }
        
        self.connectedSession = session
        
        // Configure les flux d'entrée et de sortie pour la session
        session.inputStream?.delegate = self.streamDelegateHelper
        session.inputStream?.schedule(in: .main, forMode: .default)
        session.inputStream?.open()
        
        session.outputStream?.delegate = self.streamDelegateHelper
        session.outputStream?.schedule(in: .main, forMode: .default)
        session.outputStream?.open()
        
        self.state = .connected
        completion(nil, nil)
    }
    
    // Envoi d'un message au périphérique connecté
    private func sendMessage(_ message: Data, completion: @escaping JSONRPCCompletionHandler) {
        guard let outputStream = connectedSession?.outputStream else {
            completion(nil, JSONRPCError.serverError(code: -32500, data: "No peripheral connected"))
            return
        }
        
        // Si le flux de sortie n'est pas prêt, met le message en file d'attente
        guard outputStream.hasSpaceAvailable else {
            messageQueue.append((message, completion))
            return
        }
        
        // Envoie le message via le flux de sortie
        message.withUnsafeBytes { (buffer: UnsafeRawBufferPointer) -> Void in
            if let bytes = buffer.bindMemory(to: UInt8.self).baseAddress {
                let count = outputStream.write(bytes, maxLength: buffer.count)
                if count > 0 {
                    completion(count, nil)
                } else {
                    completion(nil, JSONRPCError.serverError(code: -32500, data: "Failed to send message"))
                }
            } else {
                completion(nil, JSONRPCError.serverError(code: -32500, data: "Failed to send message"))
            }
        }
    }
}

// Extension pour gérer les événements de flux
extension BTSession: SwiftStreamDelegate {
    func stream(_ aStream: Stream, handle eventCode: Stream.Event) {
        switch eventCode {
        case .openCompleted:
            break
            
        case .hasSpaceAvailable:
            if !messageQueue.isEmpty {
                let message = messageQueue.removeFirst()
                sendMessage(message.0, completion: message.1)
            }
            
        case .hasBytesAvailable:
            guard let data = readFromStream() else { break }
            guard let responseData = EncodingHelpers.encodeBuffer(data, withEncoding: "base64") else { break }
            sendRemoteRequest("didReceiveMessage", withParams: responseData)
            
        case .endEncountered:
            break
            
        case .errorOccurred:
            sessionWasClosed()
            
        default:
            break
        }
    }
    
    // Lecture des données à partir du flux d'entrée
    private func readFromStream() -> Data? {
        guard let inputStream = connectedSession?.inputStream else { return nil }
        
        var readBuffer = [UInt8]()
        let bufferSize = 128
        var buf = [UInt8](repeating: 0x00, count: bufferSize)
        while inputStream.hasBytesAvailable {
            let bytesRead = inputStream.read(&buf, maxLength: bufferSize)
            if bytesRead == -1 {
                return nil
            } else if bytesRead == 0 {
                break
            }
            readBuffer.append(contentsOf: buf.prefix(bytesRead))
        }
        
        return Data(readBuffer)
    }
}

// Classe d'aide pour déléguer la gestion des événements de flux
private class StreamDelegateHelper: NSObject, StreamDelegate {
    weak var delegate: SwiftStreamDelegate?
    
    func stream(_ aStream: Stream, handle eventCode: Stream.Event) {
        delegate?.stream(aStream, handle: eventCode)
    }
}

// Protocole pour déléguer la gestion des événements de flux
private protocol SwiftStreamDelegate: AnyObject {
    func stream(_ aStream: Stream, handle eventCode: Stream.Event)
}
