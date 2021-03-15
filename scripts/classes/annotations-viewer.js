/**
 * Copyright (c) 2013 Brad Frost, http://bradfrostweb.com & Dave Olsen, http://dmolsen.com
 * Licensed under the MIT license.
 */

// TODO: Replace closure with private class field when there is greater browser support.
export default function (fepperUiInst, root) {
  class AnnotationsViewer {

    /* CLASS FIELDS */
    // Declared as a class field to retain the Event function prototype while keeping the class constructor tidy.
    // Exposed as a property on the instance so it can be unit tested.

    receiveIframeMessage = (event) => {
      const data = this.uiFns.receiveIframeMessageBoilerplate(event);

      /* istanbul ignore if */
      if (!data) {
        return;
      }

      if (data.annotationsOverlay) { // This condition must come first.
        if (data.annotationsOverlay === 'on') {
          this.viewall = data.viewall || false;

          // Can assume we're not viewing the Mustache Browser.
          this.mustacheBrowser = false;

          // Update code.
          this.updateAnnotations(data.annotations, data.patternPartial);
        }
        else {
          this.closeAnnotations();
        }
      }
      else if (typeof data.annotationsMustacheBrowser === 'boolean') {
        this.mustacheBrowser = data.annotationsMustacheBrowser;
      }
      else if (data.annotationNumber) {
        this.moveTo(data.annotationNumber);
      }
      else if (typeof data.annotationsViewall === 'boolean') {
        this.viewall = data.annotationsViewall;
      }
      else if (data.annotationsViewallClick) {
        this.openAnnotations();
      }

      switch (data.event) {
        case 'patternlab.keyPress':
          switch (data.keyPress) {
            case 'ctrl+shift+a':
              this.toggleAnnotations();

              // If viewall, scroll to the focused pattern.
              /* istanbul ignore if */
              if (this.viewall && this.annotationsActive) {
                this.scrollViewall();
              }

              break;

            case 'esc':
              if (this.annotationsActive) {
                this.closeAnnotations();
              }

              break;
          }

          break;
      }
    };

    /* CONSTRUCTOR */

    constructor(fepperUi) {
      this.annotationsActive = false;
      this.moveToNumber = 0;
      this.mustacheBrowser = false;
      this.$orgs = fepperUi.requerio.$orgs;
      this.viewall = false;
    }

    /* GETTERS for fepperUi instance props in case they are undefined at instantiation. */

    get codeViewer() {
      return fepperUiInst.codeViewer;
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
      // Load the query strings in case annotations viewer has to show by default.
      const searchParams = this.urlHandler.getSearchParams();

      if (searchParams.view && (searchParams.view === 'annotations' || searchParams.view === 'a')) {
        if (typeof searchParams.number !== 'undefined') {
          this.moveToNumber = parseInt(searchParams.number);
        }

        this.openAnnotations();
      }
    }

    closeAnnotations() {
      const obj = {annotationsToggle: 'off'};
      this.annotationsActive = false;

      this.viewerHandler.closeViewer();
      this.$orgs['#sg-viewport'][0].contentWindow.postMessage(obj, this.uiProps.targetOrigin);
      this.$orgs['#sg-t-annotations'].dispatchAction('removeClass', 'active');
      this.$orgs['#sg-annotations-container'].dispatchAction('removeClass', 'active');
    }

    /**
     * Scroll to a particular annotation item.
     *
     * @param {number} number - Human-friendly annotation id number.
     */
    moveTo(number) {
      this.moveToNumber = number || this.moveToNumber;
      const $annotation = root.$('#annotation-' + this.moveToNumber);

      /* istanbul ignore if */
      if ($annotation.length) {
        const top = $annotation[0].offsetTop;

        this.$orgs['#sg-annotations-container'].animate({scrollTop: top - 10}, 600);
      }
    }

    openAnnotations() {
      // Do nothing if viewing Mustache Browser.
      if (this.mustacheBrowser) {
        return;
      }

      // Tell the pattern that annotations viewer has been turned on.
      const objAnnotationsToggle = {annotationsToggle: 'on'};
      // Flag that viewer is active.
      this.annotationsActive = true;

      // Make sure the code viewer is off before showing annotations.
      this.codeViewer.closeCode();
      this.viewerHandler.openViewer();
      this.$orgs['#sg-viewport'][0].contentWindow.postMessage(objAnnotationsToggle, this.uiProps.targetOrigin);
      this.$orgs['#sg-t-annotations'].dispatchAction('addClass', 'active');
      this.$orgs['#sg-annotations-container'].dispatchAction('addClass', 'active');

      if (this.moveToNumber !== 0) {
        this.moveTo(this.moveToNumber);

        // Only unset this.moveToNumber if annotations html has been loaded.
        if (this.$orgs['#sg-annotations'].getState().html) {
          this.moveToNumber = 0;
        }
      }
    }

    /* istanbul ignore next */
    scrollViewall() {
      this.$orgs['#sg-viewport'][0].contentWindow
        .postMessage({annotationsScrollViewall: true}, this.uiProps.targetOrigin);
    }

    /**
     * Slide the annotations panel.
     *
     * @param {number} pos - Annotation container position from bottom.
     */
    slideAnnotations(pos) {
      this.$orgs['#sg-annotations-container'].dispatchAction('css', {bottom: -pos + 'px'});
    }

    /**
     * Decide on whether the annotations panel should be open or closed.
     */
    toggleAnnotations() {
      if (!this.annotationsActive) {
        this.openAnnotations();
      }
      else {
        this.closeAnnotations();
      }
    }

    /**
     * When updating the annotations panel, get the annotations from the pattern via postMessage.
     *
     * @param {array} annotations - Annotations array.
     * @param {string} patternPartial - The shorthand partials syntax for a given pattern.
     */
    updateAnnotations(annotations, patternPartial) {
      // Set data-patternpartial attribute.
      this.$orgs['#sg-annotations-container'].dispatchAction('attr', {'data-patternpartial': patternPartial});

      // See how many annotations this pattern might have.
      // If more than zero, write them out.
      // If not, alert the user to the fact there aren't any.
      if (annotations.length) {
        let html = '';

        for (const annotation of annotations) {
          html += `<div id="annotation-${annotation.number}">
<h2>${annotation.number}. ${annotation.title || ''}`;

          if (!annotation.state) {
            html += `<span id="annotation-state-${annotation.number}" style="font-size: 0.8em;color: #666">`;
            html += ' hidden</span>';
          }

          html += `</h2>
<div>${annotation.annotation}</div>
</div>`;
        }

        this.$orgs['#sg-annotations'].dispatchAction('html', html);

        if (this.annotationsActive && this.moveToNumber !== 0) {
          this.moveTo(this.moveToNumber);

          this.moveToNumber = 0;
        }
      }
    }
  }

  return new AnnotationsViewer(fepperUiInst);
}
