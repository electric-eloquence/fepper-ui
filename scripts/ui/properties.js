export default class UiProps {
  // Private class fields.
  #fepperUi;
  #root;

  constructor(fepperUi, root) {
    this.#fepperUi = fepperUi;
    this.#root = root;

    this.$orgs = fepperUi.requerio.$orgs;
    this.bodyFontSize = parseFloat(window.getComputedStyle(document.body).getPropertyValue('font-size'));

    // Measurements.
    this.bodyFontSize = this.bodyFontSize || 16;
    this.bpObj = this.uiFns.getBreakpointsSorted();
    this.bpMd = 1024; // Not to be user-configured.
    this.bpSm = 767; // Not to be user-configured.
    this.maxViewportWidth = this.#root.config ? parseInt(this.#root.config.ishMaximum) : 2600;
    this.minViewportWidth = this.#root.config ? parseInt(this.#root.config.ishMinimum) : 240;

    // Modes.
    this.discoMode = false;
    this.growMode = false;
    this.halfMode = null;
    this.wholeMode = null;

    // Right pullbar drag state.
    this.sgRightpull = {
      posX: null,
      vpWidth: null
    };

    // Other.
    this.discoId = 0;
    this.dockPosition = 'bottom';
    this.growId = 0;
    this.isMobile = 'ontouchstart' in root && this.sw <= 1024;
    this.lastViewed = null;
    // Any change to sgRightpullWidth needs to be replicated in ui/core/styleguide/index/html/01-body/40-main/main.css
    // in fepper-npm in order to be compiled into styles/ui.css with a consistent width.
    this.sgRightpullWidth = this.isMobile ? 0 : 14;
    this.tabActive = null;
    this.timeoutDefault = 200;
    this.titleSeparator = ' : ';
    this.viewall = false;
    this.vpWidth = null;
  }

  /* GETTER for fepperUi.uiFns in case it is undefined at instantiation. */

  get uiFns() {
    return this.#fepperUi.uiFns;
  }

  /* ADDITIONAL GETTERS */

  get sw() {
    return window.innerWidth;
  }

  get sh() {
    return window.innerHeight;
  }

  get targetOrigin() {
    return (this.#root.location.protocol === 'file:') ?
      '*' :
      this.#root.location.protocol + '//' + this.#root.location.host;
  }
}
