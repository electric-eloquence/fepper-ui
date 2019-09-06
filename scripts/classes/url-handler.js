let root;

export default class {

  /**
   * URL Handler convenience methods.
   *
   * @param {object} fepperUi - The Fepper UI instance.
   * @param {object} root - `global` or `window`.
   */
  constructor(fepperUi, root_) {
    root = root_;
    this.$orgs = fepperUi.requerio.$orgs;
    this.patternPaths = fepperUi.uiData.patternPaths;
    this.skipBack = false;
    this.uiFns = fepperUi.uiFns;
    this.uiProps = fepperUi.uiProps;
  }

  /**
   * Get the URL to display a pattern in the viewer. Use this to replace the existing URL in the browser address bar.
   *
   * @param {string} patternPartial - The shorthand partials syntax for a given pattern.
   * @returns {string} URL
   */
  getAddressReplacement(patternPartial) {
    const searchParam = '?p=' + patternPartial;
    let addressReplacement;

    if (root.location.protocol === 'file:') {
      addressReplacement = root.location.href.split('?')[0] + searchParam;
    }
    else {
      addressReplacement = root.location.protocol + '//' + root.location.host +
        root.location.pathname.replace('index.html', '') + searchParam;
    }

    return addressReplacement;
  }

  /**
   * Get query string search params for a particular item.
   *
   * @returns {object} An object containing to keys and values of window.location.search.
   */
  getSearchParams() {
    const paramsObj = {};
    const paramsItr = new URLSearchParams(root.location.search);

    for (let param of paramsItr) {
      paramsObj[param[0]] = param[1];
    }

    return paramsObj;
  }

  /**
   * On a click forward or backward, modify the url and iframe source.
   *
   * @param {object} event - Event info like state and properties set in history.pushState().
   */
  popPattern(event) {
    const state = event.state;
    let patternPartial = '';

    if (state && state.pattern) {
      patternPartial = state.pattern;
    }
    else {
      this.skipBack = false;

      return;
    }

    const iframePath = this.patternPaths[patternPartial];
    const obj = {event: 'patternlab.updatePath', path: iframePath};
    const pParam = this.getSearchParams().p;

    if (pParam && pParam !== patternPartial) {
      const addressReplacement = this.getAddressReplacement(patternPartial);

      root.history.replaceState(state, null, addressReplacement);
    }

    this.uiFns.updatePatternInfo(patternPartial, iframePath);
    this.$orgs['#sg-viewport'][0].contentWindow.postMessage(obj, this.uiProps.targetOrigin);
  }

  /**
   * Push a pattern onto the current history based on a click.
   *
   * @param {string} patternPartial - The shorthand partials syntax for a given pattern.
   */
  pushPattern(patternPartial) {
    const addressReplacement = this.getAddressReplacement(patternPartial);
    const data = {pattern: patternPartial};

    root.history.pushState(data, null, addressReplacement);
    this.uiFns.updatePatternInfo(patternPartial, this.patternPaths[patternPartial]);
  }
}