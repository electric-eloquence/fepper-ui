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
      expect(Object.keys(codeViewer).length).to.equal(11);
      expect(codeViewer).to.have.property('getPrintXHRErrorFunction');
      expect(codeViewer).to.have.property('receiveIframeMessage');
      expect(codeViewer).to.have.property('getSaveEncodedFunction');
      expect(codeViewer).to.have.property('getSaveMustacheFunction');
      expect(codeViewer).to.have.property('$orgs');
      expect(codeViewer).to.have.property('uiData');
      expect(codeViewer).to.have.property('uiFns');
      expect(codeViewer).to.have.property('uiProps');
      expect(codeViewer).to.have.property('annotationsViewer');
      expect(codeViewer).to.have.property('codeActive');
      expect(codeViewer).to.have.property('encoded');
      expect(codeViewer).to.have.property('mustache');
      expect(codeViewer).to.have.property('mustacheBrowser');
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

  describe('.activateDefaultTab()', function () {
    it('activates tab and fills with content', function () {
      $orgs['#sg-code-title-html'].dispatchAction('removeClass', 'sg-code-title-active');
      $orgs['#sg-code-title-mustache'].dispatchAction('removeClass', 'sg-code-title-active');

      const sgCodeTitleHtmlBefore = $orgs['#sg-code-title-html'].getState();
      const sgCodeTitleMustacheBefore = $orgs['#sg-code-title-mustache'].getState();
      const sgCodeFillBefore = $orgs['#sg-code-fill'].getState();

      codeViewer.activateDefaultTab('m', 'mustache');

      const sgCodeTitleHtmlAfter = $orgs['#sg-code-title-html'].getState();
      const sgCodeTitleMustacheAfter = $orgs['#sg-code-title-mustache'].getState();
      const sgCodeFillAfter = $orgs['#sg-code-fill'].getState();

      expect(sgCodeTitleHtmlBefore.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeTitleMustacheBefore.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeFillBefore.html).to.not.equal(sgCodeFillAfter.html);

      expect(sgCodeTitleHtmlAfter.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeTitleMustacheAfter.classArray).to.include('sg-code-title-active');
      expect(sgCodeFillAfter.html).to.equal('mustache');
    });
  });

  describe('.getSaveEncodedFunction()', function () {
    it('returns a function that saves encoded HTML', function () {
      codeViewer.encoded = '';
      codeViewer.tabActive = 'e';
      const saveEncoded = codeViewer.getSaveEncodedFunction().bind({responseText: 'encoded'});

      $orgs['#sg-code-title-html'].dispatchAction('removeClass', 'sg-code-title-active');
      $orgs['#sg-code-title-mustache'].dispatchAction('removeClass', 'sg-code-title-active');

      const sgCodeTitleHtmlBefore = $orgs['#sg-code-title-html'].getState();
      const sgCodeTitleMustacheBefore = $orgs['#sg-code-title-mustache'].getState();
      const sgCodeFillBefore = $orgs['#sg-code-fill'].getState();

      saveEncoded();

      const sgCodeTitleHtmlAfter = $orgs['#sg-code-title-html'].getState();
      const sgCodeTitleMustacheAfter = $orgs['#sg-code-title-mustache'].getState();
      const sgCodeFillAfter = $orgs['#sg-code-fill'].getState();

      expect(sgCodeTitleHtmlBefore.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeTitleMustacheBefore.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeFillBefore.html).to.not.equal(sgCodeFillAfter.html);

      expect(sgCodeTitleHtmlAfter.classArray).to.include('sg-code-title-active');
      expect(sgCodeTitleMustacheAfter.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeFillAfter.html).to.equal('encoded');
    });
  });

  describe('.getSaveMustacheFunction()', function () {
    it('returns a function that saves Mustache-like Feplet', function () {
      codeViewer.mustache = '';
      codeViewer.tabActive = 'm';
      const saveMustache = codeViewer.getSaveMustacheFunction().bind({responseText: 'mustache'});

      $orgs['#sg-code-title-html'].dispatchAction('removeClass', 'sg-code-title-active');
      $orgs['#sg-code-title-mustache'].dispatchAction('removeClass', 'sg-code-title-active');

      const sgCodeTitleHtmlBefore = $orgs['#sg-code-title-html'].getState();
      const sgCodeTitleMustacheBefore = $orgs['#sg-code-title-mustache'].getState();
      const sgCodeFillBefore = $orgs['#sg-code-fill'].getState();

      saveMustache();

      const sgCodeTitleHtmlAfter = $orgs['#sg-code-title-html'].getState();
      const sgCodeTitleMustacheAfter = $orgs['#sg-code-title-mustache'].getState();
      const sgCodeFillAfter = $orgs['#sg-code-fill'].getState();

      expect(sgCodeTitleHtmlBefore.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeTitleMustacheBefore.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeFillBefore.html).to.not.equal(sgCodeFillAfter.html);

      expect(sgCodeTitleHtmlAfter.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeTitleMustacheAfter.classArray).to.include('sg-code-title-active');
      expect(sgCodeFillAfter.html).to.equal('mustache');
    });
  });

  describe('.swapCode()', function () {
    beforeEach(function () {
      codeViewer.encoded = '';
      codeViewer.mustache = '';
      codeViewer.tabActive = '';

      $orgs['#sg-code-fill'].dispatchAction('html', '');
    });

    it('swaps in encoded HTML', function () {
      codeViewer.encoded = 'encoded';

      const sgCodeFillBefore = $orgs['#sg-code-fill'].getState();

      codeViewer.swapCode('e');

      const sgCodeTitleHtmlAfter = $orgs['#sg-code-title-html'].getState();
      const sgCodeTitleMustacheAfter = $orgs['#sg-code-title-mustache'].getState();
      const sgCodeFillAfter = $orgs['#sg-code-fill'].getState();

      expect(sgCodeFillBefore.html).to.not.equal(sgCodeFillAfter.html);

      expect(codeViewer.tabActive).to.equal('e');
      expect(sgCodeTitleHtmlAfter.classArray).to.include('sg-code-title-active');
      expect(sgCodeTitleMustacheAfter.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeFillAfter.html).to.equal('encoded');
    });

    it('swaps in Mustache-like Feplet', function () {
      codeViewer.mustache = 'mustache';

      const sgCodeFillBefore = $orgs['#sg-code-fill'].getState();

      codeViewer.swapCode('m');

      const sgCodeTitleHtmlAfter = $orgs['#sg-code-title-html'].getState();
      const sgCodeTitleMustacheAfter = $orgs['#sg-code-title-mustache'].getState();
      const sgCodeFillAfter = $orgs['#sg-code-fill'].getState();

      expect(sgCodeFillBefore.html).to.not.equal(sgCodeFillAfter.html);

      expect(codeViewer.tabActive).to.equal('m');
      expect(sgCodeTitleHtmlAfter.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeTitleMustacheAfter.classArray).to.include('sg-code-title-active');
      expect(sgCodeFillAfter.html).to.equal('mustache');
    });

    it('does nothing if .codeActive is false', function () {
      codeViewer.codeActive = false;
      codeViewer.mustache = 'mustache';

      $orgs['#sg-code-title-html'].dispatchAction('removeClass', 'sg-code-title-active');
      $orgs['#sg-code-title-mustache'].dispatchAction('removeClass', 'sg-code-title-active');

      const sgCodeTitleHtmlBefore = $orgs['#sg-code-title-html'].getState();
      const sgCodeTitleMustacheBefore = $orgs['#sg-code-title-mustache'].getState();
      const sgCodeFillBefore = $orgs['#sg-code-fill'].getState();

      codeViewer.swapCode('m');

      const sgCodeTitleHtmlAfter = $orgs['#sg-code-title-html'].getState();
      const sgCodeTitleMustacheAfter = $orgs['#sg-code-title-mustache'].getState();
      const sgCodeFillAfter = $orgs['#sg-code-fill'].getState();

      expect(sgCodeTitleHtmlBefore.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeTitleMustacheBefore.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeFillBefore.html).to.equal(sgCodeFillAfter.html);

      expect(codeViewer.tabActive).to.equal('');
      expect(sgCodeTitleHtmlAfter.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeTitleMustacheAfter.classArray).to.not.include('sg-code-title-active');
    });
  });

  describe('.toggleCode()', function () {
    after(function (done) {
      codeViewer.closeCode();

      setTimeout(() => {
        done();
      }, timeout);
    });

    it('does nothing if .mustacheBrowser is true', function (done) {
      codeViewer.codeActive = false;
      codeViewer.mustacheBrowser = true;

      $orgs['#sg-t-code'].dispatchAction('removeClass', 'active');

      const sgTCodeBefore = $orgs['#sg-t-code'].getState();

      codeViewer.toggleCode();

      setTimeout(() => {
        const sgTCodeAfter = $orgs['#sg-t-code'].getState();

        expect(sgTCodeBefore.classArray).to.not.include('active');
        expect(sgTCodeAfter.classArray).to.not.include('active');

        codeViewer.mustacheBrowser = false;

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
      const sgCodeContainerBefore = $orgs['#sg-code-container'].getState();
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

      const sgCodeContainerAfter = $orgs['#sg-code-container'].getState();
      const sgCodeLineageAfter = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillAfter = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerAfter = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillAfter = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodePatternInfoAfter = $orgs['#sg-code-pattern-info-state'].getState();

      expect(sgCodeContainerBefore.attribs['data-patternpartial'])
        .to.not.equal(sgCodeContainerAfter.attribs['data-patternpartial']);
      expect(sgCodeLineageBefore.css.display).to.not.equal(sgCodeLineageAfter.css.display);
      expect(sgCodeLineageFillBefore.html).to.equal(sgCodeLineageFillAfter.html);
      expect(sgCodeLineagerBefore.css.display).to.not.equal(sgCodeLineagerAfter.css.display);
      expect(sgCodePatternInfoBefore.html).to.equal(sgCodePatternInfoAfter.html);

      expect(sgCodeLineagerFillBefore.html).to.equal(sgCodeLineagerFillAfter.html);
      expect(sgCodeContainerAfter.attribs['data-patternpartial']).to.equal('compounds-block');
      expect(sgCodeLineageAfter.css.display).to.equal('none');
      expect(sgCodeLineagerAfter.css.display).to.equal('none');
    });

    /* eslint-disable comma-spacing, key-spacing, max-len, quote-props, quotes */
    it('updates code with lineage array', function () {
      const sgCodeContainerBefore = $orgs['#sg-code-container'].getState();
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

      const sgCodeContainerAfter = $orgs['#sg-code-container'].getState();
      const sgCodeLineageAfter = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillAfter = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerAfter = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillAfter = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodePatternInfoAfter = $orgs['#sg-code-pattern-info-state'].getState();

      expect(sgCodeContainerBefore.attribs['data-patternpartial'])
        .to.not.equal(sgCodeContainerAfter.attribs['data-patternpartial']);
      expect(sgCodeLineageBefore.css.display).to.not.equal(sgCodeLineageAfter.css.display);
      expect(sgCodeLineageFillBefore.html).to.not.equal(sgCodeLineageFillAfter.html);
      expect(sgCodeLineagerBefore.css.display).to.not.equal(sgCodeLineagerAfter.css.display);
      expect(sgCodeLineagerFillBefore.html).to.equal(sgCodeLineagerFillAfter.html);
      expect(sgCodePatternInfoBefore.html).to.equal(sgCodePatternInfoAfter.html);

      expect(sgCodeContainerAfter.attribs['data-patternpartial']).to.equal('compounds-block');
      expect(sgCodeLineageAfter.css.display).to.equal('block');
      expect(sgCodeLineageFillAfter.html).to.equal(
        '<a href="patterns/00-elements-paragraph/00-elements-paragraph.html" class="sg-pattern-state complete" data-patternpartial="elements-paragraph">elements-paragraph</a>'
      );
      expect(sgCodeLineagerAfter.css.display).to.equal('none');
    });

    it('updates code with lineageR array', function () {
      const sgCodeContainerBefore = $orgs['#sg-code-container'].getState();
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

      const sgCodeContainerAfter = $orgs['#sg-code-container'].getState();
      const sgCodeLineageAfter = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillAfter = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerAfter = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillAfter = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodePatternInfoAfter = $orgs['#sg-code-pattern-info-state'].getState();

      expect(sgCodeContainerBefore.attribs['data-patternpartial'])
        .to.not.equal(sgCodeContainerAfter.attribs['data-patternpartial']);
      expect(sgCodeLineageBefore.css.display).to.not.equal(sgCodeLineageAfter.css.display);
      expect(sgCodeLineageFillBefore.html).to.equal(sgCodeLineageFillAfter.html);
      expect(sgCodeLineagerBefore.css.display).to.not.equal(sgCodeLineagerAfter.css.display);
      expect(sgCodeLineagerFillBefore.html).to.not.equal(sgCodeLineagerFillAfter.html);
      expect(sgCodePatternInfoBefore.html).to.equal(sgCodePatternInfoAfter.html);

      expect(sgCodeContainerAfter.attribs['data-patternpartial']).to.equal('compounds-block');
      expect(sgCodeLineageAfter.css.display).to.equal('none');
      expect(sgCodeLineagerAfter.css.display).to.equal('block');
      expect(sgCodeLineagerFillAfter.html).to.equal(
        '<a href="patterns/02-components-region/02-components-region.html" class="sg-pattern-state inreview" data-patternpartial="components-region">components-region</a>'
      );
    });
    /* eslint-enable comma-spacing, key-spacing, max-len, quote-props, quotes */

    it('updates code with pattern state', function () {
      const sgCodeContainerBefore = $orgs['#sg-code-container'].getState();
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

      const sgCodeContainerAfter = $orgs['#sg-code-container'].getState();
      const sgCodeLineageAfter = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillAfter = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerAfter = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillAfter = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodePatternInfoAfter = $orgs['#sg-code-pattern-info-state'].getState();

      expect(sgCodeContainerBefore.attribs['data-patternpartial'])
        .to.not.equal(sgCodeContainerAfter.attribs['data-patternpartial']);
      expect(sgCodeLineageBefore.css.display).to.not.equal(sgCodeLineageAfter.css.display);
      expect(sgCodeLineageFillBefore.html).to.equal(sgCodeLineageFillAfter.html);
      expect(sgCodeLineagerBefore.css.display).to.not.equal(sgCodeLineagerAfter.css.display);
      expect(sgCodeLineagerFillBefore.html).to.equal(sgCodeLineagerFillAfter.html);
      expect(sgCodePatternInfoBefore.html).to.not.equal(sgCodePatternInfoAfter.html);

      expect(sgCodeContainerAfter.attribs['data-patternpartial']).to.equal('compounds-block');
      expect(sgCodeLineageAfter.css.display).to.equal('none');
      expect(sgCodeLineagerAfter.css.display).to.equal('none');
      expect(sgCodePatternInfoAfter.html)
        .to.equal('<span class="sg-pattern-state inprogress">inprogress</span>');
    });
  });

  describe('.printXHRError()', function () {
    it('returns a function that prints the XHR error given protocol "http:"', function () {
      global.location = {
        protocol: 'file:'
      };
      codeViewer.tabActive = 'e';
      const printXHRError =
        codeViewer.getPrintXHRErrorFunction(codeViewer).bind({status: 418, statusText: 'I\'m a teapot'});

      $orgs['#sg-code-title-html'].dispatchAction('removeClass', 'sg-code-title-active');
      $orgs['#sg-code-title-mustache'].dispatchAction('removeClass', 'sg-code-title-active');

      const sgCodeTitleHtmlBefore = $orgs['#sg-code-title-html'].getState();
      const sgCodeTitleMustacheBefore = $orgs['#sg-code-title-mustache'].getState();
      const sgCodeFillBefore = $orgs['#sg-code-fill'].getState();

      printXHRError();

      const sgCodeTitleHtmlAfter = $orgs['#sg-code-title-html'].getState();
      const sgCodeTitleMustacheAfter = $orgs['#sg-code-title-mustache'].getState();
      const sgCodeFillAfter = $orgs['#sg-code-fill'].getState();

      expect(sgCodeTitleHtmlBefore.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeTitleMustacheBefore.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeFillBefore.html).to.not.equal(sgCodeFillAfter.html);

      expect(sgCodeTitleHtmlAfter.classArray).to.include('sg-code-title-active');
      expect(sgCodeTitleMustacheAfter.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeFillAfter.html).to.equal('Status 418: I\'m a teapot');
    });

    it('returns a function that prints the XHR error given protocol "file:" and no status', function () {
      global.location = {
        protocol: 'file:'
      };
      codeViewer.tabActive = 'm';
      const printXHRError = codeViewer.getPrintXHRErrorFunction(codeViewer).bind({});

      $orgs['#sg-code-title-html'].dispatchAction('removeClass', 'sg-code-title-active');
      $orgs['#sg-code-title-mustache'].dispatchAction('removeClass', 'sg-code-title-active');

      const sgCodeTitleHtmlBefore = $orgs['#sg-code-title-html'].getState();
      const sgCodeTitleMustacheBefore = $orgs['#sg-code-title-mustache'].getState();
      const sgCodeFillBefore = $orgs['#sg-code-fill'].getState();

      printXHRError();

      const sgCodeTitleHtmlAfter = $orgs['#sg-code-title-html'].getState();
      const sgCodeTitleMustacheAfter = $orgs['#sg-code-title-mustache'].getState();
      const sgCodeFillAfter = $orgs['#sg-code-fill'].getState();

      expect(sgCodeTitleHtmlBefore.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeTitleMustacheBefore.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeFillBefore.html).to.not.equal(sgCodeFillAfter.html);

      expect(sgCodeTitleHtmlAfter.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeTitleMustacheAfter.classArray).to.include('sg-code-title-active');
      expect(sgCodeFillAfter.html)
        .to.equal('Access to XMLHttpRequest with the file protocol scheme has been blocked by CORS policy.');
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

      const sgCodeContainerBefore = $orgs['#sg-code-container'].getState();
      const sgCodePatternInfoBefore = $orgs['#sg-code-pattern-info-state'].getState();
      const sgCodeLineageBefore = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillBefore = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerBefore = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillBefore = $orgs['#sg-code-lineager-fill'].getState();

      codeViewer.receiveIframeMessage(event);

      const sgCodeContainerAfter = $orgs['#sg-code-container'].getState();
      const sgCodePatternInfoAfter = $orgs['#sg-code-pattern-info-state'].getState();
      const sgCodeLineageAfter = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillAfter = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerAfter = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillAfter = $orgs['#sg-code-lineager-fill'].getState();

      expect(sgCodeContainerBefore.attribs['data-patternpartial'])
        .to.not.equal(sgCodeContainerAfter.attribs['data-patternpartial']);
      expect(sgCodePatternInfoBefore.html).to.equal(sgCodePatternInfoAfter.html);
      expect(sgCodeLineageBefore.css.display).to.not.equal(sgCodeLineageAfter.css.display);
      expect(sgCodeLineageFillBefore.html).to.equal(sgCodeLineageFillAfter.html);
      expect(sgCodeLineagerBefore.css.display).to.not.equal(sgCodeLineagerAfter.css.display);

      expect(sgCodeContainerAfter.attribs['data-patternpartial']).to.equal('compounds-block');
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

      const sgCodeContainerBefore = $orgs['#sg-code-container'].getState();
      const sgCodePatternInfoBefore = $orgs['#sg-code-pattern-info-state'].getState();
      const sgCodeLineageBefore = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillBefore = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerBefore = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillBefore = $orgs['#sg-code-lineager-fill'].getState();

      codeViewer.receiveIframeMessage(event);

      const sgCodeContainerAfter = $orgs['#sg-code-container'].getState();
      const sgCodePatternInfoAfter = $orgs['#sg-code-pattern-info-state'].getState();
      const sgCodeLineageAfter = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillAfter = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerAfter = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillAfter = $orgs['#sg-code-lineager-fill'].getState();

      expect(sgCodeContainerBefore.attribs['data-patternpartial'])
        .to.not.equal(sgCodeContainerAfter.attribs['data-patternpartial']);
      expect(sgCodePatternInfoBefore.html).to.equal(sgCodePatternInfoAfter.html);
      expect(sgCodeLineageBefore.css.display).to.not.equal(sgCodeLineageAfter.css.display);
      expect(sgCodeLineageFillBefore.html).to.equal(sgCodeLineageFillAfter.html);
      expect(sgCodeLineagerBefore.css.display).to.not.equal(sgCodeLineagerAfter.css.display);
      expect(sgCodeLineagerFillBefore.html).to.equal(sgCodeLineagerFillAfter.html);

      expect(sgCodeContainerAfter.attribs['data-patternpartial']).to.equal('compounds-block');
      expect(sgCodeLineageAfter.css.display).to.equal('none');
      expect(sgCodeLineagerAfter.css.display).to.equal('none');
      expect(codeViewer.viewall).to.be.true;
    });

    it('sets .mustacheBrowser on data.codeMustacheBrowser = true', function () {
      event.data = {
        codeMustacheBrowser: true
      };

      codeViewer.receiveIframeMessage(event);

      expect(codeViewer.mustacheBrowser).to.be.true;
    });

    it('sets .mustacheBrowser on data.codeMustacheBrowser = false', function () {
      event.data = {
        codeMustacheBrowser: false
      };

      codeViewer.receiveIframeMessage(event);

      expect(codeViewer.mustacheBrowser).to.be.false;
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
        const sgCodeContainerBefore = $orgs['#sg-code-container'].getState();
        const sgCodePatternInfoBefore = $orgs['#sg-code-pattern-info-state'].getState();
        const sgCodeLineageBefore = $orgs['#sg-code-lineage'].getState();
        const sgCodeLineageFillBefore = $orgs['#sg-code-lineage-fill'].getState();
        const sgCodeLineagerBefore = $orgs['#sg-code-lineager'].getState();
        const sgCodeLineagerFillBefore = $orgs['#sg-code-lineager-fill'].getState();
        const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

        codeViewer.receiveIframeMessage(event);

        setTimeout(() => {
          const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
          const sgCodeContainerAfter = $orgs['#sg-code-container'].getState();
          const sgCodePatternInfoAfter = $orgs['#sg-code-pattern-info-state'].getState();
          const sgCodeLineageAfter = $orgs['#sg-code-lineage'].getState();
          const sgCodeLineageFillAfter = $orgs['#sg-code-lineage-fill'].getState();
          const sgCodeLineagerAfter = $orgs['#sg-code-lineager'].getState();
          const sgCodeLineagerFillAfter = $orgs['#sg-code-lineager-fill'].getState();
          const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

          expect(codeActiveBefore).to.be.false;
          expect(patternlabBodyBefore.classArray).to.not.include('dock-open');
          expect(sgCodeContainerBefore.attribs['data-patternpartial'])
            .to.not.equal(sgCodeContainerAfter.attribs['data-patternpartial']);
          expect(sgCodePatternInfoBefore.html).to.equal(sgCodePatternInfoAfter.html);
          expect(sgCodeLineageBefore.css.display).to.not.equal(sgCodeLineageAfter.css.display);
          expect(sgCodeLineageFillBefore.html).to.equal(sgCodeLineageFillAfter.html);
          expect(sgCodeLineagerBefore.css.display).to.not.equal(sgCodeLineagerAfter.css.display);
          expect(sgViewContainerBefore.classArray).to.not.include('anim-ready');

          expect(codeViewer.codeActive).to.be.true;
          expect(patternlabBodyAfter.classArray).to.include('dock-open');
          expect(sgCodeContainerAfter.attribs['data-patternpartial']).to.equal('compounds-block');
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

    it('swaps in encoded HTML with patternlab.keyPress "ctrl+alt+h"', function () {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+alt+h'
      };
      codeViewer.codeActive = true;
      codeViewer.encoded = 'encoded';

      $orgs['#sg-code-fill'].dispatchAction('html', '');

      const sgCodeFillBefore = $orgs['#sg-code-fill'].getState();

      codeViewer.receiveIframeMessage(event);

      const sgCodeTitleHtmlAfter = $orgs['#sg-code-title-html'].getState();
      const sgCodeTitleMustacheAfter = $orgs['#sg-code-title-mustache'].getState();
      const sgCodeFillAfter = $orgs['#sg-code-fill'].getState();

      expect(sgCodeFillBefore.html).to.not.equal(sgCodeFillAfter.html);

      expect(codeViewer.tabActive).to.equal('e');
      expect(sgCodeTitleHtmlAfter.classArray).to.include('sg-code-title-active');
      expect(sgCodeTitleMustacheAfter.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeFillAfter.html).to.equal('encoded');
    });

    it('swaps in encoded HTML with patternlab.keyPress "ctrl+shift+y"', function () {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+shift+y'
      };
      codeViewer.codeActive = true;
      codeViewer.encoded = 'encoded';

      $orgs['#sg-code-fill'].dispatchAction('html', '');

      const sgCodeFillBefore = $orgs['#sg-code-fill'].getState();

      codeViewer.receiveIframeMessage(event);

      const sgCodeTitleHtmlAfter = $orgs['#sg-code-title-html'].getState();
      const sgCodeTitleMustacheAfter = $orgs['#sg-code-title-mustache'].getState();
      const sgCodeFillAfter = $orgs['#sg-code-fill'].getState();

      expect(sgCodeFillBefore.html).to.not.equal(sgCodeFillAfter.html);

      expect(codeViewer.tabActive).to.equal('e');
      expect(sgCodeTitleHtmlAfter.classArray).to.include('sg-code-title-active');
      expect(sgCodeTitleMustacheAfter.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeFillAfter.html).to.equal('encoded');
    });

    it('swaps in Mustache-like Feplet with patternlab.keyPress "ctrl+alt+m"', function () {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+alt+m'
      };
      codeViewer.codeActive = true;
      codeViewer.mustache = 'mustache';

      $orgs['#sg-code-fill'].dispatchAction('html', '');

      const sgCodeFillBefore = $orgs['#sg-code-fill'].getState();

      codeViewer.receiveIframeMessage(event);

      const sgCodeTitleHtmlAfter = $orgs['#sg-code-title-html'].getState();
      const sgCodeTitleMustacheAfter = $orgs['#sg-code-title-mustache'].getState();
      const sgCodeFillAfter = $orgs['#sg-code-fill'].getState();

      expect(sgCodeFillBefore.html).to.not.equal(sgCodeFillAfter.html);

      expect(codeViewer.tabActive).to.equal('m');
      expect(sgCodeTitleHtmlAfter.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeTitleMustacheAfter.classArray).to.include('sg-code-title-active');
      expect(sgCodeFillAfter.html).to.equal('mustache');
    });

    it('swaps in Mustache-like Feplet with patternlab.keyPress "ctrl+shift+u"', function () {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+shift+u'
      };
      codeViewer.codeActive = true;
      codeViewer.mustache = 'mustache';

      $orgs['#sg-code-fill'].dispatchAction('html', '');

      const sgCodeFillBefore = $orgs['#sg-code-fill'].getState();

      codeViewer.receiveIframeMessage(event);

      const sgCodeTitleHtmlAfter = $orgs['#sg-code-title-html'].getState();
      const sgCodeTitleMustacheAfter = $orgs['#sg-code-title-mustache'].getState();
      const sgCodeFillAfter = $orgs['#sg-code-fill'].getState();

      expect(sgCodeFillBefore.html).to.not.equal(sgCodeFillAfter.html);

      expect(codeViewer.tabActive).to.equal('m');
      expect(sgCodeTitleHtmlAfter.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeTitleMustacheAfter.classArray).to.include('sg-code-title-active');
      expect(sgCodeFillAfter.html).to.equal('mustache');
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
