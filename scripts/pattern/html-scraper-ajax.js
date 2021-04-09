((d) => {
  'use strict'; // eslint-disable-line strict

  function appendMain(main) {
    d.body.appendChild(main);
  }

  function createMain() {
    const main = d.createElement('main');

    main.setAttribute('id', 'fepper-html-scraper');

    return main;
  }

  /* MAIN EXECUTION */

  // First, load styles. We don't want these styles to be applied to any viewall.
  // Since CSS can't perform such negative logic, we'll use this sandboxed stylesheet.
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = '/styles/html-scraper.css';
  document.getElementsByTagName('head')[0].appendChild(link);

  // Since the HTML scraper won't work on any non-Express served environment, we can safely assume that Fepper will be
  // served from the document root.
  const baseUrl = window.location.protocol + '//' + window.location.host;
  const emptyFrag = new DocumentFragment();

  // First, make sure the HTML scraper is being requested from the same machine that's running the Express app.
  fetch(baseUrl + '/gatekeeper')
    .then(() => fetch(baseUrl + '/html-scraper-xhr' + window.location.search))
    .then((response) => response.text())
    .then((responseText) => {
      return new Promise((resolve) => {
        // Parse xhr.responseText into DOM object.
        const parser = new DOMParser();
        const doc = parser.parseFromString(responseText, 'text/html');
        let main = d.getElementById('fepper-html-scraper');

        if (main) {
          // DEPRECATED as of 2020-12-08. To be replaced.
          const message = doc.getElementById('message') || emptyFrag;
          const loadAnim = doc.getElementById('load-anim') || emptyFrag;
          const heading = doc.getElementById('scraper-heading');
          // Get last form on page. Older Fepper versions didn't identify it by name.
          const targeter = doc.forms[doc.forms.length - 1]; // Allow fully logged failure if this returns null.
          const helpText = doc.getElementById('help-text') || emptyFrag;
          const stage = doc.getElementById('scraper__stage') || emptyFrag;

          // Write out main content.
          if (!main.getElementsByClassName('message').length) {
            main.appendChild(message);
          }

          main.appendChild(loadAnim);

          if (!main.getElementsByClassName('scraper-heading').length) {
            if (heading) {
              main.appendChild(heading);
            }
            else {
              const heading = d.createElement('h1');
              heading.id = 'scraper__heading';
              heading.innerHTML = 'Fepper HTML Scraper';

              main.appendChild(heading);
            }
          }

          main.appendChild(targeter);
          main.appendChild(helpText);
          main.appendChild(stage);

          // Insert new script element such that it fires on load.
          const node4insert = d.getElementById('help-text');

          if (node4insert) {
            const script2insert = d.createElement('script');
            script2insert.src = '/node_modules/fepper-ui/scripts/pattern/html-scraper-dhtml.js';

            node4insert.parentNode.insertBefore(script2insert, node4insert);
          }
        }
        else {
          const scraperDhtml = d.createElement('script');
          scraperDhtml.src = '/node_modules/fepper-ui/scripts/pattern/html-scraper-dhtml.js';
          main = createMain();
          main.innerHTML = doc.body.innerHTML;

          appendMain(main);
          d.body.appendChild(scraperDhtml);
        }

        resolve();
      });
    })
    .catch(() => {
      return fetch(baseUrl + '/html-scraper-xhr/forbidden' + window.location.search)
        .then((response) => response.text())
        .then((responseText) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(responseText, 'text/html');
          const forbidden = doc.getElementById('forbidden');
          let main = d.getElementById('main');

          if (main) {
            main.innerHTML = forbidden.outerHTML;
          }
          else {
            main = createMain();
            main.innerHTML = forbidden.outerHTML;

            appendMain(main);
          }
        });
    });
})(document);
