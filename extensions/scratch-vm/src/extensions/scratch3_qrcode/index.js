// Importation des modules nécessaires pour l'extension Scratch
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const TargetType = require('../../extension-support/target-type');
const Cast = require('../../util/cast.js');
const formatMessage = require('format-message'); // Gestion des messages multilingues
const Video = require('../../io/video');
const StageLayering = require('../../engine/stage-layering');

const jsQR = require('jsqr'); //Reconnaissance de QR Code


const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+Cjxzdmcgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDgwIDgwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zOnNlcmlmPSJodHRwOi8vd3d3LnNlcmlmLmNvbS8iIHN0eWxlPSJmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MS41OyI+CiAgICA8ZyB0cmFuc2Zvcm09Im1hdHJpeCg1LjUxODIyLDAsMCwxMC45Mjg1LC02ODEuOTk4LC0xOTkuNjE0KSI+CiAgICAgICAgPHJlY3QgeD0iMTIzLjU5NCIgeT0iMTguMTY5IiB3aWR0aD0iNjYuMzEyIiBoZWlnaHQ9IjMzLjEzNyIgc3R5bGU9ImZpbGw6cmdiKDEzLDE4OSwxNDApO3N0cm9rZTpyZ2IoMTMsMTg5LDE0MCk7c3Ryb2tlLXdpZHRoOjAuMTJweDsiLz4KICAgIDwvZz4KICAgIDxnIGlkPSJBc3NvY2llciIgdHJhbnNmb3JtPSJtYXRyaXgoMC43MjQzNjIsMCwwLDAuNzI0MzYyLDUuMjgyNiw0LjY2Mzk3KSI+CiAgICAgICAgPHVzZSB4bGluazpocmVmPSIjX0ltYWdlMSIgeD0iMCIgeT0iMCIgd2lkdGg9Ijk3cHgiIGhlaWdodD0iOTdweCIvPgogICAgPC9nPgogICAgPGRlZnM+CiAgICAgICAgPGltYWdlIGlkPSJfSW1hZ2UxIiB3aWR0aD0iOTdweCIgaGVpZ2h0PSI5N3B4IiB4bGluazpocmVmPSJkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUdFQUFBQmhDQVlBQUFER0JzK2pBQUFBQ1hCSVdYTUFBQTdFQUFBT3hBR1ZLdzRiQUFBQ0hFbEVRVlI0bk8yY3kyN0RJQkFBY1pYLy85eGMzVnNWV1EzbXNjRFlucm0yQ2xpalhmQjZZZHYzZlUreWxKL1ZFeEFsSUZBQ0FDVUFVQUlBSlFCUUFnQWxBRkFDQUNVQWVKWCs0N1p0SStmeHgyY1ZKV3JNWTJWbXhyUFVWSU9NQkFCS0FGQ2NqbzVFRlY5bnBibHZFSjdEU0FDZ0JBQktBTkM4Smh3cHpZazFPYmgxYTltVDUydHllOVI2WWlRQVVBSUFKUUFJV3hObWsxc3Zqbm1kM2xCaUpBQlFBZ0IwT3FwSkt5T3FyN013RWdBb0FZQVNBSVN0Q2JPM2dibjFvbWN1SzdhelJnSUFKUUJvVGtma2JXRE4xcGJ3SEVZQ0FDVUFVQUtBalh4bXJUVmZneC9wWDR3RUFFb0FvQVFBUXhxQ2UvYmxFZmw4VkNOeHpUZzJCRjhNSlFBWThtV3RwOEpaR3VJelB1YWZqUkgxTmM5SUFLQUVBRW9BVUx3bTlPVHl6NytkTmZuT0tEbms1bE16bDZpdHNKRUFRQWtBd3Fxb1VXK1BwYW1yNXEyOGRmd2pvMUtsa1FCQUNRQ1VBQ0NzMjZMMEZUNnFpaHBWR3NtVklzN0d6R0VWOVdJb0FjQ2xQdlNYcHJ5ZVcxMW1WMnBUTWhJUUtBR0FFZ0FVcndrcmJ2N0tRYnU5cTJmOU1CSUFLQUdBRWdDZ3IxOWJjWURETTJzUFJRa0Fibm56Vnc4cnprUVlDUUNVQUVBSkFOQlg3ZVFnVk9CdC9yb1JTZ0NBVGtjMWI5TlJEV2FsNDBmT3gwZ0FvQVFBU2dCd3FadS9JaHJEem41blJlWFdTQUNnQkFCS0FIQ3A2OWRHbkRYck9adnNPZVlib1FRQTZJYmdwMkFrQUZBQ0FDVUFVQUlBSlFCUUFnQWxBRkFDQUNVQWVLV1UzcXNuOFhSK0FXQjI3clB3UXk3Q0FBQUFBRWxGVGtTdVFtQ0MiLz4KICAgIDwvZGVmcz4KPC9zdmc+Cg==';

