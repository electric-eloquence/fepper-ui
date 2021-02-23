import AnnotationsViewer from './annotations-viewer.js';
import CodeViewer from './code-viewer.js';
import MustacheBrowser from './mustache-browser.js';
import PatternFinder from './pattern-finder.js';
import PatternlabViewer from './patternlab-viewer.js';
import UrlHandler from './url-handler.js';

export default class Listeners {
  #fepperUi;

  constructor(fepperUi) {
    this.#fepperUi = fepperUi;

    this.$orgs = fepperUi.requerio.$orgs;

    this.annotationsViewer = new AnnotationsViewer(fepperUi);
    this.codeViewer = new CodeViewer(fepperUi);
    this.mustacheBrowser = new MustacheBrowser(fepperUi);
    this.patternFinder = new PatternFinder(fepperUi);
    this.patternlabViewer = new PatternlabViewer(fepperUi);
    this.urlHandler = new UrlHandler(fepperUi);
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
      else if (vpWidth) {
        this.#fepperUi.uiFns.updateViewportWidth(Number(vpWidth));
      }

      this.$orgs.window.on('resize', () => {
        // Adjust viewport padding if annotations or code viewer is active.
        if (this.#fepperUi.annotationsViewer.annotationsActive || this.#fepperUi.codeViewer.codeActive) {
          this.$orgs['#sg-vp-wrap']
            .dispatchAction('removeClass', 'anim-ready')
            .dispatchAction('css', {paddingBottom: (this.#fepperUi.uiProps.sh / 2) + 'px'})
            .dispatchAction('addClass', 'anim-ready');
        }
      });

      this.$orgs.window.on('resize', this.#fepperUi.uiFns.debounce(() => {
        // Update iframe width if in wholeMode.
        if (
          this.#fepperUi.uiProps.wholeMode ||
          this.#fepperUi.dataSaver.findValue('wholeMode') === 'true'
        ) {
          // Set iframe width to window width and wholeMode = true.
          this.#fepperUi.uiFns.sizeIframe(this.#fepperUi.uiProps.sw, false, true);
        }
      }));
    });

    const Mousetrap = window.Mousetrap;

    Mousetrap.bind('esc', () => {
      if (this.#fepperUi.annotationsViewer.annotationsActive) {
        this.#fepperUi.annotationsViewer.closeAnnotations();
      }

      if (this.#fepperUi.codeViewer.codeActive) {
        this.#fepperUi.codeViewer.closeCode();
      }

      this.#fepperUi.patternFinder.closeFinder();
    });
  }
}
