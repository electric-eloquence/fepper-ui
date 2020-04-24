const fs = require('fs');
const http = require('http');
const path = require('path');
const url = require('url');

let port = 8080;

if (process.env.PORT) {
  port = process.env.PORT;
}
else if (typeof process.argv[2] === 'string' && /^\d+$/.test(process.argv[2])) {
  port = process.argv[2];
}

process.env.PORT = port;

module.exports = new Promise((resolve) => {
  const server = http.createServer((req, res) => {
    const urlObj = url.parse(req.url, true);

    if (req.method === 'POST') {
      let data = `
<!DOCTYPE html>
<html>
  <head>
    <title id="title">Fepper HTML Scraper</title>
    <meta charset="UTF-8">
    <!-- Disable cache -->
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">
  </head>
  <body class="text">
    <main id="scraper" class="scraper">`;

      /* eslint-disable max-len */
      if (
        urlObj.query.url && urlObj.query.url.indexOf('/patterns/04-pages-00-homepage/04-pages-00-homepage.html') > -1 &&
        urlObj.query.selector === 'p'
      ) {
        data += `
      <div id="message" class="message "></div>
      <h1 id="scraper-heading" class="scraper-heading">Fepper HTML Scraper</h1>
      <div style="border: 1px solid black;margin: 10px 0 20px;overflow-x: scroll;padding: 20px;width: 100%;"><div>&lt;p&gt;Fepper Base&lt;/p&gt;<br></div>
      </div>
      <h3>Does this HTML look right?</h3>
      <form id="html-scraper-importer" action="/html-scraper" method="post" name="importer" style="margin-bottom: 20px;">
        <div>Yes, import into Fepper.</div>
        <label for="import-form">Enter a filename to save this under (extension not necessary):</label>
        <input name="filename" type="text" value="" style="width: 100%">
        <input name="url" type="hidden" value="/patterns/04-pages-00-homepage/04-pages-00-homepage.html">
        <input name="selector" type="hidden" value="p">
        <textarea name="html2json" style="display: none;"></textarea>
        <textarea name="mustache" style="display: none;">&lt;p&gt;{{ p }}&lt;/p&gt;
        </textarea>
        <textarea name="json" style="display: none;">{
  "p": "Fepper Base"
}
        </textarea>
        <input name="import-form" type="submit" value="Submit" style="margin-top: 10px;">
      </form>
      <h3>Otherwise, correct the URL and Target Selector and submit again.</h3><script src="/scripts/pattern/html-scraper-ajax.js"></script>`;
      }

      else if (urlObj.pathname === '/html-scraper') {
        data += `
      <div id="message" class="message success">Success! Refresh the browser to check that your template appears under the "Scrape" menu.</div>
      <h1 id="scraper-heading" class="scraper-heading">Fepper HTML Scraper</h1><script src="/scripts/pattern/html-scraper-ajax.js"></script>`;
      }
      /* eslint-enable max-len */

      data += `
    </main>
  </body>
</html>`;

      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(data);
    }

    else {
      let filePath = urlObj.pathname;

      switch (filePath) {
        case '/':
          filePath += 'test/fixtures/index.html';

          break;

        case '/gatekeeper':
          res.writeHead(200, {'Content-Type': 'text/plain'});
          res.end('1234567890');

          break;

        case '/html-scraper-xhr':
          res.writeHead(200, {'Content-Type': 'text/html'});

          /* eslint-disable max-len */
          res.end(`<!DOCTYPE html>
<html>
      <div id="message" class="message "></div>
        <h1 id="scraper-heading" class="scraper-heading">Fepper HTML Scraper</h1>
        <form id="html-scraper-targeter" action="/html-scraper" method="post" name="targeter">
          <div>
            <label for="url">URL:</label>
            <input name="url" type="text" value="/patterns/04-pages-00-homepage/04-pages-00-homepage.html" style="width: 100%;">
          </div>
          <div>
            <label for="selector">Target Selector:</label>
            <input name="selector" type="text" value="p" style="width: 100%;">
          </div>
          <textarea name="html2json" style="display: none;"></textarea>
          <div class="cf" style="padding-top: 10px;">
            <input name="url-form" type="submit" value="Submit" style="float: left;">
            <button id="help-button" style="float: right;">Help</button>
          </div>
        </form>
        <div id="help-text" style="border: 1px solid black;visibility: hidden;margin-top: 5.50px;padding: 0 20px;width: 100%">
          <p></p>
          <p>Use this tool to scrape and import Mustache templates and JSON data files from actual web pages, preferably the actual backend CMS that Fepper is prototyping for. Simply enter the URL of the page you wish to scrape. Then, enter the CSS selector you wish to target (prepended with "#" for IDs and "." for classes). Classnames and tagnames may be appended with array index notation ([n]). Otherwise, the Scraper will scrape all elements of that class or tag sequentially. Such a loosely targeted scrape will save many of the targeted fields to the JSON file, but will only save the first instance of the target to a Mustache template.</p>
    <p>Upon submit, you should be able to review the scraped output on the subsequent page. If the output looks correct, enter a filename and submit again. The Scraper will save Mustache and JSON files by that name in your patterns&apos; scrape directory, also viewable under the Scrape menu of the toolbar. The Scraper will correctly indent the Mustache code. However, the JSON parsing requires a conversion from HTML to XHTML, so don&apos;t expect an exact copy of the HTML structure of the source HTML.</p>
        </div>
</html>`);
          /* eslint-enable max-len */

          break;

        case '/html-scraper-xhr/cors':
          if (urlObj.query.url) {
            http.get(urlObj.query.url, (res1) => {
              let data = '';

              res1.on('data', (chunk) => {
                data += chunk;
              });

              res1.on('end', () => {
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(data);
              });
            })
            .on('error', (err) => {
              console.error('Error: ' + err.message); // eslint-disable-line no-console
              res.writeHead(500);
              res.end('Error: ' + err.message);
            });
          }

          return;

        case '/mustache-browser':
          res.writeHead(200, {'Content-Type': 'text/html'});

          /* eslint-disable max-len */
          res.end(`<!DOCTYPE html>
<html>
  <head>
    <title id="title">Fepper Mustache Browser</title>
    <meta charset="UTF-8">
    <!-- Disable cache -->
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">
  </head>
  <body class="text">
    <main id="mustache-browser" class="mustache-browser">
      <a href="#" class="fp-express mustache-browser__back" onclick="window.history.back();return false;">&#8678;</a>
      <h2><a href="../patterns/04-pages-00-homepage/04-pages-00-homepage.html" class="fp-express mustache-browser__pattern-link">pages-homepage</a></h2>
      <a href="?partial={{&gt; 03-templates/page }}" class="fp-express">{{&gt; 03-templates/page }}</a><br>
    </main>
  </body>
</html>`);
          /* eslint-enable max-len */

          return;
      }

      filePath = `${__dirname}/..${filePath}`;

      const extname = path.extname(filePath);
      let contentType = 'application/octet-stream';

      switch (extname) {
        case '.css':
          contentType = 'text/css';
          break;
        case '.html':
          contentType = 'text/html';
          break;
        case '.js':
          contentType = 'application/javascript';
          break;
        case '.styl':
          contentType = 'application/javascript';
          break;
        case '.svg':
          contentType = 'image/svg+xml';
          break;
      }

      fs.readFile(filePath, (err, data) => {
        if (err) {
          if (err.code === 'ENOENT') {
            res.writeHead(404);
            res.end('HTTP 404: Not Found');
          }
          else {
            res.writeHead(500);
            res.end('HTTP 500: Internal Server Error');
          }
        }
        else {
          res.writeHead(200, {'Content-Type': contentType});
          res.end(data);
        }
      });
    }
  })
  .listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on port ${port}`);

    resolve(server);
  });
});
