/**
 * Copyright (c) 2013-2016 Dave Olsen, http://dmolsen.com
 * Licensed under the MIT license.
 */
((d) => {
  // Only run when loaded from within the iframe.
  if (parent === window) {
    return;
  }

  const targetOrigin =
    (window.location.protocol === 'file:') ? '*' : window.location.protocol + '//' + window.location.host;

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

  /* END DECLARATIONS. BEGIN LISTENERS. */

  window.addEventListener('message', receiveIframeMessage);

  // If there are clicks within the pattern, make sure the nav in the UI closes.
  d.body.addEventListener('click', () => {
    parent.postMessage({event: 'patternlab.bodyClick'}, targetOrigin);
  });

  // Find all links and add a click handler for replacing the address so the history works.
  const aTags = d.querySelectorAll('a');

  for (const aTag of aTags) {
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

  // Bind Mousetrap keyboard shortcuts using ctrl+alt.
  const keysAlt = [
    '0', // XXSmall.
    'g', // Grow.
    'l', // Large.
    'r', // Random.
    'w'  // Whole.
  ];

  for (const key of keysAlt) {
    window.Mousetrap.bind('ctrl+alt+' + key, (e) => {
      const messageObj = {event: 'patternlab.keyPress', keyPress: 'ctrl+alt+' + key};
      parent.postMessage(messageObj, targetOrigin);

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

  for (const key of keysShift) {
    window.Mousetrap.bind('ctrl+shift+' + key, (e) => {
      const messageObj = {event: 'patternlab.keyPress', keyPress: 'ctrl+shift+' + key};
      parent.postMessage(messageObj, targetOrigin);

      e.preventDefault();
      return false;
    });
  }

  /* END LISTENERS. EXECUTE THE FOLLOWING ONLOAD. */
  /* INFORM THE PARENT OF THE VIEWALL/PATTERN INFO. */

  const patternDataEl = d.getElementById('sg-pattern-data-footer');
  let patternData;

  try {
    patternData = JSON.parse(patternDataEl.innerHTML);
  }
  catch (err) {
    // Fail gracefully.
  }

  if (patternData) {
    // Notify the UI what pattern this is so it updates its history appropriately.
    const messageObj = {event: 'patternlab.pageLoad', patternPartial: patternData.patternPartial};

    parent.postMessage(messageObj, targetOrigin);
  }
})(document);
