// Be sure to e2e test listeners.

// TODO: Replace closure with private class field when there is greater browser support.
export default function (fepperUiInst) {
  class ViewerHandler {
    constructor(fepperUi) {
      this.$orgs = fepperUi.requerio.$orgs;
    }

    listen() {
      document.addEventListener('DOMContentLoaded', () => {
        this.$orgs['#sg-view-btn-close'].on('click', () => {
          fepperUiInst.annotationsViewer.closeAnnotations();
          fepperUiInst.codeViewer.closeCode();
        });

        this.$orgs['#sg-view-btn-dock-right'].on('click', () => {
          fepperUiInst.viewerHandler.dockRight();
        });
      });
    }
  }

  return new ViewerHandler(fepperUiInst);
}
