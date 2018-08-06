(() => {
  'use strict';

  const d = document;

  /* APPEND SEARCH PARAMS TO TARGET */
  // targeter is the last form on the HTML Scraper page. Older Fepper versions didn't identify it by name.
  const targeter = d.forms[d.forms.length - 1];

  targeter.addEventListener(
    'submit',
    function () {
      targeter.action = '/html-scraper?url=';
      targeter.action += encodeURIComponent(targeter.url.value);
      targeter.action += '&selector=';
      targeter.action += encodeURIComponent(targeter.selector.value);
    },
    false
  );

  /* SHOW/HIDE HELP TEXT */
  const helpButton = d.getElementById('help-button');
  const helpText = d.getElementById('help-text');

  helpButton.addEventListener(
    'click',
    function (e) {
      e.preventDefault();

      if (helpButton.innerHTML === 'Help') {
        helpButton.innerHTML = 'Hide';
        helpText.style.visibility = 'visible';
      }
      else {
        helpButton.innerHTML = 'Help';
        helpText.style.visibility = 'hidden';
      }
    },
    false
  );

  /* VALIDATE IMPORTER FORM */
  const importer = d.forms.importer;

  if (importer) {
    importer.addEventListener(
      'submit',
      function (e) {
        if (!/^[0-9a-z][\w\-\.]*$/i.test(importer.filename.value)) {
          e.preventDefault();

          const message = d.getElementById('message');
          message.className = 'message error';
          message.innerHTML = 'Error! Please enter a valid filename.';
          d.body.scrollTop = d.documentElement.scrollTop = 0;
        }
      },
      false
    );
  }
})();
