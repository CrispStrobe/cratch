import SwiftUI

// Classe permettant de gérer les alertes
class AlertController: ObservableObject {
    
    // Fournit une fonction pour ouvrir une URL à partir de l'environnement SwiftUI
    @Environment(\.openURL) private var openURL
    
    // Enumération pour définir différents types de contenu d'alerte
    private enum Content {
        case error(error: Error)    // Alerte pour une erreur
        case howTo(message: Text, completion: () -> Void)   // Alerte expliquant comment utiliser une fonctionalité
        case sorry(message: Text)   // Alerte pour exprimer des excuses
        case unauthorized(type: Text)   // Alerte pour un accès non autorisé à certaines fonctionnalités
    }
    
    // Contenu de l'alerte en cours (s'il y en a une), déclenche un changement d'état
    private var alertContent: Content? = nil {
        willSet {
            objectWillChange.send()  // Contenu de l'alerte en cours (s'il y en a une), déclenche un changement d'état
        }
    }
    
    // Liaison (Binding) indiquant si une alerte est affichée ou non
    var isShowingAlert: Binding<Bool> {
        return Binding<Bool>(get: { self.alertContent != nil }, set: { _ in self.alertContent = nil })
    }
    
    // Fonction pour afficher une alerte avec une erreur
    func showAlert(error: Error) {
        self.alertContent = .error(error: error)
    }
    
    // Fonction pour afficher une alerte explicative avec une action après la fermeture
    func showAlert(howTo message: Text, completion: @escaping () -> Void = {}) {
        self.alertContent = .howTo(message: message, completion: completion)
    }
    
    // Fonction pour afficher une alerte d'excuses
    func showAlert(sorry message: Text) {
        self.alertContent = .sorry(message: message)
    }
    
    // Fonction pour afficher une alerte indiquant un accès non autorisé (bluetooth)
    func showAlert(unauthorized type: Text) {
        self.alertContent = .unauthorized(type: type)
    }
    
    // Génération d'une alerte à partir du contenu de l'alerte actuel
    func makeAlert() -> Alert {
        switch alertContent {
        case let .error(error: error):
            return Alert(title: Text("Error"), message: Text(error.localizedDescription))
            
        case let .howTo(message: message, completion: completion):
            return Alert(title: Text("How to Use"), message: message,
                         dismissButton: .default(Text("OK"), action: completion))
            
        case let .sorry(message: message):
            return Alert(title: Text("Sorry"), message: message)
            
        case let .unauthorized(type: type):
            let title = Text("\(type) is Not Allowed")
            let message = Text("Allow \(type) access in Settings to use this function.")
            let url = URL(string: UIApplication.openSettingsURLString)!
            return Alert(title: title, message: message,
                         primaryButton: .default(Text("Settings"), action: { [weak self] in
                            self?.openURL(url)
                         }),
                         secondaryButton: .default(Text("Close")))
            
        case .none:
            return Alert(title: Text("An unexpected error has occurred."))
        }
    }
}