// Définition des langues disponibles pour l'interface utilisateur
const AvailableLocales = ['en', 'fr', 'de'];

// Messages traduits pour chaque fonctionnalité du scanner QR code
const Message = {
    qrCode: {
        'en': 'QR Code',
        'fr': 'QR Code',
        'de': 'QR code'
    },
    qrStart: {
        'en': 'start scanning',
        'fr': 'commencer le scan',
        'de': 'Scannen starten'
    },
    qrStop: {
        'en': 'stop scanning',
        'fr': 'arrêter le scan',
        'de': 'Scannen beenden'
    },
    qrScanning: {
        'en': 'scanning?',
        'fr': 'scan actif ?',
        'de': 'aktiven Scan ?'
    },
    qrSetInterval: {
        'en': 'set scan interval [INTERVAL] sec',
        'fr': 'définir l\'intervalle de scan à [INTERVAL] sec',
        'de': 'Abfrageintervall einstellen [INTERVALL] sec'
    },
    qrData: {
        'en': 'data from the last QR code scanned',
        'fr': 'données du dernier code QR scanné',
        'de': 'Daten des zuletzt gescannten QR-Codes'
    },
    qrReset: {
        'en': 'reset scanned data',
        'fr': 'effacer données scannées',
        'de': 'gescannte Daten zurücksetzen'
    },
    qrSetCameraTransparency: {
        'en': 'set camera transparency to [TRANSPARENCY]',
        'fr': 'définir la transparence de la caméra à [TRANSPARENCY]'
    },
    videoToggle: {
        'en': 'turn video [VIDEO_STATE]',
        'fr': 'mettre caméra sur [VIDEO_STATE]',
        'de': 'schalte Video [VIDEO_STATE]'
    },
    onfront: {
        'en': 'front camera on',
        'fr': 'allumer caméra avant',
        'de': 'Frontkamera einschalten'
    },
    onback: {
        'en': 'back camera on',
        'fr': 'allumer caméra arrière',
        'de': 'Rückfahrkamera einschalten'
    },
    off: {
        'en': 'camera off',
        'fr': 'arrêter la caméra',
        'de': 'Stopp Kamera'
    },
    video_on_flipped: {
        'en': 'flip camera image',
        'fr': 'retourner l\'image de la caméra',
        'de': 'Kameraspiegel'
    },
};


// Valeur par défaut de l'intervalle de scan
const DefaultInterval = 300;

// Dimensions par défaut de la scène
const DefaultStageWidth = 480;
const DefaultStageHeight = 360;

// Attributs du marqueur visuel pour la détection des QR codes
const MakerAttributes = {
    color4f: [1, 0, 0, 0.7], // Rouge avec transparence de 0.7
    diameter: 4
};


// Classe utilitaire pour gérer les transformations des QR codes
class QRUtils {
    // Méthode statique pour ajuster l'emplacement du QR code selon les dimensions
    static scaleLocation(location, width, height) {
        const widthScale = DefaultStageWidth / width;
        const heightScale = DefaultStageHeight / height;
        const halfWidth = width / 2 * widthScale;

        // Retourne les coordonnées ajustées pour chaque coin du QR code
        return {
            topLeftCorner: {
                x: location.topLeftCorner.x * widthScale - halfWidth,
                y: height / 2 * heightScale - location.topLeftCorner.y * heightScale
            },
            topRightCorner: {
                x: location.topRightCorner.x * widthScale - halfWidth,
                y: height / 2 * heightScale - location.topRightCorner.y * heightScale
            },
            bottomRightCorner: {
                x: location.bottomRightCorner.x * widthScale - halfWidth,
                y: height / 2 * heightScale - location.bottomRightCorner.y * heightScale
            },
            bottomLeftCorner: {
                x: location.bottomLeftCorner.x * widthScale - halfWidth,
                y: height / 2 * heightScale - location.bottomLeftCorner.y * heightScale
            }
        };
    }

