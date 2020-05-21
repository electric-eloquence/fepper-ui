((d) => {
  'use strict'; // eslint-disable-line strict

  // Targeter is the last form on the HTML Scraper page. Older Fepper versions didn't identify it by name.
  const targeter = d.forms[d.forms.length - 1];

  targeter.addEventListener('submit', () => {
    // First show loading animation.
    const loadAnim = d.getElementById('load-anim') || {style: {}};
    loadAnim.style.display = 'block';

    // Then, append search params to target.
    const baseUrl = window.location.protocol + '//' + window.location.host;
    let url = targeter.url.value;
    targeter.action = '/html-scraper?url=';

    if (url[0] === '/') {
      url = baseUrl + url;
    }

    targeter.action += encodeURIComponent(url);
    targeter.action += '&selector=';
    targeter.action += encodeURIComponent(targeter.selector.value);
  });

  // Show/hide help text.
  const helpButton = d.getElementById('help-button');
  const hideButton = d.getElementById('hide-button');
  let helpText;

  if (helpButton) {
    helpButton.addEventListener('click', (e) => {
      e.preventDefault();

      helpText = helpText || d.getElementById('help-text') || {style: {}};
      helpText.style.visibility = 'visible';
      helpButton.style.display = 'none';
      hideButton.style.display = 'block';
    });
  }

  if (hideButton) {
    hideButton.addEventListener('click', (e) => {
      e.preventDefault();

      helpText = helpText || d.getElementById('help-text') || {style: {}};
      helpText.style.visibility = 'hidden';
      hideButton.style.display = 'none';
      helpButton.style.display = 'block';
    });
  }

  // Validate importer form.
  const importer = d.forms.importer;

  if (importer) {
    importer.addEventListener('submit', (e) => {
      if (
        !/^[0-9a-z][\w\-\.]*$/i.test(importer.filename.value) || // eslint-disable-line no-useless-escape
        importer.filename.value.indexOf('00-html-scraper') === 0
      ) {
        e.preventDefault();

        const message = d.getElementById('message') || {style: {}};
        message.className = 'message error';
        message.innerHTML = 'ERROR! Please enter a valid filename.';
        d.body.scrollTop = d.documentElement.scrollTop = 0;
      }
    });
  }
})(document);
