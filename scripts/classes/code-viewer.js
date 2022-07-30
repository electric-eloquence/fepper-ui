/**
 * Copyright (c) 2013 Brad Frost, http://bradfrostweb.com & Dave Olsen, http://dmolsen.com
 * Licensed under the MIT license.
 */

// Declared outside class scope because it requires function-scoped `this` context.
// Not in the listeners directory, because we don't need class scoping.
function addLineageListeners($orgs, uiFns) {
  // Must be jQuery, not Requerio, because the HTML was dynamically inserted by .updateMetadata() on the class.
  // Since it will be repeatedly generated, the following cannot be in a listeners class, where they are added but once.
  /* istanbul ignore next */
  window.$('#sg-code-lineage-fill a, #sg-code-lineager-fill a').on('click', function (e) {
    e.preventDefault();

    const messageObj = {
      event: 'patternlab.updatePath',
      path: window.$(this).attr('href')
    };
    const patternPartial = this.textContent.trim();

    uiFns.updatePath(messageObj, patternPartial);
  });
}

export default class CodeViewer {

  /* CLASS FIELDS */
  // The following functions are declared as class fields to retain function-scoped `this` context while keeping the
  // class constructor tidy. Exposed as properties on the instance so they can be unit tested.

  receiveIframeMessage = (event) => {
    const data = this.uiFns.receiveIframeMessageBoilerplate(event);

    /* istanbul ignore if */
    if (!data) {
      return;
    }

    if (data.codeViewallClick) { // This condition must come first.
      if (data.codeViewallClick === 'on') {
        this.patternPartial = data.patternPartial;

        this.openCode();
      }
      else {
        this.closeCode();
      }
    }

    if (data.viewall === true) {
      this.uiProps.viewall = data.viewall;

      // This is necessary so the Markdown "Edit" button is not displayed.
      this.$orgs['#patternlab-body'].dispatchAction('addClass', 'viewall');
    }
    else if (data.viewall === false) {
      // This is necessary so the Markdown "Edit" button is displayed.
      this.$orgs['#patternlab-body'].dispatchAction('removeClass', 'viewall');
    }

    let dockOpen;

    switch (data.event) {
      case 'patternlab.keyPress':
        switch (data.keyPress) {
          // Toggle the Code Viewer.
          case 'ctrl+shift+c':
            this.toggleCode();

            break;

          // Switch to the tab on the left (or cycle to the end).
          case 'ctrl+shift+[':
            this.switchTab(-1);

            break;

          // Switch to the tab on the right (or cycle to the beginning).
          case 'ctrl+shift+]':
            this.switchTab(1);

            break;

          // Dock Code Viewer to the left.
          case 'ctrl+alt+h':
            dockOpen = this.$orgs['#patternlab-body'].getState().classArray.includes('dock-open');

            if (dockOpen) {
              this.viewerHandler.dockLeft();
            }

            break;

          // Dock Code Viewer to the bottom.
          case 'ctrl+alt+j':
            dockOpen = this.$orgs['#patternlab-body'].getState().classArray.includes('dock-open');

            if (dockOpen) {
              this.viewerHandler.dockBottom();
            }

            break;

          // Dock Code Viewer to the right.
          case 'ctrl+alt+l':
            dockOpen = this.$orgs['#patternlab-body'].getState().classArray.includes('dock-open');

            if (dockOpen) {
              this.viewerHandler.dockRight();
            }

            break;

          case 'esc':
            if (this.codeActive && this.uiProps.dockPosition === 'bottom') {
              this.closeCode();
            }

            break;
        }

        break;

      case 'patternlab.pageLoad':
        // If showing loading anim, hide it and show the Markdown pane.
        // This is the usual procedure for saving Markdown without Git, as this event will get triggered by LiveReload.
        if (
          !this.saving &&
          this.$orgs['#sg-code-pane-markdown-load-anim'].getState().css.display === 'block'
        ) {
          setTimeout(() => {
            this.$orgs['#sg-code-pane-markdown-load-anim'].dispatchAction('css', {display: 'none'});

            if (!this.$orgs['#sg-code-console-markdown-error'].getState().html) {
              this.$orgs['#sg-code-pane-markdown'].dispatchAction('css', {display: 'block'});
            }
          }, 500);
        }
        else if (
          this.$orgs['#sg-code-console-markdown-log'].getState().html ||
          this.$orgs['#sg-code-console-markdown-error'].getState().html
        ) {
          this.$orgs['#sg-code-tab-markdown'].dispatchAction('removeClass', 'sg-code-tab-warning');
          this.$orgs['#sg-code-tab-git'].dispatchAction('removeClass', 'sg-code-tab-warning');
          this.$orgs['#sg-code-btn-markdown-edit'].dispatchAction('css', {display: ''}); // Don't override viewalls.
          this.$orgs['#sg-code-pane-markdown-console'].dispatchAction('css', {display: 'none'});
          this.$orgs['#sg-code-console-markdown-log'].dispatchAction('html', '');
          this.$orgs['#sg-code-console-markdown-error'].dispatchAction('html', '');
          this.$orgs['#sg-code-btn-markdown-continue'].dispatchAction('css', {display: 'none'});
          this.$orgs['#sg-code-message-git-na'].dispatchAction('html', '');
        }

        break;

      case 'patternlab.updatePath':
        this.uiFns.updatePath(data, data.patternPartial);

        break;
    }

    if (data.lineage) {
      const {lineage, lineageR, missingPartials, patternPartial, patternState} = data;

      this.updateMetadata(lineage, lineageR, patternPartial, patternState, missingPartials);

      const paneMarkdownNaDisplay = this.$orgs['#sg-code-pane-markdown-na'].getState().css.display;
      const paneMarkdownEditDisplay = this.$orgs['#sg-code-pane-markdown-edit'].getState().css.display;
      const paneMarkdownLoadAnimDisplay = this.$orgs['#sg-code-pane-markdown-load-anim'].getState().css.display;
      const paneMarkdownCommitDisplay = this.$orgs['#sg-code-pane-markdown-commit'].getState().css.display;

      if (
        data.viewall ||
        (
          !paneMarkdownNaDisplay &&
          !paneMarkdownEditDisplay &&
          !paneMarkdownLoadAnimDisplay &&
          !paneMarkdownCommitDisplay
        )
      ) {
        this.$orgs['#sg-code-pane-markdown'].dispatchAction('css', {display: 'block'});
      }
    }
  };

