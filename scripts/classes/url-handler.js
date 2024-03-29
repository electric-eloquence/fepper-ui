/**
 * URL Handler convenience methods.
 *
 * @param {object} fepperUi - The Fepper UI instance.
 * @param {object} root - `global` or `window`.
 */
export default class UrlHandler {
  // Private class fields.
  #fepperUi;
  #root;
  #searchParams;
  #searchString;

  constructor(fepperUi, root) {
    this.#fepperUi = fepperUi;
    this.#root = root;
    this.#searchParams = null;
    this.#searchString = null;

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
   * @returns {object} An object containing to keys and values of location.search.
   */
  getSearchParams() {
    if (this.#searchString !== this.#root.location.search) {
      this.#searchParams = {};
      this.#searchString = this.#root.location.search;

      const paramsItr = new URLSearchParams(this.#root.location.search);

      for (const param of paramsItr) {
        this.#searchParams[param[0]] = param[1];
      }
    }

    return this.#searchParams;
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
    const messageObj = {event: 'patternlab.updatePath', path: iframePath};
    const pParam = this.getSearchParams().p;

    if (pParam && pParam !== patternPartial) {
      const addressReplacement = this.getAddressReplacement(patternPartial);

      history.replaceState(state, null, addressReplacement);
    }

    this.uiFns.updatePatternInfo(patternPartial, iframePath);
    this.uiFns.updatePath(messageObj, patternPartial);
  }

  /**
   * Push a pattern onto the current history based on a click.
   *
   * @param {string} patternPartial - The shorthand partials syntax for a given pattern.
   */
  pushPattern(patternPartial) {
    const addressReplacement = this.getAddressReplacement(patternPartial);
    const data = {pattern: patternPartial};

    history.pushState(data, null, addressReplacement);
    this.uiFns.updatePatternInfo(patternPartial, this.uiData.patternPaths[patternPartial]);
  }
}
