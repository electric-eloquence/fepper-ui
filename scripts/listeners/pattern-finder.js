export default class PatternFinder {
  #fepperUi;

  constructor(fepperUi) {
    this.#fepperUi = fepperUi;

    this.$orgs = fepperUi.requerio.$orgs;
  }

  listen() {
    // e2e test this by triggering the pattern to postMessage to be received here.
    window.addEventListener('message', this.#fepperUi.patternFinder.receiveIframeMessage, false);

    const Mousetrap = window.Mousetrap;

    document.addEventListener('DOMContentLoaded', () => {
      Mousetrap(this.$orgs['#typeahead'][0]).bind('ctrl+shift+f', (e) => {
        this.#fepperUi.patternFinder.toggleFinder();

        e.preventDefault();
        return false;
      });

      Mousetrap(this.$orgs['#typeahead'][0]).bind('esc', () => {
        this.#fepperUi.patternFinder.closeFinder();
      });
    });

    Mousetrap.bind('ctrl+shift+f', (e) => {
      this.#fepperUi.patternFinder.toggleFinder();

      e.preventDefault();
      return false;
    });
  }
}