  // Private class fields.
  #fepperUi;
  #root;

  /* CONSTRUCTOR */

  constructor(fepperUi, root) {
    this.#fepperUi = fepperUi;
    this.#root = root;

    this.codeActive = false;
    this.gitInterface = null; // This can be different from the dataSaver and uiData.config values.
    this.markdownHttpPath = null;
    this.markdownSource = null;
    this.$orgs = fepperUi.requerio.$orgs;
    this.patternPartial = null;
    this.requerio = fepperUi.requerio;
    this.saving = false;
    this.stoked = false;
    this.tabActive = 'feplet';
  }

  // GETTERS for fepperUi instance props in case they are undefined at instantiation.

  get annotationsViewer() {
    return this.#fepperUi.annotationsViewer;
  }

  get dataSaver() {
    return this.#fepperUi.dataSaver;
  }

  get requerioInspector() {
    return this.#fepperUi.requerioInspector;
  }

  get uiData() {
    return this.#fepperUi.uiData;
  }

  get uiFns() {
    return this.#fepperUi.uiFns;
  }

  get uiProps() {
    return this.#fepperUi.uiProps;
  }

  get urlHandler() {
    return this.#fepperUi.urlHandler;
  }

  get viewerHandler() {
    return this.#fepperUi.viewerHandler;
  }

  /* METHODS */

  // Declared before other methods because it must be unit tested before other methods. Be sure to e2e test .stoke().
  stoke() {
    // Load the query strings in case code view has to show by default.
    const dataSaverGitInterface = this.#fepperUi.dataSaver.findValue('gitInterface');
    const searchParams = this.urlHandler.getSearchParams();
    const tabActive = this.dataSaver.findValue('tabActive');
    // First, set this.gitInterface according to hard-coded config, but allow browser override.
    this.gitInterface = this.uiData.config.gitInterface;
    this.gitInterface = dataSaverGitInterface !== null ? (dataSaverGitInterface === 'true') : this.gitInterface;
    this.patternPartial = searchParams.p || this.uiData.config.defaultPattern;
    this.tabActive = tabActive || this.tabActive;

    if (searchParams.view === 'code' || searchParams.view === 'c' || this.uiData.config.defaultShowPatternInfo) {
      this.openCode();
    }

    if (this.gitInterface) {
      // If interfacing with Git, preemptively hide the Markdown edit button.
      // Reenable after a git pull with no conflicts.
      // Not easy to test because reenablement requires a git pull on the shell, and we aren't mocking shell commands.
      // However, this is very easy to see during actual user interaction.
      /* istanbul ignore next */
      this.$orgs['#sg-code-btn-markdown-edit'].dispatchAction('css', {display: 'none'});
    }

    return this.activateTabAndPanel(this.tabActive)
      .then(() => {
        this.stoked = true;
      })
      .catch(() => /* istanbul ignore next */ {
        this.stoked = true;
      });
  }

