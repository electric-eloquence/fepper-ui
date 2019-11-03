// Be sure to e2e test listeners.

// TODO: Replace closure with private class field when there is greater browser support.
export default function (fepperUiInst) {
  class AnnotationsViewer {
    constructor(fepperUi) {
      this.$orgs = fepperUi.requerio.$orgs;
    }

    listen() {
      // e2e test this by triggering the pattern to postMessage to be received here.
      window.addEventListener('message', fepperUiInst.annotationsViewer.receiveIframeMessage);

      document.addEventListener('DOMContentLoaded', () => {
        this.$orgs['#sg-annotations-container'].dispatchAction('css', 'bottom'); // Set this measurement in state.

        // Make sure the close button handles the click.
        this.$orgs['#sg-annotations-close-btn'].on('click', (e) => {
          e.preventDefault();

          fepperUiInst.annotationsViewer.closeAnnotations();
        });
      });

      const Mousetrap = window.Mousetrap;

      // Toggle the annotations panel.
      Mousetrap.bind('ctrl+shift+a', (e) => {
        fepperUiInst.annotationsViewer.toggleAnnotations();

        e.preventDefault();
        return false;
      });
    }
  }

  return new AnnotationsViewer(fepperUiInst);
}
