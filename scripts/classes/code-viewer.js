/**
 * Copyright (c) 2013 Brad Frost, http://bradfrostweb.com & Dave Olsen, http://dmolsen.com
 * Licensed under the MIT license.
 */

let root;

// Declared outside class scope because it requires function-scoped `this` context.
// Not in the listeners directory, because we don't need class scoping.
function addLineageListeners($orgs, uiProps) {
  // Must be jQuery, not Requerio, because the HTML was dynamically inserted by the .updateCode() method on the class.
  // Since it will be repeatedly generated, the following cannot be in a listeners class, where they are added but once.
  /* istanbul ignore if */
  if (typeof window === 'object') {
    root.$('#sg-code-lineage-fill a, #sg-code-lineager-fill a').on('click', function (e) {
      e.preventDefault();

      const obj = {
        event: 'patternlab.updatePath',
        path: root.$(this).attr('href')
      };

      $orgs['#sg-viewport'][0].contentWindow.postMessage(obj, uiProps.targetOrigin);
    });
  }
}

// TODO: Replace closure with private class field when there is greater browser support.
export default function (fepperUiInst, root_) {
  root = root_;

  class CodeViewer {

    /* CLASS FIELDS */
    // Declared as class fields to retain function-scoped `this` context while keeping the class constructor tidy.
    // Exposed as properties on the instance so they can be unit tested.

    receiveIframeMessage = (event) => {
      const data = this.uiFns.receiveIframeMessageBoilerplate(event);

      /* istanbul ignore if */
      if (!data) {
        return;
      }

      if (data.viewall) {
        // This is necessary so the Markdown "Edit" button isn't displayed.
        this.$orgs['#patternlab-body'].dispatchAction('addClass', 'viewall');
      }
      else {
        this.$orgs['#patternlab-body'].dispatchAction('removeClass', 'viewall');
      }

      if (data.codeOverlay) { // This condition must come first.
        if (data.codeOverlay === 'on') {
          this.viewall = data.viewall || false;

          this.updateCode(data.lineage, data.lineageR, data.patternPartial, data.patternState);
          this.activateTabAndPanel(this.tabActive);

          if (data.openCode && !this.codeActive) {
            this.openCode();
          }
        }
        else {
          this.closeCode();
        }
      }
      else if (typeof data.codeViewall === 'boolean') {
        this.viewall = data.codeViewall;
      }

      switch (data.event) {
        case 'patternlab.keyPress':
          switch (data.keyPress) {
            case 'ctrl+shift+c':
              this.toggleCode();

              // If viewall, scroll to the focused pattern.
              /* istanbul ignore if */
              if (this.viewall && this.codeActive) {
                this.scrollViewall();
              }

              break;

              // TODO: Create keyboard shortcuts to switch between Feplet and Requerio tabs.

            case 'esc':
              if (this.codeActive && this.uiProps.dockPosition === 'bottom') {
                this.closeCode();
              }

              break;
          }

          break;
      }
    };

    /* CONSTRUCTOR */

    constructor(fepperUi) {
      this.codeActive = false;
      this.$orgs = fepperUi.requerio.$orgs;
      this.patternPartial = null;
      this.requerio = fepperUi.requerio;
      this.tabActive = 'feplet';
      this.viewall = false;
    }

    // Getters for fepperUi instance props in case they are undefined at instantiation.

    get annotationsViewer() {
      return fepperUiInst.annotationsViewer;
    }

    get dataSaver() {
      return fepperUiInst.dataSaver;
    }

    get uiData() {
      return fepperUiInst.uiData;
    }

    get uiFns() {
      return fepperUiInst.uiFns;
    }

    get uiProps() {
      return fepperUiInst.uiProps;
    }

    get urlHandler() {
      return fepperUiInst.urlHandler;
    }

    get viewerHandler() {
      return fepperUiInst.viewerHandler;
    }

    /* METHODS */

    // Declared before other methods because it must be unit tested before other methods. Be sure to e2e test .stoke().
    stoke() {
      // Load the query strings in case code view has to show by default.
      const searchParams = this.urlHandler.getSearchParams();
      const tabActive = this.dataSaver.findValue('tabActive');
      this.tabActive = tabActive || this.tabActive;
      this.patternPartial = searchParams.p;

      if (searchParams.view === 'code' || searchParams.view === 'c') {
        this.openCode();
      }
      // Open code panel on page load if config.defaultShowPatternInfo === true.
      else if (this.uiData.config.defaultShowPatternInfo) {
        this.openCode();
      }
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
     * @param {string} type - Single letter that refers to classes and types.
     */
    activateTabAndPanel(type) {
      this.tabActive = type;

      this.$orgs['.sg-code-tab'].dispatchAction('removeClass', 'sg-code-tab-active');
      this.$orgs['.sg-code-panel'].dispatchAction('removeClass', 'sg-code-panel-active');
      this.dataSaver.updateValue('tabActive', type);

      switch (type) {
        case 'feplet': {
          this.$orgs['#sg-code-tab-feplet'].dispatchAction('addClass', 'sg-code-tab-active');
          this.$orgs['#sg-code-panel-feplet'].dispatchAction('addClass', 'sg-code-panel-active');
          this.setPanelContent(type);

          break;
        }
        case 'markdown': {
          // TODO: Viewall behavior:
          //       To replicate:
          //         1. Open compounds-text viewall
          //         2. Activate markdown tab and panel
          //         3. Click code button for footer
          //
          //       While clicking code buttons on viewall, update markdown panel.
          //       Try editing while on viewall.
          this.$orgs['#sg-code-tab-markdown'].dispatchAction('addClass', 'sg-code-tab-active');
          this.$orgs['#sg-code-panel-markdown'].dispatchAction('addClass', 'sg-code-panel-active');

          const panelMarkdown = this.$orgs['#sg-code-panel-markdown'].getState().html;

          if (!panelMarkdown) {
            this.setPanelContent(type);
          }

          break;
        }
        /* istanbul ignore next */
        case 'requerio': {

          break;
        }
        /* istanbul ignore next */
        case 'git': {

          break;
        }
      }
    }

    closeCode() {
      // Tell the pattern that code viewer has been turned off.
      const obj = {codeToggle: 'off'};
      // Flag that viewer is inactive.
      this.codeActive = false;

      this.viewerHandler.closeViewer();
      this.$orgs['#sg-viewport'][0].contentWindow.postMessage(obj, this.uiProps.targetOrigin);
      this.$orgs['#sg-t-code'].dispatchAction('removeClass', 'active');
      this.$orgs['#sg-code-container'].dispatchAction('removeClass', 'active');
    }

    openCode() {
      // Tell the pattern that code viewer has been turned on.
      const objCodeToggle = {codeToggle: 'on'};
      // Flag that viewer is active.
      this.codeActive = true;

      // Make sure the annotations viewer is off before showing code.
      this.annotationsViewer.closeAnnotations();
      this.viewerHandler.openViewer();
      this.$orgs['#sg-viewport'][0].contentWindow.postMessage(objCodeToggle, this.uiProps.targetOrigin);
      this.$orgs['#sg-t-code'].dispatchAction('addClass', 'active');
      this.$orgs['#sg-code-container'].dispatchAction('addClass', 'active');
    }

    resetPanels(patternPartial) {
      this.patternPartial = patternPartial;

      this.unsetPanelContent('feplet');
      this.unsetPanelContent('markdown');
      this.unsetPanelContent('requerio');
      this.unsetPanelContent('git');
      this.setPanelContent(this.tabActive);
    }

    scrollViewall() /* istanbul ignore next */ {
      this.$orgs['#sg-viewport'][0].contentWindow.postMessage({codeScrollViewall: true}, this.uiProps.targetOrigin);
    }

    setPanelContent(type) {
      switch (type) {
        case 'feplet': {
          this.$orgs['#sg-code-panel-feplet'][0]
            .contentWindow.location.replace(`/mustache-browser?partial=${this.patternPartial}`);
          this.$orgs['#sg-code-panel-feplet'][0]
            .addEventListener('load', () => {
              const height = this.$orgs['#sg-code-panel-feplet'][0].contentWindow.document.documentElement.offsetHeight;

              this.$orgs['#sg-code-panel-feplet'].dispatchAction('css', {height: `${height}px`, visibility: ''});
            });

          break;
        }
        case 'markdown': {
          const codeViewer = this;
          const config = this.uiData.config;
          const patternPath = this.uiData.patternPaths[this.patternPartial];
          const mdPath = patternPath.slice(0, -(config.outfileExtension.length)) + config.frontMatterExtension;

          const xhr = new root.XMLHttpRequest();
          xhr.onload = function () {
            if (this.status === 200) {
              const markdownTextareaState = codeViewer.$orgs['#sg-code-textarea-markdown'].getState();

              codeViewer.$orgs['#sg-code-pane-no-markdown'].dispatchAction('css', {display: ''});
              codeViewer.$orgs['#sg-code-code-language-markdown'].dispatchAction('html', this.responseText);
              codeViewer.$orgs['#sg-code-pane-markdown'].dispatchAction('css', {display: 'block'});

              if (!markdownTextareaState.html) {
                codeViewer.$orgs['#sg-code-textarea-markdown'].dispatchAction('html', this.responseText);
              }
            }
            else {
              codeViewer.$orgs['#sg-code-pane-markdown'].dispatchAction('css', {display: ''});
              codeViewer.$orgs['#sg-code-pane-no-markdown'].dispatchAction('css', {display: 'block'});
            }
          };
          /* istanbul ignore next */
          xhr.onerror = function () {
            // eslint-disable-next-line no-console
            console.error(`Status ${this.status}: ${this.statusText}`);
          };

          xhr.open('GET', mdPath + '?' + Date.now());
          xhr.send();

          break;
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

    unsetPanelContent(type) {
      switch (type) {
        case 'feplet':
          this.$orgs['#sg-code-panel-feplet'].dispatchAction('css', {height: '', visibility: 'hidden'});
          this.$orgs['#sg-code-panel-feplet'][0].contentWindow.location.replace('about:blank');

          break;

        case 'markdown':
          this.$orgs['#sg-code-code-language-markdown'].dispatchAction('html', '');

          if (this.$orgs['#sg-code-textarea-markdown'].length) {
            this.$orgs['#sg-code-textarea-markdown'].dispatchAction('html', '');
          }

          break;

        default:
          this.$orgs['#sg-code-panel-' + type].dispatchAction('html', '');
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
     */
    updateCode(lineage, lineageR, patternPartial, patternState) {
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

      // When clicking on a lineage item update the iframe.
      // Abstracted to a function outside any class scope, so there's no ambiguity about the `this` keyword.
      addLineageListeners(this.$orgs, this.uiProps);

      // Show pattern state.
      if (patternState) {
        const patternStateItem = '<span class=\'sg-pattern-state ' + patternState + '\'>' + patternState + '</span>';

        this.$orgs['#sg-code-pattern-info-state'].dispatchAction('html', patternStateItem);
      }
      else {
        this.$orgs['#sg-code-pattern-info-state'].dispatchAction('html', '');
      }

      // Fill in the name of the pattern.
      root.$('#sg-code-pattern-info-rel-path').html(this.uiData.sourceFiles[patternPartial]);
      root.$('#sg-code-pattern-info-pattern-name').html(`<strong>${patternPartial}</strong> at`);
      root.$('#sg-code-lineage-pattern-name, #sg-code-lineager-pattern-name').html(patternPartial);
    }
  }

  return new CodeViewer(fepperUiInst);
}
