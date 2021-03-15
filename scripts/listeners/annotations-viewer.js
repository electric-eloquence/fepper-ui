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
      });

      const Mousetrap = window.Mousetrap;

      // Toggle the annotations panel.
      Mousetrap.bind('ctrl+shift+a', (e) => {
        fepperUiInst.annotationsViewer.toggleAnnotations();

        // If viewall, scroll to the focused pattern.
        if (fepperUiInst.annotationsViewer.viewall && fepperUiInst.annotationsViewer.annotationsActive) {
          fepperUiInst.annotationsViewer.scrollViewall();
        }

        e.preventDefault();
        return false;
      });
    }
  }

  return new AnnotationsViewer(fepperUiInst);
}
