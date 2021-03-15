// Be sure to e2e test listeners.

// TODO: Replace closure with private class field when there is greater browser support.
export default function (fepperUiInst) {
  class ViewerHandler {
    constructor(fepperUi) {
      this.$orgs = fepperUi.requerio.$orgs;
    }

    listen() {
      document.addEventListener('DOMContentLoaded', () => {
        this.$orgs['#sg-view-close-btn'].on('click', (e) => {
          e.preventDefault();

          fepperUiInst.annotationsViewer.closeAnnotations();
          fepperUiInst.codeViewer.closeCode();
        });
      });
    }
  }

  return new ViewerHandler(fepperUiInst);
}
