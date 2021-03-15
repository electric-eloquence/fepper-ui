// Be sure to e2e test pattern scripts.

import './annotations-viewer.js';
import './code-viewer.js';
import './mustache-browser.js';
import './pattern-finder.js';
import './pattern-viewport.js';

if (parent !== window && window.Mousetrap) {
  const Mousetrap = window.Mousetrap;
  const targetOrigin =
    (window.location.protocol === 'file:') ? '*' : window.location.protocol + '//' + window.location.host;

  Mousetrap.bind('esc', () => {
    const obj = {event: 'patternlab.keyPress', keyPress: 'esc'};

    parent.postMessage(obj, targetOrigin);
  });
}
