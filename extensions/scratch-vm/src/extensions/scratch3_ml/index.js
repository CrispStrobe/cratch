const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const log = require('../../util/log');
const ml5 = require('ml5');


let formatMessage = require('format-message');


const HAT_TIMEOUT = 100;

const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+Cjxzdmcgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDgwIDgwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zOnNlcmlmPSJodHRwOi8vd3d3LnNlcmlmLmNvbS8iIHN0eWxlPSJmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MS41OyI+CiAgICA8ZyB0cmFuc2Zvcm09Im1hdHJpeCg1LjUxODIyLDAsMCwxMC45Mjg1LC04MTguMDQ3LC0yOTIuODAyKSI+CiAgICAgICAgPHJlY3QgeD0iMTIzLjU5NCIgeT0iMTguMTY5IiB3aWR0aD0iNjYuMzEyIiBoZWlnaHQ9IjMzLjEzNyIgc3R5bGU9ImZpbGw6cmdiKDEzLDE4OSwxNDApO3N0cm9rZTpyZ2IoMTMsMTg5LDE0MCk7c3Ryb2tlLXdpZHRoOjAuMTJweDsiLz4KICAgIDwvZz4KICAgIDxwYXRoIGlkPSJ0b2lsZSIgZD0iTTQwLDVMMjcuOTM5LDI2LjM5OUwzLjg2LDMxLjI1N0wyMC40ODQsNDkuMzQxTDE3LjY2NCw3My43NDNMNDAsNjMuNTJMNjIuMzM2LDczLjc0M0w1OS41MTYsNDkuMzQxTDc2LjE0LDMxLjI1N0w1Mi4wNjEsMjYuMzk5TDQwLDVaIiBzdHlsZT0iZmlsbDp1cmwoI19MaW5lYXIxKTtmaWxsLXJ1bGU6bm9uemVybztzdHJva2U6d2hpdGU7c3Ryb2tlLXdpZHRoOjNweDtzdHJva2UtbGluZWNhcDpidXR0O3N0cm9rZS1saW5lam9pbjptaXRlcjtzdHJva2UtbWl0ZXJsaW1pdDo0OyIvPgogICAgPGcgaWQ9Ik1MIiB0cmFuc2Zvcm09Im1hdHJpeCgxLDAsMCwxLDM5LjExNzYsNTMpIj4KICAgICAgICA8dGV4dCB4PSItMTcuOTdweCIgeT0iMHB4IiBzdHlsZT0iZm9udC1mYW1pbHk6J0V1cGhlbWlhVUNBUycsICdFdXBoZW1pYSBVQ0FTJywgc2Fucy1zZXJpZjtmb250LXNpemU6MjhweDtmaWxsOndoaXRlOyI+TTx0c3BhbiB4PSIzLjUwNXB4ICIgeT0iMHB4ICI+TDwvdHNwYW4+PC90ZXh0PgogICAgPC9nPgogICAgPGRlZnM+CiAgICAgICAgPGxpbmVhckdyYWRpZW50IGlkPSJfTGluZWFyMSIgeDE9IjAiIHkxPSIwIiB4Mj0iMSIgeTI9IjAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBncmFkaWVudFRyYW5zZm9ybT0ibWF0cml4KDEzLjkzMzUsMTIuOTMzNSwtMTIuOTMzNSwxMy45MzM1LDM2LjE3MTEsMzcuMTU4NSkiPjxzdG9wIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6cmdiKDIwMiwzNCwzNCk7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOnJnYigwLDg4LDI1NSk7c3RvcC1vcGFjaXR5OjEiLz48L2xpbmVhckdyYWRpZW50PgogICAgPC9kZWZzPgo8L3N2Zz4K';

