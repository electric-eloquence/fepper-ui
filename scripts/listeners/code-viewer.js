export default class CodeViewer {
  #fepperUi;

  constructor(fepperUi) {
    this.#fepperUi = fepperUi;

    this.$orgs = fepperUi.requerio.$orgs;
  }

  listen() {
    // e2e test this by triggering the pattern to postMessage to be received here.
    window.addEventListener('message', this.#fepperUi.codeViewer.receiveIframeMessage);

    document.addEventListener('DOMContentLoaded', () => {
      this.$orgs['#sg-code-container'].dispatchAction('css', 'bottom'); // Set this measurement in state.

      // Make sure the close button handles the click.
      this.$orgs['#sg-code-close-btn'].on('click', (e) => {
        e.preventDefault();

        this.#fepperUi.codeViewer.closeCode();
      });

      // Make sure the click events are handled on the HTML tab.
      this.$orgs['#sg-code-title-html'].on('click', (e) => {
        e.preventDefault();

        this.#fepperUi.codeViewer.swapCode('e');
      });

      // Make sure the click events are handled on the Mustache tab.
      this.$orgs['#sg-code-title-mustache'].on('click', (e) => {
        e.preventDefault();

        this.#fepperUi.codeViewer.swapCode('m');
      });

      // Select and copy the relative path to the pattern.
      this.$orgs['#sg-code-copy-path'].on('click', () => {
        let selection;

        try {
          const range = document.createRange();
          selection = window.getSelection();

          range.selectNodeContents(this.$orgs['#sg-code-pattern-info-rel-path'][0]);
          selection.removeAllRanges();
          selection.addRange(range);
        }
        catch (err) {
          /* eslint-disable no-console */
          console.error(err);
          console.error('Selection failed!');

          return;
        }

        if (!selection) {
          return;
        }

        try {
          const copyPathState = this.$orgs['#sg-code-copy-path'].getState();
          const origMsg = this.$orgs['#sg-code-copy-path'][0].innerHTML;
          const origWidth = copyPathState.width;
          const copiedMsg = copyPathState.attribs['data-copied-msg'];

          document.execCommand('copy');

          this.$orgs['#sg-code-copy-path'].dispatchAction('width', origWidth);
          this.$orgs['#sg-code-copy-path'].dispatchAction('html', copiedMsg);

          setTimeout(() => {
            selection.removeAllRanges();
            this.$orgs['#sg-code-copy-path'].dispatchAction('html', origMsg);
          }, 5000);
        }
        catch (err) {
          console.error(err);
          console.error('Copy failed!');
          /* eslint-enable no-console */

          return;
        }
      });
    });

    const Mousetrap = window.Mousetrap;

    // Toggle the code panel.
    Mousetrap.bind('ctrl+shift+c', (e) => {
      this.#fepperUi.codeViewer.toggleCode();

      // If viewall, scroll to the focused pattern.
      if (this.#fepperUi.codeViewer.viewall && this.#fepperUi.codeViewer.codeActive) {
        this.#fepperUi.codeViewer.scrollViewall();
      }

      e.preventDefault();
      return false;
    });

    // DEPRECATED! Will be removed.
    // When the code panel is open hijack, cmd+a/ctrl+a so that it only selects the code view.
    Mousetrap.bind('mod+a', (e) => {
      if (this.#fepperUi.codeViewer.codeActive) {
        this.#fepperUi.codeViewer.selectCode();

        e.preventDefault();
        return false;
      }
    });

    // Select the mustache tab.
    // ctrl+shift+u is a Pattern Lab convention.
    Mousetrap.bind(['ctrl+alt+m', 'ctrl+shift+u'], (e) => {
      this.#fepperUi.codeViewer.swapCode('m');

      e.preventDefault();
      return false;
    });

    // Select the html tab.
    // ctrl+shift+y is a Pattern Lab convention.
    Mousetrap.bind(['ctrl+alt+h', 'ctrl+shift+y'], (e) => {
      this.#fepperUi.codeViewer.swapCode('e');

      e.preventDefault();
      return false;
    });
  }
}