  activateMarkdownTextarea() {
    const markdownPreState = this.$orgs['#sg-code-pre-language-markdown'].getState();

    this.$orgs['#sg-code-pane-markdown'].dispatchAction('css', {display: 'none'});
    this.$orgs['#sg-code-pane-markdown-edit'].dispatchAction('css', {display: 'block'});

    this.$orgs['#sg-code-textarea-markdown']
      .dispatchAction('width', markdownPreState.width)
      .dispatchAction('height', markdownPreState.height + 21) // line-height is 21px.
      .dispatchAction('focus');
  }

  /**
   * When loading the code view, make sure the active tab is highlighted and filled in appropriately.
   *
   * @param {string} type - The panel to activate.
   * @returns {promise} A promise on which to perform additional actions.
   */
  activateTabAndPanel(type) {
    /* istanbul ignore if */
    if (!this.$orgs['#sg-code-tab-' + type]) {
      return Promise.reject('There is no Code Viewer tab for ' + type);
    }
    /* istanbul ignore if */
    if (!this.$orgs['#sg-code-panel-' + type]) {
      return Promise.reject('There is no Code Viewer panel for ' + type);
    }

    this.tabActive = type;

    this.$orgs['.sg-code-tab'].dispatchAction('removeClass', 'sg-code-tab-active');
    this.$orgs['#sg-code-tab-' + type].dispatchAction('addClass', 'sg-code-tab-active');
    this.$orgs['.sg-code-panel'].dispatchAction('removeClass', 'sg-code-panel-active');
    this.$orgs['#sg-code-panel-' + type].dispatchAction('addClass', 'sg-code-panel-active');
    this.dataSaver.updateValue('tabActive', type);

    switch (type) {
      case 'markdown': {
        // In viewalls, on page load, this.patternPartial will be for the first viewed pattern, not for the viewall.
        // So get patternPartial from searchParams.
        const searchParams = this.urlHandler.getSearchParams();
        const patternPartial = (searchParams && searchParams.p) || this.patternPartial;

        if (patternPartial.startsWith('viewall')) {
          return this.setPanelContent(type)
            .then(() => this.$orgs['#sg-code-pane-markdown'].dispatchAction('css', {display: 'block'}));
        }
        else {
          return this.setPanelContent(type)
            .then(() => this.gitPullMarkdown());
        }
      }
      default: {
        return this.setPanelContent(type, this.patternPartial);
      }
    }
  }

  closeCode() {
    // Flag that viewer is inactive.
    this.codeActive = false;

    this.viewerHandler.closeViewer();
    this.$orgs['#sg-t-code'].dispatchAction('removeClass', 'active');
    this.$orgs['#sg-code-container'].dispatchAction('removeClass', 'active');
  }

  deActivateMarkdownTextarea() {
    this.$orgs['#sg-code-textarea-markdown'].dispatchAction('blur');
    this.$orgs['#sg-code-pane-markdown-edit'].dispatchAction('css', {display: 'none'});
    this.$orgs['#sg-code-pane-markdown-commit'].dispatchAction('css', {display: 'none'});
    this.$orgs['#sg-code-btn-markdown-edit'].dispatchAction('css', {display: ''}); // Don't override viewalls.
    this.$orgs['#sg-code-pane-markdown'].dispatchAction('css', {display: 'block'});
  }

  fetchGitCommand(body) {
    // Note: git-interface gatekeeps on the server.
    return fetch(
      '/git-interface',
      {
        method: 'POST',
        body
      })
      .then((response) => {
        if (response && (response.status === 200 || response.status === 403)) {
          return response.text();
        }
        else {
          return response.json();
        }
      })
      .then((response) => {
        return new Promise(
          (resolve, reject) => {
            if (typeof response === 'string') {
              resolve(response);
            }
            else {
              reject(response);
            }
          });
      });
  }

