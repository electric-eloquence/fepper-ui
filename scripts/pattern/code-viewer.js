/**
 * Copyright (c) 2013-2014 Dave Olsen, http://dmolsen.com
 * Licensed under the MIT license.
 */
((d) => {
  // Only run when loaded from within the iframe.
  if (parent === window) {
    return;
  }

  const sgPatternFirst = d.querySelector('.sg-pattern');
  const sgPatternToggleAnnotations = d.querySelectorAll('.sg-pattern-toggle-annotations');
  const sgPatternToggleCode = d.querySelectorAll('.sg-pattern-toggle-code');
  const targetOrigin =
    (window.location.protocol === 'file:') ? '*' : window.location.protocol + '//' + window.location.host;
  const viewall = Boolean(sgPatternToggleCode.length);

  // Before declaring and running anything else, postMessage to the UI.
  if (viewall) {
    parent.postMessage({codeViewall: viewall}, targetOrigin);
  }

  function scrollViewall() {
    let focusedEl = d.querySelector('.sg-pattern-toggle-code.focused');

    if (!focusedEl) {
      focusedEl = sgPatternFirst.querySelector('.sg-pattern-toggle-code');
      focusedEl.classList.add('focused');
    }

    focusedEl.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
  }

  function receiveIframeMessage(event) {
    // Does the origin sending the message match the current host? If not, dev/null the request.
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

    if (data.codeScrollViewall) {
      scrollViewall();
    }
  }

  /* END DECLARATIONS. BEGIN LISTENERS. */

  window.addEventListener('message', receiveIframeMessage);

  sgPatternToggleCode.forEach((el) => {
    el.addEventListener('click', function (e) {
      e.preventDefault();

      sgPatternToggleCode.forEach((el1) => {
        el1.classList.remove('focused');
      });

      this.classList.add('focused');

      if (this.classList.contains('active')) {
        this.classList.remove('active');
        parent.postMessage({codeOverlay: 'off'}, targetOrigin);
      }
      else {
        sgPatternToggleAnnotations.forEach((el1) => {
          el1.classList.remove('active');
        });
        sgPatternToggleCode.forEach((el1) => {
          el1.classList.remove('active');
        });

        this.classList.add('active');

        const patternPartial = this.dataset.patternpartial;
        const patternDataEl = d.getElementById(`sg-pattern-data-${patternPartial}`);
        let patternData = {};

        try {
          patternData = JSON.parse(patternDataEl.innerHTML);
        }
        catch (err) {
          // Fail gracefully.
        }

        patternData.codeOverlay = 'on';
        patternData.viewall = true;

        parent.postMessage(patternData, targetOrigin);

        scrollViewall();
      }
    });
  });

  if (!window.Mousetrap) {
    return;
  }

  const Mousetrap = window.Mousetrap;

  // Bind Mousetrap keyboard shortcuts using ctrl+shift.
  const keys = [
    'shift+c', // Toggle the code panel.
    'shift+u', // Select the mustache tab.
    'alt+m', // Select the mustache tab.
    'shift+y', // Select the html tab.
    'alt+h' // Select the html tab.
  ];

  for (const key of keys) {
    Mousetrap.bind('ctrl+' + key, (e) => {
      const messageObj = {event: 'patternlab.keyPress', keyPress: 'ctrl+' + key};
      parent.postMessage(messageObj, targetOrigin);

      e.preventDefault();
      return false;
    });
  }

  /* END LISTENERS. EXECUTE THE FOLLOWING ONLOAD */
  /* INFORM THE PARENT OF THE VIEWALL/PATTERN INFO. */

  const sgPatterns = d.querySelectorAll('.sg-pattern');
  let patternData;

  // Viewall.
  if (viewall) {
    sgPatterns.forEach((el) => {
      const sgPatternToggle = el.querySelector('.sg-pattern-toggle-code');

      if (!sgPatternToggle || !sgPatternToggle.classList.contains('focused')) {
        return;
      }

      const patternDataEl = el.querySelector('.sg-pattern-data');

      if (patternDataEl) {
        try {
          patternData = JSON.parse(patternDataEl.innerHTML);
        }
        catch (err) {
          // Fail gracefully.
        }
      }
    });

    // If none of the toggles are focused, get the data from the first one.
    if (!patternData && sgPatterns[0]) {
      const patternDataEl = sgPatterns[0].querySelector('.sg-pattern-data');

      if (patternDataEl) {
        try {
          patternData = JSON.parse(patternDataEl.innerHTML);
        }
        catch (err) {
          // Fail gracefully.
        }
      }
    }

    if (!patternData) {
      patternData = {};
    }

    patternData.viewall = true;
  }

  // Pattern.
  else {
    const patternDataEl = d.querySelector('.sg-pattern-data');

    if (patternDataEl) {
      try {
        patternData = JSON.parse(patternDataEl.innerHTML);
      }
      catch (err) {
        // Fail gracefully.
      }
    }

    if (!patternData) {
      patternData = {};
    }
  }

  parent.postMessage(patternData, targetOrigin);
})(document);
