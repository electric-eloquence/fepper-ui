import {expect} from 'chai';

import fepperUi from '../unit';

const $orgs = fepperUi.requerio.$orgs;
const {
  annotationsViewer,
  codeViewer
} = fepperUi;

const timeout = 10;

describe('codeViewer', function () {
  describe('.constructor()', function () {
    it('instantiates correctly', function () {
      expect(codeViewer.constructor.name).to.equal('CodeViewer');
      expect(Object.keys(codeViewer).length).to.equal(9);
      expect(codeViewer).to.have.property('receiveIframeMessage');
      expect(codeViewer).to.have.property('codeActive');
      expect(codeViewer).to.have.property('mdPath');
      expect(codeViewer).to.have.property('$orgs');
      expect(codeViewer).to.have.property('patternPartial');
      expect(codeViewer).to.have.property('requerio');
      expect(codeViewer).to.have.property('stoked');
      expect(codeViewer).to.have.property('tabActive');
      expect(codeViewer).to.have.property('viewall');
    });
  });

  describe('.stoke()', function () {
    beforeEach(function (done) {
      codeViewer.closeCode();

      setTimeout(() => {
        done();
      }, timeout);
    });

    it('opens code viewer with a "view=code" param', function (done) {
      global.location = {
        search: '?view=code'
      };

      const codeActiveBefore = codeViewer.codeActive;
      const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
      const sgTCodeBefore = $orgs['#sg-t-code'].getState();
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

      codeViewer.stoke();

      setTimeout(() => {
        const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
        const sgTCodeAfter = $orgs['#sg-t-code'].getState();
        const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

        expect(codeActiveBefore).to.be.false;
        expect(patternlabBodyBefore.classArray).to.not.include('dock-open');
        expect(sgTCodeBefore.classArray).to.not.include('active');
        expect(sgViewContainerBefore.classArray).to.not.include('anim-ready');

        expect(codeViewer.codeActive).to.be.true;
        expect(patternlabBodyAfter.classArray).to.include('dock-open');
        expect(sgTCodeAfter.classArray).to.include('active');
        expect(sgViewContainerAfter.classArray).to.include('anim-ready');

        done();
      }, timeout);
    });

    it('opens code viewer with a "view=c" param', function (done) {
      global.location = {
        search: '?view=c'
      };

      const codeActiveBefore = codeViewer.codeActive;
      const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
      const sgTCodeBefore = $orgs['#sg-t-code'].getState();
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

      codeViewer.stoke();

      setTimeout(() => {
        const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
        const sgTCodeAfter = $orgs['#sg-t-code'].getState();
        const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

        expect(codeActiveBefore).to.be.false;
        expect(patternlabBodyBefore.classArray).to.not.include('dock-open');
        expect(sgTCodeBefore.classArray).to.not.include('active');
        expect(sgViewContainerBefore.classArray).to.not.include('anim-ready');

        expect(codeViewer.codeActive).to.be.true;
        expect(patternlabBodyAfter.classArray).to.include('dock-open');
        expect(sgTCodeAfter.classArray).to.include('active');
        expect(sgViewContainerAfter.classArray).to.include('anim-ready');

        done();
      }, timeout);
    });

    it('opens code viewer with a "defaultShowPatternInfo": true config', function (done) {
      global.location = {
        search: ''
      };
      codeViewer.uiData.config.defaultShowPatternInfo = true;

      const codeActiveBefore = codeViewer.codeActive;
      const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
      const sgTCodeBefore = $orgs['#sg-t-code'].getState();
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

      codeViewer.stoke();

      setTimeout(() => {
        const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
        const sgTCodeAfter = $orgs['#sg-t-code'].getState();
        const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

        expect(codeActiveBefore).to.be.false;
        expect(patternlabBodyBefore.classArray).to.not.include('dock-open');
        expect(sgTCodeBefore.classArray).to.not.include('active');
        expect(sgViewContainerBefore.classArray).to.not.include('anim-ready');

        expect(codeViewer.codeActive).to.be.true;
        expect(patternlabBodyAfter.classArray).to.include('dock-open');
        expect(sgTCodeAfter.classArray).to.include('active');
        expect(sgViewContainerAfter.classArray).to.include('anim-ready');

        codeViewer.uiData.config.defaultShowPatternInfo = false;

        done();
      }, timeout);
    });
  });

  describe('.activateTabAndPanel()', function () {
    before(function () {
      global.location = {
        protocol: 'http:',
        host: 'localhost:3000',
        search: '?p=pages-homepage'
      };

      codeViewer.stoke();
    });

    // Must test a tab + panel besides the Feplet default first. This way the Feplet tab + panel test can be accurate.
    it('activates the Markdown tab and panel for a pattern with Markdown - also tests .setPanelContent()', function () {
      const panelStateBefore = $orgs['#sg-code-panel-markdown'].getState();
      const tabStateBefore = $orgs['#sg-code-tab-markdown'].getState();

      return codeViewer.activateTabAndPanel('markdown')
        .then(() => {
          const panelStateAfter = $orgs['#sg-code-panel-markdown'].getState();
          const tabStateAfter = $orgs['#sg-code-tab-markdown'].getState();

          expect(panelStateBefore.classArray).to.not.include('sg-code-panel-active');
          expect(tabStateBefore.classArray).to.not.include('sg-code-tab-active');

          expect(panelStateAfter.classArray).to.include('sg-code-panel-active');
          expect(tabStateAfter.classArray).to.include('sg-code-tab-active');
        });
    });

    it('activates the Feplet tab and panel - also tests .setPanelContent()', function () {
      const panelLocationHrefBefore = $orgs['#sg-code-panel-feplet'][0].contentWindow.location.href;
      const panelStateBefore = $orgs['#sg-code-panel-feplet'].getState();
      const tabStateBefore = $orgs['#sg-code-tab-feplet'].getState();
      codeViewer.patternPartial = 'components-region';

      return codeViewer.activateTabAndPanel('feplet')
        .then(() => {
          const panelLocationHrefAfter = $orgs['#sg-code-panel-feplet'][0].contentWindow.location.href;
          const panelStateAfter = $orgs['#sg-code-panel-feplet'].getState();
          const tabStateAfter = $orgs['#sg-code-tab-feplet'].getState();

          expect(panelLocationHrefBefore).to.not.equal(panelLocationHrefAfter);
          expect(panelStateBefore.classArray).to.not.include('sg-code-panel-active');
          expect(tabStateBefore.classArray).to.not.include('sg-code-tab-active');

          expect(panelLocationHrefAfter).to.equal('/mustache-browser?partial=components-region');
          expect(panelStateAfter.classArray).to.include('sg-code-panel-active');
          expect(tabStateAfter.classArray).to.include('sg-code-tab-active');
        });
    });

    it('activates Markdown tab and panel for pattern without Markdown via tabActive cookie on .stoke()\
', function () {
      global.location.search = '?p=elements-paragraph';

      codeViewer.stoke();

      const panelStateBefore = $orgs['#sg-code-panel-markdown'].getState();
      const tabStateBefore = $orgs['#sg-code-tab-markdown'].getState();

      fepperUi.dataSaver.updateValue('tabActive', 'markdown');
      codeViewer.stoke();

      codeViewer.receiveIframeMessage({
        origin: 'http://localhost:3000',
        data: {
          codeViewallClick: 'on',
          lineage: [],
          lineageR: [
            {
              lineagePattern: 'compounds-block',
              lineagePath: 'patterns/01-compounds-block/01-compounds-block.html',
              isHidden: false
            }
          ],
          missingPatterns: [],
          patternPartial: 'elements-paragraph',
          patternState: ''
        }
      });

      const panelStateAfter = $orgs['#sg-code-panel-markdown'].getState();
      const tabStateAfter = $orgs['#sg-code-tab-markdown'].getState();

      expect(panelStateBefore.classArray).to.not.include('sg-code-panel-active');
      expect(tabStateBefore.classArray).to.not.include('sg-code-tab-active');

      expect(panelStateAfter.classArray).to.include('sg-code-panel-active');
      expect(tabStateAfter.classArray).to.include('sg-code-tab-active');
    });

    // No need to test the following when stoked because .stoke() invokes .activateTabAndPanel().
    it('activates Git tab and panel but does not set panel content if not stoked', function () {
      codeViewer.patternPartial = 'elements-paragraph';
      codeViewer.stoked = false;

      $orgs['.sg-code-panel'].dispatchAction('removeClass', 'sg-code-panel-active');
      $orgs['.sg-code-tab'].dispatchAction('removeClass', 'sg-code-tab-active');

      const paneStateBefore = $orgs['#sg-code-pane-git'].getState();
      const panelStateBefore = $orgs['#sg-code-panel-git'].getState();
      const tabStateBefore = $orgs['#sg-code-tab-git'].getState();

      return codeViewer.activateTabAndPanel('git')
        .then(() => {
          const paneStateAfter = $orgs['#sg-code-pane-git'].getState();
          const panelStateAfter = $orgs['#sg-code-panel-git'].getState();
          const tabStateAfter = $orgs['#sg-code-tab-git'].getState();

          expect(paneStateBefore.html).to.equal(paneStateAfter.html);
          expect(panelStateBefore.classArray).to.not.include('sg-code-panel-active');
          expect(tabStateBefore.classArray).to.not.include('sg-code-tab-active');

          expect(paneStateAfter.html).to.be.null;
          expect(panelStateAfter.classArray).to.include('sg-code-panel-active');
          expect(tabStateAfter.classArray).to.include('sg-code-tab-active');
        });
    });
  });

  describe('.activateMarkdownTextarea()', function () {
    it('puts the cursor focus on the Markdown textarea', function () {
      $orgs['#sg-code-pre-language-markdown']
        .dispatchAction('width', 996)
        .dispatchAction('height', 100);

      const documentStateBefore = $orgs.document.getState();
      const textareaStateBefore = $orgs['#sg-code-textarea-markdown'].getState();

      codeViewer.activateMarkdownTextarea('markdown');

      const documentStateAfter = $orgs.document.getState();
      const paneStateAfter = $orgs['#sg-code-pane-markdown'].getState();
      const textareaStateAfter = $orgs['#sg-code-textarea-markdown'].getState();

      expect(documentStateBefore.activeOrganism).to.be.null;
      expect(textareaStateBefore.height).to.not.equal(textareaStateAfter.height);
      expect(textareaStateBefore.css).to.not.have.key('width');

      expect(documentStateAfter.activeOrganism).to.equal('#sg-code-textarea-markdown');
      expect(paneStateAfter.css).to.not.have.key('display');
      expect(textareaStateAfter.height).to.equal(121);
      expect(textareaStateAfter.width).to.equal(996);
    });
  });

  describe('.deActivateMarkdownTextarea()', function () {
    it('removes focus from and hides the Markdown textarea and instead shows the static Markdown pane', function () {
      const documentStateBefore = $orgs.document.getState();
      const paneStateBefore = $orgs['#sg-code-pane-markdown'].getState();
      const paneEditStateBefore = $orgs['#sg-code-pane-markdown-edit'].getState();

      codeViewer.deActivateMarkdownTextarea();

      const documentStateAfter = $orgs.document.getState();
      const paneStateAfter = $orgs['#sg-code-pane-markdown'].getState();
      const paneEditStateAfter = $orgs['#sg-code-pane-markdown-edit'].getState();

      expect(documentStateBefore.activeOrganism).to.equal('#sg-code-textarea-markdown');
      expect(paneStateBefore.css).to.not.have.key('display');
      expect(paneEditStateBefore.css.display).to.equal('block');

      expect(documentStateAfter.activeOrganism).to.be.null;
      expect(paneStateAfter.css.display).to.equal('block');
      expect(paneEditStateAfter.css).to.not.have.key('display');
    });
  });

  describe('.setPanelContent(\'markdown\')', function () {
    it('fails if it does not pass gatekeeper', function () {
      global.mockResponse = {
        gatekeeperStatus: 403
      };

      $orgs['#sg-code-pane-markdown-na'].dispatchAction('css', {display: ''});

      const paneStateBefore = $orgs['#sg-code-pane-markdown'].getState();
      const paneMarkdownNaStateBefore = $orgs['#sg-code-pane-markdown-na'].getState();

      return codeViewer.setPanelContent('markdown')
        .then(() => {
          const paneStateAfter = $orgs['#sg-code-pane-markdown'].getState();
          const paneMarkdownNaStateAfter = $orgs['#sg-code-pane-markdown-na'].getState();

          expect(paneStateBefore.css.display).to.equal('block');
          expect(paneMarkdownNaStateBefore.css).to.not.have.key('display');

          expect(paneStateAfter.css).to.not.have.key('display');
          expect(paneMarkdownNaStateAfter.css.display).to.equal('block');
        });
    });
  });

  describe('.toggleCode()', function () {
    after(function (done) {
      codeViewer.closeCode();

      setTimeout(() => {
        done();
      }, timeout);
    });

    it('toggles on - also tests .openCode()', function (done) {
      codeViewer.closeCode();
      $orgs['#sg-t-code'].dispatchAction('removeClass', 'active');

      setTimeout(() => {
        const codeActiveBefore = codeViewer.codeActive;
        const sgTCodeBefore = $orgs['#sg-t-code'].getState();
        const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

        codeViewer.toggleCode();

        setTimeout(() => {
          const sgTCodeAfter = $orgs['#sg-t-code'].getState();
          const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

          expect(codeActiveBefore).to.be.false;
          expect(sgTCodeBefore.classArray).to.not.include('active');
          expect(sgViewContainerBefore.classArray).to.not.include('anim-ready');

          expect(codeViewer.codeActive).to.be.true;
          expect(sgTCodeAfter.classArray).to.include('active');
          expect(sgViewContainerAfter.classArray).to.include('anim-ready');

          done();
        }, timeout);
      }, timeout);
    });

    it('toggles off - also tests .closeCode()', function (done) {
      const codeActiveBefore = codeViewer.codeActive;
      const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
      const sgTCodeBefore = $orgs['#sg-t-code'].getState();
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

      codeViewer.toggleCode();

      setTimeout(() => {
        const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
        const sgTCodeAfter = $orgs['#sg-t-code'].getState();
        const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

        expect(codeActiveBefore).to.be.true;
        expect(patternlabBodyBefore.classArray).to.include('dock-open');
        expect(sgTCodeBefore.classArray).to.include('active');
        expect(sgViewContainerBefore.classArray).to.include('anim-ready');

        expect(codeViewer.codeActive).to.be.false;
        expect(patternlabBodyAfter.classArray).to.not.include('dock-open');
        expect(sgTCodeAfter.classArray).to.not.include('active');
        expect(sgViewContainerAfter.classArray).to.not.include('anim-ready');

        done();
      }, timeout);
    });

    it('switches from annotations viewer to code viewer', function (done) {
      annotationsViewer.openAnnotations();
      $orgs['#sg-t-code'].dispatchAction('removeClass', 'active');

      setTimeout(() => {
        const annotationsActiveBefore = annotationsViewer.annotationsActive;
        const codeActiveBefore = codeViewer.codeActive;
        const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
        const sgAnnotationsContainerBefore = $orgs['#sg-annotations-container'].getState();
        const sgCodeContainerBefore = $orgs['#sg-code-container'].getState();
        const sgTAnnotationsBefore = $orgs['#sg-t-annotations'].getState();
        const sgTCodeBefore = $orgs['#sg-t-code'].getState();
        const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

        codeViewer.toggleCode();

        setTimeout(() => {
          const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
          const sgAnnotationsContainerAfter = $orgs['#sg-annotations-container'].getState();
          const sgCodeContainerAfter = $orgs['#sg-code-container'].getState();
          const sgTAnnotationsAfter = $orgs['#sg-t-annotations'].getState();
          const sgTCodeAfter = $orgs['#sg-t-code'].getState();
          const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

          expect(annotationsActiveBefore).to.be.true;
          expect(codeActiveBefore).to.be.false;
          expect(patternlabBodyBefore.classArray).to.include('dock-open');
          expect(sgAnnotationsContainerBefore.classArray).to.include('active');
          expect(sgCodeContainerBefore.classArray).to.not.include('active');
          expect(sgTAnnotationsBefore.classArray).to.include('active');
          expect(sgTCodeBefore.classArray).to.not.include('active');
          expect(sgViewContainerBefore.classArray).to.include('anim-ready');

          expect(annotationsViewer.annotationsActive).to.be.false;
          expect(codeViewer.codeActive).to.be.true;
          expect(patternlabBodyAfter.classArray).to.include('dock-open');
          expect(sgAnnotationsContainerAfter.classArray).to.not.include('active');
          expect(sgCodeContainerAfter.classArray).to.include('active');
          expect(sgTAnnotationsAfter.classArray).to.not.include('active');
          expect(sgTCodeAfter.classArray).to.include('active');
          expect(sgViewContainerAfter.classArray).to.include('anim-ready');

          done();
        }, timeout);
      }, timeout);
    });
  });

  describe('.updateMetadata()', function () {
    beforeEach(function () {
      $orgs['#sg-code-container'].dispatchAction('attr', {'data-patternpartial': null});
      $orgs['#sg-code-pattern-info-state'].dispatchAction('html', null);
      $orgs['#sg-code-lineage'].dispatchAction('css', {display: 'inline'});
      $orgs['#sg-code-lineage-fill'].dispatchAction('html', null);
      $orgs['#sg-code-lineager'].dispatchAction('css', {display: 'inline'});
      $orgs['#sg-code-lineager-fill'].dispatchAction('html', null);
    });

    it('updates code', function () {
      const sgCodeLineageBefore = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillBefore = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerBefore = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillBefore = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodePatternInfoBefore = $orgs['#sg-code-pattern-info-state'].getState();

      codeViewer.updateMetadata(
        [],
        [],
        'compounds-block',
        '',
        []
      );

      const sgCodeLineageAfter = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillAfter = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerAfter = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillAfter = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodePatternInfoAfter = $orgs['#sg-code-pattern-info-state'].getState();

      expect(sgCodeLineageBefore.css.display).to.not.equal(sgCodeLineageAfter.css.display);
      expect(sgCodeLineageFillBefore.html).to.equal(sgCodeLineageFillAfter.html);
      expect(sgCodeLineagerBefore.css.display).to.not.equal(sgCodeLineagerAfter.css.display);
      expect(sgCodePatternInfoBefore.html).to.equal(sgCodePatternInfoAfter.html);

      expect(sgCodeLineagerFillBefore.html).to.equal(sgCodeLineagerFillAfter.html);
      expect(sgCodeLineageAfter.css.display).to.equal('none');
      expect(sgCodeLineagerAfter.css.display).to.equal('none');
    });

    /* eslint-disable comma-spacing, key-spacing, max-len, quote-props, quotes */
    it('updates code with lineage array', function () {
      const sgCodeLineageBefore = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillBefore = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerBefore = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillBefore = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodePatternInfoBefore = $orgs['#sg-code-pattern-info-state'].getState();

      codeViewer.updateMetadata(
        [{"lineagePattern":"elements-paragraph","lineagePath":"patterns/00-elements-paragraph/00-elements-paragraph.html","isHidden":false,"lineageState":"complete"}],
        [],
        'compounds-block',
        '',
        []
      );

      const sgCodeLineageAfter = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillAfter = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerAfter = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillAfter = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodePatternInfoAfter = $orgs['#sg-code-pattern-info-state'].getState();

      expect(sgCodeLineageBefore.css.display).to.not.equal(sgCodeLineageAfter.css.display);
      expect(sgCodeLineageFillBefore.html).to.not.equal(sgCodeLineageFillAfter.html);
      expect(sgCodeLineagerBefore.css.display).to.not.equal(sgCodeLineagerAfter.css.display);
      expect(sgCodeLineagerFillBefore.html).to.equal(sgCodeLineagerFillAfter.html);
      expect(sgCodePatternInfoBefore.html).to.equal(sgCodePatternInfoAfter.html);

      expect(sgCodeLineageAfter.css.display).to.equal('block');
      expect(sgCodeLineageFillAfter.html).to.equal(
        '<a href="patterns/00-elements-paragraph/00-elements-paragraph.html" class="sg-pattern-state complete">elements-paragraph</a>'
      );
      expect(sgCodeLineagerAfter.css.display).to.equal('none');
    });

    it('updates code with lineageR array', function () {
      const sgCodeLineageBefore = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillBefore = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerBefore = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillBefore = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodePatternInfoBefore = $orgs['#sg-code-pattern-info-state'].getState();

      codeViewer.updateMetadata(
        [],
        [{"lineagePattern":"components-region","lineagePath":"patterns/02-components-region/02-components-region.html","isHidden":false,"lineageState":"inreview"}],
        'compounds-block',
        '',
        []
      );

      const sgCodeLineageAfter = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillAfter = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerAfter = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillAfter = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodePatternInfoAfter = $orgs['#sg-code-pattern-info-state'].getState();

      expect(sgCodeLineageBefore.css.display).to.not.equal(sgCodeLineageAfter.css.display);
      expect(sgCodeLineageFillBefore.html).to.equal(sgCodeLineageFillAfter.html);
      expect(sgCodeLineagerBefore.css.display).to.not.equal(sgCodeLineagerAfter.css.display);
      expect(sgCodeLineagerFillBefore.html).to.not.equal(sgCodeLineagerFillAfter.html);
      expect(sgCodePatternInfoBefore.html).to.equal(sgCodePatternInfoAfter.html);

      expect(sgCodeLineageAfter.css.display).to.equal('none');
      expect(sgCodeLineagerAfter.css.display).to.equal('block');
      expect(sgCodeLineagerFillAfter.html).to.equal(
        '<a href="patterns/02-components-region/02-components-region.html" class="sg-pattern-state inreview">components-region</a>'
      );
    });
    /* eslint-enable comma-spacing, key-spacing, max-len, quote-props, quotes */

    it('updates code with pattern state', function () {
      const sgCodeLineageBefore = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillBefore = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerBefore = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillBefore = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodePatternInfoBefore = $orgs['#sg-code-pattern-info-state'].getState();

      codeViewer.updateMetadata(
        [],
        [],
        'compounds-block',
        'inprogress',
        []
      );

      const sgCodeLineageAfter = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillAfter = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerAfter = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillAfter = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodePatternInfoAfter = $orgs['#sg-code-pattern-info-state'].getState();

      expect(sgCodeLineageBefore.css.display).to.not.equal(sgCodeLineageAfter.css.display);
      expect(sgCodeLineageFillBefore.html).to.equal(sgCodeLineageFillAfter.html);
      expect(sgCodeLineagerBefore.css.display).to.not.equal(sgCodeLineagerAfter.css.display);
      expect(sgCodeLineagerFillBefore.html).to.equal(sgCodeLineagerFillAfter.html);
      expect(sgCodePatternInfoBefore.html).to.not.equal(sgCodePatternInfoAfter.html);

      expect(sgCodeLineageAfter.css.display).to.equal('none');
      expect(sgCodeLineagerAfter.css.display).to.equal('none');
      expect(sgCodePatternInfoAfter.html)
        .to.equal('<span class="sg-pattern-state inprogress">inprogress</span>');
    });

    it('shows when a pattern is missing an included partial', function () {
      const sgCodeLineageBefore = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillBefore = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerBefore = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillBefore = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodeMissingPartialsFillBefore = $orgs['#sg-code-missing-partials-fill'].getState();

      codeViewer.updateMetadata(
        [],
        [],
        'compounds-block',
        '',
        ['organisms-molecules']
      );

      const sgCodeLineageAfter = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillAfter = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerAfter = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillAfter = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodeMissingPartialsFillAfter = $orgs['#sg-code-missing-partials-fill'].getState();

      expect(sgCodeLineageBefore.css.display).to.not.equal(sgCodeLineageAfter.css.display);
      expect(sgCodeLineageFillBefore.html).to.equal(sgCodeLineageFillAfter.html);
      expect(sgCodeLineagerBefore.css.display).to.not.equal(sgCodeLineagerAfter.css.display);
      expect(sgCodeLineagerFillBefore.html).to.equal(sgCodeLineagerFillAfter.html);
      expect(sgCodeMissingPartialsFillBefore.html).to.not.equal(sgCodeMissingPartialsFillAfter.html);

      expect(sgCodeLineageAfter.css.display).to.equal('none');
      expect(sgCodeLineagerAfter.css.display).to.equal('none');
      expect(sgCodeMissingPartialsFillAfter.html).to.equal('organisms-molecules');
    });

    it('shows when a pattern is missing multiple included partials', function () {
      const sgCodeLineageBefore = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillBefore = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerBefore = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillBefore = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodeMissingPartialsFillBefore = $orgs['#sg-code-missing-partials-fill'].getState();

      codeViewer.updateMetadata(
        [],
        [],
        'compounds-block',
        '',
        ['organisms-molecules, molecules-atoms']
      );

      const sgCodeLineageAfter = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillAfter = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerAfter = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillAfter = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodeMissingPartialsFillAfter = $orgs['#sg-code-missing-partials-fill'].getState();

      expect(sgCodeLineageBefore.css.display).to.not.equal(sgCodeLineageAfter.css.display);
      expect(sgCodeLineageFillBefore.html).to.equal(sgCodeLineageFillAfter.html);
      expect(sgCodeLineagerBefore.css.display).to.not.equal(sgCodeLineagerAfter.css.display);
      expect(sgCodeLineagerFillBefore.html).to.equal(sgCodeLineagerFillAfter.html);
      expect(sgCodeMissingPartialsFillBefore.html).to.not.equal(sgCodeMissingPartialsFillAfter.html);

      expect(sgCodeLineageAfter.css.display).to.equal('none');
      expect(sgCodeLineagerAfter.css.display).to.equal('none');
      expect(sgCodeMissingPartialsFillAfter.html).to.equal('organisms-molecules, molecules-atoms');
    });
  });

  describe('.receiveIframeMessage()', function () {
    let event;

    before(function () {
      global.location = {
        protocol: 'http:',
        host: 'localhost:3000'
      };
      event = {
        origin: 'http://localhost:3000'
      };
    });

    it('updates code when submitting pattern data from viewall', function () {
      codeViewer.closeCode();
      $orgs['#sg-code-container'].dispatchAction('attr', {'data-patternpartial': ''});
      $orgs['#sg-code-pattern-info-state'].dispatchAction('html', '');
      $orgs['#sg-code-lineage'].dispatchAction('css', {display: 'inline'});
      $orgs['#sg-code-lineage-fill'].dispatchAction('html', '');
      $orgs['#sg-code-lineager'].dispatchAction('css', {display: 'inline'});
      $orgs['#sg-code-lineager-fill'].dispatchAction('html', '');

      event.data = {
        lineage: [{
          lineagePattern: 'elements-paragraph',
          lineagePath: 'patterns/00-elements-paragraph/00-elements-paragraph.html',
          isHidden: false
        }],
        lineageR: [{
          lineagePattern: 'components-region',
          lineagePath: 'patterns/02-components-region/02-components-region.html',
          isHidden: false
        }],
        missingPartials: [],
        patternPartial: 'compounds-block',
        patternState: '',
        viewall: true
      };
      const patternlabBodyStateBefore = $orgs['#patternlab-body'].getState();
      const sgCodePatternInfoBefore = $orgs['#sg-code-pattern-info-state'].getState();
      const sgCodeLineageBefore = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillBefore = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerBefore = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillBefore = $orgs['#sg-code-lineager-fill'].getState();

      codeViewer.receiveIframeMessage(event);

      const patternlabBodyStateAfter = $orgs['#patternlab-body'].getState();
      const sgCodePatternInfoAfter = $orgs['#sg-code-pattern-info-state'].getState();
      const sgCodeLineageAfter = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillAfter = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerAfter = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillAfter = $orgs['#sg-code-lineager-fill'].getState();

      expect(patternlabBodyStateBefore.classArray).to.not.include('viewall');
      expect(sgCodePatternInfoBefore.html).to.equal(sgCodePatternInfoAfter.html);
      expect(sgCodeLineageBefore.css.display).to.not.equal(sgCodeLineageAfter.css.display);
      expect(sgCodeLineageFillBefore.html).to.not.equal(sgCodeLineageFillAfter.html);
      expect(sgCodeLineagerFillBefore.html).to.not.equal(sgCodeLineagerFillAfter.html);
      expect(sgCodeLineagerBefore.css.display).to.not.equal(sgCodeLineagerAfter.css.display);

      expect(patternlabBodyStateAfter.classArray).to.include('viewall');
      expect(sgCodeLineageAfter.css.display).to.equal('block');
      expect(sgCodeLineageFillAfter.html).to.equal(
      // eslint-disable-next-line indent
'<a href="patterns/00-elements-paragraph/00-elements-paragraph.html" class="">elements-paragraph</a>');
      expect(sgCodeLineagerAfter.css.display).to.equal('block');
      expect(sgCodeLineagerFillAfter.html).to.equal(
      // eslint-disable-next-line indent
'<a href="patterns/02-components-region/02-components-region.html" class="">components-region</a>');
      expect(codeViewer.viewall).to.be.true;
    });

    it('removes viewall styling when submitting data from pattern and not viewall', function () {
      codeViewer.closeCode();
      $orgs['#sg-code-container'].dispatchAction('attr', {'data-patternpartial': ''});
      $orgs['#sg-code-pattern-info-state'].dispatchAction('html', '');
      $orgs['#sg-code-lineage'].dispatchAction('css', {display: 'inline'});
      $orgs['#sg-code-lineage-fill'].dispatchAction('html', '');
      $orgs['#sg-code-lineager'].dispatchAction('css', {display: 'inline'});
      $orgs['#sg-code-lineager-fill'].dispatchAction('html', '');

      event.data = {
        lineage: [{
          lineagePattern: 'elements-paragraph',
          lineagePath: 'patterns/00-elements-paragraph/00-elements-paragraph.html',
          isHidden: false
        }],
        lineageR: [{
          lineagePattern: 'components-region',
          lineagePath: 'patterns/02-components-region/02-components-region.html',
          isHidden: false
        }],
        missingPartials: [],
        patternPartial: 'compounds-block',
        patternState: '',
        viewall: false
      };
      const patternlabBodyStateBefore = $orgs['#patternlab-body'].getState();
      const sgCodePatternInfoBefore = $orgs['#sg-code-pattern-info-state'].getState();
      const sgCodeLineageBefore = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillBefore = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerBefore = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillBefore = $orgs['#sg-code-lineager-fill'].getState();

      codeViewer.receiveIframeMessage(event);

      const patternlabBodyStateAfter = $orgs['#patternlab-body'].getState();
      const sgCodePatternInfoAfter = $orgs['#sg-code-pattern-info-state'].getState();
      const sgCodeLineageAfter = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillAfter = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerAfter = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillAfter = $orgs['#sg-code-lineager-fill'].getState();

      expect(patternlabBodyStateBefore.classArray).to.include('viewall');
      expect(sgCodePatternInfoBefore.html).to.equal(sgCodePatternInfoAfter.html);
      expect(sgCodeLineageBefore.css.display).to.not.equal(sgCodeLineageAfter.css.display);
      expect(sgCodeLineageFillBefore.html).to.not.equal(sgCodeLineageFillAfter.html);
      expect(sgCodeLineagerFillBefore.html).to.not.equal(sgCodeLineagerFillAfter.html);
      expect(sgCodeLineagerBefore.css.display).to.not.equal(sgCodeLineagerAfter.css.display);

      expect(patternlabBodyStateAfter.classArray).to.not.include('viewall');
      expect(sgCodeLineageAfter.css.display).to.equal('block');
      expect(sgCodeLineageFillAfter.html).to.equal(
      // eslint-disable-next-line indent
'<a href="patterns/00-elements-paragraph/00-elements-paragraph.html" class="">elements-paragraph</a>');
      expect(sgCodeLineagerAfter.css.display).to.equal('block');
      expect(sgCodeLineagerFillAfter.html).to.equal(
      // eslint-disable-next-line indent
'<a href="patterns/02-components-region/02-components-region.html" class="">components-region</a>');
      expect(codeViewer.viewall).to.be.false;
    });

    it('opens code on data.codeViewallClick = "on"', function (done) {
      event.data = {
        codeViewallClick: 'on',
        lineage: [],
        lineageR: [],
        patternPartial: 'compounds-block',
        patternState: '',
        viewall: true
      };

      codeViewer.closeCode();

      const codeActiveBefore = codeViewer.codeActive;
      const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
      const sgTCodeBefore = $orgs['#sg-t-code'].getState();
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

      setTimeout(() => {
        codeViewer.receiveIframeMessage(event);

        setTimeout(() => {
          const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
          const sgTCodeAfter = $orgs['#sg-t-code'].getState();
          const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

          expect(codeActiveBefore).to.be.false;
          expect(patternlabBodyBefore.classArray).to.not.include('dock-open');
          expect(sgTCodeBefore.classArray).to.not.include('active');
          expect(sgViewContainerBefore.classArray).to.not.include('anim-ready');

          expect(codeViewer.codeActive).to.be.true;
          expect(patternlabBodyAfter.classArray).to.include('dock-open');
          expect(sgTCodeAfter.classArray).to.include('active');
          expect(sgViewContainerAfter.classArray).to.include('anim-ready');

          done();
        }, timeout);
      }, timeout);
    });

    it('closes code on data.codeViewallClick = "off"', function (done) {
      event.data = {
        codeViewallClick: 'off'
      };

      codeViewer.openCode();

      const codeActiveBefore = codeViewer.codeActive;
      const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
      const sgTCodeBefore = $orgs['#sg-t-code'].getState();
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

      setTimeout(() => {
        codeViewer.receiveIframeMessage(event);

        setTimeout(() => {
          const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
          const sgTCodeAfter = $orgs['#sg-t-code'].getState();
          const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

          expect(codeActiveBefore).to.be.true;
          expect(patternlabBodyBefore.classArray).to.include('dock-open');
          expect(sgTCodeBefore.classArray).to.include('active');
          expect(sgViewContainerBefore.classArray).to.include('anim-ready');

          expect(codeViewer.codeActive).to.be.false;
          expect(patternlabBodyAfter.classArray).to.not.include('dock-open');
          expect(sgTCodeAfter.classArray).to.not.include('active');
          expect(sgViewContainerAfter.classArray).to.not.include('anim-ready');

          done();
        }, timeout);
      }, timeout);
    });

    it('toggles code on with patternlab.keyPress "ctrl+shift+c"', function (done) {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+shift+c'
      };
      const codeActiveBefore = codeViewer.codeActive;
      const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
      const sgTCodeBefore = $orgs['#sg-t-code'].getState();
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

      codeViewer.receiveIframeMessage(event);

      setTimeout(() => {
        const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
        const sgTCodeAfter = $orgs['#sg-t-code'].getState();
        const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

        expect(codeActiveBefore).to.be.false;
        expect(patternlabBodyBefore.classArray).to.not.include('dock-open');
        expect(sgTCodeBefore.classArray).to.not.include('active');
        expect(sgViewContainerBefore.classArray).to.not.include('anim-ready');

        expect(codeViewer.codeActive).to.be.true;
        expect(patternlabBodyAfter.classArray).to.include('dock-open');
        expect(sgTCodeAfter.classArray).to.include('active');
        expect(sgViewContainerAfter.classArray).to.include('anim-ready');

        done();
      }, timeout);
    });

    it('toggles code off with patternlab.keyPress "ctrl+shift+c"', function (done) {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+shift+c'
      };
      const codeActiveBefore = codeViewer.codeActive;
      const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
      const sgTCodeBefore = $orgs['#sg-t-code'].getState();
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

      codeViewer.receiveIframeMessage(event);

      setTimeout(() => {
        const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
        const sgTCodeAfter = $orgs['#sg-t-code'].getState();
        const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

        expect(codeActiveBefore).to.be.true;
        expect(patternlabBodyBefore.classArray).to.include('dock-open');
        expect(sgTCodeBefore.classArray).to.include('active');
        expect(sgViewContainerBefore.classArray).to.include('anim-ready');

        expect(codeViewer.codeActive).to.be.false;
        expect(patternlabBodyAfter.classArray).to.not.include('dock-open');
        expect(sgTCodeAfter.classArray).to.not.include('active');
        expect(sgViewContainerAfter.classArray).to.not.include('anim-ready');

        done();
      }, timeout);
    });

    it('closes codeViewer with patternlab.keyPress "esc"', function (done) {
      codeViewer.openCode();

      setTimeout(() => {
        event.data = {
          event: 'patternlab.keyPress',
          keyPress: 'esc'
        };
        const codeActiveBefore = codeViewer.codeActive;
        const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
        const sgTCodeBefore = $orgs['#sg-t-code'].getState();
        const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

        codeViewer.receiveIframeMessage(event);

        setTimeout(() => {
          const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
          const sgTCodeAfter = $orgs['#sg-t-code'].getState();
          const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

          expect(codeActiveBefore).to.be.true;
          expect(patternlabBodyBefore.classArray).to.include('dock-open');
          expect(sgTCodeBefore.classArray).to.include('active');
          expect(sgViewContainerBefore.classArray).to.include('anim-ready');

          expect(codeViewer.codeActive).to.be.false;
          expect(patternlabBodyAfter.classArray).to.not.include('dock-open');
          expect(sgTCodeAfter.classArray).to.not.include('active');
          expect(sgViewContainerAfter.classArray).to.not.include('anim-ready');

          done();
        }, timeout);
      }, timeout);
    });
  });
});
