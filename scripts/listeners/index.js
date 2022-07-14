import AnnotationsViewer from './annotations-viewer.js';
import CodeViewer from './code-viewer.js';
import PatternFinder from './pattern-finder.js';
import PatternViewport from './pattern-viewport.js';
import RequerioInspector from './requerio-inspector.js';
import UrlHandler from './url-handler.js';
import ViewerHandler from './viewer-handler.js';

export default class Listeners {
  constructor(fepperUi) {
    this.$orgs = fepperUi.requerio.$orgs;
    this.annotationsViewer = fepperUi.annotationsViewer;
    this.codeViewer = fepperUi.codeViewer;
    this.dataSaver = fepperUi.dataSaver;
    this.patternFinder = fepperUi.patternFinder;
    this.uiFns = fepperUi.uiFns;
    this.uiProps = fepperUi.uiProps;
    this.viewerHandler = fepperUi.viewerHandler;
    this.listeners = {
      annotationsViewer: new AnnotationsViewer(fepperUi),
      codeViewer: new CodeViewer(fepperUi),
      patternFinder: new PatternFinder(fepperUi),
      patternViewport: new PatternViewport(fepperUi),
      requerioInspector: new RequerioInspector(fepperUi),
      urlHandler: new UrlHandler(fepperUi),
      viewerHandler: new ViewerHandler(fepperUi)
    };
    this.windowResizing = false;
  }

  listen() {
    for (const classKey of Object.keys(this.listeners)) {
      if (this.listeners[classKey] instanceof Object && typeof this.listeners[classKey].listen === 'function') {
        this.listeners[classKey].listen();
      }
    }

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
      else if (
        this.uiProps.halfMode ||
        this.dataSaver.findValue('halfMode') === 'true' ||
        (
          (this.uiProps.dockPosition === 'left' || this.uiProps.dockPosition === 'right') &&
          this.uiProps.vpWidth === (this.uiProps.sw / 2) - this.uiProps.sgRightpullWidth
        )
      ) {
        // Set iframe width on halfMode === true.
        this.uiFns.sizeIframe(vpWidth, false, false, true);

        if (
          this.uiProps.lastViewer === 'annotations' ||
          this.dataSaver.findValue('lastViewer') === 'annotations'
        ) {
          // Open annotations viewer if last opened viewer was annotations.
          this.$orgs['#sg-viewport'].one('load', () => {
            this.annotationsViewer.openAnnotations();
          });
        }
        else {
          // Open code viewer by default.
          this.codeViewer.openCode();
        }
      }
      else if (vpWidth) {
        // .updateViewportWidth() also sizes the iframe, but with fewer bells and whistles.
        this.uiFns.updateViewportWidth(Number(vpWidth));
      }

      this.$orgs.window.on('resize', () => {
        // On first tick of resize.
        if (!this.windowResizing) {
          if (this.annotationsViewer.annotationsActive || this.codeViewer.codeActive) {
            this.$orgs['#sg-vp-wrap'].dispatchAction('removeClass', 'anim-ready');

            // Zero out padding-bottom, but unset this zeroing out after done resizing.
            if (this.uiProps.dockPosition === 'bottom') {
              this.$orgs['#sg-vp-wrap'].dispatchAction('css', {paddingBottom: '0'});
            }
          }
        }

        // On each tick of resize.
        this.windowResizing = true;

        // Switch to dockPosition bottom if width is below threshold.
        if (this.uiProps.dockPosition !== 'bottom') {
          if (this.uiProps.sw <= this.uiProps.bpSm) {
            if (this.annotationsViewer.annotationsActive || this.codeViewer.codeActive) {
              this.viewerHandler.dockBottom();
            }
            else {
              this.uiProps.dockPosition = 'bottom';
              this.dataSaver.updateValue('dockPosition', this.uiProps.dockPosition);
              this.$orgs['#patternlab-body']
                .dispatchAction('removeClass', 'dock-left dock-right')
                .dispatchAction('addClass', 'dock-' + this.uiProps.dockPosition);
            }
          }
        }

        // Check if in wholeMode.
        if (
          this.uiProps.wholeMode ||
          this.dataSaver.findValue('wholeMode') === 'true'
        ) {
          // Set iframe width to window width and wholeMode = true.
          this.uiFns.sizeIframe(this.uiProps.sw, false, true);
        }
        // Check if in halfMode.
        else if (
          this.uiProps.halfMode ||
          this.dataSaver.findValue('halfMode') === 'true'
        ) {
          // Set iframe width to half and halfMode = true.
          this.uiFns.sizeIframe((this.uiProps.sw / 2) - this.uiProps.sgRightpullWidth, false, false, true);
        }
      });

      this.$orgs.window.on('resize', this.uiFns.debounce(() => {
        this.windowResizing = false;

        if (
          this.uiProps.sw <= this.uiProps.bpSm ||
          this.uiProps.sw > this.uiProps.bpMd
        ) {
          this.$orgs['.sg-size'].dispatchAction('removeClass', 'active');
          this.$orgs['#sg-form-label'].dispatchAction('removeClass', 'active');
        }

        if (this.annotationsViewer.annotationsActive || this.codeViewer.codeActive) {
          if (this.uiProps.dockPosition === 'bottom') {
            // Unset the zeroing out of padding-bottom.
            this.$orgs['#sg-vp-wrap'].dispatchAction('css', {paddingBottom: ''});

            setTimeout(() => {
              this.$orgs['#sg-vp-wrap'].dispatchAction('addClass', 'anim-ready');
            }, this.uiProps.timeoutDefault);
          }
          else {
            this.$orgs['#sg-vp-wrap'].dispatchAction('addClass', 'anim-ready');
          }
        }
      }));
    });

    window.Mousetrap.bind('esc', () => {
      if (this.annotationsViewer.annotationsActive && this.uiProps.dockPosition === 'bottom') {
        this.annotationsViewer.closeAnnotations();
      }

      if (this.codeViewer.codeActive && this.uiProps.dockPosition === 'bottom') {
        this.codeViewer.closeCode();
      }

      this.patternFinder.closeFinder();
    });
  }
}
