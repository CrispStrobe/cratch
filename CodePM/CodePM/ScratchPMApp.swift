import SwiftUI
import UIKit

// Le point d'entrée principal de l'application
@main
struct CodePMApp: App {
    
    // Déclaration d'un délégué d'application pour gérer les événements spécifiques à l'application
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate
    
    // Définition du corps de l'application, qui représente la scène principale
    var body: some Scene {
        WindowGroup {
            // Affiche la vue principale et écoute les événements de type URL
            MainView().onOpenURL(perform: handleURL)
        }
    }
    
    // Fonction qui gère l'ouverture d'URL dans l'application
    func handleURL(_ url: URL) {
        // Poste une notification pour charger un fichier SB en passant l'URL reçue afin d'ouvrir un fichier sb3 ou sb2 directement dans l'application
        NotificationCenter.default.post(name: Notification.Name("LoadSBFile"), object: url)
        }
}

// Classe déléguée de l'application pour répondre aux événements du cycle de vie de l'application
class AppDelegate: UIResponder, UIApplicationDelegate {
    var window: UIWindow?
    
    // Fonction appelée lorsque l'application a fini de se lancer
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
               return true
    }
    
    
func application(_ application: UIApplication, configurationForConnecting connectingSceneSession: UISceneSession, options: UIScene.ConnectionOptions) -> UISceneConfiguration {
    return UISceneConfiguration(name: "Default Configuration", sessionRole: connectingSceneSession.role)
}

func application(_ application: UIApplication, didDiscardSceneSessions sceneSessions: Set<UISceneSession>) {
}
   
    
}
