// Be sure to e2e test listeners.

export default class {
  constructor(fepperUi) {
    this.$orgs = fepperUi.requerio.$orgs;
    this.uiFns = fepperUi.uiFns;
    this.uiProps = fepperUi.uiProps;
    this.annotationsViewer = fepperUi.annotationsViewer;
  }

  listen() {
    // e2e test this by triggering the pattern to postMessage to be received here.
    window.addEventListener('message', this.annotationsViewer.receiveIframeMessage);

    document.addEventListener('DOMContentLoaded', () => {
      this.$orgs['#sg-annotations-container'].dispatchAction('css', 'bottom'); // Set this measurement in state.

      // Make sure the close button handles the click.
      this.$orgs['#sg-annotations-close-btn'].on('click', (e) => {
        e.preventDefault();

        const obj = {annotationsToggle: 'off'};
        this.annotationsViewer.annotationsActive = false;

        this.annotationsViewer.slideAnnotations(
          this.$orgs['#sg-annotations-container'].getState().innerHeight
        );
        this.$orgs['#sg-t-annotations'].dispatchAction('removeClass', 'active');
        this.$orgs['#sg-viewport'][0].contentWindow.postMessage(obj, this.uiProps.targetOrigin);
      });
    });

    const Mousetrap = window.Mousetrap;

    // Toggle the annotations panel.
    Mousetrap.bind('ctrl+shift+a', (e) => {
      this.annotationsViewer.toggleAnnotations();

      e.preventDefault();
      return false;
    });
  }
}
