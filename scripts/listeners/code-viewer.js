// Be sure to e2e test listeners.

// TODO: Replace closure with private class field when there is greater browser support.
export default function (fepperUiInst) {
  class CodeViewer {
    constructor(fepperUi) {
      this.$orgs = fepperUi.requerio.$orgs;
    }

    listen() {
      // e2e test this by triggering the pattern to postMessage to be received here.
      window.addEventListener('message', fepperUiInst.codeViewer.receiveIframeMessage);

      document.addEventListener('DOMContentLoaded', () => {
        this.$orgs['#sg-code-container'].dispatchAction('css', 'bottom'); // Set this measurement in state.

        // Make sure the close button handles the click.
        this.$orgs['#sg-code-close-btn'].on('click', (e) => {
          e.preventDefault();

          fepperUiInst.codeViewer.closeCode();
        });

        // Make sure the click events are handled on the HTML tab.
        this.$orgs['#sg-code-title-html'].on('click', (e) => {
          e.preventDefault();

          fepperUiInst.codeViewer.swapCode('e');
        });

        // Make sure the click events are handled on the Mustache tab.
        this.$orgs['#sg-code-title-mustache'].on('click', (e) => {
          e.preventDefault();

          fepperUiInst.codeViewer.swapCode('m');
        });

        // Select and copy the relative path to the pattern.
        this.$orgs['#sg-code-copy-path'].on('click', () => {
          let range;
          let selection;

          try {
            range = document.createRange();
            selection = window.getSelection();

            range.selectNodeContents(this.$orgs['#sg-code-pattern-info-rel-path'][0]);
            selection.removeAllRanges();
          }
          catch (err) {
            /* eslint-disable no-console */
            console.error(err);
            console.error('Selection failed!');

            return;
          }

          try {
            const copyPathState = this.$orgs['#sg-code-copy-path'].getState();
            const origMsg = this.$orgs['#sg-code-copy-path'][0].innerHTML;
            const origWidth = copyPathState.width;
            const copiedMsg = copyPathState.attribs['data-copied-msg'];

            selection.addRange(range);
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
        fepperUiInst.codeViewer.toggleCode();

        // If viewall, scroll to the focused pattern.
        if (fepperUiInst.codeViewer.viewall && fepperUiInst.codeViewer.codeActive) {
          fepperUiInst.codeViewer.scrollViewall();
        }

        e.preventDefault();
        return false;
      });

      // DEPRECATED! Will be removed.
      // When the code panel is open hijack, cmd+a/ctrl+a so that it only selects the code view.
      Mousetrap.bind('mod+a', (e) => {
        if (fepperUiInst.codeViewer.codeActive) {
          fepperUiInst.codeViewer.selectCode();

          e.preventDefault();
          return false;
        }
      });

      // Select the mustache tab.
      // ctrl+shift+u is a Pattern Lab convention.
      Mousetrap.bind(['ctrl+alt+m', 'ctrl+shift+u'], (e) => {
        fepperUiInst.codeViewer.swapCode('m');

        e.preventDefault();
        return false;
      });

      // Select the html tab.
      // ctrl+shift+y is a Pattern Lab convention.
      Mousetrap.bind(['ctrl+alt+h', 'ctrl+shift+y'], (e) => {
        fepperUiInst.codeViewer.swapCode('e');

        e.preventDefault();
        return false;
      });
    }
  }

  return new CodeViewer(fepperUiInst);
}
