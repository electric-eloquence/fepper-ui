// Be sure to e2e test pattern scripts.

import './annotations-viewer.js';
import './code-viewer.js';
import './pattern-finder.js';
import './patternlab-viewer.js';

if (parent !== window) {
  const Mousetrap = window.Mousetrap;
  const targetOrigin =
    (window.location.protocol === 'file:') ? '*' : window.location.protocol + '//' + window.location.host;

  Mousetrap.bind('esc', () => {
    const obj = {event: 'patternlab.keyPress', keyPress: 'esc'};

    parent.postMessage(obj, targetOrigin);
  });
}
