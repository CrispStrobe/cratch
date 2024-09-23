import SwiftUI

// La vue principale de l'application
struct MainView: View {
    
    // @StateObject permet de créer une instance d'AlertController qui sera observée pour réagir à ses changements
    @StateObject private var alertController = AlertController()

    // Corps de la vue principale
    var body: some View {
            // WebView est ajouté
            WebView()
                // On transmet alertController comme un objet d'environnement pour que les sous-vues puissent y accéder
                .environmentObject(alertController)
                // On ignore les zones de sécurité pour afficher la vue sur toute la largeur et le bas de l'écran
                .edgesIgnoringSafeArea([.bottom, .horizontal])
                // Cache la barre de statut (en haut de l'écran) pour cette vue
                .statusBar(hidden: true)
    }
}

// Une vue de prévisualisation pour voir à quoi ressemblera MainView dans l'éditeur
struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        MainView()
    }
}


