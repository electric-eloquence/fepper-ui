// Be sure to e2e test listeners.

export default class {
  constructor(fepperUi) {
    this.urlHandler = fepperUi.urlHandler;
  }

  listen() {
    window.onpopstate = (e) => {
      this.urlHandler.skipBack = true;
      this.urlHandler.popPattern(e);
    };
  }
}
