/**
 * Copyright (c) 2013-2014 Dave Olsen, http://dmolsen.com
 * Licensed under the MIT license.
 */
const d = document;
const sgPatternFirst = d.querySelector('.sg-pattern');
const sgPatternToggleAnnotations = d.querySelectorAll('.sg-pattern-toggle-annotations');
const sgPatternToggleCode = d.querySelectorAll('.sg-pattern-toggle-code');
const targetOrigin =
  (window.location.protocol === 'file:') ? '*' : window.location.protocol + '//' + window.location.host;
const viewall = Boolean(sgPatternToggleAnnotations.length);

// Before declaring and running anything else, postMessage to the UI.
if (viewall) {
  parent.postMessage({annotationsViewall: viewall}, targetOrigin);
}

let annotations = [];
let annotationsActive = false;
let bodyWidth = d.body.clientWidth;
let viewallFocus = '';

// BEGIN FUNCTION DECLARATIONS. */

function activateAnnotationTips() {
  let count = 0;
  let context;

  if (viewall) {
    context = d.getElementById(viewallFocus);
  }
  else {
    context = d;
  }

  if (!context) {
    return;
  }

  for (let annotation of window.annotations) {
    const els = context.querySelectorAll(annotation.el);

    if (els.length) {
      count++;
      annotation.displayNumber = count;

      // eslint-disable-next-line no-loop-func
      els.forEach((el) => {
        el.querySelectorAll('.annotation-tip').forEach((tip) => {
          tip.addEventListener(
            'click',
            ((annotation_) => {
              return (e) => {
                if (annotationsActive) {
                  e.preventDefault();
                  e.stopPropagation();

                  // If an element was clicked while the overlay was already on, swap it.
                  const obj = {annotationNumber: annotation_.displayNumber};

                  parent.postMessage(obj, targetOrigin);
                }
              };
            })(annotation)
          );
        });
      });
    }
  }
}

function hideAnnotationTips() {
  const elsToHideFlag = d.querySelectorAll('.has-annotation');

  elsToHideFlag.forEach((el) => {
    el.classList.remove('has-annotation');
  });

  const elsToHideTip = d.querySelectorAll('.annotation-tip');

  elsToHideTip.forEach((el) => {
    el.style.display = 'none';
  });
}

function scrollViewall() {
  const focusedEl = d.querySelector('.sg-pattern-toggle-annotations.focused');

  if (focusedEl) {
    focusedEl.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'});
  }
  else {
    sgPatternFirst.querySelector('.sg-pattern-toggle-annotations').classList.add('focused');
    window.scrollTo({top: 0, behavior: 'smooth'});
  }
}

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

  if (data.annotationsToggle) {
    if (data.annotationsToggle === 'on') {
      annotations = [];
      annotationsActive = true;

      let count = 0;
      let patternPartial = '';

      for (let annotation of window.annotations) {
        let els;
        let state = false;

        // Viewall.
        if (viewall) {
          for (let el of sgPatternToggleAnnotations) {
            if (el.classList.contains('focused')) {
              patternPartial = el.dataset.patternpartial || '';

              if (!patternPartial) {
                break;
              }

              viewallFocus = patternPartial;
              const sgPattern = d.getElementById(patternPartial);

              if (!sgPattern) {
                break;
              }

              els = sgPattern.querySelectorAll(annotation.el);

              break;
            }
          }

          if (!els) {
            els = sgPatternFirst.querySelectorAll(annotation.el);
          }
        }

        // Pattern.
        else {
          const patternDataEl = d.getElementById('sg-pattern-data-footer');
          let patternData = {};

          try {
            patternData = JSON.parse(patternDataEl.innerHTML);
          }
          catch (err) {
            // Fail gracefully.
          }

          els = d.querySelectorAll(annotation.el);
          patternPartial = patternData.patternPartial || '';
        }

        // Loop through all elements with annotations within the query scope.
        if (els.length) {
          count++;

          for (let el of els) {
            // Display tips within the scoped element.
            const annotationTip = el.querySelector('.annotation-tip');

            if (annotationTip) {
              annotationTip.style.display = 'inline';
            }
            else {
              const span = d.createElement('span');
              span.innerHTML = count;

              span.classList.add('annotation-tip');

              if (window.getComputedStyle(el, null).getPropertyValue('max-height') === '0px') {
                span.style.display = 'none';
                state = false;
              }

              el.classList.add('has-annotation');
              el.insertBefore(span, el.firstChild);
            }

            // If any annotated element is visible, set state = true.
            if (getComputedStyle(el).getPropertyValue('max-height') !== '0px') {
              state = true;
            }
          }

          annotations.push({
            el: annotation.el,
            title: annotation.title,
            annotation: annotation.annotation,
            number: count,
            state: state
          });
        }
      }

      activateAnnotationTips();

      const obj = {
        annotationsOverlay: 'on',
        annotations: annotations,
        patternPartial,
        viewall
      };

      parent.postMessage(obj, targetOrigin);
    }

    // data.annotationsToggle off.
    else {
      annotationsActive = false;
      hideAnnotationTips();
    }
  }
  else if (data.annotationsScrollViewall) {
    scrollViewall();
  }
}

