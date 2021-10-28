describe('Listeners end-to-end tests', () => {
  describe('annotationsViewer', () => {
    describe('click', () => {
      before(async () => {
        await browser.setWindowSize(1024, 768);
      });

      it('dock-right button docks the viewer to the right', async () => {
        const patternlabBody = await $('#patternlab-body');
        const sgViewport = await $('#sg-viewport');
        const sgGenContainer = await $('#sg-gen-container');

        await (await $('#sg-t-toggle')).click();
        await browser.pause(100);
        await (await $('#sg-t-annotations')).click();
        await browser.pause(100);

        expect(await patternlabBody.getAttribute('class')).to.not.have.string('dock-right');
        expect((await sgViewport.getSize()).width).to.equal(1024);

        await (await $('#sg-view-btn-dock-right')).click();
        await browser.pause(1000);

        expect(await patternlabBody.getAttribute('class')).to.have.string('dock-right');
        expect((await sgGenContainer.getSize()).width).to.equal(512);
      });

      it('dock-left button docks the viewer to the left', async () => {
        const patternlabBody = await $('#patternlab-body');
        const sgViewport = await $('#sg-viewport');
        const sgGenContainer = await $('#sg-gen-container');

        await (await $('#sg-form-label')).click();
        await browser.pause(100);
        await (await $('#sg-size-w')).click();
        await browser.pause(1000);

        expect(await patternlabBody.getAttribute('class')).to.not.have.string('dock-left');
        expect((await sgViewport.getSize()).width).to.equal(1024);

        await (await $('#sg-view-btn-dock-left')).click();
        await browser.pause(1000);

        expect(await patternlabBody.getAttribute('class')).to.have.string('dock-left');
        expect((await sgGenContainer.getSize()).width).to.equal(512);
      });

      it('dock-bottom button docks the viewer to the bottom', async () => {
        const patternlabBody = await $('#patternlab-body');

        await (await $('#sg-view-btn-dock-bottom')).click();
        await browser.pause(100);
        await (await $('#sg-form-label')).click();
        await browser.pause(100);
        await (await $('#sg-size-w')).click();
        await browser.pause(1000);

        expect(await patternlabBody.getAttribute('class')).to.have.string('dock-bottom');
      });

      it('close button closes annotations viewer', async () => {
        const sgVpWrap = await $('#sg-vp-wrap');
        const sgViewContainer = await $('#sg-view-container');

        await (await $('#sg-t-toggle')).click();
        await browser.pause(100);
        await (await $('#sg-t-annotations')).click();
        await browser.pause(700);

        expect((await sgVpWrap.getCSSProperty('padding-bottom')).value).to.equal('322px');
        expect((await sgViewContainer.getCSSProperty('bottom')).value).to.equal('0px');

        await (await $('#sg-view-btn-close')).click();
        await browser.pause(700);

        expect((await sgVpWrap.getCSSProperty('padding-bottom')).value).to.equal('0px');
        expect((await sgViewContainer.getCSSProperty('bottom')).value).to.equal('636px');
      });
    });

    describe('Mousetrap', () => {
      before(async () => {
        await browser.setWindowSize(1024, 768);
      });

      it('"ctrl+shift+a" toggles annotations viewer', async () => {
        const sgVpWrap = await $('#sg-vp-wrap');
        const sgViewContainer = await $('#sg-view-container');
        const sgAnnotations = await $('#sg-annotations');

        await browser.keys(['Control', 'Shift', 'a']);
        await browser.pause(700);

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

        await browser.keys(['Control', 'Shift', 'a']);
        await browser.pause(700);

        expect((await sgVpWrap.getCSSProperty('padding-bottom')).value).to.equal('0px');
        expect((await sgViewContainer.getCSSProperty('bottom')).value).to.equal('636px');
      });
    });
  });

  describe('codeViewer', () => {
    describe('click', () => {
      before(async () => {
        await browser.setWindowSize(1024, 768);
      });

      it('dock-right button docks the viewer to the right', async () => {
        const patternlabBody = await $('#patternlab-body');
        const sgViewport = await $('#sg-viewport');
        const sgGenContainer = await $('#sg-gen-container');

        await (await $('#sg-t-toggle')).click();
        await browser.pause(100);
        await (await $('#sg-t-code')).click();
        await browser.pause(100);

        expect(await patternlabBody.getAttribute('class')).to.not.have.string('dock-right');
        expect((await sgViewport.getSize()).width).to.equal(1024);

        await (await $('#sg-view-btn-dock-right')).click();
        await browser.pause(1000);

        expect(await patternlabBody.getAttribute('class')).to.have.string('dock-right');
        expect((await sgGenContainer.getSize()).width).to.equal(512);
      });

      it('dock-left button docks the viewer to the left', async () => {
        const patternlabBody = await $('#patternlab-body');
        const sgViewport = await $('#sg-viewport');
        const sgGenContainer = await $('#sg-gen-container');

        await (await $('#sg-form-label')).click();
        await browser.pause(100);
        await (await $('#sg-size-w')).click();
        await browser.pause(1000);

        expect(await patternlabBody.getAttribute('class')).to.not.have.string('dock-left');
        expect((await sgViewport.getSize()).width).to.equal(1024);

        await (await $('#sg-view-btn-dock-left')).click();
        await browser.pause(1000);

        expect(await patternlabBody.getAttribute('class')).to.have.string('dock-left');
        expect((await sgGenContainer.getSize()).width).to.equal(512);
      });

      it('dock-bottom button docks the viewer to the bottom', async () =>  {
        const patternlabBody = await $('#patternlab-body');

        await (await $('#sg-view-btn-dock-bottom')).click();
        await browser.pause(700);
        await (await $('#sg-form-label')).click();
        await browser.pause(100);
        await (await $('#sg-size-w')).click();
        await browser.pause(700);

        expect(await patternlabBody.getAttribute('class')).to.have.string('dock-bottom');
      });

      it('close button closes code viewer', async () => {
        const sgVpWrap = await $('#sg-vp-wrap');
        const sgViewContainer = await $('#sg-view-container');

        await (await $('#sg-t-toggle')).click();
        await browser.pause(100);
        await (await $('#sg-t-code')).click();
        await browser.pause(700);

        expect((await sgVpWrap.getCSSProperty('padding-bottom')).value).to.equal('322px');
        expect((await sgViewContainer.getCSSProperty('bottom')).value).to.equal('0px');

        await (await $('#sg-view-btn-close')).click();
        await browser.pause(700);

        expect((await sgVpWrap.getCSSProperty('padding-bottom')).value).to.equal('0px');
        expect((await sgViewContainer.getCSSProperty('bottom')).value).to.equal('636px');
      });

      it('feplet and markdown tabs activate their respective panels', async () => {
        const sgCodeTabFeplet = await $('#sg-code-tab-feplet');
        const sgCodeTabMarkdown = await $('#sg-code-tab-markdown');
        const sgCodePanelFeplet = await $('#sg-code-panel-feplet');
        const sgCodePanelMarkdown = await $('#sg-code-panel-markdown');

        await (await $('#sg-t-toggle')).click();
        await browser.pause(100);
        await (await $('#sg-t-code')).click();
        await browser.pause(700);
        await (await $('#sg-code-tab-markdown')).click();
        await browser.pause(100);

        expect(await sgCodeTabFeplet.getAttribute('class')).to.not.have.string('sg-code-tab-active');
        expect(await sgCodeTabMarkdown.getAttribute('class')).to.have.string('sg-code-tab-active');
        expect(await sgCodePanelFeplet.getAttribute('class')).to.not.have.string('sg-code-panel-active');
        expect(await sgCodePanelMarkdown.getAttribute('class')).to.have.string('sg-code-panel-active');

        await (await $('#sg-code-tab-feplet')).click();
        await browser.pause(100);

        expect(await sgCodeTabFeplet.getAttribute('class')).to.have.string('sg-code-tab-active');
        expect(await sgCodeTabMarkdown.getAttribute('class')).to.not.have.string('sg-code-tab-active');
        expect(await sgCodePanelFeplet.getAttribute('class')).to.have.string('sg-code-panel-active');
        expect(await sgCodePanelMarkdown.getAttribute('class')).to.not.have.string('sg-code-panel-active');
      });

      it('the markdown edit button activates the markdown edit pane', async () => {
        const sgCodePaneMarkdown = await $('#sg-code-pane-markdown');
        const sgCodePaneMarkdownEdit = await $('#sg-code-pane-markdown-edit');

        await (await $('#sg-t-toggle')).click();
        await browser.pause(100);
        await (await $('#sg-t-code')).click();
        await browser.pause(700);
        await (await $('#sg-code-tab-markdown')).click();
        await browser.pause(100);
        await (await $('#sg-code-btn-markdown-edit')).click();
        await browser.pause(100);

        expect((await sgCodePaneMarkdown.getCSSProperty('display')).value).to.equal('none');
        expect((await sgCodePaneMarkdownEdit.getCSSProperty('display')).value).to.equal('block');
      });

      it('the markdown edit cancel button exits the markdown edit pane', async () => {
        const sgCodePaneMarkdown = await $('#sg-code-pane-markdown');
        const sgCodePaneMarkdownEdit = await $('#sg-code-pane-markdown-edit');

        await (await $('#sg-t-toggle')).click();
        await browser.pause(100);
        await (await $('#sg-t-code')).click();
        await browser.pause(700);
        await (await $('#sg-code-tab-markdown')).click();
        await browser.pause(100);
        await (await $('#sg-code-btn-markdown-edit')).click();
        await browser.pause(100);
        await (await $('#sg-code-btn-markdown-save-cancel')).click();
        await browser.pause(100);

        expect((await sgCodePaneMarkdown.getCSSProperty('display')).value).to.equal('block');
        expect((await sgCodePaneMarkdownEdit.getCSSProperty('display')).value).to.equal('none');
      });

      it('the markdown edit save button exits the markdown edit pane if markdown unchanged', async () => {
        const sgCodePaneMarkdown = await $('#sg-code-pane-markdown');
        const sgCodePaneMarkdownEdit = await $('#sg-code-pane-markdown-edit');

        await (await $('#sg-t-toggle')).click();
        await browser.pause(100);
        await (await $('#sg-t-code')).click();
        await browser.pause(700);
        await (await $('#sg-code-tab-markdown')).click();
        await browser.pause(100);
        await (await $('#sg-code-btn-markdown-edit')).click();
        await browser.pause(100);
        await (await $('#sg-code-btn-markdown-save')).click();
        await browser.pause(100);

        expect((await sgCodePaneMarkdown.getCSSProperty('display')).value).to.equal('block');
        expect((await sgCodePaneMarkdownEdit.getCSSProperty('display')).value).to.equal('none');
      });

      it('the markdown edit save button exits the markdown edit pane if edited markdown is saved', async () => {
        const sgCodePaneMarkdown = await $('#sg-code-pane-markdown');
        const sgCodePaneMarkdownEdit = await $('#sg-code-pane-markdown-edit');

        await (await $('#sg-t-toggle')).click();
        await browser.pause(100);
        await (await $('#sg-t-code')).click();
        await browser.pause(700);
        await (await $('#sg-code-tab-markdown')).click();
        await browser.pause(100);
        await (await $('#sg-code-btn-markdown-edit')).click();
        await browser.pause(100);
        await (await $('#sg-code-textarea-markdown')).addValue('\n');
        await browser.pause(100);
        await (await $('#sg-code-btn-markdown-save')).click();
        await browser.pause(100);

        expect((await sgCodePaneMarkdown.getCSSProperty('display')).value).to.equal('block');
        expect((await sgCodePaneMarkdownEdit.getCSSProperty('display')).value).to.equal('none');
      });

      it('the git tab activates the git panel', async () => {
        const sgCodePanelGit = await $('#sg-code-panel-git');
        const sgCodePaneGitNa = await $('#sg-code-pane-git-na');

        await (await $('#sg-t-toggle')).click();
        await browser.pause(100);
        await (await $('#sg-t-code')).click();
        await browser.pause(700);
        await (await $('#sg-code-tab-git')).click();
        await browser.pause(100);

        expect((await sgCodePanelGit.getCSSProperty('display')).value).to.equal('block');
        expect((await sgCodePaneGitNa.getCSSProperty('display')).value).to.equal('block');
      });
    });

    describe('Mousetrap', () => {
      before(async () => {
        await browser.setWindowSize(1024, 768);
      });

      it('"ctrl+shift+c" toggles code viewer', async () => {
        const sgVpWrap = await $('#sg-vp-wrap');
        const sgViewContainer = await $('#sg-view-container');

        await browser.keys(['Control', 'Shift', 'c']);
        await browser.pause(700);

        expect((await sgVpWrap.getCSSProperty('padding-bottom')).value).to.equal('322px');
        expect((await sgViewContainer.getCSSProperty('bottom')).value).to.equal('0px');
        expect(await sgViewContainer.getAttribute('class')).to.have.string('anim-ready');

        await browser.keys(['Control', 'Shift', 'c']);
        await browser.pause(700);

        expect((await sgVpWrap.getCSSProperty('padding-bottom')).value).to.equal('0px');
        expect((await sgViewContainer.getCSSProperty('bottom')).value).to.equal('636px');
        expect(await sgViewContainer.getAttribute('class')).to.not.have.string('anim-ready');
      });
    });
  });

  describe('mustacheBrowser', () => {
    describe('click', () => {
      before(async () => {
        await browser.setWindowSize(1024, 768);
      });

      it('hot-links partial tags and redirects to the partial\'s pattern page', async () => {
        const sgRaw = await $('#sg-raw');

        await (await $('#sg-t-toggle')).click();
        await browser.pause(100);
        await (await $('#sg-t-code')).click();
        await browser.pause(700);
        await (await $('#sg-code-tab-feplet')).click();
        await browser.pause(100);
        await browser.switchToFrame(await $('#sg-code-panel-feplet'));
        await (await $('.language-markup a')).click();
        await browser.pause(100);
        await browser.switchToParentFrame();

        expect(await sgRaw.getAttribute('href'))
          .to.equal('patterns/03-templates-page/03-templates-page.html');
      });
    });
  });

  describe('patternFinder', () => {
    describe('Mousetrap', () => {
      before(async () => {
        await browser.setWindowSize(1024, 768);
      });

      it('"ctrl+shift+f" toggles patternFinder', async () => {
        const sgNavElements = await $('.sg-nav-elements');
        const sgAccHandle = await sgNavElements.$('.sg-acc-handle');
        const sgAccPanel = await sgNavElements.$('.sg-acc-panel');
        const sgFToggle = await $('#sg-f-toggle');
        const sgFind = await $('#sg-find');

        await sgAccHandle.click();

        expect(await sgAccHandle.getAttribute('class')).to.have.string('active');
        expect(await sgAccPanel.getAttribute('class')).to.have.string('active');

        await browser.keys(['Control', 'Shift', 'f']);

        expect(await sgAccHandle.getAttribute('class')).to.not.have.string('active');
        expect(await sgAccPanel.getAttribute('class')).to.not.have.string('active');
        expect(await sgFToggle.getAttribute('class')).to.have.string('active');
        expect(await sgFind.getAttribute('class')).to.have.string('active');

        await browser.keys(['Control', 'Shift', 'f']);

        expect(await sgFToggle.getAttribute('class')).to.not.have.string('active');
        expect(await sgFind.getAttribute('class')).to.not.have.string('active');
      });

      it('"ctrl+shift+f" closes patternFinder while focus is outside patternFinder', async () => {
        const sgFToggle = await $('#sg-f-toggle');
        const sgFind = await $('#sg-find');

        await sgFToggle.click();

        expect(await sgFToggle.getAttribute('class')).to.have.string('active');
        expect(await sgFind.getAttribute('class')).to.have.string('active');

        await browser.keys('Tab');
        await browser.keys(['Control', 'Shift', 'f']);

        expect(await sgFToggle.getAttribute('class')).to.not.have.string('active');
        expect(await sgFind.getAttribute('class')).to.not.have.string('active');
      });

      it('"esc" closes patternFinder while focus is inside patternFinder', async () => {
        const sgFToggle = await $('#sg-f-toggle');
        const sgFind = await $('#sg-find');

        await browser.keys(['Control', 'Shift', 'f']);

        expect(await sgFToggle.getAttribute('class')).to.have.string('active');
        expect(await sgFind.getAttribute('class')).to.have.string('active');

        await browser.keys(['Escape']);

        expect(await sgFToggle.getAttribute('class')).to.not.have.string('active');
        expect(await sgFind.getAttribute('class')).to.not.have.string('active');
      });

      it('"esc" closes patternFinder while focus is outside patternFinder', async () => {
        const sgFToggle = await $('#sg-f-toggle');
        const sgFind = await $('#sg-find');

        await sgFToggle.click();

        expect(await sgFToggle.getAttribute('class')).to.have.string('active');
        expect(await sgFind.getAttribute('class')).to.have.string('active');

        await browser.keys('Tab');
        await browser.keys(['Escape']);

        expect(await sgFToggle.getAttribute('class')).to.not.have.string('active');
        expect(await sgFind.getAttribute('class')).to.not.have.string('active');
      });
    });
  });

  describe('patternViewport', () => {
    describe('window.resize', () => {
      before(async () => {
        await browser.setWindowSize(1200, 768);
      });

      it('updates viewport width when in whole mode', async () => {
        const sgViewport = await $('#sg-viewport');

        await (await $('#sg-size-w')).click();
        await browser.pause(100);

        expect((await sgViewport.getSize()).width).to.equal(1200);

        await browser.setWindowSize(1300, 768);
        await browser.pause(100);

        expect((await sgViewport.getSize()).width).to.equal(1300);
      });
    });

    describe('.sg-pop click', () => {
      before(async () => {
        await browser.setWindowSize(1300, 768);
      });

      it('loads pattern', async () => {
        const sgNavElements = await $('.sg-nav-elements');
        const sgRaw = await $('#sg-raw');

        await (await sgNavElements.$('.sg-acc-handle')).click();
        await browser.pause(100);
        await (await sgNavElements.$('.sg-pop')).click();
        await browser.pause(100);

        expect(await sgRaw.getAttribute('href'))
          .to.equal('patterns/00-elements-paragraph/00-elements-paragraph.html');
      });

      it('closes open nav menu', async () => {
        const sgNavCompounds = await $('.sg-nav-compounds');
        const sgAccHandle = await sgNavCompounds.$('.sg-acc-handle');
        const sgAccPanel = await sgNavCompounds.$('.sg-acc-panel');

        await (await sgNavCompounds.$('.sg-acc-handle')).click();

        expect(await sgAccHandle.getAttribute('class')).to.have.string('active');
        expect(await sgAccPanel.getAttribute('class')).to.have.string('active');

        await browser.pause(100);
        await (await sgNavCompounds.$('.sg-pop')).click();

        expect(await sgAccHandle.getAttribute('class')).to.not.have.string('active');
        expect(await sgAccPanel.getAttribute('class')).to.not.have.string('active');
      });
    });

    describe('viewport resizer buttons', () => {
      before(async () => {
        await browser.setWindowSize(1300, 768);
      });

      it('LG button resizes to Large', async () => {
        const sgViewport = await $('#sg-viewport');

        await (await $('#sg-size-lg')).click();
        await browser.pause(1000);

        expect((await sgViewport.getSize()).width).to.equal(1280);
      });

      it('MD button resizes to Medium', async () => {
        const sgViewport = await $('#sg-viewport');

        await (await $('#sg-size-md')).click();
        await browser.pause(1000);

        expect((await sgViewport.getSize()).width).to.equal(1024);
      });

      it('SM button resizes to Small', async () => {
        const sgViewport = await $('#sg-viewport');

        await (await $('#sg-size-sm')).click();
        await browser.pause(1000);

        expect((await sgViewport.getSize()).width).to.equal(767);
      });

      it('XS button resizes to XSmall', async () => {
        const sgViewport = await $('#sg-viewport');

        await (await $('#sg-size-xs')).click();
        await browser.pause(1000);

        expect((await sgViewport.getSize()).width).to.equal(480);
      });

      it('XX button resizes to XXSmall', async () => {
        const sgViewport = await $('#sg-viewport');

        await (await $('#sg-size-xx')).click();
        await browser.pause(1000);

        expect((await sgViewport.getSize()).width).to.equal(320);
      });
    });

    // Test the viewport sizes in reverse to reduce the distance shrinking from 1300 in the previous tests.
    describe('Mousetrap', () => {
      before(async () => {
        await browser.setWindowSize(1300, 768);
      });

      it('"ctrl+shift+l" resizes to Large', async () => {
        const sgViewport = await $('#sg-viewport');

        await browser.keys(['Control', 'Shift', 'l']);
        await browser.pause(1000);

        expect((await sgViewport.getSize()).width).to.equal(1280);
      });

      it('"ctrl+shift+m" resizes to Medium', async () => {
        const sgViewport = await $('#sg-viewport');

        await browser.keys(['Control', 'Shift', 'm']);
        await browser.pause(1000);

        expect((await sgViewport.getSize()).width).to.equal(1024);
      });

      it('"ctrl+shift+s" resizes to Small', async () => {
        const sgViewport = await $('#sg-viewport');

        await browser.keys(['Control', 'Shift', 's']);
        await browser.pause(1000);

        expect((await sgViewport.getSize()).width).to.equal(767);
      });

      it('"ctrl+alt+0" resizes to XXSmall', async () => {
        const sgViewport = await $('#sg-viewport');

        await browser.keys(['Control', 'Alt', '0']);
        await browser.pause(1000);

        expect((await sgViewport.getSize()).width).to.equal(320);
      });

      it('"ctrl+shift+x" resizes to XSmall', async () => {
        const sgViewport = await $('#sg-viewport');

        await browser.keys(['Control', 'Shift', 'x']);
        await browser.pause(1000);

        expect((await sgViewport.getSize()).width).to.equal(480);
      });

      it('"ctrl+shift+0" resizes to XXSmall', async () => {
        const sgViewport = await $('#sg-viewport');

        await browser.keys(['Control', 'Shift', '0']);
        await browser.pause(1000);

        expect((await sgViewport.getSize()).width).to.equal(320);
      });

      it('"ctrl+alt+r" resizes to a random width', async () => {
        const sgViewport = await $('#sg-viewport');
        const sgViewportWidthBefore = (await sgViewport.getSize()).width;

        await browser.keys(['Control', 'Alt', 'r']);
        await browser.pause(1000);

        const sgViewportWidthAfter = (await sgViewport.getSize()).width;

        expect(sgViewportWidthBefore).to.not.equal(sgViewportWidthAfter);
        expect(sgViewportWidthAfter).to.be.a('number');
        expect(sgViewportWidthAfter).to.be.at.least(240);
        expect(sgViewportWidthAfter).to.be.below(1300);
      });

      it('"ctrl+alt+w" resizes to whole width', async () => {
        const sgViewport = await $('#sg-viewport');

        await browser.keys(['Control', 'Alt', 'w']);
        await browser.pause(1000);

        expect((await sgViewport.getSize()).width).to.equal(1300);
      });

      it('"ctrl+shift+d" toggles disco mode on and off', async () => {
        const sgViewport = await $('#sg-viewport');
        const sgViewportWidth0 = (await sgViewport.getSize()).width;

        await browser.keys(['Control', 'Shift', 'd']);
        await browser.pause(1000);

        const sgViewportWidth1 = (await sgViewport.getSize()).width;

        expect(sgViewportWidth0).to.not.equal(sgViewportWidth1);

        await browser.keys(['Control', 'Shift', 'd']);
        await browser.pause(1000);

        const sgViewportWidth2 = (await sgViewport.getSize()).width;

        expect(sgViewportWidth1).to.not.equal(sgViewportWidth2);

        await browser.pause(1000);

        const sgViewportWidth3 = (await sgViewport.getSize()).width;

        expect(sgViewportWidth2).to.equal(sgViewportWidth3);
      });

      it('"ctrl+shift+w" resizes to whole width', async () => {
        const sgViewport = await $('#sg-viewport');

        await browser.keys(['Control', 'Shift', 'w']);
        await browser.pause(1000);

        expect((await sgViewport.getSize()).width).to.equal(1300);
      });

      it('"ctrl+alt+g" toggles grow mode on and off', async () => {
        const sgViewport = await $('#sg-viewport');
        const sgViewportWidth0 = (await sgViewport.getSize()).width;

        await browser.keys(['Control', 'Alt', 'g']);
        await browser.pause(1000);

        const sgViewportWidth1 = (await sgViewport.getSize()).width;

        expect(sgViewportWidth0).to.not.equal(sgViewportWidth1);

        await browser.pause(1000);
        await browser.keys(['Control', 'Alt', 'g']);

        const sgViewportWidth2 = (await sgViewport.getSize()).width;

        expect(sgViewportWidth1).to.not.equal(sgViewportWidth2);

        await browser.pause(1000);

        const sgViewportWidth3 = (await sgViewport.getSize()).width;

        expect(sgViewportWidth2).to.equal(sgViewportWidth3);
      });
    });
  });

  describe('urlHandler', () => {
    before(async () => {
      await browser.setWindowSize(1024, 768);
    });

    it('handles history correctly for back and forward buttons', async () => {
      const sgNavElements = await $('.sg-nav-elements');
      const sgNavCompounds = await $('.sg-nav-compounds');
      const sgNavComponents = await $('.sg-nav-components');
      const sgAccHandleElements = await sgNavElements.$('.sg-acc-handle');
      const sgAccHandleCompounds = await sgNavCompounds.$('.sg-acc-handle');
      const sgAccHandleComponents = await sgNavComponents.$('.sg-acc-handle');
      const sgPopElements = await sgNavElements.$('.sg-pop');
      const sgPopCompounds = await sgNavCompounds.$('.sg-pop');
      const sgPopComponents = await sgNavComponents.$('.sg-pop');
      const sgRaw = await $('#sg-raw');

      await sgAccHandleElements.click();
      await browser.pause(100);
      await sgPopElements.click();
      await sgAccHandleCompounds.click();
      await browser.pause(100);
      await sgPopCompounds.click();
      await sgAccHandleComponents.click();
      await browser.pause(100);
      await sgPopComponents.click();
      await browser.pause(100);
      await browser.back()

      expect(await sgRaw.getAttribute('href'))
        .to.equal('patterns/01-compounds-block/01-compounds-block.html')

      await browser.back();

      expect(await sgRaw.getAttribute('href'))
        .to.equal('patterns/00-elements-paragraph/00-elements-paragraph.html');

      await browser.forward();

      expect(await sgRaw.getAttribute('href'))
        .to.equal('patterns/01-compounds-block/01-compounds-block.html');

      await browser.forward();

      expect(await sgRaw.getAttribute('href'))
        .to.equal('patterns/02-components-region/02-components-region.html');
    });
  });
});
