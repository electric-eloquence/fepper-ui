((d, uiProps, uiFns) => {
  'use strict';

  if (self !== top || typeof $ !== 'function') {
    return;
  }

  const Mousetrap = window.Mousetrap;
  const patternPaths = window.patternPaths;
  let $sgFToggle;
  let $sgFind;
  let $sgFindTypeahead;

  function closeFinder() {
    $sgFToggle.removeClass('active');
    $sgFind.removeClass('active');
    $sgFind.removeClass('show-overflow');
  }

  class PatternFinder {
    constructor() {
      this.data = [];

      for (let patternType in patternPaths) {
        if (!patternPaths.hasOwnProperty(patternType)) {
          continue;
        }

        for (let pattern in patternPaths[patternType]) {
          if (!patternPaths[patternType].hasOwnProperty(pattern)) {
            continue;
          }

          const obj = {};
          obj.patternPartial = patternType + '-' + pattern;
          obj.patternPath = patternPaths[patternType][pattern];

          this.data.push(obj);
        }
      }

      // Instantiate the bloodhound suggestion engine.
      const Bloodhound = window.Bloodhound;
      this.patterns = new Bloodhound({
        datumTokenizer: function (data) {
          return Bloodhound.tokenizers.nonword(data.patternPartial);
        },
        queryTokenizer: Bloodhound.tokenizers.nonword,
        limit: 10,
        local: this.data
      });

      // Initialize the bloodhound suggestion engine.
      this.patterns.initialize();
    }

    closeFinder() {
      closeFinder();
      $sgFindTypeahead.blur();
    }

    // Need to pass PatternFinder instance because "this" gets overridden.
    onAutocompleted(e, item, patternFinder) {
      patternFinder.passPath(item);
    }

    // Need to pass PatternFinder instance because "this" gets overridden.
    onSelected(e, item, patternFinder) {
      patternFinder.passPath(item);
    }

    passPath(item) {
      const obj = {
        event: 'patternLab.updatePath',
        path: uiFns.urlHandler.getFilename(item.patternPartial)
      };

      // Update the iframe via the history api handler.
      this.closeFinder();
      uiProps.sgViewport.contentWindow.postMessage(obj, uiProps.targetOrigin);
    }

    toggleFinder() {
      $sgFToggle.toggleClass('active');
      $sgFind.toggleClass('active');
      $sgFind.toggleClass('show-overflow');

      if ($sgFToggle.hasClass('active')) {
        window.FEPPER_UI.uiFns.setAccordionHeight();
        $sgFindTypeahead.focus();
      }
    }
  }

  // Watch the iframe source so that it can be sent back to everyone else.
  function receiveIframeMessage(event) {
    const data = uiFns.receiveIframeMessageBoilerplate(event);

    if (!data) {
      return;
    }

    switch (data.event) {
      case 'patternLab.keyPress':
        switch (data.keyPress) {
          case 'ctrl+shift+f':
            window.patternFinder.toggleFinder();

            break;

          case 'esc':
            window.patternFinder.closeFinder();

            break;
        }

        break;
    }
  }

  window.addEventListener('message', receiveIframeMessage, false);

  $(d).ready(function () {
    const patternFinder = window.patternFinder = new PatternFinder();

    $sgFToggle = $('#sg-f-toggle');
    $sgFind = $('#sg-find');
    $sgFindTypeahead = $sgFind.find('#typeahead');

    $sgFToggle.click(function (e) {
      e.preventDefault();

      const $this = $(this);
      const $panel = $this.next('.sg-acc-panel');
      const subnav = $this.parent().parent().hasClass('sg-acc-panel');

      // Close other panels if link isn't a subnavigation item.
      if (!subnav) {
        $('.sg-acc-handle').not($this).removeClass('active');
        $('.sg-acc-panel').not($panel).removeClass('active');
      }

      patternFinder.toggleFinder();

      return false;
    });

    $sgFToggle.mouseenter(function () {
      $sgFToggle.addClass('mouseentered');
    });

    $sgFToggle.mouseleave(function () {
      $sgFToggle.removeClass('mouseentered');
    });

    $sgFindTypeahead.typeahead(
      {highlight: true},
      {displayKey: 'patternPartial', source: patternFinder.patterns.ttAdapter()}
    ).on(
      'typeahead:selected',
      ((patternFinder_) => {
        return function (e, item) {
          patternFinder_.onSelected(e, item, patternFinder_);
        };
      })(patternFinder)
    ).on(
      'typeahead:autocompleted',
      ((patternFinder_) => {
        return function (e, item) {
          patternFinder_.onAutocompleted(e, item, patternFinder_);
        };
      })(patternFinder)
    );

    $sgFindTypeahead.blur(function () {
      if (!$sgFToggle.hasClass('mouseentered')) {
        closeFinder(); // Do not invoke an infinite loop by calling patternFinder.closeFinder().
      }
    });

    Mousetrap.bind('ctrl+shift+f', function (e) {
      e.preventDefault();
      patternFinder.toggleFinder();

      return false;
    });

    Mousetrap($sgFindTypeahead[0]).bind('ctrl+shift+f', function (e) {
      e.preventDefault();
      patternFinder.toggleFinder();

      return false;
    });

    Mousetrap($sgFindTypeahead[0]).bind('esc', function () {
      patternFinder.closeFinder();
    });
  });
})(document, window.FEPPER_UI.uiProps, window.FEPPER_UI.uiFns);
