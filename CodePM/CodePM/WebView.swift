import SwiftUI
import Combine
import ScratchWebKit

// Déclaration de WebView, une vue qui intègre un UIViewController via UIViewControllerRepresentable
struct WebView: UIViewControllerRepresentable {
    
    // On récupère le contrôleur d'alertes depuis l'environnement SwiftUI
    @EnvironmentObject private var alertController: AlertController
    
    // Instanciation d'un contrôleur spécifique à ScratchWeb
    private let webViewController = ScratchWebViewController()
    
    // Méthode pour créer un coordinateur qui gère la communication entre SwiftUI et UIKit
    func makeCoordinator() -> WebView.Coordinator {
        return Coordinator(self)
    }
    
    // Création du contrôleur UIView pour la vue SwiftUI
    func makeUIViewController(context: Context) -> ScratchWebViewController {
        // On définit le coordinateur comme délégué du contrôleur web
        webViewController.delegate = context.coordinator
        // Chargement d'un fichier HTML local à partir du répertoire
        webViewController.load(url: FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0].appendingPathComponent("index.html"))
        return webViewController
    }
    
    // Méthode de mise à jour du contrôleur UIView, obligatoire pour le protocole UIViewControllerRepresentable, mais vide ici car pas de mise à jour nécessaire
    func updateUIViewController(_ uiViewController: ScratchWebViewController, context: Context) {
    }
}

// Extension de WebView pour définir le coordinateur qui gère les interactions
extension WebView {
    
    // Coordinator est une classe qui agit en tant que délégué pour le contrôleur ScratchWebViewController
    class Coordinator: NSObject, ScratchWebViewControllerDelegate {
        
        private let parent : WebView
        
        // Initialisation du coordinateur avec la vue WebView parent
        init(_ parent: WebView) {
            self.parent = parent
             }
      
        // Méthode appelée lorsqu'un fichier est téléchargé. Un DocumentPicker est présenté pour exporter le fichier. Permet de gérer l'enregistrement des fichiers dans Scratch.
        func didDownloadFile(at url: URL) {
            let vc = UIDocumentPickerViewController(forExporting: [url])
            vc.shouldShowFileExtensions = true
            parent.webViewController.present(vc, animated: true)
        }
        
        // Autorise ou non le démarrage d'une session ScratchLink en fonction du type (Bluetooth LE ou Bluetooth classique)
        func canStartScratchLinkSession(type: SessionType) -> Bool {
            #if DEBUG
            return true
            #else
            return type == .ble //Seul le BLE (Bluetooth Low Energy) est autorisé
            #endif
        }
        
        // Méthode appelée lorsqu'une session ScratchLink démarre
        func didStartScratchLinkSession(type: SessionType) {
            if type == .bt {
                // Si Bluetooth classique est utilisé, une alerte est affichée pour guider l'utilisateur
                parent.alertController.showAlert(howTo: Text("Please pair your Bluetooth device on Settings app before using this extension."))
            }
        }
     
        // Méthode appelée lorsque le démarrage d'une session ScratchLink échoue
        func didFailStartingScratchLinkSession(type: SessionType, error: SessionError) {
            switch error {
            case .unavailable:
                // Alerte indiquant que l'extension n'est pas supportée
                self.parent.alertController.showAlert(sorry: Text("This extension is not supported🙇🏻"))
            case .bluetoothIsPoweredOff:
                // Alerte pour indiquer que Bluetooth est éteint
                self.parent.alertController.showAlert(error: error)
            case .bluetoothIsUnauthorized:
                // Alerte pour informer que l'accès Bluetooth n'est pas autorisé
                self.parent.alertController.showAlert(unauthorized: Text("Bluetooth"))
            case .bluetoothIsUnsupported:
                // Alerte indiquant que Bluetooth n'est pas supporté
                self.parent.alertController.showAlert(error: error)
            case .other(error: let error):
                // Alerte pour tout autre type d'erreur
                self.parent.alertController.showAlert(error: error)
            }
        }
    }
}
