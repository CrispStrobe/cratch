const formatMessage = require('format-message');
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const Clone = require('../../util/clone');
const Timer = require('../../util/timer');
const StageLayering = require('../../engine/stage-layering');

const blockIconURI = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMjcuODM0IDlhMyAzIDAgMDEyLjU0NiAxLjQxMmwuMDk3LjE2Ny4wNTQuMTEuMDUyLjExMi4wNDguMTEyIDYuMjIyIDE2YTMuMDAxIDMuMDAxIDAgMDEtMi4yNyA0LjA0MWwtLjE4LjAyNS0uMTE1LjAxMS0uMTE2LjAwNy0uMTE1LjAwM2gtMS44NTVhMyAzIDAgMDEtMi41NDUtMS40MTJsLS4wOTYtLjE2Ny0uMTA3LS4yMjItLjA0OC0uMTExTDI4Ljk4MyAyOGgtNC45M2wtLjQyMiAxLjA4N2EzLjAwMyAzLjAwMyAwIDAxLTIuNDEgMS44ODlsLS4xOTMuMDE4LS4xOTQuMDA2LTEuOTQtLjAwMi0uMDk2LjAwMkg3YTMgMyAwIDAxLTIuODctMy44NzJsLjA3Mi0uMjA5IDYuMTgzLTE2YTMuMDAxIDMuMDAxIDAgMDEyLjYwNC0xLjkxM0wxMy4xODQgOWwzLjkuMDAxLjA5OS0uMDAxIDMuOTI0LjAwMi4wOTUtLjAwMiAzLjkwNS4wMDIuMDk1LS4wMDJoMi42MzJ6IiBmaWxsLW9wYWNpdHk9Ii4xNSIgZmlsbD0iIzAwMCIvPjxwYXRoIGQ9Ik0yNS42NjMgMjFsLjgxNi0yLjA5OS44MTYgMi4wOTloLTEuNjMyem0xMC4yNTggNi4yNzVsLTYuMjIzLTE2LS4wNzUtLjE2OC0uMDg1LS4xNDVjLS4zODctLjYxMS0xLjAxOS0uOTYyLTEuNzAzLS45NjJoLTIuNjMzbC0uMDk2LjAwMi0uMDYyLS4wMDFMMjEuMjAyIDEwbC0uMDk2LjAwMi0uMDYyLS4wMDFMMTcuMTgzIDEwbC0uMDg2LjAwMkwxMy4xODQgMTBsLS4xNjUuMDA3YTIuMDAzIDIuMDAzIDAgMDAtMS43MDIgMS4yNzJsLTYuMTgyIDE2LS4wNTkuMTc1QTIgMiAwIDAwNyAzMGgxMS43OThsLjA4OC0uMDAyIDEuOTQ5LjAwMi4xNjMtLjAwNy4xNjEtLjAxOWEyIDIgMCAwMDEuNTM5LTEuMjQ5bC42Ny0xLjcyNWg2LjI5OWwuNjcyIDEuNzI2LjA3NC4xNjcuMDg2LjE0NWMuMzg3LjYxMSAxLjAxOC45NjIgMS43MDMuOTYyaDEuODU1bC4xNzQtLjAwOS4xNjQtLjAyNGMuOTc2LS4xODcgMS42NjItMS4wMDMgMS42NjItMS45NjcgMC0uMjQ4LS4wNDYtLjQ5NC0uMTM2LS43MjV6IiBmaWxsLW9wYWNpdHk9Ii4yNSIgZmlsbD0iIzAwMCIvPjxwYXRoIGQ9Ik0xMy4xODMgMTFoMy44MThhMSAxIDAgMDEuOTQxIDEuMzM4bC01Ljc0MiAxNmExIDEgMCAwMS0uOTQuNjYySDdhMSAxIDAgMDEtLjkzMy0xLjM2bDYuMTgzLTE2YTEgMSAwIDAxLjkzMy0uNjR6IiBmaWxsPSIjNEM5N0ZGIi8+PHBhdGggZD0iTTE3LjE4MyAxMUgyMWExIDEgMCAwMS45NDIgMS4zMzhsLTUuNzQyIDE2YTEgMSAwIDAxLS45NDEuNjYyaC00LjI2YTEgMSAwIDAxLS45MzItMS4zNmw2LjE4My0xNmExIDEgMCAwMS45MzMtLjY0eiIgZmlsbD0iI0NGNjNDRiIvPjxwYXRoIGQ9Ik0yMS4yMDIgMTFIMjVhMSAxIDAgMDEuOTMzIDEuMzYxbC02LjIwMyAxNmExIDEgMCAwMS0uOTMyLjYzOUgxNWExIDEgMCAwMS0uOTMzLTEuMzYxbDYuMjAzLTE2YTEgMSAwIDAxLjkzMi0uNjM5eiIgZmlsbD0iI0ZGQkYwMCIvPjxwYXRoIGQ9Ik0yNy44MzQgMTFhMSAxIDAgMDEuOTMyLjYzOGw2LjIyMiAxNkExIDEgMCAwMTM0LjA1NiAyOWgtMS44NTRhMSAxIDAgMDEtLjkzMi0uNjM4TDMwLjM1MSAyNmgtNy42NjZsLS45MTkgMi4zNjJhMSAxIDAgMDEtLjkzMi42MzhIMTguOThhMSAxIDAgMDEtLjkzMi0xLjM2Mmw2LjIyMi0xNmExIDEgMCAwMS45MzItLjYzOHptLTEuMzE2IDUuMTQzTDI0LjI0IDIyaDQuNTU2bC0yLjI3OC01Ljg1N3oiIGZpbGw9IiNGRkYiLz48L2c+PC9zdmc+';
const menuIconURI = blockIconURI;
const DefaultText = formatMessage({
  id: 'text.defaulttext',
  default: 'Hello world !',
  description: ''
})
const DefaultAnimateText = formatMessage({
  id: 'text.defaultanimate',
  default: 'Animate this !'
})
const SANS_SERIF_ID = 'Sans Serif';
const SERIF_ID = 'Serif';
const HANDWRITING_ID = 'Handwriting';
const MARKER_ID = 'Marker';
const CURLY_ID = 'Curly';
const PIXEL_ID = 'Pixel';
const RANDOM_ID = 'Random';

