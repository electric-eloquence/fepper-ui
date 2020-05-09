// TODO: Replace closure with private class field when there is greater browser support.
export default function (fepperUiInst, root) {

  /**
   * Limit this class to handling UI navigation, and the sizing and loading of the iframe.
   *
   * Copyright (c) 2013-2016 Dave Olsen, http://dmolsen.com
   * Licensed under the MIT license.
   */
  class PatternlabViewer {

    /* CLASS FIELD */
    // Declared as a class field to retain the Event function prototype while keeping the class constructor tidy.
    // Exposed as a property on the instance so it can be unit tested.

    receiveIframeMessage = (event) => {
      const data = this.uiFns.receiveIframeMessageBoilerplate(event);

      /* istanbul ignore if */
      if (!data) {
        return;
      }

      switch (data.event) {
        case 'patternlab.bodyClick': {
          this.uiFns.closeAllPanels();

          break;
        }
        case 'patternlab.keyPress': {
          switch (data.keyPress) {
            case 'ctrl+alt+0':
            case 'ctrl+shift+0':
              this.goXXSmall();

              break;

            case 'ctrl+shift+x':
              this.goXSmall();

              break;

            case 'ctrl+shift+s':
              this.goSmall();

              break;

            case 'ctrl+shift+m':
              this.goMedium();

              break;

            case 'ctrl+alt+l':
              this.goLarge();

              break;

            case 'ctrl+shift+l':
              this.goLarge();

              /* istanbul ignore if */
              if (root.navigator.userAgent.indexOf('Edge') > -1) {
                alert(this.uiProps.warnCtrlShiftLEdge);
              }

              break;

            case 'ctrl+alt+w':
            case 'ctrl+shift+w':
              this.goWhole();

              break;

            case 'ctrl+alt+r':
              this.goRandom();

              break;

            case 'ctrl+alt+g':
              this.uiFns.toggleGrow();

              break;

            case 'ctrl+shift+d':
              this.uiFns.toggleDisco();

              break;
          }

          break;
        }
        case 'patternlab.pageLoad': {
          if (
            !this.urlHandler.skipBack &&
            (!root.history.state || root.history.state.pattern !== data.patternPartial)
          ) {
            this.urlHandler.pushPattern(data.patternPartial);
          }

          // Reset default.
          this.urlHandler.skipBack = false;

          break;
        }
        case 'patternlab.updatePatternInfo': {
          const addressReplacement = this.urlHandler.getAddressReplacement(data.patternPartial);

          // The primary use-case for this function is replacing history state instead of pushing it.
          root.history.replaceState({pattern: data.patternPartial}, null, addressReplacement);
          this.uiFns.updatePatternInfo(data.patternPartial, data.path);

          break;
        }
      }
    };

    /* CONSTRUCTOR */

    constructor(fepperUi) {
      this.$orgs = fepperUi.requerio.$orgs;
      this.requerio = fepperUi.requerio;
    }

    /* GETTERS for fepperUi instance props in case they are undefined at instantiation. */

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

    /* METHODS */

    // Declared before other methods because it must be unit tested before other methods. Be sure to e2e test .stoke().
    stoke() {
      const protocol = root.location.protocol;

      // Use CSS to hide scrape menu if using "file:" protocol.
      this.$orgs['#patternlab-html'].dispatchAction('addClass', 'protocol-' + protocol.slice(0, -1));

      /* istanbul ignore if */
      if (this.uiProps.isMobile) {
        this.$orgs['#patternlab-html'].dispatchAction('addClass', 'mobile');
      }

      // Set up viewport.

      const searchParams = this.urlHandler.getSearchParams();
      let vpWidth = 0;

      if (searchParams.d || searchParams.disco) {
        // Disco param.
        this.uiFns.startDisco();
      }
      else if (searchParams.g || searchParams.grow) {
        // Grow param.
        this.uiFns.startGrow();
      }
      else {
        if (searchParams.w || searchParams.width) {
          // Width param.
          const vpWidthParam = searchParams.w || searchParams.width;

          if (vpWidthParam.indexOf('em') > -1) {
            vpWidth = Math.round(parseFloat(vpWidthParam) * this.uiProps.bodyFontSize);
          }
          else {
            vpWidth = parseInt(vpWidthParam);
          }

          if (!Number.isNaN(vpWidth)) {
            this.dataSaver.updateValue('vpWidth', vpWidth);
          }
        }
        else {
          // Check for viewport width cookie.
          vpWidth = Number(this.dataSaver.findValue('vpWidth'));
        }

        // For server-side testing.
        if (typeof global === 'object') {
          if (vpWidth) {
            this.uiFns.updateViewportWidth(vpWidth);
          }
          else {
            // If no search param or cookie, update the size readings with the innerWidth of the viewport.
            // Must be innerWidth even though other #sg-viewport behaviors act on style.width.
            // This is because style.width is undefined at this point.
            this.uiFns.updateSizeReading(this.$orgs['#sg-viewport'].getState().innerWidth);
          }
        }
      }

      // Load patternPartial.

      let patternPartial;

      if (searchParams.p || searchParams.pattern) {
        patternPartial = searchParams.p || searchParams.pattern;
      }
      else if (this.uiData.config.defaultPattern) {
        patternPartial = this.uiData.config.defaultPattern;
      }
      else {
        patternPartial = 'viewall';
      }

      try {
        /* istanbul ignore if */
        if (Object.keys(this.uiData.patternPaths).length <= 1) {
          this.$orgs['#sg-nav-message'].dispatchAction('removeClass', 'is-vishidden');

          // Returning instead of throwing because #sg-nav-message tells to check the console for errors.
          // Throwing an explicit error here would likely be a red herring.
          return;
        }
      }
      catch (err) /* istanbul ignore next */ {
        this.$orgs['#sg-nav-message'].dispatchAction('removeClass', 'is-vishidden');

        throw err;
      }

      let iframePath = this.uiData.patternPaths[patternPartial];

      /* istanbul ignore else */
      if (iframePath) {
        this.urlHandler.skipBack = true;

        // Update DOM with pattern info.
        this.uiFns.updatePatternInfo(patternPartial, iframePath);

        // Update history. Need to do this so urlHandler.popPattern has an Event.state.pattern to work with.
        root.history.replaceState({pattern: patternPartial}, null, null);
      }
      else {
        iframePath = `&quest;p=${patternPartial}`;
      }

      // Render Feplet templates.
      try {
        // Render pattern navigation.
        const templateRenderedNav = root.Feplet.render(
          this.$orgs['#sg-nav-target'].html(),
          {patternTypes: this.uiData.navItems.patternTypes, pathsPublic: this.uiData.config.pathsPublic}
        );
        this.$orgs['#sg-nav-target'].dispatchAction('html', templateRenderedNav);
        this.$orgs['#sg-nav-target'].dispatchAction('removeClass', 'is-vishidden');

        // Render UI controls. "Ish" is apparently the pre-patternlab name for the viewport resizer.
        // http://bradfrost.com/blog/post/ish/
        const templateRenderedIsh = root.Feplet.render(
          this.$orgs['#sg-controls'].html(),
          this.uiData.ishControls
        );
        this.$orgs['#sg-controls'].dispatchAction('html', templateRenderedIsh);
        this.$orgs['#sg-controls'].dispatchAction('removeClass', 'is-vishidden');

        // Erase preemptive warning message.
        this.$orgs['#sg-nav-message'].dispatchAction('empty');
      }
      catch (err) /* istanbul ignore next */ {
        this.$orgs['#sg-nav-message'].dispatchAction('removeClass', 'is-vishidden');

        throw err;
      }

      // Render resize buttons.
      this.renderResizeBtns();

      // Load pattern in iframe.
      this.$orgs['#sg-viewport'][0].contentWindow.location.replace(iframePath);
    }

    goResize(bp) {
      this.uiFns.stopDisco();
      this.uiFns.stopGrow();
      this.uiFns.sizeIframe(this.uiProps.bpObj[bp]);

      if (this.$orgs[`#sg-size-${bp}`] && typeof this.$orgs[`#sg-size-${bp}`].dispatchAction === 'function') {
        this.$orgs[`#sg-size-${bp}`].dispatchAction('focus');
      }
      else {
        root.$(`#sg-size-${bp}`).focus();
      }
    }

    // These "go" methods are listed as they appear in the UI.

    // Handle extra extra small button.
    goXXSmall() {
      this.goResize('xx');
    }

    // Handle extra small button.
    goXSmall() {
      this.goResize('xs');
    }

    // Handle small button.
    goSmall() {
      this.goResize('sm');
    }

    // Handle medium button.
    goMedium() {
      this.goResize('md');
    }

    // Handle large button.
    goLarge() {
      this.goResize('lg');
    }

    // Handle whole button.
    goWhole() {
      this.uiFns.stopDisco();
      this.uiFns.stopGrow();
      this.uiFns.sizeIframe(this.uiProps.sw, true, true);
      this.$orgs['#sg-size-w'].dispatchAction('focus');
    }

    // Handle random button.
    goRandom() {
      this.uiFns.stopDisco();
      this.uiFns.stopGrow();
      this.uiFns.sizeIframe(this.uiFns.getRandom(this.uiProps.minViewportWidth, this.uiProps.sw));
      this.$orgs['#sg-size-random'].dispatchAction('focus');
    }

    renderResizeBtns() {
      /* istanbul ignore if */
      if (!this.$orgs['#sg-resize-btns'].length) {
        return;
      }

      const bpObj = this.uiProps.bpObj;
      const resizeBtns = [];
      let html = '';

      Object.keys(bpObj).reverse().forEach((bp) => {
        // HTML for rendering.
        html += `<li><a href="#" id="sg-size-${bp}">${bp.toUpperCase()}</a></li>`;

        // Since breakpoint sizes are user-configurable, the resize buttons are not initially declared as organisms.
        // The members of this array get incepted after this loop.
        resizeBtns.push('#sg-size-' + bp);
      });

      this.$orgs['#sg-resize-btns'].dispatchAction('html', html);
      this.requerio.incept(...resizeBtns);
    }
  }

  return new PatternlabViewer(fepperUiInst);
}
