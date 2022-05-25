const pauseLg = 1000;
const pauseMd = 500;
const pauseSm = 100;

describe('Pattern end-to-end tests', () => {
  describe('annotations-viewer.js', () => {
    describe('click', () => {
      before(async () => {
        await browser.setWindowSize(1024, 768);
      });

      it('viewall annotations viewer button toggles annotations viewer', async () => {
        const sgPop = await $('.sg-pop[data-pattern-partial="viewall"]');
        const sgViewport = await $('#sg-viewport');
        const sgPatternToggleAnnotationsComponentsRegion = await $('#sg-pattern-toggle-annotations-components-region');

        await sgPop.waitForClickable();
        await sgPop.click();
        await browser.switchToFrame(sgViewport);
        await sgPatternToggleAnnotationsComponentsRegion.waitForClickable();
        await sgPatternToggleAnnotationsComponentsRegion.click();
        await browser.pause(pauseMd);
        await browser.switchToParentFrame();

        const sgVpWrap = await $('#sg-vp-wrap');
        const sgViewContainer = await $('#sg-view-container');
        const sgAnnotations = await $('#sg-annotations');

        expect((await sgVpWrap.getCSSProperty('padding-bottom')).value).to.equal('322px');
        expect((await sgViewContainer.getCSSProperty('bottom')).value).to.equal('0px');
        expect(await sgAnnotations.getHTML(false)).to.equal(`<div id="annotation-1" class="sg-annotation">
<h2>1. Navigation</h2>
<div><p>Navigation for responsive web experiences can be tricky. Large navigation menus 
are typical on desktop sites, but mobile screen sizes don't give us the luxury 
of space. We're dealing with this situation by creating a simple menu anchor 
that toggles the main navigation on small screens. Once the screen size is large 
enough to accommodate the nav, we show the main navigation links and hide the 
menu anchor.</p>
</div>
</div>`);

        await browser.switchToFrame(sgViewport);
        await sgPatternToggleAnnotationsComponentsRegion.waitForClickable();
        await sgPatternToggleAnnotationsComponentsRegion.click();
        await browser.pause(pauseMd);
        await browser.switchToParentFrame();

        expect((await sgVpWrap.getCSSProperty('padding-bottom')).value).to.equal('0px');
        expect((await sgViewContainer.getCSSProperty('bottom')).value).to.equal('636px');
      });
    });

    describe('Mousetrap', () => {
      before(async () => {
        await browser.setWindowSize(1024, 768);
      });

      it('"ctrl+shift+a" toggles annotations viewer', async () => {
        const sgViewport = await $('#sg-viewport');

        await browser.switchToFrame(sgViewport);
        await browser.keys(['Control', 'Shift', 'a']);
        await browser.pause(pauseMd);
        await browser.switchToParentFrame();

        const sgVpWrap = await $('#sg-vp-wrap');
        const sgViewContainer = await $('#sg-view-container');
        const sgAnnotations = await $('#sg-annotations');

        expect((await sgVpWrap.getCSSProperty('padding-bottom')).value).to.equal('322px');
        expect((await sgViewContainer.getCSSProperty('bottom')).value).to.equal('0px');
        expect(await sgAnnotations.getHTML(false)).to.equal(`<div id="annotation-1" class="sg-annotation">
<h2>1. Navigation</h2>
<div><p>Navigation for responsive web experiences can be tricky. Large navigation menus 
are typical on desktop sites, but mobile screen sizes don't give us the luxury 
of space. We're dealing with this situation by creating a simple menu anchor 
that toggles the main navigation on small screens. Once the screen size is large 
enough to accommodate the nav, we show the main navigation links and hide the 
menu anchor.</p>
</div>
</div>`);

        await browser.switchToFrame(sgViewport);
        await browser.keys(['Control', 'Shift', 'a']);
        await browser.pause(pauseMd);
        await browser.switchToParentFrame();

        expect((await sgVpWrap.getCSSProperty('padding-bottom')).value).to.equal('0px');
        expect((await sgViewContainer.getCSSProperty('bottom')).value).to.equal('636px');
      });
    });
  });

  describe('code-viewer.js', () => {
    describe('click', () => {
      before(async () => {
        await browser.setWindowSize(1024, 768);
      });

      it('viewall code viewer button toggles code viewer', async () => {
        const sgPop = await $('.sg-pop[data-pattern-partial="viewall"]');
        const sgViewport = await $('#sg-viewport');
        const sgPatternToggleCodeComponentsRegion = await $('#sg-pattern-toggle-code-components-region');

        await sgPop.waitForClickable();
        await sgPop.click();
        await browser.switchToFrame(sgViewport);
        await sgPatternToggleCodeComponentsRegion.waitForClickable();
        await sgPatternToggleCodeComponentsRegion.click();
        await browser.pause(pauseMd);
        await browser.switchToParentFrame();

        const sgVpWrap = await $('#sg-vp-wrap');
        const sgViewContainer = await $('#sg-view-container');

        expect((await sgVpWrap.getCSSProperty('padding-bottom')).value).to.equal('322px');
        expect((await sgViewContainer.getCSSProperty('bottom')).value).to.equal('0px');
        expect(await sgViewContainer.getAttribute('class')).to.have.string('anim-ready');

        await browser.switchToFrame(sgViewport);
        await sgPatternToggleCodeComponentsRegion.click();
        await browser.pause(pauseMd);
        await browser.switchToParentFrame();

        expect((await sgVpWrap.getCSSProperty('padding-bottom')).value).to.equal('0px');
        expect((await sgViewContainer.getCSSProperty('bottom')).value).to.equal('636px');
        expect(await sgViewContainer.getAttribute('class')).to.not.have.string('anim-ready');
      });
    });

    describe('Mousetrap', () => {
      before(async () => {
        browser.setWindowSize(1024, 768);
      });

      it('"ctrl+shift+c" toggles code viewer', async () => {
        const sgViewport = await $('#sg-viewport');

        await browser.switchToFrame(sgViewport);
        await browser.keys(['Control', 'Shift', 'c']);
        await browser.pause(pauseMd);
        await browser.switchToParentFrame();

        const sgVpWrap = await $('#sg-vp-wrap');
        const sgViewContainer = await $('#sg-view-container');

        expect((await sgVpWrap.getCSSProperty('padding-bottom')).value).to.equal('322px');
        expect((await sgViewContainer.getCSSProperty('bottom')).value).to.equal('0px');
        expect(await sgViewContainer.getAttribute('class')).to.have.string('anim-ready');

        await browser.switchToFrame(sgViewport);
        await browser.keys(['Control', 'Shift', 'c']);
        await browser.pause(pauseMd);
        await browser.switchToParentFrame();

        expect((await sgVpWrap.getCSSProperty('padding-bottom')).value).to.equal('0px');
        expect((await sgViewContainer.getCSSProperty('bottom')).value).to.equal('636px');
        expect(await sgViewContainer.getAttribute('class')).to.not.have.string('anim-ready');
      });
    });
  });

  /* eslint-disable max-len */
  /* eslint-disable no-useless-escape */
  describe('html-scraper-ajax.js', () => {
    before(async () => {
      await browser.setWindowSize(1024, 768);
    });

    it('pre-import submit button posts correctly', async () => {
      const sgNavScrape = await $('.sg-nav-scrape');
      const sgAccHandle = await sgNavScrape.$('.sg-acc-handle');
      const sgPop = await sgNavScrape.$('.sg-pop');
      const sgViewport = await $('#sg-viewport');
      const nameUrl = await $('[name="url"]');
      const nameSelectorRaw = await $('[name="selector_raw"]');
      const nameSubmitTargeter = await $('[name="submit_targeter"]');

      await sgAccHandle.waitForClickable();
      await sgAccHandle.click();
      await sgPop.waitForClickable();
      await sgPop.click();
      await browser.switchToFrame(sgViewport);
      await nameUrl.waitForClickable();
      await nameUrl.click();
      await nameUrl.setValue('/patterns/04-pages-00-homepage/04-pages-00-homepage.html');
      await nameSelectorRaw.waitForClickable();
      await nameSelectorRaw.click();
      await nameSelectorRaw.setValue('p');
      await nameSubmitTargeter.waitForClickable();
      await nameSubmitTargeter.click();
      await browser.pause(pauseSm);

      expect(await (await $('html')).getHTML(false)).to.equal(`<head>
    <title id="title">Fepper HTML Scraper</title>
    <meta charset="utf-8">

    <!-- Disable cache -->
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">

    
    <link rel="stylesheet" href="/webserved/pattern.css">
    <link rel="stylesheet" href="/_styles/bld/style.css">
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
        <input name="url" type="hidden" value="/patterns/04-pages-00-homepage/04-pages-00-homepage.html">
        <input name="selector_raw" type="hidden" value="p">
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
          <input name="url" type="text" value="/patterns/04-pages-00-homepage/04-pages-00-homepage.html">
        </div>
        <div>
          <label for="selector_raw">Selector:</label>
          <input name="selector_raw" type="text" value="p">
          <input name="selector" type="hidden" value="p">
          <input name="index" type="hidden" value="">
        </div>
        <textarea name="html2json"></textarea>
        <input id="scraper__targeter__submit" name="submit_targeter" type="submit" value="Submit">
        <button id="help-hide">Hide</button><button id="help-show">Help</button>
      </form>
      <div id="help-text">
        <p></p>
        <p>Use this tool to scrape and import .mustache templates and .json data files from actual web pages, preferably the actual backend CMS that Fepper is prototyping for. Simply enter the URL of the page you wish to scrape. Then, enter the CSS selector you wish to target (prepended with "#" for IDs and "." for classes). Classnames and tagnames may be appended with array index notation ([n]). Otherwise, the Scraper will scrape all elements of that class or tag sequentially. Such a loosely targeted scrape will save many of the targeted fields to the .json file, but will only save the first instance of the target to a .mustache template.</p>
        <p>Upon submit, you should be able to review the scraped output on the subsequent page. If the output looks correct, enter a filename and submit again. The Scraper will save .mustache and .json files by that name in your patterns\' scrape directory, also viewable under the Scrape menu of the toolbar.</p>
      </div>
      <iframe id="scraper__stage" sandbox="allow-same-origin allow-scripts"></iframe>
      <script src="/webserved/html-scraper-dhtml.js"></script>
    </main>
    
  
</body>`);
    });

    it('import-form submit button posts correctly', async () => {
      const sgNavScrape = await $('.sg-nav-scrape');
      const sgAccHandle = await sgNavScrape.$('.sg-acc-handle');
      const sgPop = await sgNavScrape.$('.sg-pop');
      const sgViewport = await $('#sg-viewport');
      const nameUrl = await $('[name="url"]');
      const nameSelectorRaw = await $('[name="selector_raw"]');
      const nameSubmitTargeter = await $('[name="submit_targeter"]');
      const nameFilename = await $('[name="filename"]');
      const nameSubmitImporter = await $('[name="submit_importer"]');

      await sgAccHandle.waitForClickable();
      await sgAccHandle.click();
      await sgPop.waitForClickable();
      await sgPop.click();
      await browser.switchToFrame(sgViewport);
      await nameUrl.waitForClickable();
      await nameUrl.click();
      await nameUrl.setValue('/patterns/04-pages-00-homepage/04-pages-00-homepage.html');
      await nameSelectorRaw.waitForClickable();
      await nameSelectorRaw.click();
      await nameSelectorRaw.setValue('p');
      await nameSubmitTargeter.waitForClickable();
      await nameSubmitTargeter.click();
      await nameFilename.click();
      await nameFilename.setValue('test');
      await nameSubmitImporter.waitForClickable();
      await nameSubmitImporter.click();
      await browser.pause(pauseSm);

      expect(await (await $('html')).getHTML(false)).to.equal(`<head>
    <title id="title">Fepper HTML Scraper</title>
    <meta charset="utf-8">

    <!-- Disable cache -->
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">

    
    <link rel="stylesheet" href="/webserved/pattern.css">
    <link rel="stylesheet" href="/_styles/bld/style.css">
    <script src="/node_modules/mousetrap/mousetrap.min.js"></script>
    <script src="/annotations/annotations.js"></script>
    <script src="/_scripts/src/variables.styl" type="text/javascript"></script>
  <link rel="stylesheet" href="/webserved/html-scraper.css"></head>

  <body class="text ">
    <main id="fepper-html-scraper" class="">
      <div id="message" class="message success">SUCCESS! Refresh the browser to check that your template appears under the "Scrape" menu.</div>
      <script src="/webserved/html-scraper-ajax.js"></script>
    <div id="load-anim">
        <div></div><div></div><div></div><div></div>
      </div><h1 id="scraper__heading">Fepper HTML Scraper</h1><form id="scraper__targeter" action="/html-scraper" method="post" name="targeter">
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
      </form><script src="/webserved/html-scraper-dhtml.js"></script><div id="help-text">
        <p></p>
        <p>Use this tool to scrape and import .mustache templates and .json data files from actual web pages, preferably the actual backend CMS that Fepper is prototyping for. Simply enter the URL of the page you wish to scrape. Then, enter the CSS selector you wish to target (prepended with "#" for IDs and "." for classes). Classnames and tagnames may be appended with array index notation ([n]). Otherwise, the Scraper will scrape all elements of that class or tag sequentially. Such a loosely targeted scrape will save many of the targeted fields to the .json file, but will only save the first instance of the target to a .mustache template.</p>
        <p>Upon submit, you should be able to review the scraped output on the subsequent page. If the output looks correct, enter a filename and submit again. The Scraper will save .mustache and .json files by that name in your patterns\' scrape directory, also viewable under the Scrape menu of the toolbar.</p>
      </div><iframe id="scraper__stage" sandbox="allow-same-origin allow-scripts"></iframe></main>
    
  
</body>`);
    });

    it('post-import targeter submit button posts correctly', async () => {
      const sgNavScrape = await $('.sg-nav-scrape');
      const sgAccHandle = await sgNavScrape.$('.sg-acc-handle');
      const sgPop = await sgNavScrape.$('.sg-pop');
      const sgViewport = await $('#sg-viewport');
      const nameUrl = await $('[name="url"]');
      const nameSelectorRaw = await $('[name="selector_raw"]');
      const nameSubmitTargeter = await $('[name="submit_targeter"]');

      await sgAccHandle.waitForClickable();
      await sgAccHandle.click();
      await sgPop.waitForClickable();
      await sgPop.click();
      await browser.switchToFrame(sgViewport);
      await nameUrl.waitForClickable();
      await nameUrl.click();
      await nameUrl.setValue('/patterns/04-pages-00-homepage/04-pages-00-homepage.html');
      await nameSelectorRaw.waitForClickable();
      await nameSelectorRaw.click();
      await nameSelectorRaw.setValue('p');
      await nameSubmitTargeter.waitForClickable();
      await nameSubmitTargeter.click();

      const scraperTargeter = await $('#scraper__targeter');
      const scraperTargeterSubmitTargeter = await scraperTargeter.$('[name="submit_targeter"]');

      await (await scraperTargeter.$('[name="selector_raw"]')).setValue('h1');
      await scraperTargeterSubmitTargeter.waitForClickable();
      await scraperTargeterSubmitTargeter.click();
      await browser.pause(pauseSm);

      expect(await (await $('html')).getHTML(false)).to.equal(`<head>
    <title id="title">Fepper HTML Scraper</title>
    <meta charset="utf-8">

    <!-- Disable cache -->
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">

    
    <link rel="stylesheet" href="/webserved/pattern.css">
    <link rel="stylesheet" href="/_styles/bld/style.css">
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
        <input name="url" type="hidden" value="/patterns/04-pages-00-homepage/04-pages-00-homepage.html">
        <input name="selector_raw" type="hidden" value="h1">
        <textarea name="html2json"></textarea>
        <textarea name="mustache">&lt;h1&gt;{{ h1 }}&lt;/h1&gt;
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
          <input name="url" type="text" value="/patterns/04-pages-00-homepage/04-pages-00-homepage.html">
        </div>
        <div>
          <label for="selector_raw">Selector:</label>
          <input name="selector_raw" type="text" value="h1">
          <input name="selector" type="hidden" value="h1">
          <input name="index" type="hidden" value="">
        </div>
        <textarea name="html2json"></textarea>
        <input id="scraper__targeter__submit" name="submit_targeter" type="submit" value="Submit">
        <button id="help-hide">Hide</button><button id="help-show">Help</button>
      </form>
      <div id="help-text">
        <p></p>
        <p>Use this tool to scrape and import .mustache templates and .json data files from actual web pages, preferably the actual backend CMS that Fepper is prototyping for. Simply enter the URL of the page you wish to scrape. Then, enter the CSS selector you wish to target (prepended with "#" for IDs and "." for classes). Classnames and tagnames may be appended with array index notation ([n]). Otherwise, the Scraper will scrape all elements of that class or tag sequentially. Such a loosely targeted scrape will save many of the targeted fields to the .json file, but will only save the first instance of the target to a .mustache template.</p>
        <p>Upon submit, you should be able to review the scraped output on the subsequent page. If the output looks correct, enter a filename and submit again. The Scraper will save .mustache and .json files by that name in your patterns\' scrape directory, also viewable under the Scrape menu of the toolbar.</p>
      </div>
      <iframe id="scraper__stage" sandbox="allow-same-origin allow-scripts"></iframe>
      <script src="/webserved/html-scraper-dhtml.js"></script>
    </main>
    
  
</body>`);
    });
  });
  /* eslint-enable max-len */
  /* eslint-enable no-useless-escape */

  describe('html-scraper-dhtml.js', () => {
    before(async () => {
      await browser.setWindowSize(1024, 768);
    });

    it('help button shows and hides help text correctly', async () => {
      const sgNavScrape = await $('.sg-nav-scrape');
      const sgAccHandle = await sgNavScrape.$('.sg-acc-handle');
      const sgPop = await sgNavScrape.$('.sg-pop');
      const sgViewport = await $('#sg-viewport');

      await sgAccHandle.waitForClickable();
      await sgAccHandle.click();
      await sgPop.waitForClickable();
      await sgPop.click();
      await browser.switchToFrame(sgViewport);

      const helpShow = await $('#help-show');
      const helpText = await $('#help-text');
      const helpHide = await $('#help-hide');

      expect((await helpShow.getCSSProperty('display')).value).to.equal('block');
      expect((await helpText.getCSSProperty('visibility')).value).to.equal('hidden');
      expect((await helpHide.getCSSProperty('display')).value).to.equal('none');

      await helpShow.waitForClickable();
      await helpShow.click();

      expect((await helpShow.getCSSProperty('display')).value).to.equal('none');
      expect((await helpText.getCSSProperty('visibility')).value).to.equal('visible');
      expect((await helpHide.getCSSProperty('display')).value).to.equal('block');

      await helpHide.waitForClickable();
      await helpHide.click();

      expect((await helpShow.getCSSProperty('display')).value).to.equal('block');
      expect((await helpText.getCSSProperty('visibility')).value).to.equal('hidden');
      expect((await helpHide.getCSSProperty('display')).value).to.equal('none');
    });

    it('importer submit button errors on filename with invalid characters', async () => {
      const sgNavScrape = await $('.sg-nav-scrape');
      const sgAccHandle = await sgNavScrape.$('.sg-acc-handle');
      const sgPop = await sgNavScrape.$('.sg-pop');
      const sgViewport = await $('#sg-viewport');
      const nameUrl = await $('[name="url"]');
      const nameSelectorRaw = await $('[name="selector_raw"]');
      const nameSubmitTargeter = await $('[name="submit_targeter"]');
      const nameSubmitImporter = await $('[name="submit_importer"]');

      // Just testing error case because that is the only client-side JS logic driven by the listener.
      // A success case will request the Express app which will respond independent of client-side JS.
      await sgAccHandle.waitForClickable();
      await sgAccHandle.click();
      await sgPop.waitForClickable();
      await sgPop.click();
      await browser.switchToFrame(sgViewport);
      await nameUrl.waitForClickable();
      await nameUrl.click();
      await nameUrl.setValue('/patterns/04-pages-00-homepage/04-pages-00-homepage.html');
      await nameSelectorRaw.waitForClickable();
      await nameSelectorRaw.click();
      await nameSelectorRaw.setValue('p');
      await nameSubmitTargeter.waitForClickable();
      await nameSubmitTargeter.click();
      await nameSubmitImporter.waitForClickable();
      await nameSubmitImporter.click();

      const message = await $('#message');

      expect(await message.getAttribute('class')).to.equal('message error');
      expect(await message.getText()).to.equal('ERROR! Please enter a valid filename.');
    });

    it('importer submit button errors on filename named "00-html-scraper"', async () => {
      const sgNavScrape = await $('.sg-nav-scrape');
      const sgAccHandle = await sgNavScrape.$('.sg-acc-handle');
      const sgPop = await sgNavScrape.$('.sg-pop');
      const sgViewport = await $('#sg-viewport');
      const nameUrl = await $('[name="url"]');
      const nameSelectorRaw = await $('[name="selector_raw"]');
      const nameSubmitTargeter = await $('[name="submit_targeter"]');
      const nameFilename = await $('[name="filename"]');
      const nameSubmitImporter = await $('[name="submit_importer"]');

      // Just testing error case because that is the only client-side JS logic driven by the listener.
      // A success case will request the Express app which will respond independent of client-side JS.
      await sgAccHandle.waitForClickable();
      await sgAccHandle.click();
      await sgPop.waitForClickable();
      await sgPop.click();
      await browser.switchToFrame(sgViewport);
      await nameUrl.waitForClickable();
      await nameUrl.click();
      await nameUrl.setValue('/patterns/04-pages-00-homepage/04-pages-00-homepage.html');
      await nameSelectorRaw.waitForClickable();
      await nameSelectorRaw.click();
      await nameSelectorRaw.setValue('p');
      await nameSubmitTargeter.waitForClickable();
      await nameSubmitTargeter.click();
      await nameFilename.waitForClickable();
      await nameFilename.click();
      await nameFilename.setValue('00-html-scraper');
      await nameSubmitImporter.waitForClickable();
      await nameSubmitImporter.click();

      const message = await $('#message');

      expect(await message.getAttribute('class')).to.equal('message error');
      expect(await message.getText()).to.equal('ERROR! Please enter a valid filename.');
    });
  });

  describe('pattern-finder.js', () => {
    describe('Mousetrap', () => {
      before(async () => {
        await browser.setWindowSize(1024, 768);
      });

      it('"ctrl+shift+f" toggles Pattern Finder', async () => {
        const sgNavElements = await $('.sg-nav-elements');
        const sgAccHandle = await sgNavElements.$('.sg-acc-handle');
        const sgAccPanel = await sgNavElements.$('.sg-acc-panel');

        await sgAccHandle.waitForClickable();
        await sgAccHandle.click();

        expect(await sgAccHandle.getAttribute('class')).to.have.string('active');
        expect(await sgAccPanel.getAttribute('class')).to.have.string('active');

        const sgViewport = await $('#sg-viewport');
        const sgFToggle = await $('#sg-f-toggle');
        const sgFind = await $('#sg-find');

        await browser.switchToFrame(sgViewport);
        await browser.keys(['Control', 'Shift', 'f']);
        await browser.switchToParentFrame();

        expect(await sgAccHandle.getAttribute('class')).to.not.have.string('active');
        expect(await sgAccPanel.getAttribute('class')).to.not.have.string('active');
        expect(await sgFToggle.getAttribute('class')).to.have.string('active');
        expect(await sgFind.getAttribute('class')).to.have.string('active');

        await browser.switchToFrame(sgViewport);
        await browser.keys(['Control', 'Shift', 'f']);
        await browser.switchToParentFrame();

        expect(await sgFToggle.getAttribute('class')).to.not.have.string('active');
        expect(await sgFind.getAttribute('class')).to.not.have.string('active');
      });
    });
  });

  describe('pattern-viewport.js', () => {
    describe('click', () => {
      before(async () => {
        await browser.setWindowSize(1024, 768);
      });

      it('bodyClick closes nav panels', async () => {
        const sgNavElements = await $('.sg-nav-elements');
        const sgAccHandle = await sgNavElements.$('.sg-acc-handle');
        const sgAccPanel = await sgNavElements.$('.sg-acc-panel');

        await sgAccHandle.waitForClickable();
        await sgAccHandle.click();

        expect(await sgAccHandle.getAttribute('class')).to.have.string('active');
        expect(await sgAccPanel.getAttribute('class')).to.have.string('active');

        const sgViewport = await $('#sg-viewport');
        const body = await $('body');

        await browser.switchToFrame(sgViewport);
        await body.waitForClickable();
        await body.click();
        await browser.switchToParentFrame();

        expect(await sgAccHandle.getAttribute('class')).to.not.have.string('active');
        expect(await sgAccPanel.getAttribute('class')).to.not.have.string('active');
      });

      it('bodyClick closes size panel', async () => {
        const sgFormLabel = await $('#sg-form-label');

        await sgFormLabel.waitForClickable();
        await sgFormLabel.click();

        expect(await sgFormLabel.getAttribute('class')).to.have.string('active');

        const sgViewport = await $('#sg-viewport');
        const body = await $('body');

        await browser.switchToFrame(sgViewport);
        await body.waitForClickable();
        await body.click();
        await browser.switchToParentFrame();

        expect(await sgFormLabel.getAttribute('class')).to.not.have.string('active');
      });

      it('pattern anchor clicks switch the pattern in the iframe', async () => {
        const sgNavPages = await $('.sg-nav-pages');
        const sgAccHandle = await sgNavPages.$('.sg-acc-handle');
        const sgPop = await sgNavPages.$('.sg-pop');
        const sgRaw = await $('#sg-raw');

        await sgAccHandle.waitForClickable();
        await sgAccHandle.click();
        await sgPop.waitForClickable();
        await sgPop.click();

        expect(await sgRaw.getAttribute('href'))
          .to.equal('patterns/04-pages-00-homepage/04-pages-00-homepage.html');

        const sgViewport = await $('#sg-viewport');

        await browser.switchToFrame(sgViewport);

        const a = await $('a');

        await a.waitForClickable();
        await a.click();
        await browser.switchToParentFrame();

        expect(await sgRaw.getAttribute('href'))
          .to.equal('patterns/02-components-region/02-components-region.html');
      });
    });

    describe('Mousetrap', () => {
      before(async () => {
        await browser.setWindowSize(1024, 768);
      });

      it('"ctrl+alt+w" resizes to whole width', async () => {
        const sgViewport = await $('#sg-viewport');

        await browser.switchToFrame(sgViewport);
        await browser.keys(['Control', 'Alt', 'w']);
        await browser.pause(pauseLg);
        await browser.switchToParentFrame();

        expect((await sgViewport.getSize()).width).to.equal(1024);
      });

      it('"ctrl+alt+r" resizes to a random width', async () => {
        const sgViewport = await $('#sg-viewport');
        const sgViewportWidthBefore = (await sgViewport.getSize()).width;

        await browser.switchToFrame(sgViewport);
        await browser.keys(['Control', 'Alt', 'r']);
        await browser.switchToParentFrame();
        await browser.pause(pauseLg);

        const sgViewportWidthAfter = (await sgViewport.getSize()).width;

        expect(sgViewportWidthBefore).to.not.equal(sgViewportWidthAfter);
        expect(sgViewportWidthAfter).to.be.a('number');
        expect(sgViewportWidthAfter).to.be.at.least(240);
        expect(sgViewportWidthAfter).to.be.below(1300);
      });

      it('"ctrl+alt+g" toggles grow mode on and off', async () => {
        const sgViewport = await $('#sg-viewport');
        const sgViewportWidth0 = (await sgViewport.getSize()).width;

        await browser.switchToFrame(sgViewport);
        await browser.keys(['Control', 'Alt', 'g']);
        await browser.switchToParentFrame();
        await browser.pause(pauseLg);

        const sgViewportWidth1 = (await sgViewport.getSize()).width;

        expect(sgViewportWidth0).to.not.equal(sgViewportWidth1);

        await browser.pause(pauseLg);
        await browser.switchToFrame(sgViewport);
        await browser.keys(['Control', 'Alt', 'g']);
        await browser.switchToParentFrame();

        const sgViewportWidth2 = (await sgViewport.getSize()).width;

        expect(sgViewportWidth1).to.not.equal(sgViewportWidth2);

        await browser.pause(pauseLg);

        const sgViewportWidth3 = (await sgViewport.getSize()).width;

        expect(sgViewportWidth2).to.equal(sgViewportWidth3);
      });

      it('"ctrl+alt+0" resizes to XXSmall', async () => {
        const sgViewport = await $('#sg-viewport');

        await browser.switchToFrame(sgViewport);
        await browser.keys(['Control', 'Alt', '0']);
        await browser.switchToParentFrame();
        await browser.pause(pauseLg);

        expect((await sgViewport.getSize()).width).to.equal(320);
      });

      it('"ctrl+shift+x" resizes to XSmall', async () => {
        const sgViewport = await $('#sg-viewport');

        await browser.switchToFrame(sgViewport);
        await browser.keys(['Control', 'Shift', 'x']);
        await browser.switchToParentFrame();
        await browser.pause(pauseLg);

        expect((await sgViewport.getSize()).width).to.equal(480);
      });

      it('"ctrl+alt+w" resizes to whole width', async () => {
        const sgViewport = await $('#sg-viewport');

        await browser.switchToFrame(sgViewport);
        await browser.keys(['Control', 'Shift', 'w']);
        await browser.switchToParentFrame();
        await browser.pause(pauseLg);

        expect((await sgViewport.getSize()).width).to.equal(1024);
      });

      it('"ctrl+shift+s" resizes to Small', async () => {
        const sgViewport = await $('#sg-viewport');

        await browser.switchToFrame(sgViewport);
        await browser.keys(['Control', 'Shift', 's']);
        await browser.switchToParentFrame();
        await browser.pause(pauseLg);

        expect((await sgViewport.getSize()).width).to.equal(767);
      });

      it('"ctrl+shift+m" resizes to Medium', async () => {
        const sgViewport = await $('#sg-viewport');

        await browser.switchToFrame(sgViewport);
        await browser.keys(['Control', 'Shift', 'm']);
        await browser.switchToParentFrame();
        await browser.pause(pauseLg);

        expect((await sgViewport.getSize()).width).to.equal(1024);
      });

      it('"ctrl+shift+l" resizes to Large', async () => {
        const sgViewport = await $('#sg-viewport');

        await browser.switchToFrame(sgViewport);
        await browser.keys(['Control', 'Shift', 'l']);
        await browser.switchToParentFrame();
        await browser.pause(pauseLg);

        expect((await sgViewport.getSize()).width).to.equal(1280);
      });

      it('"ctrl+shift+d" toggles disco mode on and off', async () => {
        const sgViewport = await $('#sg-viewport');
        const sgViewportWidth0 = (await sgViewport.getSize()).width;

        await browser.switchToFrame(sgViewport);
        await browser.keys(['Control', 'Shift', 'd']);
        await browser.switchToParentFrame();
        await browser.pause(pauseLg);

        const sgViewportWidth1 = (await sgViewport.getSize()).width;

        expect(sgViewportWidth0).to.not.equal(sgViewportWidth1);

        await browser.switchToFrame(sgViewport);
        await browser.keys(['Control', 'Shift', 'd']);
        await browser.switchToParentFrame();
        await browser.pause(pauseLg);

        const sgViewportWidth2 = (await sgViewport.getSize()).width;

        expect(sgViewportWidth1).to.not.equal(sgViewportWidth2);

        await browser.pause(pauseLg);

        const sgViewportWidth3 = (await sgViewport.getSize()).width;

        expect(sgViewportWidth2).to.equal(sgViewportWidth3);
      });

      it('"ctrl+shift+0" resizes to XXSmall', async () => {
        const sgViewport = await $('#sg-viewport');

        await browser.switchToFrame(sgViewport);
        await browser.keys(['Control', 'Shift', '0']);
        await browser.switchToParentFrame();
        await browser.pause(pauseLg);

        expect((await sgViewport.getSize()).width).to.equal(320);
      });
    });
  });
});

