/**
 * Copyright (c) 2013 Brad Frost, http://bradfrostweb.com & Dave Olsen, http://dmolsen.com
 * Licensed under the MIT license.
 */
export default class AnnotationsViewer {

  /* CLASS FIELDS */

  // The following function is declared as a class field to retain the Event function prototype while keeping the
  // class constructor tidy. Exposed as a property on the instance so it can be unit tested.
  receiveIframeMessage = (event) => {
    const data = this.uiFns.receiveIframeMessageBoilerplate(event);

    /* istanbul ignore if */
    if (!data) {
      return;
    }

    // This condition must come first.
    if (data.annotationsUpdate) {
      this.updateAnnotations(data.annotations, data.patternPartial);
    }

    if (data.annotationNumber) {
      this.moveTo(data.annotationNumber);
    }

    if (data.annotationsViewallClick) {
      if (data.annotationsViewallClick === 'on') {
        this.openAnnotations();
      }
      else {
        this.closeAnnotations();
      }
    }

    switch (data.event) {
      case 'patternlab.keyPress':
        switch (data.keyPress) {
          case 'ctrl+shift+a':
            this.toggleAnnotations();

            break;

          case 'esc':
            if (this.annotationsActive && this.uiProps.dockPosition === 'bottom') {
              this.closeAnnotations();
            }

            break;
        }

        break;
    }
  };

  // Private class fields.
  #fepperUi;
  #root;

  /* CONSTRUCTOR */

  constructor(fepperUi, root) {
    this.#fepperUi = fepperUi;
    this.#root = root;

    this.annotationsActive = false;
    this.moveToNumber = 0;
    this.$orgs = fepperUi.requerio.$orgs;
  }

  /* GETTERS for fepperUi instance props in case they are undefined at instantiation. */

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

  get urlHandler() {
    return this.#fepperUi.urlHandler;
  }

  get viewerHandler() {
    return this.#fepperUi.viewerHandler;
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
    this.annotationsActive = false;

    this.viewerHandler.closeViewer();
    this.$orgs['#sg-viewport'][0].contentWindow.postMessage({annotationsToggle: 'off'}, this.uiProps.targetOrigin);
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
    const $annotation = this.#root.$('#annotation-' + this.moveToNumber);

    /* istanbul ignore if */
    if ($annotation.length) {
      const top = $annotation[0].offsetTop;

      this.$orgs['#sg-annotations-container'].animate({scrollTop: top - 10}, 600);
    }
  }

  openAnnotations() {
    // Flag that the viewer is active.
    this.annotationsActive = true;
    this.uiProps.lastViewer = 'annotations';

    // Make sure the code viewer is off before showing annotations.
    this.codeViewer.closeCode();
    // Tell the pattern that the annotations viewer has been turned on.
    this.$orgs['#sg-viewport'][0].contentWindow.postMessage({annotationsToggle: 'on'}, this.uiProps.targetOrigin);
    this.$orgs['#sg-t-annotations'].dispatchAction('addClass', 'active');
    this.$orgs['#sg-annotations-container'].dispatchAction('addClass', 'active');
    this.viewerHandler.openViewer();
    this.dataSaver.updateValue('lastViewer', 'annotations');

    if (this.moveToNumber !== 0) {
      this.moveTo(this.moveToNumber);

      // Only unset this.moveToNumber if the annotations html has been loaded.
      if (this.$orgs['#sg-annotations'].getState().html) {
        this.moveToNumber = 0;
      }
    }

    // If viewall, scroll to the focused pattern.
    /* istanbul ignore if */
    if (this.uiProps.viewall) {
      this.scrollViewall();
    }
  }

  scrollViewall() /* istanbul ignore next */ {
    this.$orgs['#sg-viewport'][0].contentWindow
      .postMessage({annotationsScrollViewall: true}, this.uiProps.targetOrigin);
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
   */
  updateAnnotations(annotations) {
    // See how many annotations this pattern might have.
    // If more than zero, write them out.
    // If not, alert the user to the fact there aren't any.
    if (annotations.length) {
      let html = '';

      for (const annotation of annotations) {
        html += `<div id="annotation-${annotation.number}" class="sg-annotation">
<h2>${annotation.number}. ${annotation.title || ''}`;

        if (!annotation.state) {
          html += `<span id="annotation-state-${annotation.number}" style="font-size: 0.8em;color: #666">`;
          html += ' hidden</span>';
        }

        html += `</h2>
<div>${annotation.annotation}</div>
</div>`;
      }

      this.$orgs['#sg-annotations-na'].dispatchAction('css', {display: 'none'});
      this.$orgs['#sg-annotations']
        .dispatchAction('html', html)
        .dispatchAction('css', {display: 'block'});

      if (this.annotationsActive && this.moveToNumber !== 0) {
        this.moveTo(this.moveToNumber);

        this.moveToNumber = 0;
      }
    }
    else {
      this.$orgs['#sg-annotations-na'].dispatchAction('css', {display: 'block'});
      this.$orgs['#sg-annotations'].dispatchAction('css', {display: 'none'});
    }
  }
}
