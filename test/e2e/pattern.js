const fs = require('fs');
const mkdirp = require('mkdirp');
const fepperUiDir = 'node_modules/fepper-ui';
const scriptsPatternDir = 'scripts/pattern';
const dhtmlFile = 'html-scraper-dhtml.js';

if (!fs.existsSync(`${fepperUiDir}/${scriptsPatternDir}`)) {
  mkdirp.sync(`${fepperUiDir}/${scriptsPatternDir}`);
}

fs.copyFileSync(`${scriptsPatternDir}/${dhtmlFile}`, `${fepperUiDir}/${scriptsPatternDir}/${dhtmlFile}`);

describe('Pattern end-to-end tests', function () {
  describe('annotations-viewer.js', function () {
    describe('click', function () {
      before(function () {
        browser.setWindowSize(1024, 640);
      });

      it('viewall annotations viewer button toggles annotations viewer', function () {
        $('.sg-pop[data-patternpartial="viewall"]').click();
        browser.switchToFrame($('#sg-viewport'));
        $('#sg-pattern-toggle-annotations-components-region').click();
        browser.pause(700);
        browser.switchToParentFrame();
        expect($('#sg-vp-wrap').getCSSProperty('padding-bottom').value).to.equal('258.5px');
        expect($('#sg-annotations-container').getCSSProperty('bottom').value).to.equal('0px');
        expect($('#sg-annotations').getHTML(false)).to.equal(`<div id="annotation-1">
<h2>1. Navigation</h2>
<div><p>Navigation for responsive web experiences can be tricky. Large navigation menus 
are typical on desktop sites, but mobile screen sizes don't give us the luxury 
of space. We're dealing with this situation by creating a simple menu anchor 
that toggles the main navigation on small screens. Once the screen size is large 
enough to accommodate the nav, we show the main navigation links and hide the 
menu anchor.</p>
</div>
</div>`);
        browser.switchToFrame($('#sg-viewport'));
        $('#sg-pattern-toggle-annotations-components-region').click();
        browser.pause(700);
        browser.switchToParentFrame();
        expect($('#sg-vp-wrap').getCSSProperty('padding-bottom').value).to.equal('0px');
        expect($('#sg-annotations-container').getCSSProperty('bottom').value).to.equal('-258.5px');
      });
    });

    describe('Mousetrap', function () {
      before(function () {
        browser.setWindowSize(1024, 640);
      });

      it('"ctrl+shift+a" toggles annotations viewer', function () {
        browser.switchToFrame($('#sg-viewport'));
        browser.keys(['Control', 'Shift', 'a']);
        browser.pause(700);
        browser.switchToParentFrame();
        expect($('#sg-vp-wrap').getCSSProperty('padding-bottom').value).to.equal('258.5px');
        expect($('#sg-annotations-container').getCSSProperty('bottom').value).to.equal('0px');
        expect($('#sg-annotations').getHTML(false)).to.equal(`<div id="annotation-1">
<h2>1. Navigation</h2>
<div><p>Navigation for responsive web experiences can be tricky. Large navigation menus 
are typical on desktop sites, but mobile screen sizes don't give us the luxury 
of space. We're dealing with this situation by creating a simple menu anchor 
that toggles the main navigation on small screens. Once the screen size is large 
enough to accommodate the nav, we show the main navigation links and hide the 
menu anchor.</p>
</div>
</div>`);
        browser.switchToFrame($('#sg-viewport'));
        browser.keys(['Control', 'Shift', 'a']);
        browser.pause(700);
        browser.switchToParentFrame();
        expect($('#sg-vp-wrap').getCSSProperty('padding-bottom').value).to.equal('0px');
        expect($('#sg-annotations-container').getCSSProperty('bottom').value).to.equal('-258.5px');
      });
    });
  });

  describe('code-viewer.js', function () {
    describe('click', function () {
      before(function () {
        browser.setWindowSize(1024, 640);
      });

      it('viewall code viewer button toggles code viewer', function () {
        $('.sg-pop[data-patternpartial="viewall"]').click();
        browser.switchToFrame($('#sg-viewport'));
        $('#sg-pattern-toggle-code-components-region').click();
        browser.pause(700);
        browser.switchToParentFrame();
        expect($('#sg-vp-wrap').getCSSProperty('padding-bottom').value).to.equal('258.5px');
        expect($('#sg-code-container').getCSSProperty('bottom').value).to.equal('0px');
        expect($('#sg-code-fill').getText()).to.equal('{{> 01-compounds/block }}');
        browser.switchToFrame($('#sg-viewport'));
        $('#sg-pattern-toggle-code-components-region').click();
        browser.pause(700);
        browser.switchToParentFrame();
        expect($('#sg-vp-wrap').getCSSProperty('padding-bottom').value).to.equal('0px');
        expect($('#sg-code-container').getCSSProperty('bottom').value).to.equal('-258.5px');
      });
    });

    describe('Mousetrap', function () {
      before(function () {
        browser.setWindowSize(1024, 640);
      });

      it('"ctrl+shift+c" toggles code viewer', function () {
        browser.switchToFrame($('#sg-viewport'));
        browser.keys(['Control', 'Shift', 'c']);
        browser.pause(700);
        browser.switchToParentFrame();
        expect($('#sg-vp-wrap').getCSSProperty('padding-bottom').value).to.equal('258.5px');
        expect($('#sg-code-container').getCSSProperty('bottom').value).to.equal('0px');
        expect($('#sg-code-fill').getText()).to.equal('{{> 03-templates/page }}');
        browser.switchToFrame($('#sg-viewport'));
        browser.keys(['Control', 'Shift', 'c']);
        browser.pause(700);
        browser.switchToParentFrame();
        expect($('#sg-vp-wrap').getCSSProperty('padding-bottom').value).to.equal('0px');
        expect($('#sg-code-container').getCSSProperty('bottom').value).to.equal('-258.5px');
      });

      it('"ctrl+shift+y" selects the HTML tab in code viewer', function () {
        browser.switchToFrame($('#sg-viewport'));
        browser.keys(['Control', 'Shift', 'c']);
        browser.pause(700);
        browser.switchToParentFrame();
        expect($('#sg-code-title-html').getAttribute('class')).to.not.have.string('sg-code-title-active');
        browser.switchToFrame($('#sg-viewport'));
        browser.keys(['Control', 'Shift', 'y']);
        browser.switchToParentFrame();
        expect($('#sg-code-title-html').getAttribute('class')).to.have.string('sg-code-title-active');
      });

      it('"ctrl+alt+h" selects the HTML tab in code viewer', function () {
        browser.switchToFrame($('#sg-viewport'));
        browser.keys(['Control', 'Shift', 'c']);
        browser.pause(700);
        browser.switchToParentFrame();
        expect($('#sg-code-title-html').getAttribute('class')).to.not.have.string('sg-code-title-active');
        browser.switchToFrame($('#sg-viewport'));
        browser.keys(['Control', 'Alt', 'h']);
        browser.switchToParentFrame();
        expect($('#sg-code-title-html').getAttribute('class')).to.have.string('sg-code-title-active');
      });

      it('"ctrl+shift+u" selects the Mustache tab in code viewer', function () {
        browser.switchToFrame($('#sg-viewport'));
        browser.keys(['Control', 'Shift', 'c']);
        browser.pause(700);
        browser.keys(['Control', 'Shift', 'y']);
        browser.switchToParentFrame();
        expect($('#sg-code-title-mustache').getAttribute('class')).to.not.have.string('sg-code-title-active');
        browser.switchToFrame($('#sg-viewport'));
        browser.keys(['Control', 'Shift', 'u']);
        browser.switchToParentFrame();
        expect($('#sg-code-title-mustache').getAttribute('class')).to.have.string('sg-code-title-active');
      });

      it('"ctrl+alt+h" selects the Mustache tab in code viewer', function () {
        browser.switchToFrame($('#sg-viewport'));
        browser.keys(['Control', 'Shift', 'c']);
        browser.pause(700);
        browser.keys(['Control', 'Alt', 'h']);
        browser.switchToParentFrame();
        expect($('#sg-code-title-mustache').getAttribute('class')).to.not.have.string('sg-code-title-active');
        browser.switchToFrame($('#sg-viewport'));
        browser.keys(['Control', 'Alt', 'm']);
        browser.switchToParentFrame();
        expect($('#sg-code-title-mustache').getAttribute('class')).to.have.string('sg-code-title-active');
      });
    });
  });

  describe('html-scraper-ajax.js', function () {
    before(function () {
      browser.setWindowSize(1024, 640);
    });

    /* eslint-disable max-len */
    it('pre-import submit button posts correctly', function () {
      $('.sg-nav-scrape').$('.sg-acc-handle').click();
      browser.pause(100);
      $('.sg-nav-scrape').$('.sg-pop').click();
      browser.switchToFrame($('#sg-viewport'));
      $('[name="url"]').click();
      $('[name="url"]').setValue('/patterns/04-pages-00-homepage/04-pages-00-homepage.html');
      $('[name="selector"]').click();
      $('[name="selector"]').setValue('p');
      $('[name="url-form"]').click();
      browser.pause(100);
      expect($('html').getHTML(false)).to.equal(`<head>
    <title id="title">Fepper HTML Scraper</title>
    <meta charset="utf-8">
    <!-- Disable cache -->
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">
  </head>
  <body class="text">
    <main id="scraper" class="scraper">
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
      <h3>Otherwise, correct the URL and Target Selector and submit again.</h3><script src="/scripts/pattern/html-scraper-ajax.js"></script>
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
          <button id="hide-button" style="float: right;display: none;">Hide</button>
        </div>
      </form><script src="../../node_modules/fepper-ui/scripts/pattern/html-scraper-dhtml.js"></script><div id="help-text" style="border: 1px solid black;visibility: hidden;margin-top: 5.50px;padding: 0 20px;width: 100%">
        <p></p>
        <p>Use this tool to scrape and import Mustache templates and JSON data files from actual web pages, preferably the actual backend CMS that Fepper is prototyping for. Simply enter the URL of the page you wish to scrape. Then, enter the CSS selector you wish to target (prepended with "#" for IDs and "." for classes). Classnames and tagnames may be appended with array index notation ([n]). Otherwise, the Scraper will scrape all elements of that class or tag sequentially. Such a loosely targeted scrape will save many of the targeted fields to the JSON file, but will only save the first instance of the target to a Mustache template.</p>
  <p>Upon submit, you should be able to review the scraped output on the subsequent page. If the output looks correct, enter a filename and submit again. The Scraper will save Mustache and JSON files by that name in your patterns' scrape directory, also viewable under the Scrape menu of the toolbar. The Scraper will correctly indent the Mustache code. However, the JSON parsing requires a conversion from HTML to XHTML, so don't expect an exact copy of the HTML structure of the source HTML.</p>
      </div></main>
  
</body>`);
    });

    it('import-form submit button posts correctly', function () {
      $('.sg-nav-scrape').$('.sg-acc-handle').click();
      browser.pause(100);
      $('.sg-nav-scrape').$('.sg-pop').click();
      browser.switchToFrame($('#sg-viewport'));
      $('[name="url"]').click();
      $('[name="url"]').setValue('/patterns/04-pages-00-homepage/04-pages-00-homepage.html');
      $('[name="selector"]').click();
      $('[name="selector"]').setValue('p');
      $('[name="url-form"]').click();
      $('[name="filename"]').click();
      $('[name="filename"]').setValue('test');
      $('[name="import-form"]').click();
      browser.pause(100);
      expect($('html').getHTML(false)).to.equal(`<head>
    <title id="title">Fepper HTML Scraper</title>
    <meta charset="utf-8">
    <!-- Disable cache -->
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">
  </head>
  <body class="text">
    <main id="scraper" class="scraper">
      <div id="message" class="message success">Success! Refresh the browser to check that your template appears under the "Scrape" menu.</div>
      <h1 id="scraper-heading" class="scraper-heading">Fepper HTML Scraper</h1><script src="/scripts/pattern/html-scraper-ajax.js"></script>
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
          <button id="hide-button" style="float: right;display: none;">Hide</button>
        </div>
      </form><script src="../../node_modules/fepper-ui/scripts/pattern/html-scraper-dhtml.js"></script><div id="help-text" style="border: 1px solid black;visibility: hidden;margin-top: 5.50px;padding: 0 20px;width: 100%">
        <p></p>
        <p>Use this tool to scrape and import Mustache templates and JSON data files from actual web pages, preferably the actual backend CMS that Fepper is prototyping for. Simply enter the URL of the page you wish to scrape. Then, enter the CSS selector you wish to target (prepended with "#" for IDs and "." for classes). Classnames and tagnames may be appended with array index notation ([n]). Otherwise, the Scraper will scrape all elements of that class or tag sequentially. Such a loosely targeted scrape will save many of the targeted fields to the JSON file, but will only save the first instance of the target to a Mustache template.</p>
  <p>Upon submit, you should be able to review the scraped output on the subsequent page. If the output looks correct, enter a filename and submit again. The Scraper will save Mustache and JSON files by that name in your patterns' scrape directory, also viewable under the Scrape menu of the toolbar. The Scraper will correctly indent the Mustache code. However, the JSON parsing requires a conversion from HTML to XHTML, so don't expect an exact copy of the HTML structure of the source HTML.</p>
      </div></main>
  
</body>`);
    });

    it('post-import targeter submit button posts correctly', function () {
      $('.sg-nav-scrape').$('.sg-acc-handle').click();
      browser.pause(100);
      $('.sg-nav-scrape').$('.sg-pop').click();
      browser.switchToFrame($('#sg-viewport'));
      $('[name="url"]').click();
      $('[name="url"]').setValue('/patterns/04-pages-00-homepage/04-pages-00-homepage.html');
      $('[name="selector"]').click();
      $('[name="selector"]').setValue('p');
      $('[name="url-form"]').click();
      $('#html-scraper-targeter').$('[name="selector"]').setValue('h1');
      $('#html-scraper-targeter').$('[name="url-form"]').click();
      browser.pause(100);
      expect($('html').getHTML(false)).to.equal(`<head>
    <title id="title">Fepper HTML Scraper</title>
    <meta charset="utf-8">
    <!-- Disable cache -->
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">
  </head>
  <body class="text">
    <main id="scraper" class="scraper">
      <div id="message" class="message success">Success! Refresh the browser to check that your template appears under the "Scrape" menu.</div>
      <h1 id="scraper-heading" class="scraper-heading">Fepper HTML Scraper</h1><script src="/scripts/pattern/html-scraper-ajax.js"></script>
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
          <button id="hide-button" style="float: right;display: none;">Hide</button>
        </div>
      </form><script src="../../node_modules/fepper-ui/scripts/pattern/html-scraper-dhtml.js"></script><div id="help-text" style="border: 1px solid black;visibility: hidden;margin-top: 5.50px;padding: 0 20px;width: 100%">
        <p></p>
        <p>Use this tool to scrape and import Mustache templates and JSON data files from actual web pages, preferably the actual backend CMS that Fepper is prototyping for. Simply enter the URL of the page you wish to scrape. Then, enter the CSS selector you wish to target (prepended with "#" for IDs and "." for classes). Classnames and tagnames may be appended with array index notation ([n]). Otherwise, the Scraper will scrape all elements of that class or tag sequentially. Such a loosely targeted scrape will save many of the targeted fields to the JSON file, but will only save the first instance of the target to a Mustache template.</p>
  <p>Upon submit, you should be able to review the scraped output on the subsequent page. If the output looks correct, enter a filename and submit again. The Scraper will save Mustache and JSON files by that name in your patterns' scrape directory, also viewable under the Scrape menu of the toolbar. The Scraper will correctly indent the Mustache code. However, the JSON parsing requires a conversion from HTML to XHTML, so don't expect an exact copy of the HTML structure of the source HTML.</p>
      </div></main>
  
</body>`);
    });
  });

  describe('html-scraper-dhtml.js', function () {
    before(function () {
      browser.setWindowSize(1024, 640);
    });

    it('targeter submit button posts correctly', function () {
      $('.sg-nav-scrape').$('.sg-acc-handle').click();
      browser.pause(100);
      $('.sg-nav-scrape').$('.sg-pop').click();
      browser.switchToFrame($('#sg-viewport'));
      $('[name="url"]').click();
      $('[name="url"]').setValue('/patterns/04-pages-00-homepage/04-pages-00-homepage.html');
      $('[name="selector"]').click();
      $('[name="selector"]').setValue('p');
      $('[name="url-form"]').click();
      browser.pause(100);
      expect($('html').getHTML(false)).to.equal(`<head>
    <title id="title">Fepper HTML Scraper</title>
    <meta charset="utf-8">
    <!-- Disable cache -->
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">
  </head>
  <body class="text">
    <main id="scraper" class="scraper">
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
      <h3>Otherwise, correct the URL and Target Selector and submit again.</h3><script src="/scripts/pattern/html-scraper-ajax.js"></script>
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
          <button id="hide-button" style="float: right;display: none;">Hide</button>
        </div>
      </form><script src="../../node_modules/fepper-ui/scripts/pattern/html-scraper-dhtml.js"></script><div id="help-text" style="border: 1px solid black;visibility: hidden;margin-top: 5.50px;padding: 0 20px;width: 100%">
        <p></p>
        <p>Use this tool to scrape and import Mustache templates and JSON data files from actual web pages, preferably the actual backend CMS that Fepper is prototyping for. Simply enter the URL of the page you wish to scrape. Then, enter the CSS selector you wish to target (prepended with "#" for IDs and "." for classes). Classnames and tagnames may be appended with array index notation ([n]). Otherwise, the Scraper will scrape all elements of that class or tag sequentially. Such a loosely targeted scrape will save many of the targeted fields to the JSON file, but will only save the first instance of the target to a Mustache template.</p>
  <p>Upon submit, you should be able to review the scraped output on the subsequent page. If the output looks correct, enter a filename and submit again. The Scraper will save Mustache and JSON files by that name in your patterns' scrape directory, also viewable under the Scrape menu of the toolbar. The Scraper will correctly indent the Mustache code. However, the JSON parsing requires a conversion from HTML to XHTML, so don't expect an exact copy of the HTML structure of the source HTML.</p>
      </div></main>
  
</body>`);
    });
    /* eslint-enable max-len */

    it('help button shows and hides help text correctly', function () {
      $('.sg-nav-scrape').$('.sg-acc-handle').click();
      browser.pause(100);
      $('.sg-nav-scrape').$('.sg-pop').click();
      browser.switchToFrame($('#sg-viewport'));
      expect($('#help-button').getCSSProperty('display').value).to.equal('block');
      expect($('#help-text').getCSSProperty('visibility').value).to.equal('hidden');
      expect($('#hide-button').getCSSProperty('display').value).to.equal('none');
      $('#help-button').click();
      expect($('#help-button').getCSSProperty('display').value).to.equal('none');
      expect($('#help-text').getCSSProperty('visibility').value).to.equal('visible');
      expect($('#hide-button').getCSSProperty('display').value).to.equal('block');
      $('#hide-button').click();
      browser.pause(100);
      expect($('#help-button').getCSSProperty('display').value).to.equal('block');
      expect($('#help-text').getCSSProperty('visibility').value).to.equal('hidden');
      expect($('#hide-button').getCSSProperty('display').value).to.equal('none');
    });

    it('importer submit button errors on filename with invalid characters', function () {
      // Just testing error case because that is the only client-side JS logic driven by the listener.
      // A success case will request the Express app which will respond independent of client-side JS.
      $('.sg-nav-scrape').$('.sg-acc-handle').click();
      browser.pause(100);
      $('.sg-nav-scrape').$('.sg-pop').click();
      browser.switchToFrame($('#sg-viewport'));
      $('[name="url"]').click();
      $('[name="url"]').setValue('/patterns/04-pages-00-homepage/04-pages-00-homepage.html');
      $('[name="selector"]').click();
      $('[name="selector"]').setValue('p');
      $('[name="url-form"]').click();
      $('[name="import-form"]').click();
      expect($('#message').getAttribute('class')).to.equal('message error');
      expect($('#message').getText()).to.equal('ERROR! Please enter a valid filename.');
    });

    it('importer submit button errors on filename named "00-html-scraper"', function () {
      // Just testing error case because that is the only client-side JS logic driven by the listener.
      // A success case will request the Express app which will respond independent of client-side JS.
      $('.sg-nav-scrape').$('.sg-acc-handle').click();
      browser.pause(100);
      $('.sg-nav-scrape').$('.sg-pop').click();
      browser.switchToFrame($('#sg-viewport'));
      $('[name="url"]').click();
      $('[name="url"]').setValue('/patterns/04-pages-00-homepage/04-pages-00-homepage.html');
      $('[name="selector"]').click();
      $('[name="selector"]').setValue('p');
      $('[name="url-form"]').click();
      $('[name="filename"]').click();
      $('[name="filename"]').setValue('00-html-scraper');
      $('[name="import-form"]').click();
      expect($('#message').getAttribute('class')).to.equal('message error');
      expect($('#message').getText()).to.equal('ERROR! Please enter a valid filename.');
    });
  });

  describe('pattern-finder.js', function () {
    describe('Mousetrap', function () {
      before(function () {
        browser.setWindowSize(1024, 640);
      });

      it('"ctrl+shift+f" toggles Pattern Finder', function () {
        $('.sg-nav-elements').$('.sg-acc-handle').click();
        expect($('.sg-nav-elements').$('.sg-acc-handle').getAttribute('class')).to.have.string('active');
        expect($('.sg-nav-elements').$('.sg-acc-panel').getAttribute('class')).to.have.string('active');
        browser.switchToFrame($('#sg-viewport'));
        browser.keys(['Control', 'Shift', 'f']);
        browser.switchToParentFrame();
        expect($('.sg-nav-elements').$('.sg-acc-handle').getAttribute('class')).to.not.have.string('active');
        expect($('.sg-nav-elements').$('.sg-acc-panel').getAttribute('class')).to.not.have.string('active');
        expect($('#sg-f-toggle').getAttribute('class')).to.have.string('active');
        expect($('#sg-find').getAttribute('class')).to.have.string('active');
        browser.switchToFrame($('#sg-viewport'));
        browser.keys(['Control', 'Shift', 'f']);
        browser.switchToParentFrame();
        expect($('#sg-f-toggle').getAttribute('class')).to.not.have.string('active');
        expect($('#sg-find').getAttribute('class')).to.not.have.string('active');
      });
    });
  });

  describe('patternlab-viewer.js', function () {
    describe('click', function () {
      before(function () {
        browser.setWindowSize(1024, 640);
      });

      it('bodyClick closes nav panels', function () {
        $('.sg-nav-elements').$('.sg-acc-handle').click();
        expect($('.sg-nav-elements').$('.sg-acc-handle').getAttribute('class')).to.have.string('active');
        expect($('.sg-nav-elements').$('.sg-acc-panel').getAttribute('class')).to.have.string('active');
        browser.switchToFrame($('#sg-viewport'));
        $('body').click();
        browser.switchToParentFrame();
        expect($('.sg-nav-elements').$('.sg-acc-handle').getAttribute('class')).to.not.have.string('active');
        expect($('.sg-nav-elements').$('.sg-acc-panel').getAttribute('class')).to.not.have.string('active');
      });

      it('bodyClick closes size panel', function () {
        $('#sg-form-label').click();
        expect($('#sg-form-label').getAttribute('class')).to.have.string('active');
        browser.switchToFrame($('#sg-viewport'));
        $('body').click();
        browser.switchToParentFrame();
        expect($('#sg-form-label').getAttribute('class')).to.not.have.string('active');
      });

      it('pattern anchor clicks switch the pattern in the iframe', function () {
        $('.sg-nav-compounds').$('.sg-acc-handle').click();
        browser.pause(100);
        $('.sg-nav-compounds').$('.sg-pop').click();
        browser.pause(100);
        expect($('#sg-raw').getAttribute('href'))
          .to.equal('http://localhost:8080/patterns/01-compounds-block/01-compounds-block.html');
        browser.switchToFrame($('#sg-viewport'));
        $('a').click();
        browser.pause(100);
        browser.switchToParentFrame();
        expect($('#sg-raw').getAttribute('href'))
          .to.equal('http://localhost:8080/patterns/04-pages-00-homepage/04-pages-00-homepage.html');
      });
    });

    describe('Mousetrap', function () {
      before(function () {
        browser.setWindowSize(1024, 640);
      });

      it('"ctrl+alt+w" resizes to whole width', function () {
        browser.switchToFrame($('#sg-viewport'));
        browser.keys(['Control', 'Alt', 'w']);
        browser.pause(1000);
        browser.switchToParentFrame();
        expect($('#sg-viewport').getSize().width).to.equal(1024);
      });

      it('"ctrl+alt+r" resizes to a random width', function () {
        const sgViewportWidthBefore = $('#sg-viewport').getSize().width;

        browser.switchToFrame($('#sg-viewport'));
        browser.keys(['Control', 'Alt', 'r']);
        browser.switchToParentFrame();
        browser.pause(1000);

        const sgViewportWidthAfter = $('#sg-viewport').getSize().width;

        expect(sgViewportWidthBefore).to.not.equal(sgViewportWidthAfter);
        expect(sgViewportWidthAfter).to.equal($('#sg-viewport').getSize().width);
      });

      it('"ctrl+alt+l" resizes to Large', function () {
        browser.switchToFrame($('#sg-viewport'));
        browser.keys(['Control', 'Alt', 'l']);
        browser.switchToParentFrame();
        browser.pause(1000);
        expect($('#sg-viewport').getSize().width).to.equal(1280);
      });

      it('"ctrl+alt+g" toggles grow mode on and off', function () {
        let sgViewportWidth = $('#sg-viewport').getSize().width;

        browser.switchToFrame($('#sg-viewport'));
        browser.keys(['Control', 'Alt', 'g']);
        browser.switchToParentFrame();
        browser.pause(1000);
        expect(sgViewportWidth).to.not.equal($('#sg-viewport').getSize().width);

        sgViewportWidth = $('#sg-viewport').getSize().width;

        browser.pause(1000);
        expect(sgViewportWidth).to.not.equal($('#sg-viewport').getSize().width);
        browser.switchToFrame($('#sg-viewport'));
        browser.keys(['Control', 'Alt', 'g']);
        browser.switchToParentFrame();

        sgViewportWidth = $('#sg-viewport').getSize().width;

        expect(sgViewportWidth).to.equal($('#sg-viewport').getSize().width);
      });

      it('"ctrl+alt+0" resizes to XXSmall', function () {
        browser.switchToFrame($('#sg-viewport'));
        browser.keys(['Control', 'Alt', '0']);
        browser.switchToParentFrame();
        browser.pause(1000);
        expect($('#sg-viewport').getSize().width).to.equal(320);
      });

      it('"ctrl+shift+x" resizes to XSmall', function () {
        browser.switchToFrame($('#sg-viewport'));
        browser.keys(['Control', 'Shift', 'x']);
        browser.switchToParentFrame();
        browser.pause(1000);
        expect($('#sg-viewport').getSize().width).to.equal(480);
      });

      it('"ctrl+alt+w" resizes to whole width', function () {
        browser.switchToFrame($('#sg-viewport'));
        browser.keys(['Control', 'Shift', 'w']);
        browser.switchToParentFrame();
        browser.pause(1000);
        expect($('#sg-viewport').getSize().width).to.equal(1024);
      });

      it('"ctrl+shift+s" resizes to Small', function () {
        browser.switchToFrame($('#sg-viewport'));
        browser.keys(['Control', 'Shift', 's']);
        browser.switchToParentFrame();
        browser.pause(1000);
        expect($('#sg-viewport').getSize().width).to.equal(767);
      });

      it('"ctrl+shift+m" resizes to Medium', function () {
        browser.switchToFrame($('#sg-viewport'));
        browser.keys(['Control', 'Shift', 'm']);
        browser.switchToParentFrame();
        browser.pause(1000);
        expect($('#sg-viewport').getSize().width).to.equal(1024);
      });

      it('"ctrl+shift+l" resizes to Large', function () {
        browser.switchToFrame($('#sg-viewport'));
        browser.keys(['Control', 'Shift', 'l']);
        browser.switchToParentFrame();
        browser.pause(1000);
        expect($('#sg-viewport').getSize().width).to.equal(1280);
      });

      it('"ctrl+shift+d" toggles disco mode on and off', function () {
        let sgViewportWidth = $('#sg-viewport').getSize().width;

        browser.switchToFrame($('#sg-viewport'));
        browser.keys(['Control', 'Shift', 'd']);
        browser.switchToParentFrame();
        browser.pause(1000);
        expect(sgViewportWidth).to.not.equal($('#sg-viewport').getSize().width);

        sgViewportWidth = $('#sg-viewport').getSize().width;

        browser.pause(1000);
        expect(sgViewportWidth).to.not.equal($('#sg-viewport').getSize().width);
        browser.switchToFrame($('#sg-viewport'));
        browser.keys(['Control', 'Shift', 'd']);
        browser.switchToParentFrame();
        browser.pause(1000);

        sgViewportWidth = $('#sg-viewport').getSize().width;

        expect(sgViewportWidth).to.equal($('#sg-viewport').getSize().width);
      });

      it('"ctrl+shift+0" resizes to XXSmall', function () {
        browser.switchToFrame($('#sg-viewport'));
        browser.keys(['Control', 'Shift', '0']);
        browser.switchToParentFrame();
        browser.pause(1000);
        expect($('#sg-viewport').getSize().width).to.equal(320);
      });
    });
  });
});

