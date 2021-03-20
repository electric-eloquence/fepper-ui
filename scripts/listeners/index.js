// Be sure to e2e test listeners.

import AnnotationsViewer from './annotations-viewer.js';
import CodeViewer from './code-viewer.js';
import MustacheBrowser from './mustache-browser.js';
import PatternFinder from './pattern-finder.js';
import PatternViewport from './pattern-viewport.js';
import UrlHandler from './url-handler.js';
import ViewerHandler from './viewer-handler.js';

// TODO: Replace closure with private class field when there is greater browser support.
export default function (fepperUiInst) {
  class Listeners {
    constructor(fepperUi) {
      this.$orgs = fepperUi.requerio.$orgs;

      this.annotationsViewer = new AnnotationsViewer(fepperUi);
      this.codeViewer = new CodeViewer(fepperUi);
      this.mustacheBrowser = new MustacheBrowser(fepperUi);
      this.patternFinder = new PatternFinder(fepperUi);
      this.patternViewport = new PatternViewport(fepperUi);
      this.urlHandler = new UrlHandler(fepperUi);
      this.viewerHandler = new ViewerHandler(fepperUi);

      this.windowResizing = false;
    }

    // Getters for fepperUi instance props in case they are undefined at instantiation.

    get uiProps() {
      return fepperUiInst.uiProps;
    }

    listen() {
      for (const classKey of Object.keys(this)) {
        if (this[classKey] instanceof Object && typeof this[classKey].listen === 'function') {
          this[classKey].listen();
        }
      }

      document.addEventListener('DOMContentLoaded', () => {
        const vpWidth = fepperUiInst.dataSaver.findValue('vpWidth');

        // Update iframe width if in wholeMode or if freshly opened with no .uiProps data or .dataSaver cookie.
        if (
          fepperUiInst.uiProps.wholeMode ||
          fepperUiInst.dataSaver.findValue('wholeMode') === 'true' ||
          (
            fepperUiInst.uiProps.wholeMode == null && // eslint-disable-line eqeqeq
            !fepperUiInst.dataSaver.findValue('wholeMode') &&
            !vpWidth
          )
        ) {
          // Set iframe width to window width and wholeMode = true.
          fepperUiInst.uiFns.sizeIframe(fepperUiInst.uiProps.sw, false, true);
        }
        else if (vpWidth) {
          // .updateViewportWidth() also sizes the iframe, but with fewer bells and whistles.
          fepperUiInst.uiFns.updateViewportWidth(Number(vpWidth));
        }

        this.$orgs.window.on('resize', () => {
          // On first tick of resize.
          if (!this.windowResizing) {
            if (fepperUiInst.annotationsViewer.annotationsActive || fepperUiInst.codeViewer.codeActive) {
              this.$orgs['#sg-vp-wrap'].dispatchAction('removeClass', 'anim-ready');
            }
          }

          this.windowResizing = true;

          // On each tick of resize.
          if (fepperUiInst.annotationsViewer.annotationsActive || fepperUiInst.codeViewer.codeActive) {
            if (this.uiProps.dockPosition === 'bottom') {
              this.$orgs['#sg-vp-wrap'].dispatchAction('css', {paddingBottom: (fepperUiInst.uiProps.sh / 2) + 'px'});
            }
            else {
              if (this.uiProps.sw < 768) {
                this.viewerHandler.dockBottom();
              }
            }
          }
        });

        this.$orgs.window.on('resize', fepperUiInst.uiFns.debounce(() => {
          this.windowResizing = false;

          // Update iframe width if in wholeMode.
          if (
            fepperUiInst.uiProps.wholeMode ||
            fepperUiInst.dataSaver.findValue('wholeMode') === 'true'
          ) {
            // Set iframe width to window width and wholeMode = true.
            fepperUiInst.uiFns.sizeIframe(fepperUiInst.uiProps.sw, false, true);
          }

          if (fepperUiInst.annotationsViewer.annotationsActive || fepperUiInst.codeViewer.codeActive) {
            this.$orgs['#sg-vp-wrap'].dispatchAction('addClass', 'anim-ready');
          }
        }));
      });

      const Mousetrap = window.Mousetrap;

      Mousetrap.bind('esc', () => {
        if (fepperUiInst.annotationsViewer.annotationsActive) {
          fepperUiInst.annotationsViewer.closeAnnotations();
        }

        if (fepperUiInst.codeViewer.codeActive) {
          fepperUiInst.codeViewer.closeCode();
        }

        fepperUiInst.patternFinder.closeFinder();
      });
    }
  }

  return new Listeners(fepperUiInst);
}
