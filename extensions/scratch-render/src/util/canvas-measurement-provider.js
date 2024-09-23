class CanvasMeasurementProvider {
    /**
     * @param {CanvasRenderingContext2D} ctx - provides a canvas rendering context
     * with 'font' set to the text style of the text to be wrapped.
     */
    constructor (ctx) {
        this._ctx = ctx;
        this._cache = {};
         this._font = 'serif';
    this._fontSize = 14;
    }


    // We don't need to set up or tear down anything here. Should these be removed altogether?

    /**
     * Called by the TextWrapper before a batch of zero or more calls to measureText().
     */
    beginMeasurementSession () {

    }

    /**
     * Called by the TextWrapper after a batch of zero or more calls to measureText().
     */
    endMeasurementSession () {

    }

setFontAndSize(font, fontSize) {
      this._font = font;
      this._fontSize = fontSize;
      this._ctx.font = "".concat(fontSize, "px ").concat(font, ", serif");
    }
    /**
     * Measure a whole string as one unit.
     * @param {string} text - the text to measure.
     * @returns {number} - the length of the string.
     */
    measureText (text) {
        var cacheKey = "".concat(text, "-").concat(this._font, "-").concat(this._fontSize);

      if (!this._cache[cacheKey]) {
        var textMetrics = this._ctx.measureText(text);

        var width = textMetrics.actualBoundingBoxRight || textMetrics.width;
        this._cache[cacheKey] = width;
      }

      return this._cache[cacheKey];
    }
}

module.exports = CanvasMeasurementProvider;
