/**
 * Copyright (c) 2014 Dave Olsen, http://dmolsen.com
 * Licensed under the MIT license
 */
let root;
let fepperUiInst;

export default class {
  // Declared as a class field to retain the Event function prototype while keeping the class constructor tidy.
  // Exposed as a property on the instance so it can be unit tested.
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

  constructor(fepperUi, root_) {
    root = root_;
    fepperUiInst = fepperUi;

    this.data = [];

    for (let patternPartial of Object.keys(this.uiData.patternPaths)) {
      const obj = {
        patternPartial,
        patternPath: this.uiData.patternPaths[patternPartial]
      };

      this.data.push(obj);
    }

    // Instantiate the bloodhound suggestion engine.
    const Bloodhound = root.Bloodhound;

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

  // Getters for fepperUi instance props in case they are undefined at instantiation.

  get $orgs() {
    return fepperUiInst.requerio.$orgs;
  }

  get uiData() {
    return fepperUiInst.uiData;
  }

  get uiFns() {
    return fepperUiInst.uiFns;
  }

  get uiProps() {
    return fepperUiInst.uiProps;
  }

  // Methods

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
    const obj = {
      event: 'patternlab.updatePath',
      path: item.patternPath
    };

    // Update the iframe via the history api handler.
    this.closeFinder();
    this.$orgs['#sg-viewport'][0].contentWindow.postMessage(obj, this.uiProps.targetOrigin);
  }

  toggleFinder() {
    this.uiFns.closeOtherPanels(this.$orgs['#sg-f-toggle'][0]);

    this.$orgs['#sg-f-toggle'].dispatchAction('toggleClass', 'active');
    this.$orgs['#sg-find'].dispatchAction('toggleClass', 'active');

    const sgFToggleState = this.$orgs['#sg-f-toggle'].getState();

    if (sgFToggleState.classList.includes('active')) {
      this.$orgs['#typeahead'].dispatchAction('focus');
    }
  }
}