    // Méthode statique pour dessiner un carré autour du QR code
    static drawSquare(renderer, skinId, location) {
        // Dessine les lignes reliant les coins du QR code pour former un carré
        renderer.penLine(skinId, MakerAttributes, location.topLeftCorner.x, location.topLeftCorner.y, location.topRightCorner.x, location.topRightCorner.y);
        renderer.penLine(skinId, MakerAttributes, location.topRightCorner.x, location.topRightCorner.y, location.bottomRightCorner.x, location.bottomRightCorner.y);
        renderer.penLine(skinId, MakerAttributes, location.bottomRightCorner.x, location.bottomRightCorner.y, location.bottomLeftCorner.x, location.bottomLeftCorner.y);
        renderer.penLine(skinId, MakerAttributes, location.bottomLeftCorner.x, location.bottomLeftCorner.y, location.topLeftCorner.x, location.topLeftCorner.y);
    }
}



// Définition de la classe pour gérer les blocs liés au QR code dans Scratch
class Scratch3QRCodeBlocks {

    // Menu pour gérer l'état de la caméra vidéo
    get VIDEO_MENU() {
        return [
            'onback', 'onfront', 'video_on_flipped', 'off'
        ].map(key => ({
            text: Message[key][this.locale],
            value: key
        }));
    }

    // Constructeur de la classe, initialise les variables et événements
    constructor(runtime) {
        this.runtime = runtime;
        this.locale = this.setLocale(); // Définit la langue
        this._canvas = document.querySelector('canvas'); // Référence au canvas de la scène
        this._scanning = false; // Indicateur si un scan est actif
        this._interval = DefaultInterval; // Intervalle de scan par défaut
        this._data = ''; // Données du dernier code scanné
        this._binaryData = null;  // Données binaires du QR code

        // Lorsque le projet s'arrête, arrêter aussi le scan QR
        this.runtime.on('PROJECT_STOP_ALL', this.qrStop.bind(this));

        // Création d'un "skin" pour dessiner les marques
        this._penSkinId = this.runtime.renderer.createPenSkin();
        const penDrawableId = this.runtime.renderer.createDrawable(StageLayering.SPRITE_LAYER);
        this.runtime.renderer.updateDrawableProperties(penDrawableId, {
            skinId: this._penSkinId
        });
    }


