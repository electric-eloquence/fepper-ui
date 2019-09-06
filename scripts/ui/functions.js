let root;

export default class {

  /**
   * UI Functions. Various and sundry utility functions.
   * This gets instantiated before nearly everything else, so uiProps, dataSaver, etc. are undefined at instantiation.
   * Cannot attach them to `this` in the constructor. Must be accessed through this.fepperUi in the methods.
   *
   * @param {object} fepperUi - The Fepper UI instance.
   * @param {object} root - `global` or `window`.
   */
  constructor(fepperUi, root_) {
    root = root_;
    this.fepperUi = fepperUi;
    this.$orgs = fepperUi.requerio.$orgs;
  }

  /**
   * Close all panels. Remove "active" class. No params.
   */
  closeAllPanels() {
    this.$orgs['#sg-nav-target'].dispatchAction('removeClass', 'active');
    this.$orgs['.sg-acc-handle'].dispatchAction('removeClass', 'active');
    this.$orgs['.sg-acc-panel'].dispatchAction('removeClass', 'active');
  }

  /**
   * Close all but the targeted panel. Remove "active" class.
   *
   * @param {*} el - Any valid jQuery/Cheerio selector.
   */
  closeOtherPanels(el) {
    const $el = root.$(el);
    const $panel = $el.next('.sg-acc-panel');
    const $panelGrandParent = $el.parent().parent();

    // Close other panels if link isn't a subnavigation item.
    if (!$panelGrandParent.hasClass('sg-acc-panel')) {
      this.$orgs['.sg-acc-handle'].exclude($el).dispatchAction('removeClass', 'active');
      this.$orgs['.sg-acc-panel'].exclude($panel).dispatchAction('removeClass', 'active');

      // Not a nav item.
      if (!$panelGrandParent.hasClass('sg-nav')) {
        this.$orgs['#sg-nav-target'].dispatchAction('removeClass', 'active');
      }

      // Not a size label.
      if (!$el.hasClass('sg-size-label')) {
        this.$orgs['.sg-size'].dispatchAction('removeClass', 'active');
      }
    }
  }

