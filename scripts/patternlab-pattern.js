((d, uiProps, uiFns) => {
  'use strict';

  /**
   * This gets attached as an event listener, so do not use arrow function notation.
   *
   * @param {object} event - Event object.
   */
  function receiveIframeMessage(event) {
    const data = uiFns.receiveIframeMessageBoilerplate(event);

    if (!data) {
      return;
    }

    switch (data.event) {
      case 'patternlab.updatePath': {
        window.location.replace('../../' + data.path + '?' + Date.now());
      }
    }
  }

  window.addEventListener('message', receiveIframeMessage, false);

  /**
   * Handle the onpopstate event.
   *
   * @param {object} event - Event object.
   */
  window.onpopstate = function (event) {
    uiFns.urlHandler.skipBack = true;
    uiFns.urlHandler.popPattern(event);
  };

  // If there are clicks within the iframe, make sure the nav in the iframe parent closes.
  d.body.addEventListener(
    'click',
    function () {
      parent.postMessage({event: 'patternlab.bodyClick'}, uiProps.targetOrigin);
    },
    false
  );

  // Find all links and add an click handler for replacing the iframe address so the history works.
  const aTags = d.getElementsByTagName('a');

  for (let i = 0; i < aTags.length; i++) {
    aTags[i].addEventListener(
      'click',
      function (e) {
        const href = this.getAttribute('href');
        const target = this.getAttribute('target');

        if (target !== '_parent' && target !== '_blank') {
          if (href && href !== '#') {
            if (!this.classList.contains('fp-express')) {
              e.preventDefault();
              window.location.replace(href);
            }
          }
          else {
            e.preventDefault();
          }
        }
      },
      false
    );
  }

  // Mousetrap keyboard shortcuts.
  const Mousetrap = window.Mousetrap;

  // Bind the keyboard shortcuts using ctrl+alt.
  const keysAlt = ['0', 'g', 'h', 'l', 'm', 'r', 'w'];

  for (let i = 0; i < keysAlt.length; i++) {
    Mousetrap.bind(
      'ctrl+alt+' + keysAlt[i],
      ((key) => {
        return function (e) {
          e.preventDefault();

          const obj = {event: 'patternlab.keyPress', keyPress: 'ctrl+alt+' + key};
          parent.postMessage(obj, uiProps.targetOrigin);

          return false;
        };
      })(keysAlt[i])
    );
  }

  // Bind the keyboard shortcuts using ctrl+shift.
  const keysShift = ['0', 'a', 'c', 'd', 'f', 'l', 'm', 's', 'u', 'w', 'x', 'y'];

  for (let i = 0; i < keysShift.length; i++) {
    Mousetrap.bind(
      'ctrl+shift+' + keysShift[i],
      ((key) => {
        return function (e) {
          e.preventDefault();

          const obj = {event: 'patternlab.keyPress', keyPress: 'ctrl+shift+' + key};
          parent.postMessage(obj, uiProps.targetOrigin);

          return false;
        };
      })(keysShift[i])
    );
  }

  Mousetrap.bind('esc', function () {
    const obj = {event: 'patternlab.keyPress', keyPress: 'esc'};
    parent.postMessage(obj, uiProps.targetOrigin);
  });

  d.addEventListener(
    'DOMContentLoaded',
    function () {
      const patternDataEl = d.getElementById('sg-pattern-data-footer');
      let patternData;

      try {
        patternData = JSON.parse(patternDataEl.innerHTML);
      }
      catch (err) {
        // Fail gracefully.
      }

      // Some pages, like Mustache Browser pages, don't want to postMessage the patternlab.pageLoad event.
      // Just return.
      if (!patternData) {
        return;
      }

      // Notify the iframe parent what pattern this is so it updates itself appropriately.
      const path = window.location.toString();
      const parts = path.split('?');
      const options = {event: 'patternlab.pageLoad', path: parts[0]};
      options.patternPartial = patternData.patternPartial || 'viewall';

      if (patternData.lineage) {
        options.lineage = patternData.lineage;
      }

      parent.postMessage(options, uiProps.targetOrigin);
    },
    false
  );
})(document, window.FEPPER_UI.uiProps, window.FEPPER_UI.uiFns);
