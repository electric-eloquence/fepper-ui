export default class PatternlabViewer {
  constructor(fepperUi) {
    this.annotationsViewer = fepperUi.annotationsViewer;
    this.codeViewer = fepperUi.codeViewer;
    this.patternViewport = fepperUi.patternViewport;
    this.uiFns = fepperUi.uiFns;
    this.uiProps = fepperUi.uiProps;
    this.$orgs = fepperUi.requerio.$orgs;
  }

  listen() {
    // e2e test this by triggering the pattern to postMessage to be received here.
    window.addEventListener('message', this.patternViewport.receiveIframeMessage);

    document.addEventListener('DOMContentLoaded', () => {
      const {
        annotationsViewer,
        codeViewer,
        uiFns,
        uiProps,
        $orgs
      } = this;

      // Click handler for links in accordion menus.
      this.$orgs['.sg-pop'].on(
        'click',
        {this: this},
        function (e) {
          e.preventDefault();

          const annotationsToggle = annotationsViewer.annotationsActive ? 'on' : 'off';
          const codeToggle = codeViewer.codeActive ? 'on' : 'off';

          $orgs['#sg-viewport'].one('load', () => {
            $orgs['#sg-viewport'][0].contentWindow.postMessage(
              {annotationsToggle, codeToggle}, uiProps.targetOrigin);
          });

          const messageObj = {
            event: 'patternlab.updatePath',
            path: window.$(this).attr('href')
          };

          uiFns.closeAllPanels();
          uiFns.updatePath(messageObj, this.dataset.patternPartial);
        }
      );

      // Click handlers for viewport resize buttons.
      for (const bp of Object.keys(uiProps.bpObj)) {
        if (!$orgs['#sg-size-' + bp]) {
          continue;
        }

        $orgs['#sg-size-' + bp].on('click', (e) => {
          e.preventDefault();

          const bpObjSize = uiProps.bpObj[bp];
          let newSize;

          if (bpObjSize > uiProps.maxViewportWidth) {
            // If the entered size is larger than the max allowed viewport size, cap
            // value at max vp size.
            newSize = uiProps.maxViewportWidth;
          }
          else if (bpObjSize < uiProps.minViewportWidth) {
            // If the entered size is less than the minimum allowed viewport size, cap
            // value at min vp size.
            newSize = uiProps.minViewportWidth;
          }
          else {
            newSize = bpObjSize;
          }

          uiFns.stopDisco();
          uiFns.stopGrow();
          uiFns.sizeIframe(newSize);
        });
      }
    });

    const Mousetrap = window.Mousetrap;

    // Mousetrap keyboard shortcuts.
    // Publicly documenting ctrl+alt+0 because ctrl+shift+0 does not work in Windows.
    // However, allowing ctrl+shift+0 because it is publicly documented by Pattern Lab.
    Mousetrap.bind(['ctrl+alt+0', 'ctrl+shift+0'], (e) => {
      this.patternViewport.goXXSmall();

      e.preventDefault();
      return false;
    });

    // Extra small.
    Mousetrap.bind('ctrl+shift+x', (e) => {
      this.patternViewport.goXSmall();

      e.preventDefault();
      return false;
    });

    // Small.
    Mousetrap.bind('ctrl+shift+s', (e) => {
      this.patternViewport.goSmall();

      e.preventDefault();
      return false;
    });

    // Medium.
    Mousetrap.bind('ctrl+shift+m', (e) => {
      this.patternViewport.goMedium();

      e.preventDefault();
      return false;
    });

    // Large.
    Mousetrap.bind('ctrl+shift+l', (e) => {
      this.patternViewport.goLarge();

      e.preventDefault();
      return false;
    });

    // Allowing ctrl+shift+w to go whole viewport on MacOS since this shortcut can be easily intuited from the other
    // shortcuts. However, ctrl+shift+w cannot be publicly documented since browser behavior may change without
    // warning in the future (however unlikely).
    Mousetrap.bind(['ctrl+alt+w', 'ctrl+shift+w'], (e) => {
      this.patternViewport.goWhole();

      e.preventDefault();
      return false;
    });

    // Random width.
    Mousetrap.bind('ctrl+alt+r', (e) => {
      this.patternViewport.goRandom();

      e.preventDefault();
      return false;
    });

    // Disco mode.
    Mousetrap.bind('ctrl+shift+d', (e) => {
      this.uiFns.toggleDisco();

      e.preventDefault();
      return false;
    });

    // Grow animation.
    Mousetrap.bind('ctrl+alt+g', (e) => {
      this.uiFns.toggleGrow();

      e.preventDefault();
      return false;
    });
  }
}