  gitDiff() {
    const gitNaDisplay = this.$orgs['#sg-code-pane-git-na'].getState().css.display;

    if (!this.gitInterface || gitNaDisplay === 'block') {
      return Promise.resolve();
    }
    else {
      return this.fetchGitCommand(new URLSearchParams('args[0]=diff&rel_path=' + this.markdownSource))
        .then((response) => {
          return new Promise(
            (resolve) => {
              if (response) {
                resolve(response);
              }
              else {
                resolve({status: 304});
              }
            });
        });
    }
  }

  gitPullMarkdown() {
    const gitNaDisplay = this.$orgs['#sg-code-pane-git-na'].getState().css.display;

    if (!this.gitInterface || gitNaDisplay === 'block') {
      return Promise.resolve();
    }
    else {
      return this.fetchGitCommand(new URLSearchParams('args[0]=pull'))
        .then((response) => {
          /* istanbul ignore else */
          if (typeof response === 'string') {
            this.$orgs['#sg-code-tab-git'].dispatchAction('removeClass', 'sg-code-tab-warning');
            // Since we know there are no Git conflicts, reenable Markdown edit button.
            this.$orgs['#sg-code-btn-markdown-edit'].dispatchAction('css', {display: ''}); // Don't override viewalls.
            this.$orgs['#sg-code-pane-git-na'].dispatchAction('css', {display: 'none'});
            this.$orgs['#sg-code-pane-git'].dispatchAction('css', {display: 'block'});

            return Promise.resolve(response);
          }
          else {
            return Promise.reject(response);
          }
        })
        .catch((err) => {
          /* istanbul ignore if */
          if (err instanceof Object) {
            // eslint-disable-next-line no-console
            console.error(err);
          }

          if (this.gitInterface && err instanceof Object) {
            this.$orgs['#sg-code-tab-git'].dispatchAction('addClass', 'sg-code-tab-warning');
            this.$orgs['#sg-code-btn-markdown-edit'].dispatchAction('css', {display: 'none'});

            if (typeof err.message === 'string') {
              this.$orgs['#sg-code-message-git-na'].dispatchAction('html',
                '<pre class="sg-code-pane-content-warning"><code>Error: ' + err.message + '</code></pre>');
            }

            if (typeof err.stack === 'string') {
              // eslint-disable-next-line no-console
              console.error(err.stack);
            }
          }

          this.$orgs['#sg-code-pane-git-na'].dispatchAction('css', {display: 'block'});
          this.$orgs['#sg-code-pane-git'].dispatchAction('css', {display: 'none'});

          return Promise.resolve();
        });
    }
  }

