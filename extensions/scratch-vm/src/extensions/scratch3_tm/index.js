// Importation des modules nécessaires pour l'extension Scratch
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const MathUtil = require('../../util/math-util');
const log = require('../../util/log');
const ml5 = require('ml5'); // Bibliothèque ml5 pour utiliser les modèles de machine learning
const formatMessage = require('format-message');// Gestion des messages multilingues
// Icone pour l'extension
const blockIconURI = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAYAAABS3GwHAAAAmGVYSWZNTQAqAAAACAAGARIAAwAAAAEAAQAAARoABQAAAAEAAABWARsABQAAAAEAAABeASgAAwAAAAEAAgAAATEAAgAAABMAAABmh2kABAAAAAEAAAB6AAAAAAAAAEgAAAABAAAASAAAAAFQaXhlbG1hdG9yIFBybyAzLjQAAAACoAIABAAAAAEAAADAoAMABAAAAAEAAADAAAAAACpBGEYAAAAJcEhZcwAACxMAAAsTAQCanBgAAAi6aVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJYTVAgQ29yZSA2LjAuMCI+CiAgIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgICAgIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiCiAgICAgICAgICAgIHhtbG5zOlBpeGVsbWF0b3JUZWFtPSJodHRwOi8vd3d3LnBpeGVsbWF0b3IuY29tL3htcC8xLjAvbmFtZXNwYWNlIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyI+CiAgICAgICAgIDxQaXhlbG1hdG9yVGVhbTpTaWRlY2FyRGF0YVZlcnNpb24+MTwvUGl4ZWxtYXRvclRlYW06U2lkZWNhckRhdGFWZXJzaW9uPgogICAgICAgICA8UGl4ZWxtYXRvclRlYW06U2lkZWNhcldyaXRlckFwcGxpY2F0aW9uPnBpeGVsbWF0b3JQcm88L1BpeGVsbWF0b3JUZWFtOlNpZGVjYXJXcml0ZXJBcHBsaWNhdGlvbj4KICAgICAgICAgPFBpeGVsbWF0b3JUZWFtOlNpZGVjYXJXcml0ZXJEZXZpY2U+TWFjQm9va1BybzE3LDE8L1BpeGVsbWF0b3JUZWFtOlNpZGVjYXJXcml0ZXJEZXZpY2U+CiAgICAgICAgIDxQaXhlbG1hdG9yVGVhbTpTaWRlY2FyV3JpdGVyT1M+MTQuMC4wPC9QaXhlbG1hdG9yVGVhbTpTaWRlY2FyV3JpdGVyT1M+CiAgICAgICAgIDxQaXhlbG1hdG9yVGVhbTpTaWRlY2FyRW5hYmxlZD5UcnVlPC9QaXhlbG1hdG9yVGVhbTpTaWRlY2FyRW5hYmxlZD4KICAgICAgICAgPFBpeGVsbWF0b3JUZWFtOlNpZGVjYXJVVEk+Y29tLnBpeGVsbWF0b3J0ZWFtLnBpeGVsbWF0b3IuZG9jdW1lbnQtcHJvLXNpZGVjYXIuYmluYXJ5PC9QaXhlbG1hdG9yVGVhbTpTaWRlY2FyVVRJPgogICAgICAgICA8UGl4ZWxtYXRvclRlYW06U2lkZWNhcldyaXRlclBsYXRmb3JtPm1hY09TPC9QaXhlbG1hdG9yVGVhbTpTaWRlY2FyV3JpdGVyUGxhdGZvcm0+CiAgICAgICAgIDxQaXhlbG1hdG9yVGVhbTpTaWRlY2FyVmVyc2lvbj4yPC9QaXhlbG1hdG9yVGVhbTpTaWRlY2FyVmVyc2lvbj4KICAgICAgICAgPFBpeGVsbWF0b3JUZWFtOlNpZGVjYXJXcml0ZXJCdWlsZD5hN2M5ZjgyPC9QaXhlbG1hdG9yVGVhbTpTaWRlY2FyV3JpdGVyQnVpbGQ+CiAgICAgICAgIDxQaXhlbG1hdG9yVGVhbTpTaWRlY2FySWRlbnRpZmllcj4xOTZCQjA3RS1BNzg5LTREMUItQTVCQS1FNzU3RjA3NkM2NUU8L1BpeGVsbWF0b3JUZWFtOlNpZGVjYXJJZGVudGlmaWVyPgogICAgICAgICA8UGl4ZWxtYXRvclRlYW06U2lkZWNhckxvY2F0aW9uPmlDbG91ZDwvUGl4ZWxtYXRvclRlYW06U2lkZWNhckxvY2F0aW9uPgogICAgICAgICA8UGl4ZWxtYXRvclRlYW06U2lkZWNhckJhc2VGaWxlbmFtZT50bS1zbWFsbDwvUGl4ZWxtYXRvclRlYW06U2lkZWNhckJhc2VGaWxlbmFtZT4KICAgICAgICAgPFBpeGVsbWF0b3JUZWFtOlNpZGVjYXJTaG9y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';

