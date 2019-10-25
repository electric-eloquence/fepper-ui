// Be sure to e2e test listeners.

export default class {
  constructor(fepperUi) {
    this.$orgs = fepperUi.requerio.$orgs;
    this.closeFinder = fepperUi.patternFinder.closeFinder;
    this.patternFinder = fepperUi.patternFinder;
  }

  listen() {
    // e2e test this by triggering the pattern to postMessage to be received here.
    window.addEventListener('message', this.patternFinder.receiveIframeMessage, false);

    const Mousetrap = window.Mousetrap;

    document.addEventListener('DOMContentLoaded', () => {
      Mousetrap(this.$orgs['#typeahead'][0]).bind('ctrl+shift+f', (e) => {
        this.patternFinder.toggleFinder();

        e.preventDefault();
        return false;
      });

      Mousetrap(this.$orgs['#typeahead'][0]).bind('esc', () => {
        this.patternFinder.closeFinder();
      });
    });

    Mousetrap.bind('ctrl+shift+f', (e) => {
      this.patternFinder.toggleFinder();

      e.preventDefault();
      return false;
    });
  }
}