    // Fournit des informations sur les blocs disponibles
    getInfo() {
        return {
            id: 'qrcode',
            name: Message.qrCode[this.locale],
            color1: '#00a4a6',
            color2: '#006a6b',
            blockIconURI: blockIconURI,
            blocks: [{
                    opcode: 'qrStart',
                    text: Message.qrStart[this.locale],
                    blockType: BlockType.COMMAND

                },
                {
                    opcode: 'qrStop',
                    text: Message.qrStop[this.locale],
                    blockType: BlockType.COMMAND
                },
                {
                    opcode: 'qrScanning',
                    text: Message.qrScanning[this.locale],
                    blockType: BlockType.BOOLEAN
                },
                '---',
                '---',
                {
                    opcode: 'videoToggle',
                    blockType: BlockType.COMMAND,
                    text: Message.videoToggle[this.locale],
                    arguments: {
                        VIDEO_STATE: {
                            type: ArgumentType.STRING,
                            menu: 'videoMenu',
                            defaultValue: 'onback'
                        }
                    }
                },
                {
                    opcode: 'setVideoTransparency',
                    text: formatMessage({
                        id: 'videoSensing.setVideoTransparency',
                        default: 'set video transparency to [TRANSPARENCY]',
                        description: 'Controls transparency of the video preview layer'
                    }),
                    arguments: {
                        TRANSPARENCY: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 50
                        }
                    }
                },
                '---',
                '---',
                {
                    opcode: 'qrSetInterval',
                    text: Message.qrSetInterval[this.locale],
                    blockType: BlockType.COMMAND,
                    arguments: {
                        INTERVAL: {
                            type: ArgumentType.NUMBER,
                            menu: 'intervalMenu',
                            defaultValue: 0.3
                        }
                    }
                },

                '---',
                '---',
                {
                    opcode: 'qrData',
                    text: Message.qrData[this.locale],
                    blockType: BlockType.REPORTER
                },

                {
                    opcode: 'qrReset',
                    text: Message.qrReset[this.locale],
                    blockType: BlockType.COMMAND
                }

            ],
            menus: {
                intervalMenu: {
                    acceptReporters: false,
                    items: ['0.3', '0.5', '1']
                },
                videoMenu: {
                    acceptReporters: true,
                    items: this.VIDEO_MENU
                },
            }
        }
    };

    // Efface les marques de QR code dessinées sur la scène
    clearMark() {
        this.runtime.renderer.penClear(this._penSkinId);
    }

    // Fonction principale qui lance le scan des QR codes
    scan(){

        if(!this._scanning ||  (!this.runtime.ioDevices.video.videoReady)){// Si le scan n'est pas actif ou la vidéo n'est pas prête on continue
            
        }
        else {
            // Récupère la frame vidéo pour analyser le QR code
        let frame = null;
        let width, height;
        frame = this.runtime.ioDevices.video.getFrame({
                format: Video.FORMAT_IMAGE_DATA,
                dimensions: Video.DIMENSIONS
            }).data;
            width = DefaultStageWidth;
            height = DefaultStageHeight;
        
            // Analyse la frame pour détecter un QR code
        const code = jsQR(frame, width, height, {
            inversionAttempts: 'dontInvert',
        });


        this.clearMark();
        if(code){
            this._data = code.data; // Enregistre les données du QR code
            this.drawMark(code.location, width, height); // Dessine une marque autour du QR code détecté
        }
    }
        setTimeout(this.scan.bind(this), this._interval); // Relance le scan après l'intervalle spécifié
    }

    // Dessine la marque sur la position du QR code détecté
    drawMark(location, width, height) {
        const scaledLocation = QRUtils.scaleLocation(location, width, height);
        QRUtils.drawSquare(this.runtime.renderer, this._penSkinId, scaledLocation);
    }


    // Décodage des données binaires du QR code
    decodeBinaryData(binaryData) {
        try {
             const encode = typeof binaryData === 'string' ? binaryData : 'UTF-8'; // Défaut à UTF-8 si non spécifié
            return new TextDecoder(encode).decode(Uint8Array.from(binaryData).buffer);
        } catch (e) {
            console.error('Erreur lors du décodage des données binaires:', e);
            return ''; // Retourne une chaîne vide en cas d'erreur
        }
    }

    // Commande pour démarrer le scan
    qrStart(args, util) {
        if (this._scanning) return; // Si le scan est déjà actif, quitter

        if (this.runtime.ioDevices.video.videoReady) {
            this.scan(); // Lance le scan
            this._scanning = true; // Indique que le scan est en cours
        } else {
            alert('Il faut d\'abord activer la vidéo'); // Message si la vidéo n'est pas active
        }
    }


    // Commande pour arrêter le scan
    qrStop(args, util) {
        if (this._scanning) {
            this.runtime.ioDevices.video.disableVideo();
            this.clearMark();
            this._scanning = false;
        }
    }

    // Commande pour définir l'intervalle de scan
    qrSetInterval(args, util) {
        this._interval = args.INTERVAL * 1000;
    }

    // Renvoie si le scan est actif ou non
    qrScanning(args, util) {
        return this._scanning;
    }

    // Renvoie les données du dernier QR code scanné
    qrData(args, util) {
        return this._data;
    }

    // Réinitialise les données scannées
    qrReset(args, util) {
        this._data = '';
        this._binaryData = null;
    }

    // Fonction permettant d'activer la vidéo et de changer de caméra
    videoToggle(args) {
        switch (args.VIDEO_STATE) {
            case 'off':
                this.runtime.ioDevices.video.disableVideo();
                break;
            case 'onback':
                this.runtime.ioDevices.video.enableVideo('environment');
                this.runtime.ioDevices.video.mirror = false;
                break;
            case 'onfront':
                this.runtime.ioDevices.video.enableVideo('user');
                this.runtime.ioDevices.video.mirror = true;
                break;
            default:
                this.runtime.ioDevices.video.mirror = !this.runtime.ioDevices.video.mirror;
        }

    }

    // Fonction permettant de changer la transparence d'affichage de la caméra sur la scène
    setVideoTransparency(args) {
        const transparency = Cast.toNumber(args.TRANSPARENCY);
        this.globalVideoTransparency = transparency;
        this.runtime.ioDevices.video.setPreviewGhost(transparency);
    }

    // Fonction permettant de définir la langue de l'extension en fonction de la langue définit dans Scratch.
    // Si la traduction d'une langue n'est pas disponible dans l'extension, c'est l'anglais qui est choisi
    setLocale() {
        let locale = formatMessage.setup().locale;
        return AvailableLocales.includes(locale) ? locale : 'en';
    }

}

module.exports = Scratch3QRCodeBlocks;