const FONT_IDS = [SANS_SERIF_ID, SERIF_ID, HANDWRITING_ID, MARKER_ID, CURLY_ID, PIXEL_ID];

class Scratch3TextBlocks {
  constructor(runtime) {

    this.runtime = runtime;
    this._onTargetWillExit = this._onTargetWillExit.bind(this);
    this.runtime.on('targetWasRemoved', this._onTargetWillExit);
    this._onTargetCreated = this._onTargetCreated.bind(this);
    this.runtime.on('targetWasCreated', this._onTargetCreated);
    this.runtime.on('PROJECT_STOP_ALL', this.stopAll.bind(this));
  }

  getInfo() {
    this.setupTranslations();
    return {
      id: 'text',
      name: formatMessage({
        id: 'text.defaultname',
        default: 'Animated Text'
      }),
      color1: '#732ffa',
      color2: '#3903a3',
      blockIconURI: blockIconURI,
      menuIconURI: menuIconURI,
      blocks: [{
          opcode: 'setText',
          text: formatMessage({
            id: 'text.setText',
            "default": 'show text [TEXT]',
            description: ''
          }),
          blockType: BlockType.COMMAND,
          arguments: {
            TEXT: {
              type: ArgumentType.STRING,
              defaultValue: formatMessage({
                id: 'text.defaulttext',
                default: 'Hello world !',
                description: ''
              })
            }
          }
        }, {
          opcode: 'animateText',
          text: formatMessage({
            id: 'text.animateText',
            "default": '[ANIMATE] text [TEXT]',
            description: ''
          }),
          blockType: BlockType.COMMAND,
          arguments: {
            ANIMATE: {
              type: ArgumentType.STRING,
              menu: 'ANIMATE',
              defaultValue: 'rainbow'
            },
            TEXT: {
              type: ArgumentType.STRING,
              defaultValue: formatMessage({
                id: 'text.defaultanimate',
                default: 'Animate this !'
              })
            }
          }
        }, {
          opcode: 'clearText',
          text: formatMessage({
            id: 'text.clearText',
            "default": 'show sprite',
            description: ''
          }),
          blockType: BlockType.COMMAND,
          arguments: {}
        }, '---', {
          opcode: 'setFont',
          text: formatMessage({
            id: 'text.setFont',
            "default": 'set font to [FONT]',
            description: ''
          }),
          blockType: BlockType.COMMAND,
          arguments: {
            FONT: {
              type: ArgumentType.STRING,
              menu: 'FONT',
              defaultValue: 'Pixel'
            }
          }
        }, {
          opcode: 'setColor',
          text: formatMessage({
            id: 'text.setColor',
            "default": 'set text color to [COLOR]',
            description: ''
          }),
          blockType: BlockType.COMMAND,
          arguments: {
            COLOR: {
              type: ArgumentType.COLOR
            }
          }
        }, {
          opcode: 'setSize',
          text: formatMessage({
            id: 'text.setSize',
            default: 'set text size to [SIZE]',
            description: ''
          }),
          blockType: BlockType.COMMAND,
          arguments: {
            SIZE: {
              type: ArgumentType.NUMBER,
              defaultValue: 30
            }
          }
        },
        {
          opcode: 'setWidth',
          text: formatMessage({
            id: 'text.setWidth',
            "default": 'set width to [WIDTH] aligned [ALIGN]',
            description: ''
          }),
          blockType: BlockType.COMMAND,
          arguments: {
            WIDTH: {
              type: ArgumentType.NUMBER,
              defaultValue: 200
            },
            ALIGN: {
              type: ArgumentType.STRING,
              defaultValue: 'left',
              menu: 'ALIGN'
            }
          }
        },
        {
          opcode: 'addText',
          text: formatMessage({
            id: 'text.addText',
            default: 'add text [TEXT]',
            description: ''
          }),
          blockType: BlockType.COMMAND,
          arguments: {
            TEXT: {
              type: ArgumentType.STRING,
              defaultValue: formatMessage({
                id: 'text.moretext',
                default: 'and more !',
                description: ''
              })
            }
          }
        },
        {
          opcode: 'addLine',
          text: formatMessage({
            id: 'text.addLine',
            default: 'add line [TEXT]',
            description: ''
          }),
          blockType: BlockType.COMMAND,
          arguments: {
            TEXT: {
              type: ArgumentType.STRING,
              defaultValue: formatMessage({
                id: 'text.moreline',
                default: 'and more !',
                description: ''
              })
            }
          }
        },
        // '---',
        {
          opcode: 'setOutlineWidth',
          text: formatMessage({
            id: 'text.setOutlineWidth',
            default: 'set outline width to [WIDTH]',
            description: ''
          }),
          blockType: BlockType.COMMAND,
          arguments: {
            WIDTH: {
              type: ArgumentType.NUMBER,
              defaultValue: 1
            }
          }
        },
        {
          opcode: 'setOutlineColor',
          text: formatMessage({
            id: 'text.setOutlineColor',
            default: 'set outline color to [COLOR]',
            description: ''
          }),
          blockType: BlockType.COMMAND,
          arguments: {
            COLOR: {
              type: ArgumentType.COLOR
            }
          }
        }
      ],
      menus: {
        FONT: {
          items: [{
            text: 'Sans Serif',
            value: SANS_SERIF_ID
          }, {
            text: 'Serif',
            value: SERIF_ID
          }, {
            text: 'Handwriting',
            value: HANDWRITING_ID
          }, {
            text: 'Marker',
            value: MARKER_ID
          }, {
            text: 'Curly',
            value: CURLY_ID
          }, {
            text: 'Pixel',
            value: PIXEL_ID
          }, {
            text: 'random font',
            value: RANDOM_ID
          }]
        },
        ALIGN: {
          items: [{
            text: formatMessage({
              id: 'text.alignleft',
              default: 'left'
            }),
            value: 'left'
          }, {
            text: formatMessage({
              id: 'text.aligncenter',
              default: 'center'
            }),
            value: 'center'
          }, {
            text: formatMessage({
              id: 'text.alignright',
              default: 'right'
            }),
            value: 'right'
          }]
        },
        ANIMATE: {
          items: [{
            text: formatMessage({
              id: 'text.animtype',
              default: 'type'
            }),
            value: 'type'
          }, {
            text: formatMessage({
              id: 'text.animrainbow',
              default: 'rainbow'
            }),
            value: 'rainbow'
          }, {
            text: formatMessage({
              id: 'text.animzoom',
              default: 'zoom'
            }),
            value: 'zoom'
          }]
        }
      },
      translationMap: extensionTranslations
    };

  }
  setText(args, util) {
    var textState = this._getTextState(util.target);

    textState.text = this._formatText(args.TEXT);
    textState.visible = true;
    textState.animating = false;

    this._renderText(util.target);

    return Promise.resolve();

  }

