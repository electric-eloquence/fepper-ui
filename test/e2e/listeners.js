const pauseLg = 1000;
const pauseMd = 500;
const pauseSm = 100;

describe('Listeners end-to-end tests', () => {
  describe('annotationsViewer', () => {
    describe('click', () => {
      before(async () => {
        await browser.setWindowSize(1024, 768);
      });

      it('dock-right button docks the viewer to the right', async () => {
        const sgTToggle = await $('#sg-t-toggle');
        const sgTAnnotations = await $('#sg-t-annotations');

        await sgTToggle.waitForClickable();
        await sgTToggle.click();
        await sgTAnnotations.waitForClickable();
        await sgTAnnotations.click();
        await browser.pause(pauseMd);

        const patternlabBody = await $('#patternlab-body');
        const sgViewport = await $('#sg-viewport');

        expect(await patternlabBody.getAttribute('class')).to.not.have.string('dock-right');
        expect((await sgViewport.getSize()).width).to.equal(1024);

        const sgViewBtnDockRight = await $('#sg-view-btn-dock-right');

        await sgViewBtnDockRight.waitForClickable();
        await sgViewBtnDockRight.click();
        await browser.pause(pauseLg);

        const sgGenContainer = await $('#sg-gen-container');

        expect(await patternlabBody.getAttribute('class')).to.have.string('dock-right');
        expect((await sgGenContainer.getSize()).width).to.equal(512);
      });

      it('dock-left button docks the viewer to the left', async () => {
        const sgFormLabel = await $('#sg-form-label');
        const sgSizeW = await $('#sg-size-w');

        await sgFormLabel.waitForClickable();
        await sgFormLabel.click();
        await sgSizeW.waitForClickable();
        await sgSizeW.click();
        await browser.pause(pauseLg);

        const patternlabBody = await $('#patternlab-body');
        const sgViewport = await $('#sg-viewport');

        expect(await patternlabBody.getAttribute('class')).to.not.have.string('dock-left');
        expect((await sgViewport.getSize()).width).to.equal(1024);

        const sgViewBtnDockLeft = await $('#sg-view-btn-dock-left');

        await sgViewBtnDockLeft.waitForClickable();
        await sgViewBtnDockLeft.click();
        await browser.pause(pauseLg);

        const sgGenContainer = await $('#sg-gen-container');

        expect(await patternlabBody.getAttribute('class')).to.have.string('dock-left');
        expect((await sgGenContainer.getSize()).width).to.equal(512);
      });

      it('dock-bottom button docks the viewer to the bottom', async () => {
        const sgViewBtnDockBottom = await $('#sg-view-btn-dock-bottom');
        const sgFormLabel = await $('#sg-form-label');
        const sgSizeW = await $('#sg-size-w');

        await sgViewBtnDockBottom.waitForClickable();
        await sgViewBtnDockBottom.click();
        await sgFormLabel.waitForClickable();
        await sgFormLabel.click();
        await sgSizeW.waitForClickable();
        await sgSizeW.click();
        await browser.pause(pauseLg);

        const patternlabBody = await $('#patternlab-body');

        expect(await patternlabBody.getAttribute('class')).to.have.string('dock-bottom');
      });

      it('close button closes annotations viewer', async () => {
        const sgTToggle = await $('#sg-t-toggle');
        const sgTAnnotations = await $('#sg-t-annotations');

        await sgTToggle.waitForClickable();
        await sgTToggle.click();
        await sgTAnnotations.waitForClickable();
        await sgTAnnotations.click();
        await browser.pause(pauseMd);

        const sgVpWrap = await $('#sg-vp-wrap');
        const sgViewContainer = await $('#sg-view-container');

        expect((await sgVpWrap.getCSSProperty('padding-bottom')).value).to.equal('322px');
        expect((await sgViewContainer.getCSSProperty('bottom')).value).to.equal('0px');

        const sgViewBtnClose = await $('#sg-view-btn-close');

        await sgViewBtnClose.waitForClickable();
        await sgViewBtnClose.click();
        await browser.pause(pauseMd);

        expect((await sgVpWrap.getCSSProperty('padding-bottom')).value).to.equal('0px');
        expect((await sgViewContainer.getCSSProperty('bottom')).value).to.equal('636px');
      });
    });

    describe('Mousetrap', () => {
      before(async () => {
        await browser.setWindowSize(1024, 768);
      });

      it('"ctrl+shift+a" toggles annotations viewer', async () => {
        await browser.keys(['Control', 'Shift', 'a']);
        await browser.pause(pauseMd);

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

        await browser.keys(['Control', 'Shift', 'a']);
        await browser.pause(pauseMd);

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
        const sgTToggle = await $('#sg-t-toggle');
        const sgTCode = await $('#sg-t-code');

        await sgTToggle.waitForClickable();
        await sgTToggle.click();
        await sgTCode.waitForClickable();
        await sgTCode.click();
        await browser.pause(pauseMd);

        const patternlabBody = await $('#patternlab-body');
        const sgViewport = await $('#sg-viewport');

        expect(await patternlabBody.getAttribute('class')).to.not.have.string('dock-right');
        expect((await sgViewport.getSize()).width).to.equal(1024);

        const sgViewBtnDockRight = await $('#sg-view-btn-dock-right');

        await sgViewBtnDockRight.waitForClickable();
        await sgViewBtnDockRight.click();
        await browser.pause(pauseLg);

        const sgGenContainer = await $('#sg-gen-container');

        expect(await patternlabBody.getAttribute('class')).to.have.string('dock-right');
        expect((await sgGenContainer.getSize()).width).to.equal(512);
      });

      it('dock-left button docks the viewer to the left', async () => {
        const sgFormLabel = await $('#sg-form-label');
        const sgSizeW = await $('#sg-size-w');

        await sgFormLabel.waitForClickable();
        await sgFormLabel.click();
        await sgSizeW.waitForClickable();
        await sgSizeW.click();
        await browser.pause(pauseLg);

        const patternlabBody = await $('#patternlab-body');
        const sgViewport = await $('#sg-viewport');

        expect(await patternlabBody.getAttribute('class')).to.not.have.string('dock-left');
        expect((await sgViewport.getSize()).width).to.equal(1024);

        const sgViewBtnDockLeft = await $('#sg-view-btn-dock-left');

        await sgViewBtnDockLeft.waitForClickable();
        await sgViewBtnDockLeft.click();
        await browser.pause(pauseLg);

        const sgGenContainer = await $('#sg-gen-container');

        expect(await patternlabBody.getAttribute('class')).to.have.string('dock-left');
        expect((await sgGenContainer.getSize()).width).to.equal(512);
      });

      it('dock-bottom button docks the viewer to the bottom', async () => {
        const sgViewBtnDockBottom = await $('#sg-view-btn-dock-bottom');
        const sgFormLabel = await $('#sg-form-label');
        const sgSizeW = await $('#sg-size-w');

        await sgViewBtnDockBottom.waitForClickable();
        await sgViewBtnDockBottom.click();
        await sgFormLabel.waitForClickable();
        await sgFormLabel.click();
        await sgSizeW.waitForClickable();
        await sgSizeW.click();
        await browser.pause(pauseLg);

        const patternlabBody = await $('#patternlab-body');

        expect(await patternlabBody.getAttribute('class')).to.have.string('dock-bottom');
      });

      it('close button closes code viewer', async () => {
        const sgTToggle = await $('#sg-t-toggle');
        const sgTCode = await $('#sg-t-code');

        await sgTToggle.waitForClickable();
        await sgTToggle.click();
        await sgTCode.waitForClickable();
        await sgTCode.click();
        await browser.pause(pauseMd);

        const sgVpWrap = await $('#sg-vp-wrap');
        const sgViewContainer = await $('#sg-view-container');

        expect((await sgVpWrap.getCSSProperty('padding-bottom')).value).to.equal('322px');
        expect((await sgViewContainer.getCSSProperty('bottom')).value).to.equal('0px');

        const sgViewBtnClose = await $('#sg-view-btn-close');

        await sgViewBtnClose.waitForClickable();
        await sgViewBtnClose.click();
        await browser.pause(pauseMd);

        expect((await sgVpWrap.getCSSProperty('padding-bottom')).value).to.equal('0px');
        expect((await sgViewContainer.getCSSProperty('bottom')).value).to.equal('636px');
      });

      it('feplet and markdown tabs activate their respective panels', async () => {
        const sgTToggle = await $('#sg-t-toggle');
        const sgTCode = await $('#sg-t-code');
        const sgCodeTabMarkdown = await $('#sg-code-tab-markdown');

        await sgTToggle.waitForClickable();
        await sgTToggle.click();
        await sgTCode.waitForClickable();
        await sgTCode.click();
        await browser.pause(pauseMd);
        await sgCodeTabMarkdown.waitForClickable();
        await sgCodeTabMarkdown.click();

        const sgCodeTabFeplet = await $('#sg-code-tab-feplet');
        const sgCodePanelFeplet = await $('#sg-code-panel-feplet');
        const sgCodePanelMarkdown = await $('#sg-code-panel-markdown');

        expect(await sgCodeTabFeplet.getAttribute('class')).to.not.have.string('sg-code-tab-active');
        expect(await sgCodeTabMarkdown.getAttribute('class')).to.have.string('sg-code-tab-active');
        expect(await sgCodePanelFeplet.getAttribute('class')).to.not.have.string('sg-code-panel-active');
        expect(await sgCodePanelMarkdown.getAttribute('class')).to.have.string('sg-code-panel-active');

        await sgCodeTabFeplet.waitForClickable();
        await sgCodeTabFeplet.click();

        expect(await sgCodeTabFeplet.getAttribute('class')).to.have.string('sg-code-tab-active');
        expect(await sgCodeTabMarkdown.getAttribute('class')).to.not.have.string('sg-code-tab-active');
        expect(await sgCodePanelFeplet.getAttribute('class')).to.have.string('sg-code-panel-active');
        expect(await sgCodePanelMarkdown.getAttribute('class')).to.not.have.string('sg-code-panel-active');
      });

      it('the markdown edit button activates the markdown edit pane', async () => {
        const sgTToggle = await $('#sg-t-toggle');
        const sgTCode = await $('#sg-t-code');
        const sgCodeTabMarkdown = await $('#sg-code-tab-markdown');
        const sgCodeBtnMarkdownEdit = await $('#sg-code-btn-markdown-edit');

        await sgTToggle.waitForClickable();
        await sgTToggle.click();
        await sgTCode.waitForClickable();
        await sgTCode.click();
        await browser.pause(pauseMd);
        await sgCodeTabMarkdown.waitForClickable();
        await sgCodeTabMarkdown.click();
        await sgCodeBtnMarkdownEdit.waitForClickable();
        await sgCodeBtnMarkdownEdit.click();

        const sgCodePaneMarkdown = await $('#sg-code-pane-markdown');
        const sgCodePaneMarkdownEdit = await $('#sg-code-pane-markdown-edit');

        expect((await sgCodePaneMarkdown.getCSSProperty('display')).value).to.equal('none');
        expect((await sgCodePaneMarkdownEdit.getCSSProperty('display')).value).to.equal('block');
      });

      it('the markdown edit cancel button exits the markdown edit pane', async () => {
        const sgTToggle = await $('#sg-t-toggle');
        const sgTCode = await $('#sg-t-code');
        const sgCodeTabMarkdown = await $('#sg-code-tab-markdown');
        const sgCodeBtnMarkdownEdit = await $('#sg-code-btn-markdown-edit');
        const sgCodeBtnMarkdownSaveCancel = await $('#sg-code-btn-markdown-save-cancel');

        await sgTToggle.waitForClickable();
        await sgTToggle.click();
        await sgTCode.waitForClickable();
        await sgTCode.click();
        await browser.pause(pauseMd);
        await sgCodeTabMarkdown.waitForClickable();
        await sgCodeTabMarkdown.click();
        await sgCodeBtnMarkdownEdit.waitForClickable();
        await sgCodeBtnMarkdownEdit.click();
        await sgCodeBtnMarkdownSaveCancel.waitForClickable();
        await sgCodeBtnMarkdownSaveCancel.click();

        const sgCodePaneMarkdown = await $('#sg-code-pane-markdown');
        const sgCodePaneMarkdownEdit = await $('#sg-code-pane-markdown-edit');

        expect((await sgCodePaneMarkdown.getCSSProperty('display')).value).to.equal('block');
        expect((await sgCodePaneMarkdownEdit.getCSSProperty('display')).value).to.equal('none');
      });

      it('the markdown edit save button exits the markdown edit pane if markdown unchanged', async () => {
        const sgTToggle = await $('#sg-t-toggle');
        const sgTCode = await $('#sg-t-code');
        const sgCodeTabMarkdown = await $('#sg-code-tab-markdown');
        const sgCodeBtnMarkdownEdit = await $('#sg-code-btn-markdown-edit');
        const sgCodeBtnMarkdownSave = await $('#sg-code-btn-markdown-save');

        await sgTToggle.waitForClickable();
        await sgTToggle.click();
        await sgTCode.waitForClickable();
        await sgTCode.click();
        await browser.pause(pauseMd);
        await sgCodeTabMarkdown.waitForClickable();
        await sgCodeTabMarkdown.click();
        await sgCodeBtnMarkdownEdit.waitForClickable();
        await sgCodeBtnMarkdownEdit.click();
        await sgCodeBtnMarkdownSave.waitForClickable();
        await sgCodeBtnMarkdownSave.click();

        const sgCodePaneMarkdownLoadAnim = await $('#sg-code-pane-markdown-load-anim');
        const sgCodePaneMarkdownEdit = await $('#sg-code-pane-markdown-edit');

        expect((await sgCodePaneMarkdownLoadAnim.getCSSProperty('display')).value).to.equal('block');
        expect((await sgCodePaneMarkdownEdit.getCSSProperty('display')).value).to.equal('none');
      });

      it('the markdown edit save button exits the markdown edit pane if edited markdown is saved', async () => {
        const sgTToggle = await $('#sg-t-toggle');
        const sgTCode = await $('#sg-t-code');
        const sgCodeTabMarkdown = await $('#sg-code-tab-markdown');
        const sgCodeBtnMarkdownEdit = await $('#sg-code-btn-markdown-edit');
        const sgCodeTextareaMarkdown = await $('#sg-code-textarea-markdown');
        const sgCodeBtnMarkdownSave = await $('#sg-code-btn-markdown-save');

        await sgTToggle.waitForClickable();
        await sgTToggle.click();
        await sgTCode.waitForClickable();
        await sgTCode.click();
        await browser.pause(pauseMd);
        await sgCodeTabMarkdown.waitForClickable();
        await sgCodeTabMarkdown.click();
        await sgCodeBtnMarkdownEdit.waitForClickable();
        await sgCodeBtnMarkdownEdit.click();
        await sgCodeTextareaMarkdown.addValue('\n');
        await sgCodeBtnMarkdownSave.waitForClickable();
        await sgCodeBtnMarkdownSave.click();

        const sgCodePaneMarkdownLoadAnim = await $('#sg-code-pane-markdown-load-anim');
        const sgCodePaneMarkdownEdit = await $('#sg-code-pane-markdown-edit');

        expect((await sgCodePaneMarkdownLoadAnim.getCSSProperty('display')).value).to.equal('block');
        expect((await sgCodePaneMarkdownEdit.getCSSProperty('display')).value).to.equal('none');
      });

      it('the git tab activates the git panel', async () => {
        const sgTToggle = await $('#sg-t-toggle');
        const sgTCode = await $('#sg-t-code');
        const sgCodeTabGit = await $('#sg-code-tab-git');

        await sgTToggle.waitForClickable();
        await sgTToggle.click();
        await sgTCode.waitForClickable();
        await sgTCode.click();
        await browser.pause(pauseMd);
        await sgCodeTabGit.waitForClickable();
        await sgCodeTabGit.click();

        const sgCodePanelGit = await $('#sg-code-panel-git');
        const sgCodePaneGitNa = await $('#sg-code-pane-git-na');

        expect((await sgCodePanelGit.getCSSProperty('display')).value).to.equal('block');
        expect((await sgCodePaneGitNa.getCSSProperty('display')).value).to.equal('block');
      });
    });

    describe('Mousetrap', () => {
      before(async () => {
        await browser.setWindowSize(1024, 768);
      });

      it('"ctrl+shift+c" toggles code viewer', async () => {
        await browser.keys(['Control', 'Shift', 'c']);
        await browser.pause(pauseMd);

        const sgVpWrap = await $('#sg-vp-wrap');
        const sgViewContainer = await $('#sg-view-container');

        expect((await sgVpWrap.getCSSProperty('padding-bottom')).value).to.equal('322px');
        expect((await sgViewContainer.getCSSProperty('bottom')).value).to.equal('0px');
        expect(await sgViewContainer.getAttribute('class')).to.have.string('anim-ready');

        await browser.keys(['Control', 'Shift', 'c']);
        await browser.pause(pauseMd);

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
        const sgTToggle = await $('#sg-t-toggle');
        const sgTCode = await $('#sg-t-code');
        const sgCodeTabFeplet = await $('#sg-code-tab-feplet');

        await sgTToggle.waitForClickable();
        await sgTToggle.click();
        await sgTCode.waitForClickable();
        await sgTCode.click();
        await browser.pause(pauseMd);
        await sgCodeTabFeplet.waitForClickable();
        await sgCodeTabFeplet.click();
        await browser.switchToFrame(await $('#sg-code-panel-feplet'));

        const languageMarkupA = await $('.language-markup a');
        const sgRaw = await $('#sg-raw');

        await languageMarkupA.waitForClickable();
        await languageMarkupA.click();
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

        await sgAccHandle.waitForClickable();
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

        await sgFToggle.waitForClickable();
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

        await sgFToggle.waitForClickable();
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
        const sgSizeW = await $('#sg-size-w');

        await sgSizeW.waitForClickable();
        await sgSizeW.click();

        const sgViewport = await $('#sg-viewport');

        expect((await sgViewport.getSize()).width).to.equal(1200);

        await browser.setWindowSize(1300, 768);

        expect((await sgViewport.getSize()).width).to.equal(1300);
      });
    });

    describe('.sg-pop click', () => {
      before(async () => {
        await browser.setWindowSize(1300, 768);
      });

      it('loads pattern', async () => {
        const sgNavElements = await $('.sg-nav-elements');
        const sgAccHandle = await sgNavElements.$('.sg-acc-handle');
        const sgPop = await sgNavElements.$('.sg-pop');

        await sgAccHandle.waitForClickable();
        await sgAccHandle.click();
        await sgPop.waitForClickable();
        await sgPop.click();
        await browser.pause(pauseSm);

        const sgRaw = await $('#sg-raw');

        expect(await sgRaw.getAttribute('href'))
          .to.equal('patterns/00-elements-paragraph/00-elements-paragraph.html');
      });

      it('closes open nav menu', async () => {
        const sgNavCompounds = await $('.sg-nav-compounds');
        const sgAccHandle = await sgNavCompounds.$('.sg-acc-handle');
        const sgAccPanel = await sgNavCompounds.$('.sg-acc-panel');

        await sgAccHandle.waitForClickable();
        await sgAccHandle.click();

        expect(await sgAccHandle.getAttribute('class')).to.have.string('active');
        expect(await sgAccPanel.getAttribute('class')).to.have.string('active');

        const sgPop = await sgNavCompounds.$('.sg-pop');

        await sgPop.waitForClickable();
        await sgPop.click();

        expect(await sgAccHandle.getAttribute('class')).to.not.have.string('active');
        expect(await sgAccPanel.getAttribute('class')).to.not.have.string('active');
      });
    });

    describe('viewport resizer buttons', () => {
      before(async () => {
        await browser.setWindowSize(1300, 768);
      });

      it('LG button resizes to Large', async () => {
        const sgSizeLg = await $('#sg-size-lg');

        await sgSizeLg.waitForClickable();
        await sgSizeLg.click();
        await browser.pause(pauseLg);

        const sgViewport = await $('#sg-viewport');

        expect((await sgViewport.getSize()).width).to.equal(1280);
      });

      it('MD button resizes to Medium', async () => {
        const sgSizeMd = await $('#sg-size-md');

        await sgSizeMd.waitForClickable();
        await sgSizeMd.click();
        await browser.pause(pauseLg);

        const sgViewport = await $('#sg-viewport');

        expect((await sgViewport.getSize()).width).to.equal(1024);
      });

      it('SM button resizes to Small', async () => {
        const sgSizeSm = await $('#sg-size-sm');

        await sgSizeSm.waitForClickable();
        await sgSizeSm.click();
        await browser.pause(pauseLg);

        const sgViewport = await $('#sg-viewport');

        expect((await sgViewport.getSize()).width).to.equal(767);
      });

      it('XS button resizes to XSmall', async () => {
        const sgSizeXs = await $('#sg-size-xs');

        await sgSizeXs.waitForClickable();
        await sgSizeXs.click();
        await browser.pause(pauseLg);

        const sgViewport = await $('#sg-viewport');

        expect((await sgViewport.getSize()).width).to.equal(480);
      });

      it('XX button resizes to XXSmall', async () => {
        const sgSizeXx = await $('#sg-size-xx');

        await sgSizeXx.waitForClickable();
        await sgSizeXx.click();
        await browser.pause(pauseLg);

        const sgViewport = await $('#sg-viewport');

        expect((await sgViewport.getSize()).width).to.equal(320);
      });
    });

    // Test the viewport sizes in reverse to reduce the distance shrinking from 1300 in the previous tests.
    describe('Mousetrap', () => {
      before(async () => {
        await browser.setWindowSize(1300, 768);
      });

      it('"ctrl+shift+l" resizes to Large', async () => {
        await browser.keys(['Control', 'Shift', 'l']);
        await browser.pause(pauseLg);

        const sgViewport = await $('#sg-viewport');

        expect((await sgViewport.getSize()).width).to.equal(1280);
      });

      it('"ctrl+shift+m" resizes to Medium', async () => {
        await browser.keys(['Control', 'Shift', 'm']);
        await browser.pause(pauseLg);

        const sgViewport = await $('#sg-viewport');

        expect((await sgViewport.getSize()).width).to.equal(1024);
      });

      it('"ctrl+shift+s" resizes to Small', async () => {
        await browser.keys(['Control', 'Shift', 's']);
        await browser.pause(pauseLg);

        const sgViewport = await $('#sg-viewport');

        expect((await sgViewport.getSize()).width).to.equal(767);
      });

      it('"ctrl+alt+0" resizes to XXSmall', async () => {
        await browser.keys(['Control', 'Alt', '0']);
        await browser.pause(pauseLg);

        const sgViewport = await $('#sg-viewport');

        expect((await sgViewport.getSize()).width).to.equal(320);
      });

      it('"ctrl+shift+x" resizes to XSmall', async () => {
        await browser.keys(['Control', 'Shift', 'x']);
        await browser.pause(pauseLg);

        const sgViewport = await $('#sg-viewport');

        expect((await sgViewport.getSize()).width).to.equal(480);
      });

      it('"ctrl+shift+0" resizes to XXSmall', async () => {
        await browser.keys(['Control', 'Shift', '0']);
        await browser.pause(pauseLg);

        const sgViewport = await $('#sg-viewport');

        expect((await sgViewport.getSize()).width).to.equal(320);
      });

      it('"ctrl+alt+r" resizes to a random width', async () => {
        const sgViewport = await $('#sg-viewport');
        const sgViewportWidthBefore = (await sgViewport.getSize()).width;

        await browser.keys(['Control', 'Alt', 'r']);
        await browser.pause(pauseLg);

        const sgViewportWidthAfter = (await sgViewport.getSize()).width;

        expect(sgViewportWidthBefore).to.not.equal(sgViewportWidthAfter);
        expect(sgViewportWidthAfter).to.be.a('number');
        expect(sgViewportWidthAfter).to.be.at.least(240);
        expect(sgViewportWidthAfter).to.be.below(1300);
      });

      it('"ctrl+alt+w" resizes to whole width', async () => {
        await browser.keys(['Control', 'Alt', 'w']);
        await browser.pause(pauseLg);

        const sgViewport = await $('#sg-viewport');

        expect((await sgViewport.getSize()).width).to.equal(1300);
      });

      it('"ctrl+shift+d" toggles disco mode on and off', async () => {
        const sgViewport = await $('#sg-viewport');
        const sgViewportWidth0 = (await sgViewport.getSize()).width;

        await browser.keys(['Control', 'Shift', 'd']);
        await browser.pause(pauseLg);

        const sgViewportWidth1 = (await sgViewport.getSize()).width;

        expect(sgViewportWidth0).to.not.equal(sgViewportWidth1);

        await browser.keys(['Control', 'Shift', 'd']);
        await browser.pause(pauseLg);

        const sgViewportWidth2 = (await sgViewport.getSize()).width;

        expect(sgViewportWidth1).to.not.equal(sgViewportWidth2);

        await browser.pause(pauseLg);

        const sgViewportWidth3 = (await sgViewport.getSize()).width;

        expect(sgViewportWidth2).to.equal(sgViewportWidth3);
      });

      it('"ctrl+shift+w" resizes to whole width', async () => {
        await browser.keys(['Control', 'Shift', 'w']);
        await browser.pause(pauseLg);

        const sgViewport = await $('#sg-viewport');

        expect((await sgViewport.getSize()).width).to.equal(1300);
      });

      it('"ctrl+alt+g" toggles grow mode on and off', async () => {
        const sgViewport = await $('#sg-viewport');
        const sgViewportWidth0 = (await sgViewport.getSize()).width;

        await browser.keys(['Control', 'Alt', 'g']);
        await browser.pause(pauseLg);

        const sgViewportWidth1 = (await sgViewport.getSize()).width;

        expect(sgViewportWidth0).to.not.equal(sgViewportWidth1);

        await browser.pause(pauseLg);
        await browser.keys(['Control', 'Alt', 'g']);

        const sgViewportWidth2 = (await sgViewport.getSize()).width;

        expect(sgViewportWidth1).to.not.equal(sgViewportWidth2);

        await browser.pause(pauseLg);

        const sgViewportWidth3 = (await sgViewport.getSize()).width;

        expect(sgViewportWidth2).to.equal(sgViewportWidth3);
      });
    });
  });

  describe('urlHandler', () => {
    before(async () => {
      await browser.setWindowSize(1024, 768);
    });

    // Chromium-based browsers are buggy with back/forward button behavior after navigation via patternlab.updatePath.
    // The 2nd back or forward button press frequently fails to update the iframe while the parent does get updated.
    // Disabling the following because it unpredictably sometimes passes, and sometimes fails.
    // Will re-enable if Chromium-based browsers ever fix this broken behavior.
    xit('handles history correctly for back and forward buttons', async () => {
      const sgNavElements = await $('.sg-nav-elements');
      const sgNavCompounds = await $('.sg-nav-compounds');
      const sgNavComponents = await $('.sg-nav-components');
      const sgAccHandleElements = await sgNavElements.$('.sg-acc-handle');
      const sgAccHandleCompounds = await sgNavCompounds.$('.sg-acc-handle');
      const sgAccHandleComponents = await sgNavComponents.$('.sg-acc-handle');
      const sgPopElements = await sgNavElements.$('.sg-pop');
      const sgPopCompounds = await sgNavCompounds.$('.sg-pop');
      const sgPopComponents = await sgNavComponents.$('.sg-pop');

      await sgAccHandleElements.waitForClickable();
      await sgAccHandleElements.click();
      await sgPopElements.waitForClickable();
      await sgPopElements.click();
      await sgAccHandleCompounds.waitForClickable();
      await sgAccHandleCompounds.click();
      await sgPopCompounds.waitForClickable();
      await sgPopCompounds.click();
      await sgAccHandleComponents.waitForClickable();
      await sgAccHandleComponents.click();
      await sgPopComponents.waitForClickable();
      await sgPopComponents.click();
      await browser.pause(pauseSm);
      await browser.back();

      const sgRaw = await $('#sg-raw');

      expect(await sgRaw.getAttribute('href'))
        .to.equal('patterns/01-compounds-block/01-compounds-block.html');

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
