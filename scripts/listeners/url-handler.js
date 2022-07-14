export default class UrlHandler {
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
