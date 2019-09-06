/**
 * Copyright (c) 2013-2016 Dave Olsen, http://dmolsen.com
 * Licensed under the MIT license.
 */
const d = document;
const targetOrigin =
  (window.location.protocol === 'file:') ? '*' : window.location.protocol + '//' + window.location.host;

// Before declaring and running anything else, postMessage to the UI to add pattern to history or update pattern info.
const patternDataEl = d.getElementById('sg-pattern-data-footer');
let patternData;

try {
  patternData = JSON.parse(patternDataEl.innerHTML);
}
catch (err) {
  // Fail gracefully.
}

// Only process this block to postMessage if there are patternData in the footer, i.e. not a viewall.
if (patternData) {
  const parts = window.location.href.split('?');
  let obj;

  // This if condition requires clicks within the iframe. WebdriverIO cannot test the back and forward buttons for this.

  // When navigating back to a pattern from the Mustache Browser, invoke patternlab.updatePatternInfo for its
  // special treatment of browser history in this instance.
  if (d.referrer.indexOf(window.location.protocol + '//' + window.location.host + '/mustache-browser') === 0) {
    obj = {
      event: 'patternlab.updatePatternInfo',
      path: parts[0],
      patternPartial: patternData.patternPartial
    };

    if (!d.getElementById('mustache-browser')) {
      obj.annotationsMustacheBrowser = false;
      obj.codeMustacheBrowser = false;
    }
  }

  // Else condition patternlab.pageLoad e2e tested by urlHandler listener tests.

  // Notify the UI what pattern this is so it updates itself appropriately.
  else {
    obj = {event: 'patternlab.pageLoad'};
    obj.patternPartial = patternData.patternPartial;

    if (patternData.lineage) {
      obj.lineage = patternData.lineage;
    }

    if (!d.getElementById('mustache-browser')) {
      obj.annotationsMustacheBrowser = false;
      obj.codeMustacheBrowser = false;
    }
  }

  parent.postMessage(obj, targetOrigin);
}

// BEGIN FUNCTION DECLARATIONS. */

function receiveIframeMessage(event) {
  // Return if the origin sending the message does not match the current host.
  if (
    window.location.protocol !== 'file:' &&
    event.origin !== window.location.protocol + '//' + window.location.host
  ) {
    return;
  }

  let data = {};

  try {
    data = (typeof event.data === 'string') ? JSON.parse(event.data) : event.data;
  }
  catch (err) {
    // Fail gracefully.
  }

  // Cannot e2e test patternlab.updatePath because WebdriverIO is unable to get the URL of the iframe.

  switch (data.event) {
    case 'patternlab.updatePath':
      window.location.replace('../../' + data.path);

      break;
  }
}

// END DECLARATIONS. BEGIN LISTENERS.

window.addEventListener('message', receiveIframeMessage);

// If there are clicks within the pattern, make sure the nav in the UI closes.
d.body.addEventListener('click', () => {
  parent.postMessage({event: 'patternlab.bodyClick'}, targetOrigin);
});

// Find all links and add a click handler for replacing the address so the history works.
const aTags = d.querySelectorAll('a');

for (let aTag of aTags) {
  aTag.addEventListener('click', function (e) {
    if (this.classList.contains('fp-express')) {
      return;
    }

    e.preventDefault();

    // Use .getAttribute() to get raw "#" value, and not the full URL from the .href property.
    const href = aTag.getAttribute('href');

    if (!href || href === '#') {
      return;
    }

    // Do not navigate outside this domain from within the iframe.
    if (aTag.hostname !== window.location.hostname) {
      return;
    }

    window.location.replace(href);
  });
}

const Mousetrap = window.Mousetrap;

// Bind Mousetrap keyboard shortcuts using ctrl+alt.
const keysAlt = [
  '0', // XXSmall.
  'g', // Grow.
  'l', // Large.
  'r', // Random.
  'w'  // Whole.
];

for (let key of keysAlt) {
  Mousetrap.bind('ctrl+alt+' + key, (e) => {
    const obj = {event: 'patternlab.keyPress', keyPress: 'ctrl+alt+' + key};
    parent.postMessage(obj, targetOrigin);

    e.preventDefault();
    return false;
  });
}

// Bind Mousetrap keyboard shortcuts using ctrl+shift.
const keysShift = [
  '0', // XXSmall.
  'd', // Disco.
  'l', // Large.
  'm', // Medium.
  's', // Small.
  'w', // Whole.
  'x'  // XSmall.
];

for (let key of keysShift) {
  Mousetrap.bind('ctrl+shift+' + key, (e) => {
    const obj = {event: 'patternlab.keyPress', keyPress: 'ctrl+shift+' + key};
    parent.postMessage(obj, targetOrigin);

    e.preventDefault();
    return false;
  });
}