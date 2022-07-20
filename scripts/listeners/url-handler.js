export default class UrlHandler {
  constructor(fepperUi) {
    this.codeViewer = fepperUi.codeViewer;
    this.$orgs = fepperUi.requerio.$orgs;
    this.uiData = fepperUi.uiData;
    this.uiFns = fepperUi.uiFns;
    this.urlHandler = fepperUi.urlHandler;
  }

  listen() {
    window.onpopstate = (e) => {
      this.urlHandler.skipBack = true;
      this.urlHandler.popPattern(e);
    };

    this.$orgs['#sg-viewport'].on('load', () => {
      const patternPartial =
        this.uiFns.getPatternPartialFromURL(this.$orgs['#sg-viewport'][0].contentWindow.location.href);

      if (patternPartial) {
        this.codeViewer.setPanelContent('feplet', patternPartial);
        this.codeViewer.setPanelContent('markdown', patternPartial);
      }
    });
  }
}