  markdownSave() {
    // Fetching gatekeeper before fetching markdown-editor in order to ensure that it is safe to prepare the body for
    // posting to markdown-editor.
    return fetch('/gatekeeper?tool=the+Markdown+Editor')
      .then((response) => {
        this.$orgs['#sg-code-pane-markdown-edit'].dispatchAction('css', {display: 'none'});

        if (response.status === 200) {
          this.$orgs['#sg-code-code-language-markdown'].dispatchAction('html');

          const markdownTextareaVal = this.$orgs['#sg-code-textarea-markdown'].getState().val;
          const body = 'markdown_edited=' + encodeURIComponent(markdownTextareaVal) + '&markdown_source=' +
            encodeURIComponent(this.markdownSource);

          if (this.gitInterface) {
            this.saving = true;
          }

          // Note: markdown-editor gatekeeps on the server as well.
          return fetch(
            '/markdown-editor',
            {
              method: 'POST',
              body: new URLSearchParams(body)
            });
        }
        else {
          return Promise.reject(response);
        }
      })
      .then((response) => {
        if (response && response.status === 200) {
          this.$orgs['#sg-code-pane-markdown-load-anim'].dispatchAction('css', {display: 'block'});

          if (this.gitInterface) {
            return this.setPanelContent('markdown', this.patternPartial)
              .then(() => this.gitPullMarkdown())
              .then(() => this.gitDiff());
          }
          else {
            return response.text();
          }
        }
        else if (response && response.status === 304) { // Not Modified
          return Promise.resolve(response);
        }
        else {
          return Promise.reject(response);
        }
      })
      .then((response) => {
        this.saving = false;

        if (typeof response === 'string') {
          if (this.gitInterface) {
            this.$orgs['#sg-code-pane-markdown-load-anim'].dispatchAction('css', {display: 'none'});
            this.$orgs['#sg-code-pane-markdown-commit'].dispatchAction('css', {display: 'block'});
            this.$orgs['#sg-code-textarea-commit-message'].dispatchAction('focus');
          }

          return Promise.resolve({statusText: 'OK'});
        }
        else if (typeof response === 'object') {
          if (response.status === 304) { // Not Modified
            this.$orgs['#sg-code-pane-markdown'].dispatchAction('css', {display: 'block'});
            this.$orgs['#sg-code-pane-markdown-load-anim'].dispatchAction('css', {display: 'none'});
          }

          return Promise.resolve(response);
        }
        else /* istanbul ignore next */ {
          return Promise.reject(response);
        }
      })
      .catch((response) => {
        this.saving = false;

        this.$orgs['#sg-code-pane-markdown-load-anim'].dispatchAction('css', {display: 'none'});

        if (response) {
          if (response.status === 403) {
            // eslint-disable-next-line no-console
            console.error(`Status ${response.status}: ${response.statusText}`);

            return response.text()
              .then((responseText) => {
                const parser = new window.DOMParser();
                const doc = parser.parseFromString(responseText, 'text/html');
                const forbidden = doc.getElementById('forbidden');
                const forbiddenClassName = forbidden.getAttribute('class');

                forbidden.removeAttribute('id'); // To avoid having duplicates with id="forbidden".
                forbidden.setAttribute('class', forbiddenClassName + ' sg-code-pane-content-warning');
                this.$orgs['#sg-code-tab-markdown'].dispatchAction('addClass', 'sg-code-tab-warning');
                this.$orgs['#sg-code-pane-markdown-na']
                  .dispatchAction('html', forbidden.innerHTML)
                  .dispatchAction('addClass', 'sg-code-pane-content-warning')
                  .dispatchAction('css', {display: 'block'});

                return Promise.resolve(response);
              });
          }
          else {
            // eslint-disable-next-line no-console
            console.error(response);
          }
        }

        if (!response || response.status !== 403) {
          this.$orgs['#sg-code-pane-markdown'].dispatchAction('css', {display: 'block'});
          this.$orgs['#sg-code-pane-markdown-edit'].dispatchAction('css', {display: 'none'});
          this.$orgs['#sg-code-pane-markdown-commit'].dispatchAction('css', {display: 'none'});
          this.$orgs['#sg-code-textarea-commit-message'].dispatchAction('val', '');
        }

        return Promise.resolve(response);
      });
  }

  openCode() {
    // Flag that viewer is active.
    this.codeActive = true;
    this.uiProps.lastViewer = 'code';

    // Make sure the Annotations Viewer is off before showing code.
    this.annotationsViewer.closeAnnotations();
    this.viewerHandler.openViewer();
    this.$orgs['#sg-t-code'].dispatchAction('addClass', 'active');
    this.$orgs['#sg-code-container'].dispatchAction('addClass', 'active');
    this.dataSaver.updateValue('lastViewer', 'code');

    // If viewall, scroll to the focused pattern.
    /* istanbul ignore if */
    if (this.uiProps.viewall) {
      this.scrollViewall();
    }
  }

  revisionAdd(relPath) {
    return this.fetchGitCommand(new URLSearchParams('args[0]=add&rel_path=' + relPath));
  }

  revisionCommit(body) {
    return this.fetchGitCommand(new URLSearchParams(body));
  }

  revisionPush() {
    return this.fetchGitCommand(new URLSearchParams('args[0]=push'));
  }

  scrollViewall() /* istanbul ignore next */ {
    this.$orgs['#sg-viewport'][0].contentWindow.postMessage({codeScrollViewall: true}, this.uiProps.targetOrigin);
  }

