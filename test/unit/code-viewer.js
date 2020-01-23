import {expect} from 'chai';

import fepperUi from '../unit';

const $orgs = fepperUi.requerio.$orgs;
const annotationsViewer = fepperUi.annotationsViewer;
const codeViewer = fepperUi.codeViewer;

describe('codeViewer', function () {
  describe('.constructor()', function () {
    it('instantiates correctly', function () {
      expect(codeViewer.constructor.name).to.equal('CodeViewer');
      expect(Object.keys(codeViewer).length).to.equal(12);
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
      expect(codeViewer).to.have.property('selectForCopy');
      expect(codeViewer).to.have.property('encoded');
      expect(codeViewer).to.have.property('mustache');
      expect(codeViewer).to.have.property('mustacheBrowser');
      expect(codeViewer).to.have.property('tabActive');
      expect(codeViewer).to.have.property('viewall');
    });
  });

  describe('.stoke()', function () {
    beforeEach(function () {
      codeViewer.selectForCopy = false;

      codeViewer.closeCode();
      $orgs['#sg-code-container'].dispatchAction('css', {bottom: 'auto'});
    });

    it('opens code viewer with a "view=code" param', function () {
      global.location = {
        search: '?view=code'
      };

      const sgCodeContainerStateBefore = $orgs['#sg-code-container'].getState();
      const sgTCodeStateBefore = $orgs['#sg-t-code'].getState();

      codeViewer.stoke();

      const sgCodeContainerStateAfter = $orgs['#sg-code-container'].getState();
      const sgTCodeStateAfter = $orgs['#sg-t-code'].getState();

      expect(sgCodeContainerStateBefore.style.bottom).to.not.equal(sgCodeContainerStateAfter.style.bottom);
      expect(sgTCodeStateBefore.classArray).to.not.include('active');

      expect(sgCodeContainerStateAfter.style.bottom).to.equal('0px');
      expect(sgTCodeStateAfter.classArray).to.include('active');
      expect(codeViewer.selectForCopy).to.be.false;
    });

    it('opens code viewer with a "view=c" param', function () {
      global.location = {
        search: '?view=c'
      };

      const sgCodeContainerStateBefore = $orgs['#sg-code-container'].getState();
      const sgTCodeStateBefore = $orgs['#sg-t-code'].getState();

      codeViewer.stoke();

      const sgCodeContainerStateAfter = $orgs['#sg-code-container'].getState();
      const sgTCodeStateAfter = $orgs['#sg-t-code'].getState();

      expect(sgCodeContainerStateBefore.style.bottom).to.not.equal(sgCodeContainerStateAfter.style.bottom);
      expect(sgTCodeStateBefore.classArray).to.not.include('active');

      expect(sgCodeContainerStateAfter.style.bottom).to.equal('0px');
      expect(sgTCodeStateAfter.classArray).to.include('active');
      expect(codeViewer.selectForCopy).to.be.false;
    });

    it('opens code viewer with a "defaultShowPatternInfo": true config', function () {
      global.location = {
        search: ''
      };
      codeViewer.uiData.config.defaultShowPatternInfo = true;

      const sgCodeContainerStateBefore = $orgs['#sg-code-container'].getState();
      const sgTCodeStateBefore = $orgs['#sg-t-code'].getState();

      codeViewer.stoke();

      const sgCodeContainerStateAfter = $orgs['#sg-code-container'].getState();
      const sgTCodeStateAfter = $orgs['#sg-t-code'].getState();

      expect(sgCodeContainerStateBefore.style.bottom).to.not.equal(sgCodeContainerStateAfter.style.bottom);
      expect(sgTCodeStateBefore.classArray).to.not.include('active');

      expect(sgCodeContainerStateAfter.style.bottom).to.equal('0px');
      expect(sgTCodeStateAfter.classArray).to.include('active');
      expect(codeViewer.selectForCopy).to.be.false;

      codeViewer.uiData.config.defaultShowPatternInfo = false;
    });

    it('sets .selectForCopy = true with a "view=code&copy=true" param', function () {
      global.location = {
        search: '?view=code&copy=true'
      };

      const sgCodeContainerStateBefore = $orgs['#sg-code-container'].getState();
      const sgTCodeStateBefore = $orgs['#sg-t-code'].getState();

      codeViewer.stoke();

      const sgCodeContainerStateAfter = $orgs['#sg-code-container'].getState();
      const sgTCodeStateAfter = $orgs['#sg-t-code'].getState();

      expect(sgCodeContainerStateBefore.style.bottom).to.not.equal(sgCodeContainerStateAfter.style.bottom);
      expect(sgTCodeStateBefore.classArray).to.not.include('active');

      expect(sgCodeContainerStateAfter.style.bottom).to.equal('0px');
      expect(sgTCodeStateAfter.classArray).to.include('active');
      expect(codeViewer.selectForCopy).to.be.true;
    });
  });

  describe('.activateDefaultTab()', function () {
    it('activates tab and fills with content', function () {
      $orgs['#sg-code-title-html'].dispatchAction('removeClass', 'sg-code-title-active');
      $orgs['#sg-code-title-mustache'].dispatchAction('removeClass', 'sg-code-title-active');

      const sgCodeTitleHtmlStateBefore = $orgs['#sg-code-title-html'].getState();
      const sgCodeTitleMustacheStateBefore = $orgs['#sg-code-title-mustache'].getState();
      const sgCodeFillStateBefore = $orgs['#sg-code-fill'].getState();

      codeViewer.activateDefaultTab('m', 'mustache');

      const sgCodeTitleHtmlStateAfter = $orgs['#sg-code-title-html'].getState();
      const sgCodeTitleMustacheStateAfter = $orgs['#sg-code-title-mustache'].getState();
      const sgCodeFillStateAfter = $orgs['#sg-code-fill'].getState();

      expect(sgCodeTitleHtmlStateBefore.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeTitleMustacheStateBefore.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeFillStateBefore.innerHTML).to.not.equal(sgCodeFillStateAfter.innerHTML);

      expect(sgCodeTitleHtmlStateAfter.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeTitleMustacheStateAfter.classArray).to.include('sg-code-title-active');
      expect(sgCodeFillStateAfter.innerHTML).to.equal('mustache');
    });
  });

  describe('.getSaveEncodedFunction()', function () {
    it('returns a function that saves encoded HTML', function () {
      codeViewer.encoded = '';
      codeViewer.tabActive = 'e';
      const saveEncoded = codeViewer.getSaveEncodedFunction(codeViewer).bind({responseText: 'encoded'});

      $orgs['#sg-code-title-html'].dispatchAction('removeClass', 'sg-code-title-active');
      $orgs['#sg-code-title-mustache'].dispatchAction('removeClass', 'sg-code-title-active');

      const sgCodeTitleHtmlStateBefore = $orgs['#sg-code-title-html'].getState();
      const sgCodeTitleMustacheStateBefore = $orgs['#sg-code-title-mustache'].getState();
      const sgCodeFillStateBefore = $orgs['#sg-code-fill'].getState();

      saveEncoded();

      const sgCodeTitleHtmlStateAfter = $orgs['#sg-code-title-html'].getState();
      const sgCodeTitleMustacheStateAfter = $orgs['#sg-code-title-mustache'].getState();
      const sgCodeFillStateAfter = $orgs['#sg-code-fill'].getState();

      expect(sgCodeTitleHtmlStateBefore.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeTitleMustacheStateBefore.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeFillStateBefore.innerHTML).to.not.equal(sgCodeFillStateAfter.innerHTML);

      expect(sgCodeTitleHtmlStateAfter.classArray).to.include('sg-code-title-active');
      expect(sgCodeTitleMustacheStateAfter.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeFillStateAfter.innerHTML).to.equal('encoded');
    });
  });

  describe('.getSaveMustacheFunction()', function () {
    it('returns a function that saves Mustache-like Feplet', function () {
      codeViewer.mustache = '';
      codeViewer.tabActive = 'm';
      const saveMustache = codeViewer.getSaveMustacheFunction(codeViewer).bind({responseText: 'mustache'});

      $orgs['#sg-code-title-html'].dispatchAction('removeClass', 'sg-code-title-active');
      $orgs['#sg-code-title-mustache'].dispatchAction('removeClass', 'sg-code-title-active');

      const sgCodeTitleHtmlStateBefore = $orgs['#sg-code-title-html'].getState();
      const sgCodeTitleMustacheStateBefore = $orgs['#sg-code-title-mustache'].getState();
      const sgCodeFillStateBefore = $orgs['#sg-code-fill'].getState();

      saveMustache();

      const sgCodeTitleHtmlStateAfter = $orgs['#sg-code-title-html'].getState();
      const sgCodeTitleMustacheStateAfter = $orgs['#sg-code-title-mustache'].getState();
      const sgCodeFillStateAfter = $orgs['#sg-code-fill'].getState();

      expect(sgCodeTitleHtmlStateBefore.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeTitleMustacheStateBefore.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeFillStateBefore.innerHTML).to.not.equal(sgCodeFillStateAfter.innerHTML);

      expect(sgCodeTitleHtmlStateAfter.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeTitleMustacheStateAfter.classArray).to.include('sg-code-title-active');
      expect(sgCodeFillStateAfter.innerHTML).to.equal('mustache');
    });
  });

  describe('.slideCode()', function () {
    before(function () {
      $orgs['#sg-code-container'].dispatchAction('css', {bottom: 'auto'});
    });

    after(function () {
      $orgs['#sg-code-container'].dispatchAction('css', {bottom: 'auto'});
    });

    it('slides up', function () {
      const sgCodeContainerStateBefore = $orgs['#sg-code-container'].getState();

      codeViewer.slideCode(768);

      const sgCodeContainerStateAfter = $orgs['#sg-code-container'].getState();

      expect(sgCodeContainerStateBefore.style.bottom).to.not.equal(sgCodeContainerStateAfter.style.bottom);

      expect(sgCodeContainerStateAfter.style.bottom).to.equal('-768px');
    });

    it('slides up', function () {
      const sgCodeContainerStateBefore = $orgs['#sg-code-container'].getState();

      codeViewer.slideCode(0);

      const sgCodeContainerStateAfter = $orgs['#sg-code-container'].getState();

      expect(sgCodeContainerStateBefore.style.bottom).to.not.equal(sgCodeContainerStateAfter.style.bottom);

      expect(sgCodeContainerStateAfter.style.bottom).to.equal('0px');
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

      const sgCodeFillStateBefore = $orgs['#sg-code-fill'].getState();

      codeViewer.swapCode('e');

      const sgCodeTitleHtmlStateAfter = $orgs['#sg-code-title-html'].getState();
      const sgCodeTitleMustacheStateAfter = $orgs['#sg-code-title-mustache'].getState();
      const sgCodeFillStateAfter = $orgs['#sg-code-fill'].getState();

      expect(sgCodeFillStateBefore.innerHTML).to.not.equal(sgCodeFillStateAfter.innerHTML);

      expect(codeViewer.tabActive).to.equal('e');
      expect(sgCodeTitleHtmlStateAfter.classArray).to.include('sg-code-title-active');
      expect(sgCodeTitleMustacheStateAfter.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeFillStateAfter.innerHTML).to.equal('encoded');
    });

    it('swaps in Mustache-like Feplet', function () {
      codeViewer.mustache = 'mustache';

      const sgCodeFillStateBefore = $orgs['#sg-code-fill'].getState();

      codeViewer.swapCode('m');

      const sgCodeTitleHtmlStateAfter = $orgs['#sg-code-title-html'].getState();
      const sgCodeTitleMustacheStateAfter = $orgs['#sg-code-title-mustache'].getState();
      const sgCodeFillStateAfter = $orgs['#sg-code-fill'].getState();

      expect(sgCodeFillStateBefore.innerHTML).to.not.equal(sgCodeFillStateAfter.innerHTML);

      expect(codeViewer.tabActive).to.equal('m');
      expect(sgCodeTitleHtmlStateAfter.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeTitleMustacheStateAfter.classArray).to.include('sg-code-title-active');
      expect(sgCodeFillStateAfter.innerHTML).to.equal('mustache');
    });

    it('does nothing if .codeActive is false', function () {
      codeViewer.codeActive = false;
      codeViewer.mustache = 'mustache';

      $orgs['#sg-code-title-html'].dispatchAction('removeClass', 'sg-code-title-active');
      $orgs['#sg-code-title-mustache'].dispatchAction('removeClass', 'sg-code-title-active');

      const sgCodeTitleHtmlStateBefore = $orgs['#sg-code-title-html'].getState();
      const sgCodeTitleMustacheStateBefore = $orgs['#sg-code-title-mustache'].getState();
      const sgCodeFillStateBefore = $orgs['#sg-code-fill'].getState();

      codeViewer.swapCode('m');

      const sgCodeTitleHtmlStateAfter = $orgs['#sg-code-title-html'].getState();
      const sgCodeTitleMustacheStateAfter = $orgs['#sg-code-title-mustache'].getState();
      const sgCodeFillStateAfter = $orgs['#sg-code-fill'].getState();

      expect(sgCodeTitleHtmlStateBefore.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeTitleMustacheStateBefore.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeFillStateBefore.innerHTML).to.equal(sgCodeFillStateAfter.innerHTML);

      expect(codeViewer.tabActive).to.equal('');
      expect(sgCodeTitleHtmlStateAfter.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeTitleMustacheStateAfter.classArray).to.not.include('sg-code-title-active');
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

      const sgTCodeStateBefore = $orgs['#sg-t-code'].getState();

      codeViewer.toggleCode();

      const sgTCodeStateAfter = $orgs['#sg-t-code'].getState();

      expect(sgTCodeStateBefore.classArray).to.not.include('active');
      expect(sgTCodeStateAfter.classArray).to.not.include('active');

      codeViewer.mustacheBrowser = false;
    });

    it('toggles on - also tests .openCode()', function () {
      codeViewer.closeCode();

      $orgs['#sg-t-code'].dispatchAction('removeClass', 'active');
      $orgs['#sg-code-container'].dispatchAction('css', {bottom: 'auto'});

      const sgCodeContainerStateBefore = $orgs['#sg-code-container'].getState();
      const sgTCodeStateBefore = $orgs['#sg-t-code'].getState();
      const sgVpWrapStateBefore = $orgs['#sg-vp-wrap'].getState();

      codeViewer.toggleCode();

      const sgCodeContainerStateAfter = $orgs['#sg-code-container'].getState();
      const sgTCodeStateAfter = $orgs['#sg-t-code'].getState();
      const sgVpWrapStateAfter = $orgs['#sg-vp-wrap'].getState();

      expect(sgCodeContainerStateBefore.style.bottom).to.not.equal(sgCodeContainerStateAfter.style.bottom);
      expect(sgTCodeStateBefore.classArray).to.not.include('active');
      expect(sgVpWrapStateBefore.style.paddingBottom).to.equal('0px');

      expect(sgCodeContainerStateAfter.style.bottom).to.equal('0px');
      expect(sgTCodeStateAfter.classArray).to.include('active');
      expect(sgVpWrapStateAfter.style.paddingBottom).to.equal('384px');
      expect(codeViewer.codeActive).to.be.true;
    });

    it('toggles off - also tests .closeCode()', function () {
      const sgCodeContainerStateBefore = $orgs['#sg-code-container'].getState();
      const sgTCodeStateBefore = $orgs['#sg-t-code'].getState();
      const sgVpWrapStateBefore = $orgs['#sg-vp-wrap'].getState();

      codeViewer.toggleCode();

      const sgCodeContainerStateAfter = $orgs['#sg-code-container'].getState();
      const sgTCodeStateAfter = $orgs['#sg-t-code'].getState();
      const sgVpWrapStateAfter = $orgs['#sg-vp-wrap'].getState();

      expect(sgCodeContainerStateBefore.style.bottom).to.not.equal(sgCodeContainerStateAfter.style.bottom);
      expect(sgTCodeStateBefore.classArray).to.include('active');
      expect(sgVpWrapStateBefore.style.paddingBottom).to.equal('384px');

      expect(sgCodeContainerStateAfter.style.bottom).to.equal('-384px');
      expect(sgTCodeStateAfter.classArray).to.not.include('active');
      expect(sgVpWrapStateAfter.style.paddingBottom).to.equal('0px');
      expect(codeViewer.codeActive).to.be.false;
    });

    it('toggles on - also closes annotations viewer', function () {
      annotationsViewer.openAnnotations();

      $orgs['#sg-t-code'].dispatchAction('removeClass', 'active');
      $orgs['#sg-code-container'].dispatchAction('css', {bottom: 'auto'});

      const sgTAnnotationsStateBefore = $orgs['#sg-t-annotations'].getState();
      const sgAnnotationsContainerStateBefore = $orgs['#sg-annotations-container'].getState();
      const sgCodeContainerStateBefore = $orgs['#sg-code-container'].getState();
      const sgTCodeStateBefore = $orgs['#sg-t-code'].getState();

      codeViewer.toggleCode();

      const sgTAnnotationsStateAfter = $orgs['#sg-t-annotations'].getState();
      const sgAnnotationsContainerStateAfter = $orgs['#sg-annotations-container'].getState();
      const sgCodeContainerStateAfter = $orgs['#sg-code-container'].getState();
      const sgTCodeStateAfter = $orgs['#sg-t-code'].getState();

      expect(sgTAnnotationsStateBefore.classArray).to.include('active');
      expect(sgAnnotationsContainerStateBefore.style.bottom)
        .to.not.equal(sgAnnotationsContainerStateAfter.style.bottom);
      expect(sgCodeContainerStateBefore.style.bottom).to.not.equal(sgCodeContainerStateAfter.style.bottom);
      expect(sgTCodeStateBefore.classArray).to.not.include('active');

      expect(sgTAnnotationsStateAfter.classArray).to.not.include('active');
      expect(sgAnnotationsContainerStateAfter.style.bottom).to.equal('-384px');
      expect(sgCodeContainerStateAfter.style.bottom).to.equal('0px');
      expect(sgTCodeStateAfter.classArray).to.include('active');
      expect(annotationsViewer.annotationsActive).to.be.false;
      expect(codeViewer.codeActive).to.be.true;
    });
  });

  describe('.updateCode()', function () {
    beforeEach(function () {
      $orgs['#sg-code-container'].dispatchAction('attr', {'data-patternpartial': null});
      $orgs['#sg-code-lineage'].dispatchAction('css', {display: 'inline'});
      $orgs['#sg-code-lineage-fill'].dispatchAction('html', null);
      $orgs['#sg-code-lineager'].dispatchAction('css', {display: 'inline'});
      $orgs['#sg-code-lineager-fill'].dispatchAction('html', null);
      $orgs['#sg-code-pattern-state'].dispatchAction('css', {display: 'inline'});
      $orgs['#sg-code-pattern-state-fill'].dispatchAction('html', null);
    });

    it('updates code', function () {
      const sgCodeContainerStateBefore = $orgs['#sg-code-container'].getState();
      const sgCodeLineageBefore = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillBefore = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerBefore = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillBefore = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodePatternStateBefore = $orgs['#sg-code-pattern-state'].getState();
      const sgCodePatternStateFillBefore = $orgs['#sg-code-pattern-state-fill'].getState();

      codeViewer.updateCode(
        [],
        [],
        'compounds-block',
        ''
      );

      const sgCodeContainerStateAfter = $orgs['#sg-code-container'].getState();
      const sgCodeLineageAfter = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillAfter = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerAfter = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillAfter = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodePatternStateAfter = $orgs['#sg-code-pattern-state'].getState();
      const sgCodePatternStateFillAfter = $orgs['#sg-code-pattern-state-fill'].getState();

      expect(sgCodeContainerStateBefore.attribs['data-patternpartial'])
        .to.not.equal(sgCodeContainerStateAfter.attribs['data-patternpartial']);
      expect(sgCodeLineageBefore.style.display).to.not.equal(sgCodeLineageAfter.style.display);
      expect(sgCodeLineageFillBefore.innerHTML).to.equal(sgCodeLineageFillAfter.innerHTML);
      expect(sgCodeLineagerBefore.style.display).to.not.equal(sgCodeLineagerAfter.style.display);
      expect(sgCodePatternStateBefore.style.display).to.not.equal(sgCodePatternStateAfter.style.display);
      expect(sgCodePatternStateFillBefore.innerHTML).to.equal(sgCodePatternStateFillAfter.innerHTML);

      expect(sgCodeLineagerFillBefore.innerHTML).to.equal(sgCodeLineagerFillAfter.innerHTML);
      expect(sgCodeContainerStateAfter.attribs['data-patternpartial']).to.equal('compounds-block');
      expect(sgCodeLineageAfter.style.display).to.equal('none');
      expect(sgCodeLineagerAfter.style.display).to.equal('none');
      expect(sgCodePatternStateAfter.style.display).to.equal('none');
    });

    /* eslint-disable comma-spacing, key-spacing, max-len, quote-props, quotes */
    it('updates code with lineage array', function () {
      const sgCodeContainerStateBefore = $orgs['#sg-code-container'].getState();
      const sgCodeLineageBefore = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillBefore = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerBefore = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillBefore = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodePatternStateBefore = $orgs['#sg-code-pattern-state'].getState();
      const sgCodePatternStateFillBefore = $orgs['#sg-code-pattern-state-fill'].getState();

      codeViewer.updateCode(
        [{"lineagePattern":"elements-paragraph","lineagePath":"patterns/00-elements-paragraph/00-elements-paragraph.html","isHidden":false,"lineageState":"complete"}],
        [],
        'compounds-block',
        ''
      );

      const sgCodeContainerStateAfter = $orgs['#sg-code-container'].getState();
      const sgCodeLineageAfter = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillAfter = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerAfter = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillAfter = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodePatternStateAfter = $orgs['#sg-code-pattern-state'].getState();
      const sgCodePatternStateFillAfter = $orgs['#sg-code-pattern-state-fill'].getState();

      expect(sgCodeContainerStateBefore.attribs['data-patternpartial'])
        .to.not.equal(sgCodeContainerStateAfter.attribs['data-patternpartial']);
      expect(sgCodeLineageBefore.style.display).to.not.equal(sgCodeLineageAfter.style.display);
      expect(sgCodeLineageFillBefore.innerHTML).to.not.equal(sgCodeLineageFillAfter.innerHTML);
      expect(sgCodeLineagerBefore.style.display).to.not.equal(sgCodeLineagerAfter.style.display);
      expect(sgCodeLineagerFillBefore.innerHTML).to.equal(sgCodeLineagerFillAfter.innerHTML);
      expect(sgCodePatternStateBefore.style.display).to.not.equal(sgCodePatternStateAfter.style.display);
      expect(sgCodePatternStateFillBefore.innerHTML).to.equal(sgCodePatternStateFillAfter.innerHTML);

      expect(sgCodeContainerStateAfter.attribs['data-patternpartial']).to.equal('compounds-block');
      expect(sgCodeLineageAfter.style.display).to.equal('block');
      expect(sgCodeLineageFillAfter.innerHTML).to.equal(
        '<a href="patterns/00-elements-paragraph/00-elements-paragraph.html" class="sg-pattern-state complete" data-patternpartial="elements-paragraph">elements-paragraph</a>'
      );
      expect(sgCodeLineagerAfter.style.display).to.equal('none');
      expect(sgCodePatternStateAfter.style.display).to.equal('none');
    });

    it('updates code with lineageR array', function () {
      const sgCodeContainerStateBefore = $orgs['#sg-code-container'].getState();
      const sgCodeLineageBefore = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillBefore = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerBefore = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillBefore = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodePatternStateBefore = $orgs['#sg-code-pattern-state'].getState();
      const sgCodePatternStateFillBefore = $orgs['#sg-code-pattern-state-fill'].getState();

      codeViewer.updateCode(
        [],
        [{"lineagePattern":"components-region","lineagePath":"patterns/02-components-region/02-components-region.html","isHidden":false,"lineageState":"inreview"}],
        'compounds-block',
        ''
      );

      const sgCodeContainerStateAfter = $orgs['#sg-code-container'].getState();
      const sgCodeLineageAfter = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillAfter = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerAfter = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillAfter = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodePatternStateAfter = $orgs['#sg-code-pattern-state'].getState();
      const sgCodePatternStateFillAfter = $orgs['#sg-code-pattern-state-fill'].getState();

      expect(sgCodeContainerStateBefore.attribs['data-patternpartial'])
        .to.not.equal(sgCodeContainerStateAfter.attribs['data-patternpartial']);
      expect(sgCodeLineageBefore.style.display).to.not.equal(sgCodeLineageAfter.style.display);
      expect(sgCodeLineageFillBefore.innerHTML).to.equal(sgCodeLineageFillAfter.innerHTML);
      expect(sgCodeLineagerBefore.style.display).to.not.equal(sgCodeLineagerAfter.style.display);
      expect(sgCodeLineagerFillBefore.innerHTML).to.not.equal(sgCodeLineagerFillAfter.innerHTML);
      expect(sgCodePatternStateBefore.style.display).to.not.equal(sgCodePatternStateAfter.style.display);
      expect(sgCodePatternStateFillBefore.innerHTML).to.equal(sgCodePatternStateFillAfter.innerHTML);

      expect(sgCodeContainerStateAfter.attribs['data-patternpartial']).to.equal('compounds-block');
      expect(sgCodeLineageAfter.style.display).to.equal('none');
      expect(sgCodeLineagerAfter.style.display).to.equal('block');
      expect(sgCodeLineagerFillAfter.innerHTML).to.equal(
        '<a href="patterns/02-components-region/02-components-region.html" class="sg-pattern-state inreview" data-patternpartial="components-region">components-region</a>'
      );
      expect(sgCodePatternStateAfter.style.display).to.equal('none');
    });
    /* eslint-enable comma-spacing, key-spacing, max-len, quote-props, quotes */

    it('updates code with pattern state', function () {
      const sgCodeContainerStateBefore = $orgs['#sg-code-container'].getState();
      const sgCodeLineageBefore = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillBefore = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerBefore = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillBefore = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodePatternStateBefore = $orgs['#sg-code-pattern-state'].getState();
      const sgCodePatternStateFillBefore = $orgs['#sg-code-pattern-state-fill'].getState();

      codeViewer.updateCode(
        [],
        [],
        'compounds-block',
        'inprogress'
      );

      const sgCodeContainerStateAfter = $orgs['#sg-code-container'].getState();
      const sgCodeLineageAfter = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillAfter = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerAfter = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillAfter = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodePatternStateAfter = $orgs['#sg-code-pattern-state'].getState();
      const sgCodePatternStateFillAfter = $orgs['#sg-code-pattern-state-fill'].getState();

      expect(sgCodeContainerStateBefore.attribs['data-patternpartial'])
        .to.not.equal(sgCodeContainerStateAfter.attribs['data-patternpartial']);
      expect(sgCodeLineageBefore.style.display).to.not.equal(sgCodeLineageAfter.style.display);
      expect(sgCodeLineageFillBefore.innerHTML).to.equal(sgCodeLineageFillAfter.innerHTML);
      expect(sgCodeLineagerBefore.style.display).to.not.equal(sgCodeLineagerAfter.style.display);
      expect(sgCodeLineagerFillBefore.innerHTML).to.equal(sgCodeLineagerFillAfter.innerHTML);
      expect(sgCodePatternStateBefore.style.display).to.not.equal(sgCodePatternStateAfter.style.display);
      expect(sgCodePatternStateFillBefore.innerHTML).to.not.equal(sgCodePatternStateFillAfter.innerHTML);

      expect(sgCodeContainerStateAfter.attribs['data-patternpartial']).to.equal('compounds-block');
      expect(sgCodeLineageAfter.style.display).to.equal('none');
      expect(sgCodeLineagerAfter.style.display).to.equal('none');
      expect(sgCodePatternStateAfter.style.display).to.equal('block');
      expect(sgCodePatternStateFillAfter.innerHTML)
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

      const sgCodeTitleHtmlStateBefore = $orgs['#sg-code-title-html'].getState();
      const sgCodeTitleMustacheStateBefore = $orgs['#sg-code-title-mustache'].getState();
      const sgCodeFillStateBefore = $orgs['#sg-code-fill'].getState();

      printXHRError();

      const sgCodeTitleHtmlStateAfter = $orgs['#sg-code-title-html'].getState();
      const sgCodeTitleMustacheStateAfter = $orgs['#sg-code-title-mustache'].getState();
      const sgCodeFillStateAfter = $orgs['#sg-code-fill'].getState();

      expect(sgCodeTitleHtmlStateBefore.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeTitleMustacheStateBefore.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeFillStateBefore.innerHTML).to.not.equal(sgCodeFillStateAfter.innerHTML);

      expect(sgCodeTitleHtmlStateAfter.classArray).to.include('sg-code-title-active');
      expect(sgCodeTitleMustacheStateAfter.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeFillStateAfter.innerHTML).to.equal('Status 418: I&apos;m a teapot');
    });

    it('returns a function that prints the XHR error given protocol "file:" and no status', function () {
      global.location = {
        protocol: 'file:'
      };
      codeViewer.tabActive = 'm';
      const printXHRError = codeViewer.getPrintXHRErrorFunction(codeViewer).bind({});

      $orgs['#sg-code-title-html'].dispatchAction('removeClass', 'sg-code-title-active');
      $orgs['#sg-code-title-mustache'].dispatchAction('removeClass', 'sg-code-title-active');

      const sgCodeTitleHtmlStateBefore = $orgs['#sg-code-title-html'].getState();
      const sgCodeTitleMustacheStateBefore = $orgs['#sg-code-title-mustache'].getState();
      const sgCodeFillStateBefore = $orgs['#sg-code-fill'].getState();

      printXHRError();

      const sgCodeTitleHtmlStateAfter = $orgs['#sg-code-title-html'].getState();
      const sgCodeTitleMustacheStateAfter = $orgs['#sg-code-title-mustache'].getState();
      const sgCodeFillStateAfter = $orgs['#sg-code-fill'].getState();

      expect(sgCodeTitleHtmlStateBefore.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeTitleMustacheStateBefore.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeFillStateBefore.innerHTML).to.not.equal(sgCodeFillStateAfter.innerHTML);

      expect(sgCodeTitleHtmlStateAfter.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeTitleMustacheStateAfter.classArray).to.include('sg-code-title-active');
      expect(sgCodeFillStateAfter.innerHTML)
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
      $orgs['#sg-code-lineage'].dispatchAction('css', {display: 'inline'});
      $orgs['#sg-code-lineage-fill'].dispatchAction('html', null);
      $orgs['#sg-code-lineager'].dispatchAction('css', {display: 'inline'});
      $orgs['#sg-code-lineager-fill'].dispatchAction('html', null);
      $orgs['#sg-code-pattern-state'].dispatchAction('css', {display: 'inline'});
      $orgs['#sg-code-pattern-state-fill'].dispatchAction('html', null);

      const sgCodeContainerStateBefore = $orgs['#sg-code-container'].getState();
      const sgCodeLineageBefore = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillBefore = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerBefore = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillBefore = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodePatternStateBefore = $orgs['#sg-code-pattern-state'].getState();
      const sgCodePatternStateFillBefore = $orgs['#sg-code-pattern-state-fill'].getState();

      codeViewer.receiveIframeMessage(event);

      const sgCodeContainerStateAfter = $orgs['#sg-code-container'].getState();
      const sgCodeLineageAfter = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillAfter = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerAfter = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillAfter = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodePatternStateAfter = $orgs['#sg-code-pattern-state'].getState();
      const sgCodePatternStateFillAfter = $orgs['#sg-code-pattern-state-fill'].getState();

      expect(sgCodeContainerStateBefore.attribs['data-patternpartial'])
        .to.not.equal(sgCodeContainerStateAfter.attribs['data-patternpartial']);
      expect(sgCodeLineageBefore.style.display).to.not.equal(sgCodeLineageAfter.style.display);
      expect(sgCodeLineageFillBefore.innerHTML).to.equal(sgCodeLineageFillAfter.innerHTML);
      expect(sgCodeLineagerBefore.style.display).to.not.equal(sgCodeLineagerAfter.style.display);
      expect(sgCodePatternStateBefore.style.display).to.not.equal(sgCodePatternStateAfter.style.display);
      expect(sgCodePatternStateFillBefore.innerHTML).to.equal(sgCodePatternStateFillAfter.innerHTML);

      expect(sgCodeLineagerFillBefore.innerHTML).to.equal(sgCodeLineagerFillAfter.innerHTML);
      expect(sgCodeContainerStateAfter.attribs['data-patternpartial']).to.equal('compounds-block');
      expect(sgCodeLineageAfter.style.display).to.equal('none');
      expect(sgCodeLineagerAfter.style.display).to.equal('none');
      expect(sgCodePatternStateAfter.style.display).to.equal('none');
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
      $orgs['#sg-code-lineage'].dispatchAction('css', {display: 'inline'});
      $orgs['#sg-code-lineage-fill'].dispatchAction('html', null);
      $orgs['#sg-code-lineager'].dispatchAction('css', {display: 'inline'});
      $orgs['#sg-code-lineager-fill'].dispatchAction('html', null);
      $orgs['#sg-code-pattern-state'].dispatchAction('css', {display: 'inline'});
      $orgs['#sg-code-pattern-state-fill'].dispatchAction('html', null);

      const sgCodeContainerStateBefore = $orgs['#sg-code-container'].getState();
      const sgCodeLineageBefore = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillBefore = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerBefore = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillBefore = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodePatternStateBefore = $orgs['#sg-code-pattern-state'].getState();
      const sgCodePatternStateFillBefore = $orgs['#sg-code-pattern-state-fill'].getState();

      codeViewer.receiveIframeMessage(event);

      const sgCodeContainerStateAfter = $orgs['#sg-code-container'].getState();
      const sgCodeLineageAfter = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillAfter = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerAfter = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillAfter = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodePatternStateAfter = $orgs['#sg-code-pattern-state'].getState();
      const sgCodePatternStateFillAfter = $orgs['#sg-code-pattern-state-fill'].getState();

      expect(sgCodeContainerStateBefore.attribs['data-patternpartial'])
        .to.not.equal(sgCodeContainerStateAfter.attribs['data-patternpartial']);
      expect(sgCodeLineageBefore.style.display).to.not.equal(sgCodeLineageAfter.style.display);
      expect(sgCodeLineageFillBefore.innerHTML).to.equal(sgCodeLineageFillAfter.innerHTML);
      expect(sgCodeLineagerBefore.style.display).to.not.equal(sgCodeLineagerAfter.style.display);
      expect(sgCodePatternStateBefore.style.display).to.not.equal(sgCodePatternStateAfter.style.display);
      expect(sgCodePatternStateFillBefore.innerHTML).to.equal(sgCodePatternStateFillAfter.innerHTML);

      expect(sgCodeLineagerFillBefore.innerHTML).to.equal(sgCodeLineagerFillAfter.innerHTML);
      expect(sgCodeContainerStateAfter.attribs['data-patternpartial']).to.equal('compounds-block');
      expect(sgCodeLineageAfter.style.display).to.equal('none');
      expect(sgCodeLineagerAfter.style.display).to.equal('none');
      expect(sgCodePatternStateAfter.style.display).to.equal('none');
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
      $orgs['#sg-code-lineage'].dispatchAction('css', {display: 'inline'});
      $orgs['#sg-code-lineage-fill'].dispatchAction('html', null);
      $orgs['#sg-code-lineager'].dispatchAction('css', {display: 'inline'});
      $orgs['#sg-code-lineager-fill'].dispatchAction('html', null);
      $orgs['#sg-code-pattern-state'].dispatchAction('css', {display: 'inline'});
      $orgs['#sg-code-pattern-state-fill'].dispatchAction('html', null);

      const sgCodeContainerStateBefore = $orgs['#sg-code-container'].getState();
      const sgCodeLineageBefore = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillBefore = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerBefore = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillBefore = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodePatternStateBefore = $orgs['#sg-code-pattern-state'].getState();
      const sgCodePatternStateFillBefore = $orgs['#sg-code-pattern-state-fill'].getState();

      codeViewer.receiveIframeMessage(event);

      const sgCodeContainerStateAfter = $orgs['#sg-code-container'].getState();
      const sgCodeLineageAfter = $orgs['#sg-code-lineage'].getState();
      const sgCodeLineageFillAfter = $orgs['#sg-code-lineage-fill'].getState();
      const sgCodeLineagerAfter = $orgs['#sg-code-lineager'].getState();
      const sgCodeLineagerFillAfter = $orgs['#sg-code-lineager-fill'].getState();
      const sgCodePatternStateAfter = $orgs['#sg-code-pattern-state'].getState();
      const sgCodePatternStateFillAfter = $orgs['#sg-code-pattern-state-fill'].getState();

      expect(sgCodeContainerStateBefore.style.bottom).to.not.equal(sgCodeContainerStateAfter.style.bottom);
      expect(sgCodeContainerStateBefore.attribs['data-patternpartial'])
        .to.not.equal(sgCodeContainerStateAfter.attribs['data-patternpartial']);
      expect(sgCodeLineageBefore.style.display).to.not.equal(sgCodeLineageAfter.style.display);
      expect(sgCodeLineageFillBefore.innerHTML).to.equal(sgCodeLineageFillAfter.innerHTML);
      expect(sgCodeLineagerBefore.style.display).to.not.equal(sgCodeLineagerAfter.style.display);
      expect(sgCodePatternStateBefore.style.display).to.not.equal(sgCodePatternStateAfter.style.display);
      expect(sgCodePatternStateFillBefore.innerHTML).to.equal(sgCodePatternStateFillAfter.innerHTML);

      expect(sgCodeContainerStateAfter.style.bottom).to.equal('0px');
      expect(sgCodeLineagerFillBefore.innerHTML).to.equal(sgCodeLineagerFillAfter.innerHTML);
      expect(sgCodeContainerStateAfter.attribs['data-patternpartial']).to.equal('compounds-block');
      expect(sgCodeLineageAfter.style.display).to.equal('none');
      expect(sgCodeLineagerAfter.style.display).to.equal('none');
      expect(sgCodePatternStateAfter.style.display).to.equal('none');
      expect(codeViewer.viewall).to.be.true;
    });

    it('closes code on data.codeOverlay = "off"', function () {
      event.data = {
        codeOverlay: 'off'
      };

      codeViewer.openCode();

      const sgCodeContainerStateBefore = $orgs['#sg-code-container'].getState();
      const sgTCodeStateBefore = $orgs['#sg-t-code'].getState();

      codeViewer.receiveIframeMessage(event);

      const sgCodeContainerStateAfter = $orgs['#sg-code-container'].getState();
      const sgTCodeStateAfter = $orgs['#sg-t-code'].getState();

      expect(sgCodeContainerStateBefore.style.bottom).to.not.equal(sgCodeContainerStateAfter.style.bottom);
      expect(sgTCodeStateBefore.classArray).to.include('active');

      expect(sgCodeContainerStateAfter.style.bottom).to.equal('-384px');
      expect(sgTCodeStateAfter.classArray).to.not.include('active');
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

      $orgs['#sg-t-annotations'].dispatchAction('addClass', 'active');
      $orgs['#sg-annotations-container'].dispatchAction('css', {bottom: 'auto'});
      $orgs['#sg-t-code'].dispatchAction('removeClass', 'active');

      const sgTAnnotationsStateBefore = $orgs['#sg-t-annotations'].getState();
      const sgAnnotationsContainerStateBefore = $orgs['#sg-annotations-container'].getState();
      const sgTCodeStateBefore = $orgs['#sg-t-code'].getState();

      codeViewer.receiveIframeMessage(event);

      const sgTAnnotationsStateAfter = $orgs['#sg-t-annotations'].getState();
      const sgAnnotationsContainerStateAfter = $orgs['#sg-annotations-container'].getState();
      const sgTCodeStateAfter = $orgs['#sg-t-code'].getState();

      expect(sgTAnnotationsStateBefore.classArray).to.include('active');
      expect(sgAnnotationsContainerStateBefore.style.bottom)
        .to.not.equal(sgAnnotationsContainerStateAfter.style.bottom);
      expect(sgTCodeStateBefore.classArray).to.not.include('active');

      expect(sgTAnnotationsStateAfter.classArray).to.not.include('active');
      expect(sgAnnotationsContainerStateAfter.style.bottom).to.equal('-384px');
      expect(sgTCodeStateAfter.classArray).to.include('active');
      expect(annotationsViewer.annotationsActive).to.be.false;
      expect(codeViewer.codeActive).to.be.true;
    });

    it('toggles code off on patternlab.keyPress "ctrl+shift+c"', function () {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+shift+c'
      };

      const sgTCodeStateBefore = $orgs['#sg-t-code'].getState();

      codeViewer.receiveIframeMessage(event);

      const sgTCodeStateAfter = $orgs['#sg-t-code'].getState();

      expect(sgTCodeStateBefore.classArray).to.include('active');

      expect(sgTCodeStateAfter.classArray).to.not.include('active');
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

      const sgCodeFillStateBefore = $orgs['#sg-code-fill'].getState();

      codeViewer.receiveIframeMessage(event);

      const sgCodeTitleHtmlStateAfter = $orgs['#sg-code-title-html'].getState();
      const sgCodeTitleMustacheStateAfter = $orgs['#sg-code-title-mustache'].getState();
      const sgCodeFillStateAfter = $orgs['#sg-code-fill'].getState();

      expect(sgCodeFillStateBefore.innerHTML).to.not.equal(sgCodeFillStateAfter.innerHTML);

      expect(codeViewer.tabActive).to.equal('e');
      expect(sgCodeTitleHtmlStateAfter.classArray).to.include('sg-code-title-active');
      expect(sgCodeTitleMustacheStateAfter.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeFillStateAfter.innerHTML).to.equal('encoded');
    });

    it('swaps in encoded HTML on patternlab.keyPress "ctrl+shift+y"', function () {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+shift+y'
      };
      codeViewer.codeActive = true;
      codeViewer.encoded = 'encoded';

      $orgs['#sg-code-fill'].dispatchAction('html', '');

      const sgCodeFillStateBefore = $orgs['#sg-code-fill'].getState();

      codeViewer.receiveIframeMessage(event);

      const sgCodeTitleHtmlStateAfter = $orgs['#sg-code-title-html'].getState();
      const sgCodeTitleMustacheStateAfter = $orgs['#sg-code-title-mustache'].getState();
      const sgCodeFillStateAfter = $orgs['#sg-code-fill'].getState();

      expect(sgCodeFillStateBefore.innerHTML).to.not.equal(sgCodeFillStateAfter.innerHTML);

      expect(codeViewer.tabActive).to.equal('e');
      expect(sgCodeTitleHtmlStateAfter.classArray).to.include('sg-code-title-active');
      expect(sgCodeTitleMustacheStateAfter.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeFillStateAfter.innerHTML).to.equal('encoded');
    });

    it('swaps in Mustache-like Feplet on patternlab.keyPress "ctrl+alt+m"', function () {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+alt+m'
      };
      codeViewer.codeActive = true;
      codeViewer.mustache = 'mustache';

      $orgs['#sg-code-fill'].dispatchAction('html', '');

      const sgCodeFillStateBefore = $orgs['#sg-code-fill'].getState();

      codeViewer.receiveIframeMessage(event);

      const sgCodeTitleHtmlStateAfter = $orgs['#sg-code-title-html'].getState();
      const sgCodeTitleMustacheStateAfter = $orgs['#sg-code-title-mustache'].getState();
      const sgCodeFillStateAfter = $orgs['#sg-code-fill'].getState();

      expect(sgCodeFillStateBefore.innerHTML).to.not.equal(sgCodeFillStateAfter.innerHTML);

      expect(codeViewer.tabActive).to.equal('m');
      expect(sgCodeTitleHtmlStateAfter.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeTitleMustacheStateAfter.classArray).to.include('sg-code-title-active');
      expect(sgCodeFillStateAfter.innerHTML).to.equal('mustache');
    });

    it('swaps in Mustache-like Feplet on patternlab.keyPress "ctrl+shift+u"', function () {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+shift+u'
      };
      codeViewer.codeActive = true;
      codeViewer.mustache = 'mustache';

      $orgs['#sg-code-fill'].dispatchAction('html', '');

      const sgCodeFillStateBefore = $orgs['#sg-code-fill'].getState();

      codeViewer.receiveIframeMessage(event);

      const sgCodeTitleHtmlStateAfter = $orgs['#sg-code-title-html'].getState();
      const sgCodeTitleMustacheStateAfter = $orgs['#sg-code-title-mustache'].getState();
      const sgCodeFillStateAfter = $orgs['#sg-code-fill'].getState();

      expect(sgCodeFillStateBefore.innerHTML).to.not.equal(sgCodeFillStateAfter.innerHTML);

      expect(codeViewer.tabActive).to.equal('m');
      expect(sgCodeTitleHtmlStateAfter.classArray).to.not.include('sg-code-title-active');
      expect(sgCodeTitleMustacheStateAfter.classArray).to.include('sg-code-title-active');
      expect(sgCodeFillStateAfter.innerHTML).to.equal('mustache');
    });

    it('closes codeViewer on patternlab.keyPress "esc"', function () {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'esc'
      };
      codeViewer.codeActive = true;

      $orgs['#sg-code-container'].dispatchAction('css', {bottom: '0px'});
      $orgs['#sg-t-code'].dispatchAction('addClass', 'active');

      const sgCodeContainerStateBefore = $orgs['#sg-code-container'].getState();
      const sgTCodeStateBefore = $orgs['#sg-t-code'].getState();

      codeViewer.receiveIframeMessage(event);

      const sgCodeContainerStateAfter = $orgs['#sg-code-container'].getState();
      const sgTCodeStateAfter = $orgs['#sg-t-code'].getState();

      expect(sgTCodeStateBefore.classArray).to.include('active');
      expect(sgCodeContainerStateBefore.style.bottom).to.not.equal(sgCodeContainerStateAfter.style.bottom);

      expect(sgCodeContainerStateAfter.style.bottom).to.equal('-384px');
      expect(sgTCodeStateAfter.classArray).to.not.include('active');
      expect(codeViewer.codeActive).to.be.false;
    });
  });
});
