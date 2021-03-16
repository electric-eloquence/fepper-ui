import {expect} from 'chai';

import fepperUi from '../unit';

const $orgs = fepperUi.requerio.$orgs;
const annotationsViewer = fepperUi.annotationsViewer;
const codeViewer = fepperUi.codeViewer;

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
    beforeEach(function () {
      codeViewer.closeCode();
      $orgs['#sg-code-container'].dispatchAction('css', {bottom: 'auto'});
    });

    it('opens code viewer with a "view=code" param', function () {
      global.location = {
        search: '?view=code'
      };

      const sgTCodeBefore = $orgs['#sg-t-code'].getState();
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

      codeViewer.stoke();

      const sgTCodeAfter = $orgs['#sg-t-code'].getState();
      const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

      expect(sgTCodeBefore.classArray).to.not.include('active');
      expect(sgViewContainerBefore.css.bottom).to.equal('-384px');

      expect(sgTCodeAfter.classArray).to.include('active');
      expect(sgViewContainerAfter.css.bottom).to.equal('0px');
    });

    it('opens code viewer with a "view=c" param', function () {
      global.location = {
        search: '?view=c'
      };

      const sgTCodeBefore = $orgs['#sg-t-code'].getState();
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

      codeViewer.stoke();

      const sgTCodeAfter = $orgs['#sg-t-code'].getState();
      const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

      expect(sgTCodeBefore.classArray).to.not.include('active');
      expect(sgViewContainerBefore.css.bottom).to.equal('-384px');

      expect(sgTCodeAfter.classArray).to.include('active');
      expect(sgViewContainerAfter.css.bottom).to.equal('0px');
    });

    it('opens code viewer with a "defaultShowPatternInfo": true config', function () {
      global.location = {
        search: ''
      };
      codeViewer.uiData.config.defaultShowPatternInfo = true;

      const sgTCodeBefore = $orgs['#sg-t-code'].getState();
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

      codeViewer.stoke();

      const sgTCodeAfter = $orgs['#sg-t-code'].getState();
      const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

      expect(sgTCodeBefore.classArray).to.not.include('active');
      expect(sgViewContainerBefore.css.bottom).to.equal('-384px');

      expect(sgTCodeAfter.classArray).to.include('active');
      expect(sgViewContainerAfter.css.bottom).to.equal('0px');

      codeViewer.uiData.config.defaultShowPatternInfo = false;
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
      const saveEncoded = codeViewer.getSaveEncodedFunction(codeViewer).bind({responseText: 'encoded'});

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
      const saveMustache = codeViewer.getSaveMustacheFunction(codeViewer).bind({responseText: 'mustache'});

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
    after(function () {
      codeViewer.closeCode();
    });

    it('does nothing if .mustacheBrowser is true', function () {
      codeViewer.codeActive = false;
      codeViewer.mustacheBrowser = true;

      $orgs['#sg-t-code'].dispatchAction('removeClass', 'active');

      const sgTCodeBefore = $orgs['#sg-t-code'].getState();

      codeViewer.toggleCode();

      const sgTCodeAfter = $orgs['#sg-t-code'].getState();

      expect(sgTCodeBefore.classArray).to.not.include('active');
      expect(sgTCodeAfter.classArray).to.not.include('active');

      codeViewer.mustacheBrowser = false;
    });

    it('toggles on - also tests .openCode()', function () {
      codeViewer.closeCode();

      $orgs['#sg-t-code'].dispatchAction('removeClass', 'active');
      $orgs['#sg-view-container'].dispatchAction('css', {bottom: '-384px'});

      const sgTCodeBefore = $orgs['#sg-t-code'].getState();
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();
      const sgVpWrapBefore = $orgs['#sg-vp-wrap'].getState();

      codeViewer.toggleCode();

      const sgTCodeAfter = $orgs['#sg-t-code'].getState();
      const sgViewContainerAfter = $orgs['#sg-view-container'].getState();
      const sgVpWrapAfter = $orgs['#sg-vp-wrap'].getState();

      expect(sgTCodeBefore.classArray).to.not.include('active');
      expect(sgViewContainerBefore.css.bottom).to.equal('-384px');
      expect(sgVpWrapBefore.css.paddingBottom).to.equal('0px');

      expect(sgTCodeAfter.classArray).to.include('active');
      expect(sgViewContainerAfter.css.bottom).to.equal('0px');
      expect(sgVpWrapAfter.css.paddingBottom).to.equal('384px');
      expect(codeViewer.codeActive).to.be.true;
    });

    it('toggles off - also tests .closeCode()', function () {
      const sgTCodeBefore = $orgs['#sg-t-code'].getState();
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();
      const sgVpWrapBefore = $orgs['#sg-vp-wrap'].getState();

      codeViewer.toggleCode();

      const sgTCodeAfter = $orgs['#sg-t-code'].getState();
      const sgViewContainerAfter = $orgs['#sg-view-container'].getState();
      const sgVpWrapAfter = $orgs['#sg-vp-wrap'].getState();

      expect(sgTCodeBefore.classArray).to.include('active');
      expect(sgViewContainerBefore.css.bottom).to.equal('0px');
      expect(sgVpWrapBefore.css.paddingBottom).to.equal('384px');

      expect(sgTCodeAfter.classArray).to.not.include('active');
      expect(sgViewContainerAfter.css.bottom).to.equal('-384px');
      expect(sgVpWrapAfter.css.paddingBottom).to.equal('0px');
      expect(codeViewer.codeActive).to.be.false;
    });

    it('toggles on - also closes annotations viewer', function () {
      annotationsViewer.openAnnotations();

      $orgs['#sg-t-code'].dispatchAction('removeClass', 'active');
      $orgs['#sg-view-container'].dispatchAction('css', {bottom: '-384px'});

      const sgAnnotationsContainerBefore = $orgs['#sg-annotations-container'].getState();
      const sgCodeContainerBefore = $orgs['#sg-code-container'].getState();
      const sgTAnnotationsBefore = $orgs['#sg-t-annotations'].getState();
      const sgTCodeBefore = $orgs['#sg-t-code'].getState();
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

      codeViewer.toggleCode();

      const sgAnnotationsContainerAfter = $orgs['#sg-annotations-container'].getState();
      const sgCodeContainerAfter = $orgs['#sg-code-container'].getState();
      const sgTAnnotationsAfter = $orgs['#sg-t-annotations'].getState();
      const sgTCodeAfter = $orgs['#sg-t-code'].getState();
      const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

      expect(sgAnnotationsContainerBefore.classArray).to.include('active');
      expect(sgCodeContainerBefore.classArray).to.not.include('active');
      expect(sgTAnnotationsBefore.classArray).to.include('active');
      expect(sgTCodeBefore.classArray).to.not.include('active');
      expect(sgViewContainerBefore.css.bottom).to.equal('-384px');

      expect(sgAnnotationsContainerAfter.classArray).to.not.include('active');
      expect(sgCodeContainerAfter.classArray).to.include('active');
      expect(sgTAnnotationsAfter.classArray).to.not.include('active');
      expect(sgTCodeAfter.classArray).to.include('active');
      expect(sgViewContainerAfter.css.bottom).to.equal('0px');
      expect(annotationsViewer.annotationsActive).to.be.false;
      expect(codeViewer.codeActive).to.be.true;
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
      const sgCodePatternInfoStateBefore = $orgs['#sg-code-pattern-info-state'].getState();

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
      const sgCodePatternInfoStateAfter = $orgs['#sg-code-pattern-info-state'].getState();

      expect(sgCodeContainerBefore.attribs['data-patternpartial'])
        .to.not.equal(sgCodeContainerAfter.attribs['data-patternpartial']);
      expect(sgCodeLineageBefore.css.display).to.not.equal(sgCodeLineageAfter.css.display);
      expect(sgCodeLineageFillBefore.html).to.equal(sgCodeLineageFillAfter.html);
      expect(sgCodeLineagerBefore.css.display).to.not.equal(sgCodeLineagerAfter.css.display);
      expect(sgCodePatternInfoStateBefore.html).to.equal(sgCodePatternInfoStateAfter.html);

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
      const sgCodePatternInfoStateBefore = $orgs['#sg-code-pattern-info-state'].getState();

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
      const sgCodePatternInfoStateAfter = $orgs['#sg-code-pattern-info-state'].getState();

      expect(sgCodeContainerBefore.attribs['data-patternpartial'])
        .to.not.equal(sgCodeContainerAfter.attribs['data-patternpartial']);
      expect(sgCodeLineageBefore.css.display).to.not.equal(sgCodeLineageAfter.css.display);
      expect(sgCodeLineageFillBefore.html).to.not.equal(sgCodeLineageFillAfter.html);
      expect(sgCodeLineagerBefore.css.display).to.not.equal(sgCodeLineagerAfter.css.display);
      expect(sgCodeLineagerFillBefore.html).to.equal(sgCodeLineagerFillAfter.html);
      expect(sgCodePatternInfoStateBefore.html).to.equal(sgCodePatternInfoStateAfter.html);

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
      const sgCodePatternInfoStateBefore = $orgs['#sg-code-pattern-info-state'].getState();

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
      const sgCodePatternInfoStateAfter = $orgs['#sg-code-pattern-info-state'].getState();

      expect(sgCodeContainerBefore.attribs['data-patternpartial'])
        .to.not.equal(sgCodeContainerAfter.attribs['data-patternpartial']);
      expect(sgCodeLineageBefore.css.display).to.not.equal(sgCodeLineageAfter.css.display);
      expect(sgCodeLineageFillBefore.html).to.equal(sgCodeLineageFillAfter.html);
      expect(sgCodeLineagerBefore.css.display).to.not.equal(sgCodeLineagerAfter.css.display);
      expect(sgCodeLineagerFillBefore.html).to.not.equal(sgCodeLineagerFillAfter.html);
      expect(sgCodePatternInfoStateBefore.html).to.equal(sgCodePatternInfoStateAfter.html);

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
      const sgCodePatternInfoStateBefore = $orgs['#sg-code-pattern-info-state'].getState();

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
      const sgCodePatternInfoStateAfter = $orgs['#sg-code-pattern-info-state'].getState();

      expect(sgCodeContainerBefore.attribs['data-patternpartial'])
        .to.not.equal(sgCodeContainerAfter.attribs['data-patternpartial']);
      expect(sgCodeLineageBefore.css.display).to.not.equal(sgCodeLineageAfter.css.display);
      expect(sgCodeLineageFillBefore.html).to.equal(sgCodeLineageFillAfter.html);
      expect(sgCodeLineagerBefore.css.display).to.not.equal(sgCodeLineagerAfter.css.display);
      expect(sgCodeLineagerFillBefore.html).to.equal(sgCodeLineagerFillAfter.html);
      expect(sgCodePatternInfoStateBefore.html).to.not.equal(sgCodePatternInfoStateAfter.html);

      expect(sgCodeContainerAfter.attribs['data-patternpartial']).to.equal('compounds-block');
      expect(sgCodeLineageAfter.css.display).to.equal('none');
      expect(sgCodeLineagerAfter.css.display).to.equal('none');
      expect(sgCodePatternInfoStateAfter.html)
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

    it('updates code on data.codeOverlay = "on"', function () {
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
      const sgCodePatternInfoStateBefore = $orgs['#sg-code-pattern-info-state'].getState();
      const sgCodeLineageBefore = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillBefore = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerBefore = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillBefore = $orgs['#sg-code-lineager-fill'].getState();

      codeViewer.receiveIframeMessage(event);

      const sgCodeContainerAfter = $orgs['#sg-code-container'].getState();
      const sgCodePatternInfoStateAfter = $orgs['#sg-code-pattern-info-state'].getState();
      const sgCodeLineageAfter = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillAfter = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerAfter = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillAfter = $orgs['#sg-code-lineager-fill'].getState();

      expect(sgCodeContainerBefore.attribs['data-patternpartial'])
        .to.not.equal(sgCodeContainerAfter.attribs['data-patternpartial']);
      expect(sgCodePatternInfoStateBefore.html).to.equal(sgCodePatternInfoStateAfter.html);
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
      const sgCodePatternInfoStateBefore = $orgs['#sg-code-pattern-info-state'].getState();
      const sgCodeLineageBefore = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillBefore = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerBefore = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillBefore = $orgs['#sg-code-lineager-fill'].getState();

      codeViewer.receiveIframeMessage(event);

      const sgCodeContainerAfter = $orgs['#sg-code-container'].getState();
      const sgCodePatternInfoStateAfter = $orgs['#sg-code-pattern-info-state'].getState();
      const sgCodeLineageAfter = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillAfter = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerAfter = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillAfter = $orgs['#sg-code-lineager-fill'].getState();

      expect(sgCodeContainerBefore.attribs['data-patternpartial'])
        .to.not.equal(sgCodeContainerAfter.attribs['data-patternpartial']);
      expect(sgCodePatternInfoStateBefore.html).to.equal(sgCodePatternInfoStateAfter.html);
      expect(sgCodeLineageBefore.css.display).to.not.equal(sgCodeLineageAfter.css.display);
      expect(sgCodeLineageFillBefore.html).to.equal(sgCodeLineageFillAfter.html);
      expect(sgCodeLineagerBefore.css.display).to.not.equal(sgCodeLineagerAfter.css.display);
      expect(sgCodeLineagerFillBefore.html).to.equal(sgCodeLineagerFillAfter.html);

      expect(sgCodeContainerAfter.attribs['data-patternpartial']).to.equal('compounds-block');
      expect(sgCodeLineageAfter.css.display).to.equal('none');
      expect(sgCodeLineagerAfter.css.display).to.equal('none');
      expect(codeViewer.viewall).to.be.true;
    });

    it('opens and updates code on data.codeOverlay = "on", data.viewall = true, and data.openCode = true', function () {
      event.data = {
        codeOverlay: 'on',
        lineage: [],
        lineageR: [],
        openCode: true,
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
      $orgs['#sg-view-container'].dispatchAction('css', {bottom: '-384px'});

      const sgCodeContainerBefore = $orgs['#sg-code-container'].getState();
      const sgCodePatternInfoStateBefore = $orgs['#sg-code-pattern-info-state'].getState();
      const sgCodeLineageBefore = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillBefore = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerBefore = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillBefore = $orgs['#sg-code-lineager-fill'].getState();
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

      codeViewer.receiveIframeMessage(event);

      const sgCodeContainerAfter = $orgs['#sg-code-container'].getState();
      const sgCodePatternInfoStateAfter = $orgs['#sg-code-pattern-info-state'].getState();
      const sgCodeLineageAfter = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillAfter = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerAfter = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillAfter = $orgs['#sg-code-lineager-fill'].getState();
      const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

      expect(sgCodeContainerBefore.attribs['data-patternpartial'])
        .to.not.equal(sgCodeContainerAfter.attribs['data-patternpartial']);
      expect(sgCodePatternInfoStateBefore.html).to.equal(sgCodePatternInfoStateAfter.html);
      expect(sgCodeLineageBefore.css.display).to.not.equal(sgCodeLineageAfter.css.display);
      expect(sgCodeLineageFillBefore.html).to.equal(sgCodeLineageFillAfter.html);
      expect(sgCodeLineagerBefore.css.display).to.not.equal(sgCodeLineagerAfter.css.display);
      expect(sgViewContainerBefore.css.bottom).to.equal('-384px');

      expect(sgCodeContainerAfter.attribs['data-patternpartial']).to.equal('compounds-block');
      expect(sgCodeLineageAfter.css.display).to.equal('none');
      expect(sgCodeLineagerAfter.css.display).to.equal('none');
      expect(sgCodeLineagerFillBefore.html).to.equal(sgCodeLineagerFillAfter.html);
      expect(sgViewContainerAfter.css.bottom).to.equal('0px');
      expect(codeViewer.viewall).to.be.true;
    });

    it('closes code on data.codeOverlay = "off"', function () {
      event.data = {
        codeOverlay: 'off'
      };

      codeViewer.openCode();

      const sgTCodeBefore = $orgs['#sg-t-code'].getState();
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

      codeViewer.receiveIframeMessage(event);

      const sgTCodeAfter = $orgs['#sg-t-code'].getState();
      const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

      expect(sgTCodeBefore.classArray).to.include('active');
      expect(sgViewContainerBefore.css.bottom).to.equal('0px');

      expect(sgTCodeAfter.classArray).to.not.include('active');
      expect(sgViewContainerAfter.css.bottom).to.equal('-384px');
      expect(codeViewer.codeActive).to.be.false;
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

    it('toggles code on on patternlab.keyPress "ctrl+shift+c"', function () {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+shift+c'
      };

      annotationsViewer.annotationsActive = true;
      codeViewer.codeActive = false;
      codeViewer.mustacheBrowser = false;

      $orgs['#sg-annotations-container'].dispatchAction('addClass', 'active');
      $orgs['#sg-t-annotations'].dispatchAction('addClass', 'active');
      $orgs['#sg-t-code'].dispatchAction('removeClass', 'active');
      $orgs['#sg-view-container'].dispatchAction('css', {bottom: '-384px'});

      const sgAnnotationsContainerBefore = $orgs['#sg-annotations-container'].getState();
      const sgTAnnotationsBefore = $orgs['#sg-t-annotations'].getState();
      const sgTCodeBefore = $orgs['#sg-t-code'].getState();
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

      codeViewer.receiveIframeMessage(event);

      const sgAnnotationsContainerAfter = $orgs['#sg-annotations-container'].getState();
      const sgTAnnotationsAfter = $orgs['#sg-t-annotations'].getState();
      const sgTCodeAfter = $orgs['#sg-t-code'].getState();
      const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

      expect(sgAnnotationsContainerBefore.classArray).to.include('active');
      expect(sgTAnnotationsBefore.classArray).to.include('active');
      expect(sgTCodeBefore.classArray).to.not.include('active');
      expect(sgViewContainerBefore.css.bottom).to.equal('-384px');

      expect(sgAnnotationsContainerAfter.classArray).to.not.include('active');
      expect(sgTAnnotationsAfter.classArray).to.not.include('active');
      expect(sgTCodeAfter.classArray).to.include('active');
      expect(sgViewContainerAfter.css.bottom).to.equal('0px');
      expect(annotationsViewer.annotationsActive).to.be.false;
      expect(codeViewer.codeActive).to.be.true;
    });

    it('toggles code off on patternlab.keyPress "ctrl+shift+c"', function () {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+shift+c'
      };

      const sgTCodeBefore = $orgs['#sg-t-code'].getState();

      codeViewer.receiveIframeMessage(event);

      const sgTCodeAfter = $orgs['#sg-t-code'].getState();

      expect(sgTCodeBefore.classArray).to.include('active');

      expect(sgTCodeAfter.classArray).to.not.include('active');
      expect(codeViewer.codeActive).to.be.false;
    });

    it('swaps in encoded HTML on patternlab.keyPress "ctrl+alt+h"', function () {
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

    it('swaps in encoded HTML on patternlab.keyPress "ctrl+shift+y"', function () {
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

    it('swaps in Mustache-like Feplet on patternlab.keyPress "ctrl+alt+m"', function () {
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

    it('swaps in Mustache-like Feplet on patternlab.keyPress "ctrl+shift+u"', function () {
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

    it('closes codeViewer on patternlab.keyPress "esc"', function () {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'esc'
      };
      codeViewer.codeActive = true;

      $orgs['#sg-t-code'].dispatchAction('addClass', 'active');
      $orgs['#sg-view-container'].dispatchAction('css', {bottom: '0px'});

      const sgTCodeBefore = $orgs['#sg-t-code'].getState();
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

      codeViewer.receiveIframeMessage(event);

      const sgTCodeAfter = $orgs['#sg-t-code'].getState();
      const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

      expect(sgTCodeBefore.classArray).to.include('active');
      expect(sgViewContainerBefore.css.bottom).to.equal('0px');

      expect(sgTCodeAfter.classArray).to.not.include('active');
      expect(sgViewContainerAfter.css.bottom).to.equal('-384px');
      expect(codeViewer.codeActive).to.be.false;
    });
  });
});
