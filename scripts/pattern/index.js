// Be sure to e2e test pattern scripts.

import './annotations-viewer.js';
import './code-viewer.js';
import './pattern-finder.js';
import './pattern-viewport.js';

if (parent !== window && window.Mousetrap) {
  const targetOrigin =
    (window.location.protocol === 'file:') ? '*' : window.location.protocol + '//' + window.location.host;

  window.Mousetrap.bind('esc', () => {
    const messageObj = {event: 'patternlab.keyPress', keyPress: 'esc'};

    parent.postMessage(messageObj, targetOrigin);
  });
}
