export default class CodeViewer {
  constructor(fepperUi) {
    this.codeViewer = fepperUi.codeViewer;
    this.dataSaver = fepperUi.dataSaver;
    this.uiData = fepperUi.uiData;
    this.uiProps = fepperUi.uiProps;
    this.urlHandler = fepperUi.urlHandler;
    this.viewerHandler = fepperUi.viewerHandler;
    this.$orgs = fepperUi.requerio.$orgs;
    this.patternPartial = null;
  }

  listen() {
    const searchParams = this.urlHandler.getSearchParams();
    this.patternPartial = searchParams.p;

    // e2e test this by triggering the pattern to postMessage to be received here.
    window.addEventListener('message', this.codeViewer.receiveIframeMessage);

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
      this.codeViewer.activateTabAndPanel('feplet');
    });

    this.$orgs['#sg-code-tab-markdown'].on('click', () => {
      this.codeViewer.activateTabAndPanel('markdown');
    });

    this.$orgs['#sg-code-tab-git'].on('click', () => {
      this.codeViewer.activateTabAndPanel('git');
    });

    this.$orgs['#sg-code-tab-requerio'].on('click', () => {
      this.codeViewer.activateTabAndPanel('requerio');
    });

    this.$orgs['#sg-code-btn-markdown-edit'].on('click', () => {
      fetch('/gatekeeper')
        .then((response) => {
          if (response.status === 200) {
            this.codeViewer.activateMarkdownTextarea();

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
      this.codeViewer.markdownSave();
    });

    this.$orgs['#sg-code-btn-markdown-save-cancel'].on('click', () => {
      this.codeViewer.deActivateMarkdownTextarea();
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

      this.codeViewer.revisionAdd(markdownSource)
        .then(() => this.codeViewer.revisionCommit(body))
        .then((responseText) => {
          this.$orgs['#sg-code-console-markdown-log'].dispatchAction('html', responseText);
          this.$orgs['#sg-code-pane-markdown-commit'].dispatchAction('css', {display: ''});
          this.$orgs['#sg-code-textarea-commit-message'].dispatchAction('val', '');
          this.$orgs['#sg-code-pane-markdown-console'].dispatchAction('css', {display: 'block'});
          this.$orgs['#sg-code-console-markdown-load-anim'].dispatchAction('css', {display: 'block'});

          return Promise.resolve();
        })
        .then(() => this.codeViewer.revisionPush())
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
      this.codeViewer.deActivateMarkdownTextarea();
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
      this.codeViewer.gitInterface = false;

      this.$orgs['#sg-code-pane-git'].toggleClass('git-interface-on');

      if (this.dataSaver.findValue('gitInterface') === 'true') {
        this.dataSaver.updateValue('gitInterface', 'false');
      }
    });

    this.$orgs['#sg-code-radio-git-on'].on('change', () => {
      this.codeViewer.gitInterface = true;

      this.$orgs['#sg-code-pane-git'].toggleClass('git-interface-on');

      if (this.dataSaver.findValue('gitInterface') !== 'true') {
        this.dataSaver.updateValue('gitInterface', 'true');
      }
    });

    this.$orgs['#sg-code-btn-git-disable'].on('click', () => {
      this.dataSaver.updateValue('gitInterface', 'false');
      window.location.reload();
    });

    // Toggle the Code Viewer.
    window.Mousetrap.bind('ctrl+shift+c', (e) => {
      this.codeViewer.toggleCode();

      e.preventDefault();
      return false;
    });

    // Focus on the tab to the left (or cycle to to the end).
    window.Mousetrap.bind('ctrl+shift+[', (e) => {
      this.codeViewer.switchTab(-1);

      e.preventDefault();
      return false;
    });

    // Focus on the tab to the right (or cycle to the beginning).
    window.Mousetrap.bind('ctrl+shift+]', (e) => {
      this.codeViewer.switchTab(1);

      e.preventDefault();
      return false;
    });

    // Dock Code Viewer to the left.
    window.Mousetrap.bind('ctrl+alt+h', (e) => {
      const dockOpen = this.$orgs['#patternlab-body'].getState().classArray.includes('dock-open');

      if (dockOpen) {
        this.viewerHandler.dockLeft();
      }

      e.preventDefault();
      return false;
    });

    // Dock Code Viewer to the bottom.
    window.Mousetrap.bind('ctrl+alt+j', (e) => {
      const dockOpen = this.$orgs['#patternlab-body'].getState().classArray.includes('dock-open');

      if (dockOpen) {
        this.viewerHandler.dockBottom();
      }

      e.preventDefault();
      return false;
    });

    // Dock Code Viewer to the right.
    window.Mousetrap.bind('ctrl+alt+l', (e) => {
      const dockOpen = this.$orgs['#patternlab-body'].getState().classArray.includes('dock-open');

      if (dockOpen) {
        this.viewerHandler.dockRight();
      }

      e.preventDefault();
      return false;
    });
  }
}
