// Be sure to e2e test listeners.

// TODO: Replace closure with private class field when there is greater browser support.
export default function (fepperUiInst) {
  class PatternlabViewer {
    constructor(fepperUi) {
      this.$orgs = fepperUi.requerio.$orgs;
    }

    listen() {
      // e2e test this by triggering the pattern to postMessage to be received here.
      window.addEventListener('message', fepperUiInst.patternlabViewer.receiveIframeMessage);

      document.addEventListener('DOMContentLoaded', () => {
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

            e.data.this.$orgs['#sg-viewport'][0].contentWindow.postMessage(obj, fepperUiInst.uiProps.targetOrigin);
            fepperUiInst.uiFns.closeAllPanels();
          }
        );

        // Click handlers for viewport resize buttons.
        for (let bp of Object.keys(fepperUiInst.uiProps.bpObj)) {
          if (!this.$orgs['#sg-size-' + bp]) {
            continue;
          }

          this.$orgs['#sg-size-' + bp].on('click', (e) => {
            e.preventDefault();

            const bpObjSize = fepperUiInst.uiProps.bpObj[bp];
            let newSize;

            if (bpObjSize > fepperUiInst.uiProps.maxViewportWidth) {
              // If the entered size is larger than the max allowed viewport size, cap
              // value at max vp size.
              newSize = fepperUiInst.uiProps.maxViewportWidth;
            }
            else if (bpObjSize < fepperUiInst.uiProps.minViewportWidth) {
              // If the entered size is less than the minimum allowed viewport size, cap
              // value at min vp size.
              newSize = fepperUiInst.uiProps.minViewportWidth;
            }
            else {
              newSize = bpObjSize;
            }

            fepperUiInst.uiFns.stopDisco();
            fepperUiInst.uiFns.stopGrow();
            fepperUiInst.uiFns.sizeIframe(newSize);
          });
        }
      });

      const Mousetrap = window.Mousetrap;

      // Mousetrap keyboard shortcuts.
      // Publicly documenting ctrl+alt+0 because ctrl+shift+0 does not work in Windows.
      // However, allowing ctrl+shift+0 because it is publicly documented by Pattern Lab.
      Mousetrap.bind(['ctrl+alt+0', 'ctrl+shift+0'], (e) => {
        fepperUiInst.patternlabViewer.goXXSmall();

        e.preventDefault();
        return false;
      });

      // Extra small.
      Mousetrap.bind('ctrl+shift+x', (e) => {
        fepperUiInst.patternlabViewer.goXSmall();

        e.preventDefault();
        return false;
      });

      // Small.
      Mousetrap.bind('ctrl+shift+s', (e) => {
        fepperUiInst.patternlabViewer.goSmall();

        e.preventDefault();
        return false;
      });

      // Medium.
      Mousetrap.bind('ctrl+shift+m', (e) => {
        fepperUiInst.patternlabViewer.goMedium();

        e.preventDefault();
        return false;
      });

      // Large.
      Mousetrap.bind('ctrl+shift+l', (e) => {
        fepperUiInst.patternlabViewer.goLarge();

        if (navigator.userAgent.indexOf('Edge') > -1) {
          alert(fepperUiInst.uiProps.warnCtrlShiftLEdge);
        }

        e.preventDefault();
        return false;
      });

      // Large for Microsoft Edge.
      Mousetrap.bind('ctrl+alt+l', (e) => {
        fepperUiInst.patternlabViewer.goLarge();

        e.preventDefault();
        return false;
      });

      // Allowing ctrl+shift+w to go whole viewport on MacOS and Microsoft Edge since this shortcut can be easily
      // intuited from the other shortcuts. However, ctrl+shift+w cannot be publicly documented since browser behavior
      // may change without warning in the future.
      Mousetrap.bind(['ctrl+alt+w', 'ctrl+shift+w'], (e) => {
        fepperUiInst.patternlabViewer.goWhole();

        e.preventDefault();
        return false;
      });

      // Random width.
      Mousetrap.bind('ctrl+alt+r', (e) => {
        fepperUiInst.patternlabViewer.goRandom();

        e.preventDefault();
        return false;
      });

      // Disco mode.
      Mousetrap.bind('ctrl+shift+d', (e) => {
        fepperUiInst.uiFns.toggleDisco();

        e.preventDefault();
        return false;
      });

      // Grow animation.
      Mousetrap.bind('ctrl+alt+g', (e) => {
        fepperUiInst.uiFns.toggleGrow();

        e.preventDefault();
        return false;
      });
    }
  }

  return new PatternlabViewer(fepperUiInst);
}
