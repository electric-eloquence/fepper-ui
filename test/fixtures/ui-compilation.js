/* eslint-disable valid-jsdoc */
// Be sure to unit test exported functions.
// Be sure to e2e test listeners.

/**
 * @file ui/core/styleguide/index//html/01-body/20-header/30-sg-nav-container/div.js
 * @description Accordion dropdown.
 */
export function sgAccHandleClick(event) {
  event.preventDefault();

  const $orgs = FEPPER_UI.requerio.$orgs;

  FEPPER_UI.uiFns.closeOtherPanels(this);
  $orgs['.sg-acc-handle'].hasElement(this).dispatchAction('toggleClass', 'active');
  $orgs['.sg-acc-panel'].hasPrev(this).dispatchAction('toggleClass', 'active');
}

/* istanbul ignore if */
if (typeof window === 'object') {
  document.addEventListener('DOMContentLoaded', () => {
    FEPPER_UI.requerio.$orgs['.sg-acc-handle'].on('click', sgAccHandleClick);
  });
}

/**
 * @file ui/core/styleguide/index//html/01-body/20-header/30-sg-nav-container/30-sg-nav-toggle/a.js
 * @description Toggle hidden nav in smaller viewports.
 */
export function sgNavToggleClick(event) {
  event.preventDefault();

  const $orgs = FEPPER_UI.requerio.$orgs;
  const isActive = $orgs['#sg-nav-target'].getState().classArray.includes('active');

  FEPPER_UI.uiFns.closeAllPanels();

  if (!isActive) {
    $orgs['#sg-nav-target'].dispatchAction('addClass', 'active');
  }
}

/* istanbul ignore if */
if (typeof window === 'object') {
  document.addEventListener('DOMContentLoaded', () => {
    FEPPER_UI.requerio.$orgs['.sg-nav-toggle'].on('click', sgNavToggleClick);
  });
}

/**
 * @file ui/core/styleguide/index//html/01-body/20-header/60-sg-controls/20-sg-size/li.js
 * @description Viewport resizer.
 */
/* istanbul ignore if */
if (typeof window === 'object') {
  document.addEventListener('DOMContentLoaded', () => {
    const $orgs = FEPPER_UI.requerio.$orgs;
    const {
      uiFns,
      uiProps
    } = FEPPER_UI;
    const bpMd = 1024; // Not to be user-configured.
    const bpSm = 767; // Not to be user-configured.

    // Remove active classes if browser is resized outside small sw.
    // Putting this window resize listener here instead of in a more general listeners file because we want to keep the
    // bpMd and bpSm variables in one place.
    $orgs.window.on('resize', function () {
      if (uiProps.sw <= bpSm || uiProps.sw > bpMd) {
        $orgs['.sg-size'].dispatchAction('removeClass', 'active');
        $orgs['#sg-form-label'].dispatchAction('removeClass', 'active');
      }
    });

    // Toggle hidden sg-size-options buttons at small sw.
    $orgs['#sg-form-label'].on('click', function (e) {
      e.preventDefault();

      if (uiProps.sw > bpSm && uiProps.sw <= bpMd) {
        $orgs['.sg-size'].dispatchAction('toggleClass', 'active');
      }
    });

    // Pixel input.
    $orgs['#sg-size-px'].on('keydown', function (e) {
      let val = parseFloat($orgs['#sg-size-px'].getState().value);

      if (Number.isNaN(val) || !Number.isInteger(val)) {
        return;
      }

      if (e.keyCode === 38) { // If the up arrow key is hit.
        val++;

        uiFns.sizeIframe(val, false);
      }
      else if (e.keyCode === 40) { // If the down arrow key is hit.
        val--;

        uiFns.sizeIframe(val, false);
      }
      else if (e.keyCode === 13) { // If the Enter key is hit.
        e.preventDefault();

        uiFns.sizeIframe(val); // Size iframe to value of text box.
        $orgs['#sg-size-px'].dispatchAction('blur');
      }
    });

    $orgs['#sg-size-px'].on('keyup', function () {
      const val = parseFloat($orgs['#sg-size-px'].getState().value);

      if (Number.isNaN(val) || !Number.isInteger(val)) {
        return;
      }

      uiFns.updateSizeReading(val, 'px', 'updateEmInput');
    });

    // Em input.
    $orgs['#sg-size-em'].on('keydown', function (e) {
      let val = parseFloat($orgs['#sg-size-em'].getState().value);

      if (Number.isNaN(val)) {
        return;
      }

      if (e.keyCode === 38) { // If the up arrow key is hit.
        val++;

        uiFns.sizeIframe(Math.round(val * uiProps.bodyFontSize), false);
      }
      else if (e.keyCode === 40) { // If the down arrow key is hit.
        val--;

        uiFns.sizeIframe(Math.round(val * uiProps.bodyFontSize), false);
      }
      else if (e.keyCode === 13) { // If the Enter key is hit.
        e.preventDefault();

        uiFns.sizeIframe(Math.round(val * uiProps.bodyFontSize)); // Size iframe to value of text box.
      }
    });

    $orgs['#sg-size-em'].on('keyup', function () {
      const val = parseFloat($orgs['#sg-size-em'].getState().value);

      if (Number.isNaN(val)) {
        return;
      }

      uiFns.updateSizeReading(val, 'em', 'updatePxInput');
    });

    // Click whole width button.
    $orgs['#sg-size-w'].on('click', function (e) {
      e.preventDefault();
      FEPPER_UI.patternViewport.goWhole();
    });

    // Click Random Size Button.
    $orgs['#sg-size-random'].on('click', function (e) {
      e.preventDefault();
      FEPPER_UI.patternViewport.goRandom();
    });

    // Click for Disco Mode, which resizes the viewport randomly.
    $orgs['#sg-size-disco'].on('click', function (e) {
      e.preventDefault();
      uiFns.stopGrow();

      if (uiProps.discoMode) {
        uiFns.stopDisco();
      }
      else {
        uiFns.startDisco();
      }
    });

    // Grow Mode.
    // "Start with the small screen first, then expand until it looks like shit. Time for a breakpoint!"
    // - Stephen Hay
    $orgs['#sg-size-grow'].on('click', function (e) {
      e.preventDefault();
      uiFns.stopDisco();

      if (uiProps.growMode) {
        uiFns.stopGrow();
      }
      else {
        uiFns.startGrow();
      }
    });
  });
}