// END DECLARATIONS. BEGIN LISTENERS.

window.addEventListener('message', receiveIframeMessage);

let debounceTimeout = null;

window.addEventListener('resize', () => {
  // Debounce.
  clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(
    () => {
      // Do not fire if the annotations viewer is closed.
      if (!annotationsActive) {
        return;
      }

      // Do not fire if body height has changed, but body width has not.
      if (bodyWidth === d.body.clientWidth) {
        return;
      }

      bodyWidth = d.body.clientWidth;

      for (let annotation of annotations) {
        let els;

        if (viewall) {
          const sgPattern = d.getElementById(viewallFocus);
          els = sgPattern.querySelectorAll(annotation.el);
        }

        // Pattern.
        else {
          els = d.querySelectorAll(annotation.el);
        }

        // The main reason for invoking this function on resize - to indicate whether annotated elements are hidden
        // or not. Start with state = false. If any annotated element is visible, then state = true.
        annotation.state = false;

        if (els.length) {
          for (let el of els) {
            if (window.getComputedStyle(el, null).getPropertyValue('max-height') !== '0px') {
              annotation.state = true;
            }
          }
        }
      }

      const obj = {
        annotationsOverlay: 'on',
        annotations: annotations,
        viewall
      };

      parent.postMessage(obj, targetOrigin);
    },
    200
  );
});

// Add click listeners to toggles on viewall.
sgPatternToggleAnnotations.forEach((el) => {
  el.addEventListener('click', function (e) {
    e.preventDefault();

    sgPatternToggleAnnotations.forEach((el1) => {
      el1.classList.remove('focused');
    });

    this.classList.add('focused');

    if (this.classList.contains('active')) {
      this.classList.remove('active');
      hideAnnotationTips();
      parent.postMessage({annotationsOverlay: 'off'}, targetOrigin);
    }
    else {
      sgPatternToggleAnnotations.forEach((el1) => {
        el1.classList.remove('active');
      });
      sgPatternToggleCode.forEach((el1) => {
        el1.classList.remove('active');
      });

      this.classList.add('active');
      hideAnnotationTips();
      parent.postMessage({annotationsViewallClick: true}, targetOrigin);
      scrollViewall();
    }
  });
});

const Mousetrap = window.Mousetrap;

// Toggle the annotations panel with keyboard shortcut.
Mousetrap.bind('ctrl+shift+a', (e) => {
  const obj = {event: 'patternlab.keyPress', keyPress: 'ctrl+shift+a'};

  parent.postMessage(obj, targetOrigin);

  e.preventDefault();
  return false;
});