import UIKit
import WebKit
import Combine

// Contrôleur de vue pour afficher une WebView et gérer ScratchLink
public class ScratchWebViewController: WebViewController {
    
    public weak var delegate: ScratchWebViewControllerDelegate?  // Délégué pour gérer les événements de la vue
    private let scratchLink = ScratchLink()  // Instance de ScratchLink pour gérer la connexion
    private var downloadingUrl: URL?  // URL du fichier en cours de téléchargement
    
    private var cancellables: Set<AnyCancellable> = []  // Set pour stocker les abonnements Combine
    private var sizeConstraints: [NSLayoutConstraint] = []  // Contrainte pour ajuster la taille de la WebView
    
    // Initialisation par défaut du contrôleur
    public override init() {
        super.init()
        scratchLink.setup(webView: webView)  // Configuration de ScratchLink avec la WebView
        scratchLink.delegate = self  // Définir le délégué pour ScratchLink
    }
    
    // Initialisation avec un NSCoder (non implémentée ici)
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    // Configuration de la vue avec une WebView et ses contraintes
    public override func loadView() {
        self.view = WKWebView(frame: .zero)  // Initialisation de la WebView
        
        webView.translatesAutoresizingMaskIntoConstraints = false  // Désactiver les contraintes automatiques
        view.addSubview(webView)  // Ajouter la WebView à la vue principale
        
        // Activer les contraintes pour centrer la WebView
        NSLayoutConstraint.activate([
            webView.centerXAnchor.constraint(equalTo: view.centerXAnchor),
            webView.centerYAnchor.constraint(equalTo: view.centerYAnchor),
        ])
        
        updateSizeConstraints(multiplier: 1)  // Mise à jour des contraintes de taille
    }
    
    // Méthode appelée lorsque la vue est chargée
    public override func viewDidLoad() {
        super.viewDidLoad()
    
        webView.navigationDelegate = self  // Définir le délégué de navigation de la WebView
        webView.scrollView.contentInsetAdjustmentBehavior = .never  // Désactiver les ajustements automatiques de la scrollView
    }
    
    // Méthode appelée juste avant la mise en page de la vue
    public override func viewWillLayoutSubviews() {
        let multiplier = max(1.0, 1024.0 / view.bounds.width)  // Calculer le multiplicateur pour ajuster la taille
        updateSizeConstraints(multiplier: multiplier)  // Mise à jour des contraintes de taille
        webView.transform = CGAffineTransform(scaleX: 1.0 / multiplier, y: 1.0 / multiplier)  // Redimensionner la WebView
    }
    
    // Mise à jour des contraintes de taille de la WebView
    private func updateSizeConstraints(multiplier: CGFloat) {
        NSLayoutConstraint.deactivate(sizeConstraints)  // Désactiver les contraintes existantes
        sizeConstraints = [
            webView.widthAnchor.constraint(equalTo: view.widthAnchor, multiplier: multiplier),
            webView.heightAnchor.constraint(equalTo: view.heightAnchor, multiplier: multiplier),
        ]
        NSLayoutConstraint.activate(sizeConstraints)  // Activer les nouvelles contraintes
    }
    
    
    // Méthode pour modifier le style de la WebView (désactiver la sélection et les menus contextuels)
    private func changeWebViewStyle() {
        webView.evaluateJavaScript("document.documentElement.style.webkitUserSelect='none'")
        webView.evaluateJavaScript("document.documentElement.style.webkitTouchCallout='none'")
    }
}

// Extension pour gérer les événements de navigation de la WebView
extension ScratchWebViewController: WKNavigationDelegate {
    
    // Autoriser la navigation pour toute requête
    public func webView(_ webView: WKWebView, decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
        decisionHandler(.allow)
    }
    
    // Méthode pour gérer les permissions de capture (iOS 15.0+)
    @available(iOS 15.0, *)
    public func webView(_ webView: WKWebView, decideMediaCapturePermissionsFor origin: WKSecurityOrigin, initiatedBy frame: WKFrameInfo, type: WKMediaCaptureType) async -> WKPermissionDecision {
        return .grant  // Accorder les permissions de capture
    }
    
    // Méthode pour gérer les téléchargements (iOS 14.5+)
    @available(iOS 14.5, *)
    public func webView(_ webView: WKWebView, navigationAction: WKNavigationAction, didBecome download: WKDownload) {
        download.delegate = self  // Définir le délégué pour gérer les téléchargements
    }
    
    // Méthode appelée lorsqu'une navigation commence (fermeture des sessions ScratchLink)
    public func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        scratchLink.closeAllSessions()  // Fermer toutes les sessions ScratchLink
    }
    
    public func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        loadFileAfterDelay()
    }
    
}

// Extension pour gérer les téléchargements via la WebView (iOS 14.5+)
extension ScratchWebViewController: WKDownloadDelegate {
    
    @available(iOS 14.5, *)
    public func download(_ download: WKDownload, decideDestinationUsing response: URLResponse, suggestedFilename: String, completionHandler: @escaping (URL?) -> Void) {
        // Définir le chemin de téléchargement temporaire pour le fichier
        let url = FileManager.default.temporaryDirectory.appendingPathComponent(suggestedFilename)
        if FileManager.default.fileExists(atPath: url.path) {
            try? FileManager.default.removeItem(atPath: url.path)  // Supprimer le fichier s'il existe déjà
        }
        downloadingUrl = url  // Stocker l'URL du fichier téléchargé
        completionHandler(url)
    }
    
    // Gestion des erreurs lors du téléchargement
    @available(iOS 14.5, *)
    public func download(_ download: WKDownload, didFailWithError error: Error, resumeData: Data?) {
        // Gestion des erreurs de téléchargement (à personnaliser)
    }
    
    // Méthode appelée lorsque le téléchargement est terminé
    @available(iOS 14.5, *)
    public func downloadDidFinish(_ download: WKDownload) {
        if let url = downloadingUrl {
            downloadingUrl = nil
            delegate?.didDownloadFile(at: url)  // Notifier le délégué que le fichier a été téléchargé
        }
    }
}

// Extension pour gérer les événements liés à ScratchLink
extension ScratchWebViewController: ScratchLinkDelegate {
    
    public func canStartSession(type: SessionType) -> Bool {
        return delegate?.canStartScratchLinkSession(type: type) ?? true  // Vérifie si une session peut démarrer
    }
    
    public func didStartSession(type: SessionType) {
        delegate?.didStartScratchLinkSession(type: type)  // Notifie le délégué que la session a démarré
    }
    
    public func didFailStartingSession(type: SessionType, error: SessionError) {
        delegate?.didFailStartingScratchLinkSession(type: type, error: error)  // Notifie le délégué en cas d'échec
    }
}

// Protocole pour le délégué de ScratchWebViewController
public protocol ScratchWebViewControllerDelegate: AnyObject {
    func didDownloadFile(at url: URL)  // Méthode appelée lorsque le fichier est téléchargé
    func canStartScratchLinkSession(type: SessionType) -> Bool  // Méthode pour vérifier si une session peut démarrer
    func didStartScratchLinkSession(type: SessionType)  // Méthode appelée lorsque la session démarre
    func didFailStartingScratchLinkSession(type: SessionType, error: SessionError)  // Méthode appelée en cas d'échec
}
