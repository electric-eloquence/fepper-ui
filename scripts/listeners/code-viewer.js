export default class CodeViewer {
  #fepperUi;

  constructor(fepperUi) {
    this.#fepperUi = fepperUi;

    this.$orgs = fepperUi.requerio.$orgs;
    this.patternPartial = null;
  }

  // Getters for fepperUi instance props in case they are undefined at instantiation.

  get uiData() {
    return this.#fepperUi.uiData;
  }

  get uiProps() {
    return this.#fepperUi.uiProps;
  }

  get urlHandler() {
    return this.#fepperUi.urlHandler;
  }

  listen() {
    const searchParams = this.urlHandler.getSearchParams();
    this.patternPartial = searchParams.p;

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

      this.$orgs['#sg-code-tab-git'].on('click', () => {
        this.#fepperUi.codeViewer.activateTabAndPanel('git');
      });

      this.$orgs['#sg-code-input-git-off'].on('change', () => {
        this.$orgs['#sg-code-pane-git'].toggleClass('git-integration-on');

        if (this.#fepperUi.dataSaver.findValue('gitIntegration') === 'true') {
          this.#fepperUi.dataSaver.updateValue('gitIntegration', 'false');
        }
      });

      this.$orgs['#sg-code-input-git-on'].on('change', () => {
        this.$orgs['#sg-code-pane-git'].toggleClass('git-integration-on');

        if (this.#fepperUi.dataSaver.findValue('gitIntegration') === 'false') {
          this.#fepperUi.dataSaver.updateValue('gitIntegration', 'true');
        }
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
          encodeURIComponent(this.uiData.sourceFiles[this.patternPartial]);
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
        xhr.send(new URLSearchParams(body));
      });

      this.$orgs['#sg-code-btn-markdown-cancel'].on('click', () => {
        this.#fepperUi.codeViewer.deActivateMarkdownTextarea();
      });
    });

    // Toggle the code panel.
    window.Mousetrap.bind('ctrl+shift+c', (e) => {
      this.#fepperUi.codeViewer.toggleCode();

      e.preventDefault();
      return false;
    });

    // TODO: Create keyboard shortcuts to switch between Feplet, Markdown, Requerio, and Git tabs.
  }
}
