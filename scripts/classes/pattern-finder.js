/**
 * Copyright (c) 2014 Dave Olsen, http://dmolsen.com
 * Licensed under the MIT license
 */

export default class PatternFinder {

  /* CLASS FIELDS */

  // The following function is declared as a class field to retain the Event function prototype while keeping the
  // class constructor tidy. Exposed as a property on the instance so it can be unit tested.
  receiveIframeMessage = (event) => {
    const data = this.uiFns.receiveIframeMessageBoilerplate(event);

    if (!data) {
      return;
    }

    switch (data.event) {
      case 'patternlab.keyPress':
        switch (data.keyPress) {
          case 'ctrl+shift+f':
            this.toggleFinder();

            break;

          case 'esc':
            this.closeFinder();

            break;
        }
    }
  };

  // Private class fields.
  #fepperUi;
  #root;

  /* CONSTRUCTOR */

  constructor(fepperUi, root) {
    this.#fepperUi = fepperUi;
    this.#root = root;

    this.data = [];
    this.$orgs = fepperUi.requerio.$orgs;

    for (const patternPartial of Object.keys(this.uiData.patternPaths)) {
      const patternData = {
        patternPartial,
        patternPath: this.uiData.patternPaths[patternPartial]
      };

      this.data.push(patternData);
    }

    // Instantiate the bloodhound suggestion engine.
    const Bloodhound = window.Bloodhound;

    this.patterns = new Bloodhound({
      datumTokenizer: function (data) {
        /* istanbul ignore next */
        return Bloodhound.tokenizers.nonword(data.patternPartial);
      },
      queryTokenizer: Bloodhound.tokenizers.nonword,
      limit: 10,
      local: this.data
    });

    // Initialize the bloodhound suggestion engine.
    this.patterns.initialize();
  }

  /* GETTERS for fepperUi instance props in case they are undefined at instantiation. */

  get annotationsViewer() {
    return this.#fepperUi.annotationsViewer;
  }

  get codeViewer() {
    return this.#fepperUi.codeViewer;
  }

  get uiData() {
    return this.#fepperUi.uiData;
  }

  get uiFns() {
    return this.#fepperUi.uiFns;
  }

  get uiProps() {
    return this.#fepperUi.uiProps;
  }

  /* METHODS */

  closeFinder() {
    this.$orgs['#sg-f-toggle'].dispatchAction('removeClass', 'active');
    this.$orgs['#sg-find'].dispatchAction('removeClass', 'active');
    this.$orgs['#typeahead'].dispatchAction('blur');
  }

  // Need to pass PatternFinder instance because "this" gets overridden.
  onAutocompleted(e, item, patternFinder) {
    patternFinder.passPath(item);
  }

  // Need to pass PatternFinder instance because "this" gets overridden.
  onSelected(e, item, patternFinder) {
    patternFinder.passPath(item);
  }

  passPath(item) {
    const annotationsToggle = this.annotationsViewer.annotationsActive ? 'on' : 'off';
    const codeToggle = this.codeViewer.codeActive ? 'on' : 'off';
    const messageObj = {
      event: 'patternlab.updatePath',
      path: item.patternPath
    };

    this.$orgs['#sg-viewport'].one('load', () => {
      this.$orgs['#sg-viewport'][0].contentWindow.postMessage(
        {annotationsToggle, codeToggle},
        this.uiProps.targetOrigin
      );
    });

    // Update the iframe via the history api handler.
    this.closeFinder();
    this.uiFns.updatePath(messageObj, item.patternPartial);
  }

  toggleFinder() {
    this.uiFns.closeOtherPanels(this.$orgs['#sg-f-toggle'][0]);

    this.$orgs['#sg-f-toggle'].dispatchAction('toggleClass', 'active');
    this.$orgs['#sg-find'].dispatchAction('toggleClass', 'active');

    const sgFToggleState = this.$orgs['#sg-f-toggle'].getState();

    if (sgFToggleState.classArray.includes('active')) {
      this.$orgs['#typeahead'].dispatchAction('focus');
    }
  }
}
