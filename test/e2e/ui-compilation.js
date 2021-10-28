describe('UI compilation of index page js', () => {
  describe('html/01-body/20-header/30-sg-nav-container/div.js', () => {
    describe('.sg-acc-handle', () => {
      it('click, smaller viewport', async () => {
        const sgAccHandle = await $('.sg-acc-handle');
        const sgAccPanel = await $('.sg-acc-panel');

        await browser.setWindowSize(700, 768);
        await (await $('.sg-nav-toggle')).click();

        expect(await (await $('#sg-nav-target')).getAttribute('class')).to.have.string('active');
        expect(await sgAccHandle.getAttribute('class')).to.not.have.string('active');
        expect(await sgAccPanel.getAttribute('class')).to.not.have.string('active');

        await browser.pause(100);
        await sgAccHandle.click();

        expect(await sgAccHandle.getAttribute('class')).to.have.string('active');
        expect(await sgAccPanel.getAttribute('class')).to.have.string('active');
      });

      it('click, larger viewport', async () => {
        const sgAccHandle = await $('.sg-acc-handle');
        const sgAccPanel = await $('.sg-acc-panel');

        await browser.setWindowSize(1024, 768);

        expect(await sgAccHandle.getAttribute('class')).to.not.have.string('active');
        expect(await sgAccPanel.getAttribute('class')).to.not.have.string('active');

        await sgAccHandle.click();

        expect(await sgAccHandle.getAttribute('class')).to.have.string('active');
        expect(await sgAccPanel.getAttribute('class')).to.have.string('active');
      });
    });
  });

  describe('html/01-body/20-header/30-sg-nav-container/30-sg-nav-toggle/a.js', () => {
    describe('.sg-nav-toggle', () => {
      before(async () => {
        await browser.setWindowSize(700, 768);
      });

      it('click', async () => {
        const sgNavToggle = await $('.sg-nav-toggle');
        const sgNavTarget = await $('#sg-nav-target');

        expect(await sgNavTarget.getAttribute('class')).to.not.have.string('active');

        await sgNavToggle.click();

        expect(await sgNavTarget.getAttribute('class')).to.have.string('active');
      });

      it('click again', async () => {
        const sgNavToggle = await $('.sg-nav-toggle');
        const sgNavTarget = await $('#sg-nav-target');

        await sgNavToggle.click();

        expect(await sgNavTarget.getAttribute('class')).to.have.string('active');

        await sgNavToggle.click();

        expect(await sgNavTarget.getAttribute('class')).to.not.have.string('active');
      });
    });
  });

  describe('html/01-body/20-header/60-sg-controls/20-sg-size/li.js', () => {
    describe('#sg-form-label', () => {
      it('does not toggle .sg-size when the window width is too small', async () => {
        const sgFormLabel = await $('#sg-form-label');
        const sgSize = await $('.sg-size');

        await browser.setWindowSize(767, 768);
        await sgFormLabel.click();

        expect(await sgSize.getAttribute('class')).to.not.have.string('active');
      });

      it('toggles .sg-size when the window width is just right', async () => {
        const sgFormLabel = await $('#sg-form-label');
        const sgSize = await $('.sg-size');

        await browser.setWindowSize(768, 768);
        await sgFormLabel.click();

        expect(await sgSize.getAttribute('class')).to.have.string('active');

        await sgFormLabel.click();

        expect(await sgSize.getAttribute('class')).to.not.have.string('active');
      });

      it('does not toggle .sg-size when the window width is too large', async () => {
        const sgFormLabel = await $('#sg-form-label');
        const sgSize = await $('.sg-size');

        await browser.setWindowSize(1025, 768);
        await sgFormLabel.click();

        expect(await sgSize.getAttribute('class')).to.not.have.string('active');
      });

      it('toggles off .sg-size when the window is resized from just right to too small', async () => {
        const sgFormLabel = await $('#sg-form-label');
        const sgSize = await $('.sg-size');

        await browser.setWindowSize(768, 768);
        await sgFormLabel.click();

        expect(await sgSize.getAttribute('class')).to.have.string('active');

        await browser.setWindowSize(767, 768);
        await browser.pause(150);

        expect(await sgSize.getAttribute('class')).to.not.have.string('active');
      });

      it('toggles off .sg-size when the window is resized from just right to too large', async () => {
        const sgFormLabel = await $('#sg-form-label');
        const sgSize = await $('.sg-size');

        await browser.setWindowSize(768, 768);
        await sgFormLabel.click();

        expect(await sgSize.getAttribute('class')).to.have.string('active');

        await browser.setWindowSize(1025, 768);
        await browser.pause(150);

        expect(await sgSize.getAttribute('class')).to.not.have.string('active');
      });
    });

    describe('#sg-size-px', () => {
      before(async () => {
        await browser.setWindowSize(1025, 768);
      });

      it('decreases px size on ArrowDown keydown', async () => {
        const sgSizePx = await $('#sg-size-px');
        const sgViewport = await $('#sg-viewport');

        await sgSizePx.click();

        expect((await sgViewport.getSize()).width).to.equal(1025);

        await browser.keys(['ArrowDown']);

        expect((await sgViewport.getSize()).width).to.equal(1024);
      });

      it('resizes to a keyed and entered px size', async () => {
        const sgSizePx = await $('#sg-size-px');
        const sgViewport = await $('#sg-viewport');

        await sgSizePx.click();
        await sgSizePx.doubleClick();
        await browser.elementSendKeys(sgSizePx.elementId, '1023\uE007');
        await browser.pause(500);

        expect((await sgViewport.getSize()).width).to.equal(1023);
      });

      it('increases px size on ArrowUp keydown', async () => {
        const sgSizePx = await $('#sg-size-px');
        const sgViewport = await $('#sg-viewport');

        await sgSizePx.click();

        expect((await sgViewport.getSize()).width).to.equal(1023);

        await browser.keys(['ArrowUp']);

        expect((await sgViewport.getSize()).width).to.equal(1024);
      });
    });

    describe('#sg-size-em', () => {
      before(async () => {
        await browser.setWindowSize(1024, 768);
      });

      it('increases em size on ArrowDown keydown', async () => {
        const sgSizeEm = await $('#sg-size-em');
        const sgViewport = await $('#sg-viewport');

        await sgSizeEm.click();

        expect((await sgViewport.getSize()).width).to.equal(1024);

        await browser.keys(['ArrowUp']);

        expect((await sgViewport.getSize()).width).to.equal(1040);
      });

      it('resizes to a keyed and entered em size', async () => {
        const sgSizeEm = await $('#sg-size-em');
        const sgViewport = await $('#sg-viewport');

        await sgSizeEm.click();
        await sgSizeEm.doubleClick();
        await browser.elementSendKeys(sgSizeEm.elementId, '64.00\uE007');
        await browser.pause(1000);

        expect((await sgViewport.getSize()).width).to.equal(1024);
      });

      it('decreases em size on ArrowDown keydown', async () => {
        const sgSizeEm = await $('#sg-size-em');
        const sgViewport = await $('#sg-viewport');

        await sgSizeEm.click();

        expect((await sgViewport.getSize()).width).to.equal(1024);

        await browser.keys(['ArrowDown']);

        expect((await sgViewport.getSize()).width).to.equal(1008);
      });
    });

    describe('#sg-size-w', () => {
      before(async () => {
        await browser.setWindowSize(1025, 768);
      });

      it('resizes to whole width', async () => {
        await (await $('#sg-size-w')).click();
        await browser.pause(700);

        expect((await (await $('#sg-viewport')).getSize()).width).to.equal(1025);
      });
    });

    describe('#sg-size-random', () => {
      before(async () => {
        await browser.setWindowSize(1025, 768);
      });

      it('resizes to a random width', async () => {
        const sgViewport = await $('#sg-viewport');
        const sgViewportWidthBefore = (await sgViewport.getSize()).width;

        await (await $('#sg-size-random')).click();
        await browser.pause(1000);

        const sgViewportWidthAfter = (await sgViewport.getSize()).width;

        expect(sgViewportWidthBefore).to.not.equal(sgViewportWidthAfter);
        expect(sgViewportWidthAfter).to.be.a('number');
        expect(sgViewportWidthAfter).to.be.at.least(240);
        expect(sgViewportWidthAfter).to.be.below(1025);
      });
    });

    describe('#sg-size-disco', () => {
      before(async () => {
        await browser.setWindowSize(1025, 768);
      });

      it('toggles disco mode on and off', async () => {
        const sgSizeDisco = await $('#sg-size-disco');
        const sgViewport = await $('#sg-viewport');
        const sgViewportWidth0 = (await sgViewport.getSize()).width;

        await sgSizeDisco.click();
        await browser.pause(1000);

        const sgViewportWidth1 = (await sgViewport.getSize()).width;

        expect(sgViewportWidth0).to.not.equal(sgViewportWidth1);

        await sgSizeDisco.click();
        await browser.pause(1000);

        const sgViewportWidth2 = (await sgViewport.getSize()).width;

        expect(sgViewportWidth1).to.not.equal(sgViewportWidth2);

        await browser.pause(1000);

        const sgViewportWidth3 = (await sgViewport.getSize()).width;

        expect(sgViewportWidth2).to.equal(sgViewportWidth3);
      });
    });

    describe('#sg-size-grow', () => {
      before(async () => {
        await browser.setWindowSize(1025, 768);
      });

      it('toggles grow mode on and off', async () => {
        const sgSizeGrow = await $('#sg-size-grow');
        const sgViewport = await $('#sg-viewport');
        const sgViewportWidth0 = (await sgViewport.getSize()).width;

        await sgSizeGrow.click();
        await browser.pause(1000);

        const sgViewportWidth1 = (await sgViewport.getSize()).width;

        expect(sgViewportWidth0).to.not.equal(sgViewportWidth1);

        await browser.pause(1000);
        await sgSizeGrow.click();

        const sgViewportWidth2 = (await sgViewport.getSize()).width;

        expect(sgViewportWidth1).to.not.equal(sgViewportWidth2);

        await browser.pause(1000);

        const sgViewportWidth3 = (await sgViewport.getSize()).width;

        expect(sgViewportWidth2).to.equal(sgViewportWidth3);
      });
    });
  });

  describe('html/01-body/20-header/60-sg-controls/40-sg-find/li.js', () => {
    describe('#sg-f-toggle', () => {
      before(async () => {
        await browser.setWindowSize(1024, 768);
      });

      it('mouseenter', async () => {
        const sgFToggle = await $('#sg-f-toggle');

        await sgFToggle.moveTo();

        expect(await sgFToggle.getAttribute('class')).to.have.string('mouseentered');
      });

      it('mouseleave', async () => {
        await (await $('.sg-nav-toggle')).moveTo();

        expect(await (await $('#sg-f-toggle')).getAttribute('class')).to.not.have.string('mouseentered');
      });

      it('click, smaller viewport', async () => {
        const sgNavTarget = await $('#sg-nav-target');
        const sgFToggle = await $('#sg-f-toggle');
        const sgFind = await $('#sg-find');

        await browser.setWindowSize(700, 768);

        // Test that clicking this toggle closes previous toggle.
        // First toggle previous to active.
        (await $('.sg-nav-toggle')).click();

        expect(await sgNavTarget.getAttribute('class')).to.have.string('active');

        // Next click #sg-f-toggle and test that it toggled previous to inactive.
        await sgFToggle.click();

        expect(await sgNavTarget.getAttribute('class')).to.not.have.string('active');
        // Test that its own attributes have been updated.
        expect(await sgFToggle.getAttribute('class')).to.have.string('active');
        expect(await sgFind.getAttribute('class')).to.have.string('active');

        await sgFToggle.click();

        expect(await sgFToggle.getAttribute('class')).to.not.have.string('active');
        expect(await sgFind.getAttribute('class')).to.not.have.string('active');
      });

      it('click, larger viewport', async () => {
        const sgAccHandle = await $('.sg-acc-handle');
        const sgAccPanel = await $('.sg-acc-panel');
        const sgFToggle = await $('#sg-f-toggle');
        const sgFind = await $('#sg-find');

        await browser.setWindowSize(1024, 768);
        // Test that clicking this toggle closes previous toggle.
        // First toggle previous to active.
        await sgAccHandle.click();

        expect(await sgAccHandle.getAttribute('class')).to.have.string('active');
        expect(await sgAccPanel.getAttribute('class')).to.have.string('active');

        // Next click #sg-f-toggle and test that it toggled previous to inactive.
        await sgFToggle.click();

        expect(await sgAccHandle.getAttribute('class')).to.not.have.string('active');
        expect(await sgAccPanel.getAttribute('class')).to.not.have.string('active');
        // Test that its own attributes have been updated.
        expect(await sgFToggle.getAttribute('class')).to.have.string('active');
        expect(await sgFind.getAttribute('class')).to.have.string('active');

        await sgFToggle.click();

        expect(await sgFToggle.getAttribute('class')).to.not.have.string('active');
        expect(await sgFind.getAttribute('class')).to.not.have.string('active');
      });
    });

    describe('#typeahead', () => {
      before(async () => {
        await browser.setWindowSize(1024, 768);
      });

      it('blur', async () => {
        const sgFToggle = await $('#sg-f-toggle');
        const sgFind = await $('#sg-find');

        await sgFToggle.click();

        expect(await sgFToggle.getAttribute('class')).to.have.string('active');
        expect(await sgFind.getAttribute('class')).to.have.string('active');
        expect(await (await $(() => document.activeElement)).getAttribute('id')).to.equal('typeahead');

        await $('#sg-size-px').click();

        expect(await sgFToggle.getAttribute('class')).to.not.have.string('active');
        expect(await sgFind.getAttribute('class')).to.not.have.string('active');
        expect(await (await $(() => document.activeElement)).getAttribute('id')).to.not.equal('typeahead');
      });

      it('select blurs #typeahead, closes patternFinder, and sets iframe', async () => {
        const sgFToggle = await $('#sg-f-toggle');

        await sgFToggle.click();
        await browser.pause(100);
        await (await $('#typeahead')).setValue('elements');
        await (await (await $('.tt-dataset-0')).$('.tt-suggestion')).click();

        expect(await sgFToggle.getAttribute('class')).to.not.have.string('active');
        expect(await (await $('#sg-find')).getAttribute('class')).to.not.have.string('active');
        expect(await (await $(() => document.activeElement)).getAttribute('id')).to.not.equal('typeahead');
        expect(await (await $('#sg-raw')).getAttribute('href'))
          .to.equal('patterns/00-elements-paragraph/00-elements-paragraph.html');
      });

      it('autocomplete blurs #typeahead, closes patternFinder, and sets iframe', async () => {
        const sgFToggle = await $('#sg-f-toggle');

        await sgFToggle.click();
        await browser.pause(100);
        await (await $('#typeahead')).setValue('pages');
        await browser.pause(100);
        await browser.keys(['Tab']);

        expect(await sgFToggle.getAttribute('class')).to.not.have.string('active');
        expect(await (await $('#sg-find')).getAttribute('class')).to.not.have.string('active');
        expect(await (await $(() => document.activeElement)).getAttribute('id')).to.not.equal('typeahead');
        expect(await (await $('#sg-raw')).getAttribute('href'))
          .to.equal('patterns/04-pages-00-homepage/04-pages-00-homepage.html');
      });
    });
  });

  describe('html/01-body/20-header/60-sg-controls/60-sg-view/li.js', () => {
    describe('#sg-t-annotations', () => {
      before(async () => {
        await browser.setWindowSize(1024, 768);
      });

      it('click toggles annotations viewer', async () => {
        const sgTToggle = await $('#sg-t-toggle');
        const sgTCode = await $('#sg-t-code');
        const sgTAnnotations = await $('#sg-t-annotations');
        const sgView = await $('#sg-view');
        const sgViewContainer = await $('#sg-view-container');

        await sgTToggle.click();
        await browser.pause(100);
        // Open code viewer first to make sure it gets closed.
        await sgTCode.click();
        await browser.pause(700);
        await sgTToggle.click();
        await browser.pause(100);
        await sgTAnnotations.click();
        await browser.pause(700);

        expect(await sgTCode.getAttribute('class')).to.not.have.string('active');
        expect(await sgTAnnotations.getAttribute('class')).to.have.string('active');
        expect(await sgView.getAttribute('class')).to.not.have.string('active');
        expect((await sgViewContainer.getCSSProperty('bottom')).value).to.equal('0px');
        expect(await sgTToggle.getAttribute('class')).to.not.have.string('active');

        await sgTToggle.click();
        await browser.pause(100);
        await sgTAnnotations.click();
        await browser.pause(700);

        expect(await sgTAnnotations.getAttribute('class')).to.not.have.string('active');
        expect(await sgView.getAttribute('class')).to.not.have.string('active');
        expect(await (await sgViewContainer.getCSSProperty('bottom')).value).to.equal('636px');
        expect(await sgTToggle.getAttribute('class')).to.not.have.string('active');
      });
    });

    describe('#sg-t-code', () => {
      before(async () => {
        await browser.setWindowSize(1024, 768);
      });

      it('click toggles code viewer', async () => {
        const sgTToggle = await $('#sg-t-toggle');
        const sgTCode = await $('#sg-t-code');
        const sgTAnnotations = await $('#sg-t-annotations');
        const sgView = await $('#sg-view');
        const sgViewContainer = await $('#sg-view-container');

        await sgTToggle.click();
        await browser.pause(100);
        // Open annotations viewer first to make sure it gets closed.
        await sgTAnnotations.click();
        await browser.pause(700);
        await sgTToggle.click();
        await browser.pause(100);
        await sgTCode.click();
        await browser.pause(700);

        expect(await sgTAnnotations.getAttribute('class')).to.not.have.string('active');
        expect(await sgTCode.getAttribute('class')).to.have.string('active');
        expect(await sgTToggle.getAttribute('class')).to.not.have.string('active');
        expect(await sgView.getAttribute('class')).to.not.have.string('active');
        expect(await (await sgViewContainer.getCSSProperty('bottom')).value).to.equal('0px');

        await sgTToggle.click();
        await browser.pause(100);
        await sgTCode.click();
        await browser.pause(700);

        expect(await sgTCode.getAttribute('class')).to.not.have.string('active');
        expect(await sgTToggle.getAttribute('class')).to.not.have.string('active');
        expect(await sgView.getAttribute('class')).to.not.have.string('active');
        expect((await sgViewContainer.getCSSProperty('bottom')).value).to.equal('636px');
      });
    });

    describe('#sg-raw', () => {
      before(async () => {
        await browser.setWindowSize(1024, 768);
      });

      it('pattern opens in new tab and menu closes', async () => {
        const sgTToggle = await $('#sg-t-toggle');

        await sgTToggle.click();
        await browser.pause(100);
        await (await $('#sg-raw')).click();

        const windowHandles = await browser.getWindowHandles();

        await browser.switchToWindow(windowHandles[1]);

        expect(await browser.getUrl())
          .to.equal('http://localhost:8080/patterns/04-pages-00-homepage/04-pages-00-homepage.html');

        await browser.closeWindow();
        await browser.switchToWindow(windowHandles[0]);

        expect(await (await $('#sg-view')).getAttribute('class')).to.not.have.string('active');
        expect(await sgTToggle.getAttribute('class')).to.not.have.string('active');
      });
    });
  });

  describe('ui/core/styleguide/index//html/01-body/20-header/60-sg-controls/80-sg-tools/li.js', () => {
    describe('.sg-tool', () => {
      before(async () => {
        await browser.setWindowSize(1024, 768);
      });

      // Skip clicking Fepper docs to avoid hitting the website during automated tests.

      it('Keyboard shortcuts opens in new tab and menu closes', async () => {
        const sgToolsToggle = await $('#sg-tools-toggle');

        await sgToolsToggle.click();
        await browser.pause(100);
        await (await $$('.sg-tool'))[1].click();

        const windowHandles = await browser.getWindowHandles();

        await browser.switchToWindow(windowHandles[1]);

        expect(await browser.getUrl()).to.equal('http://localhost:8080/readme#keyboard-shortcuts');

        await browser.closeWindow();
        await browser.switchToWindow(windowHandles[0]);

        expect(await (await $('#sg-tools')).getAttribute('class')).to.not.have.string('active');
        expect(await sgToolsToggle.getAttribute('class')).to.not.have.string('active');
      });
    });
  });

  describe('ui/core/styleguide/index//html/01-body/40-main/main.js', () => {
    describe('#sg-viewport', () => {
      before(async () => {
        await browser.setWindowSize(1024, 768);
      });

      it('sends the postMessage to annotate pattern if annotations viewer is toggled on', async () => {
        const p = await $('p');

        await (await $('#sg-t-toggle')).click();
        await browser.pause(100);
        await (await $('#sg-t-annotations')).click();
        await browser.pause(700);
        await browser.switchToFrame(await $('#sg-viewport'));

        expect(await p.getAttribute('class')).to.have.string('has-annotation');
        expect(await p.getHTML()).to.have.string('<span class="annotation-tip">1</span>');

        await browser.switchToParentFrame();
      });

      it('sends the postMessage to annotate viewall if annotations viewer is toggled on', async () => {
        const p = await $('p');

        await (await $('.sg-pop[data-patternpartial="viewall"]')).click();
        await browser.switchToFrame(await $('#sg-viewport'));
        await (await $('#sg-pattern-toggle-annotations-elements-paragraph')).click();
        await browser.pause(700);

        expect(await p.getAttribute('class')).to.have.string('has-annotation');
        expect(await p.getHTML()).to.have.string('<span class="annotation-tip">1</span>');

        await browser.switchToParentFrame();
      });

      it('sends the postMessage to load code for pattern if code viewer is toggled on', async () => {
        await (await $('#sg-t-toggle')).click();
        await browser.pause(100);
        await (await $('#sg-t-code')).click();
        await browser.pause(700);

        expect(await (await $('#sg-code-container')).getAttribute('class')).to.have.string('active');
      });

      it('sends the postMessage to load code from viewall if code viewer is toggled on', async () => {
        await (await $('.sg-pop[data-patternpartial="viewall"]')).click();
        await browser.switchToFrame(await $('#sg-viewport'));
        await (await $('#sg-pattern-toggle-code-templates-page')).click();
        await browser.pause(700);
        await browser.switchToParentFrame();

        expect(await (await $('#sg-code-container')).getAttribute('class')).to.have.string('active');
      });
    });

    // There doesn't appear to be a way to e2e test dragging the rightpull bar in WebdriverIO.
    describe('#sg-rightpull', async () => {
    });
  });
});
