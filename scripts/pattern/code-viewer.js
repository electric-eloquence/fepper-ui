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
        parent.postMessage({codeViewallClick: 'off'}, targetOrigin);
      }
      else {
        sgPatternToggleAnnotations.forEach((el1) => {
          el1.classList.remove('active');
        });
        sgPatternToggleCode.forEach((el1) => {
          el1.classList.remove('active');
        });

        this.classList.add('active');

        const patternPartial = this.dataset.patternPartial;
        const patternDataEl = d.getElementById(`sg-pattern-data-${patternPartial}`);
        let patternData = {};

        try {
          patternData = JSON.parse(patternDataEl.innerHTML);
        }
        catch (err) {
          // Fail gracefully.
        }

        patternData.codeViewallClick = 'on';

        parent.postMessage(patternData, targetOrigin);
      }
    });
  });

  // Bind Mousetrap keyboard shortcuts for the Code Viewer.
  const keys = [
    'shift+[', // Focus on the tab to the left (or cycle to to the end).
    'shift+]', // Focus on the tab to the right (or cycle to the beginning).
    'alt+h', // Dock Code Viewer to the left.
    'alt+j', // Dock Code Viewer to the bottom.
    'alt+l' // Dock Code Viewer to the right.
  ];

  for (const key of keys) {
    window.Mousetrap.bind('ctrl+' + key, (e) => {
      const messageObj = {event: 'patternlab.keyPress', keyPress: 'ctrl+' + key};
      parent.postMessage(messageObj, targetOrigin);

      e.preventDefault();
      return false;
    });
  }

  /* END LISTENERS. EXECUTE THE FOLLOWING ONLOAD. */
  /* INFORM THE PARENT OF THE PATTERN/VIEWALL INFO. */

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

    patternData.viewall = false;
  }

  parent.postMessage(patternData, targetOrigin);
})(document);
