const fs = require('fs');
const http = require('http');
const path = require('path');
const urlParse = require('url').parse;

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
      switch (req.url) {
        case '/html-scraper': {
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

    
    <link rel="stylesheet" href="/webserved/pattern.css">
    <link rel="stylesheet" href="/_styles/bld/style.css">`;
          /* eslint-enable max-len */

          req.on('data', (chunk) => {
            const urlObj = urlParse(req.url + '?' + chunk.toString(), true);
            const {filename, url, selector_raw} = urlObj.query;

            if (!filename) {
              /* eslint-disable max-len */
              responseData += `
    <link rel="stylesheet" href="/webserved/html-scraper.css">
    <script src="/node_modules/mousetrap/mousetrap.min.js"></script>
    <script src="/annotations/annotations.js"></script>
    <script src="/_scripts/src/variables.styl" type="text/javascript"></script>
  </head>

  <body class="text ">
    <main id="fepper-html-scraper" class="">
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
        <input name="url" type="hidden" value="${url}">
        <input name="selector_raw" type="hidden" value="${selector_raw}">
        <textarea name="html2json"></textarea>
        <textarea name="mustache">&lt;${selector_raw}&gt;{{ ${selector_raw} }}&lt;/${selector_raw}&gt;
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
          <input name="url" type="text" value="${url}">
        </div>
        <div>
          <label for="selector_raw">Selector:</label>
          <input name="selector_raw" type="text" value="${selector_raw}">
          <input name="selector" type="hidden" value="${selector_raw}">
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
      <script src ="/webserved/html-scraper-dhtml.js"></script>`;
              /* eslint-enable max-len */
            }
            else {
              /* eslint-disable max-len */
              responseData += `
    <script src="/node_modules/mousetrap/mousetrap.min.js"></script>
    <script src="/annotations/annotations.js"></script>
    <script src="/_scripts/src/variables.styl" type="text/javascript"></script>
  </head>

  <body class="text ">
    <main id="fepper-html-scraper" class="">
      <div id="message" class="message success">SUCCESS! Refresh the browser to check that your template appears under the &quot;Scrape&quot; menu.</div>
      <script src="/webserved/html-scraper-ajax.js"></script>`;
              /* eslint-enable max-len */
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

          return;
        }

        case '/git-interface': {
          res.writeHead(501).end('Not Implemented');

          return;
        }

        case '/markdown-editor': {
          res.writeHead(200).end('OK');

          return;
        }
      }
    }

    else {
      const urlObj = urlParse(req.url, true);
      let filePath = urlObj.pathname;

      switch (urlObj.pathname) {
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
<html class="mustache-browser">
  <head>
    <title id="title">Fepper Mustache Browser</title>
    <meta charset="utf-8">

    <!-- Disable cache -->
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">

    
    <link rel="stylesheet" href="/webserved/prism-twilight.css">
    <link rel="stylesheet" href="/webserved/mustache-browser.css">
    <script src="/webserved/mustache-browser.js"></script>
  </head>

  <body class="mustache-browser__body">
    <main id="" class="mustache-browser__main">
      <div id="message" class="message "></div>
<pre><code class="language-markup">{{{ content }}}
<a href="/?p=templates-page" target="_top" data-path="patterns/03-templates-page/03-templates-page.html" data-pattern-partial="templates-page" class="mustache-browser__link">{{> 03-templates/page }}</a>
</code></pre>

    </main>
    
  </body>
</html>`);
          /* eslint-enable max-len */

          return;
      }

      const excerpt = '/node_modules/fepper-ui';

      if (urlObj.pathname.startsWith(excerpt)) {
        switch (urlObj.pathname) {
          case '/node_modules/fepper-ui/scripts/ui/compilation.js':
            filePath = `${__dirname}/fixtures/ui-compilation.js`;

            break;
          case '/node_modules/fepper-ui/scripts/ui/data.js':
            filePath = `${__dirname}/fixtures/ui-data.js`;

            break;
          case '/node_modules/fepper-ui/styles/ui.css':
            filePath = `${__dirname}/fixtures/styles/ui.css`;

            break;
          default:
            filePath = `${__dirname}/..${filePath.replace(excerpt, '')}`;
        }
      }
      else if (urlObj.pathname.startsWith('/annotations/')) {
        filePath = `${__dirname}/fixtures${filePath}`;
      }
      else if (urlObj.pathname.startsWith('/webserved/')) {
        filePath = `${__dirname}/../node_modules/fepper/core${filePath}`;
      }
      else if (urlObj.pathname.startsWith('/_scripts/')) {
        filePath = `${__dirname}/../node_modules/fepper/excludes/profiles/base/source${filePath}`;
      }
      else if (urlObj.pathname.startsWith('/_styles/')) {
        filePath = `${__dirname}/../node_modules/fepper/excludes/profiles/base/source${filePath}`;
      }
      else {
        filePath = `${__dirname}/..${filePath}`;
      }

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
        case '.mjs':
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
            res.writeHead(404).end('Not Found');
          }
          else {
            res.writeHead(500).end('Internal Server Error');
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
