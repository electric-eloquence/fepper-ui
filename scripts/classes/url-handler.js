/**
 * URL Handler convenience methods.
 *
 * @param {object} fepperUi - The Fepper UI instance.
 * @param {object} root - `global` or `window`.
 */
export default class UrlHandler {
  #fepperUi;
  #root;

  constructor(fepperUi, root) {
    this.#fepperUi = fepperUi;
    this.#root = root;

    this.$orgs = fepperUi.requerio.$orgs;
    this.skipBack = false;
  }

  /* GETTERS for fepperUi instance props in case they are undefined at instantiation. */

  get uiData() {
    return this.#fepperUi.uiData;
  }

  get uiFns() {
    return this.#fepperUi.uiFns;
  }

  get uiProps() {
    return this.#fepperUi.uiProps;
  }

  /* METHODS */

  /**
   * Get the URL to display a pattern in the viewer. Use this to replace the existing URL in the browser address bar.
   *
   * @param {string} patternPartial - The shorthand partials syntax for a given pattern.
   * @returns {string} URL
   */
  getAddressReplacement(patternPartial) {
    const searchParam = '?p=' + patternPartial;
    let addressReplacement;

    if (this.#root.location.protocol === 'file:') {
      addressReplacement = this.#root.location.href.split('?')[0] + searchParam;
    }
    else {
      addressReplacement = this.#root.location.protocol + '//' + this.#root.location.host +
        this.#root.location.pathname.replace('index.html', '') + searchParam;
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
    const paramsItr = new URLSearchParams(this.#root.location.search);

    for (const param of paramsItr) {
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

    const iframePath = this.uiData.patternPaths[patternPartial];
    const obj = {event: 'patternlab.updatePath', path: iframePath};
    const pParam = this.getSearchParams().p;

    if (pParam && pParam !== patternPartial) {
      const addressReplacement = this.getAddressReplacement(patternPartial);

      this.#root.history.replaceState(state, null, addressReplacement);
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

    this.#root.history.pushState(data, null, addressReplacement);
    this.uiFns.updatePatternInfo(patternPartial, this.uiData.patternPaths[patternPartial]);
  }
}