const Message = {
    toggle_classification: {
    'en': 'turn classification [CLASSIFICATION_STATE]',
    'fr': 'définir la classification sur [CLASSIFICATION_STATE]',
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
    video_toggle: {
    'en': 'turn video [VIDEO_STATE]',
    'fr': 'mettre caméra sur [VIDEO_STATE]',
    'de': 'schalte Video [VIDEO_STATE]'
  },
   onfront: {
    'en': 'front camera on',
    'fr': 'allumer caméra avant',
    'de':'Frontkamera einschalten'
  },
  onback: {
    'en': 'back camera on',
    'fr': 'allumer caméra arrière',
    'de':'Rückfahrkamera einschalten'
  },
  video_on_flipped: {
    'en': 'flip camera image',
    'fr': 'retourner l\'image de la caméra',
    'de': 'Kameraspiegel'
  },
  train: {
    'en': 'train label [LABEL]',
    'fr': 'entraîner étiquette [LABEL]',
    'de': 'Etikett trainieren [LABEL]'
  },
  first_training_warning: {
    'en': 'The first training will take a while, so do not click again and again.',
    'fr': 'Le premier entraînement prend du temps, ne pas lancer le processus une seconde fois.',
    'de': 'Das erste Training braucht Zeit, starten Sie den Prozess nicht ein zweites Mal.'
  },
  when_received_block: {
    'en': 'when received label:[LABEL]',
    'fr': 'quand je reçois l\'étiquette [LABEL]',
    'de': 'wenn ich das Etikett erhalte [LABEL]'
  },
  label_block: {
    'en': 'label',
    'fr': 'étiquette',
    'de': 'Etikett'
  },
  counts_label_1: {
    'en': 'training counts of label 1',
    'fr': 'nombre d\'entraînements pour l\'étiquette 1',
    'de': 'Trainingszählungen von Etikett 1'
  },
  counts_label_2: {
    'en': 'training counts of label 2',
    'fr': 'nombre d\'entraînements pour l\'étiquette 2',
    'de': 'Trainingszählungen von Etikett 2'
  },
  counts_label_3: {
    'en': 'training counts of label 3',
    'fr': 'nombre d\'entraînements pour l\'étiquette 3',
    'de': 'Trainingszählungen von Etikett 3'
  },
  counts_label_4: {
    'en': 'training counts of label 4',
    'fr': 'nombre d\'entraînements pour l\'étiquette 4',
    'de': 'Trainingszählungen von Etikett 4'
  },
  counts_label_5: {
    'en': 'training counts of label 5',
    'fr': 'nombre d\'entraînements pour l\'étiquette 5',
    'de': 'Trainingszählungen von Etikett 5'
  },
  counts_label_6: {
    'en': 'training counts of label 6',
    'fr': 'nombre d\'entraînements pour l\'étiquette 6',
    'de': 'Trainingszählungen von Etikett 6'
  },
  counts_label_7: {
    'en': 'training counts of label 7',
    'fr': 'nombre d\'entraînements pour l\'étiquette 7',
    'de': 'Trainingszählungen von Etikett 7'
  },
  counts_label_8: {
    'en': 'training counts of label 8',
    'fr': 'nombre d\'entraînements pour l\'étiquette 8',
    'de': 'Trainingszählungen von Etikett 8'
  },
  counts_label_9: {
    'en': 'training counts of label 9',
    'fr': 'nombre d\'entraînements pour l\'étiquette 9',
    'de': 'Trainingszählungen von Etikett 9'
  },
  counts_label_10: {
    'en': 'training counts of label 10',
    'fr': 'nombre d\'entraînements pour l\'étiquette 10',
    'de': 'Trainingszählungen von Etikett 10'
  },
  any: {
    'en': 'any',
    'fr': 'n\'importe laquelle',
    'de': 'jede'
  },
  all: {
    'en': 'all',
    'fr': 'tous',
    'de': 'alle'
  },
  reset: {
    'en': 'reset training of label:[LABEL]',
    'fr': 'supprimer l\'entraînement de l\'étiquette [LABEL]',
    'de': 'Zurücksetzen der Ausbildung des Etiketts:[LABEL]'
  },
  download_learning_data: {
    'en': 'download learning data',
    'fr': 'télécharger les données d\'entraînement',
    'de': 'Lerndaten herunterladen'
  },
  upload_learning_data: {
    'en': 'upload learning data',
    'fr': 'récupérer les données d\'entraînement',
    'de': 'Lerndaten hochladen'
  },
  upload: {
    'en': 'Upload',
    'fr': 'Récupérer',
    'de':'Hochladen'
  },
  uploaded: {
    'en': 'The upload is complete.',
    'fr': 'La récupération est terminée.',
    'de': 'Der Upload ist abgeschlossen.'
  },
  upload_instruction: {
    'en': 'Select a file and click the upload button.',
    'fr': 'Sélectionner un fichier et cliquer sur le bouton "Récupérer"',
'de': 'Wählen Sie eine Datei aus und klicken Sie auf die Schaltfläche Hochladen.'
  },
  confirm_reset: {
    'en': 'Are you sure to reset ?',
    'fr':'Etes-vous sûr de vouloir supprimer l\'entraînement ?',
    'de': 'Sind Sie sicher, dass Sie zurücksetzen wollen ?'
  },

  set_classification_interval: {
    'en': 'Label once every [CLASSIFICATION_INTERVAL] seconds',
    'fr': 'Reconnaître l\'étiquette toutes les [CLASSIFICATION_INTERVAL] secondes',
    'de': 'Etikett einmal alle [CLASSIFICATION_INTERVAL] Sekunden'
  },
   title: {
    'en': 'Machine learning',
    'fr':'Entrainement machine',
    'de':'Machine learning'
  },
  active: {
'en': 'classification activated ?',
'fr':'classification activée ?',
'de':'Klassifizierung aktiviert ?'

  },
  active_warning: {
'en':'Classification is not activated.',
'fr':'La classification n\'est pas activée.',
'de':'Die Klassifizierung ist nicht aktiviert.'


  }
}

const AvailableLocales = ['en', 'fr', 'de'];

class Scratch3MLBlocks {


  /**
   * @return {string} - the ID of this extension.
   */
  static get EXTENSION_ID() {
    return 'ml';
  }

  /**
   * URL to get this extension.
   * @type {string}
   */
  static get extensionURL() {
    return extensionURL;
  }

  /**
   * Set URL to get this extension.
   * extensionURL will be reset when the module is loaded from the web.
   * @param {string} url - URL
   */
  static set extensionURL(url) {
    extensionURL = url;
  }


  // Menu pour gérer l'état de la caméra vidéo
  get VIDEO_MENU() {
    return [
      'onback', 'onfront', 'video_on_flipped', 'off'
    ].map(key => ({
      text: Message[key][this.locale],
      value: key
    }));
  }



  constructor(runtime) {
    this.runtime = runtime;
    if (runtime.formatMessage) {
      // Replace 'formatMessage' to a formatter which is used in the runtime.
      formatMessage = runtime.formatMessage;
    }

    this.when_received = false;
    this.when_received_arr = Array(8).fill(false);
    this.label = null;
    this.locale = this.setLocale();
    this.active = false;

    this.blockClickedAt = null;

    this.counts = null;
    this.firstTraining = true;

    this.interval = 1000;
    this.globalVideoTransparency = 0;
    this.setVideoTransparency({
        TRANSPARENCY: this.globalVideoTransparency
    });

    this.canvas = document.querySelector('canvas');

    //this.runtime.ioDevices.video.enableVideo().then(() => {this.input = this.runtime.ioDevices.video.provider.video});

    this.knnClassifier = ml5.KNNClassifier();
    this.featureExtractor = ml5.featureExtractor('MobileNet', () => {
      console.log('[featureExtractor] Model Loaded!');
      this.timer = setInterval(() => {
        this.classify();
      }, this.interval);
    });
  }

  getInfo() {
    this.locale = this.setLocale();
    

    return {
      id: 'ml',
      name: Message.title[this.locale],
      blockIconURI: blockIconURI,
      blocks: [{
          opcode: 'toggleClassification',
          text: Message.toggle_classification[this.locale],
          blockType: BlockType.COMMAND,
          arguments: {
            CLASSIFICATION_STATE: {
              type: ArgumentType.STRING,
              menu: 'classification_menu',
              defaultValue: 'on'
            }
          }
        },
                                {
                    opcode: 'activated',
                    text: Message.active[this.locale],
                    blockType: BlockType.BOOLEAN
                },
        '---',
        
{
          opcode: 'videoToggle',
          text: Message.video_toggle[this.locale],
          blockType: BlockType.COMMAND,
          arguments: {
            VIDEO_STATE: {
              type: ArgumentType.STRING,
              menu: 'video_menu',
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
        {
          opcode: 'train',
          text: Message.train[this.locale],
          blockType: BlockType.COMMAND,
          arguments: {
            LABEL: {
              type: ArgumentType.STRING,
              menu: 'train_menu',
              defaultValue: '1'
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
              defaultValue: 'any'
            }
          }
        },
                 {
          opcode: 'getLabel',
          text: Message.label_block[this.locale],
          blockType: BlockType.REPORTER
        },
               '---',
        {
          opcode: 'getCountByLabel1',
          text: Message.counts_label_1[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'getCountByLabel2',
          text: Message.counts_label_2[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'getCountByLabel3',
          text: Message.counts_label_3[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'getCountByLabel4',
          text: Message.counts_label_4[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'getCountByLabel5',
          text: Message.counts_label_5[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'getCountByLabel6',
          text: Message.counts_label_6[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'getCountByLabel7',
          text: Message.counts_label_7[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'getCountByLabel8',
          text: Message.counts_label_8[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'getCountByLabel9',
          text: Message.counts_label_9[this.locale],
          blockType: BlockType.REPORTER
        },
        {
          opcode: 'getCountByLabel10',
          text: Message.counts_label_10[this.locale],
          blockType: BlockType.REPORTER
        },
                '---',
        {
          opcode: 'reset',
          blockType: BlockType.COMMAND,
          text: Message.reset[this.locale],
          arguments: {
            LABEL: {
              type: ArgumentType.STRING,
              menu: 'reset_menu',
              defaultValue: 'all'
            }
          }
        },
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
        '---',
        '---',
        {
          opcode: 'download',
          text: Message.download_learning_data[this.locale],
          blockType: BlockType.COMMAND
        },
        {
          opcode: 'upload',
          text: Message.upload_learning_data[this.locale],
          blockType: BlockType.COMMAND
        }



        

      ],
      menus: {
        received_menu: {
          items: this.getMenu('received')
        },
        reset_menu: {
          items: this.getMenu('reset')
        },
        train_menu: {
          items: this.getTrainMenu()
        },
        count_menu: {
          items: this.getTrainMenu()
        },
        video_menu: { 
          acceptReporters: false,
          items: this.VIDEO_MENU
        },
        classification_interval_menu: {
          acceptReporters: true,
          items: this.getClassificationIntervalMenu()
        },
        classification_menu: this.getClassificationMenu()
      }
    };
  }

  /**
   * The transparency setting of the video preview stored in a value
   * accessible by any object connected to the virtual machine.
   * @type {number}
   */
  get globalVideoTransparency () {
      const stage = this.runtime.getTargetForStage();
      if (stage) {
          return stage.videoTransparency;
      }
      return 50;
  }

  set globalVideoTransparency (transparency) {
      const stage = this.runtime.getTargetForStage();
      if (stage) {
          stage.videoTransparency = transparency;
      }
      return transparency;
  }

  addExample1() {
    this.firstTrainingWarning();
    let features = this.featureExtractor.infer(this.input);
    this.knnClassifier.addExample(features, '1');
    this.updateCounts();
  }

  addExample2() {
    this.firstTrainingWarning();
    let features = this.featureExtractor.infer(this.input);
    this.knnClassifier.addExample(features, '2');
    this.updateCounts();
  }

  addExample3() {
    this.firstTrainingWarning();
    let features = this.featureExtractor.infer(this.input);
    this.knnClassifier.addExample(features, '3');
    this.updateCounts();
  }

  train(args) {
    if (this.active){
    this.firstTrainingWarning();
    let features = this.featureExtractor.infer(this.input);
    this.knnClassifier.addExample(features, args.LABEL);
    this.updateCounts();
  }
  else {alert(Message.active_warning[this.locale]);}
}

  trainAny(args) {
    this.train(args);
  }

  getLabel() {
    return this.label;
  }

  whenReceived(args) {
    if (args.LABEL === 'any') {
      if (this.when_received) {
        setTimeout(() => {
            this.when_received = false;
        }, HAT_TIMEOUT);
        return true;
      }
      return false;
    } else {
      if (this.when_received_arr[args.LABEL]) {
        setTimeout(() => {
          this.when_received_arr[args.LABEL] = false;
        }, HAT_TIMEOUT);
        return true;
      }
      return false;
    }
  }

  whenReceivedAny(args) {
    return this.whenReceived(args);
  }

  getCountByLabel1() {
    if (this.counts) {
      return this.counts['1'];
    } else {
      return 0;
    }
  }

  getCountByLabel2() {
    if (this.counts) {
      return this.counts['2'];
    } else {
      return 0;
    }
  }

  getCountByLabel3() {
    if (this.counts) {
      return this.counts['3'];
    } else {
      return 0;
    }
  }

  getCountByLabel4() {
    if (this.counts) {
      return this.counts['4'];
    } else {
      return 0;
    }
  }

  getCountByLabel5() {
    if (this.counts) {
      return this.counts['5'];
    } else {
      return 0;
    }
  }

  getCountByLabel6() {
    if (this.counts) {
      return this.counts['6'];
    } else {
      return 0;
    }
  }

  getCountByLabel7() {
    if (this.counts) {
      return this.counts['7'];
    } else {
      return 0;
    }
  }

  getCountByLabel8() {
    if (this.counts) {
      return this.counts['8'];
    } else {
      return 0;
    }
  }

  getCountByLabel9() {
    if (this.counts) {
      return this.counts['9'];
    } else {
      return 0;
    }
  }

  getCountByLabel10() {
    if (this.counts) {
      return this.counts['10'];
    } else {
      return 0;
    }
  }

  getCountByLabel(args) {
    if (this.counts[args.LABEL]) {
      return this.counts[args.LABEL];
    } else {
      return 0;
    }
  }

  reset(args) {
    if (this.actionRepeated()) { return };

    setTimeout(() => {
      let result = confirm(Message.confirm_reset[this.locale]);
      if (result) {
        if (args.LABEL == 'all') {
          this.knnClassifier.clearAllLabels();
          for (let label in this.counts) {
            this.counts[label] = 0;
          }
        } else {
          if (this.counts[args.LABEL] > 0) {
            this.knnClassifier.clearLabel(args.LABEL);
            this.counts[args.LABEL] = 0;
          }
        }
      }
    }, 1000);
  }

  resetAny(args) {
    this.reset(args);
  }

  download() {
    if (this.actionRepeated()) { return };
    let fileName = String(Date.now());
    this.knnClassifier.save(fileName);
  }

  upload() {
    if (this.actionRepeated()) { return };
    let width = 480;
    let height = 200;
    let left = window.innerWidth / 2;
    let top = window.innerHeight / 2;
    let x = left - (width / 2);
    let y = top - (height / 2);
    let uploadWindow = window.open('', null, 'top=' + y + ',left=' + x + ',width=' + width + ',height=' + height);
    uploadWindow.document.open();
    uploadWindow.document.write('<html><head><title>' + Message.upload_learning_data[this.locale] + '</title></head><body style="background-color: rgb(219, 219, 219); margin-top: 30%; margin-left: 0; margin-right: 0;">');
    uploadWindow.document.write('<div style="margin-left: auto; margin-right: auto; font-size: 2em; font-family: arial; text-align: center; background-color: rgb(200, 200, 200); padding-bottom: 20px;">');
    uploadWindow.document.write('<p style="background-color: rgb(25, 94, 189); padding: 20px; overflow: hidden; color: white;">' + Message.upload_instruction[this.locale] + '</p>');
    uploadWindow.document.write('<p style="margin-left: auto; margin-right: auto; width: 40%;"><input type="file" style="font-size: 0.5em; transform: scale(2,2); padding: 20px;" id="upload-files"></p>');
    uploadWindow.document.write('<p><input type="button" style="font-size: 1.3em; border-radius: 30px; padding: 25px; background-color: rgb(19, 27, 180); color: white; border: 2px solid rgb(0, 26, 85);" value="' + Message.upload[this.locale] + '" id="upload-button"></p>');
    uploadWindow.document.write('</div></body></html>');
    uploadWindow.document.close();

    uploadWindow.document.getElementById("upload-button").onclick = () =>{
      this.uploadButtonClicked(uploadWindow);
    }
  }

  toggleClassification (args) {
    let state = args.CLASSIFICATION_STATE;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    if (state === 'on') {
     
            if (!this.runtime.ioDevices.video.videoReady){
        alert('Il faut d\'abord activer la vidéo'); }
        else {
           this.active=true;
    this.input = this.runtime.ioDevices.video.provider.video;

      this.timer = setInterval(() => {
        this.classify();
      }, this.interval);
    }}
    else {this.active=false;}
  }

  setClassificationInterval (args) {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.interval = args.CLASSIFICATION_INTERVAL * 1000;
    this.timer = setInterval(() => {
      this.classify();
    }, this.interval);
  }


    activated(args, util){
        return this.active;
    }



videoToggle (args) {
      let state = args.VIDEO_STATE;
      this.active=false;
      if (state === 'off') {
        this.runtime.ioDevices.video.disableVideo();
        this.poseNet.video = null;
      } else {
        if (state === 'onback') {  
          this.runtime.ioDevices.video.enableVideo('environment');
          this.runtime.ioDevices.video.mirror = false;
        }
        else{
        if (state === 'onfront') {
          this.runtime.ioDevices.video.enableVideo('user');
          this.runtime.ioDevices.video.mirror = true;
        }
        else{
            this.runtime.ioDevices.video.mirror = !this.runtime.ioDevices.video.mirror;
        }

      }
        

      }
    }



  /**
   * A scratch command block handle that configures the video preview's
   * transparency from passed arguments.
   * @param {object} args - the block arguments
   * @param {number} args.TRANSPARENCY - the transparency to set the video
   *   preview to
   */
  setVideoTransparency (args) {
      const transparency = Cast.toNumber(args.TRANSPARENCY);
      this.globalVideoTransparency = transparency;
      this.runtime.ioDevices.video.setPreviewGhost(transparency);
  }



  uploadButtonClicked(uploadWindow) {
    let files = uploadWindow.document.getElementById('upload-files').files;

    if (files.length <= 0) {
      uploadWindow.alert('Please select JSON file.');
      return false;
    }

    let fr = new FileReader();

    fr.onload = (e) => {
      let data = JSON.parse(e.target.result);
      this.knnClassifier.load(data, () => {
        console.log('uploaded!');

        this.updateCounts();
        alert(Message.uploaded[this.locale]);
      });
    }

    fr.onloadend = (e) => {
      uploadWindow.document.getElementById('upload-files').value = "";
    }

    fr.readAsText(files.item(0));
    uploadWindow.close();
  }

  classify() {
    let numLabels = this.knnClassifier.getNumLabels();
    if (numLabels == 0) return;

    let features = this.featureExtractor.infer(this.input);
    this.knnClassifier.classify(features, (err, result) => {
      if (err) {
        console.error(err);
      } else {
        this.label = this.getTopConfidenceLabel(result.confidencesByLabel);
        this.when_received = true;
        this.when_received_arr[this.label] = true
      }
    });
  }

  getTopConfidenceLabel(confidences) {
    let topConfidenceLabel;
    let topConfidence = 0;

    for (let label in confidences) {
      if (confidences[label] > topConfidence) {
        topConfidenceLabel = label;
      }
    }

    return topConfidenceLabel;
  }

  updateCounts() {
    this.counts = this.knnClassifier.getCountByLabel();
    console.debug(this.counts);
  }

  actionRepeated() {
    let currentTime = Date.now();
    if (this.blockClickedAt && (this.blockClickedAt + 250) > currentTime) {
      console.log('Please do not repeat trigerring this block.');
      this.blockClickedAt = currentTime;
      return true;
    } else {
      this.blockClickedAt = currentTime;
      return false;
    }
  }

  getMenu(name) {
    let arr = [];
    let defaultValue = 'any';
    let text = Message.any[this.locale];
    if (name == 'reset') {
      defaultValue = 'all';
      text = Message.all[this.locale];
    }
    arr.push({text: text, value: defaultValue});
    for(let i = 1; i <= 10; i++) {
      let obj = {};
      obj.text = i.toString(10);
      obj.value = i.toString(10);
      arr.push(obj);
    };
    return arr;
  }

  getTrainMenu() {
    let arr = [];
    for(let i = 1; i <= 10; i++) {
      let obj = {};
      obj.text = i.toString(10);
      obj.value = i.toString(10);
      arr.push(obj);
    };
    return arr;
  }


 

  getClassificationIntervalMenu() {
    return [
      {
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
  }

  getClassificationMenu() {
    return [
      {
        text: Message.off[this.locale],
        value: 'off'
      },
      {
        text: Message.on[this.locale],
        value: 'on'
      }
    ]
  }

  firstTrainingWarning() {
    if (this.firstTraining) {
      alert(Message.first_training_warning[this.locale]);
      this.firstTraining = false;
    }
  }



  setLocale() {
    let locale = formatMessage.setup().locale;
    if (AvailableLocales.includes(locale)) {
      return locale;
    } else {
      return 'en';
    }
  }
}

exports.blockClass = Scratch3MLBlocks; // loadable-extension needs this line.
module.exports = Scratch3MLBlocks;