  /**
   * Set the content for the activated panel.
   *
   * @param {string} type - The panel to activate.
   * @param {[string]} patternPartial - The pattern for which the panel content is being set.
   * @returns {promise} A promise on which to perform additional actions.
   */
  setPanelContent(type, patternPartial) {
    this.patternPartial = patternPartial || this.patternPartial;

    switch (type) {
      case 'feplet': {
        return new Promise(
          (resolve) => {
            /* istanbul ignore else */
            if (!this.patternPartial.startsWith('viewall') && this.$orgs['#sg-code-panel-feplet'].length) {
              this.$orgs['#sg-code-panel-feplet'][0]
                .contentWindow.location.replace(`/mustache-browser?partial=${this.patternPartial}`);
              this.$orgs['#sg-code-panel-feplet'].one('load', () => {
                const height =
                  this.$orgs['#sg-code-panel-feplet'][0].contentWindow.document.documentElement.offsetHeight;

                /* istanbul ignore if */
                if (height > 150) {
                  this.$orgs['#sg-code-panel-feplet'].dispatchAction('css', {height: `${height}px`, visibility: ''});
                }
                else {
                  this.$orgs['#sg-code-panel-feplet'].dispatchAction('css', {height: '', visibility: ''});
                }
              });
            }

            resolve();
          })
          .catch((err) => /* istanbul ignore next */ {
            if (err) {
              // eslint-disable-next-line no-console
              console.error(err);
            }

            return Promise.resolve();
          });
      }
      case 'markdown': {
        const config = this.uiData.config;
        const patternPath = this.uiData.patternPaths[this.patternPartial];

        /* istanbul ignore if */
        if (typeof patternPath !== 'string') {
          return Promise.reject();
        }

        const markdownHttpPath = patternPath.slice(0, -(config.outfileExtension.length)) + config.frontMatterExtension;

        return fetch('/gatekeeper?tool=the+Markdown+Editor')
          .then((response) => {
            if (response.status === 200) {
              return fetch(
                `/${markdownHttpPath}?${Date.now()}`, {
                  method: 'GET'
                });
            }
            else {
              return response.text();
            }
          })
          .then((response) => {
            if (response instanceof Object) {
              if (response.status === 200) {
                this.markdownHttpPath = markdownHttpPath;
                this.markdownSource =
                  this.uiData.sourceFiles[this.patternPartial].slice(0, -(config.patternExtension.length)) +
                  config.frontMatterExtension;
                this.$orgs['#sg-code-panel-markdown'].dispatchAction('data', {markdownSource: this.markdownSource});

                return response.text();
              }
              else {
                this.markdownHttpPath = null;
                this.markdownSource = null;

                return Promise.reject();
              }
            }
            else if (typeof response === 'string') {
              const parser = new window.DOMParser();
              const doc = parser.parseFromString(response, 'text/html');
              const forbidden = doc.getElementById('forbidden');
              const forbiddenClassName = forbidden.getAttribute('class');
              this.markdownHttpPath = null;
              this.markdownSource = null;

              forbidden.removeAttribute('id'); // To avoid having duplicates with id="forbidden".
              forbidden.setAttribute('class', forbiddenClassName + ' sg-code-pane-content-warning');
              this.$orgs['#sg-code-tab-markdown'].dispatchAction('addClass', 'sg-code-tab-warning');
              this.$orgs['#sg-code-pane-markdown-na']
                .dispatchAction('html', forbidden.innerHTML)
                .dispatchAction('addClass', 'sg-code-pane-content-warning')
                .dispatchAction('css', {display: 'block'});
              // If Markdown Editor is forbidden, also forbid Git Interface.
              this.setPanelContent('git');

              return Promise.reject();
            }
          })
          .then((responseText) => {
            if (responseText) {
              // The following line unsets display css as opposed to explicitly setting it in order to work with the
              // loading logic on line 184 of .receiveIframeMessage().
              this.$orgs['#sg-code-pane-markdown-na'].dispatchAction('css', {display: ''});
              this.$orgs['#sg-code-code-language-markdown'].dispatchAction('html', window.he.encode(responseText));
              this.$orgs['#sg-code-textarea-markdown'].dispatchAction('val', responseText);
            }

            return Promise.resolve();
          })
          .catch((err) => {
            /* istanbul ignore if */
            if (err) {
              // eslint-disable-next-line no-console
              console.error(err);
            }

            this.markdownHttpPath = null;
            this.markdownSource = null;

            this.$orgs['#sg-code-pane-markdown'].dispatchAction('css', {display: 'none'});
            this.$orgs['#sg-code-pane-markdown-na'].dispatchAction('css', {display: 'block'});

            return Promise.resolve();
          });
      }
      case 'git': {
        const gitNa = this.$orgs['#sg-code-message-git-na'].getState();

        if (
          gitNa && gitNa.html &&
          (gitNa.html.includes('Command failed: git pull') || gitNa.html.includes('Command failed: git push'))
        ) {
          return Promise.resolve();
        }
        else {
          // Note: git-interface gatekeeps on the server.
          return fetch(
            '/git-interface', {
              method: 'POST'
            })
            .then((response) => {
              switch (response.status) {
                case 200:
                  return Promise.resolve();
                case 500:
                case 501:
                  return response.json();
                default:
                  return response.text();
              }
            })
            .then((response) => {
              if (response) {
                return Promise.reject(response);
              }
              else {
                this.$orgs['#sg-code-tab-git'].dispatchAction('removeClass', 'sg-code-tab-warning');
                this.$orgs['#sg-code-pane-git-na'].dispatchAction('css', {display: 'none'});
                this.$orgs['#sg-code-pane-git'].dispatchAction('css', {display: 'block'});

                if (this.gitInterface) {
                  this.$orgs['#sg-code-radio-git-on'].dispatchAction('prop', {checked: true});
                  this.$orgs['#sg-code-pane-git'].dispatchAction('addClass', 'git-interface-on');
                }

                // If dataSaver value of this.gitInterface is unset, and hard-coded value is true.
                if (this.#fepperUi.dataSaver.findValue('gitInterface') === null && this.uiData.config.gitInterface) {
                  this.#fepperUi.dataSaver.updateValue('gitInterface', 'true');
                }

                return Promise.resolve();
              }
            })
            .catch((rejection) => {
              /* istanbul ignore if */
              if (rejection instanceof Object) {
                // eslint-disable-next-line no-console
                console.error(rejection);
              }

              this.$orgs['#sg-code-pane-git'].dispatchAction('css', {display: 'none'});

              /* istanbul ignore else */
              if (typeof rejection === 'string' && rejection.includes('section id="forbidden"')) {
                const parser = new window.DOMParser();
                const doc = parser.parseFromString(rejection, 'text/html');
                const forbidden = doc.getElementById('forbidden');
                const forbiddenClassName = forbidden.getAttribute('class');

                forbidden.removeAttribute('id'); // To avoid having duplicates with id="forbidden".
                forbidden.setAttribute('class', forbiddenClassName + ' sg-code-pane-content-warning');
                this.$orgs['#sg-code-tab-git'].dispatchAction('addClass', 'sg-code-tab-warning');
                this.$orgs['#sg-code-pane-git-na']
                  .dispatchAction('html', forbidden.innerHTML)
                  .dispatchAction('addClass', 'sg-code-pane-content-warning')
                  .dispatchAction('css', {display: 'block'});
              }
              else if (typeof rejection === 'string' && rejection.startsWith('fatal:')) {
                this.#fepperUi.dataSaver.updateValue('gitInterface', 'false');
              }

              if (
                this.gitInterface &&
                rejection && rejection.message && rejection.message.startsWith('Command failed:')
              ) {
                this.$orgs['#sg-code-tab-git'].dispatchAction('addClass', 'sg-code-tab-warning');
                this.$orgs['#sg-code-btn-markdown-edit'].dispatchAction('css', {display: 'none'});
                this.$orgs['#sg-code-message-git-na'].dispatchAction('html',
                  '<pre class="sg-code-pane-content-warning"><code>' + rejection.message + '</code></pre>');
              }

              this.$orgs['#sg-code-pane-git-na'].dispatchAction('css', {display: 'block'});

              return Promise.resolve();
            });
        }
      }
      case 'requerio': {
        /* istanbul ignore next */
        return Promise.resolve();
      }
    }
  }

