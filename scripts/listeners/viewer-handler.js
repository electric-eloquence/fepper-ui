export default class ViewerHandler {
  constructor(fepperUi) {
    this.annotationsViewer = fepperUi.annotationsViewer;
    this.codeViewer = fepperUi.codeViewer;
    this.viewerHandler = fepperUi.viewerHandler;
    this.$orgs = fepperUi.requerio.$orgs;
  }

  listen() {
    document.addEventListener('DOMContentLoaded', () => {
      this.$orgs['#sg-view-btn-close'].on('click', () => {
        this.annotationsViewer.closeAnnotations();
        this.codeViewer.closeCode();
      });

      this.$orgs['#sg-view-btn-dock-left'].on('click', () => {
        this.viewerHandler.dockLeft();
      });

      this.$orgs['#sg-view-btn-dock-bottom'].on('click', () => {
        this.viewerHandler.dockBottom();
      });

      this.$orgs['#sg-view-btn-dock-right'].on('click', () => {
        this.viewerHandler.dockRight();
      });
    });
  }
}
