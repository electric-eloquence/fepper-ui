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

    get uiFns() {
      return fepperUiInst.uiFns;
    }

    get uiProps() {
      return fepperUiInst.uiProps;
    }

    /* METHODS */

    // Declared before other methods because it must be unit tested before other methods. Be sure to e2e test .stoke().
    stoke() {
      this.$orgs['#sg-view-container'].dispatchAction('css', {bottom: -(this.uiProps.sh / 2) + 'px'});
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

    dockRight() {
      const widthHalf = Math.floor(this.uiProps.sw / 2);
      const sgRightpullWidth = this.uiProps.isMobile ? 0 : this.uiProps.sgRightpullWidth;

      this.slideViewer(null, this.uiProps.sh / 2);
      this.$orgs['#patternlab-body'].dispatchAction('removeClass', 'dock-bottom');
      this.uiFns.sizeIframe(widthHalf - sgRightpullWidth);

      setTimeout(() => {
        this.slideViewer(null, this.uiProps.sh / 2, widthHalf);
        this.$orgs['#patternlab-body'].dispatchAction('addClass', 'dock-right');
        setTimeout(() => {
          this.slideViewer(null, null, 0);
        }, this.transitionDuration / 2);
      }, this.transitionDuration);
    }

    openViewer() {
      /* istanbul ignore if */
      if (typeof getComputedStyle === 'function') {
        this.$orgs['#sg-view-container'].dispatchAction('addClass', 'anim-ready');

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
      this.slideViewer(null, 0);
    }

    /**
     * Slide the viewer.
     *
     * @param {number|null|undefined} left - The distance to slide out of view. 0 means it is fully in view.
     * @param {number|null|undefined} bottom - The distance to slide out of view. 0 means it is fully in view.
     * @param {number|null|undefined} right - The distance to slide out of view. 0 means it is fully in view.
     */
    slideViewer(left_, bottom_, right_) {
      /* eslint-disable eqeqeq */
      const left = (left_ == null) ? 'auto' : -left_ + 'px';
      const bottom = (bottom_ == null) ? 'auto' : -bottom_ + 'px';
      const right = (right_ == null) ? 'auto' : -right_ + 'px';
      /* eslint-enable eqeqeq */

      const paddingBottom = (bottom_ === 0) ? (this.uiProps.sh / 2) + 'px' : '0px';

      this.$orgs['#sg-view-container'].dispatchAction('css', {left, bottom, right});
      this.$orgs['#sg-vp-wrap'].dispatchAction('css', {paddingBottom});
    }
  }

  return new ViewerHandler(fepperUiInst);
}
