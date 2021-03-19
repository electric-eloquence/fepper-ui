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

      if (this.uiProps.dockPosition === 'bottom') {
        this.$orgs['#sg-view-container'].dispatchAction('css', {bottom: -(this.uiProps.sh / 2) + 'px'});
      }
      else {
        this.$orgs['#patternlab-body']
          .dispatchAction('removeClass', 'dock-bottom')
          .dispatchAction('addClass', 'dock-' + this.uiProps.dockPosition);
        this.codeViewer.openCode(false);
      }
    }

    closeViewer() {
      // Only close if both annotations and code are inactive.
      if (this.annotationsViewer.annotationsActive || this.codeViewer.codeActive) {
        return;
      }

      this.slideViewer(
        null,
        Number(this.$orgs['#sg-view-container'].getState().innerHeight)
      );

      setTimeout(() => {
        this.$orgs['#sg-view-container'].dispatchAction('removeClass', 'anim-ready');
      }, this.transitionDuration);
    }

    dockBottom() {
      const sgRightpullWidth = this.uiProps.isMobile ? 0 : this.uiProps.sgRightpullWidth;

      if (this.uiProps.dockPosition === 'left') {
        this.slideViewer(this.uiProps.sw / 2, null);
      }
      else if (this.uiProps.dockPosition === 'right') {
        this.slideViewer(null, null, this.uiProps.sw / 2);
      }

      this.uiProps.dockPosition = 'bottom';
      this.dataSaver.updateValue('dockPosition', 'bottom');

      setTimeout(() => {
        this.$orgs['#patternlab-body'].dispatchAction('removeClass', 'dock-left dock-right');
        this.slideViewer(null, this.uiProps.sh / 2, null);
        this.$orgs['#patternlab-body'].dispatchAction('addClass', 'dock-bottom');
        setTimeout(() => {
          this.slideViewer(null, 0);
        }, this.transitionDuration / 2);
      }, this.transitionDuration);
    }

    dockRight() {
      const widthHalf = Math.floor(this.uiProps.sw / 2);
      const sgRightpullWidth = this.uiProps.isMobile ? 0 : this.uiProps.sgRightpullWidth;

      this.slideViewer(null, this.uiProps.sh / 2);
      this.uiProps.dockPosition = 'right';
      this.dataSaver.updateValue('dockPosition', 'right');
      this.$orgs['#patternlab-body'].dispatchAction('removeClass', 'dock-bottom');
      this.uiFns.sizeIframe(widthHalf - sgRightpullWidth);

      setTimeout(() => {
        this.slideViewer(null, null, widthHalf);
        this.$orgs['#patternlab-body'].dispatchAction('addClass', 'dock-right');
        setTimeout(() => {
          this.slideViewer(null, null, 0);
        }, this.transitionDuration / 2);
      }, this.transitionDuration);
    }

    openViewer() {
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

      // Move the code into view.
      switch (this.uiProps.dockPosition) {
        case 'left':
          this.slideViewer(0);
          break;
        case 'bottom':
          this.slideViewer(null, 0);
          break;
        case 'right':
          this.slideViewer(null, null, 0);
          break;
      }
    }

    /**
     * Slide the viewer.
     *
     * @param {number|null} left - The distance to slide out of view. 0 = fully in view; null = not this direction.
     * @param {number|null} bottom - The distance to slide out of view. 0 = fully in view; null = not this direction.
     * @param {number|null} right - The distance to slide out of view. 0 = fully in view; null = not this direction.
     */
    slideViewer(left_ = null, bottom_ = null, right_ = null) {
      const left = (left_ === null) ? 'auto' : -left_ + 'px';
      const bottom = (bottom_ === null) ? 'auto' : -bottom_ + 'px';
      const right = (right_ === null) ? 'auto' : -right_ + 'px';

      const paddingBottom = (bottom_ === 0) ? (this.uiProps.sh / 2) + 'px' : '';

console.warn(left, bottom, right)
      this.$orgs['#sg-view-container'].dispatchAction('css', {left, bottom, right});
      this.$orgs['#sg-vp-wrap'].dispatchAction('css', {paddingBottom});
    }
  }

  return new ViewerHandler(fepperUiInst);
}
