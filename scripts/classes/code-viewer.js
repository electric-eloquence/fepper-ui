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

    getPrintXHRErrorFunction = (codeViewer) => {
      return function () {
        let error;

        /* istanbul ignore else */
        if (root.location.protocol === 'file:' && !this.status) {
          // While it would be nice to offer internationalization of this error message, users shouldn't be using the
          // file protocol scheme in the first place!
          error = 'Access to XMLHttpRequest with the file protocol scheme has been blocked by CORS policy.';
        }
        else {
          error = `Status ${this.status}: ${this.statusText}`;
        }

        if (codeViewer.tabActive === 'e') {
          codeViewer.encoded = error;
          codeViewer.activateDefaultTab('e', error);
        }
        else if (codeViewer.tabActive === 'm') {
          codeViewer.mustache = error;
          codeViewer.activateDefaultTab('m', error);
        }
      };
    };

    receiveIframeMessage = (event) => {
      const data = this.uiFns.receiveIframeMessageBoilerplate(event);

      /* istanbul ignore if */
      if (!data) {
        return;
      }

      if (data.codeOverlay) { // This condition must come first.
        if (data.codeOverlay === 'on') {
          this.viewall = data.viewall || false;

          // Can assume we're not viewing the Mustache Browser.
          this.mustacheBrowser = false;

          if (data.openCode) {
            this.openCode();
          }

          // Update code.
          this.updateCode(data.lineage, data.lineageR, data.patternPartial, data.patternState);
        }
        else {
          this.closeCode();
        }
      }
      else if (typeof data.codeMustacheBrowser === 'boolean') {
        this.mustacheBrowser = data.codeMustacheBrowser;
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

            case 'ctrl+alt+h':
            case 'ctrl+shift+y':
              this.swapCode('e');

              break;

            case 'ctrl+alt+m':
            case 'ctrl+shift+u':
              this.swapCode('m');

              break;

            case 'esc':
              if (this.codeActive) {
                this.closeCode();
              }

              break;
          }

          break;
      }
    };

    // This runs once the AJAX request for the encoded markup is finished.
    // If the encoded tab is the current active tab, it adds the content to the default code container.
    getSaveEncodedFunction = (codeViewer) => {
      return function () {
        let encoded = this.responseText;

        // We sometimes want markup code to be in an HTML-like template language with tags delimited by stashes.
        // In order for js-beautify to indent such code correctly, any space between control characters #, ^, and /, and
        // the variable name must be removed. However, we want to add the spaces back later.
        // \u00A0 is &nbsp; a space character not on standard keyboards, and therefore a good delimiter.
        encoded = encoded.replace(/(\{\{#)(\s+)(\S+)/g, '$1$3$2\u00A0');
        encoded = encoded.replace(/(\{\{\^)(\s+)(\S+)/g, '$1$3$2\u00A0');
        encoded = encoded.replace(/(\{\{\/)(\s+)(\S+)/g, '$1$3$2\u00A0');

        encoded = root.html_beautify(encoded, {
          indent_handlebars: true,
          indent_size: 2,
          wrap_line_length: 0
        });

        // Add back removed spaces to retain the look intended by the author.
        encoded = encoded.replace(/(\{\{#)(\S+)(\s+)\u00A0/g, '$1$3$2');
        encoded = encoded.replace(/(\{\{\^)(\S+)(\s+)\u00A0/g, '$1$3$2');
        encoded = encoded.replace(/(\{\{\/)(\S+)(\s+)\u00A0/g, '$1$3$2');

        // Delete empty lines.
        encoded = encoded.replace(/^\s*$\n/gm, '');

        // Encode with HTML entities.
        encoded = root.he.encode(encoded);

        codeViewer.encoded = encoded;

        if (codeViewer.tabActive === 'e') {
          codeViewer.activateDefaultTab('e', encoded);
        }
      };
    };

    // Run this once the AJAX request for the mustache markup has finished.
    // If the mustache tab is the current active tab, add the content to the default code container.
    getSaveMustacheFunction = (codeViewer) => {
      return function () {
        let mustache = this.responseText;
        mustache = root.he.encode(mustache);
        codeViewer.mustache = mustache;

        if (codeViewer.tabActive === 'm') {
          codeViewer.activateDefaultTab('m', mustache);
        }
      };
    };

    /* CONSTRUCTOR */

    constructor(fepperUi) {
      this.codeActive = false;
      this.$orgs = fepperUi.requerio.$orgs;
      this.encoded = '';
      this.mustache = '';
      this.mustacheBrowser = false;
      this.tabActive = 'm';
      this.viewall = false;
    }

    // Getters for fepperUi instance props in case they are undefined at instantiation.

    get annotationsViewer() {
      return fepperUiInst.annotationsViewer;
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

      if (searchParams.view === 'code' || searchParams.view === 'c') {
        this.openCode();
      }

      // Open code panel on page load if config.defaultShowPatternInfo === true.
      else if (this.uiData.config.defaultShowPatternInfo) {
        this.openCode();
      }
    }

    /**
     * When loading the code view, make sure the active tab is highlighted and filled in appropriately.
     *
     * @param {string} type - Single letter that refers to classes and types.
     * @param {string} code - Code to appear in code view.
     */
    activateDefaultTab(type, code) {
      this.$orgs['.sg-code-title'].dispatchAction('removeClass', 'sg-code-title-active');

      switch (type) {
        case 'e':
          this.$orgs['#sg-code-title-html'].dispatchAction('addClass', 'sg-code-title-active');

          break;

        case 'm':
          this.$orgs['#sg-code-title-mustache'].dispatchAction('addClass', 'sg-code-title-active');

          break;
      }

      this.$orgs['#sg-code-fill'].dispatchAction('html', code);
      root.Prism.highlightElement(this.$orgs['#sg-code-fill'][0]);
    }

    /**
     * Clear any selection of code when swapping tabs or opening a new pattern.
     */
    clearSelection() /* istanbul ignore next */ {
      if (!this.codeActive || !root.getSelection) {
        return;
      }

      if (root.getSelection().empty) {
        root.getSelection().empty();
      }
      else if (root.getSelection().removeAllRanges) {
        root.getSelection().removeAllRanges();
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
      // Do nothing if viewing Mustache Browser.
      if (this.mustacheBrowser) {
        return;
      }

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

    scrollViewall() /* istanbul ignore next */ {
      this.$orgs['#sg-viewport'][0].contentWindow.postMessage({codeScrollViewall: true}, this.uiProps.targetOrigin);
    }

    /**
     * Depending on what tab is clicked, swap out the code container. Make sure Prism highlight is added.
     *
     * @param {string} type - Single letter abbreviation of type.
     */
    swapCode(type) {
      if (!this.codeActive) {
        return;
      }

      let fill = '';
      this.tabActive = type;

      this.$orgs['.sg-code-title'].dispatchAction('removeClass', 'sg-code-title-active');

      switch (type) {
        case 'e':
          fill = this.encoded;

          this.$orgs['#sg-code-title-html'].dispatchAction('addClass', 'sg-code-title-active');

          break;

        case 'm':
          fill = this.mustache;

          this.$orgs['#sg-code-title-mustache'].dispatchAction('addClass', 'sg-code-title-active');

          break;
      }

      this.$orgs['#sg-code-fill'].dispatchAction('html', fill);
      root.Prism.highlightElement(this.$orgs['#sg-code-fill'][0]);
      this.clearSelection();
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
     */
    updateCode(lineage, lineageR, patternPartial, patternState) {

      // Clear any selections that might have been made.
      this.clearSelection();

      // Set data-patternpartial attribute.
      this.$orgs['#sg-code-container'].dispatchAction('attr', {'data-patternpartial': patternPartial});

      // Draw lineage.
      if (lineage.length) {
        let lineageList = '';

        for (let i = 0; i < lineage.length; i++) {
          let cssClass = '';

          if (lineage[i].lineageState) {
            cssClass = 'sg-pattern-state ' + lineage[i].lineageState;
          }

          lineageList += (i === 0) ? '' : ', ';
          lineageList += '<a href="' + lineage[i].lineagePath + '" class="' + cssClass + '" data-patternpartial="';
          lineageList += lineage[i].lineagePattern + '">' + lineage[i].lineagePattern + '</a>';
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
          lineageRList += '<a href="' + lineageR[i].lineagePath + '" class="' + cssClass + '" data-patternpartial="';
          lineageRList += lineageR[i].lineagePattern + '">' + lineageR[i].lineagePattern + '</a>';
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

      // Get the file name of the pattern so we can update the tabs of code that show in the viewer.
      const filename = this.uiData.patternPaths[patternPartial];
      const patternExtension = this.uiData.config.patternExtension || '.mustache';

      // Request the encoded markup version of the pattern.
      const e = new root.XMLHttpRequest();
      e.onload = this.getSaveEncodedFunction(this);
      e.onerror = this.getPrintXHRErrorFunction(this);
      e.open('GET', filename.replace(/\.html/, '.markup-only.html') + '?' + (new Date()).getTime(), true);
      e.send();

      // Request the Mustache markup version of the pattern.
      const m = new root.XMLHttpRequest();
      m.onload = this.getSaveMustacheFunction(this);
      m.onerror = this.getPrintXHRErrorFunction(this);
      m.open('GET', filename.replace(/\.html/, patternExtension) + '?' + (new Date()).getTime(), true);
      m.send();
    }
  }

  return new CodeViewer(fepperUiInst);
}
