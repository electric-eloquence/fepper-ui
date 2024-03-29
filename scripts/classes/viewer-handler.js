export default class ViewerHandler {
  #fepperUi;

  /* CONSTRUCTOR */

  constructor(fepperUi) {
    this.#fepperUi = fepperUi;

    this.$orgs = fepperUi.requerio.$orgs;
    this.transitionDuration = null;
  }

  // Getters for fepperUi instance props in case they are undefined at instantiation.

  get annotationsViewer() {
    return this.#fepperUi.annotationsViewer;
  }

  get codeViewer() {
    return this.#fepperUi.codeViewer;
  }

  get dataSaver() {
    return this.#fepperUi.dataSaver;
  }

  get uiFns() {
    return this.#fepperUi.uiFns;
  }

  get uiProps() {
    return this.#fepperUi.uiProps;
  }

  /* METHODS */

  // Declared before other methods because it must be unit tested before other methods. Be sure to e2e test .stoke().
  stoke() {
    this.uiProps.dockPosition = this.dataSaver.findValue('dockPosition') || this.uiProps.dockPosition;

    if (this.uiProps.sw <= this.uiProps.bpSm) {
      this.uiProps.dockPosition = 'bottom';

      this.dataSaver.updateValue('dockPosition', this.uiProps.dockPosition);
      this.$orgs['#patternlab-body']
        .dispatchAction('removeClass', 'dock-left dock-right')
        .dispatchAction('addClass', 'dock-' + this.uiProps.dockPosition);

      if (!this.annotationsViewer.annotationsActive && !this.codeViewer.codeActive) {
        this.$orgs['#sg-view-container'].dispatchAction('css', {bottom: -(this.uiProps.sh / 2) + 'px'});
      }
    }
    else {
      this.$orgs['#patternlab-body']
        .dispatchAction('removeClass', 'dock-bottom')
        .dispatchAction('addClass', 'dock-' + this.uiProps.dockPosition);
    }
  }

  closeViewer() {
    // Only close if annotations and code are inactive.
    if (this.annotationsViewer.annotationsActive || this.codeViewer.codeActive) {
      return;
    }

    this.$orgs['#patternlab-body'].dispatchAction('removeClass', 'dock-open');

    setTimeout(() => {
      this.$orgs['#sg-view-container'].dispatchAction('removeClass', 'anim-ready');
    }, this.transitionDuration);
  }

  dockLeft() {
    let dockOpen = false;

    if (this.uiProps.dockPosition !== 'left') {
      dockOpen = this.$orgs['#patternlab-body'].getState().classArray.includes('dock-open');

      if (dockOpen) {
        this.$orgs['#patternlab-body'].dispatchAction('removeClass', 'dock-open');
      }
    }

    const dockPosition = this.uiProps.dockPosition = 'left';
    const widthHalf = Math.floor(this.uiProps.sw / 2);

    this.dataSaver.updateValue('dockPosition', dockPosition);
    this.$orgs['#patternlab-body']
      .dispatchAction('removeClass', 'dock-right dock-bottom')
      .dispatchAction('addClass', 'dock-' + dockPosition);
    this.uiFns.sizeIframe(widthHalf - this.uiProps.sgRightpullWidth, true, false, true);

    if (dockOpen) {
      setTimeout(() => {
        this.$orgs['#patternlab-body'].dispatchAction('addClass', 'dock-open');
      }, this.transitionDuration * 1.25);
    }
  }

  dockBottom() {
    let dockOpen = false;

    if (this.uiProps.dockPosition !== 'bottom') {
      dockOpen = this.$orgs['#patternlab-body'].getState().classArray.includes('dock-open');

      if (dockOpen) {
        this.$orgs['#patternlab-body'].dispatchAction('removeClass', 'dock-open');
      }
    }

    const dockPosition = this.uiProps.dockPosition = 'bottom';
    this.uiProps.halfMode = false;

    this.dataSaver.removeValue('halfMode');
    this.dataSaver.updateValue('dockPosition', dockPosition);
    this.$orgs['#patternlab-body']
      .dispatchAction('removeClass', 'dock-left dock-right')
      .dispatchAction('addClass', 'dock-' + dockPosition);

    if (dockOpen) {
      setTimeout(() => {
        this.$orgs['#patternlab-body'].dispatchAction('addClass', 'dock-open');
      }, 10);
    }
  }

  dockRight() {
    let dockOpen = false;

    if (this.uiProps.dockPosition !== 'right') {
      dockOpen = this.$orgs['#patternlab-body'].getState().classArray.includes('dock-open');

      if (dockOpen) {
        this.$orgs['#patternlab-body'].dispatchAction('removeClass', 'dock-open');
      }
    }

    const dockPosition = this.uiProps.dockPosition = 'right';
    const widthHalf = Math.floor(this.uiProps.sw / 2);

    this.dataSaver.updateValue('dockPosition', dockPosition);
    this.$orgs['#patternlab-body']
      .dispatchAction('removeClass', 'dock-bottom dock-left')
      .dispatchAction('addClass', 'dock-' + dockPosition);
    this.uiFns.sizeIframe(widthHalf - this.uiProps.sgRightpullWidth, true, false, true);

    if (dockOpen) {
      setTimeout(() => {
        this.$orgs['#patternlab-body'].dispatchAction('addClass', 'dock-open');
      }, this.transitionDuration * 1.25);
    }
  }

  openViewer() {
    // Only open if annotations or code is active.
    if (!this.annotationsViewer.annotationsActive && !this.codeViewer.codeActive) {
      return;
    }

    this.$orgs['#sg-view-container'].dispatchAction('addClass', 'anim-ready');

    /* istanbul ignore else */
    if (this.$orgs['#sg-view-container'].length) {
      if (this.transitionDuration === null) {
        /* istanbul ignore if */
        if (typeof getComputedStyle === 'function') {
          const transitionDurationStr =
            getComputedStyle(this.$orgs['#sg-view-container'][0]).getPropertyValue('transition-duration');

          if (transitionDurationStr.slice(-2) === 'ms') {
            this.transitionDuration = parseFloat(transitionDurationStr);
          }
          else {
            this.transitionDuration = parseFloat(transitionDurationStr) * 1000;
          }
        }
        else {
          this.transitionDuration = 0;
        }
      }
    }

    setTimeout(() => {
      this.$orgs['#patternlab-body'].dispatchAction('addClass', 'dock-open');
    }, 10);
  }
}
