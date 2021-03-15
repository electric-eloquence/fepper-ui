// Be sure to e2e test listeners.

import AnnotationsViewer from './annotations-viewer.js';
import CodeViewer from './code-viewer.js';
import MustacheBrowser from './mustache-browser.js';
import PatternFinder from './pattern-finder.js';
import PatternViewport from './pattern-viewport.js';
import UrlHandler from './url-handler.js';

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
          fepperUiInst.uiFns.updateViewportWidth(Number(vpWidth));
        }

        this.$orgs.window.on('resize', () => {
          // Adjust viewport padding if annotations or code viewer is active.
          if (fepperUiInst.annotationsViewer.annotationsActive || fepperUiInst.codeViewer.codeActive) {
            this.$orgs['#sg-vp-wrap']
              .dispatchAction('removeClass', 'anim-ready')
              .dispatchAction('css', {paddingBottom: (fepperUiInst.uiProps.sh / 2) + 'px'})
              .dispatchAction('addClass', 'anim-ready');
          }
        });

        this.$orgs.window.on('resize', fepperUiInst.uiFns.debounce(() => {
          // Update iframe width if in wholeMode.
          if (
            fepperUiInst.uiProps.wholeMode ||
            fepperUiInst.dataSaver.findValue('wholeMode') === 'true'
          ) {
            // Set iframe width to window width and wholeMode = true.
            fepperUiInst.uiFns.sizeIframe(fepperUiInst.uiProps.sw, false, true);
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
