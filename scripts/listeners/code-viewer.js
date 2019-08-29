// Be sure to e2e test listeners.

export default class {
  constructor(fepperUi) {
    this.$orgs = fepperUi.requerio.$orgs;
    this.uiData = fepperUi.uiData;
    this.uiFns = fepperUi.uiFns;
    this.uiProps = fepperUi.uiProps;
    this.codeViewer = fepperUi.codeViewer;
  }

  listen() {
    // e2e test this by triggering the pattern to postMessage to be received here.
    window.addEventListener('message', this.codeViewer.receiveIframeMessage);

    document.addEventListener('DOMContentLoaded', () => {
      this.$orgs['#sg-code-container'].dispatchAction('css', 'bottom'); // Set this measurement in state.

      // Make sure the close button handles the click.
      this.$orgs['#sg-code-close-btn'].on('click', (e) => {
        e.preventDefault();

        this.codeViewer.closeCode();
      });

      // Make sure the click events are handled on the HTML tab.
      this.$orgs['#sg-code-title-html'].on('click', (e) => {
        e.preventDefault();

        this.codeViewer.swapCode('e');
      });

      // Make sure the click events are handled on the Mustache tab.
      this.$orgs['#sg-code-title-mustache'].on('click', (e) => {
        e.preventDefault();

        this.codeViewer.swapCode('m');
      });
    });

    const Mousetrap = window.Mousetrap;

    // Toggle the code panel.
    Mousetrap.bind('ctrl+shift+c', (e) => {
      this.codeViewer.toggleCode();

      e.preventDefault();
      return false;
    });

    // When the code panel is open hijack, cmd+a/ctrl+a so that it only selects the code view.
    // Can't e2e test selection.
    Mousetrap.bind('mod+a', (e) => {
      if (this.codeViewer.codeActive) {
        this.codeViewer.selectCode();

        e.preventDefault();
        return false;
      }
    });

    // Select the mustache tab.
    // ctrl+shift+u is a Pattern Lab convention.
    Mousetrap.bind(['ctrl+alt+m', 'ctrl+shift+u'], (e) => {
      this.codeViewer.swapCode('m');

      e.preventDefault();
      return false;
    });

    // Select the html tab.
    // ctrl+shift+y is a Pattern Lab convention.
    Mousetrap.bind(['ctrl+alt+h', 'ctrl+shift+y'], (e) => {
      this.codeViewer.swapCode('e');

      e.preventDefault();
      return false;
    });
  }
}
