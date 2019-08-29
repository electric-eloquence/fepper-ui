// Be sure to e2e test listeners.

import AnnotationsViewer from './annotations-viewer.js';
import CodeViewer from './code-viewer.js';
import MustacheBrowser from './mustache-browser.js';
import PatternFinder from './pattern-finder.js';
import PatternlabViewer from './patternlab-viewer.js';
import UrlHandler from './url-handler.js';

export default class {
  constructor(fepperUi) {
    this.fepperUi = fepperUi;
    this.$orgs = fepperUi.requerio.$orgs;
    this.uiFns = fepperUi.uiFns;
    this.uiProps = fepperUi.uiProps;
    this.dataSaver = fepperUi.dataSaver;
    this.annotationsViewer = new AnnotationsViewer(fepperUi);
    this.codeViewer = new CodeViewer(fepperUi);
    this.mustacheBrowser = new MustacheBrowser(fepperUi);
    this.patternFinder = new PatternFinder(fepperUi);
    this.patternlabViewer = new PatternlabViewer(fepperUi);
    this.urlHandler = new UrlHandler(fepperUi);
  }

  listen() {
    Object.keys(this).forEach((classKey) => {
      if (this[classKey] instanceof Object && typeof this[classKey].listen === 'function') {
        this[classKey].listen();
      }
    });

    const annotationsViewer = this.fepperUi.annotationsViewer;
    const codeViewer = this.fepperUi.codeViewer;
    const patternFinder = this.fepperUi.patternFinder;

    document.addEventListener('DOMContentLoaded', () => {
      const vpWidth = this.dataSaver.findValue('vpWidth');

      // Update iframe width if in wholeMode or if freshly opened with no .uiProps data or .dataSaver cookie.
      if (
        this.uiProps.wholeMode ||
        this.dataSaver.findValue('wholeMode') === 'true' ||
        (
          this.uiProps.wholeMode == null && // eslint-disable-line eqeqeq
          !this.dataSaver.findValue('wholeMode') &&
          !vpWidth
        )
      ) {
        // Set iframe width to window width and wholeMode = true.
        this.uiFns.sizeIframe(this.uiProps.sw, false, true);
      }
      else if (vpWidth) {
        this.uiFns.updateViewportWidth(Number(vpWidth));
      }

      let widthBefore = this.uiProps.sw;

      this.$orgs.window.on('resize', this.uiFns.debounce(() => {
        // Update iframe width if in wholeMode.
        if (
          this.uiProps.wholeMode ||
          this.dataSaver.findValue('wholeMode') === 'true'
        ) {
          // Set iframe width to window width and wholeMode = true.
          this.uiFns.sizeIframe(this.uiProps.sw, false, true);
        }

        // Adjust the distance with which to hide the annotations and code viewers.
        const widthNow = this.uiProps.sw;

        // Only fire if body width has changed, i.e., do not fire if only body height has changed.
        if (widthNow !== widthBefore) {
          widthBefore = widthNow;

          const bottomDistAnnotations = parseInt(this.$orgs['#sg-annotations-container'].getState().style.bottom, 10);

          if (Number.isNaN(bottomDistAnnotations) || bottomDistAnnotations === 0) {
            return;
          }

          annotationsViewer.slideAnnotations(
            this.$orgs['#sg-annotations-container'].getState().innerHeight
          );

          const bottomDistCode = parseInt(this.$orgs['#sg-code-container'].getState().style.bottom, 10);

          if (Number.isNaN(bottomDistCode) || bottomDistCode === 0) {
            return;
          }

          codeViewer.slideCode(this.$orgs['#sg-code-container'].getState().innerHeight);
        }
      }));
    });

    const Mousetrap = window.Mousetrap;

    Mousetrap.bind('esc', () => {
      if (annotationsViewer.annotationsActive) {
        annotationsViewer.closeAnnotations();
      }

      if (codeViewer.codeActive) {
        codeViewer.closeCode();
      }

      patternFinder.closeFinder();
    });
  }
}