  clearText(args, util) {
    var target = util.target;

    var textState = this._getTextState(target);

    textState.visible = false;

    textState.animating = false;
    var costume = target.getCostumes()[target.currentCostume];
    this.runtime.renderer.updateDrawableSkinId(target.drawableID, costume.skinId);

    return Promise.resolve();

  }

  stopAll() {
    var _this = this;

    this.runtime.targets.forEach(function(target) {
      _this.clearText({}, {
        target: target
      });
    });

  }
  addText(args, util) {
    var textState = this._getTextState(util.target);

    textState.text += this._formatText(args.TEXT);
    textState.visible = true;
    textState.animating = false;

    this._renderText(util.target);

    return Promise.resolve();

  }
  addLine(args, util) {
    var textState = this._getTextState(util.target);

    textState.text += "\n".concat(this._formatText(args.TEXT));
    textState.visible = true;
    textState.animating = false;

    this._renderText(util.target);

    return Promise.resolve();

  }
  setFont(args, util) {
    var textState = this._getTextState(util.target);

    if (args.FONT === RANDOM_ID) {
      textState.font = this._randomFontOtherThan(textState.font);
    } else {
      textState.font = args.FONT;
    }
    this._renderText(util.target);

  }
  _randomFontOtherThan(currentFont) {
    var otherFonts = FONT_IDS.filter(function(id) {
      return id !== currentFont;
    });
    return otherFonts[Math.floor(Math.random() * otherFonts.length)];

  }
  setColor(args, util) {
    var textState = this._getTextState(util.target);

    textState.color = args.COLOR;

    this._renderText(util.target);

  }
  setWidth(args, util) {
    var textState = this._getTextState(util.target);

    textState.maxWidth = Cast.toNumber(args.WIDTH);
    textState.align = args.ALIGN;

    this._renderText(util.target);

  }
  setSize(args, util) {
    var textState = this._getTextState(util.target);

    textState.size = Cast.toNumber(args.SIZE);

    this._renderText(util.target);

  }
  setAlign(args, util) {
    var textState = this._getTextState(util.target);

    textState.maxWidth = Cast.toNumber(args.WIDTH);
    textState.align = args.ALIGN;

    this._renderText(util.target);

  }
  setOutlineWidth(args, util) {
    var textState = this._getTextState(util.target);

    textState.strokeWidth = Cast.toNumber(args.WIDTH);

    this._renderText(util.target);

  }
  setOutlineColor(args, util) {
    var textState = this._getTextState(util.target);

    textState.strokeColor = args.COLOR;
    textState.visible = true;

    this._renderText(util.target);

  }
  _animateText(args, util) {
    var _this2 = this;

    var target = util.target;

    var textState = this._getTextState(target);

    if (textState.fullText !== null) return;

    textState.fullText = this._formatText(args.TEXT);
    textState.text = textState.fullText[0];

    textState.visible = true;
    textState.animating = true;

    this._renderText(target);

    this.runtime.requestRedraw();
    return new Promise(function(resolve) {
      var interval = setInterval(function() {
        if (textState.animating && textState.visible && textState.text !== textState.fullText) {
          textState.text = textState.fullText.substring(0, textState.text.length + 1);
        } else {
          textState.fullText = null;
          clearInterval(interval);
          resolve();
        }

        _this2._renderText(target);

        _this2.runtime.requestRedraw();
      }, 60);
    });

  }

