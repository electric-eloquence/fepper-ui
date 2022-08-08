export default class PatternFinder {
  constructor(fepperUi) {
    this.patternFinder = fepperUi.patternFinder;
    this.$orgs = fepperUi.requerio.$orgs;
  }

  listen() {
    // e2e test this by triggering the pattern to postMessage to be received here.
    window.addEventListener('message', this.patternFinder.receiveIframeMessage, false);

    const Mousetrap = window.Mousetrap;

    // These items are dynamically loaded, not hard-coded in public/index.html.
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
