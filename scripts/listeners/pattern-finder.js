// Be sure to e2e test listeners.

// TODO: Replace closure with private class field when there is greater browser support.
export default function (fepperUiInst) {
  class PatternFinder {
    constructor(fepperUi) {
      this.$orgs = fepperUi.requerio.$orgs;
    }

    listen() {
      // e2e test this by triggering the pattern to postMessage to be received here.
      window.addEventListener('message', fepperUiInst.patternFinder.receiveIframeMessage, false);

      const Mousetrap = window.Mousetrap;

      document.addEventListener('DOMContentLoaded', () => {
        Mousetrap(this.$orgs['#typeahead'][0]).bind('ctrl+shift+f', (e) => {
          fepperUiInst.patternFinder.toggleFinder();

          e.preventDefault();
          return false;
        });

        Mousetrap(this.$orgs['#typeahead'][0]).bind('esc', () => {
          fepperUiInst.patternFinder.closeFinder();
        });
      });

      Mousetrap.bind('ctrl+shift+f', (e) => {
        fepperUiInst.patternFinder.toggleFinder();

        e.preventDefault();
        return false;
      });
    }
  }

  return new PatternFinder(fepperUiInst);
}
