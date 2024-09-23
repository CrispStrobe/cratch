import Foundation
import WebKit
import CoreBluetooth
import Combine

// Déclaration de types pour des types d'entiers non signés couramment utilisés
typealias uint8 = UInt8
typealias uint16 = UInt16
typealias uint32 = UInt32

// Erreurs de sérialisation personnalisées
enum SerializationError: Error {
    case invalid(String)
    case internalError(String)
}

// Erreurs possibles pour une session Bluetooth ou WebSocket
public enum SessionError: Error {
    case unavailable
    case bluetoothIsPoweredOff
    case bluetoothIsUnauthorized
    case bluetoothIsUnsupported
    case other(error: Error)
}

// Extension pour rendre les erreurs localisées avec des descriptions personnalisées
extension SessionError: LocalizedError {
    public var errorDescription: String? {
        switch self {
        case .unavailable:
            return NSLocalizedString("This session is unavailable", bundle: Bundle.module, comment: "Session unavailable")
        case .bluetoothIsPoweredOff:
            return NSLocalizedString("Bluetooth is powered off", bundle: Bundle.module, comment: "Bluetooth is powered off")
        case .bluetoothIsUnauthorized:
            return NSLocalizedString("Bluetooth is unauthorized", bundle: Bundle.module, comment: "Bluetooth is unauthorized")
        case .bluetoothIsUnsupported:
            return NSLocalizedString("Bluetooth is unsupported", bundle: Bundle.module, comment: "Bluetooth is unsupported")
        case .other(error: let error):
            return error.localizedDescription
        }
    }
}

// Enum pour les types de session (BLE ou Bluetooth classique)
public enum SessionType {
    case ble
    case bt
    
    // Initialisation d'un type de session à partir d'une URL
    init?(url: URL) {
        switch url.lastPathComponent {
        case "ble":
            self = .ble
        case "bt":
            self = .bt
        default:
            return nil
        }
    }
}

// Classe ScratchLink pour gérer la communication avec les sessions Bluetooth et WebSocket
public class ScratchLink: NSObject {
    
    // Définition d'une structure de message conforme à Codable pour sérialiser/désérialiser facilement les messages
    private struct Message: Codable {
        let method: Method
        let socketId: Int
        let url: URL?
        let jsonrpc: String?
        
        enum Method: String, Codable {
            case open
            case close
            case send
        }
    }
    
    public weak var delegate: ScratchLinkDelegate?  // Délégué pour la gestion des sessions
    
    private weak var webView: WKWebView?  // Référence faible à la WebView utilisée pour injecter des scripts
    
    private var sessions = [Int: Session]()  // Stockage des sessions en cours par leur identifiant
    
    private let sessionQueue = DispatchQueue.global(qos: .userInitiated)  // File d'attente pour gérer les sessions
    
    private lazy var bluetoothConnectionChecker = CBCentralManager()  // Vérificateur de connexion Bluetooth
    private var cancellables: Set<AnyCancellable> = []  // Stockage des abonnements Combine
    
    // Configuration de la WebView avec un script JavaScript injecté
    public func setup(webView: WKWebView) {
        let js = JavaScriptLoader.load(filename: "inject-scratch-link")
        let script = WKUserScript(source: js, injectionTime: .atDocumentEnd, forMainFrameOnly: true)
        webView.configuration.userContentController.addUserScript(script)
        webView.configuration.userContentController.add(self, name: "scratchLink")
        self.webView = webView
    }
    
    // Fermeture de toutes les sessions actives
    public func closeAllSessions() {
        sessions.values.forEach { session in
            session.sessionWasClosed()
        }
        sessions.removeAll()
    }
}

// Extension pour gérer les messages reçus via la WebView
extension ScratchLink: WKScriptMessageHandler {
    
    public func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        // Décodage du message JSON reçu
        guard let jsonString = message.body as? String, let jsonData = jsonString.data(using: .utf8) else { return }
        guard let message = try? JSONDecoder().decode(Message.self, from: jsonData) else { return }
        
        let socketId = message.socketId
        
        switch message.method {
        case .open:
            // Ouverture d'une session si possible
            guard let url = message.url, let type = SessionType(url: url) else { break }
            
            if let canStart = delegate?.canStartSession(type: type), canStart == false {
                delegate?.didFailStartingSession(type: type, error: .unavailable)
                break
            }
            
            // Vérification de l'état du Bluetooth via CBCentralManager
            bluetoothConnectionChecker.publisher(for: \.state).first(where: { $0 != .unknown }).sink { [weak self] state in
                switch state {
                case .poweredOn:
                    do {
                        try self?.open(socketId: socketId, type: type)
                        self?.delegate?.didStartSession(type: type)
                    } catch {
                        self?.delegate?.didFailStartingSession(type: type, error: .other(error: error))
                    }
                case .poweredOff:
                    self?.delegate?.didFailStartingSession(type: type, error: .bluetoothIsPoweredOff)
                case .unauthorized:
                    self?.delegate?.didFailStartingSession(type: type, error: .bluetoothIsUnauthorized)
                case .unsupported:
                    self?.delegate?.didFailStartingSession(type: type, error: .bluetoothIsUnsupported)
                default:
                    break
                }
            }.store(in: &cancellables)
            
        case .close:
            // Fermeture de la session associée au socketId
            let session = sessions.removeValue(forKey: socketId)
            sessionQueue.async {
                session?.sessionWasClosed()
            }
            
        case .send:
            // Envoi d'un message JSON-RPC via la session active
            guard let jsonrpc = message.jsonrpc, let session = sessions[socketId] else { break }
            sessionQueue.async {
                session.didReceiveText(jsonrpc)
            }
        }
    }
    
    // Méthode privée pour ouvrir une session en fonction du type (BLE ou Bluetooth classique)
    private func open(socketId: Int, type: SessionType) throws {
        let webSocket = WebSocket() { [weak self] message in
            DispatchQueue.main.async {
                let js = "ScratchLink.sockets.get(\(socketId)).handleMessage('\(message)')"
                self?.webView?.evaluateJavaScript(js)
            }
        }
        
        // Création de la session en fonction du type de connexion
        switch type {
        case .ble:
            sessions[socketId] = try BLESession(withSocket: webSocket)
        case .bt:
            sessions[socketId] = try BTSession(withSocket: webSocket)
        }
    }
}

// Protocole délégué pour la gestion des sessions ScratchLink
public protocol ScratchLinkDelegate: AnyObject {
    func canStartSession(type: SessionType) -> Bool
    func didStartSession(type: SessionType)
    func didFailStartingSession(type: SessionType, error: SessionError)
}
