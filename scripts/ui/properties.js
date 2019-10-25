let root;
let fepperUiInst;

export default class {
  constructor(fepperUi, root_) {
    root = root_;
    fepperUiInst = fepperUi;

    /* istanbul ignore if */
    if (typeof window === 'object') {
      this.bodyFontSize = parseFloat(window.getComputedStyle(window.document.body).getPropertyValue('font-size'));
      // Client-side only. No use-case for targetOrigin server-side.
      this.targetOrigin =
        (window.location.protocol === 'file:') ? '*' : window.location.protocol + '//' + window.location.host;
    }

    // Measurements.
    this.bodyFontSize = this.bodyFontSize || 16;
    this.bpObj = this.uiFns.getBreakpointsSorted(root.FEPPER || {});
    this.maxViewportWidth = root.config ? parseInt(root.config.ishMaximum, 10) : 2600; // Maxiumum Size for Viewport.
    this.minViewportWidth = root.config ? parseInt(root.config.ishMinimum, 10) : 240; // Minimum Size for Viewport.
    // Any change to sgRightpullWidth needs to be replicated in ui/core/styleguide/index/html/01-body/40-main/main.css
    // in fepper-npm in order to be compiled into styles/ui.css with a consistent width.
    this.sgRightpullWidth = 14;

    // Modes.
    this.discoMode = false;
    this.growMode = false;
    this.wholeMode = null; // Set later.

    // Other.
    this.discoId = 0;
    this.growId = 0;
    this.isMobile = 'ontouchstart' in root && this.sw <= 1024;
    this.timeoutDefault = 200;
    this.titleSeparator = ' : ';
    this.warnCtrlShiftLEdge = '"ctrl+shift+l" is unpredictable on Microsoft Edge.\nTry "ctrl+alt+l" instead.';
  }

  // Getters for fepperUi instance props in case they are undefined at instantiation.

  get $orgs() {
    return fepperUiInst.requerio.$orgs;
  }

  get uiFns() {
    return fepperUiInst.uiFns;
  }

  // Additional getters.

  get sw() {
    if (typeof window === 'object') {
      /* istanbul ignore next */
      return window.innerWidth;
    }
    else if (this.$orgs.window) {
      return this.$orgs.window.getState().innerWidth;
    }
    else {
      /* istanbul ignore next */
      return 1024;
    }
  }

  get sh() {
    if (typeof window === 'object') {
      /* istanbul ignore next */
      return window.innerHeight;
    }
    else if (this.$orgs.window) {
      return this.$orgs.window.getState().innerHeight;
    }
    else {
      /* istanbul ignore next */
      return 768;
    }
  }
}
