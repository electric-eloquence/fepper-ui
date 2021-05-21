export default class UrlHandler {
  #fepperUi;

  constructor(fepperUi) {
    this.#fepperUi = fepperUi;
  }

  listen() {
    window.onpopstate = (e) => {
      this.#fepperUi.urlHandler.skipBack = true;
      this.#fepperUi.urlHandler.popPattern(e);
    };
  }
}