/**
 * @file ui/core/styleguide/index//html/01-body/20-header/60-sg-controls/40-sg-find/li.js
 * @description Pattern finder.
 */
/* istanbul ignore if */
if (typeof window === 'object') {
  document.addEventListener('DOMContentLoaded', () => {
    const $orgs = FEPPER_UI.requerio.$orgs;
    const patternFinder = FEPPER_UI.patternFinder;

    $orgs['#sg-f-toggle'].on('mouseenter', function () {
      $orgs['#sg-f-toggle'].dispatchAction('addClass', 'mouseentered');
    });

    $orgs['#sg-f-toggle'].on('mouseleave', function () {
      $orgs['#sg-f-toggle'].dispatchAction('removeClass', 'mouseentered');
    });

    $orgs['#sg-f-toggle'].on('click', function (e) {
      e.preventDefault();

      patternFinder.toggleFinder();
    });

    $orgs['#typeahead'].on('blur', function () {
      const mouseentered = $orgs['#sg-f-toggle'].getState().classArray.includes('mouseentered');

      if (!mouseentered) {
        // Do not invoke an infinite loop by calling patternFinder.closeFinder() which will invoke a blur.
        $orgs['#sg-f-toggle'].dispatchAction('removeClass', 'active');
        $orgs['#sg-find'].dispatchAction('removeClass', 'active');
      }
    });

    $orgs['#typeahead'].typeahead(
      {highlight: true},
      {displayKey: 'patternPartial', source: patternFinder.patterns.ttAdapter()}
    ).on(
      'typeahead:selected',
      ((patternFinder_) => {
        return function (e, item) {
          patternFinder_.onSelected(e, item, patternFinder_);
        };
      })(patternFinder)
    ).on(
      'typeahead:autocompleted',
      ((patternFinder_) => {
        return function (e, item) {
          patternFinder_.onAutocompleted(e, item, patternFinder_);
        };
      })(patternFinder)
    );
  });
}

/**
 * @file ui/core/styleguide/index//html/01-body/20-header/60-sg-controls/60-sg-view/li.js
 * @description Annotations and code viewer toggles.
 */
// Annotations toggle click handler.
export function sgTAnnotationsClick(event) {
  event.preventDefault();

  const $orgs = FEPPER_UI.requerio.$orgs;
  const annotationsViewer = FEPPER_UI.annotationsViewer;

  if (annotationsViewer.mustacheBrowser) {
    return;
  }

  annotationsViewer.toggleAnnotations();

  // If viewall, scroll to the focused pattern.
  if (annotationsViewer.viewall && annotationsViewer.annotationsActive) {
    annotationsViewer.scrollViewall();
  }

  $orgs['#sg-view'].dispatchAction('removeClass', 'active');
  $orgs['#sg-t-toggle'].dispatchAction('removeClass', 'active');
}