  /**
   * Debounce user actions that might otherwise trigger too many redundant events.
   *
   * @param {function} callback - The function that needs debouncing.
   * @param {number} wait - The debounce period in milliseconds.
   * @param {object} thisArg - What will be passed as the `this` keyword by the .apply() method.
   * @returns {function} The callback set to only run if does not get called back again within the debounce period.
   */
  debounce(callback, wait = this.fepperUi.uiProps.timeoutDefault, thisArg = null) {
    let timeout = null;
    let callbackArgs = null;

    const later = () => callback.apply(thisArg, callbackArgs);

    return function () {
      callbackArgs = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Takes breakpoint configurations from customizable sources and returns a sorted object of key-value pairs.
   *
   * @param {object} FEPPER - The customizable FEPPER configuration object.
   * @returns {object} Breakpoints sorted from largest to smallest.
   */
  getBreakpointsSorted(FEPPER) {
    // Get breakpoint customations made to EITHER variables.styl or fepper-obj.js, with priority given to fepper-obj.js.
    const bpObj = {};
    const bpObjTmp = {};
    const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;

    // Iterate through `window` or `global` to check for properties set by variables.styl.
    // If found, populate the tmp object for sorting.
    // Replace -1 (or any negative value) with MAX_SAFE_INTEGER.
    for (let key in root) {
      if (key.indexOf('bp_') === 0 && key.indexOf('_max') === key.length - 4) {
        if (root[key] < 0) {
          bpObjTmp[key.slice(3, key.length - 4)] = MAX_SAFE_INTEGER;
        }
        else {
          bpObjTmp[key.slice(3, key.length - 4)] = root[key];
        }
      }
    }

    // Do same thing with fepper-obj.js, overriding any values conflicting with those in variables.styl.
    if (FEPPER.breakpoints && typeof FEPPER.breakpoints === 'object') {
      for (let key in FEPPER.breakpoints) {
        /* istanbul ignore if */
        if (typeof FEPPER.breakpoints[key].maxWidth === 'undefined') {
          continue;
        }

        if (FEPPER.breakpoints[key].maxWidth < 0) {
          bpObjTmp[key] = MAX_SAFE_INTEGER;
        }
        else {
          bpObjTmp[key] = FEPPER.breakpoints[key].maxWidth;
        }
      }
    }

    // Populate sorting array.
    const bpArr = Object.values(bpObjTmp).map(value => value);

    // Sort array from largest to smallest.
    bpArr.sort((a, b) => b - a);

    // Set gap to the distance between the 2nd and 3rd largest maxWidth breakpoints.
    // This will be added to the minWidth of the largest.
    // The sum will be the width rendered by the button for the largest.
    let gap = 0;

    if (bpArr[1] && bpArr[2]) {
      // Subtract 1 so that the default configs render the lg viewport at 1280px wide, a common screen width.
      // This variance of 1px is necessary so the sm maxWidth can be 767px and the md minWidth can be 768px.
      // The md range of 768px - 1024px accommodates many devices, and can be styled within a single media query.
      gap += bpArr[1] - bpArr[2] - 1;
    }

    let gapAdded = false;

    // Construct bpObj with sorted breakpoints.
    for (let bp of bpArr) {
      const indexOfBp = Object.values(bpObjTmp).indexOf(bp);

      if (indexOfBp > -1) {
        if (gap && !gapAdded) {
          bpObj[Object.keys(bpObjTmp)[indexOfBp]] = bpArr[1] + gap;
          gapAdded = true;
        }
        else {
          bpObj[Object.keys(bpObjTmp)[indexOfBp]] = bp;
        }
      }
    }

    return bpObj;
  }

  /**
   * Returns a random number between min and max.
   *
   * @param {number} min - Start of range.
   * @param {number} max - End of range.
   * @returns {number} Random number.
   */
  getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  /**
   * Boilerplate for receiveIframeMessage functions.
   *
   * @param {object} event - Event object.
   * @returns {object|undefined} Event data.
   */
  receiveIframeMessageBoilerplate(event) {
    // Does the origin sending the message match the current host? If not, dev/null the request.
    if (
      root.location.protocol !== 'file:' &&
      event.origin !== root.location.protocol + '//' + root.location.host
    ) {
      return;
    }

    let data = {};

    try {
      data = (typeof event.data === 'string') ? JSON.parse(event.data) : event.data;
    }
    catch (err) {
      // Fail gracefully.
    }

    return data;
  }

  /**
   * Resize the iframe.
   *
   * @param {number} size - The target size of the iframe.
   * @param {[boolean]} animate - For switching the CSS animation on or off.
   * @param {[boolean]} wholeMode - In wholeMode, the iframe will dynamically resize when #sg-rightpull is dragged.
   */
  sizeIframe(size_, animate = true, wholeMode = false) {
    /* istanbul ignore if */
    if (!size_ || typeof size_ !== 'number' || Number.isNaN(size_)) {
      return;
    }

    const uiProps = this.fepperUi.uiProps;
    const maxViewportWidth = uiProps.maxViewportWidth;
    const minViewportWidth = uiProps.minViewportWidth;
    uiProps.wholeMode = wholeMode;

    this.fepperUi.dataSaver.updateValue('wholeMode', wholeMode);

    let size;

    // If the entered size is larger than the max allowed viewport size, cap value at max vp size.
    if (size_ > maxViewportWidth) {
      size = maxViewportWidth;
    }
    // If the entered size is less than the minimum allowed viewport size, cap value at min vp size.
    else if (size_ < minViewportWidth) {
      size = minViewportWidth;
    }
    else {
      size = size_;
    }

    // Conditionally remove CSS animation class from viewport.
    if (animate === false) {
      this.$orgs['#sg-gen-container'].dispatchAction('removeClass', 'vp-animate');
      this.$orgs['#sg-viewport'].dispatchAction('removeClass', 'vp-animate');
    }
    else {
      this.$orgs['#sg-gen-container'].dispatchAction('addClass', 'vp-animate');
      this.$orgs['#sg-viewport'].dispatchAction('addClass', 'vp-animate');
    }

    // Resize viewport wrapper to desired size + size of drag resize handler.
    this.$orgs['#sg-gen-container']
      .dispatchAction('css', {width: (size + uiProps.sgRightpullWidth) + 'px'});
    // Resize viewport to desired size.
    this.$orgs['#sg-viewport'].dispatchAction('css', {width: size + 'px'});

    this.updateSizeReading(size); // Update values in toolbar.
    this.fepperUi.dataSaver.updateValue('vpWidth', size); // Save current viewport to cookie.
  }

  startDisco() {
    const uiProps = this.fepperUi.uiProps;
    uiProps.discoMode = true;

    this.stopGrow();
    this.$orgs['#sg-size-disco'].dispatchAction('focus');
    this.sizeIframe(this.getRandom(uiProps.minViewportWidth, uiProps.sw));

    uiProps.discoId = setInterval(() => {
      this.sizeIframe(this.getRandom(uiProps.minViewportWidth, uiProps.sw));
    }, 1000);
  }

  startGrow() {
    const uiProps = this.fepperUi.uiProps;
    let viewportWidth = uiProps.minViewportWidth;
    uiProps.growMode = true;

    this.stopDisco();
    this.$orgs['#sg-gen-container'].dispatchAction('removeClass', 'vp-animate');
    this.$orgs['#sg-viewport'].dispatchAction('removeClass', 'vp-animate');
    this.$orgs['#sg-size-grow'].dispatchAction('focus');
    this.sizeIframe(viewportWidth, false);

    uiProps.growId = setInterval(() => {
      if (viewportWidth < uiProps.sw) {
        viewportWidth++;

        this.sizeIframe(viewportWidth, false);
      }
      else {
        this.stopGrow();
      }
    }, 20);
  }

  stopDisco() {
    const uiProps = this.fepperUi.uiProps;
    uiProps.discoMode = false;
    uiProps.discoId = clearInterval(uiProps.discoId);

    this.$orgs['#sg-size-disco'].dispatchAction('blur');
  }

  stopGrow() {
    const uiProps = this.fepperUi.uiProps;
    uiProps.growMode = false;
    uiProps.growId = clearInterval(uiProps.growId);

    this.$orgs['#sg-size-grow'].dispatchAction('blur');
  }

  toggleDisco() {
    if (!this.fepperUi.uiProps.discoMode) {
      this.startDisco();
    }
    else {
      this.stopDisco();
    }
  }

  toggleGrow() {
    if (!this.fepperUi.uiProps.growMode) {
      this.startGrow();
    }
    else {
      this.stopGrow();
    }
  }

  /**
   * Update the document title and "Open in new window" href per pattern.
   *
   * @param {string} patternPartial - The shorthand partials syntax for a given pattern.
   * @param {string} path - The URL path to the pattern.
   */
  updatePatternInfo(patternPartial, path) {
    const uiProps = this.fepperUi.uiProps;
    const titleSplit = root.document.title.split(uiProps.titleSeparator);
    root.document.title = titleSplit[0] + uiProps.titleSeparator + patternPartial;

    this.$orgs['#sg-raw'].dispatchAction('attr', {href: path});
  }

  /**
   * Update Pixel and Em inputs.
   *
   * @param {number} size - The input number.
   * @param {[string]} unit - The type of unit: either px or em. Default is px. Accepted values are "px" and "em".
   * @param {[string]} target - What input to update.
   */
  updateSizeReading(size, unit, target) {
    const uiProps = this.fepperUi.uiProps;
    const bodyFontSize = uiProps.bodyFontSize;

    let emSize;
    let pxSize;

    if (unit === 'em') { // If size value is in em units.
      emSize = size.toFixed(2);
      pxSize = Math.round(size * bodyFontSize);
    }
    else { // If value is px or absent.
      emSize = (size / bodyFontSize).toFixed(2);
      pxSize = size;
    }

    // Empty or incorrect targets will dispatch action on both.
    if (target !== 'updateEmInput' && pxSize) {
      this.$orgs['#sg-size-px'].dispatchAction('val', pxSize.toString());
    }
    if (target !== 'updatePxInput' && emSize) {
      this.$orgs['#sg-size-em'].dispatchAction('val', emSize.toString());
    }
  }

  /**
   * Update iframe width.
   *
   * @param {number} size - The size in px.
   */
  updateViewportWidth(size) {
    this.$orgs['#sg-gen-container']
      .dispatchAction('css', {width: (size + this.fepperUi.uiProps.sgRightpullWidth) + 'px'});
    this.$orgs['#sg-viewport'].dispatchAction('css', {width: size + 'px'});
    this.updateSizeReading(size);
  }
}