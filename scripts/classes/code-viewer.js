/**
 * Copyright (c) 2013 Brad Frost, http://bradfrostweb.com & Dave Olsen, http://dmolsen.com
 * Licensed under the MIT license.
 */

let root;

// Declared outside class scope because it requires function-scoped `this` context.
// Not in the listeners directory, because we don't need class scoping.
function addLineageListeners($orgs, uiFns) {
  // Must be jQuery, not Requerio, because the HTML was dynamically inserted by .updateMetadata() on the class.
  // Since it will be repeatedly generated, the following cannot be in a listeners class, where they are added but once.
  /* istanbul ignore if */
  if (typeof window === 'object') {
    root.$('#sg-code-lineage-fill a, #sg-code-lineager-fill a').on('click', function (e) {
      e.preventDefault();

      const messageObj = {
        event: 'patternlab.updatePath',
        path: root.$(this).attr('href')
      };
      const patternPartial = this.textContent.trim();

      uiFns.updatePath(messageObj, patternPartial);
    });
  }
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
      this.viewall = data.viewall; // DEPRECATED.
      this.annotationsViewer.viewall = data.viewall; // DEPRECATED.

      // This is necessary so the Markdown "Edit" button is not displayed.
      this.$orgs['#patternlab-body'].dispatchAction('addClass', 'viewall');
    }
    else if (data.viewall === false) {
      this.viewall = data.viewall; // DEPRECATED.

      // This is necessary so the Markdown "Edit" button is displayed.
      this.$orgs['#patternlab-body'].dispatchAction('removeClass', 'viewall');
    }

    switch (data.event) {
      case 'patternlab.keyPress':
        switch (data.keyPress) {
          case 'ctrl+shift+c':
            this.toggleCode();

            break;

            // TODO: Create keyboard shortcuts to switch between Feplet and Requerio tabs.

          case 'esc':
            if (this.codeActive && this.uiProps.dockPosition === 'bottom') {
              this.closeCode();
            }

            break;
        }

        break;

      case 'patternlab.updatePath':
        this.uiFns.updatePath(data, data.patternPartial);

        break;
    }

    if (data.lineage) {
      this.updateMetadata(data.lineage, data.lineageR, data.patternPartial, data.patternState, data.missingPartials);
      this.setPanelContent('feplet', data.patternPartial);
      this.setPanelContent('markdown', data.patternPartial);

      const paneMarkdownNaDisplay = this.$orgs['#sg-code-pane-markdown-na'].getState().css.display;
      const paneMarkdownCommitDisplay = this.$orgs['#sg-code-pane-markdown-commit'].getState().css.display;
      const paneMarkdownLoadAnimDisplay = this.$orgs['#sg-code-pane-markdown-load-anim'].getState().css.display;

      if (!paneMarkdownNaDisplay && !paneMarkdownCommitDisplay && !paneMarkdownLoadAnimDisplay) {
        this.$orgs['#sg-code-pane-markdown'].dispatchAction('css', {display: 'block'});
      }
    }
  };

  // Private class fields.
  #fepperUi;
  #root;

  /* CONSTRUCTOR */

  constructor(fepperUi, root_) {
    root = root_;

    this.#fepperUi = fepperUi;
    this.#root = root;

    this.codeActive = false;
    this.mdPath = null;
    this.$orgs = fepperUi.requerio.$orgs;
    this.patternPartial = null;
    this.requerio = fepperUi.requerio;
    this.stoked = false;
    this.tabActive = 'feplet';
    this.viewall = false; // DEPRECATED.
  }

  // Getters for fepperUi instance props in case they are undefined at instantiation.

  get annotationsViewer() {
    return this.#fepperUi.annotationsViewer;
  }

  get dataSaver() {
    return this.#fepperUi.dataSaver;
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
    let gitInterface = dataSaverGitInterface === 'true';
    this.tabActive = tabActive || this.tabActive;
    this.patternPartial = searchParams.p || this.uiData.config.defaultPattern;

    if (searchParams.view === 'code' || searchParams.view === 'c' || this.uiData.config.defaultShowPatternInfo) {
      this.openCode();
    }

    if (gitInterface) {
      // If interfacing with Git, preemptively hide the Markdown edit button.
      // Reenable after a git pull with no conflicts.
      // Not easy to test because reenablement requires a git pull on the shell, and we aren't mocking shell commands.
      // However, this is very easy to see during actual user interaction.
      /* istanbul ignore next */
      this.$orgs['#sg-code-btn-markdown-edit'].dispatchAction('css', {display: 'none'});
    }

    // Determine if the project has been set up with Git.
    return this.activateTabAndPanel(this.tabActive)
      .then(() => {
        return fetch(
          '/git-interface', {
            method: 'POST',
            body: new URLSearchParams('args[0]=--version')
          })
          .then((response) => {
            /* istanbul ignore else */
            if (response.status === 200) {
              return Promise.resolve();
            }
            else {
              return response.text();
            }
          })
          .then((responseText) => {
            if (responseText) {
              return Promise.reject(responseText);
            }
            else {
              return fetch(
                '/git-interface', {
                  method: 'POST',
                  body: new URLSearchParams('args[0]=remote')
                });
            }
          })
          .then((response) => {
            /* istanbul ignore else */
            if (response.status === 200) {
              return Promise.resolve();
            }
            else {
              return response.text();
            }
          })
          .then((responseText) => {
            if (responseText) {
              return Promise.reject(responseText);
            }
            else {
              if (dataSaverGitInterface === 'true' || this.uiData.config.gitInterface) {
                this.$orgs['#sg-code-radio-git-on'].dispatchAction('prop', {checked: true});
                this.$orgs['#sg-code-pane-git'].dispatchAction('addClass', 'git-interface-on');
              }

              if (dataSaverGitInterface === null && this.uiData.config.gitInterface) {
                gitInterface = true;

                // If interfacing with Git, preemptively hide the Markdown edit button.
                // Reenable after a git pull with no conflicts.
                this.$orgs['#sg-code-btn-markdown-edit'].dispatchAction('css', {display: 'none'});
                this.#fepperUi.dataSaver.updateValue('gitInterface', 'true');
              }
            }

            this.stoked = true;

            return this.setPanelContent('git', this.patternPartial, gitInterface);
          })
          .catch((rejection) => {
            /* istanbul ignore else */
            if (typeof rejection === 'string' && rejection.includes('section id="forbidden"')) {
              const parser = new DOMParser();
              const doc = parser.parseFromString(rejection, 'text/html');
              const forbidden = doc.getElementById('forbidden');
              const forbiddenClassName = forbidden.getAttribute('class');

              forbidden.setAttribute('class', forbiddenClassName + ' sg-code-pane-content-warning');
              this.$orgs['#sg-code-pane-git-na'].dispatchAction('html', forbidden);
            }
            else if (typeof rejection === 'string' && rejection.startsWith('fatal:')) {
              this.#fepperUi.dataSaver.updateValue('gitInterface', 'false');
            }
            else if (rejection) {
              // eslint-disable-next-line no-console
              console.error(rejection);
            }

            this.stoked = true;

            this.$orgs['#sg-code-pane-git-na'].dispatchAction('css', {display: 'block'});

            return this.setPanelContent('git', this.patternPartial, gitInterface);
          });
      });
  }

  activateMarkdownTextarea() {
    const markdownPreState = this.$orgs['#sg-code-pre-language-markdown'].getState();

    this.$orgs['#sg-code-pane-markdown'].dispatchAction('css', {display: ''});
    this.$orgs['#sg-code-pane-markdown-edit'].dispatchAction('css', {display: 'block'});

    this.$orgs['#sg-code-textarea-markdown']
      .dispatchAction('width', markdownPreState.width)
      .dispatchAction('height', markdownPreState.height + 21); // line-height is 21px.
    this.$orgs['#sg-code-textarea-markdown'].focus();
  }

  /**
   * When loading the code view, make sure the active tab is highlighted and filled in appropriately.
   *
   * @param {string} type - The panel to activate.
   * @returns {promise} A promise on which to perform additional actions.
   */
  activateTabAndPanel(type) {
    const gitInterface = this.#fepperUi.dataSaver.findValue('gitInterface') === 'true';
    this.tabActive = type;

    this.$orgs['.sg-code-tab'].dispatchAction('removeClass', 'sg-code-tab-active');
    this.$orgs['#sg-code-tab-' + type].dispatchAction('addClass', 'sg-code-tab-active');
    this.$orgs['.sg-code-panel'].dispatchAction('removeClass', 'sg-code-panel-active');
    this.$orgs['#sg-code-panel-' + type].dispatchAction('addClass', 'sg-code-panel-active');
    this.dataSaver.updateValue('tabActive', type);

    switch (type) {
      case 'markdown': {
        if (!this.patternPartial.startsWith('viewall')) {
          return this.setPanelContent(type)
            .then(() => {
              if (this.stoked && this.mdPath) {
                return this.setPanelContent('git', this.patternPartial, gitInterface);
              }
              else {
                return Promise.resolve();
              }
            });
        }

        /* istanbul ignore next */
        break;
      }
      case 'git': {
        if (this.stoked) {
          return this.setPanelContent(type, this.patternPartial, gitInterface);
        }

        break;
      }
      default: {
        return this.setPanelContent(type, this.patternPartial, gitInterface);
      }
    }

    return Promise.resolve();
  }

  addRevision() {
    return fetch(
      '/git-interface', {
        method: 'POST',
        body: new URLSearchParams('args[0]=add')
      })
      .then(response => response.text())
      .then(responseText => responseText)
      .catch((err) => /* istanbul ignore next */ {
        // eslint-disable-next-line no-console
        console.error(err);
      });
  }

  closeCode() {
    // Flag that viewer is inactive.
    this.codeActive = false;

    this.viewerHandler.closeViewer();
    this.$orgs['#sg-t-code'].dispatchAction('removeClass', 'active');
    this.$orgs['#sg-code-container'].dispatchAction('removeClass', 'active');
  }

  commitRevision(body) {
    return fetch(
      '/git-interface', {
        method: 'POST',
        body: new URLSearchParams(body)
      })
      .then((response) => {
        if (response.status === 200) {
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
              reject(response.stack);
            }
          });
      });
  }

  deActivateMarkdownTextarea() {
    const markdownTextareaVal = this.$orgs['#sg-code-textarea-markdown'].getState().val;

    this.$orgs['#sg-code-textarea-markdown'].blur();
    this.$orgs['#sg-code-pane-markdown-edit'].dispatchAction('css', {display: ''});
    this.$orgs['#sg-code-pane-markdown-commit'].dispatchAction('css', {display: ''});
    this.$orgs['#sg-code-code-language-markdown'].dispatchAction('html', markdownTextareaVal);
    this.$orgs['#sg-code-btn-markdown-edit'].dispatchAction('css', {display: 'block'});
    this.$orgs['#sg-code-pane-markdown'].dispatchAction('css', {display: 'block'});
  }

  openCode() {
    // Flag that viewer is active.
    this.codeActive = true;

    // Make sure the annotations viewer is off before showing code.
    this.annotationsViewer.closeAnnotations();
    this.viewerHandler.openViewer();
    this.$orgs['#sg-t-code'].dispatchAction('addClass', 'active');
    this.$orgs['#sg-code-container'].dispatchAction('addClass', 'active');

    // If viewall, scroll to the focused pattern.
    /* istanbul ignore if */
    if (this.uiProps.viewall) {
      this.scrollViewall();
    }
  }

  pushRevision() {
    return fetch(
      '/git-interface', {
        method: 'POST',
        body: new URLSearchParams('args[0]=push')
      })
      .then((response) => {
        if (response.status === 200) {
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
              reject(response.stack);
            }
          });
      });
  }

  saveMarkdown() {
    let gitInterface;

    return fetch('/gatekeeper')
      .then((response) => {
        if (response.status === 200) {
          this.$orgs['#sg-code-code-language-markdown'].dispatchAction('html');

          const markdownBefore = this.$orgs['#sg-code-code-language-markdown'].getState().html;
          const markdownTextareaVal = this.$orgs['#sg-code-textarea-markdown'].getState().val;

          if (markdownTextareaVal !== markdownBefore) {
            const body = 'markdown_edited=' + encodeURIComponent(markdownTextareaVal) + '&rel_path=' +
              encodeURIComponent(this.uiData.sourceFiles[this.patternPartial]);

            return fetch(
              '/markdown-editor', {
                method: 'POST',
                body: new URLSearchParams(body)
              });
          }
          else {
            return Promise.reject();
          }
        }
        else {
          return Promise.reject(response);
        }
      })
      .then((response) => {
        if (response.status === 200) {
          return this.setPanelContent('markdown', this.patternPartial);
        }
        else {
          /* istanbul ignore next */
          return Promise.reject(response);
        }
      })
      .then(() => {
        gitInterface = this.#fepperUi.dataSaver.findValue('gitInterface') === 'true';

        if (gitInterface) {
          this.$orgs['#sg-code-pane-markdown-edit'].dispatchAction('css', {display: ''});
          this.$orgs['#sg-code-pane-markdown-load-anim'].dispatchAction('css', {display: 'block'});

          return this.setPanelContent('git', this.patternPartial, gitInterface);
        }
        else {
          return Promise.resolve();
        }
      })
      .then((response) => {
        if (gitInterface) {
          this.$orgs['#sg-code-pane-markdown-load-anim'].dispatchAction('css', {display: ''});
          // If interfacing with Git, preemptively hide the Markdown edit button.
          // Reenable after a git pull with no conflicts.
          this.$orgs['#sg-code-btn-markdown-edit'].dispatchAction('css', {display: 'none'});
        }
        else {
          this.$orgs['#sg-code-pane-markdown-edit'].dispatchAction('css', {display: ''});
        }

        if (response && response.status === 200) {
          this.$orgs['#sg-code-pane-markdown'].dispatchAction('css', {display: ''});
          this.$orgs['#sg-code-pane-markdown-commit'].dispatchAction('css', {display: 'block'});
          this.$orgs['#sg-code-textarea-commit-message'].dispatchAction('focus');
        }
        else {
          this.$orgs['#sg-code-pane-markdown'].dispatchAction('css', {display: 'block'});
        }
      })
      .catch((response) => {
        if (response && response.status === 403) {
          this.$orgs['#sg-code-btn-markdown-edit'].dispatchAction('css', {display: 'none'});
          this.$orgs['#sg-code-pane-markdown-edit'].dispatchAction('css', {display: 'none'});
        }

        if (response && response.status && response.statusText) {
          // eslint-disable-next-line no-console
          console.error(`Status ${response.status}: ${response.statusText}`);
        }
        else {
          /* istanbul ignore if */
          if (response) {
            // eslint-disable-next-line no-console
            console.error(response);
          }

          this.$orgs['#sg-code-pane-markdown'].dispatchAction('css', {display: 'block'});
          this.$orgs['#sg-code-pane-markdown-edit'].dispatchAction('css', {display: ''});
          this.$orgs['#sg-code-pane-markdown-commit'].dispatchAction('css', {display: ''});
          this.$orgs['#sg-code-textarea-commit-message'].dispatchAction('val', '');
        }
      });
  }

  scrollViewall() /* istanbul ignore next */ {
    this.$orgs['#sg-viewport'][0].contentWindow.postMessage({codeScrollViewall: true}, this.uiProps.targetOrigin);
  }

  /**
   * Set the content for the activated panel.
   *
   * @param {string} type - The panel to activate.
   * @param {[string]} patternPartial - The pattern for which the panel content is being set.
   * @param {[boolean]} gitInterface - Whether Git Interface is on or off.
   * @returns {promise} A promise on which to perform additional actions.
   */
  setPanelContent(type, patternPartial, gitInterface) {
    this.patternPartial = patternPartial || this.patternPartial;

    switch (type) {
      case 'feplet': {
        /* istanbul ignore else */
        if (this.$orgs['#sg-code-panel-feplet'].length) {
          this.$orgs['#sg-code-panel-feplet'][0]
            .contentWindow.location.replace(`/mustache-browser?partial=${this.patternPartial}`);
          this.$orgs['#sg-code-panel-feplet'][0]
            .addEventListener('load', () => {
              const height = this.$orgs['#sg-code-panel-feplet'][0].contentWindow.document.documentElement.offsetHeight;

              this.$orgs['#sg-code-panel-feplet'].dispatchAction('css', {height: `${height}px`, visibility: ''});
            });
        }
        // DEPRECATED: Here for backward-compatibility. Will be removed.
        else {
          this.$orgs['#sg-code-fill']
            .dispatchAction('text', 'Update Fepper NPM to make this work correctly.')
            .dispatchAction('css', {color: 'red'});
        }

        return Promise.resolve();
      }
      case 'markdown': {
        const config = this.uiData.config;
        const patternPath = this.uiData.patternPaths[this.patternPartial];
        const mdPath = patternPath.slice(0, -(config.outfileExtension.length)) + config.frontMatterExtension;
        let textareaMarkdownHtml;

        return fetch('/gatekeeper?tool=the+Markdown+Editor')
          .then((response) => {
            if (response.status === 200) {
              return fetch(
                `/${mdPath}?${Date.now()}`, {
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
                this.mdPath = mdPath;

                return response.text();
              }
              else {
                this.mdPath = null;

                return Promise.reject();
              }
            }
            else if (typeof response === 'string') {
              const parser = new DOMParser();
              const doc = parser.parseFromString(response, 'text/html');
              const forbidden = doc.getElementById('forbidden');
              const forbiddenClassName = forbidden.getAttribute('class');

              forbidden.setAttribute('class', forbiddenClassName + ' sg-code-pane-content-warning');
              this.$orgs['#sg-code-pane-markdown-na'].dispatchAction('html', forbidden);

              return Promise.reject();
            }
          })
          .then((responseText) => {
            if (responseText) {
              textareaMarkdownHtml = responseText;

              this.$orgs['#sg-code-pane-markdown-na'].dispatchAction('css', {display: ''});
              this.$orgs['#sg-code-code-language-markdown'].dispatchAction('html', textareaMarkdownHtml);
              this.$orgs['#sg-code-textarea-markdown'].dispatchAction('html', textareaMarkdownHtml);

              // After this promise fully resolves, determine whether or not to display #sg-code-pane-markdown
              // This needs to occur per invocation of .setPanelContent('markdown', ...)
            }

            return Promise.resolve();
          })
          .catch((err) => {
            /* istanbul ignore if */
            if (err) {
              // eslint-disable-next-line no-console
              console.error(err);
            }

            this.$orgs['#sg-code-pane-markdown'].dispatchAction('css', {display: ''});
            this.$orgs['#sg-code-pane-markdown-na'].dispatchAction('css', {display: 'block'});
          });
      }
      case 'git': {
        const gitNaDisplay = this.$orgs['#sg-code-pane-git-na'].getState().css.display;

        if (gitNaDisplay === 'block') {
          return Promise.resolve();
        }
        else {
          if (gitInterface) {
            let gitInterfaceResponse;

            return fetch(
              '/git-interface', {
                method: 'POST',
                body: new URLSearchParams('args[0]=pull')
              })
              .then((response) => {
                if (response && response.status === 200) {
                  gitInterfaceResponse = response;

                  return Promise.resolve();
                }
                else {
                  return response.json();
                }
              })
              .then((responseJson) => {
                if (responseJson) {
                  return Promise.reject(responseJson);
                }
                else {
                  // Since we know there are no Git conflicts, reenable Markdown edit button.
                  this.$orgs['#sg-code-btn-markdown-edit'].dispatchAction('css', {display: ''});
                  this.$orgs['#sg-code-pane-git-na'].dispatchAction('css', {display: ''});
                  this.$orgs['#sg-code-pane-git'].dispatchAction('css', {display: 'block'});

                  return Promise.resolve(gitInterfaceResponse);
                }
              })
              .catch((err) => {
                this.$orgs['#sg-code-pane-git'].dispatchAction('css', {display: ''});

                if (
                  gitInterface &&
                  err && err.message && err.message.startsWith('Command failed:')
                ) {
                  this.$orgs['#sg-code-btn-markdown-edit'].dispatchAction('css', {display: 'none'});
                  this.$orgs['#sg-code-tab-git'].dispatchAction('addClass', 'sg-code-tab-warning');
                  this.$orgs['#sg-code-pane-git-na'].dispatchAction('html',
                    '<pre class="sg-code-pane-content-warning"><code>' + err.message + '</code></pre>');
                  this.$orgs['#sg-code-btn-git-disable'].dispatchAction('css', {display: 'block'});
                }

                this.$orgs['#sg-code-pane-git-na'].dispatchAction('css', {display: 'block'});
              });
          }
          else {
            return new Promise(
              (resolve) => {
                this.$orgs['#sg-code-pane-git'].dispatchAction('css', {display: 'block'});

                resolve();
              });
          }
        }
      }
      case 'requerio': {
        // TODO: Time-travel.
        return Promise.resolve();
      }
    }
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
   * When turning on or switching between patterns with code viewer on, make sure we get the code from the pattern via
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
