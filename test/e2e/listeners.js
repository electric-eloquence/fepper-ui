describe('Listeners end-to-end tests', function () {
  describe('annotationsViewer', function () {
    describe('click', function () {
      before(function () {
        browser.setWindowSize(1024, 640);
      });

      it('close button closes annotations viewer', function () {
        $('#sg-t-toggle').click();
        browser.pause(100);
        $('#sg-t-annotations').click();
        browser.pause(700);
        expect($('#sg-vp-wrap').getCSSProperty('padding-bottom').value).to.equal('258.5px');
        expect($('#sg-view-container').getCSSProperty('bottom').value).to.equal('0px');
        $('#sg-view-close-btn').click();
        browser.pause(700);
        expect($('#sg-vp-wrap').getCSSProperty('padding-bottom').value).to.equal('0px');
        expect($('#sg-view-container').getCSSProperty('bottom').value).to.equal('-257.5px');
      });
    });

    describe('Mousetrap', function () {
      before(function () {
        browser.setWindowSize(1024, 640);
      });

      it('"ctrl+shift+a" toggles annotations viewer', function () {
        browser.keys(['Control', 'Shift', 'a']);
        browser.pause(700);
        expect($('#sg-vp-wrap').getCSSProperty('padding-bottom').value).to.equal('258.5px');
        expect($('#sg-view-container').getCSSProperty('bottom').value).to.equal('0px');
        expect($('#sg-annotations').getHTML(false)).to.equal(`<div id="annotation-1" class="sg-annotation">
<h2>1. Navigation</h2>
<div><p>Navigation for responsive web experiences can be tricky. Large navigation menus 
are typical on desktop sites, but mobile screen sizes don't give us the luxury 
of space. We're dealing with this situation by creating a simple menu anchor 
that toggles the main navigation on small screens. Once the screen size is large 
enough to accommodate the nav, we show the main navigation links and hide the 
menu anchor.</p>
</div>
</div>`);
        browser.keys(['Control', 'Shift', 'a']);
        browser.pause(700);
        expect($('#sg-vp-wrap').getCSSProperty('padding-bottom').value).to.equal('0px');
        expect($('#sg-view-container').getCSSProperty('bottom').value).to.equal('-257.5px');
      });
    });
  });

  describe('codeViewer', function () {
    describe('click', function () {
      before(function () {
        browser.setWindowSize(1024, 640);
      });

      it('close button closes code viewer', function () {
        $('#sg-t-toggle').click();
        browser.pause(100);
        $('#sg-t-code').click();
        browser.pause(700);
        expect($('#sg-vp-wrap').getCSSProperty('padding-bottom').value).to.equal('258.5px');
        expect($('#sg-view-container').getCSSProperty('bottom').value).to.equal('0px');
        $('#sg-view-close-btn').click();
        browser.pause(700);
        expect($('#sg-vp-wrap').getCSSProperty('padding-bottom').value).to.equal('0px');
        expect($('#sg-view-container').getCSSProperty('bottom').value).to.equal('-257.5px');
      });

      it('HTML button displays HTML code', function () {
        $('#sg-t-toggle').click();
        browser.pause(100);
        $('#sg-t-code').click();
        browser.pause(700);
        expect($('#sg-code-fill').getText()).to.equal('{{> 03-templates/page }}');
        $('#sg-code-title-html').click();
        expect($('#sg-code-fill').getText())
          .to.equal(`<a href="../04-pages-00-homepage/04-pages-00-homepage.html">Home</a>
<p>Fepper Base</p>`);
      });

      it('Mustache button displays Mustache code', function () {
        $('#sg-t-toggle').click();
        browser.pause(100);
        $('#sg-t-code').click();
        browser.pause(700);
        $('#sg-code-title-html').click();
        expect($('#sg-code-fill').getText())
          .to.equal(`<a href="../04-pages-00-homepage/04-pages-00-homepage.html">Home</a>
<p>Fepper Base</p>`);
        $('#sg-code-title-mustache').click();
        expect($('#sg-code-fill').getText()).to.equal('{{> 03-templates/page }}');
      });

      it('Copy path button reads "Copied!" when clicked', function () {
        $('#sg-t-toggle').click();
        browser.pause(100);
        $('#sg-t-code').click();
        browser.pause(700);
        expect($('#sg-code-copy-path').getText())
          .to.equal('Copy path');
        $('#sg-code-copy-path').click();
        browser.pause(100);
        expect($('#sg-code-copy-path').getText())
          .to.equal('Copied!');
      });
    });

    describe('Mousetrap', function () {
      before(function () {
        browser.setWindowSize(1024, 640);
      });

      it('"ctrl+shift+c" toggles code viewer', function () {
        browser.keys(['Control', 'Shift', 'c']);
        browser.pause(700);
        expect($('#sg-vp-wrap').getCSSProperty('padding-bottom').value).to.equal('258.5px');
        expect($('#sg-view-container').getCSSProperty('bottom').value).to.equal('0px');
        expect($('#sg-code-fill').getText()).to.equal('{{> 03-templates/page }}');
        browser.keys(['Control', 'Shift', 'c']);
        browser.pause(700);
        expect($('#sg-vp-wrap').getCSSProperty('padding-bottom').value).to.equal('0px');
        expect($('#sg-view-container').getCSSProperty('bottom').value).to.equal('-257.5px');
      });

      it('"ctrl+shift+y" selects the HTML tab in code viewer', function () {
        browser.keys(['Control', 'Shift', 'c']);
        expect($('#sg-code-title-html').getAttribute('class')).to.not.have.string('sg-code-title-active');
        browser.keys(['Control', 'Shift', 'y']);
        expect($('#sg-code-title-html').getAttribute('class')).to.have.string('sg-code-title-active');
      });

      it('"ctrl+alt+h" selects the HTML tab in code viewer', function () {
        browser.keys(['Control', 'Shift', 'c']);
        browser.pause(700);
        expect($('#sg-code-title-html').getAttribute('class')).to.not.have.string('sg-code-title-active');
        browser.keys(['Control', 'Alt', 'h']);
        expect($('#sg-code-title-html').getAttribute('class')).to.have.string('sg-code-title-active');
      });

      it('"ctrl+shift+u" selects the Mustache tab in code viewer', function () {
        browser.keys(['Control', 'Shift', 'c']);
        browser.pause(700);
        browser.keys(['Control', 'Shift', 'y']);
        expect($('#sg-code-title-mustache').getAttribute('class')).to.not.have.string('sg-code-title-active');
        browser.keys(['Control', 'Shift', 'u']);
        expect($('#sg-code-title-mustache').getAttribute('class')).to.have.string('sg-code-title-active');
      });

      it('"ctrl+alt+h" selects the Mustache tab in code viewer', function () {
        browser.keys(['Control', 'Shift', 'c']);
        browser.pause(700);
        browser.keys(['Control', 'Alt', 'h']);
        expect($('#sg-code-title-mustache').getAttribute('class')).to.not.have.string('sg-code-title-active');
        browser.keys(['Control', 'Alt', 'm']);
        expect($('#sg-code-title-mustache').getAttribute('class')).to.have.string('sg-code-title-active');
      });
    });
  });

  describe('mustacheBrowser', function () {
    describe('mouseenter', function () {
      before(function () {
        browser.setWindowSize(1024, 640);
      });

      it('reveals link to Mustache browser when hovering over Mustache code in code viewer', function () {
        $('#sg-t-toggle').click();
        browser.pause(100);
        $('#sg-t-code').click();
        browser.pause(700);
        expect($('#sg-code-fill').getCSSProperty('cursor').value).to.equal('auto');
        $('#sg-code-fill').moveTo(10, 10);
        expect($('#sg-code-fill').getCSSProperty('cursor').value).to.equal('pointer');
      });

      it('shows default cursor when hovering over HTML code in code viewer', function () {
        $('#sg-t-toggle').click();
        browser.pause(100);
        $('#sg-t-code').click();
        browser.pause(700);
        $('#sg-code-title-html').click();
        expect($('#sg-code-fill').getCSSProperty('cursor').value).to.equal('auto');
        $('#sg-code-fill').moveTo(10, 10);
        // Was "default" for WebdriverIO 5. Is "auto" for WebdriverIO 6.
        expect($('#sg-code-fill').getCSSProperty('cursor').value).to.equal('auto');
      });
    });

    describe('click', function () {
      before(function () {
        browser.setWindowSize(1024, 640);
      });

      it('redirects to Mustache browser when clicking on Mustache code in code viewer', function () {
        $('#sg-t-toggle').click();
        browser.pause(100);
        $('#sg-t-code').click();
        browser.pause(700);
        $('#sg-code-fill').click();
        browser.switchToFrame($('#sg-viewport'));
        expect($('main').getAttribute('id')).to.equal('mustache-browser');
        browser.switchToParentFrame();
      });

      it('closes code viewer when clicking on Mustache code in code viewer', function () {
        $('#sg-t-toggle').click();
        browser.pause(100);
        $('#sg-t-code').click();
        browser.pause(700);
        $('#sg-code-fill').click();
        browser.pause(700);
        expect($('#sg-view-container').getCSSProperty('bottom').value).to.equal('-257.5px');
      });

      it('does nothing when clicking on HTML code in code viewer', function () {
        $('#sg-t-toggle').click();
        browser.pause(100);
        $('#sg-t-code').click();
        browser.pause(700);
        $('#sg-code-title-html').click();
        $('#sg-code-fill').click();
        browser.pause(700);
        browser.switchToFrame($('#sg-viewport'));
        expect($('main').error.error).to.equal('no such element');
        browser.switchToParentFrame();
        expect($('#sg-code-container').getCSSProperty('bottom').value).to.equal('0px');
      });
    });
  });

  describe('patternFinder', function () {
    describe('Mousetrap', function () {
      before(function () {
        browser.setWindowSize(1024, 640);
      });

      it('"ctrl+shift+f" toggles patternFinder', function () {
        $('.sg-nav-elements').$('.sg-acc-handle').click();
        expect($('.sg-nav-elements').$('.sg-acc-handle').getAttribute('class')).to.have.string('active');
        expect($('.sg-nav-elements').$('.sg-acc-panel').getAttribute('class')).to.have.string('active');
        browser.keys(['Control', 'Shift', 'f']);
        expect($('.sg-nav-elements').$('.sg-acc-handle').getAttribute('class')).to.not.have.string('active');
        expect($('.sg-nav-elements').$('.sg-acc-panel').getAttribute('class')).to.not.have.string('active');
        expect($('#sg-f-toggle').getAttribute('class')).to.have.string('active');
        expect($('#sg-find').getAttribute('class')).to.have.string('active');
        browser.keys(['Control', 'Shift', 'f']);
        expect($('#sg-f-toggle').getAttribute('class')).to.not.have.string('active');
        expect($('#sg-find').getAttribute('class')).to.not.have.string('active');
      });

      it('"ctrl+shift+f" closes patternFinder while focus is outside patternFinder', function () {
        $('#sg-f-toggle').click();
        expect($('#sg-f-toggle').getAttribute('class')).to.have.string('active');
        expect($('#sg-find').getAttribute('class')).to.have.string('active');
        browser.keys('Tab');
        browser.keys(['Control', 'Shift', 'f']);
        expect($('#sg-f-toggle').getAttribute('class')).to.not.have.string('active');
        expect($('#sg-find').getAttribute('class')).to.not.have.string('active');
      });

      it('"esc" closes patternFinder while focus is inside patternFinder', function () {
        browser.keys(['Control', 'Shift', 'f']);
        expect($('#sg-f-toggle').getAttribute('class')).to.have.string('active');
        expect($('#sg-find').getAttribute('class')).to.have.string('active');
        browser.keys(['Escape']);
        expect($('#sg-f-toggle').getAttribute('class')).to.not.have.string('active');
        expect($('#sg-find').getAttribute('class')).to.not.have.string('active');
      });

      it('"esc" closes patternFinder while focus is outside patternFinder', function () {
        $('#sg-f-toggle').click();
        expect($('#sg-f-toggle').getAttribute('class')).to.have.string('active');
        expect($('#sg-find').getAttribute('class')).to.have.string('active');
        browser.keys('Tab');
        browser.keys(['Escape']);
        expect($('#sg-f-toggle').getAttribute('class')).to.not.have.string('active');
        expect($('#sg-find').getAttribute('class')).to.not.have.string('active');
      });
    });
  });

  describe('patternViewport', function () {
    describe('window.resize', function () {
      before(function () {
        browser.setWindowSize(1200, 640);
      });

      it('updates viewport width when in whole mode', function () {
        $('#sg-size-w').click();
        browser.pause(100);
        expect($('#sg-viewport').getSize().width).to.equal(1200);
        browser.setWindowSize(1300, 768);
        browser.pause(100);
        expect($('#sg-viewport').getSize().width).to.equal(1300);
      });
    });

    describe('.sg-pop click', function () {
      before(function () {
        browser.setWindowSize(1300, 640);
      });

      it('loads pattern', function () {
        $('.sg-nav-elements').$('.sg-acc-handle').click();
        browser.pause(100);
        $('.sg-nav-elements').$('.sg-pop').click();
        browser.pause(100);
        expect($('#sg-raw').getAttribute('href'))
          .to.equal('http://localhost:8080/patterns/00-elements-anchor/00-elements-anchor.html');
      });

      it('closes open nav menu', function () {
        $('.sg-nav-compounds').$('.sg-acc-handle').click();
        expect($('.sg-nav-compounds').$('.sg-acc-handle').getAttribute('class')).to.have.string('active');
        expect($('.sg-nav-compounds').$('.sg-acc-panel').getAttribute('class')).to.have.string('active');
        browser.pause(100);
        $('.sg-nav-compounds').$('.sg-pop').click();
        expect($('.sg-nav-compounds').$('.sg-acc-handle').getAttribute('class')).to.not.have.string('active');
        expect($('.sg-nav-compounds').$('.sg-acc-panel').getAttribute('class')).to.not.have.string('active');
      });
    });

    describe('viewport resizer buttons', function () {
      before(function () {
        browser.setWindowSize(1300, 640);
      });

      it('LG button resizes to Large', function () {
        $('#sg-size-lg').click();
        browser.pause(1000);
        expect($('#sg-viewport').getSize().width).to.equal(1280);
      });

      it('MD button resizes to Medium', function () {
        $('#sg-size-md').click();
        browser.pause(1000);
        expect($('#sg-viewport').getSize().width).to.equal(1024);
      });

      it('SM button resizes to Small', function () {
        $('#sg-size-sm').click();
        browser.pause(1000);
        expect($('#sg-viewport').getSize().width).to.equal(767);
      });

      it('XS button resizes to XSmall', function () {
        $('#sg-size-xs').click();
        browser.pause(1000);
        expect($('#sg-viewport').getSize().width).to.equal(480);
      });

      it('XX button resizes to XXSmall', function () {
        $('#sg-size-xx').click();
        browser.pause(1000);
        expect($('#sg-viewport').getSize().width).to.equal(320);
      });
    });

    // Test the viewport sizes in reverse to reduce the distance shrinking from 1300 in the previous tests.
    describe('Mousetrap', function () {
      before(function () {
        browser.setWindowSize(1300, 640);
      });

      it('"ctrl+shift+l" resizes to Large', function () {
        browser.keys(['Control', 'Shift', 'l']);
        browser.pause(1000);
        expect($('#sg-viewport').getSize().width).to.equal(1280);
      });

      it('"ctrl+shift+m" resizes to Medium', function () {
        browser.keys(['Control', 'Shift', 'm']);
        browser.pause(1000);
        expect($('#sg-viewport').getSize().width).to.equal(1024);
      });

      it('"ctrl+shift+s" resizes to Small', function () {
        browser.keys(['Control', 'Shift', 's']);
        browser.pause(1000);
        expect($('#sg-viewport').getSize().width).to.equal(767);
      });

      it('"ctrl+alt+0" resizes to XXSmall', function () {
        browser.keys(['Control', 'Alt', '0']);
        browser.pause(1000);
        expect($('#sg-viewport').getSize().width).to.equal(320);
      });

      it('"ctrl+shift+x" resizes to XSmall', function () {
        browser.keys(['Control', 'Shift', 'x']);
        browser.pause(1000);
        expect($('#sg-viewport').getSize().width).to.equal(480);
      });

      it('"ctrl+shift+0" resizes to XXSmall', function () {
        browser.keys(['Control', 'Shift', '0']);
        browser.pause(1000);
        expect($('#sg-viewport').getSize().width).to.equal(320);
      });

      it('"ctrl+alt+r" resizes to a random width', function () {
        const sgViewportWidthBefore = $('#sg-viewport').getSize().width;

        browser.keys(['Control', 'Alt', 'r']);
        browser.pause(1000);

        const sgViewportWidthAfter = $('#sg-viewport').getSize().width;

        expect(sgViewportWidthBefore).to.not.equal(sgViewportWidthAfter);
        expect(sgViewportWidthAfter).to.equal($('#sg-viewport').getSize().width);
      });

      it('"ctrl+alt+w" resizes to whole width', function () {
        browser.keys(['Control', 'Alt', 'w']);
        browser.pause(1000);
        expect($('#sg-viewport').getSize().width).to.equal(1300);
      });

      it('"ctrl+shift+d" toggles disco mode on and off', function () {
        let sgViewportWidth = $('#sg-viewport').getSize().width;

        browser.keys(['Control', 'Shift', 'd']);
        browser.pause(1000);
        expect(sgViewportWidth).to.not.equal($('#sg-viewport').getSize().width);

        sgViewportWidth = $('#sg-viewport').getSize().width;

        browser.pause(1000);
        expect(sgViewportWidth).to.not.equal($('#sg-viewport').getSize().width);
        browser.keys(['Control', 'Shift', 'd']);
        browser.pause(1000);

        sgViewportWidth = $('#sg-viewport').getSize().width;

        expect(sgViewportWidth).to.equal($('#sg-viewport').getSize().width);
      });

      it('"ctrl+shift+w" resizes to whole width', function () {
        browser.keys(['Control', 'Shift', 'w']);
        browser.pause(1000);
        expect($('#sg-viewport').getSize().width).to.equal(1300);
      });

      it('"ctrl+alt+g" toggles grow mode on and off', function () {
        let sgViewportWidth = $('#sg-viewport').getSize().width;

        browser.keys(['Control', 'Alt', 'g']);
        browser.pause(1000);
        expect(sgViewportWidth).to.not.equal($('#sg-viewport').getSize().width);

        sgViewportWidth = $('#sg-viewport').getSize().width;

        browser.pause(1000);
        expect(sgViewportWidth).to.not.equal($('#sg-viewport').getSize().width);
        browser.keys(['Control', 'Alt', 'g']);

        sgViewportWidth = $('#sg-viewport').getSize().width;

        expect(sgViewportWidth).to.equal($('#sg-viewport').getSize().width);
      });
    });
  });

  describe('urlHandler', function () {
    before(function () {
      browser.setWindowSize(1024, 640);
    });

    it('handles history correctly for back and forward buttons', function () {
      $('.sg-nav-elements').$('.sg-acc-handle').click();
      browser.pause(100);
      $('.sg-nav-elements').$('.sg-pop').click();
      $('.sg-nav-compounds').$('.sg-acc-handle').click();
      browser.pause(100);
      $('.sg-nav-compounds').$('.sg-pop').click();
      $('.sg-nav-components').$('.sg-acc-handle').click();
      browser.pause(100);
      $('.sg-nav-components').$('.sg-pop').click();
      browser.pause(100);
      browser.back();
      expect($('#sg-raw').getAttribute('href'))
        .to.equal('http://localhost:8080/patterns/01-compounds-block/01-compounds-block.html');
      browser.back();
      expect($('#sg-raw').getAttribute('href'))
        .to.equal('http://localhost:8080/patterns/00-elements-anchor/00-elements-anchor.html');
      browser.forward();
      expect($('#sg-raw').getAttribute('href'))
        .to.equal('http://localhost:8080/patterns/01-compounds-block/01-compounds-block.html');
      browser.forward();
      expect($('#sg-raw').getAttribute('href'))
        .to.equal('http://localhost:8080/patterns/02-components-region/02-components-region.html');
    });
  });
});