  _zoomText(args, util) {
    var _this3 = this;

    var target = util.target;

    var textState = this._getTextState(target);

    if (textState.targetSize !== null) return;

    var timer = new Timer();
    var durationMs = Cast.toNumber(args.SECS || 0.5) * 1000;

    textState.text = this._formatText(args.TEXT);
    textState.visible = true;
    textState.animating = true;
    textState.targetSize = target.size;
    target.setSize(0);

    this._renderText(target);

    this.runtime.requestRedraw();
    timer.start();
    return new Promise(function(resolve) {
      var interval = setInterval(function() {
        var timeElapsed = timer.timeElapsed();

        if (textState.animating && textState.visible && timeElapsed < durationMs) {
          target.setSize(textState.targetSize * timeElapsed / durationMs);
        } else {
          target.setSize(textState.targetSize);
          textState.targetSize = null;
          clearInterval(interval);
          resolve();
        }

        _this3._renderText(target);

        _this3.runtime.requestRedraw();
      }, _this3.runtime.currentStepTime);
    });

  }
  animateText(args, util) {
    switch (args.ANIMATE) {
      case 'rainbow':
        return this.rainbow(args, util);

      case 'type':
        return this._animateText(args, util);

      case 'zoom':
        return this._zoomText(args, util);
    }

  }
  rainbow(args, util) {
    var _this4 = this;

    var target = util.target;

    var textState = this._getTextState(target);

    if (textState.rainbow) return;

    var timer = new Timer();
    var durationMs = Cast.toNumber(args.SECS || 2) * 1000;

    textState.text = this._formatText(args.TEXT);
    textState.visible = true;
    textState.animating = true;
    textState.rainbow = true;

    this._renderText(target);

    timer.start();
    return new Promise(function(resolve) {
      var interval = setInterval(function() {
        var timeElapsed = timer.timeElapsed();

        if (textState.animating && textState.visible && timeElapsed < durationMs) {
          textState.rainbow = true;
          target.setEffect('color', timeElapsed / -5);
        } else {
          textState.rainbow = false;
          target.setEffect('color', 0);
          clearInterval(interval);
          resolve();
        }

        _this4._renderText(target);
      }, _this4.runtime.currentStepTime);
    });

  }
  _getTextState(target) {
    var textState = target.getCustomState(Scratch3TextBlocks.STATE_KEY);

    if (!textState) {
      textState = Clone.simple(Scratch3TextBlocks.DEFAULT_TEXT_STATE);
      target.setCustomState(Scratch3TextBlocks.STATE_KEY, textState);
    }

    return textState;

  }
  _formatText(text) {
    if (text === '') return text;

    if (typeof text === 'number' && Math.abs(text) >= 0.01 && text % 1 !== 0) {
      text = text.toFixed(2);
    }

    text = Cast.toString(text);
    return text;

  }
  _renderText(target) {
    if (!this.runtime.renderer) return;

    var textState = this._getTextState(target);

    if (!textState.visible) return; // Resetting to costume is done in clear block, early return here is for clones

    textState.skinId = this.runtime.renderer.updateTextCostumeSkin(textState);
    this.runtime.renderer.updateDrawableSkinId(target.drawableID, textState.skinId);

  }
  _onTargetCreated(newTarget, sourceTarget) {
    var _this5 = this;

    if (sourceTarget) {
      var sourceTextState = sourceTarget.getCustomState(Scratch3TextBlocks.STATE_KEY);

      if (sourceTextState) {
        newTarget.setCustomState(Scratch3TextBlocks.STATE_KEY, Clone.simple(sourceTextState));
        var newTargetState = newTarget.getCustomState(Scratch3TextBlocks.STATE_KEY);

        newTargetState.skinId = null;

        newTargetState.rainbow = false;
        newTargetState.targetSize = null;
        newTargetState.fullText = null;
        newTargetState.animating = false;

        var onDrawableReady = function onDrawableReady() {
          _this5._renderText(newTarget);

          newTarget.off('EVENT_TARGET_VISUAL_CHANGE', onDrawableReady);
        };

        newTarget.on('EVENT_TARGET_VISUAL_CHANGE', onDrawableReady);
      }
    }

  }
  _onTargetWillExit(target) {
    var textState = this._getTextState(target);

    if (textState.skinId) {
      this.runtime.renderer.destroySkin(textState.skinId);
      textState.skinId = null;
    }

  }

