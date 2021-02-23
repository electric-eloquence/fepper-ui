export default class MustacheBrowser {
  #fepperUi;

  constructor(fepperUi) {
    this.#fepperUi = fepperUi;

    this.$orgs = fepperUi.requerio.$orgs;
  }

  listen() {
    document.addEventListener('DOMContentLoaded', () => {
      // These css actions are here instead of in the CodeViewer class to abstract away Mustache Browser behavior.
      this.$orgs['#sg-code-fill'].on('mouseenter', () => {
        const titleState = this.$orgs['#sg-code-title-mustache'].getState();

        if (titleState.classArray.includes('sg-code-title-active')) {
          this.$orgs['#sg-code-fill'].dispatchAction('css', {cursor: 'pointer'});
        }
        else {
          this.$orgs['#sg-code-fill'].dispatchAction('css', {cursor: 'default'});
        }
      });

      // Redirect to Fepper's Mustache browser when clicking the rel-path link.
      this.$orgs['#sg-code-pattern-info-rel-path'].on('click', this.mustacheBrowse.bind(this));

      // Redirect to Fepper's Mustache browser when clicking the viewer's Mustache code.
      this.$orgs['#sg-code-fill'].on('click', this.mustacheBrowse.bind(this));
    });
  }

  mustacheBrowse() {
    const titleState = this.$orgs['#sg-code-title-mustache'].getState();

    if (titleState.classArray.includes('sg-code-title-active')) {
      const patternPartial = this.$orgs['#sg-code-container'].getState().attribs['data-patternpartial'];
      const path = window.location.origin + '/mustache-browser?partial=' + patternPartial;

      // Load Mustache Browser
      this.$orgs['#sg-viewport'][0].contentWindow.location.assign(path);

      // Close code viewer.
      this.#fepperUi.codeViewer.closeCode();

      // Update annotations and code viewer states.
      this.#fepperUi.annotationsViewer.mustacheBrowser = true;
      this.#fepperUi.codeViewer.mustacheBrowser = true;
    }
  }
}