// Code toggle click handler.
export function sgTCodeClick(event) {
  event.preventDefault();

  const $orgs = FEPPER_UI.requerio.$orgs;
  const codeViewer = FEPPER_UI.codeViewer;

  if (codeViewer.mustacheBrowser) {
    return;
  }

  codeViewer.toggleCode();

  // If viewall, scroll to the focused pattern.
  if (codeViewer.viewall && codeViewer.codeActive) {
    codeViewer.scrollViewall();
  }

  $orgs['#sg-view'].dispatchAction('removeClass', 'active');
  $orgs['#sg-t-toggle'].dispatchAction('removeClass', 'active');
}

/* istanbul ignore if */
if (typeof window === 'object') {
  document.addEventListener('DOMContentLoaded', () => {
    const $orgs = FEPPER_UI.requerio.$orgs;

    $orgs['#sg-t-annotations'].on('click', sgTAnnotationsClick);
    $orgs['#sg-t-code'].on('click', sgTCodeClick);

    // Click handler for "Open in new window" link.
    // Do not use Event.preventDefault().
    $orgs['#sg-raw'].on('click', function () {
      $orgs['#sg-view'].dispatchAction('removeClass', 'active');
      $orgs['#sg-t-toggle'].dispatchAction('removeClass', 'active');
    });
  });
}

/**
 * @file ui/core/styleguide/index//html/01-body/20-header/60-sg-controls/80-sg-tools/li.js
 * @description Documentation links.
 */
/* istanbul ignore if */
if (typeof window === 'object') {
  document.addEventListener('DOMContentLoaded', () => {
    const $orgs = FEPPER_UI.requerio.$orgs;

    // Do not use Event.preventDefault().
    $orgs['.sg-tool'].on('click', function () {
      $orgs['#sg-tools'].dispatchAction('removeClass', 'active');
      $orgs['#sg-tools-toggle'].dispatchAction('removeClass', 'active');
    });
  });
}

/**
 * @file ui/core/styleguide/index//html/01-body/40-main/main.js
 * @description Listeners on the body, iframe, and rightpull bar.
 */
/* istanbul ignore if */
if (typeof window === 'object') {
  document.addEventListener('DOMContentLoaded', () => {
    const $orgs = FEPPER_UI.requerio.$orgs;
    const {
      annotationsViewer,
      codeViewer,
      dataSaver,
      uiFns,
      uiProps
    } = FEPPER_UI;

    // Ensure that if a new pattern or viewall is loaded, that annotations or code viewer is turned on as appropriate.
    $orgs['#sg-viewport'].on('load', function () {
      if (annotationsViewer.annotationsActive) {
        $orgs['#sg-viewport'][0].contentWindow.postMessage({annotationsToggle: 'on'}, uiProps.targetOrigin);
      }

      if (codeViewer.codeActive) {
        $orgs['#sg-viewport'][0].contentWindow.postMessage({codeToggle: 'on'}, uiProps.targetOrigin);
      }
    });

    $orgs['#sg-rightpull'].on('mouseenter', function () {
      $orgs['#sg-cover'].dispatchAction('addClass', 'shown-by-rightpull-hover');
    });

    $orgs['#sg-rightpull'].on('mouseleave', function () {
      $orgs['#sg-cover'].dispatchAction('removeClass', 'shown-by-rightpull-hover');
    });

    // Handle manually resizing the viewport.
    // 1. On "mousedown" store the click location.
    // 2. Make a hidden div visible so that the cursor doesn't get lost in the iframe.
    // 3. On "mousemove" calculate the math, save the results to a cookie, and update the viewport.
    $orgs['#sg-rightpull'].on('mousedown', function (e) {
      uiProps.sgRightpull.posX = e.pageX;
      uiProps.sgRightpull.viewportWidth = $orgs['#sg-viewport'].getState().innerWidth;

      // Show the cover.
      $orgs['#sg-cover'].dispatchAction('addClass', 'shown-by-rightpull-drag');
    });

    // Add the mouse move event and capture data. Also update the viewport width.
    $orgs['#patternlab-body'].on('mousemove', function (e) {
      if ($orgs['#sg-cover'].getState().classArray.includes('shown-by-rightpull-drag')) {
        const viewportWidth = uiProps.sgRightpull.viewportWidth + 2 * (e.pageX - uiProps.sgRightpull.posX);

        if (viewportWidth > uiProps.minViewportWidth) {
          if (!dataSaver.findValue('vpWidth')) {
            dataSaver.addValue('vpWidth', viewportWidth);
          }
          else {
            dataSaver.updateValue('vpWidth', viewportWidth);
          }

          uiFns.sizeIframe(viewportWidth, false);
        }
      }
    });

    // Handle letting go of rightpull bar after dragging to resize.
    $orgs['#patternlab-body'].on('mouseup', function () {
      $orgs['#sg-cover'].dispatchAction('removeClass', 'shown-by-rightpull-hover');
      $orgs['#sg-cover'].dispatchAction('removeClass', 'shown-by-rightpull-drag');
    });
  });
}