  switchTab(offset) {
    const sgCodeContainerState = this.$orgs['#sg-code-container'].getState();
    // Enable frequent polling if switching to the Requerio Inspector tab.
    this.requerioInspector.pollCount = 0;

    /* istanbul ignore if */
    if (!sgCodeContainerState.classArray.includes('active')) {
      return;
    }

    const sgCodeTabState = this.$orgs['.sg-code-tab'].getState();

    /* istanbul ignore if */
    if (!sgCodeTabState || typeof sgCodeTabState.members !== 'number') {
      return;
    }

    let activeCurrent;

    for (let i = 0; i < sgCodeTabState.members; i++) {
      const sgCodeTabClasses = this.$orgs['.sg-code-tab'].getState(i).classArray;

      if (sgCodeTabClasses.includes('sg-code-tab-active')) {
        activeCurrent = i;
      }
    }

    /* istanbul ignore if */
    if (typeof activeCurrent !== 'number') {
      return;
    }

    let activeNew = activeCurrent + offset;

    if (activeNew >= sgCodeTabState.members) {
      activeNew = 0;
    }
    else if (activeNew < 0) {
      activeNew = sgCodeTabState.members - 1;
    }

    const panels = ['feplet', 'markdown', 'git', 'requerio'];

    this.activateTabAndPanel(panels[activeNew]);
  }

