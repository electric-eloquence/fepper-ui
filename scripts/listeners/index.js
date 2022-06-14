import AnnotationsViewer from './annotations-viewer.js';
import CodeViewer from './code-viewer.js';
import PatternFinder from './pattern-finder.js';
import PatternViewport from './pattern-viewport.js';
import UrlHandler from './url-handler.js';
import ViewerHandler from './viewer-handler.js';

export default class Listeners {
  #fepperUi;

  constructor(fepperUi) {
    this.#fepperUi = fepperUi;

    this.$orgs = fepperUi.requerio.$orgs;

    this.annotationsViewer = new AnnotationsViewer(fepperUi);
    this.codeViewer = new CodeViewer(fepperUi);
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
      const vpWidth = this.#fepperUi.dataSaver.findValue('vpWidth');

      // Update iframe width if in wholeMode or if freshly opened with no .uiProps data or .dataSaver cookie.
      if (
        this.#fepperUi.uiProps.wholeMode ||
        this.#fepperUi.dataSaver.findValue('wholeMode') === 'true' ||
        (
          this.#fepperUi.uiProps.wholeMode == null && // eslint-disable-line eqeqeq
          !this.#fepperUi.dataSaver.findValue('wholeMode') &&
          !vpWidth
        )
      ) {
        // Set iframe width to window width and wholeMode = true.
        this.#fepperUi.uiFns.sizeIframe(this.#fepperUi.uiProps.sw, false, true);
      }
      else if (
        this.#fepperUi.uiProps.halfMode ||
        this.#fepperUi.dataSaver.findValue('halfMode') === 'true' ||
        (
          (this.#fepperUi.uiProps.dockPosition === 'left' || this.#fepperUi.uiProps.dockPosition === 'right') &&
          this.#fepperUi.uiProps.vpWidth === (this.#fepperUi.uiProps.sw / 2) - this.#fepperUi.uiProps.sgRightpullWidth
        )
      ) {
        // Set iframe width on halfMode === true.
        this.#fepperUi.uiFns
          .sizeIframe((this.#fepperUi.uiProps.sw / 2) - this.#fepperUi.uiProps.sgRightpullWidth, false, false, true);

        if (
          this.#fepperUi.uiProps.lastViewer === 'annotations' ||
          this.#fepperUi.dataSaver.findValue('lastViewer') === 'annotations'
        ) {
          // Open annotations viewer if last opened viewer was annotations.
          this.$orgs['#sg-viewport'].one('load', () => {
            this.#fepperUi.annotationsViewer.openAnnotations();
          });
        }
        else {
          // Open code viewer by default.
          this.#fepperUi.codeViewer.openCode();
        }
      }
      else if (vpWidth) {
        // .updateViewportWidth() also sizes the iframe, but with fewer bells and whistles.
        this.#fepperUi.uiFns.updateViewportWidth(Number(vpWidth));
      }

      this.$orgs.window.on('resize', () => {
        // On first tick of resize.
        if (!this.windowResizing) {
          if (this.#fepperUi.annotationsViewer.annotationsActive || this.#fepperUi.codeViewer.codeActive) {
            this.$orgs['#sg-vp-wrap'].dispatchAction('removeClass', 'anim-ready');

            // Zero out padding-bottom, but unset this zeroing out after done resizing.
            if (this.#fepperUi.uiProps.dockPosition === 'bottom') {
              this.$orgs['#sg-vp-wrap'].dispatchAction('css', {paddingBottom: '0'});
            }
          }
        }

        // On each tick of resize.
        this.windowResizing = true;

        // Switch to dockPosition bottom if width is below threshold.
        if (this.#fepperUi.uiProps.dockPosition !== 'bottom') {
          if (this.#fepperUi.uiProps.sw <= this.#fepperUi.uiProps.bpSm) {
            if (this.#fepperUi.annotationsViewer.annotationsActive || this.#fepperUi.codeViewer.codeActive) {
              this.#fepperUi.viewerHandler.dockBottom();
            }
            else {
              this.#fepperUi.uiProps.dockPosition = 'bottom';
              this.#fepperUi.dataSaver.updateValue('dockPosition', this.#fepperUi.uiProps.dockPosition);
              this.$orgs['#patternlab-body']
                .dispatchAction('removeClass', 'dock-left dock-right')
                .dispatchAction('addClass', 'dock-' + this.#fepperUi.uiProps.dockPosition);
            }
          }
        }

        // Check if in wholeMode.
        if (
          this.#fepperUi.uiProps.wholeMode ||
          this.#fepperUi.dataSaver.findValue('wholeMode') === 'true'
        ) {
          // Set iframe width to window width and wholeMode = true.
          this.#fepperUi.uiFns.sizeIframe(this.#fepperUi.uiProps.sw, false, true);
        }
        // Check if in halfMode.
        else if (
          this.#fepperUi.uiProps.halfMode ||
          this.#fepperUi.dataSaver.findValue('halfMode') === 'true'
        ) {
          // Set iframe width to half and halfMode = true.
          this.#fepperUi.uiFns
            .sizeIframe((this.#fepperUi.uiProps.sw / 2) - this.#fepperUi.uiProps.sgRightpullWidth, false, false, true);
        }
      });

      this.$orgs.window.on('resize', this.#fepperUi.uiFns.debounce(() => {
        this.windowResizing = false;

        if (
          this.#fepperUi.uiProps.sw <= this.#fepperUi.uiProps.bpSm ||
          this.#fepperUi.uiProps.sw > this.#fepperUi.uiProps.bpMd
        ) {
          this.$orgs['.sg-size'].dispatchAction('removeClass', 'active');
          this.$orgs['#sg-form-label'].dispatchAction('removeClass', 'active');
        }

        if (this.#fepperUi.annotationsViewer.annotationsActive || this.#fepperUi.codeViewer.codeActive) {
          if (this.#fepperUi.uiProps.dockPosition === 'bottom') {
            // Unset the zeroing out of padding-bottom.
            this.$orgs['#sg-vp-wrap'].dispatchAction('css', {paddingBottom: ''});

            setTimeout(() => {
              this.$orgs['#sg-vp-wrap'].dispatchAction('addClass', 'anim-ready');
            }, this.#fepperUi.uiProps.timeoutDefault);
          }
          else {
            this.$orgs['#sg-vp-wrap'].dispatchAction('addClass', 'anim-ready');
          }
        }
      }));
    });

    window.Mousetrap.bind('esc', () => {
      if (this.#fepperUi.annotationsViewer.annotationsActive && this.#fepperUi.uiProps.dockPosition === 'bottom') {
        this.#fepperUi.annotationsViewer.closeAnnotations();
      }

      if (this.#fepperUi.codeViewer.codeActive && this.#fepperUi.uiProps.dockPosition === 'bottom') {
        this.#fepperUi.codeViewer.closeCode();
      }

      this.#fepperUi.patternFinder.closeFinder();
    });
  }
}
