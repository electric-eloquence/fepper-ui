/**
 * Annotations Support for the Viewer - v0.3
 *
 * Copyright (c) 2013 Brad Frost, http://bradfrostweb.com & Dave Olsen, http://dmolsen.com
 * Licensed under the MIT license
 *
 */
(function () {
  'use strict';

  let annotationsViewer;
  window.annotationsViewer = annotationsViewer = {

    // set-up default sections
    commentsActive: false,
    commentsViewAllActive: false,
    targetOrigin: (window.location.protocol === 'file:') ? '*' : window.location.protocol + '//' + window.location.host,
    moveToOnInit: 0,

    /**
    * add the onclick handler to the annotations link in the main nav
    */
    onReady: function () {

      // not sure this is used anymore...
      $('body').addClass('comments-ready');

      $(window).resize(function () {
        if (!annotationsViewer.commentsActive) {
          annotationsViewer.slideComment($('#sg-annotation-container').outerHeight());
        }
      });

      $('#sg-t-annotations').click(function (e) {
        e.preventDefault();

        // remove the class from the "eye" nav item
        $('#sg-t-toggle').removeClass('active');

        // turn the annotations section on and off
        annotationsViewer.toggleComments();
      });

      // initialize the annotations viewer
      annotationsViewer.commentContainerInit();

      // load the query strings in case code view has to show by default
      const queryStringVars = window.urlHandler.getRequestVars();
      if (queryStringVars.view && (queryStringVars.view === 'annotations' || queryStringVars.view === 'a')) {
        annotationsViewer.openComments();
        if (typeof queryStringVars.number !== 'undefined') {
          annotationsViewer.moveToOnInit = queryStringVars.number;
        }
      }
    },

    /**
    * decide on if the annotations panel should be open or closed
    */
    toggleComments: function () {
      if (!annotationsViewer.commentsActive) {
        annotationsViewer.openComments();
      }
      else {
        annotationsViewer.closeComments();
      }
    },

    /**
    * open the annotations panel
    */
    openComments: function () {
      const codeViewer = window.codeViewer;

      // make sure the code view overlay is off before showing the annotations view
      $('#sg-t-code').removeClass('active');
      codeViewer.codeActive = false;
      const codeToggle = JSON.stringify({codeToggle: 'off'});
      document.getElementById('sg-viewport').contentWindow.postMessage(codeToggle, annotationsViewer.targetOrigin);
      codeViewer.slideCode(999);

      // tell the iframe annotation view has been turned on
      const commentToggle = JSON.stringify({commentToggle: 'on'});
      document.getElementById('sg-viewport').contentWindow.postMessage(commentToggle, annotationsViewer.targetOrigin);

      // note that it's turned on in the viewer
      annotationsViewer.commentsActive = true;
      $('#sg-t-annotations').addClass('active');
    },

    /**
    * close the annotations panel
    */
    closeComments: function () {
      annotationsViewer.commentsActive = false;
      const commentToggle = JSON.stringify({commentToggle: 'off'});
      document.getElementById('sg-viewport').contentWindow.postMessage(commentToggle, annotationsViewer.targetOrigin);
      annotationsViewer.slideComment($('#sg-annotation-container').outerHeight());
      $('#sg-vp-wrap').css('padding-bottom', '0');
      $('#sg-t-annotations').removeClass('active');
    },

    /**
    * add the basic mark-up and events for the annotations container
    */
    commentContainerInit: function () {
      $('#sg-annotation-container') // has class sg-view-container
        .css('bottom', -$(document).outerHeight())
        .addClass('anim-ready');

      // make sure the close button handles the click
      $('body').delegate('#sg-annotation-close-btn', 'click', function () {
        annotationsViewer.commentsActive = false;
        $('#sg-t-annotations').removeClass('active');
        annotationsViewer.slideComment($('#sg-annotation-container').outerHeight());
        $('#sg-vp-wrap').css('padding-bottom', '0');
        const commentToggle = JSON.stringify({commentToggle: 'off'});
        document.getElementById('sg-viewport').contentWindow.postMessage(commentToggle, annotationsViewer.targetOrigin);
        return false;
      });
    },

    /**
    * slides the panel
    * @param {number} pos - annotation container position from bottom
    */
    slideComment: function (pos) {
      $('#sg-annotation-container').css('bottom', -pos);
    },

    /**
    * moves to a particular item in the viewer
    * @param {number} number - annotation element identifier
    */
    moveTo: function (number) {
      const annotationEl = document.getElementById('annotation-' + number);
      if (annotationEl) {
        const top = annotationEl.offsetTop;
        $('#sg-annotation-container').animate({scrollTop: top - 10}, 600);
      }
    },

    /**
    * when turning on or switching between patterns with annotations view on make sure we get
    * the annotations from from the pattern via post message
    * @param {object} comments - comments object
    */
    updateComments: function (comments) {
      const commentsContainer = document.getElementById('sg-comments-container');

      // clear out the comments container
      if (commentsContainer.innerHTML !== '') {
        commentsContainer.innerHTML = '';
      }

      // see how many comments this pattern might have. if more than zero write them out. if not alert the user to the
      // fact there aren't any
      const count = Object.keys(comments).length;
      if (count > 0) {

        for (let i = 1; i <= count; i++) {

          const displayNum = comments[i].number;

          const span = document.createElement('span');
          span.id = 'annotation-state-' + displayNum;
          span.style.fontSize = '0.8em';
          span.style.color = '#666';
          if (comments[i].state === false) {
            span.innerHTML = ' hidden';
          }

          const h2 = document.createElement('h2');
          h2.innerHTML = displayNum + '. ' + comments[i].title;
          h2.appendChild(span);

          const div = document.createElement('div');
          div.innerHTML = comments[i].comment;

          const commentDiv = document.createElement('div');
          commentDiv.classList.add('sg-comment-container');
          commentDiv.id = 'annotation-' + displayNum;
          commentDiv.appendChild(h2);
          commentDiv.appendChild(div);

          commentsContainer.appendChild(commentDiv);
        }
      }
      else {

        const h2 = document.createElement('h2');
        h2.innerHTML = 'No Annotations';

        const div = document.createElement('div');
        div.innerHTML = 'There are no annotations for this pattern.';

        const commentDiv = document.createElement('div');
        commentDiv.classList.add('sg-comment-container');
        commentDiv.appendChild(h2);
        commentDiv.appendChild(div);

        commentsContainer.appendChild(commentDiv);
      }

      // slide the comment section into view
      annotationsViewer.slideComment(0);

      // add padding to bottom of viewport wrapper so pattern foot can be viewed
      // delay it so it gets added after animation completes
      window.setTimeout(function () {
        $('#sg-vp-wrap').css('padding-bottom', $('#sg-annotation-container').outerHeight() + 'px');
      }, 300);

      if (annotationsViewer.moveToOnInit !== '0') {
        annotationsViewer.moveTo(annotationsViewer.moveToOnInit);
        annotationsViewer.moveToOnInit = '0';
      }
    },

    /**
    * toggle the comment pop-up based on a user clicking on the pattern
    * based on the great MDN docs at https://developer.mozilla.org/en-US/docs/Web/API/window.postMessage
    * @param {object} event - event info
    */
    receiveIframeMessage: function (event) {
      const data = (typeof event.data !== 'string') ? event.data : JSON.parse(event.data);

      // does the origin sending the message match the current host? if not dev/null the request
      if (
        window.location.protocol !== 'file:' &&
        event.origin !== window.location.protocol + '//' + window.location.host
      ) {
        return;
      }

      if (data.commentOverlay) {
        if (data.commentOverlay === 'on') {
          annotationsViewer.updateComments(data.comments);
        }
        else {
          annotationsViewer.slideComment($('#sg-annotation-container').outerHeight());
        }
      }
      else if (data.annotationState) {
        const annotationStateId = 'annotation-state-' + data.displayNumber;
        document.getElementById(annotationStateId).innerHTML = data.annotationState ? '' : ' hidden';
      }
      else if (typeof data.displaynumber !== 'undefined') {
        annotationsViewer.moveTo(data.displaynumber);
      }
      else if (data.keyPress) {
        if (data.keyPress === 'ctrl+shift+a') {
          annotationsViewer.toggleComments();
          return;
        }
        else if (data.keyPress === 'esc') {
          if (annotationsViewer.commentsActive) {
            annotationsViewer.closeComments();
            return;
          }
        }
      }
      else if (data.patternpartial) {
        if (annotationsViewer.commentsViewAllActive && data.patternpartial.indexOf('viewall-') !== -1) {
          const commentToggle = JSON.stringify({commentToggle: 'on'});
          const sgViewport = document.getElementById('sg-viewport');
          sgViewport.contentWindow.postMessage(commentToggle, annotationsViewer.targetOrigin);
        }
      }
    }
  };

  $(document).ready(function () {annotationsViewer.onReady();});
  window.addEventListener('message', annotationsViewer.receiveIframeMessage, false);

  // make sure if a new pattern or view-all is loaded that comments are turned on as appropriate
  $('#sg-viewport').on('load', function () {
    if (annotationsViewer.commentsActive) {
      const commentToggle = JSON.stringify({commentToggle: 'on'});
      document.getElementById('sg-viewport').contentWindow.postMessage(commentToggle, annotationsViewer.targetOrigin);
    }
  });

  // no idea why this has to be outside. there's something funky going on with the JS pattern
  $('#sg-view li a').click(function () {
    $(this).parent().parent().removeClass('active');
    $(this).parent().parent().parent().parent().removeClass('active');
  });

  // toggle the annotations panel
  jwerty.key('ctrl+shift+a', function () {
    annotationsViewer.toggleComments();
    return false;
  });

  // close the annotations panel if using escape
  jwerty.key('esc', function () {
    if (annotationsViewer.commentsActive) {
      annotationsViewer.closeComments();
      return false;
    }
  });
})();
