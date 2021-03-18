// TODO: Replace closure with private class field when there is greater browser support.
export default function (fepperUiInst) {
  class ViewerHandler {

    /* CONSTRUCTOR */

    constructor(fepperUi) {
      this.$orgs = fepperUi.requerio.$orgs;
    }

    // Getters for fepperUi instance props in case they are undefined at instantiation.

    get annotationsViewer() {
      return fepperUiInst.annotationsViewer;
    }

    get codeViewer() {
      return fepperUiInst.codeViewer;
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
        Number(this.$orgs['#sg-view-container'].getState().innerHeight)
      );

      // Remove padding from bottom of viewport if appropriate.
      this.$orgs['#sg-vp-wrap'].dispatchAction('css', {paddingBottom: '0px'});

      /* istanbul ignore if */
      if (typeof getComputedStyle === 'function') {
        const transitionDurationStr =
          getComputedStyle(this.$orgs['#sg-view-container'][0]).getPropertyValue('transition-duration');
        let transitionDurationNum;

        if (transitionDurationStr.slice(-2) === 'ms') {
          transitionDurationNum = parseFloat(transitionDurationStr);
        }
        else {
          transitionDurationNum = parseFloat(transitionDurationStr) * 1000;
        }

        setTimeout(() => {
          this.$orgs['#sg-view-container'].dispatchAction('removeClass', 'anim-ready');
        }, transitionDurationNum);
      }
    }

    openViewer() {
      /* istanbul ignore if */
      if (typeof getComputedStyle === 'function') {
        this.$orgs['#sg-view-container'].dispatchAction('addClass', 'anim-ready');
      }

      // Move the code into view.
      this.slideViewer(0);

      // Add padding to bottom of viewport.
      this.$orgs['#sg-vp-wrap'].dispatchAction('css', {paddingBottom: (this.uiProps.sh / 2) + 'px'});
    }

    /**
     * Slide the panel.
     *
     * @param {number} pos - The distance to slide.
     */
    slideViewer(pos) {
      this.$orgs['#sg-view-container'].dispatchAction('css', {bottom: -pos + 'px'});
    }
  }

  return new ViewerHandler(fepperUiInst);
}
