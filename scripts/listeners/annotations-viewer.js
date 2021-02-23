export default class AnnotationsViewer {
  #fepperUi;

  constructor(fepperUi) {
    this.#fepperUi = fepperUi;

    this.$orgs = fepperUi.requerio.$orgs;
  }

  listen() {
    // e2e test this by triggering the pattern to postMessage to be received here.
    window.addEventListener('message', this.#fepperUi.annotationsViewer.receiveIframeMessage);

    document.addEventListener('DOMContentLoaded', () => {
      this.$orgs['#sg-annotations-container'].dispatchAction('css', 'bottom'); // Set this measurement in state.

      // Make sure the close button handles the click.
      this.$orgs['#sg-annotations-close-btn'].on('click', (e) => {
        e.preventDefault();

        this.#fepperUi.annotationsViewer.closeAnnotations();
      });
    });

    const Mousetrap = window.Mousetrap;

    // Toggle the annotations panel.
    Mousetrap.bind('ctrl+shift+a', (e) => {
      this.#fepperUi.annotationsViewer.toggleAnnotations();

      // If viewall, scroll to the focused pattern.
      if (this.#fepperUi.annotationsViewer.viewall && this.#fepperUi.annotationsViewer.annotationsActive) {
        this.#fepperUi.annotationsViewer.scrollViewall();
      }

      e.preventDefault();
      return false;
    });
  }
}
