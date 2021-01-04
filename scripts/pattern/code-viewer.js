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

  let codeActive = false;

  function scrollViewall() {
    const focusedEl = d.querySelector('.sg-pattern-toggle-code.focused');

    if (focusedEl) {
      focusedEl.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
    }
    else {
      if (!sgPatternFirst) {
        parent.postMessage({annotationsViewall: false, codeViewall: false, targetOrigin});

        return;
      }

      sgPatternFirst.querySelector('.sg-pattern-toggle-code').classList.add('focused');
      window.scrollTo({top: 0, behavior: 'smooth'});
    }
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

    if (data.codeToggle) {

      // Get and post data for selected pattern.
      if (data.codeToggle === 'on') {
        codeActive = true;

        const sgPatterns = d.querySelectorAll('.sg-pattern');
        let obj;

        // Viewall.
        if (viewall) {
          let patternData;

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

          if (patternData) {
            obj = {
              codeOverlay: 'on',
              lineage: patternData.lineage,
              lineageR: patternData.lineageR,
              patternPartial: patternData.patternPartial,
              patternState: patternData.patternState,
              viewall: true
            };
          }
        }

        // Pattern.
        else {
          const patternDataEl = d.querySelector('.sg-pattern-data');
          let patternData = {};

          if (patternDataEl) {
            try {
              patternData = JSON.parse(patternDataEl.innerHTML);
            }
            catch (err) {
              // Fail gracefully.
            }
          }

          obj = {
            codeOverlay: 'on',
            lineage: patternData.lineage,
            lineageR: patternData.lineageR,
            patternPartial: patternData.patternPartial,
            patternState: patternData.patternState
          };
        }

        if (obj) {
          parent.postMessage(obj, targetOrigin);
        }
      }

      // data.codeToggle off.
      else {
        codeActive = false;

        sgPatternToggleCode.forEach((el) => {
          el.classList.remove('active');
        });
      }
    }
    else if (data.codeScrollViewall) {
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

        const obj = {
          codeOverlay: 'on',
          lineage: patternData.lineage,
          lineageR: patternData.lineageR,
          openCode: true,
          patternPartial: patternData.patternPartial,
          patternState: patternData.patternState,
          viewall: true
        };

        parent.postMessage(obj, targetOrigin);

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
      const obj = {event: 'patternlab.keyPress', keyPress: 'ctrl+' + key};
      parent.postMessage(obj, targetOrigin);

      e.preventDefault();
      return false;
    });
  }

  // When the code panel is open, hijack cmd+a/ctrl+a so that it only selects the code view.
  Mousetrap.bind('mod+a', (e) => {
    if (codeActive) {
      const obj = {event: 'patternlab.keyPress', keyPress: 'mod+a'};

      parent.postMessage(obj, targetOrigin);

      e.preventDefault();
      return false;
    }
  });
})(document);