  /**
   * Decide on whether the code panel should be open or closed.
   */
  toggleCode() {
    if (!this.codeActive) {
      this.openCode();
    }
    else {
      this.closeCode();
    }
  }

  /**
   * When turning on or switching between patterns with Code Viewer on, make sure we get the code from the pattern via
   * postMessage.
   *
   * @param {array} lineage - Lineage array.
   * @param {array} lineageR - Reverse lineage array.
   * @param {string} patternPartial - The shorthand partials syntax for a given pattern.
   * @param {string} patternState - inprogress, inreview, complete
   * @param {array} missingPartials - Array of missing partials.
   */
  updateMetadata(lineage, lineageR, patternPartial, patternState, missingPartials) {
    this.patternPartial = patternPartial;

    // Draw lineage.
    if (lineage.length) {
      let lineageList = '';

      for (let i = 0; i < lineage.length; i++) {
        let cssClass = '';

        if (lineage[i].lineageState) {
          cssClass = 'sg-pattern-state ' + lineage[i].lineageState;
        }

        lineageList += (i === 0) ? '' : ', ';
        lineageList += '<a href="' + lineage[i].lineagePath + '" class="' + cssClass + '">';
        lineageList += lineage[i].lineagePattern + '</a>';
      }

      this.$orgs['#sg-code-lineage'].dispatchAction('css', {display: 'block'});
      this.$orgs['#sg-code-lineage-fill'].dispatchAction('html', lineageList);
    }
    else {
      this.$orgs['#sg-code-lineage'].dispatchAction('css', {display: 'none'});
    }

    // Draw reverse lineage.
    if (lineageR.length) {
      let lineageRList = '';

      for (let i = 0; i < lineageR.length; i++) {
        let cssClass = '';

        if (lineageR[i].lineageState) {
          cssClass = 'sg-pattern-state ' + lineageR[i].lineageState;
        }

        lineageRList += (i === 0) ? '' : ', ';
        lineageRList += '<a href="' + lineageR[i].lineagePath + '" class="' + cssClass + '">';
        lineageRList += lineageR[i].lineagePattern + '</a>';
      }

      this.$orgs['#sg-code-lineager'].dispatchAction('css', {display: 'block'});
      this.$orgs['#sg-code-lineager-fill'].dispatchAction('html', lineageRList);
    }
    else {
      this.$orgs['#sg-code-lineager'].dispatchAction('css', {display: 'none'});
    }

    // Identify any missing partials.
    if (missingPartials && missingPartials.length) {
      let missingPartialsList = '';

      for (let i = 0; i < missingPartials.length; i++) {
        missingPartialsList += (i === 0) ? '' : ', ';
        missingPartialsList += missingPartials[i];
      }

      this.$orgs['#sg-code-missing-partials'].dispatchAction('css', {display: 'block'});
      this.$orgs['#sg-code-missing-partials-fill'].dispatchAction('html', missingPartialsList);
    }
    else {
      this.$orgs['#sg-code-missing-partials'].dispatchAction('css', {display: 'none'});
    }

    // When clicking on a lineage item update the iframe.
    // Abstracted to a function outside any class scope, so there's no ambiguity about the `this` keyword.
    addLineageListeners(this.$orgs, this.uiFns);

    // Show pattern state.
    if (patternState) {
      const patternStateItem = '<span class=\'sg-pattern-state ' + patternState + '\'>' + patternState + '</span>';

      this.$orgs['#sg-code-pattern-info-state'].dispatchAction('html', patternStateItem);
    }
    else {
      this.$orgs['#sg-code-pattern-info-state'].dispatchAction('html', '');
    }

    // Fill in the name of the pattern.
    this.#root.$('#sg-code-pattern-info-rel-path').html(this.uiData.sourceFiles[patternPartial]);
    this.#root.$('#sg-code-pattern-info-pattern-name').html(`<strong>${patternPartial}</strong> at`);
    this.#root.$('#sg-code-lineage-pattern-name, #sg-code-lineager-pattern-name').html(patternPartial);
  }
}
