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
    });

    // Toggle the annotations panel.
    window.Mousetrap.bind('ctrl+shift+a', (e) => {
      this.#fepperUi.annotationsViewer.toggleAnnotations();

      e.preventDefault();
      return false;
    });
  }
}
