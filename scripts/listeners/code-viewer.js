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

      this.$orgs['#sg-code-btn-markdown-edit'].on('click', () => {
        this.#fepperUi.codeViewer.activateMarkdownTextarea();
      });

      this.$orgs['#sg-code-btn-markdown-save'].on('click', () => {
        const markdownTextareaState = this.$orgs['#sg-code-textarea-markdown'].getState();
        const body = 'markdown_edited=' + encodeURIComponent(markdownTextareaState.val) + '&rel_path=' +
          encodeURIComponent(this.uiData.sourceFiles[this.codeViewer.patternPartial]);
        const codeViewer = this;

        const xhr = new window.XMLHttpRequest();
        xhr.onload = function () {
          if (this.status === 200) {
            codeViewer.$orgs['#sg-code-pane-markdown-edit'].dispatchAction('css', {display: 'none'});
          }
          else {
            // eslint-disable-next-line no-console
            console.warn(`Status ${this.status}: ${this.statusText}`);

            if (this.status === 403) {
              const parser = new DOMParser();
              const doc = parser.parseFromString(this.responseText, 'text/html');
              const selection = doc.querySelector('section#forbidden');

              codeViewer.$orgs['#sg-code-pane-markdown-edit'].dispatchAction('html', selection);
            }
          }
        };
        /* istanbul ignore next */
        xhr.onerror = function () {
          // eslint-disable-next-line no-console
          console.error(`Status ${this.status}: ${this.statusText}`);
        };

        xhr.open('POST', '/markdown-editor');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send(body);
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
