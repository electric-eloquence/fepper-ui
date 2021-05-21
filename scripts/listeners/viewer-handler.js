export default class ViewerHandler {
  #fepperUi;

  constructor(fepperUi) {
    this.#fepperUi = fepperUi;

    this.$orgs = fepperUi.requerio.$orgs;
  }

  listen() {
    document.addEventListener('DOMContentLoaded', () => {
      this.$orgs['#sg-view-btn-close'].on('click', () => {
        this.#fepperUi.annotationsViewer.closeAnnotations();
        this.#fepperUi.codeViewer.closeCode();
      });

      this.$orgs['#sg-view-btn-dock-left'].on('click', () => {
        this.#fepperUi.viewerHandler.dockLeft();
      });

      this.$orgs['#sg-view-btn-dock-bottom'].on('click', () => {
        this.#fepperUi.viewerHandler.dockBottom();
      });

      this.$orgs['#sg-view-btn-dock-right'].on('click', () => {
        this.#fepperUi.viewerHandler.dockRight();
      });
    });
  }
}
