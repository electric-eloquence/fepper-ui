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
    if (req.method === 'POST') {
      /* eslint-disable max-len */
      let responseData = `
<!DOCTYPE html>
<html class="">
  <head>
    <title id="title">Fepper HTML Scraper</title>
    <meta charset="utf-8">

    <!-- Disable cache -->
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">

    
    <link rel="stylesheet" href="/fepper-core/html-scraper.css" media="all">
    <script src="/node_modules/mousetrap/mousetrap.min.js"></script>
    
  </head>

  <body class="text ">
    <main id="fepper-html-scraper" class="">`;
      /* eslint-enable max-len */

      req.on('data', (chunk) => {
        const urlObj = url.parse(req.url + '?' + chunk.toString(), true);

        if (req.url === '/html-scraper') {
          if (!urlObj.query.filename) {
            /* eslint-disable max-len */
            responseData += `
      <div id="message" class="message "></div>
      <div id="load-anim">
        <div></div><div></div><div></div><div></div>
      </div>
      <h1 id="scraper__heading">Fepper HTML Scraper</h1>
      <div id="scraper__reviewer">&lt;p&gt;Fepper Base&lt;/p&gt;<br>
      </div>
      <h3>Does this HTML look right?</h3>
      <form id="scraper__importer" action="/html-scraper" method="post" name="importer">
        <div>Yes, import into Fepper.</div>
        <label for="filename">Enter a filename to save this under (extension not necessary):</label>
        <input name="filename" type="text" value="">
        <input name="url" type="hidden" value="http://localhost:3006/patterns/00-styleguide-colors/00-styleguide-colors.html">
        <input name="selector" type="hidden" value="">
        <textarea name="html2json"></textarea>
        <textarea name="mustache">&lt;p&gt;{{ p }}&lt;/p&gt;
        </textarea>
        <textarea name="json">{
  "p": "Fepper Base"
}
        </textarea>
        <input id="scraper__importer__submit" name="submit_importer" type="submit" value="Submit">
      </form>
      <h3>Otherwise, correct the URL and selector and submit again.</h3>
      <form id="scraper__targeter" action="/html-scraper" method="post" name="targeter">
        <div>
          <label for="url">URL:</label>
          <input name="url" type="text" value="http://localhost:3006/patterns/00-styleguide-colors/00-styleguide-colors.html">
        </div>
        <div>
          <label for="selector_raw">Selector:</label>
          <input name="selector_raw" type="text" value=".colors__row[0]">
          <input name="selector" type="hidden" value="">
          <input name="index" type="hidden" value="">
        </div>
        <textarea name="html2json"></textarea>
        <input id="scraper__targeter__submit" name="submit_targeter" type="submit" value="Submit">
        <button id="help-hide">Hide</button><button id="help-show">Help</button>
      </form>
      <div id="help-text">
        <p></p>
        <p>Use this tool to scrape and import .mustache templates and .json data files from actual web pages, preferably the actual backend CMS that Fepper is prototyping for. Simply enter the URL of the page you wish to scrape. Then, enter the CSS selector you wish to target (prepended with &quot;#&quot; for IDs and &quot;.&quot; for classes). Classnames and tagnames may be appended with array index notation ([n]). Otherwise, the Scraper will scrape all elements of that class or tag sequentially. Such a loosely targeted scrape will save many of the targeted fields to the .json file, but will only save the first instance of the target to a .mustache template.</p>
        <p>Upon submit, you should be able to review the scraped output on the subsequent page. If the output looks correct, enter a filename and submit again. The Scraper will save .mustache and .json files by that name in your patterns&apos; scrape directory, also viewable under the Scrape menu of the toolbar.</p>
      </div>
      <iframe id="scraper__stage" sandbox="allow-same-origin allow-scripts"></iframe>
      <script src ="/scripts/pattern/html-scraper-dhtml.js"></script>`;
            /* eslint-enable max-len */
          }
          else {
            /* eslint-disable max-len */
            responseData += `
      <div id="message" class="message success">SUCCESS! Refresh the browser to check that your template appears under the &quot;Scrape&quot; menu.</div>
      <script src="/scripts/pattern/html-scraper-ajax.js"></script>`;
            /* eslint-enable max-len */
          }
        }
      });

      req.on('end', () => {
        responseData += `
    </main>
    
  </body>
</html>`;

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(responseData);
      });
    }

    else {
      const urlObj = url.parse(req.url, true);
      let filePath = urlObj.pathname;

      switch (filePath) {
        case '/':
          filePath += 'test/fixtures/index.html';

          break;

        case '/gatekeeper':
          res.writeHead(200, {'Content-Type': 'text/plain'});
          res.end('1234567890');

          return;

        case '/html-scraper-xhr':
          res.writeHead(200, {'Content-Type': 'text/html'});
          /* eslint-disable max-len */
          res.end(`<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>
      <div id="message" class="message "></div>
      <div id="load-anim">
        <div></div><div></div><div></div><div></div>
      </div>
      <h1 id="scraper__heading">Fepper HTML Scraper</h1>
      <form id="scraper__targeter" action="/html-scraper" method="post" name="targeter">
        <div>
          <label for="url">URL:</label>
          <input name="url" type="text" value="">
        </div>
        <div>
          <label for="selector_raw">Selector:</label>
          <input name="selector_raw" type="text" value="">
          <input name="selector" type="hidden" value="">
          <input name="index" type="hidden" value="">
        </div>
        <textarea name="html2json"></textarea>
        <input id="scraper__targeter__submit" name="submit_targeter" type="submit" value="Submit">
        <button id="help-hide">Hide</button><button id="help-show">Help</button>
      </form>
      <div id="help-text">
        <p></p>
        <p>Use this tool to scrape and import .mustache templates and .json data files from actual web pages, preferably the actual backend CMS that Fepper is prototyping for. Simply enter the URL of the page you wish to scrape. Then, enter the CSS selector you wish to target (prepended with &quot;#&quot; for IDs and &quot;.&quot; for classes). Classnames and tagnames may be appended with array index notation ([n]). Otherwise, the Scraper will scrape all elements of that class or tag sequentially. Such a loosely targeted scrape will save many of the targeted fields to the .json file, but will only save the first instance of the target to a .mustache template.</p>
        <p>Upon submit, you should be able to review the scraped output on the subsequent page. If the output looks correct, enter a filename and submit again. The Scraper will save .mustache and .json files by that name in your patterns&apos; scrape directory, also viewable under the Scrape menu of the toolbar.</p>
      </div>
      <iframe id="scraper__stage" sandbox="allow-same-origin allow-scripts"></iframe>
</body></html>`);
          /* eslint-enable max-len */

          return;

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
          res.end(`
<!DOCTYPE html>
<html class="">
  <head>
    <title id="title">Fepper Mustache Browser</title>
    <meta charset="utf-8">

    <!-- Disable cache -->
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">

    
    <link rel="stylesheet" href="/fepper-core/style.css" media="all">
    <script src="/node_modules/mousetrap/mousetrap.min.js"></script>
    
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
