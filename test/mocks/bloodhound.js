// Set globals before requiring Bloodhound.
global.$.Deferred = () => Object.create({
  resolve: () => Object.create({
    promise: () => {}
  })
});
global._ = require('lodash');
global.oParser = {
  local: () => {},
  prefetch: () => {},
  remote: () => {}
};
global.SearchIndex = class {
  constructor(o) {
    this.datumTokenizer = o.datumTokenizer;
    this.queryTokenizer = o.queryTokenizer;
  }
  bootstrap() {
  }
  add() {
  }
  get() {
  }
};
global.tokenizers = {
  nonword: () => {},
  whitespace: () => {},
  obj: {
    nonword: () => {},
    whitespace: () => {}
  }
};

global.Bloodhound = require('typeahead.js/src/bloodhound/bloodhound').Bloodhound;
