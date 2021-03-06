describe('Listeners end-to-end tests', function () {
  describe('annotationsViewer', function () {
    describe('click', function () {
      before(function () {
        browser.setWindowSize(1024, 768);
      });

      it('dock-right button docks the viewer to the right', function () {
        $('#sg-t-toggle').click();
        browser.pause(100);
        $('#sg-t-annotations').click();
        browser.pause(100);
        expect($('#patternlab-body').getAttribute('class')).to.not.have.string('dock-right');
        expect($('#sg-viewport').getSize().width).to.equal(1024);
        $('#sg-view-btn-dock-right').click();
        browser.pause(1000);
        expect($('#patternlab-body').getAttribute('class')).to.have.string('dock-right');
        expect($('#sg-gen-container').getSize().width).to.equal(512);
      });

      it('dock-left button docks the viewer to the left', function () {
        $('#sg-form-label').click();
        browser.pause(100);
        $('#sg-size-w').click();
        browser.pause(1000);
        expect($('#patternlab-body').getAttribute('class')).to.not.have.string('dock-left');
        expect($('#sg-viewport').getSize().width).to.equal(1024);
        $('#sg-view-btn-dock-left').click();
        browser.pause(1000);
        expect($('#patternlab-body').getAttribute('class')).to.have.string('dock-left');
        expect($('#sg-gen-container').getSize().width).to.equal(512);
      });

      it('dock-bottom button docks the viewer to the bottom', function () {
        $('#sg-view-btn-dock-bottom').click();
        browser.pause(100);
        $('#sg-form-label').click();
        browser.pause(100);
        $('#sg-size-w').click();
        browser.pause(1000);
        expect($('#patternlab-body').getAttribute('class')).to.have.string('dock-bottom');
      });

      it('close button closes annotations viewer', function () {
        $('#sg-t-toggle').click();
        browser.pause(100);
        $('#sg-t-annotations').click();
        browser.pause(700);
        expect($('#sg-vp-wrap').getCSSProperty('padding-bottom').value).to.equal('322.5px');
        expect($('#sg-view-container').getCSSProperty('bottom').value).to.equal('0px');
        $('#sg-view-btn-close').click();
        browser.pause(700);
        expect($('#sg-vp-wrap').getCSSProperty('padding-bottom').value).to.equal('0px');
        expect($('#sg-view-container').getCSSProperty('bottom').value).to.equal('637px');
      });
    });

    describe('Mousetrap', function () {
      before(function () {
        browser.setWindowSize(1024, 768);
      });

      it('"ctrl+shift+a" toggles annotations viewer', function () {
        browser.keys(['Control', 'Shift', 'a']);
        browser.pause(700);
        expect($('#sg-vp-wrap').getCSSProperty('padding-bottom').value).to.equal('322.5px');
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
        expect($('#sg-view-container').getCSSProperty('bottom').value).to.equal('637px');
      });
    });
  });

  describe('codeViewer', function () {
    describe('click', function () {
      before(function () {
        browser.setWindowSize(1024, 768);
      });

      it('dock-right button docks the viewer to the right', function () {
        $('#sg-t-toggle').click();
        browser.pause(100);
        $('#sg-t-code').click();
        browser.pause(100);
        expect($('#patternlab-body').getAttribute('class')).to.not.have.string('dock-right');
        expect($('#sg-viewport').getSize().width).to.equal(1024);
        $('#sg-view-btn-dock-right').click();
        browser.pause(1000);
        expect($('#patternlab-body').getAttribute('class')).to.have.string('dock-right');
        expect($('#sg-gen-container').getSize().width).to.equal(512);
      });

      it('dock-left button docks the viewer to the left', function () {
        $('#sg-form-label').click();
        browser.pause(100);
        $('#sg-size-w').click();
        browser.pause(1000);
        expect($('#patternlab-body').getAttribute('class')).to.not.have.string('dock-left');
        expect($('#sg-viewport').getSize().width).to.equal(1024);
        $('#sg-view-btn-dock-left').click();
        browser.pause(1000);
        expect($('#patternlab-body').getAttribute('class')).to.have.string('dock-left');
        expect($('#sg-gen-container').getSize().width).to.equal(512);
      });

      it('dock-bottom button docks the viewer to the bottom', function () {
        $('#sg-view-btn-dock-bottom').click();
        browser.pause(700);
        $('#sg-form-label').click();
        browser.pause(100);
        $('#sg-size-w').click();
        browser.pause(700);
        expect($('#patternlab-body').getAttribute('class')).to.have.string('dock-bottom');
      });

      it('close button closes code viewer', function () {
        $('#sg-t-toggle').click();
        browser.pause(100);
        $('#sg-t-code').click();
        browser.pause(700);
        expect($('#sg-vp-wrap').getCSSProperty('padding-bottom').value).to.equal('322.5px');
        expect($('#sg-view-container').getCSSProperty('bottom').value).to.equal('0px');
        $('#sg-view-btn-close').click();
        browser.pause(700);
        expect($('#sg-vp-wrap').getCSSProperty('padding-bottom').value).to.equal('0px');
        expect($('#sg-view-container').getCSSProperty('bottom').value).to.equal('637px');
      });

      it('feplet and markdown tabs activate their respective panels', function () {
        $('#sg-t-toggle').click();
        browser.pause(100);
        $('#sg-t-code').click();
        browser.pause(700);
        $('#sg-code-tab-markdown').click();
        browser.pause(100);
        expect($('#sg-code-tab-feplet').getAttribute('class')).to.not.have.string('sg-code-tab-active');
        expect($('#sg-code-tab-markdown').getAttribute('class')).to.have.string('sg-code-tab-active');
        expect($('#sg-code-panel-feplet').getAttribute('class')).to.not.have.string('sg-code-panel-active');
        expect($('#sg-code-panel-markdown').getAttribute('class')).to.have.string('sg-code-panel-active');
        $('#sg-code-tab-feplet').click();
        browser.pause(100);
        expect($('#sg-code-tab-feplet').getAttribute('class')).to.have.string('sg-code-tab-active');
        expect($('#sg-code-tab-markdown').getAttribute('class')).to.not.have.string('sg-code-tab-active');
        expect($('#sg-code-panel-feplet').getAttribute('class')).to.have.string('sg-code-panel-active');
        expect($('#sg-code-panel-markdown').getAttribute('class')).to.not.have.string('sg-code-panel-active');
      });

      it('the markdown edit button activates the markdown edit pane', function () {
        $('#sg-t-toggle').click();
        browser.pause(100);
        $('#sg-t-code').click();
        browser.pause(700);
        $('#sg-code-tab-markdown').click();
        browser.pause(100);
        $('#sg-code-btn-markdown-edit').click();
        browser.pause(100);
        expect($('#sg-code-pane-markdown').getCSSProperty('display').value).to.equal('none');
        expect($('#sg-code-pane-markdown-edit').getCSSProperty('display').value).to.equal('block');
      });

      it('the markdown edit cancel button exits the markdown edit pane', function () {
        $('#sg-t-toggle').click();
        browser.pause(100);
        $('#sg-t-code').click();
        browser.pause(700);
        $('#sg-code-tab-markdown').click();
        browser.pause(100);
        $('#sg-code-btn-markdown-edit').click();
        browser.pause(100);
        $('#sg-code-btn-markdown-save-cancel').click();
        browser.pause(100);
        expect($('#sg-code-pane-markdown').getCSSProperty('display').value).to.equal('block');
        expect($('#sg-code-pane-markdown-edit').getCSSProperty('display').value).to.equal('none');
      });

      it('the markdown edit save button exits the markdown edit pane if markdown unchanged', function () {
        $('#sg-t-toggle').click();
        browser.pause(100);
        $('#sg-t-code').click();
        browser.pause(700);
        $('#sg-code-tab-markdown').click();
        browser.pause(100);
        $('#sg-code-btn-markdown-edit').click();
        browser.pause(100);
        $('#sg-code-btn-markdown-save').click();
        browser.pause(100);
        expect($('#sg-code-pane-markdown').getCSSProperty('display').value).to.equal('block');
        expect($('#sg-code-pane-markdown-edit').getCSSProperty('display').value).to.equal('none');
      });

      it('the markdown edit save button exits the markdown edit pane if edited markdown is saved', function () {
        $('#sg-t-toggle').click();
        browser.pause(100);
        $('#sg-t-code').click();
        browser.pause(700);
        $('#sg-code-tab-markdown').click();
        browser.pause(100);
        $('#sg-code-btn-markdown-edit').click();
        browser.pause(100);
        $('#sg-code-textarea-markdown').addValue('\n');
        browser.pause(100);
        $('#sg-code-btn-markdown-save').click();
        browser.pause(100);
        expect($('#sg-code-pane-markdown').getCSSProperty('display').value).to.equal('block');
        expect($('#sg-code-pane-markdown-edit').getCSSProperty('display').value).to.equal('none');
      });

      it('the git tab activates the git panel', function () {
        $('#sg-t-toggle').click();
        browser.pause(100);
        $('#sg-t-code').click();
        browser.pause(700);
        $('#sg-code-tab-git').click();
        browser.pause(100);
        expect($('#sg-code-panel-git').getCSSProperty('display').value).to.equal('block');
        expect($('#sg-code-pane-git-na').getCSSProperty('display').value).to.equal('block');
      });
    });

    describe('Mousetrap', function () {
      before(function () {
        browser.setWindowSize(1024, 768);
      });

      it('"ctrl+shift+c" toggles code viewer', function () {
        browser.keys(['Control', 'Shift', 'c']);
        browser.pause(700);
        expect($('#sg-vp-wrap').getCSSProperty('padding-bottom').value).to.equal('322.5px');
        expect($('#sg-view-container').getCSSProperty('bottom').value).to.equal('0px');
        expect($('#sg-view-container').getAttribute('class')).to.have.string('anim-ready');
        browser.keys(['Control', 'Shift', 'c']);
        browser.pause(700);
        expect($('#sg-vp-wrap').getCSSProperty('padding-bottom').value).to.equal('0px');
        expect($('#sg-view-container').getCSSProperty('bottom').value).to.equal('637px');
        expect($('#sg-view-container').getAttribute('class')).to.not.have.string('anim-ready');
      });
    });
  });

  describe('mustacheBrowser', function () {
    describe('click', function () {
      before(function () {
        browser.setWindowSize(1024, 768);
      });

      it('hot-links partial tags and redirects to the partial\'s pattern page', function () {
        $('#sg-t-toggle').click();
        browser.pause(100);
        $('#sg-t-code').click();
        browser.pause(700);
        $('#sg-code-tab-feplet').click();
        browser.pause(100);
        browser.switchToFrame($('#sg-code-panel-feplet'));
        $('.language-markup a').click();
        browser.pause(100);
        browser.switchToParentFrame();
        expect($('#sg-raw').getAttribute('href'))
          .to.equal('patterns/03-templates-page/03-templates-page.html');
      });
    });
  });

  describe('patternFinder', function () {
    describe('Mousetrap', function () {
      before(function () {
        browser.setWindowSize(1024, 768);
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
        browser.setWindowSize(1200, 768);
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
        browser.setWindowSize(1300, 768);
      });

      it('loads pattern', function () {
        $('.sg-nav-elements').$('.sg-acc-handle').click();
        browser.pause(100);
        $('.sg-nav-elements').$('.sg-pop').click();
        browser.pause(100);
        expect($('#sg-raw').getAttribute('href'))
          .to.equal('patterns/00-elements-paragraph/00-elements-paragraph.html');
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
        browser.setWindowSize(1300, 768);
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
        browser.setWindowSize(1300, 768);
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
      browser.setWindowSize(1024, 768);
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
        .to.equal('patterns/01-compounds-block/01-compounds-block.html');
      browser.back();
      expect($('#sg-raw').getAttribute('href'))
        .to.equal('patterns/00-elements-paragraph/00-elements-paragraph.html');
      browser.forward();
      expect($('#sg-raw').getAttribute('href'))
        .to.equal('patterns/01-compounds-block/01-compounds-block.html');
      browser.forward();
      expect($('#sg-raw').getAttribute('href'))
        .to.equal('patterns/02-components-region/02-components-region.html');
    });
  });
});
