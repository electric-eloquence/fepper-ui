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
          if (err) {console.error(err);}

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
          if (err) {console.error(err);}

          console.error('Copy failed!');
          /* eslint-enable no-console */

          return;
        }
      });

      this.$orgs['#sg-code-tab-feplet'].on('click', () => {
        this.#fepperUi.codeViewer.activateTabAndPanel('feplet');
      });

      this.$orgs['#sg-code-tab-markdown'].on('click', () => {
        this.#fepperUi.codeViewer.activateTabAndPanel('markdown');
      });

      this.$orgs['#sg-code-tab-git'].on('click', () => {
        this.#fepperUi.codeViewer.activateTabAndPanel('git');
      });

      this.$orgs['#sg-code-tab-requerio'].on('click', () => {
        this.#fepperUi.codeViewer.activateTabAndPanel('requerio');
      });

      this.$orgs['#sg-code-btn-markdown-edit'].on('click', () => {
        fetch('/gatekeeper')
          .then((response) => {
            if (response.status === 200) {
              this.#fepperUi.codeViewer.activateMarkdownTextarea();

              return Promise.resolve();
            }
            else {
              return Promise.reject(response);
            }
          })
          .catch((response) => {
            if (response && response.status && response.statusText) {
              // eslint-disable-next-line no-console
              console.error(`Status ${response.status}: ${response.statusText}`);
            }
            else {
              // eslint-disable-next-line curly, no-console
              if (response) console.error(response);
            }
          });
      });

      this.$orgs['#sg-code-btn-markdown-save'].on('click', () => {
        this.#fepperUi.codeViewer.markdownSave();
      });

      this.$orgs['#sg-code-btn-markdown-save-cancel'].on('click', () => {
        this.#fepperUi.codeViewer.deActivateMarkdownTextarea();
      });

      this.$orgs['#sg-code-btn-markdown-commit'].on('click', () => {
        const commitMessageVal = this.$orgs['#sg-code-textarea-commit-message'].getState().val.trim();

        if (!commitMessageVal) {
          this.$orgs['#sg-code-label-commit-message'].dispatchAction('css', {color: 'red'});
          this.$orgs['#sg-code-textarea-commit-message'].dispatchAction('focus');

          return;
        }

        const body = 'args[0]=commit&args[1]=-m&args[2]=' + encodeURIComponent(commitMessageVal);
        const markdownData = this.$orgs['#sg-code-panel-markdown'].getState().data;
        let markdownSource;

        if (markdownData) {
          markdownSource = markdownData.markdownSource;
        }

        this.#fepperUi.codeViewer.revisionAdd(markdownSource)
          .then(() => this.#fepperUi.codeViewer.revisionCommit(body))
          .then((responseText) => {
            this.$orgs['#sg-code-console-markdown-log'].dispatchAction('html', responseText);
            this.$orgs['#sg-code-pane-markdown-commit'].dispatchAction('css', {display: ''});
            this.$orgs['#sg-code-textarea-commit-message'].dispatchAction('val', '');
            this.$orgs['#sg-code-pane-markdown-console'].dispatchAction('css', {display: 'block'});
            this.$orgs['#sg-code-console-markdown-load-anim'].dispatchAction('css', {display: 'block'});

            return Promise.resolve();
          })
          .then(() => this.#fepperUi.codeViewer.revisionPush())
          .then((responseText) => {
            this.$orgs['#sg-code-console-markdown-load-anim'].dispatchAction('css', {display: ''});
            this.$orgs['#sg-code-console-markdown-log'].dispatchAction('append', responseText);
            this.$orgs['#sg-code-btn-markdown-continue'].dispatchAction('css', {display: 'block'});
          })
          .catch((err) => {
            this.$orgs['#sg-code-console-markdown-load-anim'].dispatchAction('css', {display: ''});
            this.$orgs['#sg-code-console-markdown-error'].dispatchAction('html', err.stack);
            this.$orgs['#sg-code-pane-markdown-commit'].dispatchAction('css', {display: ''});
            this.$orgs['#sg-code-textarea-commit-message'].dispatchAction('val', '');
            this.$orgs['#sg-code-pane-markdown-console'].dispatchAction('css', {display: 'block'});
            this.$orgs['#sg-code-btn-markdown-continue'].dispatchAction('css', {display: 'block'});
            this.$orgs['#sg-code-btn-markdown-edit'].dispatchAction('css', {display: 'none'});
            this.$orgs['#sg-code-tab-git'].dispatchAction('addClass', 'sg-code-tab-warning');
            this.$orgs['#sg-code-pane-git-na'].dispatchAction('css', {display: 'block'});
            this.$orgs['#sg-code-message-git-na'].dispatchAction('html',
              '<pre class="sg-code-pane-content-warning"><code>' + err.stack + '</code></pre>');
            this.$orgs['#sg-code-pane-git'].dispatchAction('css', {display: ''});
          });
      });

      this.$orgs['#sg-code-btn-markdown-commit-cancel'].on('click', () => {
        this.#fepperUi.codeViewer.deActivateMarkdownTextarea();
      });

      this.$orgs['#sg-code-btn-markdown-continue'].on('click', () => {
        const markdownErrorHtml = this.$orgs['#sg-code-console-markdown-error'].getState().html;

        if (!markdownErrorHtml) {
          // git push
        }

        this.$orgs['#sg-code-console-markdown-log'].dispatchAction('html', '');
        this.$orgs['#sg-code-console-markdown-error'].dispatchAction('html', '');
        this.$orgs['#sg-code-pane-markdown-console'].dispatchAction('css', {display: ''});
        this.$orgs['#sg-code-pane-markdown'].dispatchAction('css', {display: 'block'});
      });

      this.$orgs['#sg-code-radio-git-off'].on('change', () => {
        this.#fepperUi.codeViewer.gitInterface = false;

        this.$orgs['#sg-code-pane-git'].toggleClass('git-interface-on');

        if (this.#fepperUi.dataSaver.findValue('gitInterface') === 'true') {
          this.#fepperUi.dataSaver.updateValue('gitInterface', 'false');
        }
      });

      this.$orgs['#sg-code-radio-git-on'].on('change', () => {
        this.#fepperUi.codeViewer.gitInterface = true;

        this.$orgs['#sg-code-pane-git'].toggleClass('git-interface-on');

        if (this.#fepperUi.dataSaver.findValue('gitInterface') !== 'true') {
          this.#fepperUi.dataSaver.updateValue('gitInterface', 'true');
        }
      });

      this.$orgs['#sg-code-btn-git-disable'].on('click', () => {
        this.#fepperUi.dataSaver.updateValue('gitInterface', 'false');
        window.location.reload();
      });
    });

    // Toggle the code viewer.
    window.Mousetrap.bind('ctrl+shift+c', (e) => {
      this.#fepperUi.codeViewer.toggleCode();

      e.preventDefault();
      return false;
    });

    // Focus on the tab to the left (or cycle to to the end).
    window.Mousetrap.bind('ctrl+shift+[', (e) => {
      this.#fepperUi.codeViewer.switchTab(-1);

      e.preventDefault();
      return false;
    });

    // Focus on the tab to the right (or cycle to the beginning).
    window.Mousetrap.bind('ctrl+shift+]', (e) => {
      this.#fepperUi.codeViewer.switchTab(1);

      e.preventDefault();
      return false;
    });

    // Dock code viewer to the left.
    window.Mousetrap.bind('ctrl+alt+h', (e) => {
      const dockOpen = this.$orgs['#patternlab-body'].getState().classArray.includes('dock-open');

      if (dockOpen) {
        this.#fepperUi.viewerHandler.dockLeft();
      }

      e.preventDefault();
      return false;
    });

    // Dock code viewer to the bottom.
    window.Mousetrap.bind('ctrl+alt+j', (e) => {
      const dockOpen = this.$orgs['#patternlab-body'].getState().classArray.includes('dock-open');

      if (dockOpen) {
        this.#fepperUi.viewerHandler.dockBottom();
      }

      e.preventDefault();
      return false;
    });

    // Dock code viewer to the right.
    window.Mousetrap.bind('ctrl+alt+l', (e) => {
      const dockOpen = this.$orgs['#patternlab-body'].getState().classArray.includes('dock-open');

      if (dockOpen) {
        this.#fepperUi.viewerHandler.dockRight();
      }

      e.preventDefault();
      return false;
    });
  }
}