// Déclaration des locales disponibles pour l'extension
const AvailableLocales = ['en', 'fr', 'de'];

//Traductions des textes utilisés par l'extension
const Message = {
	toggle_classification: {
		'en': 'turn classification [CLASSIFICATION_STATE]',
		'fr': 'définir la classification à [CLASSIFICATION_STATE]',
		'de': 'Klassifikation auf setzen [CLASSIFICATION_STATE]'
	},
	on: {
		'en': 'on',
		'fr': 'démarrer',
		'de': 'starten'
	},
	off: {
		'en': 'off',
		'fr': 'arrêter',
		'de': 'stoppen'
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
	offc: {
		'en': 'camera off',
		'fr': 'arrêter la caméra',
		'de': 'Stopp Kamera'
	},
	video_on_flipped: {
		'en': 'flip camera image',
		'fr': 'retourner l\'image de la caméra',
		'de': 'Kameraspiegel'
	},
	// URL du modèle de classification d'images Teachable Machine
	image_classification_model_url: {
		'en': 'TeachableMachine image classification model URL [URL]',
		'fr': 'URL du modèle de classification d\'image TeachableMachine [URL]',
		'de': 'URL des Bildklassifikationsmodells TeachableMachine [URL]'
	},
	image_classification_sample_model_url: {
		'en': 'https://teachablemachine.withgoogle.com/models/',
		'fr': 'https://teachablemachine.withgoogle.com/models/',
		'de': 'https://teachablemachine.withgoogle.com/models/'
	},
	// URL du modèle de classification sonore Teachable Machine
	sound_classification_model_url: {
		'en': 'TeachableMachine sound classification model URL [URL]',
		'fr': 'URL du modèle de classification de sons TeachableMachine [URL]',
		'de': 'URL des TeachableMachine-Modells zur Klassifizierung von Klängen [URL]'
	},
	sound_classification_sample_model_url: {
		'en': 'https://teachablemachine.withgoogle.com/models/',
		'fr': 'https://teachablemachine.withgoogle.com/models/',
		'de': 'https://teachablemachine.withgoogle.com/models/'
	},
	image_label: {
		'en': 'image label',
		'fr': 'étiquette d\'image',
		'de': 'Bildbeschriftung'

	},
	sound_label: {
		'en': 'sound label',
		'fr': 'étiquette du son',
		'de': 'Sound-Etikett'

	},
	when_received_block: {
		'en': 'when received image label:[LABEL]',
		'fr': 'quand je reçois l\'étiquette d\'image:[LABEL]',
		'de': 'wenn das Bildetikett [LABEL] empfangen wird'

	},
	is_image_label_detected: {

		'en': 'image [LABEL] detected',
		'fr': 'image [LABEL] détectée',
		'de': 'Bild [LABEL] erkannt'
	},
	is_sound_label_detected: {
		'en': 'sound [LABEL] detected',
		'fr': 'son [LABEL] détecté',
		'de': 'Ton [LABEL] entdeckt'
	},
	image_label_confidence: {
		'en': 'confidence of image [LABEL]',
		'fr': 'indice de confiance image [LABEL]',
		'de': 'Vertrauensindex Bild [LABEL]'

	},
	sound_label_confidence: {
		'en': 'confidence of sound [LABEL]',
		'fr': 'indice de confiance du son [LABEL]',
		'de': 'Vertrauensindex Ton [LABEL]'
	},
	when_received_sound_label_block: {
		'en': 'when received sound:[LABEL]',
		'fr': 'quand je détecte le son:[LABEL]',
		'de': 'wenn ich den Ton [LABEL] erkenne'
	},
	label_block: {
		'en': 'label',
		'fr': 'étiquette',
		'de': 'Etikett'
	},
	any: {
		'en': 'any',
		'fr': 'n\'importe lequel',
		'de': 'jede'
	},
	any_without_of: {
		'en': 'any',
		'fr': 'n\'importe lequel',
		'de': 'jede'
	},
	all: {
		'en': 'all',
		'fr': 'tous',
		'de': 'alle'
	},

	set_confidence_threshold: {
		'en': 'set confidence threshold [CONFIDENCE_THRESHOLD]',
		'fr': 'définir l\'indice de confiance à [CONFIDENCE_THRESHOLD]',
		'de': 'Vertrauensschwelle festlegen [CONFIDENCE_THRESHOLD]'

	},
	get_confidence_threshold: {
		'en': 'confidence threshold',
		'fr': 'indice de confiance',
		'de': 'Vertrauensschwelle'

	},
	set_classification_interval: {
		'en': 'Label once every [CLASSIFICATION_INTERVAL] seconds',
		'fr': 'étiquette une fois toutes les [CLASSIFICATION_INTERVAL] secondes',
		'de': 'alle [CLASSIFICATION_INTERVAL] Sekunden ein Etikett'
	}
};

// Définition de la classe principale pour gérer les blocs Scratch liés à Teachable Machine
class Scratch3TMBlocks {

	// Menu pour gérer l'état de la caméra vidéo
	get VIDEO_MENU() {
		return [
			'onback', 'onfront', 'video_on_flipped', 'off'
		].map(key => ({
			text: Message[key][this.locale],
			value: key
		}));
	}

	// Constructeur initialisant la classe avec les paramètres par défaut
	constructor(runtime) {
		this.runtime = runtime;
		this.locale = this.setLocale(); // Définit la langue de l'extension

		this.interval = 1000; // Intervalle pour la classification
		this.minInterval = 100; // Intervalle minimum pour la classification

		// Définition d'un minuteur pour classifier les images vidéo à des intervalles réguliers
		this.timer = setInterval(() => {
			this.classifyVideoImage();
		}, this.minInterval);

		this.imageModelUrl = null; // URL du modèle de classification d'image
		this.imageMetadata = null; // Métadonnées du modèle d'image
		this.imageClassifier = null; // Classificateur d'image
		this.initImageProbableLabels(); // Initialise les étiquettes probables pour l'image
		this.confidenceThreshold = 0.5; // Seuil de confiance par défaut

		this.soundModelUrl = null; // URL du modèle de classification sonore
		this.soundMetadata = null; // Métadonnées du modèle sonore
		this.soundClassifier = null; // Classificateur sonore
		this.soundClassifierEnabled = false; // Indique si la classification sonore est activée
		this.initSoundProbableLabels(); // Initialise les étiquettes probables pour les sons
	}

	// Initialise les étiquettes probables pour la classification d'image
	initImageProbableLabels() {
		this.imageProbableLabels = [];
	}

	// Initialise les étiquettes probables pour la classification sonore
	initSoundProbableLabels() {
		this.soundProbableLabels = [];
	}

	// Fournit les informations de l'extension pour l'intégration dans Scratch
	getInfo() {
		this.locale = this.setLocale(); // Définit la langue avant de retourner les informations

		return {
			id: 'tm',
			name: 'Teachable Machine',
			color1: '#365371',
			color2: '#0f253b',
			blockIconURI: blockIconURI,
			blocks: [{
					opcode: 'toggleClassification',
					text: Message.toggle_classification[this.locale],
					blockType: BlockType.COMMAND,
					arguments: {
						CLASSIFICATION_STATE: {
							type: ArgumentType.STRING,
							menu: 'classification_menu',
							defaultValue: 'off'
						}
					}
				},
				'---',
				'---',
				{
					opcode: 'videoToggle',
					text: Message.videoToggle[this.locale],
					blockType: BlockType.COMMAND,
					arguments: {
						VIDEO_STATE: {
							type: ArgumentType.STRING,
							menu: 'video_menu',
							defaultValue: 'onback'
						}
					}
				},
				'---',
				'---',
				{
					opcode: 'setImageClassificationModelURL',
					text: Message.image_classification_model_url[this.locale],
					blockType: BlockType.COMMAND,
					arguments: {
						URL: {
							type: ArgumentType.STRING,
							defaultValue: Message.image_classification_sample_model_url[this.locale]
						}
					}
				},
				{
					opcode: 'whenReceived',
					text: Message.when_received_block[this.locale],
					blockType: BlockType.HAT,
					arguments: {
						LABEL: {
							type: ArgumentType.STRING,
							menu: 'received_menu',
							defaultValue: Message.any[this.locale]
						}
					}
				},
				{
					opcode: 'isImageLabelDetected',
					text: Message.is_image_label_detected[this.locale],
					blockType: BlockType.BOOLEAN,
					arguments: {
						LABEL: {
							type: ArgumentType.STRING,
							menu: 'image_labels_menu',
							defaultValue: Message.any_without_of[this.locale]
						}
					}
				},
				{
					opcode: 'imageLabelConfidence',
					text: Message.image_label_confidence[this.locale],
					blockType: BlockType.REPORTER,
					disableMonitor: true,
					arguments: {
						LABEL: {
							type: ArgumentType.STRING,
							menu: 'image_labels_without_any_menu',
							defaultValue: ''
						}
					}
				},

				{
					opcode: 'getImageLabel',
					text: Message.image_label[this.locale],
					blockType: BlockType.REPORTER
				},
				'---',
				'---',
				'---',
				{
					opcode: 'setSoundClassificationModelURL',
					text: Message.sound_classification_model_url[this.locale],
					blockType: BlockType.COMMAND,
					arguments: {
						URL: {
							type: ArgumentType.STRING,
							defaultValue: Message.sound_classification_sample_model_url[this.locale]
						}
					}
				},
				{
					opcode: 'whenReceivedSoundLabel',
					text: Message.when_received_sound_label_block[this.locale],
					blockType: BlockType.HAT,
					arguments: {
						LABEL: {
							type: ArgumentType.STRING,
							menu: 'received_sound_label_menu',
							defaultValue: Message.any[this.locale]
						}
					}
				},
				{
					opcode: 'isSoundLabelDetected',
					text: Message.is_sound_label_detected[this.locale],
					blockType: BlockType.BOOLEAN,
					arguments: {
						LABEL: {
							type: ArgumentType.STRING,
							menu: 'sound_labels_menu',
							defaultValue: Message.any_without_of[this.locale]
						}
					}
				},
				{
					opcode: 'soundLabelConfidence',
					text: Message.sound_label_confidence[this.locale],
					blockType: BlockType.REPORTER,
					disableMonitor: true,
					arguments: {
						LABEL: {
							type: ArgumentType.STRING,
							menu: 'sound_labels_without_any_menu',
							defaultValue: ''
						}
					}
				},

				{
					opcode: 'getSoundLabel',
					text: Message.sound_label[this.locale],
					blockType: BlockType.REPORTER
				},
				'---',
				'---',
				'---',

				{
					opcode: 'setClassificationInterval',
					text: Message.set_classification_interval[this.locale],
					blockType: BlockType.COMMAND,
					arguments: {
						CLASSIFICATION_INTERVAL: {
							type: ArgumentType.STRING,
							menu: 'classification_interval_menu',
							defaultValue: '1'
						}
					}
				},
				{
					opcode: 'setConfidenceThreshold',
					text: Message.set_confidence_threshold[this.locale],
					blockType: BlockType.COMMAND,
					arguments: {
						CONFIDENCE_THRESHOLD: {
							type: ArgumentType.NUMBER,
							defaultValue: 0.5
						}
					}
				},
				{
					opcode: 'getConfidenceThreshold',
					text: Message.get_confidence_threshold[this.locale],
					blockType: BlockType.REPORTER,
					disableMonitor: true
				}
			],
			menus: {
				received_menu: {
					acceptReporters: true,
					items: 'getLabelsMenu'
				},
				image_labels_menu: {
					acceptReporters: true,
					items: 'getLabelsWithAnyWithoutOfMenu'
				},
				image_labels_without_any_menu: {
					acceptReporters: true,
					items: 'getLabelsWithoutAnyMenu'
				},
				received_sound_label_menu: {
					acceptReporters: true,
					items: 'getSoundLabelsWithoutBackgroundMenu'
				},
				sound_labels_menu: {
					acceptReporters: true,
					items: 'getSoundLabelsWithoutBackgroundWithAnyWithoutOfMenu'
				},
				sound_labels_without_any_menu: {
					acceptReporters: true,
					items: 'getSoundLabelsWithoutAnyMenu'
				},
				video_menu: {
					acceptReporters: true,
					items: this.VIDEO_MENU
				},
				classification_interval_menu: this.getClassificationIntervalMenu(),
				classification_menu: this.getClassificationMenu()
			}
		};
	}

	// Fonction appelée lorsque l'étiquette d'image spécifiée est reçue
	whenReceived(args) {
		const label = this.getImageLabel();
		if (args.LABEL === Message.any[this.locale]) {
			return label !== '';
		}
		return label === args.LABEL;
	}

	// Fonction appelée lorsque l'étiquette sonore spécifiée est reçue
	whenReceivedSoundLabel(args) {
		if (!this.soundClassifierEnabled) {
			return;
		}

		const label = this.getSoundLabel();
		if (args.LABEL === Message.any[this.locale]) {
			return label !== '';
		}
		return label === args.LABEL;
	}

	// Fonction pour vérifier si une étiquette est détectée pour l'image ou le son
	isLabelDetected(args, getLabelFunc) {
		const label = getLabelFunc();
		return (args.LABEL === Message.any[this.locale]) ? label !== '' : label === args.LABEL;
	}

	isImageLabelDetected(args) {
		return this.isLabelDetected(args, this.getImageLabel.bind(this));
	}

	isSoundLabelDetected(args) {
		return this.isLabelDetected(args, this.getSoundLabel.bind(this));
	}


	// Fonction pour obtenir la confiance d'une étiquette d'image
	imageLabelConfidence(args) {
		if (args.LABEL === '') {
			return 0;
		}
		const entry = this.imageProbableLabels.find(element => element.label === args.LABEL);
		return (entry ? entry.confidence : 0);
	}

	// Fonction pour obtenir la confiance d'une étiquette sonore
	soundLabelConfidence(args) {
		if (!this.soundProbableLabels || this.soundProbableLabels.length === 0) return 0;

		if (args.LABEL === '') {
			return 0;
		}
		const entry = this.soundProbableLabels.find(element => element.label === args.LABEL);
		return (entry ? entry.confidence : 0);
	}

	// Fonction pour charger un modèle de classification d'image à partir d'une URL
	setImageClassificationModelURL(args) {
		return this.loadImageClassificationModelFromURL(args.URL);
	}

	// Fonction pour charger un modèle de classification sonore à partir d'une URL
	setSoundClassificationModelURL(args) {
		return this.loadSoundClassificationModelFromURL(args.URL);
	}

	// Fonction pour charger un modèle de classification (image ou son) à partir d'une URL
	loadModelFromURL(url, type) {
		return new Promise(resolve => {
			fetch(`${url}metadata.json`)
				.then(res => res.json())
				.then(metadata => {
					const modelUrl = type === 'image' ? this.imageModelUrl : this.soundModelUrl;
					const modelMetadata = type === 'image' ? this.imageMetadata : this.soundMetadata;
					if (url === modelUrl && (new Date(metadata.timeStamp).getTime() === new Date(modelMetadata.timeStamp).getTime())) {
						log.info(`${type} model already loaded: ${url}`);
						resolve();
					} else {
						const loadFunc = type === 'image' ? ml5.imageClassifier : ml5.soundClassifier;
						loadFunc(`${url}model.json`)
							.then(classifier => {
								if (type === 'image') {
									this.imageModelUrl = url;
									this.imageMetadata = metadata;
									this.imageClassifier = classifier;
									this.initImageProbableLabels();
								} else {
									this.soundModelUrl = url;
									this.soundMetadata = metadata;
									this.soundClassifier = classifier;
									this.initSoundProbableLabels();
									this.soundClassifierEnabled = true;
									this.classifySound();
								}
								log.info(`${type} model loaded from: ${url}`);
							})
							.catch(error => log.warn(error))
							.finally(() => resolve());
					}
				})
				.catch(error => log.warn(error) || resolve());
		});
	}

	// Charge un modèle de classification d'image à partir d'une URL donnée
	loadImageClassificationModelFromURL(url) {
		return this.loadModelFromURL(url, 'image');
	}

	// Charge un modèle de classification sonore à partir d'une URL donnée
	loadSoundClassificationModelFromURL(url) {
		return this.loadModelFromURL(url, 'sound');
	}

	// Menu pour les étiquettes d'images. Retourne une liste des labels disponibles, ou 'any' s'il n'y en a pas
	getLabelsMenu() {
		let items = [Message.any[this.locale]];
		if (!this.imageMetadata) return items;
		items = items.concat(this.imageMetadata.labels);
		return items;
	}

	// Menu des étiquettes d'images incluant 'any' et 'any_without_of'
	getLabelsWithAnyWithoutOfMenu() {
		let items = [Message.any_without_of[this.locale]];
		if (!this.imageMetadata) return items;
		items = items.concat(this.imageMetadata.labels);
		return items;
	}

	// Menu pour les étiquettes sonores. Retourne une liste des labels sonores ou 'any' s'il n'y en a pas
	getSoundLabelsMenu() {
		let items = [Message.any[this.locale]];
		if (!this.soundMetadata) return items;	// Retourne 'any' si les métadonnées de sons sont absentes
		items = items.concat(this.soundMetadata.wordLabels);	 // Ajoute les étiquettes de sons disponibles
		return items;
	}

	// Retourne les étiquettes d'images sans 'any' comme option
	getLabelsWithoutAnyMenu() {
		let items = [''];	// Initialise avec une chaîne vide
		if (this.imageMetadata) {
			items = items.concat(this.imageMetadata.labels);	 // Ajoute les étiquettes disponibles si présentes
		}
		return items;
	}

	// Retourne les étiquettes sonores sans 'any' comme option
	getSoundLabelsWithoutAnyMenu() {
		if (this.soundMetadata) {
			return this.soundMetadata.wordLabels;	// Retourne les étiquettes sonores si présentes
		} else {
			return [''];	// Retourne une chaîne vide si pas de métadonnées
		}
	}

	// Retourne les étiquettes sonores sans le bruit de fond comme option
	getSoundLabelsWithoutBackgroundMenu() {
		let items = [Message.any[this.locale]];	// Inclut l'option 'any'
		if (!this.soundMetadata) return items;	// Retourne 'any' si pas de métadonnées sonores
		let arr = this.soundMetadata.wordLabels;	// Récupère les étiquettes sonores disponibles
		for (let i = 0; i < arr.length; i++) {
			if (arr[i] !== '_background_noise_') {	// Exclut le bruit de fond des options
				items.push(arr[i]);
			}
		}
		return items;
	}

	// Retourne les étiquettes sonores sans bruit de fond, avec 'any_without_of' comme option
	getSoundLabelsWithoutBackgroundWithAnyWithoutOfMenu() {
		let items = [Message.any_without_of[this.locale]];	// Inclut 'any_without_of'
		if (!this.soundMetadata) return items;
		let arr = this.soundMetadata.wordLabels;
		for (let i = 0; i < arr.length; i++) {
			if (arr[i] !== '_background_noise_') {
				items.push(arr[i]);
			}
		}
		return items;
	}

	// Retourne l'étiquette avec la confiance la plus élevée parmi les résultats probables
	getMostProbableOne(probabilities) {
		if (probabilities.length === 0) return null;	// Retourne null si aucune probabilité n'existe
		let mostOne = probabilities[0];	// Initialise avec le premier élément
		probabilities.forEach(clss => {
			if (clss.confidence > mostOne.confidence) {	// Compare et garde l'élément avec la plus haute confiance
				mostOne = clss;
			}
		});
		return mostOne;	// Retourne l'élément avec la plus haute confiance
	}

	// Fonction pour classifier une image donnée (par exemple, une vidéo)
	classifyImage(input) {
		if (!this.imageMetadata || !this.imageClassifier) {
			this._isImageClassifying = false;
			return Promise.resolve([]);	 // Si pas de modèle ou de métadonnées, retourne une promesse vide
		}
		this._isImageClassifying = true;
		return this.imageClassifier.classify(input)	 // Effectue la classification sur l'image fournie
			.then(result => {
				this.imageProbableLabels = result.slice();	// Stocke les résultats de classification
				this.imageProbableLabelsUpdated = true;	// Indique que les résultats ont été mis à jour
				return result;
			})
			.finally(() => {
				setTimeout(() => {
					 // Réinitialise les étiquettes après l'intervalle de classification
					this.initImageProbableLabels();
					this._isImageClassifying = false;
				}, this.interval);
			});
	}

	// Fonction pour classifier les sons continuellement
	classifySound() {
		this.soundClassifier.classify((err, result) => {
			if (this.soundClassifierEnabled && result) {
				this.soundProbableLabels = result.slice(); // Stocke les résultats probables
				setTimeout(() => {
					// Réinitialise les étiquettes après l'intervalle
					this.initSoundProbableLabels();
				}, this.interval);
			}
			if (err) {
				console.error(err);	// Affiche une erreur si une erreur de classification sonore se produit
			}
		});
	}

	// Retourne l'étiquette d'image avec la plus haute confiance, ou une chaîne vide si aucune n'est suffisante
	getImageLabel() {
		if (!this.imageProbableLabels || this.imageProbableLabels.length === 0) return '';	// Si pas d'étiquettes, retourne vide
		const mostOne = this.getMostProbableOne(this.imageProbableLabels);	// Obtient l'étiquette avec la confiance maximale
		return (mostOne.confidence >= this.confidenceThreshold) ? mostOne.label : '';	// Retourne l'étiquette si la confiance est assez élevée
	}

	// Retourne l'étiquette sonore avec la plus haute confiance, ou une chaîne vide si aucune n'est suffisante
	getSoundLabel() {
		if (!this.soundProbableLabels || this.soundProbableLabels.length === 0) return ''; // Si pas d'étiquettes, retourne vide
		const mostOne = this.getMostProbableOne(this.soundProbableLabels);	// Obtient l'étiquette avec la confiance maximale
		return (mostOne.confidence >= this.confidenceThreshold) ? mostOne.label : '';// Retourne l'étiquette si la confiance est assez élevée
	}

	// Définit le seuil de confiance pour la classification
	setConfidenceThreshold(args) {
		let threshold = Cast.toNumber(args.CONFIDENCE_THRESHOLD);	// Convertit l'argument en nombre
		threshold = MathUtil.clamp(threshold, 0, 1); // Limite la valeur du seuil entre 0 et 1
		this.confidenceThreshold = threshold; // Met à jour le seuil de confiance
	}

	// Retourne le seuil de confiance actuellement défini
	getConfidenceThreshold() {
		return this.confidenceThreshold;
	}

	// Fonction pour activer ou désactiver la classification d'images et de sons
	toggleClassification(args) {
		const state = args.CLASSIFICATION_STATE;
		if (this.timer) {
			clearTimeout(this.timer);
		}
		this.soundClassifierEnabled = false;
		if (state === 'on') {	

			if (!this.runtime.ioDevices.video.videoReady) {
				alert('Il faut d\'abord activer la vidéo');
			} else {
				this.video = this.runtime.ioDevices.video.provider.video;
				this.timer = setInterval(() => {
					this.classifyVideoImage();
				}, this.minInterval);
				this.soundClassifierEnabled = true;
			}
		}
	}

	// Définit l'intervalle de classification en secondes
	setClassificationInterval(args) {
		if (this.timer) {
			clearTimeout(this.timer);
		}
		this.interval = args.CLASSIFICATION_INTERVAL * 1000;
		this.timer = setInterval(() => {
			this.classifyVideoImage();
		}, this.minInterval);
	}

	// Fonction pour classifier une image de la vidéo en cours
	classifyVideoImage() {
		if (this._isImageClassifying) return Promise.resolve([]);
		return this.classifyImage(this.video);
	}

	// Menu des intervalles de classification disponibles
	getClassificationIntervalMenu() {
		return {
			acceptReporters: true,
			items: [{
					text: '1',
					value: '1'
				},
				{
					text: '0.5',
					value: '0.5'
				},
				{
					text: '0.2',
					value: '0.2'
				},
				{
					text: '0.1',
					value: '0.1'
				}
			]
		};
	}

	// Menu pour activer ou désactiver la classification
	getClassificationMenu() {
		return [{
				text: Message.off[this.locale],
				value: 'off'
			},
			{
				text: Message.on[this.locale],
				value: 'on'
			}
		];
	}

	// Fonction permettant d'activer la vidéo et de changer de caméra
	videoToggle(args) {
		switch (args.VIDEO_STATE) {
			case 'off':
				this.runtime.ioDevices.video.disableVideo();
				if (this.timer) {
					clearTimeout(this.timer);
				}
				this.soundClassifierEnabled = false;
				break;
			case 'onback':
				this.runtime.ioDevices.video.enableVideo('environment');
				this.runtime.ioDevices.video.mirror = false;
				this.active = true;
				break;
			case 'onfront':
				this.runtime.ioDevices.video.enableVideo('user');
				this.runtime.ioDevices.video.mirror = true;
				this.active = true;
				break;
			default:
				this.runtime.ioDevices.video.mirror = !this.runtime.ioDevices.video.mirror;
		}

	}

	// Fonction permettant de définir la langue de l'extension en fonction de la langue définit dans Scratch.
	// Si la traduction d'une langue n'est pas disponible dans l'extension, c'est l'anglais qui est choisi
	setLocale() {
		let locale = formatMessage.setup().locale;
		return AvailableLocales.includes(locale) ? locale : 'en';
	}
}

module.exports = Scratch3TMBlocks;