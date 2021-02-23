export default class PatternlabViewer {
  #fepperUi;

  constructor(fepperUi) {
    this.#fepperUi = fepperUi;

    this.$orgs = fepperUi.requerio.$orgs;
  }

  listen() {
    // e2e test this by triggering the pattern to postMessage to be received here.
    window.addEventListener('message', this.#fepperUi.patternlabViewer.receiveIframeMessage);

    document.addEventListener('DOMContentLoaded', () => {
      const fepperUi = this.#fepperUi;

      // Click handler for elements in pull down menus. Update the iframe. Also close the menu.
      this.$orgs['.sg-pop'].on(
        'click',
        {this: this},
        function (e) {
          e.preventDefault();

          // Update the iframe via the history api handler.
          const obj = {
            event: 'patternlab.updatePath',
            path: window.$(this).attr('href')
          };

          e.data.this.$orgs['#sg-viewport'][0].contentWindow.postMessage(obj, fepperUi.uiProps.targetOrigin);
          fepperUi.uiFns.closeAllPanels();
        }
      );

      // Click handlers for viewport resize buttons.
      for (const bp of Object.keys(this.#fepperUi.uiProps.bpObj)) {
        if (!this.$orgs['#sg-size-' + bp]) {
          continue;
        }

        this.$orgs['#sg-size-' + bp].on('click', (e) => {
          e.preventDefault();

          const bpObjSize = this.#fepperUi.uiProps.bpObj[bp];
          let newSize;

          if (bpObjSize > this.#fepperUi.uiProps.maxViewportWidth) {
            // If the entered size is larger than the max allowed viewport size, cap
            // value at max vp size.
            newSize = this.#fepperUi.uiProps.maxViewportWidth;
          }
          else if (bpObjSize < this.#fepperUi.uiProps.minViewportWidth) {
            // If the entered size is less than the minimum allowed viewport size, cap
            // value at min vp size.
            newSize = this.#fepperUi.uiProps.minViewportWidth;
          }
          else {
            newSize = bpObjSize;
          }

          this.#fepperUi.uiFns.stopDisco();
          this.#fepperUi.uiFns.stopGrow();
          this.#fepperUi.uiFns.sizeIframe(newSize);
        });
      }
    });

    const Mousetrap = window.Mousetrap;

    // Mousetrap keyboard shortcuts.
    // Publicly documenting ctrl+alt+0 because ctrl+shift+0 does not work in Windows.
    // However, allowing ctrl+shift+0 because it is publicly documented by Pattern Lab.
    Mousetrap.bind(['ctrl+alt+0', 'ctrl+shift+0'], (e) => {
      this.#fepperUi.patternlabViewer.goXXSmall();

      e.preventDefault();
      return false;
    });

    // Extra small.
    Mousetrap.bind('ctrl+shift+x', (e) => {
      this.#fepperUi.patternlabViewer.goXSmall();

      e.preventDefault();
      return false;
    });

    // Small.
    Mousetrap.bind('ctrl+shift+s', (e) => {
      this.#fepperUi.patternlabViewer.goSmall();

      e.preventDefault();
      return false;
    });

    // Medium.
    Mousetrap.bind('ctrl+shift+m', (e) => {
      this.#fepperUi.patternlabViewer.goMedium();

      e.preventDefault();
      return false;
    });

    // Large.
    Mousetrap.bind('ctrl+shift+l', (e) => {
      this.#fepperUi.patternlabViewer.goLarge();

      e.preventDefault();
      return false;
    });

    // TODO: The following is DEPRECATED since it was a workaround for pre-Chromium Microsoft Edge.
    Mousetrap.bind('ctrl+alt+l', (e) => {
      this.#fepperUi.patternlabViewer.goLarge();

      e.preventDefault();
      return false;
    });

    // Allowing ctrl+shift+w to go whole viewport on MacOS since this shortcut can be easily intuited from the other
    // shortcuts. However, ctrl+shift+w cannot be publicly documented since browser behavior may change without
    // warning in the future (however unlikely).
    Mousetrap.bind(['ctrl+alt+w', 'ctrl+shift+w'], (e) => {
      this.#fepperUi.patternlabViewer.goWhole();

      e.preventDefault();
      return false;
    });

    // Random width.
    Mousetrap.bind('ctrl+alt+r', (e) => {
      this.#fepperUi.patternlabViewer.goRandom();

      e.preventDefault();
      return false;
    });

    // Disco mode.
    Mousetrap.bind('ctrl+shift+d', (e) => {
      this.#fepperUi.uiFns.toggleDisco();

      e.preventDefault();
      return false;
    });

    // Grow animation.
    Mousetrap.bind('ctrl+alt+g', (e) => {
      this.#fepperUi.uiFns.toggleGrow();

      e.preventDefault();
      return false;
    });
  }
}
