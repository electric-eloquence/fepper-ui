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

      this.$orgs['#sg-code-tab-feplet'].on('click', () => {
        this.#fepperUi.codeViewer.activateTabAndPanel('feplet');
      });

      this.$orgs['#sg-code-tab-markdown'].on('click', () => {
        this.#fepperUi.codeViewer.activateTabAndPanel('markdown');
      });

      // Select and copy the relative path to the pattern.
      this.$orgs['#sg-code-pattern-info-rel-path'].on('click', () => {
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
          document.execCommand('copy');
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

    // TODO: Create keyboard shortcuts to switch between Feplet, Markdown, Requerio, and Git tabs.
  }
}
