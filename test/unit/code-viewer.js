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
      expect(Object.keys(codeViewer).length).to.equal(6);
      expect(codeViewer).to.have.property('receiveIframeMessage');
      expect(codeViewer).to.have.property('codeActive');
      expect(codeViewer).to.have.property('$orgs');
      expect(codeViewer).to.have.property('patternPartial');
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
        search: '?p=compounds-block'
      };

      codeViewer.stoke();
    });

    // Must test a tab + panel besides the Feplet default first. This way the Feplet tab + panel test can be accurate.
    it('activates the Markdown tab and panel for a pattern with Markdown - also tests .setPanelContent()', function () {
      const panelStateBefore = $orgs['#sg-code-panel-markdown'].getState();
      const tabStateBefore = $orgs['#sg-code-tab-markdown'].getState();

      codeViewer.activateTabAndPanel('markdown');

      const panelStateAfter = $orgs['#sg-code-panel-markdown'].getState();
      const tabStateAfter = $orgs['#sg-code-tab-markdown'].getState();

      expect(panelStateBefore.classArray).to.not.include('sg-code-panel-active');
      expect(panelStateBefore.html).to.not.equal(panelStateAfter.html);
      expect(tabStateBefore.classArray).to.not.include('sg-code-tab-active');

      expect(panelStateAfter.classArray).to.include('sg-code-panel-active');
      expect(panelStateAfter.html).to.equal('<pre><code class="language-markdown">SUCCESS!</code></pre>');
      expect(tabStateAfter.classArray).to.include('sg-code-tab-active');
    });

    it('activates the Feplet tab and panel - also tests .setPanelContent()', function () {
      const panelLocationHrefBefore = $orgs['#sg-code-panel-feplet'][0].contentWindow.location.href;
      const panelStateBefore = $orgs['#sg-code-panel-feplet'].getState();
      const tabStateBefore = $orgs['#sg-code-tab-feplet'].getState();

      codeViewer.activateTabAndPanel('feplet');

      const panelLocationHrefAfter = $orgs['#sg-code-panel-feplet'][0].contentWindow.location.href;
      const panelStateAfter = $orgs['#sg-code-panel-feplet'].getState();
      const tabStateAfter = $orgs['#sg-code-tab-feplet'].getState();

      expect(panelLocationHrefBefore).to.not.equal(panelLocationHrefAfter);
      expect(panelStateBefore.classArray).to.not.include('sg-code-panel-active');
      expect(panelStateBefore.style.height).to.not.equal(panelStateAfter.style.height);
      expect(tabStateBefore.classArray).to.not.include('sg-code-tab-active');

      expect(panelLocationHrefAfter).to.equal('/mustache-browser?partial=compounds-block');
      expect(panelStateAfter.classArray).to.include('sg-code-panel-active');
      expect(panelStateAfter.style.height).to.equal('100px');
      expect(tabStateAfter.classArray).to.include('sg-code-tab-active');
    });

    it('activates the Markdown tab and panel for a pattern without Markdown - does via the tabActive cookie on.stoke();\
also tests .resetPanels()', function () {
      global.location.search = '?p=elements-paragraph';

      codeViewer.resetPanels();
      codeViewer.stoke();

      const panelStateBefore = $orgs['#sg-code-panel-markdown'].getState();
      const tabStateBefore = $orgs['#sg-code-tab-markdown'].getState();

      fepperUi.dataSaver.updateValue('tabActive', 'markdown');
      codeViewer.stoke();

      const panelStateAfter = $orgs['#sg-code-panel-markdown'].getState();
      const tabStateAfter = $orgs['#sg-code-tab-markdown'].getState();

      expect(panelStateBefore.classArray).to.not.include('sg-code-panel-active');
      expect(panelStateBefore.html).to.not.equal(panelStateAfter.html);
      expect(tabStateBefore.classArray).to.not.include('sg-code-tab-active');

      expect(panelStateAfter.classArray).to.include('sg-code-panel-active');
      expect(panelStateAfter.html).to.equal(`<p>There is no .md file associated with this pattern.</p>
<p>Please refer to <a href="/readme#markdown-content" target="_blank">the docs</a> for additional information.</p>`);
      expect(tabStateAfter.classArray).to.include('sg-code-tab-active');
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
        const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
        const sgTCodeBefore = $orgs['#sg-t-code'].getState();
        const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

        codeViewer.toggleCode();

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

  describe('.updateCode()', function () {
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

      codeViewer.updateCode(
        [],
        [],
        'compounds-block',
        ''
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

      codeViewer.updateCode(
        [{"lineagePattern":"elements-paragraph","lineagePath":"patterns/00-elements-paragraph/00-elements-paragraph.html","isHidden":false,"lineageState":"complete"}],
        [],
        'compounds-block',
        ''
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

      codeViewer.updateCode(
        [],
        [{"lineagePattern":"components-region","lineagePath":"patterns/02-components-region/02-components-region.html","isHidden":false,"lineageState":"inreview"}],
        'compounds-block',
        ''
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

      codeViewer.updateCode(
        [],
        [],
        'compounds-block',
        'inprogress'
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

    it('opens and updates code on data.codeOverlay = "on"', function () {
      event.data = {
        codeOverlay: 'on',
        lineage: [],
        lineageR: [],
        patternPartial: 'compounds-block',
        patternState: ''
      };

      $orgs['#sg-code-container'].dispatchAction('attr', {'data-patternpartial': null});
      $orgs['#sg-code-pattern-info-state'].dispatchAction('html', '');
      $orgs['#sg-code-lineage'].dispatchAction('css', {display: 'inline'});
      $orgs['#sg-code-lineage-fill'].dispatchAction('html', null);
      $orgs['#sg-code-lineager'].dispatchAction('css', {display: 'inline'});
      $orgs['#sg-code-lineager-fill'].dispatchAction('html', null);

      const sgCodePatternInfoBefore = $orgs['#sg-code-pattern-info-state'].getState();
      const sgCodeLineageBefore = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillBefore = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerBefore = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillBefore = $orgs['#sg-code-lineager-fill'].getState();

      codeViewer.receiveIframeMessage(event);

      const sgCodePatternInfoAfter = $orgs['#sg-code-pattern-info-state'].getState();
      const sgCodeLineageAfter = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillAfter = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerAfter = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillAfter = $orgs['#sg-code-lineager-fill'].getState();

      expect(sgCodePatternInfoBefore.html).to.equal(sgCodePatternInfoAfter.html);
      expect(sgCodeLineageBefore.css.display).to.not.equal(sgCodeLineageAfter.css.display);
      expect(sgCodeLineageFillBefore.html).to.equal(sgCodeLineageFillAfter.html);
      expect(sgCodeLineagerBefore.css.display).to.not.equal(sgCodeLineagerAfter.css.display);

      expect(sgCodeLineageAfter.css.display).to.equal('none');
      expect(sgCodeLineagerAfter.css.display).to.equal('none');
      expect(sgCodeLineagerFillBefore.html).to.equal(sgCodeLineagerFillAfter.html);
    });

    it('updates code on data.codeOverlay = "on" and data.viewall = true', function () {
      event.data = {
        codeOverlay: 'on',
        lineage: [],
        lineageR: [],
        patternPartial: 'compounds-block',
        patternState: '',
        viewall: true
      };

      $orgs['#sg-code-container'].dispatchAction('attr', {'data-patternpartial': null});
      $orgs['#sg-code-pattern-info-state'].dispatchAction('html', null);
      $orgs['#sg-code-lineage'].dispatchAction('css', {display: 'inline'});
      $orgs['#sg-code-lineage-fill'].dispatchAction('html', null);
      $orgs['#sg-code-lineager'].dispatchAction('css', {display: 'inline'});
      $orgs['#sg-code-lineager-fill'].dispatchAction('html', null);

      const sgCodePatternInfoBefore = $orgs['#sg-code-pattern-info-state'].getState();
      const sgCodeLineageBefore = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillBefore = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerBefore = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillBefore = $orgs['#sg-code-lineager-fill'].getState();

      codeViewer.receiveIframeMessage(event);

      const sgCodePatternInfoAfter = $orgs['#sg-code-pattern-info-state'].getState();
      const sgCodeLineageAfter = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillAfter = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerAfter = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillAfter = $orgs['#sg-code-lineager-fill'].getState();

      expect(sgCodePatternInfoBefore.html).to.equal(sgCodePatternInfoAfter.html);
      expect(sgCodeLineageBefore.css.display).to.not.equal(sgCodeLineageAfter.css.display);
      expect(sgCodeLineageFillBefore.html).to.equal(sgCodeLineageFillAfter.html);
      expect(sgCodeLineagerBefore.css.display).to.not.equal(sgCodeLineagerAfter.css.display);
      expect(sgCodeLineagerFillBefore.html).to.equal(sgCodeLineagerFillAfter.html);

      expect(sgCodeLineageAfter.css.display).to.equal('none');
      expect(sgCodeLineagerAfter.css.display).to.equal('none');
      expect(codeViewer.viewall).to.be.true;
    });

    it('sets .viewall on data.codeViewall = true', function () {
      event.data = {
        codeViewall: true
      };

      codeViewer.receiveIframeMessage(event);

      expect(codeViewer.viewall).to.be.true;
    });

    it('sets .viewall on data.codeViewall = false', function () {
      event.data = {
        codeViewall: false
      };

      codeViewer.receiveIframeMessage(event);

      expect(codeViewer.viewall).to.be.false;
    });

    it('opens and updates code on data.codeOverlay = "on", data.viewall = true, and data.openCode = true\
', function (done) {
      codeViewer.closeCode();
      $orgs['#sg-code-container'].dispatchAction('attr', {'data-patternpartial': null});
      $orgs['#sg-code-pattern-info-state'].dispatchAction('html', null);
      $orgs['#sg-code-lineage'].dispatchAction('css', {display: 'inline'});
      $orgs['#sg-code-lineage-fill'].dispatchAction('html', null);
      $orgs['#sg-code-lineager'].dispatchAction('css', {display: 'inline'});
      $orgs['#sg-code-lineager-fill'].dispatchAction('html', null);

      setTimeout(() => {
        event.data = {
          codeOverlay: 'on',
          lineage: [],
          lineageR: [],
          openCode: true,
          patternPartial: 'compounds-block',
          patternState: '',
          viewall: true
        };
        const codeActiveBefore = codeViewer.codeActive;
        const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
        const sgCodePatternInfoBefore = $orgs['#sg-code-pattern-info-state'].getState();
        const sgCodeLineageBefore = $orgs['#sg-code-lineage'].getState();
        const sgCodeLineageFillBefore = $orgs['#sg-code-lineage-fill'].getState();
        const sgCodeLineagerBefore = $orgs['#sg-code-lineager'].getState();
        const sgCodeLineagerFillBefore = $orgs['#sg-code-lineager-fill'].getState();
        const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

        codeViewer.receiveIframeMessage(event);

        setTimeout(() => {
          const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
          const sgCodePatternInfoAfter = $orgs['#sg-code-pattern-info-state'].getState();
          const sgCodeLineageAfter = $orgs['#sg-code-lineage'].getState();
          const sgCodeLineageFillAfter = $orgs['#sg-code-lineage-fill'].getState();
          const sgCodeLineagerAfter = $orgs['#sg-code-lineager'].getState();
          const sgCodeLineagerFillAfter = $orgs['#sg-code-lineager-fill'].getState();
          const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

          expect(codeActiveBefore).to.be.false;
          expect(patternlabBodyBefore.classArray).to.not.include('dock-open');
          expect(sgCodePatternInfoBefore.html).to.equal(sgCodePatternInfoAfter.html);
          expect(sgCodeLineageBefore.css.display).to.not.equal(sgCodeLineageAfter.css.display);
          expect(sgCodeLineageFillBefore.html).to.equal(sgCodeLineageFillAfter.html);
          expect(sgCodeLineagerBefore.css.display).to.not.equal(sgCodeLineagerAfter.css.display);
          expect(sgViewContainerBefore.classArray).to.not.include('anim-ready');

          expect(codeViewer.codeActive).to.be.true;
          expect(patternlabBodyAfter.classArray).to.include('dock-open');
          expect(sgCodeLineageAfter.css.display).to.equal('none');
          expect(sgCodeLineagerAfter.css.display).to.equal('none');
          expect(sgCodeLineagerFillBefore.html).to.equal(sgCodeLineagerFillAfter.html);
          expect(sgViewContainerAfter.classArray).to.include('anim-ready');
          expect(codeViewer.viewall).to.be.true;

          done();
        }, timeout);
      }, timeout);
    });

    it('closes code on data.codeOverlay = "off"', function (done) {
      event.data = {
        codeOverlay: 'off'
      };

      codeViewer.openCode();

      setTimeout(() => {
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

        // Reopen code viewer in order to run the following tests.
        codeViewer.openCode();

        setTimeout(() => {
          done();
        }, timeout);
      }, timeout);
    });

    it('closes codeViewer with patternlab.keyPress "esc"', function (done) {
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
    });
  });
});