  static get DEFAULT_TEXT_STATE() {
    return {
      skinId: null,
      text: DefaultText,
      font: 'Handwriting',
      color: 'hsla(225, 15%, 40%, 1',
      // GUI's text-primary color
      size: 24,
      maxWidth: 480,
      align: 'center',
      strokeWidth: 0,
      strokeColor: 'black',
      rainbow: false,
      visible: false,
      targetSize: null,
      fullText: null
    };
  }

  static get STATE_KEY() {
    return 'Scratch.text';

  }

  setupTranslations() {
    const localeSetup = formatMessage.setup();
    if (localeSetup && localeSetup.translations[localeSetup.locale]) {
      Object.assign(
        localeSetup.translations[localeSetup.locale],
        extensionTranslations[localeSetup.locale]
      );
    }
  }

}

const extensionTranslations = {
  'fr': {
    'text.setText': 'Afficher le texte [TEXT]',
    'text.animateText': 'Animer le texte [TEXT] avec [ANIMATE]',
    'text.clearText': 'Afficher le sprite',
    'text.setFont': 'Mettre police à [FONT]',
    'text.setColor': 'Mettre couleur du texte à [COLOR]',
    'text.setSize': 'Mettre taille du texte à [SIZE]',
    'text.setWidth': 'Mettre largeur du texte à [WIDTH] et aligner à [ALIGN]',
    'text.addText': 'Ajouter au texte [TEXT]',
    'text.addLine': 'Ajouter ligne et écrire [TEXT]',
    'text.setOutlineWidth': 'Mettre la taille du contour à [WIDTH]',
    'text.setOutlineColor': 'Mettre la couleur du contour à [COLOR]',
    'text.alignleft': 'gauche',
    'text.aligncenter': 'centre',
    'text.alignright': 'droite',
    'text.animtype': 'machine à écrire',
    'text.animrainbow': 'arc en ciel',
    'text.animzoom': 'zoom',
    'text.defaulttext': 'Planète Maths !',
    'text.defaultanimate': 'Anime ça !',
    'text.moretext': 'et encore !',
    'text.defaultname': 'Texte',
    'text.moreline': 'nouvelle ligne !'
  },
  'de': {
    'text.setText': 'Text anzeigen [TEXT]',
    'text.animateText': 'Beleben Text [TEXT] mit [ANIMATE]',
    'text.clearText': 'Sprite anzeigen',
    'text.setFont': 'setze Schriftart auf [FONT]',
    'text.setColor': 'setze Textfarbe auf [COLOR]',
    'text.setSize': 'setze Textgröße auf [SIZE]',
    'text.setWidth': 'setze Textbreite auf [WIDTH] und [ALIGN] ausrichten',
    'text.addText': 'zum Text hinzufügen [TEXT]',
    'text.addLine': 'Zeile hinzufügen und schreiben [TEXT]',
    'text.setOutlineWidth': 'setze Größe des Umrisses auf [WIDTH]',
    'text.setOutlineColor': 'setze Farbe des Umrisses auf [COLOR]',
    'text.alignleft': 'linksbündig',
    'text.aligncenter': 'zentriert',
    'text.alignright': 'rechtsbündig',
    'text.animtype': 'Schreibmaschine',
    'text.animrainbow': 'Regenbogen',
    'text.animzoom': 'vergrößern',
    'text.defaulttext': 'Hallo !',
    'text.defaultanimate': 'Beleben !',
    'text.moretext': 'und mehr !',
    'text.defaultname': 'Text',
    'text.moreline': 'neue Linie !'
  }
};

module.exports = Scratch3TextBlocks;