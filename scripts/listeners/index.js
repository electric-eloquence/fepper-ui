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
        else if (
          fepperUiInst.uiProps.halfMode ||
          fepperUiInst.dataSaver.findValue('halfMode') === 'true' ||
          (
            (fepperUiInst.uiProps.dockPosition === 'left' || fepperUiInst.uiProps.dockPosition === 'right') &&
            fepperUiInst.uiProps.vpWidth === (fepperUiInst.uiProps.sw / 2) - fepperUiInst.uiProps.sgRightpullWidth
          )
        ) {
          // Set iframe width on halfMode === true.
          fepperUiInst.uiFns
            .sizeIframe((fepperUiInst.uiProps.sw / 2) - fepperUiInst.uiProps.sgRightpullWidth, false, false, true);
        }
        else if (vpWidth) {
          // .updateViewportWidth() also sizes the iframe, but with fewer bells and whistles.
          fepperUiInst.uiFns.updateViewportWidth(Number(vpWidth));
        }

        if (fepperUiInst.uiProps.dockPosition === 'left' || fepperUiInst.uiProps.dockPosition === 'right') {
          this.$orgs['#patternlab-body'].dispatchAction('addClass', 'dock-open');
          fepperUiInst.codeViewer.openCode();
        }

        this.$orgs.window.on('resize', () => {
          // On first tick of resize.
          if (!this.windowResizing) {
            if (fepperUiInst.annotationsViewer.annotationsActive || fepperUiInst.codeViewer.codeActive) {
              this.$orgs['#sg-vp-wrap'].dispatchAction('removeClass', 'anim-ready');
            }
          }

          // On each tick of resize.
          this.windowResizing = true;

          // Switch to dockPosition bottom if width is below threshold.
          if (fepperUiInst.uiProps.dockPosition !== 'bottom') {
            if (fepperUiInst.uiProps.sw <= fepperUiInst.uiProps.bpSm) {
              if (fepperUiInst.annotationsViewer.annotationsActive || fepperUiInst.codeViewer.codeActive) {
                fepperUiInst.viewerHandler.dockBottom();
              }
              else {
                fepperUiInst.uiProps.dockPosition = 'bottom';
                fepperUiInst.dataSaver.updateValue('dockPosition', fepperUiInst.uiProps.dockPosition);
                this.$orgs['#patternlab-body']
                  .dispatchAction('removeClass', 'dock-left dock-right')
                  .dispatchAction('addClass', 'dock-' + fepperUiInst.uiProps.dockPosition);
              }
            }
          }

          // Check if in wholeMode.
          if (
            fepperUiInst.uiProps.wholeMode ||
            fepperUiInst.dataSaver.findValue('wholeMode') === 'true'
          ) {
            // Set iframe width to window width and wholeMode = true.
            fepperUiInst.uiFns.sizeIframe(fepperUiInst.uiProps.sw, false, true);
          }
          // Check if in halfMode.
          else if (
            fepperUiInst.uiProps.halfMode ||
            fepperUiInst.dataSaver.findValue('halfMode') === 'true'
          ) {
            // Set iframe width to half and halfMode = true.
            fepperUiInst.uiFns
              .sizeIframe((fepperUiInst.uiProps.sw / 2) - fepperUiInst.uiProps.sgRightpullWidth, false, false, true);
          }
        });

        this.$orgs.window.on('resize', fepperUiInst.uiFns.debounce(() => {
          this.windowResizing = false;

          if (
            fepperUiInst.uiProps.sw <= fepperUiInst.uiProps.bpSm ||
            fepperUiInst.uiProps.sw > fepperUiInst.uiProps.bpMd
          ) {
            this.$orgs['.sg-size'].dispatchAction('removeClass', 'active');
            this.$orgs['#sg-form-label'].dispatchAction('removeClass', 'active');
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
