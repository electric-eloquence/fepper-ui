// Be sure to e2e test listeners.

// TODO: Replace closure with private class field when there is greater browser support.
export default function (fepperUiInst) {
  class MustacheBrowser {
    constructor(fepperUi) {
      this.$orgs = fepperUi.requerio.$orgs;
    }

    listen() {
      document.addEventListener('DOMContentLoaded', () => {
        // These css actions are here instead of in the CodeViewer class to abstract away Mustache Browser behavior.
        this.$orgs['#sg-code-fill'].on('mouseover', () => {
          const titleState = this.$orgs['#sg-code-title-mustache'].getState();

          if (titleState.classList.includes('sg-code-title-active')) {
            this.$orgs['#sg-code-fill'].dispatchAction('css', {cursor: 'pointer'});
          }
          else {
            this.$orgs['#sg-code-fill'].dispatchAction('css', {cursor: 'default'});
          }
        });

        // Redirect to Fepper's Mustache browser when clicking the viewer's Mustache code.
        this.$orgs['#sg-code-fill'].on('click', () => {
          const titleState = this.$orgs['#sg-code-title-mustache'].getState();

          if (titleState.classList.includes('sg-code-title-active')) {
            const patternPartial = this.$orgs['#sg-code-container'].getState().attribs['data-patternpartial'];
            const path = window.location.origin + '/mustache-browser?partial=' + patternPartial;

            // Load Mustache Browser
            this.$orgs['#sg-viewport'][0].contentWindow.location.assign(path);

            // Close code viewer.
            fepperUiInst.codeViewer.closeCode();

            // Update annotations and code viewer states.
            fepperUiInst.annotationsViewer.mustacheBrowser = true;
            fepperUiInst.codeViewer.mustacheBrowser = true;
          }
        });
      });
    }
  }

  return new MustacheBrowser(fepperUiInst);
}
