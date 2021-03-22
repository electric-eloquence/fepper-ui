// TODO: Replace closure with private class field when there is greater browser support.
export default function (fepperUiInst) {
  class ViewerHandler {

    /* CONSTRUCTOR */

    constructor(fepperUi) {
      this.$orgs = fepperUi.requerio.$orgs;
      this.transitionDuration = null;
    }

    // Getters for fepperUi instance props in case they are undefined at instantiation.

    get annotationsViewer() {
      return fepperUiInst.annotationsViewer;
    }

    get codeViewer() {
      return fepperUiInst.codeViewer;
    }

    get dataSaver() {
      return fepperUiInst.dataSaver;
    }

    get uiFns() {
      return fepperUiInst.uiFns;
    }

    get uiProps() {
      return fepperUiInst.uiProps;
    }

    /* METHODS */

    // Declared before other methods because it must be unit tested before other methods. Be sure to e2e test .stoke().
    stoke() {
      this.uiProps.dockPosition = this.dataSaver.findValue('dockPosition') || this.uiProps.dockPosition;

      if (this.uiProps.sw < 768) {
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
      if (this.uiProps.dockPosition !== 'left') {
        this.$orgs['#patternlab-body'].dispatchAction('removeClass', 'dock-open');
      }

      const dockPosition = this.uiProps.dockPosition = 'left';
      const widthHalf = Math.floor(this.uiProps.sw / 2);

      this.dataSaver.updateValue('dockPosition', dockPosition);
      this.$orgs['#patternlab-body']
        .dispatchAction('removeClass', 'dock-right dock-bottom')
        .dispatchAction('addClass', 'dock-' + dockPosition);
      this.uiFns.sizeIframe(widthHalf - this.uiProps.sgRightpullWidth, true, false, true);

      setTimeout(() => {
        if (this.annotationsViewer.annotationsActive || this.codeViewer.codeActive) {
          this.$orgs['#patternlab-body'].dispatchAction('addClass', 'dock-open');
        }
      }, this.transitionDuration * 1.25);
    }

    dockBottom() {
      if (this.uiProps.dockPosition !== 'bottom') {
        this.$orgs['#patternlab-body'].dispatchAction('removeClass', 'dock-open');
      }

      const dockPosition = this.uiProps.dockPosition = 'bottom';

      this.dataSaver.updateValue('dockPosition', dockPosition);
      this.$orgs['#patternlab-body']
        .dispatchAction('removeClass', 'dock-left dock-right')
        .dispatchAction('addClass', 'dock-' + dockPosition);

      setTimeout(() => {
        if (this.annotationsViewer.annotationsActive || this.codeViewer.codeActive) {
          this.$orgs['#patternlab-body'].dispatchAction('addClass', 'dock-open');
        }
      }, 10);
    }

    dockRight() {
      if (this.uiProps.dockPosition !== 'right') {
        this.$orgs['#patternlab-body'].dispatchAction('removeClass', 'dock-open');
      }

      const dockPosition = this.uiProps.dockPosition = 'right';
      const widthHalf = Math.floor(this.uiProps.sw / 2);

      this.dataSaver.updateValue('dockPosition', dockPosition);
      this.$orgs['#patternlab-body']
        .dispatchAction('removeClass', 'dock-bottom dock-left')
        .dispatchAction('addClass', 'dock-' + dockPosition);
      this.uiFns.sizeIframe(widthHalf - this.uiProps.sgRightpullWidth, true, false, true);

      setTimeout(() => {
        if (this.annotationsViewer.annotationsActive || this.codeViewer.codeActive) {
          this.$orgs['#patternlab-body'].dispatchAction('addClass', 'dock-open');
        }
      }, this.transitionDuration * 1.25);
    }

    openViewer() {
      // Only open if annotations or code is active.
      if (!this.annotationsViewer.annotationsActive && !this.codeViewer.codeActive) {
        return;
      }

      this.$orgs['#sg-view-container'].dispatchAction('addClass', 'anim-ready');

      /* istanbul ignore if */
      if (typeof getComputedStyle === 'function') {
        if (this.transitionDuration === null) {
          const transitionDurationStr =
            getComputedStyle(this.$orgs['#sg-view-container'][0]).getPropertyValue('transition-duration');

          if (transitionDurationStr.slice(-2) === 'ms') {
            this.transitionDuration = parseFloat(transitionDurationStr);
          }
          else {
            this.transitionDuration = parseFloat(transitionDurationStr) * 1000;
          }
        }
      }

      setTimeout(() => {
        this.$orgs['#patternlab-body'].dispatchAction('addClass', 'dock-open');
      }, 10);
    }
  }

  return new ViewerHandler(fepperUiInst);
}
