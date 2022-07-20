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
  const viewall = Boolean(sgPatternToggleAnnotations.length);

  let annotations = [];
  let annotationsActive = false;
  let bodyWidth = d.body.clientWidth;
  let viewallFocus = '';

  function activateAnnotationTips() {
    let count = 0;
    let context;

    if (viewall && viewallFocus) {
      context = d.getElementById(viewallFocus);
    }
    else {
      context = d;
    }

    if (!context) {
      return;
    }

    for (const annotation of window.annotations) {
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

                    // .annotationNumber invokes annotationsViewer.moveTo().
                    parent.postMessage({annotationNumber: annotation_.displayNumber}, targetOrigin);
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
      if (!sgPatternFirst) {
        return;
      }

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

        for (const annotation of window.annotations) {
          let els;
          let state = false;

          // Viewall.
          if (viewall) {
            for (const el of sgPatternToggleAnnotations) {
              if (el.classList.contains('focused')) {
                patternPartial = el.dataset.patternPartial || '';

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

            if (!els && sgPatternFirst) {
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

            for (const el of els) {
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

        const messageObj = {
          annotationsUpdate: true,
          annotations,
          patternPartial
        };

        parent.postMessage(messageObj, targetOrigin);
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

  /* END DECLARATIONS. BEGIN LISTENERS. */

  window.addEventListener('message', receiveIframeMessage);

  let debounceTimeout = null;

  window.addEventListener('resize', () => {
    // Debounce.
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(
      () => {
        // Do not fire if the Annotations Viewer is closed.
        if (!annotationsActive) {
          return;
        }

        // Do not fire if body height has changed, but body width has not.
        if (bodyWidth === d.body.clientWidth) {
          return;
        }

        bodyWidth = d.body.clientWidth;

        for (const annotation of annotations) {
          let els;

          if (viewall) {
            const sgPattern = d.getElementById(viewallFocus);
            els = sgPattern ? sgPattern.querySelectorAll(annotation.el) : [];
          }

          // Pattern.
          else {
            els = d.querySelectorAll(annotation.el);
          }

          // The main reason for invoking this function on resize - to indicate whether annotated elements are hidden
          // or not. Start with state = false. If any annotated element is visible, then state = true.
          annotation.state = false;

          if (els.length) {
            for (const el of els) {
              if (window.getComputedStyle(el, null).getPropertyValue('max-height') !== '0px') {
                annotation.state = true;
              }
            }
          }
        }
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
        parent.postMessage({annotationsViewallClick: 'off'}, targetOrigin);
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
        parent.postMessage({annotationsViewallClick: 'on'}, targetOrigin);
      }
    });
  });

  // Toggle the annotations panel with keyboard shortcut.
  window.Mousetrap.bind('ctrl+shift+a', (e) => {
    const messageObj = {event: 'patternlab.keyPress', keyPress: 'ctrl+shift+a'};

    parent.postMessage(messageObj, targetOrigin);

    e.preventDefault();
    return false;
  });
})(document);
