describe('UI compilation of index page js', function () {
  describe('html/01-body/20-header/30-sg-nav-container/div.js', function () {
    describe('.sg-acc-handle', function () {
      it('click, smaller viewport', function () {
        browser.setWindowSize(700, 768);
        $('.sg-nav-toggle').click();
        expect($('#sg-nav-target').getAttribute('class')).to.have.string('active');
        expect($('.sg-acc-handle').getAttribute('class')).to.not.have.string('active');
        expect($('.sg-acc-panel').getAttribute('class')).to.not.have.string('active');
        browser.pause(100);
        $('.sg-acc-handle').click();
        expect($('.sg-acc-handle').getAttribute('class')).to.have.string('active');
        expect($('.sg-acc-panel').getAttribute('class')).to.have.string('active');
      });

      it('click, larger viewport', function () {
        browser.setWindowSize(1024, 768);
        expect($('.sg-acc-handle').getAttribute('class')).to.not.have.string('active');
        expect($('.sg-acc-panel').getAttribute('class')).to.not.have.string('active');
        $('.sg-acc-handle').click();
        expect($('.sg-acc-handle').getAttribute('class')).to.have.string('active');
        expect($('.sg-acc-panel').getAttribute('class')).to.have.string('active');
      });
    });
  });

  describe('html/01-body/20-header/30-sg-nav-container/30-sg-nav-toggle/a.js', function () {
    describe('.sg-nav-toggle', function () {
      before(function () {
        browser.setWindowSize(700, 768);
      });

      it('click', function () {
        expect($('#sg-nav-target').getAttribute('class')).to.not.have.string('active');
        $('.sg-nav-toggle').click();
        expect($('#sg-nav-target').getAttribute('class')).to.have.string('active');
      });

      it('click again', function () {
        $('.sg-nav-toggle').click();
        expect($('#sg-nav-target').getAttribute('class')).to.have.string('active');
        $('.sg-nav-toggle').click();
        expect($('#sg-nav-target').getAttribute('class')).to.not.have.string('active');
      });
    });
  });

  describe('html/01-body/20-header/60-sg-controls/20-sg-size/li.js', function () {
    describe('#sg-form-label', function () {
      it('does not toggle .sg-size when the window width is too small', function () {
        browser.setWindowSize(767, 768);
        $('#sg-form-label').click();
        expect($('.sg-size').getAttribute('class')).to.not.have.string('active');
      });

      it('toggles .sg-size when the window width is just right', function () {
        browser.setWindowSize(768, 768);
        $('#sg-form-label').click();
        expect($('.sg-size').getAttribute('class')).to.have.string('active');
        $('#sg-form-label').click();
        expect($('.sg-size').getAttribute('class')).to.not.have.string('active');
      });

      it('does not toggle .sg-size when the window width is too large', function () {
        browser.setWindowSize(1025, 768);
        $('#sg-form-label').click();
        expect($('.sg-size').getAttribute('class')).to.not.have.string('active');
      });

      it('toggles off .sg-size when the window is resized from just right to too small', function () {
        browser.setWindowSize(768, 768);
        $('#sg-form-label').click();
        expect($('.sg-size').getAttribute('class')).to.have.string('active');
        browser.setWindowSize(767, 768);
        expect($('.sg-size').getAttribute('class')).to.not.have.string('active');
      });

      it('toggles off .sg-size when the window is resized from just right to too large', function () {
        browser.setWindowSize(768, 768);
        $('#sg-form-label').click();
        expect($('.sg-size').getAttribute('class')).to.have.string('active');
        browser.setWindowSize(1025, 768);
        browser.pause(100);
        expect($('.sg-size').getAttribute('class')).to.not.have.string('active');
      });
    });

    describe('#sg-size-px', function () {
      before(function () {
        browser.setWindowSize(1025, 640);
      });

      it('decreases px size on ArrowDown keydown', function () {
        $('#sg-size-px').click();
        expect($('#sg-viewport').getSize().width).to.equal(1025);
        browser.keys(['ArrowDown']);
        expect($('#sg-viewport').getSize().width).to.equal(1024);
      });

      it('resizes to a keyed and entered px size', function () {
        const sgSizePx = $('#sg-size-px');

        sgSizePx.click();
        sgSizePx.doubleClick();
        browser.elementSendKeys(sgSizePx.elementId, '1023\uE007');
        browser.pause(500);
        expect($('#sg-viewport').getSize().width).to.equal(1023);
      });

      it('increases px size on ArrowUp keydown', function () {
        $('#sg-size-px').click();
        expect($('#sg-viewport').getSize().width).to.equal(1023);
        browser.keys(['ArrowUp']);
        expect($('#sg-viewport').getSize().width).to.equal(1024);
      });
    });

    describe('#sg-size-em', function () {
      before(function () {
        browser.setWindowSize(1024, 640);
      });

      it('increases em size on ArrowDown keydown', function () {
        $('#sg-size-em').click();
        expect($('#sg-viewport').getSize().width).to.equal(1024);
        browser.keys(['ArrowUp']);
        expect($('#sg-viewport').getSize().width).to.equal(1040);
      });

      it('resizes to a keyed and entered em size', function () {
        const sgSizeEm = $('#sg-size-em');

        sgSizeEm.click();
        sgSizeEm.doubleClick();
        browser.elementSendKeys(sgSizeEm.elementId, '64.00\uE007');
        browser.pause(700);
        expect($('#sg-viewport').getSize().width).to.equal(1024);
      });

      it('decreases em size on ArrowDown keydown', function () {
        $('#sg-size-em').click();
        expect($('#sg-viewport').getSize().width).to.equal(1024);
        browser.keys(['ArrowDown']);
        expect($('#sg-viewport').getSize().width).to.equal(1008);
      });
    });

    describe('#sg-size-w', function () {
      before(function () {
        browser.setWindowSize(1025, 640);
      });

      it('resizes to whole width', function () {
        $('#sg-size-w').click();
        browser.pause(700);
        expect($('#sg-viewport').getSize().width).to.equal(1025);
      });
    });

    describe('#sg-size-random', function () {
      before(function () {
        browser.setWindowSize(1025, 640);
      });

      it('resizes to whole width', function () {
        const sgViewportWidthBefore = $('#sg-viewport').getSize().width;

        $('#sg-size-random').click();
        browser.pause(1000);

        const sgViewportWidthAfter = $('#sg-viewport').getSize().width;

        expect(sgViewportWidthBefore).to.not.equal(sgViewportWidthAfter);
        expect(sgViewportWidthAfter).to.equal($('#sg-viewport').getSize().width);
      });
    });

    describe('#sg-size-disco', function () {
      before(function () {
        browser.setWindowSize(1025, 640);
      });

      it('toggles disco mode on and off', function () {
        let sgViewportWidth = $('#sg-viewport').getSize().width;

        $('#sg-size-disco').click();
        browser.pause(1000);
        expect(sgViewportWidth).to.not.equal($('#sg-viewport').getSize().width);

        sgViewportWidth = $('#sg-viewport').getSize().width;

        browser.pause(1000);
        expect(sgViewportWidth).to.not.equal($('#sg-viewport').getSize().width);
        $('#sg-size-disco').click();
        browser.pause(1000);

        sgViewportWidth = $('#sg-viewport').getSize().width;

        expect(sgViewportWidth).to.equal($('#sg-viewport').getSize().width);
      });
    });

    describe('#sg-size-grow', function () {
      before(function () {
        browser.setWindowSize(1025, 640);
      });

      it('toggles grow mode on and off', function () {
        let sgViewportWidth = $('#sg-viewport').getSize().width;

        $('#sg-size-grow').click();
        browser.pause(1000);
        expect(sgViewportWidth).to.not.equal($('#sg-viewport').getSize().width);

        sgViewportWidth = $('#sg-viewport').getSize().width;

        browser.pause(1000);
        expect(sgViewportWidth).to.not.equal($('#sg-viewport').getSize().width);
        $('#sg-size-grow').click();

        sgViewportWidth = $('#sg-viewport').getSize().width;

        expect(sgViewportWidth).to.equal($('#sg-viewport').getSize().width);
      });
    });
  });

  describe('html/01-body/20-header/60-sg-controls/40-sg-find/li.js', function () {
    describe('#sg-f-toggle', function () {
      before(function () {
        browser.setWindowSize(1024, 640);
      });

      it('mouseenter', function () {
        $('#sg-f-toggle').moveTo();
        expect($('#sg-f-toggle').getAttribute('class')).to.have.string('mouseentered');
      });

      it('mouseleave', function () {
        $('.sg-nav-toggle').moveTo();
        expect($('#sg-f-toggle').getAttribute('class')).to.not.have.string('mouseentered');
      });

      it('click, smaller viewport', function () {
        browser.setWindowSize(700, 768);
        // Test that clicking this toggle closes previous toggle.
        // First toggle previous to active.
        $('.sg-nav-toggle').click();
        expect($('#sg-nav-target').getAttribute('class')).to.have.string('active');
        // Next click #sg-f-toggle and test that it toggled previous to inactive.
        $('#sg-f-toggle').click();
        expect($('#sg-nav-target').getAttribute('class')).to.not.have.string('active');
        // Test that its own attributes have been updated.
        expect($('#sg-f-toggle').getAttribute('class')).to.have.string('active');
        expect($('#sg-find').getAttribute('class')).to.have.string('active');
        $('#sg-f-toggle').click();
        expect($('#sg-f-toggle').getAttribute('class')).to.not.have.string('active');
        expect($('#sg-find').getAttribute('class')).to.not.have.string('active');
      });

      it('click, larger viewport', function () {
        browser.setWindowSize(1024, 768);
        // Test that clicking this toggle closes previous toggle.
        // First toggle previous to active.
        $('.sg-acc-handle').click();
        expect($('.sg-acc-handle').getAttribute('class')).to.have.string('active');
        expect($('.sg-acc-panel').getAttribute('class')).to.have.string('active');
        // Next click #sg-f-toggle and test that it toggled previous to inactive.
        $('#sg-f-toggle').click();
        expect($('.sg-acc-handle').getAttribute('class')).to.not.have.string('active');
        expect($('.sg-acc-panel').getAttribute('class')).to.not.have.string('active');
        // Test that its own attributes have been updated.
        expect($('#sg-f-toggle').getAttribute('class')).to.have.string('active');
        expect($('#sg-find').getAttribute('class')).to.have.string('active');
        $('#sg-f-toggle').click();
        expect($('#sg-f-toggle').getAttribute('class')).to.not.have.string('active');
        expect($('#sg-find').getAttribute('class')).to.not.have.string('active');
      });
    });

    describe('#typeahead', function () {
      before(function () {
        browser.setWindowSize(1024, 640);
      });

      it('blur', function () {
        $('#sg-f-toggle').click();
        expect($('#sg-f-toggle').getAttribute('class')).to.have.string('active');
        expect($('#sg-find').getAttribute('class')).to.have.string('active');
        expect($(() => document.activeElement).getAttribute('id')).to.equal('typeahead');
        $('#sg-size-px').click();
        expect($('#sg-f-toggle').getAttribute('class')).to.not.have.string('active');
        expect($('#sg-find').getAttribute('class')).to.not.have.string('active');
        expect($(() => document.activeElement).getAttribute('id')).to.not.equal('typeahead');
      });

      it('select blurs #typeahead, closes patternFinder, and sets iframe', function () {
        $('#sg-f-toggle').click();
        browser.pause(100);
        $('#typeahead').setValue('elements');
        $('.tt-dataset-0').$('.tt-suggestion').click();
        expect($('#sg-f-toggle').getAttribute('class')).to.not.have.string('active');
        expect($('#sg-find').getAttribute('class')).to.not.have.string('active');
        expect($(() => document.activeElement).getAttribute('id')).to.not.equal('typeahead');
        expect($('#sg-raw').getAttribute('href'))
          .to.equal('http://localhost:8080/patterns/00-elements-anchor/00-elements-anchor.html');
      });

      it('autocomplete blurs #typeahead, closes patternFinder, and sets iframe', function () {
        $('#sg-f-toggle').click();
        browser.pause(100);
        $('#typeahead').setValue('pages');
        browser.pause(100);
        browser.keys(['Tab']);
        expect($('#sg-f-toggle').getAttribute('class')).to.not.have.string('active');
        expect($('#sg-find').getAttribute('class')).to.not.have.string('active');
        expect($(() => document.activeElement).getAttribute('id')).to.not.equal('typeahead');
        expect($('#sg-raw').getAttribute('href'))
          .to.equal('http://localhost:8080/patterns/04-pages-00-homepage/04-pages-00-homepage.html');
      });
    });
  });

  describe('html/01-body/20-header/60-sg-controls/60-sg-view/li.js', function () {
    describe('#sg-t-annotations', function () {
      before(function () {
        browser.setWindowSize(1024, 640);
      });

      it('click toggles annotations viewer', function () {
        $('#sg-t-toggle').click();
        browser.pause(100);
        // Open code viewer first to make sure it gets closed.
        $('#sg-t-code').click();
        browser.pause(700);
        $('#sg-t-toggle').click();
        browser.pause(100);
        $('#sg-t-annotations').click();
        browser.pause(700);
        expect($('#sg-t-code').getAttribute('class')).to.not.have.string('active');
        expect($('#sg-vp-wrap').getCSSProperty('padding-bottom').value).to.equal('258.5px');
        expect($('#sg-code-container').getCSSProperty('bottom').value).to.equal('-258.5px');
        expect($('#sg-t-annotations').getAttribute('class')).to.have.string('active');
        expect($('#sg-annotations-container').getCSSProperty('bottom').value).to.equal('0px');
        expect($('#sg-view').getAttribute('class')).to.not.have.string('active');
        expect($('#sg-t-toggle').getAttribute('class')).to.not.have.string('active');
        $('#sg-t-toggle').click();
        browser.pause(100);
        $('#sg-t-annotations').click();
        browser.pause(700);
        expect($('#sg-vp-wrap').getCSSProperty('padding-bottom').value).to.equal('0px');
        expect($('#sg-annotations-container').getCSSProperty('bottom').value).to.equal('-258.5px');
        expect($('#sg-t-annotations').getAttribute('class')).to.not.have.string('active');
        expect($('#sg-view').getAttribute('class')).to.not.have.string('active');
        expect($('#sg-t-toggle').getAttribute('class')).to.not.have.string('active');
      });
    });

    describe('#sg-t-code', function () {
      before(function () {
        browser.setWindowSize(1024, 640);
      });

      it('click toggles code viewer', function () {
        $('#sg-t-toggle').click();
        browser.pause(100);
        // Open annotations viewer first to make sure it gets closed.
        $('#sg-t-annotations').click();
        browser.pause(700);
        $('#sg-t-toggle').click();
        browser.pause(100);
        $('#sg-t-code').click();
        browser.pause(700);
        expect($('#sg-t-annotations').getAttribute('class')).to.not.have.string('active');
        expect($('#sg-vp-wrap').getCSSProperty('padding-bottom').value).to.equal('258.5px');
        expect($('#sg-annotations-container').getCSSProperty('bottom').value).to.equal('-258.5px');
        expect($('#sg-t-code').getAttribute('class')).to.have.string('active');
        expect($('#sg-code-container').getCSSProperty('bottom').value).to.equal('0px');
        expect($('#sg-view').getAttribute('class')).to.not.have.string('active');
        expect($('#sg-t-toggle').getAttribute('class')).to.not.have.string('active');
        $('#sg-t-toggle').click();
        browser.pause(100);
        $('#sg-t-code').click();
        browser.pause(700);
        expect($('#sg-vp-wrap').getCSSProperty('padding-bottom').value).to.equal('0px');
        expect($('#sg-code-container').getCSSProperty('bottom').value).to.equal('-258.5px');
        expect($('#sg-t-code').getAttribute('class')).to.not.have.string('active');
        expect($('#sg-view').getAttribute('class')).to.not.have.string('active');
        expect($('#sg-t-toggle').getAttribute('class')).to.not.have.string('active');
      });
    });

    describe('#sg-raw', function () {
      before(function () {
        browser.setWindowSize(1024, 640);
      });

      it('pattern opens in new tab and menu closes', function () {
        $('#sg-t-toggle').click();
        browser.pause(100);
        $('#sg-raw').click();

        const windowHandles = browser.getWindowHandles();

        browser.switchToWindow(windowHandles[1]);
        expect(browser.getUrl())
          .to.equal('http://localhost:8080/patterns/04-pages-00-homepage/04-pages-00-homepage.html');
        browser.closeWindow();
        browser.switchToWindow(windowHandles[0]);
        expect($('#sg-view').getAttribute('class')).to.not.have.string('active');
        expect($('#sg-t-toggle').getAttribute('class')).to.not.have.string('active');
      });
    });
  });

  describe('ui/core/styleguide/index//html/01-body/20-header/60-sg-controls/80-sg-tools/li.js', function () {
    describe('.sg-tool', function () {
      before(function () {
        browser.setWindowSize(1024, 640);
      });

      it('Fepper Docs opens in new tab and menu closes', function () {
        $('#sg-tools-toggle').click();
        browser.pause(100);
        $$('.sg-tool')[0].click();

        const windowHandles = browser.getWindowHandles();

        browser.switchToWindow(windowHandles[1]);
        expect(browser.getUrl()).to.equal('http://localhost:8080/readme');
        browser.closeWindow();
        browser.switchToWindow(windowHandles[0]);
        expect($('#sg-tools').getAttribute('class')).to.not.have.string('active');
        expect($('#sg-tools-toggle').getAttribute('class')).to.not.have.string('active');
      });

      // Skip clicking Pattern Lab Docs to avoid hitting their website during automated tests.

      it('Keyboard Shortcuts opens in new tab and menu closes', function () {
        $('#sg-tools-toggle').click();
        browser.pause(100);
        $$('.sg-tool')[2].click();

        const windowHandles = browser.getWindowHandles();

        browser.switchToWindow(windowHandles[1]);
        expect(browser.getUrl()).to.equal('http://localhost:8080/readme#keyboard-shortcuts');
        browser.closeWindow();
        browser.switchToWindow(windowHandles[0]);
        expect($('#sg-tools').getAttribute('class')).to.not.have.string('active');
        expect($('#sg-tools-toggle').getAttribute('class')).to.not.have.string('active');
      });
    });
  });

  describe('ui/core/styleguide/index//html/01-body/40-main/main.js', function () {
    describe('#sg-viewport', function () {
      before(function () {
        browser.setWindowSize(1024, 640);
      });

      it('sends the postMessage to annotate pattern if annotations viewer is toggled on', function () {
        $('#sg-t-toggle').click();
        browser.pause(100);
        $('#sg-t-annotations').click();
        browser.pause(700);
        browser.switchToFrame($('#sg-viewport'));
        expect($('p').getAttribute('class')).to.have.string('has-annotation');
        expect($('p').getHTML()).to.have.string('<span class="annotation-tip">1</span>');
        browser.switchToParentFrame();
      });

      it('sends the postMessage to annotate viewall if annotations viewer is toggled on', function () {
        $('.sg-pop[data-patternpartial="viewall"]').click();
        browser.switchToFrame($('#sg-viewport'));
        $('#sg-pattern-toggle-annotations-elements-paragraph').click();
        browser.pause(700);
        expect($('p').getAttribute('class')).to.have.string('has-annotation');
        expect($('p').getHTML()).to.have.string('<span class="annotation-tip">1</span>');
        browser.switchToParentFrame();
      });

      it('sends the postMessage to load code for pattern if code viewer is toggled on', function () {
        $('#sg-t-toggle').click();
        browser.pause(100);
        $('#sg-t-code').click();
        browser.pause(700);
        expect($('#sg-code-fill').getText()).to.equal('{{> 03-templates/page }}');
      });

      it('sends the postMessage to load code from viewall if code viewer is toggled on', function () {
        $('.sg-pop[data-patternpartial="viewall"]').click();
        browser.switchToFrame($('#sg-viewport'));
        $('#sg-pattern-toggle-code-templates-page').click();
        browser.pause(700);
        browser.switchToParentFrame();
        expect($('#sg-code-fill').getText()).to.equal('{{> 02-components/region }}');
      });
    });

    // There doesn't appear to be a way to e2e test dragging the rightpull bar in WebdriverIO.
    describe('#sg-rightpull', function () {
    });
  });
});
