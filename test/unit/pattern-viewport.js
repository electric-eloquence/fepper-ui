import {expect} from 'chai';
import fs from 'fs';
import sinon from 'sinon';

import fepperUi from '../unit';

const sandbox = sinon.createSandbox();

const $orgs = fepperUi.requerio.$orgs;
const patternViewport = fepperUi.patternViewport;
const uiFns = fepperUi.uiFns;
const uiProps = fepperUi.uiProps;

describe('patternViewport', function () {
  describe('.constructor()', function () {
    it('instantiates correctly', function () {
      expect(patternViewport.constructor.name).to.equal('PatternViewport');
      expect(Object.keys(patternViewport).length).to.equal(3);
      expect(patternViewport).to.have.property('receiveIframeMessage');
      expect(patternViewport).to.have.property('$orgs');
      expect(patternViewport).to.have.property('uiData');
      expect(patternViewport).to.have.property('uiFns');
      expect(patternViewport).to.have.property('uiProps');
      expect(patternViewport).to.have.property('dataSaver');
      expect(patternViewport).to.have.property('urlHandler');
    });
  });

  describe('.stoke()', function () {
    before(function () {
      global.location = {
        protocol: 'http:'
      };
    });

    // Test rendering first so we can capture initial state.
    describe('rendering', function () {
      let patternlabHtmlStateBefore;
      let sgControlsStateBefore;
      let sgNavTargetStateBefore;
      let patternlabHtmlStateAfter;
      let sgControlsStateAfter;
      let sgNavTargetStateAfter;

      before(function () {
        patternlabHtmlStateBefore = $orgs['#patternlab-html'].getState();
        sgControlsStateBefore = $orgs['#sg-controls'].getState();
        sgNavTargetStateBefore = $orgs['#sg-nav-target'].getState();

        patternViewport.stoke();

        patternlabHtmlStateAfter = $orgs['#patternlab-html'].getState();
        sgControlsStateAfter = $orgs['#sg-controls'].getState();
        sgNavTargetStateAfter = $orgs['#sg-nav-target'].getState();
      });

      /* eslint-disable max-len */
      it('Feplet renders in nav target', function () {
        expect(sgNavTargetStateBefore.html).to.not.equal(sgNavTargetStateAfter.html);

        expect(sgNavTargetStateAfter.html).to.equal(`
  <li class="sg-nav-elements"><a class="sg-acc-handle">Elements</a><ul class="sg-acc-panel sg-sub-nav">
    <li class="sg-item-nav-elements-paragraph">
      <a href="patterns/00-elements-paragraph/00-elements-paragraph.html" class="sg-pop " data-patternpartial="elements-paragraph">Paragraph</a>
    </li>
    <li class="sg-item-nav-viewall-elements">
      <a href="patterns/00-elements/index.html" class="sg-pop " data-patternpartial="viewall-elements">View All</a>
    </li>
  </ul></li>
  <li class="sg-nav-compounds"><a class="sg-acc-handle">Compounds</a><ul class="sg-acc-panel sg-sub-nav">
    <li class="sg-item-nav-compounds-block">
      <a href="patterns/01-compounds-block/01-compounds-block.html" class="sg-pop " data-patternpartial="compounds-block">Block</a>
    </li>
    <li class="sg-item-nav-viewall-compounds">
      <a href="patterns/01-compounds/index.html" class="sg-pop " data-patternpartial="viewall-compounds">View All</a>
    </li>
  </ul></li>
  <li class="sg-nav-components"><a class="sg-acc-handle">Components</a><ul class="sg-acc-panel sg-sub-nav">
    <li class="sg-item-nav-components-region">
      <a href="patterns/02-components-region/02-components-region.html" class="sg-pop " data-patternpartial="components-region">Region</a>
    </li>
    <li class="sg-item-nav-viewall-components">
      <a href="patterns/02-components/index.html" class="sg-pop " data-patternpartial="viewall-components">View All</a>
    </li>
  </ul></li>
  <li class="sg-nav-templates"><a class="sg-acc-handle">Templates</a><ul class="sg-acc-panel sg-sub-nav">
    <li class="sg-item-nav-templates-page">
      <a href="patterns/03-templates-page/03-templates-page.html" class="sg-pop " data-patternpartial="templates-page">Page</a>
    </li>
    <li class="sg-item-nav-viewall-templates">
      <a href="patterns/03-templates/index.html" class="sg-pop " data-patternpartial="viewall-templates">View All</a>
    </li>
  </ul></li>
  <li class="sg-nav-pages"><a class="sg-acc-handle">Pages</a><ul class="sg-acc-panel sg-sub-nav">
    <li class="sg-item-nav-pages-homepage">
      <a href="patterns/04-pages-00-homepage/04-pages-00-homepage.html" class="sg-pop " data-patternpartial="pages-homepage">Homepage</a>
    </li>
    <li class="sg-item-nav-pages-test-svg">
      <a href="patterns/04-pages-test-svg/04-pages-test-svg.html" class="sg-pop " data-patternpartial="pages-test-svg">Test Svg</a>
    </li>
    <li class="sg-item-nav-viewall-pages">
      <a href="patterns/04-pages/index.html" class="sg-pop " data-patternpartial="viewall-pages">View All</a>
    </li>
  </ul></li>
  <li class="sg-nav-scrape"><a class="sg-acc-handle">Scrape</a><ul class="sg-acc-panel sg-sub-nav">
    <li class="sg-item-nav-scrape-html-scraper">
      <a href="patterns/98-scrape-00-html-scraper/98-scrape-00-html-scraper.html" class="sg-pop " data-patternpartial="scrape-html-scraper">Html Scraper</a>
    </li>
  </ul></li>
<li><a href="patterns/viewall/viewall.html" class="sg-pop" data-patternpartial="viewall">All</a></li>
`);
      });

      it('Feplet renders in controls', function () {
        expect(sgControlsStateBefore.html).to.not.equal(sgControlsStateAfter.html);

        expect(sgControlsStateAfter.html).to.equal(`<li class="sg-size">
<div class="sg-current-size">
  <form id="sg-form">
    <a class="sg-acc-handle sg-size-label" id="sg-form-label">Size</a><input type="text" class="sg-input" id="sg-size-px" value="---"><div class="sg-size-label">px /</div><input type="text" class="sg-input" id="sg-size-em" value="0.00"><div class="sg-size-label">em</div>
  </form>
</div>
<div class="sg-acc-panel sg-size-options">
  <ul id="sg-resize-btns"><li><a href="#" id="sg-size-xx">XX</a></li><li><a href="#" id="sg-size-xs">XS</a></li><li><a href="#" id="sg-size-sm">SM</a></li><li><a href="#" id="sg-size-md">MD</a></li><li><a href="#" id="sg-size-lg">LG</a></li></ul>
  <ul id="sg-size-ish">
    <li><a href="#" id="sg-size-w">W</a></li>
    <li><a href="#" id="sg-size-random">Random</a></li>
    <li><a href="#" class="mode-link" id="sg-size-disco">Disco</a></li>
    <li><a href="#" class="mode-link" id="sg-size-grow">Grow</a></li>
  </ul>
</div>
</li><li class="sg-find">
  <a href="#" class="sg-control-trigger sg-icon sg-icon-search" id="sg-f-toggle" title="Pattern Search"><span class="visually-hidden">Pattern Search</span></a>
  <ul class="sg-acc-panel sg-right sg-checklist" id="sg-find" style="top: 32px;">
    <li><input class="typeahead" id="typeahead" type="text" placeholder="Pattern Search"></li>
  </ul>
</li><li class="sg-view">
  <a href="#" class="sg-acc-handle sg-control-trigger sg-icon sg-icon-eye" id="sg-t-toggle" title="View"><span class="visually-hidden">View</span></a>
  <ul class="sg-acc-panel sg-right sg-checklist" id="sg-view">
    <li><a href="#" class="sg-checklist-icon sg-icon sg-icon-radio" id="sg-t-annotations">Annotations</a></li>
    <li><a href="#" class="sg-checklist-icon sg-icon sg-icon-radio" id="sg-t-code">Code</a></li>
    <li><a href="patterns/04-pages-00-homepage/04-pages-00-homepage.html" target="_blank" id="sg-raw" class="sg-checklist-icon sg-icon sg-icon-link">Open in new window</a></li>
  </ul>
</li><li class="sg-tools">
  <a href="#" class="sg-acc-handle sg-control-trigger sg-icon sg-icon-cog" id="sg-tools-toggle" title="Tools"><span class="visually-hidden">Tools</span></a>
  <ul class="sg-acc-panel sg-right sg-checklist" id="sg-tools">
    <li><a href="https://fepper.io/docpage" class="sg-tool sg-checklist-icon sg-icon sg-icon-file" target="_blank">Fepper docs</a></li>
    <li><a href="/readme#keyboard-shortcuts" class="sg-tool sg-checklist-icon sg-icon sg-icon-keyboard" target="_blank">Keyboard shortcuts</a></li>
  </ul>
</li>`);
      });
      /* eslint-enable max-len */

      it('removes visually-hidden classes from nav target and controls', function () {
        expect(sgNavTargetStateBefore.classArray).to.include('visually-hidden');
        expect(sgControlsStateBefore.classArray).to.include('visually-hidden');

        expect(sgNavTargetStateAfter.classArray).to.not.include('visually-hidden');
        expect(sgControlsStateAfter.classArray).to.not.include('visually-hidden');
      });

      it('does not leave behind Feplet tag artifacts', function () {
        const regex = /\{\{[^\}]*\}\}/; // eslint-disable-line no-useless-escape
        const templateBefore = fs.readFileSync(`${__dirname}/../fixtures/index.html`, 'utf8');

        expect(templateBefore).to.match(regex);

        expect(sgNavTargetStateAfter.html).to.not.match(regex);
        expect(sgControlsStateAfter.html).to.not.match(regex);
      });

      it('adds a class identifying the protocol to the html element', function () {
        expect(patternlabHtmlStateBefore.classArray).to.not.include('protocol-http');

        expect(patternlabHtmlStateAfter.classArray).to.include('protocol-http');
      });
    });

    describe('adjusts size', function () {
      beforeEach(function () {
        global.location = {
          protocol: 'http:'
        };
        $orgs['#sg-viewport'].dispatchAction('innerWidth', 1010);
        $orgs['#sg-viewport'].dispatchAction('css', {width: null});
      });

      it('starts disco mode with a "d" search param', function (done) {
        global.location.search = '?d=true';
        const swOrig = uiProps.sw;

        const discoModeBefore = fepperUi.uiProps.discoMode;
        const discoIdBefore = fepperUi.uiProps.discoId;
        const documentStateBefore = $orgs.document.getState();
        const growModeBefore = fepperUi.uiProps.growMode;
        const growIdBefore = fepperUi.uiProps.growId;

        patternViewport.stoke();

        const discoModeDuring = fepperUi.uiProps.discoMode;
        const discoIdDuring = fepperUi.uiProps.discoId;
        const documentStateDuring = $orgs.document.getState();
        const growModeDuring = fepperUi.uiProps.growMode;
        const growIdDuring = fepperUi.uiProps.growId;

        setTimeout(() => {
          uiFns.stopDisco();

          expect(discoModeBefore).to.be.false;
          expect(discoIdBefore).to.not.be.ok;
          expect(documentStateBefore.activeOrganism).to.be.null;
          expect(growModeBefore).to.be.false;
          expect(growIdBefore).to.not.be.ok;

          expect(discoModeDuring).to.be.true;
          expect(discoIdDuring).to.be.ok;
          expect(documentStateDuring.activeOrganism).to.equal('#sg-size-disco');
          expect(growModeDuring).to.equal(growModeBefore);
          expect(growIdDuring).to.not.be.ok;

          // Restore original window width.
          $orgs.window.dispatchAction('innerWidth', swOrig);
          done();
        }, 20);
      });

      it('starts disco mode with a "disco" search param', function (done) {
        global.location.search = '?disco=true';
        const swOrig = uiProps.sw;

        const discoModeBefore = fepperUi.uiProps.discoMode;
        const discoIdBefore = fepperUi.uiProps.discoId;
        const documentStateBefore = $orgs.document.getState();
        const growModeBefore = fepperUi.uiProps.growMode;
        const growIdBefore = fepperUi.uiProps.growId;

        patternViewport.stoke();

        const discoModeDuring = fepperUi.uiProps.discoMode;
        const discoIdDuring = fepperUi.uiProps.discoId;
        const documentStateDuring = $orgs.document.getState();
        const growModeDuring = fepperUi.uiProps.growMode;
        const growIdDuring = fepperUi.uiProps.growId;

        setTimeout(() => {
          uiFns.stopDisco();

          expect(discoModeBefore).to.be.false;
          expect(discoIdBefore).to.not.be.ok;
          expect(documentStateBefore.activeOrganism).to.be.null;
          expect(growModeBefore).to.be.false;
          expect(growIdBefore).to.not.be.ok;

          expect(discoModeDuring).to.be.true;
          expect(discoIdDuring).to.be.ok;
          expect(documentStateDuring.activeOrganism).to.equal('#sg-size-disco');
          expect(growModeDuring).to.equal(growModeBefore);
          expect(growIdDuring).to.not.be.ok;

          // Restore original window width.
          $orgs.window.dispatchAction('innerWidth', swOrig);
          done();
        }, 20);
      });

      it('starts grow mode with a "g" search param', function (done) {
        global.location.search = '?g=true';
        const swOrig = uiProps.sw;

        // Decrease window width so we have a short, but accurate test.
        $orgs.window.dispatchAction('innerWidth', uiProps.minViewportWidth + 5);

        const discoModeBefore = fepperUi.uiProps.discoMode;
        const discoIdBefore = fepperUi.uiProps.discoId;
        const documentStateBefore = $orgs.document.getState();
        const growModeBefore = fepperUi.uiProps.growMode;
        const growIdBefore = fepperUi.uiProps.growId;

        patternViewport.stoke();

        const discoModeDuring = fepperUi.uiProps.discoMode;
        const discoIdDuring = fepperUi.uiProps.discoId;
        const documentStateDuring = $orgs.document.getState();
        const growModeDuring = fepperUi.uiProps.growMode;
        const growIdDuring = fepperUi.uiProps.growId;

        setTimeout(() => {
          uiFns.stopGrow();

          expect(discoModeBefore).to.be.false;
          expect(discoIdBefore).to.not.be.ok;
          expect(documentStateBefore.activeOrganism).to.be.null;
          expect(growModeBefore).to.be.false;
          expect(growIdBefore).to.not.be.ok;

          expect(discoModeDuring).to.equal(discoModeBefore);
          expect(discoIdDuring).to.not.be.ok;
          expect(documentStateDuring.activeOrganism).to.equal('#sg-size-grow');
          expect(growModeDuring).to.be.true;
          expect(growIdDuring).to.be.ok;

          // Restore original window width.
          $orgs.window.dispatchAction('innerWidth', swOrig);
          done();
        }, uiProps.timeoutDefault);
      });

      it('starts grow mode with a "grow" search param', function (done) {
        global.location.search = '?grow=true';
        const swOrig = uiProps.sw;

        // Decrease window width so we have a short, but accurate test.
        $orgs.window.dispatchAction('innerWidth', uiProps.minViewportWidth + 5);

        const discoModeBefore = fepperUi.uiProps.discoMode;
        const discoIdBefore = fepperUi.uiProps.discoId;
        const documentStateBefore = $orgs.document.getState();
        const growModeBefore = fepperUi.uiProps.growMode;
        const growIdBefore = fepperUi.uiProps.growId;

        patternViewport.stoke();

        const discoModeDuring = fepperUi.uiProps.discoMode;
        const discoIdDuring = fepperUi.uiProps.discoId;
        const documentStateDuring = $orgs.document.getState();
        const growModeDuring = fepperUi.uiProps.growMode;
        const growIdDuring = fepperUi.uiProps.growId;

        setTimeout(() => {
          uiFns.stopGrow();

          expect(discoModeBefore).to.be.false;
          expect(discoIdBefore).to.not.be.ok;
          expect(documentStateBefore.activeOrganism).to.be.null;
          expect(growModeBefore).to.be.false;
          expect(growIdBefore).to.not.be.ok;

          expect(discoModeDuring).to.equal(discoModeBefore);
          expect(discoIdDuring).to.not.be.ok;
          expect(documentStateDuring.activeOrganism).to.equal('#sg-size-grow');
          expect(growModeDuring).to.be.true;
          expect(growIdDuring).to.be.ok;

          // Restore original window width.
          $orgs.window.dispatchAction('innerWidth', swOrig);
          done();
        }, uiProps.timeoutDefault);
      });

      it('sizes viewport with a "w" search param', function () {
        global.location.search = '?w=64.00em';

        fepperUi.dataSaver.removeValue('vpWidth');
        $orgs['#sg-gen-container'].dispatchAction('css', {width: null});
        $orgs['#sg-size-px'].dispatchAction('val', null);
        $orgs['#sg-size-em'].dispatchAction('val', null);

        const sgGenContainerStateBefore = $orgs['#sg-gen-container'].getState();
        const sgViewportStateBefore = $orgs['#sg-viewport'].getState();
        const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
        const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();

        patternViewport.stoke();

        const sgGenContainerStateAfter = $orgs['#sg-gen-container'].getState();
        const sgViewportStateAfter = $orgs['#sg-viewport'].getState();
        const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
        const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();

        expect(sgGenContainerStateBefore.css.width).to.not.equal(sgGenContainerStateAfter.css.width);
        expect(sgViewportStateBefore.css.width).to.not.equal(sgViewportStateAfter.css.width);
        expect(sgSizePxStateBefore.val).to.not.equal(sgSizePxStateAfter.val);
        expect(sgSizeEmStateBefore.val).to.not.equal(sgSizeEmStateAfter.val);

        expect(sgGenContainerStateAfter.css.width).to.equal('1038px');
        expect(sgViewportStateAfter.css.width).to.equal('1024px');
        expect(sgSizePxStateAfter.val).to.equal('1024');
        expect(sgSizeEmStateAfter.val).to.equal('64.00');

        fepperUi.dataSaver.removeValue('vpWidth');
      });

      it('sizes viewport with a "width" search param', function () {
        global.location.search = '?width=1337';

        fepperUi.dataSaver.removeValue('vpWidth');
        $orgs['#sg-gen-container'].dispatchAction('css', {width: null});
        $orgs['#sg-size-px'].dispatchAction('val', null);
        $orgs['#sg-size-em'].dispatchAction('val', null);

        const sgGenContainerStateBefore = $orgs['#sg-gen-container'].getState();
        const sgViewportStateBefore = $orgs['#sg-viewport'].getState();
        const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
        const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();

        patternViewport.stoke();

        const sgGenContainerStateAfter = $orgs['#sg-gen-container'].getState();
        const sgViewportStateAfter = $orgs['#sg-viewport'].getState();
        const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
        const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();

        expect(sgGenContainerStateBefore.css.width).to.not.equal(sgGenContainerStateAfter.css.width);
        expect(sgViewportStateBefore.css.width).to.not.equal(sgViewportStateAfter.css.width);
        expect(sgSizePxStateBefore.val).to.not.equal(sgSizePxStateAfter.val);
        expect(sgSizeEmStateBefore.val).to.not.equal(sgSizeEmStateAfter.val);

        expect(sgGenContainerStateAfter.css.width).to.equal('1351px');
        expect(sgViewportStateAfter.css.width).to.equal('1337px');
        expect(sgSizePxStateAfter.val).to.equal('1337');
        expect(sgSizeEmStateAfter.val).to.equal('83.56');

        fepperUi.dataSaver.removeValue('vpWidth');
      });

      it('updates size info without a search param but with a "vpWidth" dataSaver value', function () {
        fepperUi.dataSaver.updateValue('vpWidth', 1970);
        $orgs['#sg-gen-container'].dispatchAction('css', {width: null});
        $orgs['#sg-size-px'].dispatchAction('val', null);
        $orgs['#sg-size-em'].dispatchAction('val', null);

        const sgGenContainerStateBefore = $orgs['#sg-gen-container'].getState();
        const sgViewportStateBefore = $orgs['#sg-viewport'].getState();
        const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
        const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();

        patternViewport.stoke();

        const sgGenContainerStateAfter = $orgs['#sg-gen-container'].getState();
        const sgViewportStateAfter = $orgs['#sg-viewport'].getState();
        const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
        const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();

        expect(sgGenContainerStateBefore.css.width).to.not.equal(sgGenContainerStateAfter.css.width);
        expect(sgViewportStateBefore.css.width).to.not.equal(sgViewportStateAfter.css.width);
        expect(sgSizePxStateBefore.val).to.not.equal(sgSizePxStateAfter.val);
        expect(sgSizeEmStateBefore.val).to.not.equal(sgSizeEmStateAfter.val);

        expect(sgGenContainerStateAfter.css.width).to.equal('1984px');
        expect(sgViewportStateAfter.css.width).to.equal('1970px');
        expect(sgSizePxStateAfter.val).to.equal('1970');
        expect(sgSizeEmStateAfter.val).to.equal('123.13');

        fepperUi.dataSaver.removeValue('vpWidth');
      });

      it('updates size info without a search param and without a "vpWidth" dataSaver value', function () {
        fepperUi.dataSaver.removeValue('vpWidth');
        $orgs['#sg-size-px'].dispatchAction('val', null);
        $orgs['#sg-size-em'].dispatchAction('val', null);

        const sgViewportStateBefore = $orgs['#sg-viewport'].getState();
        const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
        const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();

        patternViewport.stoke();

        const sgViewportStateAfter = $orgs['#sg-viewport'].getState();
        const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
        const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();

        expect(sgViewportStateBefore.innerWidth).to.equal(1010);
        expect(sgSizePxStateBefore.val).to.not.equal(sgSizePxStateAfter.val);
        expect(sgSizeEmStateBefore.val).to.not.equal(sgSizeEmStateAfter.val);

        expect(sgViewportStateAfter.css.width).to.equal(sgViewportStateBefore.css.width);
        expect(sgSizePxStateAfter.val).to.equal('1010');
        expect(sgSizeEmStateAfter.val).to.equal('63.13');

        fepperUi.dataSaver.removeValue('vpWidth');
      });
    });

    describe('loads pattern', function () {
      beforeEach(function () {
        sandbox.spy($orgs['#sg-viewport'][0].contentWindow.location, 'replace');

        global.location = {
          protocol: 'http:'
        };
      });

      afterEach(function () {
        sandbox.restore();
      });

      it('with a "p" search param', function () {
        global.location.search = '?p=elements-paragraph';
        patternViewport.urlHandler.skipBack = false;

        const skipBackBefore = patternViewport.urlHandler.skipBack;
        const historyStateBefore = global.history.state;

        patternViewport.stoke();

        const skipBackAfter = patternViewport.urlHandler.skipBack;
        const historyStateAfter = global.history.state;

        expect(skipBackBefore).to.be.false;
        expect(historyStateBefore.pattern).to.not.equal(historyStateAfter.pattern);

        expect(skipBackAfter).to.be.true;
        expect(historyStateAfter.pattern).to.equal('elements-paragraph');
        expect($orgs['#sg-viewport'][0].contentWindow.location.replace.calledOnce).to.be.true;
      });

      it('with config.defaultPattern', function () {
        patternViewport.urlHandler.skipBack = false;

        const skipBackBefore = patternViewport.urlHandler.skipBack;
        const historyStateBefore = global.history.state;

        patternViewport.stoke();

        const skipBackAfter = patternViewport.urlHandler.skipBack;
        const historyStateAfter = global.history.state;

        expect(skipBackBefore).to.be.false;
        expect(historyStateBefore.pattern).to.not.equal(historyStateAfter.pattern);
        expect(skipBackAfter).to.be.true;
        expect(historyStateAfter.pattern).to.equal('pages-homepage');
        expect($orgs['#sg-viewport'][0].contentWindow.location.replace.calledOnce).to.be.true;
      });

      it('defaults to viewall', function () {
        patternViewport.urlHandler.skipBack = false;
        delete patternViewport.uiData.config.defaultPattern;

        const skipBackBefore = patternViewport.urlHandler.skipBack;
        const historyStateBefore = global.history.state;

        patternViewport.stoke();

        const skipBackAfter = patternViewport.urlHandler.skipBack;
        const historyStateAfter = global.history.state;

        expect(skipBackBefore).to.be.false;
        expect(historyStateBefore.pattern).to.not.equal(historyStateAfter.pattern);

        expect(skipBackAfter).to.be.true;
        expect(historyStateAfter.pattern).to.equal('viewall');
        expect($orgs['#sg-viewport'][0].contentWindow.location.replace.calledOnce).to.be.true;
      });
    });

    describe('resize buttons', function () {
      it('adds them', function () {
        $orgs['#sg-resize-btns'].dispatchAction('html', '');

        const sgResizeBtnsStateBefore = $orgs['#sg-resize-btns'].getState();

        patternViewport.renderResizeBtns();

        const sgResizeBtnsStateAfter = $orgs['#sg-resize-btns'].getState();

        expect(sgResizeBtnsStateBefore.html).to.not.equal(sgResizeBtnsStateAfter.html);

        // eslint-disable-next-line max-len
        expect(sgResizeBtnsStateAfter.html).to.equal('<li><a href="#" id="sg-size-xx">XX</a></li><li><a href="#" id="sg-size-xs">XS</a></li><li><a href="#" id="sg-size-sm">SM</a></li><li><a href="#" id="sg-size-md">MD</a></li><li><a href="#" id="sg-size-lg">LG</a></li>');
      });
    });
  });

  describe('.goResize()', function () {
    const bpObjOrig = fepperUi.uiProps.bpObj;

    before(function () {
      fepperUi.uiProps.bpObj.foo = 1337;
    });

    after(function () {
      fepperUi.uiProps.bpObj = bpObjOrig;
    });

    it('resizes to a custom size', function () {
      fepperUi.dataSaver.removeValue('vpWidth');
      $orgs['#sg-gen-container'].dispatchAction('removeClass', 'vp-animate');
      $orgs['#sg-viewport'].dispatchAction('removeClass', 'vp-animate');

      const discoModeBefore = fepperUi.uiProps.discoMode = true;
      const discoIdBefore = fepperUi.uiProps.discoId = 1;
      const growModeBefore = fepperUi.uiProps.growMode = true;
      const growIdBefore = fepperUi.uiProps.growId = 2;
      const sgGenContainerStateBefore = $orgs['#sg-gen-container'].getState();
      const sgViewportStateBefore = $orgs['#sg-viewport'].getState();
      const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();
      const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthBefore = fepperUi.dataSaver.findValue('vpWidth');

      patternViewport.goResize('foo');

      const discoModeAfter = fepperUi.uiProps.discoMode;
      const discoIdAfter = fepperUi.uiProps.discoId;
      const growModeAfter = fepperUi.uiProps.growMode;
      const growIdAfter = fepperUi.uiProps.growId;
      const sgGenContainerStateAfter = $orgs['#sg-gen-container'].getState();
      const sgViewportStateAfter = $orgs['#sg-viewport'].getState();
      const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();
      const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthAfter = fepperUi.dataSaver.findValue('vpWidth');

      expect(discoModeBefore).to.be.true;
      expect(discoIdBefore).to.equal(1);
      expect(growModeBefore).to.be.true;
      expect(growIdBefore).to.equal(2);
      expect(sgGenContainerStateBefore.classArray).to.not.include('vp-animate');
      expect(sgGenContainerStateBefore.css.width).to.not.equal('1351px');
      expect(sgViewportStateBefore.classArray).to.not.include('vp-animate');
      expect(sgViewportStateBefore.css.width).to.not.equal('1337px');
      expect(sgSizeEmStateBefore.val).to.not.equal('83.56');
      expect(sgSizePxStateBefore.val).to.not.equal(1337);
      expect(dataSaverVpWidthBefore).to.equal('');

      expect(discoModeAfter).to.be.false;
      expect(discoIdAfter).to.be.undefined;
      expect(growModeAfter).to.be.false;
      expect(growIdAfter).to.be.undefined;
      expect(sgGenContainerStateAfter.classArray).to.include('vp-animate');
      expect(sgGenContainerStateAfter.css.width).to.equal('1351px');
      expect(sgViewportStateAfter.classArray).to.include('vp-animate');
      expect(sgViewportStateAfter.css.width).to.equal('1337px');
      expect(sgSizeEmStateAfter.val).to.equal('83.56');
      expect(sgSizePxStateAfter.val).to.equal('1337');
      expect(dataSaverVpWidthAfter).to.equal('1337');
    });
  });

  describe('.goXXSmall()', function () {
    it('resizes to XXSmall', function () {
      fepperUi.dataSaver.removeValue('vpWidth');
      $orgs['#sg-gen-container'].dispatchAction('removeClass', 'vp-animate');
      $orgs['#sg-viewport'].dispatchAction('removeClass', 'vp-animate');

      const documentStateBefore = $orgs.document.getState();
      const discoModeBefore = fepperUi.uiProps.discoMode = true;
      const discoIdBefore = fepperUi.uiProps.discoId = 1;
      const growModeBefore = fepperUi.uiProps.growMode = true;
      const growIdBefore = fepperUi.uiProps.growId = 2;
      const sgGenContainerStateBefore = $orgs['#sg-gen-container'].getState();
      const sgViewportStateBefore = $orgs['#sg-viewport'].getState();
      const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();
      const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthBefore = fepperUi.dataSaver.findValue('vpWidth');

      patternViewport.goXXSmall();

      const documentStateAfter = $orgs.document.getState();
      const discoModeAfter = fepperUi.uiProps.discoMode;
      const discoIdAfter = fepperUi.uiProps.discoId;
      const growModeAfter = fepperUi.uiProps.growMode;
      const growIdAfter = fepperUi.uiProps.growId;
      const sgGenContainerStateAfter = $orgs['#sg-gen-container'].getState();
      const sgViewportStateAfter = $orgs['#sg-viewport'].getState();
      const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();
      const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthAfter = fepperUi.dataSaver.findValue('vpWidth');

      expect(documentStateBefore.activeOrganism).to.not.equal('#sg-size-xx');
      expect(discoModeBefore).to.be.true;
      expect(discoIdBefore).to.equal(1);
      expect(growModeBefore).to.be.true;
      expect(growIdBefore).to.equal(2);
      expect(sgGenContainerStateBefore.classArray).to.not.include('vp-animate');
      expect(sgGenContainerStateBefore.css.width).to.not.equal(sgGenContainerStateAfter.css.width);
      expect(sgViewportStateBefore.classArray).to.not.include('vp-animate');
      expect(sgViewportStateBefore.css.width).to.not.equal(sgViewportStateAfter.css.width);
      expect(sgSizeEmStateBefore.val).to.not.equal(sgSizeEmStateAfter.val);
      expect(sgSizePxStateBefore.val).to.not.equal(sgSizePxStateAfter.val);
      expect(dataSaverVpWidthBefore).to.equal('');

      expect(documentStateAfter.activeOrganism).to.equal('#sg-size-xx');
      expect(discoModeAfter).to.be.false;
      expect(discoIdAfter).to.be.undefined;
      expect(growModeAfter).to.be.false;
      expect(growIdAfter).to.be.undefined;
      expect(sgGenContainerStateAfter.classArray).to.include('vp-animate');
      expect(sgGenContainerStateAfter.css.width).to.equal('334px');
      expect(sgViewportStateAfter.classArray).to.include('vp-animate');
      expect(sgViewportStateAfter.css.width).to.equal('320px');
      expect(sgSizeEmStateAfter.val).to.equal('20.00');
      expect(sgSizePxStateAfter.val).to.equal('320');
      expect(dataSaverVpWidthAfter).to.equal('320');
    });
  });

  describe('.goXSmall()', function () {
    it('resizes to XSmall', function () {
      fepperUi.dataSaver.removeValue('vpWidth');
      $orgs['#sg-gen-container'].dispatchAction('removeClass', 'vp-animate');
      $orgs['#sg-viewport'].dispatchAction('removeClass', 'vp-animate');

      const documentStateBefore = $orgs.document.getState();
      const discoModeBefore = fepperUi.uiProps.discoMode = true;
      const discoIdBefore = fepperUi.uiProps.discoId = 1;
      const growModeBefore = fepperUi.uiProps.growMode = true;
      const growIdBefore = fepperUi.uiProps.growId = 2;
      const sgGenContainerStateBefore = $orgs['#sg-gen-container'].getState();
      const sgViewportStateBefore = $orgs['#sg-viewport'].getState();
      const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();
      const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthBefore = fepperUi.dataSaver.findValue('vpWidth');

      patternViewport.goXSmall();

      const documentStateAfter = $orgs.document.getState();
      const discoModeAfter = fepperUi.uiProps.discoMode;
      const discoIdAfter = fepperUi.uiProps.discoId;
      const growModeAfter = fepperUi.uiProps.growMode;
      const growIdAfter = fepperUi.uiProps.growId;
      const sgGenContainerStateAfter = $orgs['#sg-gen-container'].getState();
      const sgViewportStateAfter = $orgs['#sg-viewport'].getState();
      const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();
      const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthAfter = fepperUi.dataSaver.findValue('vpWidth');

      expect(documentStateBefore.activeOrganism).to.not.equal('#sg-size-xs');
      expect(discoModeBefore).to.be.true;
      expect(discoIdBefore).to.equal(1);
      expect(growModeBefore).to.be.true;
      expect(growIdBefore).to.equal(2);
      expect(sgGenContainerStateBefore.classArray).to.not.include('vp-animate');
      expect(sgGenContainerStateBefore.css.width).to.not.equal(sgGenContainerStateAfter.css.width);
      expect(sgViewportStateBefore.classArray).to.not.include('vp-animate');
      expect(sgViewportStateBefore.css.width).to.not.equal(sgViewportStateAfter.css.width);
      expect(sgSizeEmStateBefore.val).to.not.equal(sgSizeEmStateAfter.val);
      expect(sgSizePxStateBefore.val).to.not.equal(sgSizePxStateAfter.val);
      expect(dataSaverVpWidthBefore).to.equal('');

      expect(documentStateAfter.activeOrganism).to.equal('#sg-size-xs');
      expect(discoModeAfter).to.be.false;
      expect(discoIdAfter).to.be.undefined;
      expect(growModeAfter).to.be.false;
      expect(growIdAfter).to.be.undefined;
      expect(sgGenContainerStateAfter.classArray).to.include('vp-animate');
      expect(sgGenContainerStateAfter.css.width).to.equal('494px');
      expect(sgViewportStateAfter.classArray).to.include('vp-animate');
      expect(sgViewportStateAfter.css.width).to.equal('480px');
      expect(sgSizeEmStateAfter.val).to.equal('30.00');
      expect(sgSizePxStateAfter.val).to.equal('480');
      expect(dataSaverVpWidthAfter).to.equal('480');
    });
  });

  describe('.goSmall()', function () {
    it('resizes to Small', function () {
      fepperUi.dataSaver.removeValue('vpWidth');
      $orgs['#sg-gen-container'].dispatchAction('removeClass', 'vp-animate');
      $orgs['#sg-viewport'].dispatchAction('removeClass', 'vp-animate');

      const documentStateBefore = $orgs.document.getState();
      const discoModeBefore = fepperUi.uiProps.discoMode = true;
      const discoIdBefore = fepperUi.uiProps.discoId = 1;
      const growModeBefore = fepperUi.uiProps.growMode = true;
      const growIdBefore = fepperUi.uiProps.growId = 2;
      const sgGenContainerStateBefore = $orgs['#sg-gen-container'].getState();
      const sgViewportStateBefore = $orgs['#sg-viewport'].getState();
      const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();
      const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthBefore = fepperUi.dataSaver.findValue('vpWidth');

      patternViewport.goSmall();

      const documentStateAfter = $orgs.document.getState();
      const discoModeAfter = fepperUi.uiProps.discoMode;
      const discoIdAfter = fepperUi.uiProps.discoId;
      const growModeAfter = fepperUi.uiProps.growMode;
      const growIdAfter = fepperUi.uiProps.growId;
      const sgGenContainerStateAfter = $orgs['#sg-gen-container'].getState();
      const sgViewportStateAfter = $orgs['#sg-viewport'].getState();
      const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();
      const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthAfter = fepperUi.dataSaver.findValue('vpWidth');

      expect(documentStateBefore.activeOrganism).to.not.equal('#sg-size-sm');
      expect(discoModeBefore).to.be.true;
      expect(discoIdBefore).to.equal(1);
      expect(growModeBefore).to.be.true;
      expect(growIdBefore).to.equal(2);
      expect(sgGenContainerStateBefore.classArray).to.not.include('vp-animate');
      expect(sgGenContainerStateBefore.css.width).to.not.equal(sgGenContainerStateAfter.css.width);
      expect(sgViewportStateBefore.classArray).to.not.include('vp-animate');
      expect(sgViewportStateBefore.css.width).to.not.equal(sgViewportStateAfter.css.width);
      expect(sgSizeEmStateBefore.val).to.not.equal(sgSizeEmStateAfter.val);
      expect(sgSizePxStateBefore.val).to.not.equal(sgSizePxStateAfter.val);
      expect(dataSaverVpWidthBefore).to.equal('');

      expect(documentStateAfter.activeOrganism).to.equal('#sg-size-sm');
      expect(discoModeAfter).to.be.false;
      expect(discoIdAfter).to.be.undefined;
      expect(growModeAfter).to.be.false;
      expect(growIdAfter).to.be.undefined;
      expect(sgGenContainerStateAfter.classArray).to.include('vp-animate');
      expect(sgGenContainerStateAfter.css.width).to.equal('781px');
      expect(sgViewportStateAfter.classArray).to.include('vp-animate');
      expect(sgViewportStateAfter.css.width).to.equal('767px');
      expect(sgSizeEmStateAfter.val).to.equal('47.94');
      expect(sgSizePxStateAfter.val).to.equal('767');
      expect(dataSaverVpWidthAfter).to.equal('767');
    });
  });

  describe('.goMedium()', function () {
    it('resizes to Medium', function () {
      fepperUi.dataSaver.removeValue('vpWidth');
      $orgs['#sg-gen-container'].dispatchAction('removeClass', 'vp-animate');
      $orgs['#sg-viewport'].dispatchAction('removeClass', 'vp-animate');

      const documentStateBefore = $orgs.document.getState();
      const discoModeBefore = fepperUi.uiProps.discoMode = true;
      const discoIdBefore = fepperUi.uiProps.discoId = 1;
      const growModeBefore = fepperUi.uiProps.growMode = true;
      const growIdBefore = fepperUi.uiProps.growId = 2;
      const sgGenContainerStateBefore = $orgs['#sg-gen-container'].getState();
      const sgViewportStateBefore = $orgs['#sg-viewport'].getState();
      const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();
      const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthBefore = fepperUi.dataSaver.findValue('vpWidth');

      patternViewport.goMedium();

      const documentStateAfter = $orgs.document.getState();
      const discoModeAfter = fepperUi.uiProps.discoMode;
      const discoIdAfter = fepperUi.uiProps.discoId;
      const growModeAfter = fepperUi.uiProps.growMode;
      const growIdAfter = fepperUi.uiProps.growId;
      const sgGenContainerStateAfter = $orgs['#sg-gen-container'].getState();
      const sgViewportStateAfter = $orgs['#sg-viewport'].getState();
      const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();
      const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthAfter = fepperUi.dataSaver.findValue('vpWidth');

      expect(documentStateBefore.activeOrganism).to.not.equal('#sg-size-md');
      expect(discoModeBefore).to.be.true;
      expect(discoIdBefore).to.equal(1);
      expect(growModeBefore).to.be.true;
      expect(growIdBefore).to.equal(2);
      expect(sgGenContainerStateBefore.classArray).to.not.include('vp-animate');
      expect(sgGenContainerStateBefore.css.width).to.not.equal(sgGenContainerStateAfter.css.width);
      expect(sgViewportStateBefore.classArray).to.not.include('vp-animate');
      expect(sgViewportStateBefore.css.width).to.not.equal(sgViewportStateAfter.css.width);
      expect(sgSizeEmStateBefore.val).to.not.equal(sgSizeEmStateAfter.val);
      expect(sgSizePxStateBefore.val).to.not.equal(sgSizePxStateAfter.val);
      expect(dataSaverVpWidthBefore).to.equal('');

      expect(documentStateAfter.activeOrganism).to.equal('#sg-size-md');
      expect(discoModeAfter).to.be.false;
      expect(discoIdAfter).to.be.undefined;
      expect(growModeAfter).to.be.false;
      expect(growIdAfter).to.be.undefined;
      expect(sgGenContainerStateAfter.classArray).to.include('vp-animate');
      expect(sgGenContainerStateAfter.css.width).to.equal('1038px');
      expect(sgViewportStateAfter.classArray).to.include('vp-animate');
      expect(sgViewportStateAfter.css.width).to.equal('1024px');
      expect(sgSizeEmStateAfter.val).to.equal('64.00');
      expect(sgSizePxStateAfter.val).to.equal('1024');
      expect(dataSaverVpWidthAfter).to.equal('1024');
    });
  });

  describe('.goLarge()', function () {
    it('resizes to Large', function () {
      fepperUi.dataSaver.removeValue('vpWidth');
      $orgs['#sg-gen-container'].dispatchAction('removeClass', 'vp-animate');
      $orgs['#sg-viewport'].dispatchAction('removeClass', 'vp-animate');

      const documentStateBefore = $orgs.document.getState();
      const discoModeBefore = fepperUi.uiProps.discoMode = true;
      const discoIdBefore = fepperUi.uiProps.discoId = 1;
      const growModeBefore = fepperUi.uiProps.growMode = true;
      const growIdBefore = fepperUi.uiProps.growId = 2;
      const sgGenContainerStateBefore = $orgs['#sg-gen-container'].getState();
      const sgViewportStateBefore = $orgs['#sg-viewport'].getState();
      const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();
      const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthBefore = fepperUi.dataSaver.findValue('vpWidth');

      patternViewport.goLarge();

      const documentStateAfter = $orgs.document.getState();
      const discoModeAfter = fepperUi.uiProps.discoMode;
      const discoIdAfter = fepperUi.uiProps.discoId;
      const growModeAfter = fepperUi.uiProps.growMode;
      const growIdAfter = fepperUi.uiProps.growId;
      const sgGenContainerStateAfter = $orgs['#sg-gen-container'].getState();
      const sgViewportStateAfter = $orgs['#sg-viewport'].getState();
      const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();
      const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthAfter = fepperUi.dataSaver.findValue('vpWidth');

      expect(documentStateBefore.activeOrganism).to.not.equal('#sg-size-lg');
      expect(discoModeBefore).to.be.true;
      expect(discoIdBefore).to.equal(1);
      expect(growModeBefore).to.be.true;
      expect(growIdBefore).to.equal(2);
      expect(sgGenContainerStateBefore.classArray).to.not.include('vp-animate');
      expect(sgGenContainerStateBefore.css.width).to.not.equal(sgGenContainerStateAfter.css.width);
      expect(sgViewportStateBefore.classArray).to.not.include('vp-animate');
      expect(sgViewportStateBefore.css.width).to.not.equal(sgViewportStateAfter.css.width);
      expect(sgSizeEmStateBefore.val).to.not.equal(sgSizeEmStateAfter.val);
      expect(sgSizePxStateBefore.val).to.not.equal(sgSizePxStateAfter.val);
      expect(dataSaverVpWidthBefore).to.equal('');

      expect(documentStateAfter.activeOrganism).to.equal('#sg-size-lg');
      expect(discoModeAfter).to.be.false;
      expect(discoIdAfter).to.be.undefined;
      expect(growModeAfter).to.be.false;
      expect(growIdAfter).to.be.undefined;
      expect(sgGenContainerStateAfter.classArray).to.include('vp-animate');
      expect(sgGenContainerStateAfter.css.width).to.equal('1294px');
      expect(sgViewportStateAfter.classArray).to.include('vp-animate');
      expect(sgViewportStateAfter.css.width).to.equal('1280px');
      expect(sgSizeEmStateAfter.val).to.equal('80.00');
      expect(sgSizePxStateAfter.val).to.equal('1280');
      expect(dataSaverVpWidthAfter).to.equal('1280');
    });
  });

  describe('.goWhole()', function () {
    it('resizes to whole width', function () {
      fepperUi.dataSaver.removeValue('vpWidth');
      $orgs['#sg-gen-container'].dispatchAction('removeClass', 'vp-animate');
      $orgs['#sg-viewport'].dispatchAction('removeClass', 'vp-animate');

      const documentStateBefore = $orgs.document.getState();
      const discoModeBefore = fepperUi.uiProps.discoMode = true;
      const discoIdBefore = fepperUi.uiProps.discoId = 1;
      const growModeBefore = fepperUi.uiProps.growMode = true;
      const growIdBefore = fepperUi.uiProps.growId = 2;
      const sgGenContainerStateBefore = $orgs['#sg-gen-container'].getState();
      const sgViewportStateBefore = $orgs['#sg-viewport'].getState();
      const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();
      const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthBefore = fepperUi.dataSaver.findValue('vpWidth');

      patternViewport.goWhole();

      const documentStateAfter = $orgs.document.getState();
      const discoModeAfter = fepperUi.uiProps.discoMode;
      const discoIdAfter = fepperUi.uiProps.discoId;
      const growModeAfter = fepperUi.uiProps.growMode;
      const growIdAfter = fepperUi.uiProps.growId;
      const sgGenContainerStateAfter = $orgs['#sg-gen-container'].getState();
      const sgViewportStateAfter = $orgs['#sg-viewport'].getState();
      const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();
      const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthAfter = fepperUi.dataSaver.findValue('vpWidth');

      expect(documentStateBefore.activeOrganism).to.not.equal('#sg-size-w');
      expect(discoModeBefore).to.be.true;
      expect(discoIdBefore).to.equal(1);
      expect(growModeBefore).to.be.true;
      expect(growIdBefore).to.equal(2);
      expect(sgGenContainerStateBefore.classArray).to.not.include('vp-animate');
      expect(sgGenContainerStateBefore.css.width).to.not.equal(sgGenContainerStateAfter.css.width);
      expect(sgViewportStateBefore.classArray).to.not.include('vp-animate');
      expect(sgViewportStateBefore.css.width).to.not.equal(sgViewportStateAfter.css.width);
      expect(sgSizeEmStateBefore.val).to.not.equal(sgSizeEmStateAfter.val);
      expect(sgSizePxStateBefore.val).to.not.equal(sgSizePxStateAfter.val);
      expect(dataSaverVpWidthBefore).to.equal('');

      expect(documentStateAfter.activeOrganism).to.equal('#sg-size-w');
      expect(discoModeAfter).to.be.false;
      expect(discoIdAfter).to.be.undefined;
      expect(growModeAfter).to.be.false;
      expect(growIdAfter).to.be.undefined;
      expect(sgGenContainerStateAfter.classArray).to.include('vp-animate');
      expect(sgGenContainerStateAfter.css.width).to.equal('1038px');
      expect(sgViewportStateAfter.classArray).to.include('vp-animate');
      expect(sgViewportStateAfter.css.width).to.equal('1024px');
      expect(sgSizeEmStateAfter.val).to.equal('64.00');
      expect(sgSizePxStateAfter.val).to.equal('1024');
      expect(dataSaverVpWidthAfter).to.equal('1024');
    });
  });

  describe('.goRandom()', function () {
    it('resizes to a random width', function () {
      fepperUi.dataSaver.removeValue('vpWidth');
      $orgs['#sg-gen-container'].dispatchAction('removeClass', 'vp-animate');
      $orgs['#sg-viewport'].dispatchAction('removeClass', 'vp-animate');

      const documentStateBefore = $orgs.document.getState();
      const discoModeBefore = fepperUi.uiProps.discoMode = true;
      const discoIdBefore = fepperUi.uiProps.discoId = 1;
      const growModeBefore = fepperUi.uiProps.growMode = true;
      const growIdBefore = fepperUi.uiProps.growId = 2;
      const sgGenContainerStateBefore = $orgs['#sg-gen-container'].getState();
      const sgViewportStateBefore = $orgs['#sg-viewport'].getState();

      patternViewport.goRandom();

      const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();
      const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthBefore = fepperUi.dataSaver.findValue('vpWidth');

      patternViewport.goRandom();

      const documentStateAfter = $orgs.document.getState();
      const discoModeAfter = fepperUi.uiProps.discoMode;
      const discoIdAfter = fepperUi.uiProps.discoId;
      const growModeAfter = fepperUi.uiProps.growMode;
      const growIdAfter = fepperUi.uiProps.growId;
      const sgGenContainerStateAfter = $orgs['#sg-gen-container'].getState();
      const sgViewportStateAfter = $orgs['#sg-viewport'].getState();
      const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();
      const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthAfter = fepperUi.dataSaver.findValue('vpWidth');

      expect(documentStateBefore.activeOrganism).to.not.equal('#sg-size-random');
      expect(discoModeBefore).to.be.true;
      expect(discoIdBefore).to.equal(1);
      expect(growModeBefore).to.be.true;
      expect(growIdBefore).to.equal(2);
      expect(sgGenContainerStateBefore.classArray).to.not.include('vp-animate');
      expect(sgViewportStateBefore.classArray).to.not.include('vp-animate');

      expect(documentStateAfter.activeOrganism).to.equal('#sg-size-random');
      expect(discoModeAfter).to.be.false;
      expect(discoIdAfter).to.be.undefined;
      expect(growModeAfter).to.be.false;
      expect(growIdAfter).to.be.undefined;
      expect(sgGenContainerStateAfter.classArray).to.include('vp-animate');
      expect(sgViewportStateAfter.classArray).to.include('vp-animate');

      // Compare before and after to test randomness.
      expect(sgGenContainerStateBefore.css.width).to.not.equal(sgGenContainerStateAfter.css.width);
      expect(sgViewportStateBefore.css.width).to.not.equal(sgViewportStateAfter.css.width);
      expect(sgSizeEmStateBefore.val).to.not.equal(sgSizeEmStateAfter.val);
      expect(sgSizePxStateBefore.val).to.not.equal(sgSizePxStateAfter.val);
      expect(dataSaverVpWidthBefore).to.not.equal(dataSaverVpWidthAfter);
    });
  });

  describe('receiveIframeMessage', function () {
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

    it('closes all panels on patternlab.bodyClick', function () {
      event.data = {
        event: 'patternlab.bodyClick'
      };

      $orgs['#sg-nav-target'].dispatchAction('addClass', 'active');
      $orgs['.sg-acc-handle'].dispatchAction('addClass', 'active');
      $orgs['.sg-acc-panel'].dispatchAction('addClass', 'active');

      const sgNavTargetStateBefore = $orgs['#sg-nav-target'].getState();
      const sgAccHandleStateBefore = $orgs['.sg-acc-handle'].getState();
      const sgAccPanelStateBefore = $orgs['.sg-acc-panel'].getState();

      patternViewport.receiveIframeMessage(event);

      const sgNavTargetStateAfter = $orgs['#sg-nav-target'].getState();
      const sgAccHandleStateAfter = $orgs['.sg-acc-handle'].getState();
      const sgAccPanelStateAfter = $orgs['.sg-acc-panel'].getState();

      expect(sgNavTargetStateBefore.classArray).to.include('active');
      expect(sgAccHandleStateBefore.classArray).to.include('active');
      expect(sgAccPanelStateBefore.classArray).to.include('active');

      expect(sgNavTargetStateAfter.classArray).to.not.include('active');
      expect(sgAccHandleStateAfter.classArray).to.not.include('active');
      expect(sgAccPanelStateAfter.classArray).to.not.include('active');
    });

    it('runs .goXXSmall() with patternlab.keyPress "ctrl+alt+0"', function () {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+alt+0'
      };

      fepperUi.dataSaver.removeValue('vpWidth');
      $orgs['#sg-gen-container'].dispatchAction('removeClass', 'vp-animate');
      $orgs['#sg-viewport'].dispatchAction('removeClass', 'vp-animate');

      const documentStateBefore = $orgs.document.getState();
      const discoModeBefore = fepperUi.uiProps.discoMode = true;
      const discoIdBefore = fepperUi.uiProps.discoId = 1;
      const growModeBefore = fepperUi.uiProps.growMode = true;
      const growIdBefore = fepperUi.uiProps.growId = 2;
      const sgGenContainerStateBefore = $orgs['#sg-gen-container'].getState();
      const sgViewportStateBefore = $orgs['#sg-viewport'].getState();
      const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();
      const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthBefore = fepperUi.dataSaver.findValue('vpWidth');

      patternViewport.receiveIframeMessage(event);

      const documentStateAfter = $orgs.document.getState();
      const discoModeAfter = fepperUi.uiProps.discoMode;
      const discoIdAfter = fepperUi.uiProps.discoId;
      const growModeAfter = fepperUi.uiProps.growMode;
      const growIdAfter = fepperUi.uiProps.growId;
      const sgGenContainerStateAfter = $orgs['#sg-gen-container'].getState();
      const sgViewportStateAfter = $orgs['#sg-viewport'].getState();
      const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();
      const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthAfter = fepperUi.dataSaver.findValue('vpWidth');

      expect(documentStateBefore.activeOrganism).to.not.equal('#sg-size-xx');
      expect(discoModeBefore).to.be.true;
      expect(discoIdBefore).to.equal(1);
      expect(growModeBefore).to.be.true;
      expect(growIdBefore).to.equal(2);
      expect(sgGenContainerStateBefore.classArray).to.not.include('vp-animate');
      expect(sgGenContainerStateBefore.css.width).to.not.equal(sgGenContainerStateAfter.css.width);
      expect(sgViewportStateBefore.classArray).to.not.include('vp-animate');
      expect(sgViewportStateBefore.css.width).to.not.equal(sgViewportStateAfter.css.width);
      expect(sgSizeEmStateBefore.val).to.not.equal(sgSizeEmStateAfter.val);
      expect(sgSizePxStateBefore.val).to.not.equal(sgSizePxStateAfter.val);
      expect(dataSaverVpWidthBefore).to.equal('');

      expect(documentStateAfter.activeOrganism).to.equal('#sg-size-xx');
      expect(discoModeAfter).to.be.false;
      expect(discoIdAfter).to.be.undefined;
      expect(growModeAfter).to.be.false;
      expect(growIdAfter).to.be.undefined;
      expect(sgGenContainerStateAfter.classArray).to.include('vp-animate');
      expect(sgGenContainerStateAfter.css.width).to.equal('334px');
      expect(sgViewportStateAfter.classArray).to.include('vp-animate');
      expect(sgViewportStateAfter.css.width).to.equal('320px');
      expect(sgSizeEmStateAfter.val).to.equal('20.00');
      expect(sgSizePxStateAfter.val).to.equal('320');
      expect(dataSaverVpWidthAfter).to.equal('320');
    });

    it('runs .goXSmall() with patternlab.keyPress "ctrl+shift+x"', function () {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+shift+x'
      };

      fepperUi.dataSaver.removeValue('vpWidth');
      $orgs['#sg-gen-container'].dispatchAction('removeClass', 'vp-animate');
      $orgs['#sg-viewport'].dispatchAction('removeClass', 'vp-animate');

      const documentStateBefore = $orgs.document.getState();
      const discoModeBefore = fepperUi.uiProps.discoMode = true;
      const discoIdBefore = fepperUi.uiProps.discoId = 1;
      const growModeBefore = fepperUi.uiProps.growMode = true;
      const growIdBefore = fepperUi.uiProps.growId = 2;
      const sgGenContainerStateBefore = $orgs['#sg-gen-container'].getState();
      const sgViewportStateBefore = $orgs['#sg-viewport'].getState();
      const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();
      const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthBefore = fepperUi.dataSaver.findValue('vpWidth');

      patternViewport.receiveIframeMessage(event);

      const documentStateAfter = $orgs.document.getState();
      const discoModeAfter = fepperUi.uiProps.discoMode;
      const discoIdAfter = fepperUi.uiProps.discoId;
      const growModeAfter = fepperUi.uiProps.growMode;
      const growIdAfter = fepperUi.uiProps.growId;
      const sgGenContainerStateAfter = $orgs['#sg-gen-container'].getState();
      const sgViewportStateAfter = $orgs['#sg-viewport'].getState();
      const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();
      const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthAfter = fepperUi.dataSaver.findValue('vpWidth');

      expect(documentStateBefore.activeOrganism).to.not.equal('#sg-size-xs');
      expect(discoModeBefore).to.be.true;
      expect(discoIdBefore).to.equal(1);
      expect(growModeBefore).to.be.true;
      expect(growIdBefore).to.equal(2);
      expect(sgGenContainerStateBefore.classArray).to.not.include('vp-animate');
      expect(sgGenContainerStateBefore.css.width).to.not.equal(sgGenContainerStateAfter.css.width);
      expect(sgViewportStateBefore.classArray).to.not.include('vp-animate');
      expect(sgViewportStateBefore.css.width).to.not.equal(sgViewportStateAfter.css.width);
      expect(sgSizeEmStateBefore.val).to.not.equal(sgSizeEmStateAfter.val);
      expect(sgSizePxStateBefore.val).to.not.equal(sgSizePxStateAfter.val);
      expect(dataSaverVpWidthBefore).to.equal('');

      expect(documentStateAfter.activeOrganism).to.equal('#sg-size-xs');
      expect(discoModeAfter).to.be.false;
      expect(discoIdAfter).to.be.undefined;
      expect(growModeAfter).to.be.false;
      expect(growIdAfter).to.be.undefined;
      expect(sgGenContainerStateAfter.classArray).to.include('vp-animate');
      expect(sgGenContainerStateAfter.css.width).to.equal('494px');
      expect(sgViewportStateAfter.classArray).to.include('vp-animate');
      expect(sgViewportStateAfter.css.width).to.equal('480px');
      expect(sgSizeEmStateAfter.val).to.equal('30.00');
      expect(sgSizePxStateAfter.val).to.equal('480');
      expect(dataSaverVpWidthAfter).to.equal('480');
    });

    it('runs .goXXSmall() with patternlab.keyPress "ctrl+shift+0"', function () {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+shift+0'
      };

      fepperUi.dataSaver.removeValue('vpWidth');
      $orgs['#sg-gen-container'].dispatchAction('removeClass', 'vp-animate');
      $orgs['#sg-viewport'].dispatchAction('removeClass', 'vp-animate');

      const documentStateBefore = $orgs.document.getState();
      const discoModeBefore = fepperUi.uiProps.discoMode = true;
      const discoIdBefore = fepperUi.uiProps.discoId = 1;
      const growModeBefore = fepperUi.uiProps.growMode = true;
      const growIdBefore = fepperUi.uiProps.growId = 2;
      const sgGenContainerStateBefore = $orgs['#sg-gen-container'].getState();
      const sgViewportStateBefore = $orgs['#sg-viewport'].getState();
      const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();
      const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthBefore = fepperUi.dataSaver.findValue('vpWidth');

      patternViewport.receiveIframeMessage(event);

      const documentStateAfter = $orgs.document.getState();
      const discoModeAfter = fepperUi.uiProps.discoMode;
      const discoIdAfter = fepperUi.uiProps.discoId;
      const growModeAfter = fepperUi.uiProps.growMode;
      const growIdAfter = fepperUi.uiProps.growId;
      const sgGenContainerStateAfter = $orgs['#sg-gen-container'].getState();
      const sgViewportStateAfter = $orgs['#sg-viewport'].getState();
      const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();
      const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthAfter = fepperUi.dataSaver.findValue('vpWidth');

      expect(documentStateBefore.activeOrganism).to.not.equal('#sg-size-xx');
      expect(discoModeBefore).to.be.true;
      expect(discoIdBefore).to.equal(1);
      expect(growModeBefore).to.be.true;
      expect(growIdBefore).to.equal(2);
      expect(sgGenContainerStateBefore.classArray).to.not.include('vp-animate');
      expect(sgGenContainerStateBefore.css.width).to.not.equal(sgGenContainerStateAfter.css.width);
      expect(sgViewportStateBefore.classArray).to.not.include('vp-animate');
      expect(sgViewportStateBefore.css.width).to.not.equal(sgViewportStateAfter.css.width);
      expect(sgSizeEmStateBefore.val).to.not.equal(sgSizeEmStateAfter.val);
      expect(sgSizePxStateBefore.val).to.not.equal(sgSizePxStateAfter.val);
      expect(dataSaverVpWidthBefore).to.equal('');

      expect(documentStateAfter.activeOrganism).to.equal('#sg-size-xx');
      expect(discoModeAfter).to.be.false;
      expect(discoIdAfter).to.be.undefined;
      expect(growModeAfter).to.be.false;
      expect(growIdAfter).to.be.undefined;
      expect(sgGenContainerStateAfter.classArray).to.include('vp-animate');
      expect(sgGenContainerStateAfter.css.width).to.equal('334px');
      expect(sgViewportStateAfter.classArray).to.include('vp-animate');
      expect(sgViewportStateAfter.css.width).to.equal('320px');
      expect(sgSizeEmStateAfter.val).to.equal('20.00');
      expect(sgSizePxStateAfter.val).to.equal('320');
      expect(dataSaverVpWidthAfter).to.equal('320');
    });

    it('runs .goSmall() with patternlab.keyPress "ctrl+shift+s"', function () {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+shift+s'
      };

      fepperUi.dataSaver.removeValue('vpWidth');
      $orgs['#sg-gen-container'].dispatchAction('removeClass', 'vp-animate');
      $orgs['#sg-viewport'].dispatchAction('removeClass', 'vp-animate');

      const documentStateBefore = $orgs.document.getState();
      const discoModeBefore = fepperUi.uiProps.discoMode = true;
      const discoIdBefore = fepperUi.uiProps.discoId = 1;
      const growModeBefore = fepperUi.uiProps.growMode = true;
      const growIdBefore = fepperUi.uiProps.growId = 2;
      const sgGenContainerStateBefore = $orgs['#sg-gen-container'].getState();
      const sgViewportStateBefore = $orgs['#sg-viewport'].getState();
      const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();
      const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthBefore = fepperUi.dataSaver.findValue('vpWidth');

      patternViewport.receiveIframeMessage(event);

      const documentStateAfter = $orgs.document.getState();
      const discoModeAfter = fepperUi.uiProps.discoMode;
      const discoIdAfter = fepperUi.uiProps.discoId;
      const growModeAfter = fepperUi.uiProps.growMode;
      const growIdAfter = fepperUi.uiProps.growId;
      const sgGenContainerStateAfter = $orgs['#sg-gen-container'].getState();
      const sgViewportStateAfter = $orgs['#sg-viewport'].getState();
      const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();
      const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthAfter = fepperUi.dataSaver.findValue('vpWidth');

      expect(documentStateBefore.activeOrganism).to.not.equal('#sg-size-sm');
      expect(discoModeBefore).to.be.true;
      expect(discoIdBefore).to.equal(1);
      expect(growModeBefore).to.be.true;
      expect(growIdBefore).to.equal(2);
      expect(sgGenContainerStateBefore.classArray).to.not.include('vp-animate');
      expect(sgGenContainerStateBefore.css.width).to.not.equal(sgGenContainerStateAfter.css.width);
      expect(sgViewportStateBefore.classArray).to.not.include('vp-animate');
      expect(sgViewportStateBefore.css.width).to.not.equal(sgViewportStateAfter.css.width);
      expect(sgSizeEmStateBefore.val).to.not.equal(sgSizeEmStateAfter.val);
      expect(sgSizePxStateBefore.val).to.not.equal(sgSizePxStateAfter.val);
      expect(dataSaverVpWidthBefore).to.equal('');

      expect(documentStateAfter.activeOrganism).to.equal('#sg-size-sm');
      expect(discoModeAfter).to.be.false;
      expect(discoIdAfter).to.be.undefined;
      expect(growModeAfter).to.be.false;
      expect(growIdAfter).to.be.undefined;
      expect(sgGenContainerStateAfter.classArray).to.include('vp-animate');
      expect(sgGenContainerStateAfter.css.width).to.equal('781px');
      expect(sgViewportStateAfter.classArray).to.include('vp-animate');
      expect(sgViewportStateAfter.css.width).to.equal('767px');
      expect(sgSizeEmStateAfter.val).to.equal('47.94');
      expect(sgSizePxStateAfter.val).to.equal('767');
      expect(dataSaverVpWidthAfter).to.equal('767');
    });

    it('runs .goMedium() with patternlab.keyPress "ctrl+shift+m"', function () {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+shift+m'
      };

      fepperUi.dataSaver.removeValue('vpWidth');
      $orgs['#sg-gen-container'].dispatchAction('removeClass', 'vp-animate');
      $orgs['#sg-viewport'].dispatchAction('removeClass', 'vp-animate');

      const documentStateBefore = $orgs.document.getState();
      const discoModeBefore = fepperUi.uiProps.discoMode = true;
      const discoIdBefore = fepperUi.uiProps.discoId = 1;
      const growModeBefore = fepperUi.uiProps.growMode = true;
      const growIdBefore = fepperUi.uiProps.growId = 2;
      const sgGenContainerStateBefore = $orgs['#sg-gen-container'].getState();
      const sgViewportStateBefore = $orgs['#sg-viewport'].getState();
      const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();
      const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthBefore = fepperUi.dataSaver.findValue('vpWidth');

      patternViewport.receiveIframeMessage(event);

      const documentStateAfter = $orgs.document.getState();
      const discoModeAfter = fepperUi.uiProps.discoMode;
      const discoIdAfter = fepperUi.uiProps.discoId;
      const growModeAfter = fepperUi.uiProps.growMode;
      const growIdAfter = fepperUi.uiProps.growId;
      const sgGenContainerStateAfter = $orgs['#sg-gen-container'].getState();
      const sgViewportStateAfter = $orgs['#sg-viewport'].getState();
      const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();
      const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthAfter = fepperUi.dataSaver.findValue('vpWidth');

      expect(documentStateBefore.activeOrganism).to.not.equal('#sg-size-md');
      expect(discoModeBefore).to.be.true;
      expect(discoIdBefore).to.equal(1);
      expect(growModeBefore).to.be.true;
      expect(growIdBefore).to.equal(2);
      expect(sgGenContainerStateBefore.classArray).to.not.include('vp-animate');
      expect(sgGenContainerStateBefore.css.width).to.not.equal(sgGenContainerStateAfter.css.width);
      expect(sgViewportStateBefore.classArray).to.not.include('vp-animate');
      expect(sgViewportStateBefore.css.width).to.not.equal(sgViewportStateAfter.css.width);
      expect(sgSizeEmStateBefore.val).to.not.equal(sgSizeEmStateAfter.val);
      expect(sgSizePxStateBefore.val).to.not.equal(sgSizePxStateAfter.val);
      expect(dataSaverVpWidthBefore).to.equal('');

      expect(documentStateAfter.activeOrganism).to.equal('#sg-size-md');
      expect(discoModeAfter).to.be.false;
      expect(discoIdAfter).to.be.undefined;
      expect(growModeAfter).to.be.false;
      expect(growIdAfter).to.be.undefined;
      expect(sgGenContainerStateAfter.classArray).to.include('vp-animate');
      expect(sgGenContainerStateAfter.css.width).to.equal('1038px');
      expect(sgViewportStateAfter.classArray).to.include('vp-animate');
      expect(sgViewportStateAfter.css.width).to.equal('1024px');
      expect(sgSizeEmStateAfter.val).to.equal('64.00');
      expect(sgSizePxStateAfter.val).to.equal('1024');
      expect(dataSaverVpWidthAfter).to.equal('1024');
    });

    it('runs .goLarge() with patternlab.keyPress "ctrl+shift+l"', function () {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+shift+l'
      };

      fepperUi.dataSaver.removeValue('vpWidth');
      $orgs['#sg-gen-container'].dispatchAction('removeClass', 'vp-animate');
      $orgs['#sg-viewport'].dispatchAction('removeClass', 'vp-animate');

      const sgViewportStateBefore = $orgs['#sg-viewport'].getState();
      const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();
      const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthBefore = fepperUi.dataSaver.findValue('vpWidth');

      patternViewport.receiveIframeMessage(event);

      const documentStateAfter = $orgs.document.getState();
      const discoModeAfter = fepperUi.uiProps.discoMode;
      const discoIdAfter = fepperUi.uiProps.discoId;
      const growModeAfter = fepperUi.uiProps.growMode;
      const growIdAfter = fepperUi.uiProps.growId;
      const sgGenContainerStateAfter = $orgs['#sg-gen-container'].getState();
      const sgViewportStateAfter = $orgs['#sg-viewport'].getState();
      const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();
      const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthAfter = fepperUi.dataSaver.findValue('vpWidth');

      expect(sgViewportStateBefore.classArray).to.not.include('vp-animate');
      expect(sgViewportStateBefore.css.width).to.not.equal(sgViewportStateAfter.css.width);
      expect(sgSizeEmStateBefore.val).to.not.equal(sgSizeEmStateAfter.val);
      expect(sgSizePxStateBefore.val).to.not.equal(sgSizePxStateAfter.val);
      expect(dataSaverVpWidthBefore).to.equal('');

      expect(documentStateAfter.activeOrganism).to.equal('#sg-size-lg');
      expect(discoModeAfter).to.be.false;
      expect(discoIdAfter).to.be.undefined;
      expect(growModeAfter).to.be.false;
      expect(growIdAfter).to.be.undefined;
      expect(sgGenContainerStateAfter.classArray).to.include('vp-animate');
      expect(sgGenContainerStateAfter.css.width).to.equal('1294px');
      expect(sgViewportStateAfter.classArray).to.include('vp-animate');
      expect(sgViewportStateAfter.css.width).to.equal('1280px');
      expect(sgSizeEmStateAfter.val).to.equal('80.00');
      expect(sgSizePxStateAfter.val).to.equal('1280');
      expect(dataSaverVpWidthAfter).to.equal('1280');
    });

    it('runs .goWhole() with patternlab.keyPress "ctrl+alt+w"', function () {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+alt+w'
      };

      fepperUi.dataSaver.removeValue('vpWidth');
      $orgs['#sg-gen-container'].dispatchAction('removeClass', 'vp-animate');
      $orgs['#sg-viewport'].dispatchAction('removeClass', 'vp-animate');

      const documentStateBefore = $orgs.document.getState();
      const discoModeBefore = fepperUi.uiProps.discoMode = true;
      const discoIdBefore = fepperUi.uiProps.discoId = 1;
      const growModeBefore = fepperUi.uiProps.growMode = true;
      const growIdBefore = fepperUi.uiProps.growId = 2;
      const sgGenContainerStateBefore = $orgs['#sg-gen-container'].getState();
      const sgViewportStateBefore = $orgs['#sg-viewport'].getState();
      const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();
      const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthBefore = fepperUi.dataSaver.findValue('vpWidth');

      patternViewport.receiveIframeMessage(event);

      const documentStateAfter = $orgs.document.getState();
      const discoModeAfter = fepperUi.uiProps.discoMode;
      const discoIdAfter = fepperUi.uiProps.discoId;
      const growModeAfter = fepperUi.uiProps.growMode;
      const growIdAfter = fepperUi.uiProps.growId;
      const sgGenContainerStateAfter = $orgs['#sg-gen-container'].getState();
      const sgViewportStateAfter = $orgs['#sg-viewport'].getState();
      const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();
      const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthAfter = fepperUi.dataSaver.findValue('vpWidth');

      expect(documentStateBefore.activeOrganism).to.not.equal('#sg-size-w');
      expect(discoModeBefore).to.be.true;
      expect(discoIdBefore).to.equal(1);
      expect(growModeBefore).to.be.true;
      expect(growIdBefore).to.equal(2);
      expect(sgGenContainerStateBefore.classArray).to.not.include('vp-animate');
      expect(sgGenContainerStateBefore.css.width).to.not.equal(sgGenContainerStateAfter.css.width);
      expect(sgViewportStateBefore.classArray).to.not.include('vp-animate');
      expect(sgViewportStateBefore.css.width).to.not.equal(sgViewportStateAfter.css.width);
      expect(sgSizeEmStateBefore.val).to.not.equal(sgSizeEmStateAfter.val);
      expect(sgSizePxStateBefore.val).to.not.equal(sgSizePxStateAfter.val);
      expect(dataSaverVpWidthBefore).to.equal('');

      expect(documentStateAfter.activeOrganism).to.equal('#sg-size-w');
      expect(discoModeAfter).to.be.false;
      expect(discoIdAfter).to.be.undefined;
      expect(growModeAfter).to.be.false;
      expect(growIdAfter).to.be.undefined;
      expect(sgGenContainerStateAfter.classArray).to.include('vp-animate');
      expect(sgGenContainerStateAfter.css.width).to.equal('1038px');
      expect(sgViewportStateAfter.classArray).to.include('vp-animate');
      expect(sgViewportStateAfter.css.width).to.equal('1024px');
      expect(sgSizeEmStateAfter.val).to.equal('64.00');
      expect(sgSizePxStateAfter.val).to.equal('1024');
      expect(dataSaverVpWidthAfter).to.equal('1024');
    });

    it('runs .goLarge() with patternlab.keyPress "ctrl+shift+l"', function () {
      global.navigator = {
        userAgent: ''
      };
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+shift+l'
      };

      fepperUi.dataSaver.removeValue('vpWidth');
      $orgs['#sg-gen-container'].dispatchAction('removeClass', 'vp-animate');
      $orgs['#sg-viewport'].dispatchAction('removeClass', 'vp-animate');

      const sgViewportStateBefore = $orgs['#sg-viewport'].getState();
      const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();
      const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthBefore = fepperUi.dataSaver.findValue('vpWidth');

      patternViewport.receiveIframeMessage(event);

      const documentStateAfter = $orgs.document.getState();
      const discoModeAfter = fepperUi.uiProps.discoMode;
      const discoIdAfter = fepperUi.uiProps.discoId;
      const growModeAfter = fepperUi.uiProps.growMode;
      const growIdAfter = fepperUi.uiProps.growId;
      const sgGenContainerStateAfter = $orgs['#sg-gen-container'].getState();
      const sgViewportStateAfter = $orgs['#sg-viewport'].getState();
      const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();
      const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthAfter = fepperUi.dataSaver.findValue('vpWidth');

      expect(sgViewportStateBefore.classArray).to.not.include('vp-animate');
      expect(sgViewportStateBefore.css.width).to.not.equal(sgViewportStateAfter.css.width);
      expect(sgSizeEmStateBefore.val).to.not.equal(sgSizeEmStateAfter.val);
      expect(sgSizePxStateBefore.val).to.not.equal(sgSizePxStateAfter.val);
      expect(dataSaverVpWidthBefore).to.equal('');

      expect(documentStateAfter.activeOrganism).to.equal('#sg-size-lg');
      expect(discoModeAfter).to.be.false;
      expect(discoIdAfter).to.be.undefined;
      expect(growModeAfter).to.be.false;
      expect(growIdAfter).to.be.undefined;
      expect(sgGenContainerStateAfter.classArray).to.include('vp-animate');
      expect(sgGenContainerStateAfter.css.width).to.equal('1294px');
      expect(sgViewportStateAfter.classArray).to.include('vp-animate');
      expect(sgViewportStateAfter.css.width).to.equal('1280px');
      expect(sgSizeEmStateAfter.val).to.equal('80.00');
      expect(sgSizePxStateAfter.val).to.equal('1280');
      expect(dataSaverVpWidthAfter).to.equal('1280');
    });

    it('runs .goWhole() with patternlab.keyPress "ctrl+shift+w"', function () {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+shift+w'
      };

      fepperUi.dataSaver.removeValue('vpWidth');
      $orgs['#sg-gen-container'].dispatchAction('removeClass', 'vp-animate');
      $orgs['#sg-viewport'].dispatchAction('removeClass', 'vp-animate');

      const documentStateBefore = $orgs.document.getState();
      const discoModeBefore = fepperUi.uiProps.discoMode = true;
      const discoIdBefore = fepperUi.uiProps.discoId = 1;
      const growModeBefore = fepperUi.uiProps.growMode = true;
      const growIdBefore = fepperUi.uiProps.growId = 2;
      const sgGenContainerStateBefore = $orgs['#sg-gen-container'].getState();
      const sgViewportStateBefore = $orgs['#sg-viewport'].getState();
      const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();
      const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthBefore = fepperUi.dataSaver.findValue('vpWidth');

      patternViewport.receiveIframeMessage(event);

      const documentStateAfter = $orgs.document.getState();
      const discoModeAfter = fepperUi.uiProps.discoMode;
      const discoIdAfter = fepperUi.uiProps.discoId;
      const growModeAfter = fepperUi.uiProps.growMode;
      const growIdAfter = fepperUi.uiProps.growId;
      const sgGenContainerStateAfter = $orgs['#sg-gen-container'].getState();
      const sgViewportStateAfter = $orgs['#sg-viewport'].getState();
      const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();
      const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthAfter = fepperUi.dataSaver.findValue('vpWidth');

      expect(documentStateBefore.activeOrganism).to.not.equal('#sg-size-w');
      expect(discoModeBefore).to.be.true;
      expect(discoIdBefore).to.equal(1);
      expect(growModeBefore).to.be.true;
      expect(growIdBefore).to.equal(2);
      expect(sgGenContainerStateBefore.classArray).to.not.include('vp-animate');
      expect(sgGenContainerStateBefore.css.width).to.not.equal(sgGenContainerStateAfter.css.width);
      expect(sgViewportStateBefore.classArray).to.not.include('vp-animate');
      expect(sgViewportStateBefore.css.width).to.not.equal(sgViewportStateAfter.css.width);
      expect(sgSizeEmStateBefore.val).to.not.equal(sgSizeEmStateAfter.val);
      expect(sgSizePxStateBefore.val).to.not.equal(sgSizePxStateAfter.val);
      expect(dataSaverVpWidthBefore).to.equal('');

      expect(documentStateAfter.activeOrganism).to.equal('#sg-size-w');
      expect(discoModeAfter).to.be.false;
      expect(discoIdAfter).to.be.undefined;
      expect(growModeAfter).to.be.false;
      expect(growIdAfter).to.be.undefined;
      expect(sgGenContainerStateAfter.classArray).to.include('vp-animate');
      expect(sgGenContainerStateAfter.css.width).to.equal('1038px');
      expect(sgViewportStateAfter.classArray).to.include('vp-animate');
      expect(sgViewportStateAfter.css.width).to.equal('1024px');
      expect(sgSizeEmStateAfter.val).to.equal('64.00');
      expect(sgSizePxStateAfter.val).to.equal('1024');
      expect(dataSaverVpWidthAfter).to.equal('1024');
    });

    it('runs .goRandom() with patternlab.keyPress "ctrl+alt+r"', function () {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+alt+r'
      };

      fepperUi.dataSaver.removeValue('vpWidth');
      $orgs['#sg-gen-container'].dispatchAction('removeClass', 'vp-animate');
      $orgs['#sg-viewport'].dispatchAction('removeClass', 'vp-animate');

      const documentStateBefore = $orgs.document.getState();
      const discoModeBefore = fepperUi.uiProps.discoMode = true;
      const discoIdBefore = fepperUi.uiProps.discoId = 1;
      const growModeBefore = fepperUi.uiProps.growMode = true;
      const growIdBefore = fepperUi.uiProps.growId = 2;
      const sgGenContainerStateBefore = $orgs['#sg-gen-container'].getState();
      const sgViewportStateBefore = $orgs['#sg-viewport'].getState();

      patternViewport.receiveIframeMessage(event);

      const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();
      const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthBefore = fepperUi.dataSaver.findValue('vpWidth');

      patternViewport.receiveIframeMessage(event);

      const documentStateAfter = $orgs.document.getState();
      const discoModeAfter = fepperUi.uiProps.discoMode;
      const discoIdAfter = fepperUi.uiProps.discoId;
      const growModeAfter = fepperUi.uiProps.growMode;
      const growIdAfter = fepperUi.uiProps.growId;
      const sgGenContainerStateAfter = $orgs['#sg-gen-container'].getState();
      const sgViewportStateAfter = $orgs['#sg-viewport'].getState();
      const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();
      const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthAfter = fepperUi.dataSaver.findValue('vpWidth');

      expect(documentStateBefore.activeOrganism).to.not.equal('#sg-size-random');
      expect(discoModeBefore).to.be.true;
      expect(discoIdBefore).to.equal(1);
      expect(growModeBefore).to.be.true;
      expect(growIdBefore).to.equal(2);
      expect(sgGenContainerStateBefore.classArray).to.not.include('vp-animate');
      expect(sgViewportStateBefore.classArray).to.not.include('vp-animate');

      expect(documentStateAfter.activeOrganism).to.equal('#sg-size-random');
      expect(discoModeAfter).to.be.false;
      expect(discoIdAfter).to.be.undefined;
      expect(growModeAfter).to.be.false;
      expect(growIdAfter).to.be.undefined;
      expect(sgGenContainerStateAfter.classArray).to.include('vp-animate');
      expect(sgViewportStateAfter.classArray).to.include('vp-animate');

      // Compare before and after to test randomness.
      expect(sgGenContainerStateBefore.css.width).to.not.equal(sgGenContainerStateAfter.css.width);
      expect(sgViewportStateBefore.css.width).to.not.equal(sgViewportStateAfter.css.width);
      expect(sgSizeEmStateBefore.val).to.not.equal(sgSizeEmStateAfter.val);
      expect(sgSizePxStateBefore.val).to.not.equal(sgSizePxStateAfter.val);
      expect(dataSaverVpWidthBefore).to.not.equal(dataSaverVpWidthAfter);
    });

    it('toggles on grow with patternlab.keyPress "ctrl+alt+g"', function (done) {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+alt+g'
      };

      $orgs['#sg-size-grow'].dispatchAction('blur');
      $orgs['#sg-gen-container'].dispatchAction('addClass', 'vp-animate');
      $orgs['#sg-viewport'].dispatchAction('addClass', 'vp-animate');

      const documentStateBefore = $orgs.document.getState();
      const growModeBefore = fepperUi.uiProps.growMode;
      const growIdBefore = fepperUi.uiProps.growId;
      const sgGenContainerStateBefore = $orgs['#sg-gen-container'].getState();
      const sgViewportStateBefore = $orgs['#sg-viewport'].getState();

      patternViewport.receiveIframeMessage(event);

      setTimeout(() => {
        const documentStateAfter = $orgs.document.getState();
        const growModeAfter = fepperUi.uiProps.growMode;
        const growIdAfter = fepperUi.uiProps.growId;
        const sgGenContainerStateAfter = $orgs['#sg-gen-container'].getState();
        const sgViewportStateAfter = $orgs['#sg-viewport'].getState();

        expect(documentStateBefore.activeOrganism).to.not.equal('#sg-size-grow');
        expect(growModeBefore).to.be.false;
        expect(growIdBefore).to.not.be.ok;
        expect(sgGenContainerStateBefore.classArray).to.include('vp-animate');
        expect(sgViewportStateBefore.classArray).to.include('vp-animate');

        expect(documentStateAfter.activeOrganism).to.equal('#sg-size-grow');
        expect(growModeAfter).to.be.true;
        expect(growIdAfter).to.be.ok;
        expect(sgGenContainerStateAfter.classArray).to.not.include('vp-animate');
        expect(sgViewportStateAfter.classArray).to.not.include('vp-animate');

        uiFns.stopGrow();
        done();
      }, uiProps.timeoutDefault);
    });

    it('toggles off grow with patternlab.keyPress "ctrl+alt+g"', function (done) {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+alt+g'
      };

      $orgs['#sg-size-grow'].dispatchAction('focus');
      uiFns.startGrow();

      setTimeout(() => {
        const documentStateBefore = $orgs.document.getState();
        const growModeBefore = fepperUi.uiProps.growMode;
        const growIdBefore = fepperUi.uiProps.growId;

        patternViewport.receiveIframeMessage(event);

        const documentStateAfter = $orgs.document.getState();
        const growModeAfter = fepperUi.uiProps.growMode;
        const growIdAfter = fepperUi.uiProps.growId;

        expect(documentStateBefore.activeOrganism).to.equal('#sg-size-grow');
        expect(growModeBefore).to.be.true;
        expect(growIdBefore).to.be.ok;

        expect(documentStateAfter.activeOrganism).to.not.equal('#sg-size-grow');
        expect(growModeAfter).to.be.false;
        expect(growIdAfter).to.be.undefined;

        done();
      }, uiProps.timeoutDefault);
    });

    it('toggles on disco with patternlab.keyPress "ctrl+shift+d"', function (done) {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+shift+d'
      };

      $orgs['#sg-size-disco'].dispatchAction('blur');

      const documentStateBefore = $orgs.document.getState();
      const discoModeBefore = fepperUi.uiProps.discoMode;
      const discoIdBefore = fepperUi.uiProps.discoId;

      patternViewport.receiveIframeMessage(event);

      setTimeout(() => {
        const documentStateAfter = $orgs.document.getState();
        const discoModeAfter = fepperUi.uiProps.discoMode;
        const discoIdAfter = fepperUi.uiProps.discoId;

        expect(documentStateBefore.activeOrganism).to.not.equal('#sg-size-disco');
        expect(discoModeBefore).to.be.false;
        expect(discoIdBefore).to.not.be.ok;

        expect(documentStateAfter.activeOrganism).to.equal('#sg-size-disco');
        expect(discoModeAfter).to.be.true;
        expect(discoIdAfter).to.be.ok;

        uiFns.stopDisco();
        done();
      }, 1000);
    });

    it('toggles off disco with patternlab.keyPress "ctrl+shift+d"', function (done) {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+shift+d'
      };

      $orgs['#sg-size-disco'].dispatchAction('focus');
      patternViewport.receiveIframeMessage(event);

      setTimeout(() => {
        const documentStateBefore = $orgs.document.getState();
        const discoModeBefore = fepperUi.uiProps.discoMode;
        const discoIdBefore = fepperUi.uiProps.discoId;

        patternViewport.receiveIframeMessage(event);

        const documentStateAfter = $orgs.document.getState();
        const discoModeAfter = fepperUi.uiProps.discoMode;
        const discoIdAfter = fepperUi.uiProps.discoId;

        expect(documentStateBefore.activeOrganism).to.equal('#sg-size-disco');
        expect(discoModeBefore).to.be.true;
        expect(discoIdBefore).to.be.ok;

        expect(documentStateAfter.activeOrganism).to.not.equal('#sg-size-disco');
        expect(discoModeAfter).to.be.false;
        expect(discoIdAfter).to.be.undefined;

        done();
      }, 1000);
    });

    it('pushes pattern on patternlab.pageLoad', function () {
      const patternPartial = 'elements-paragraph';
      event.data = {
        event: 'patternlab.pageLoad',
        patternPartial
      };
      global.document.title = 'Fepper';
      global.location = {
        protocol: 'http:',
        host: 'localhost:3000',
        pathname: '/',
        search: `?p=${patternPartial}`
      };
      fepperUi.urlHandler.skipBack = false;

      const documentTitleBefore = global.document.title;
      const historyStateBefore = global.history.state;
      const sgRawAttribsBefore = $orgs['#sg-raw'].getState().attribs;

      patternViewport.receiveIframeMessage(event);

      const documentTitleAfter = global.document.title;
      const historyStateAfter = global.history.state;
      const sgRawAttribsAfter = $orgs['#sg-raw'].getState().attribs;

      expect(documentTitleBefore).to.not.equal(documentTitleAfter);
      expect(historyStateBefore.pattern).to.not.equal(historyStateAfter.pattern);
      expect(sgRawAttribsBefore.href).to.not.equal(sgRawAttribsAfter.href);

      expect(documentTitleAfter).to.equal(`Fepper : ${patternPartial}`);
      expect(historyStateAfter.pattern).to.equal(patternPartial);
      expect(sgRawAttribsAfter.href).to.equal('patterns/00-elements-paragraph/00-elements-paragraph.html');
    });

    it('skips pattern push on patternlab.pageLoad if skipBack === true', function () {
      const patternPartial = 'pages-homepage';
      event.data = {
        event: 'patternlab.pageLoad',
        patternPartial
      };
      global.location = {
        protocol: 'http:',
        host: 'localhost:3000',
        pathname: '/',
        search: `?p=${patternPartial}`
      };
      fepperUi.urlHandler.skipBack = true;

      const documentTitleBefore = global.document.title;
      const historyStateBefore = global.history.state;
      const sgRawAttribsBefore = $orgs['#sg-raw'].getState().attribs;
      const skipBackBefore = fepperUi.urlHandler.skipBack;

      patternViewport.receiveIframeMessage(event);

      const documentTitleAfter = global.document.title;
      const historyStateAfter = global.history.state;
      const sgRawAttribsAfter = $orgs['#sg-raw'].getState().attribs;
      const skipBackAfter = fepperUi.urlHandler.skipBack;

      expect(documentTitleBefore).to.equal(documentTitleAfter);
      expect(historyStateBefore.pattern).to.equal(historyStateAfter.pattern);
      expect(sgRawAttribsBefore.href).to.equal(sgRawAttribsAfter.href);
      expect(skipBackBefore).to.be.true;

      expect(skipBackAfter).to.be.false;
    });

    it(
      'skips pattern push on patternlab.pageLoad if latest pattern in history does matches submitted patternPartial',
      function () {
        const patternPartial = 'pages-homepage';
        event.data = {
          event: 'patternlab.pageLoad',
          patternPartial
        };
        global.location = {
          protocol: 'http:',
          host: 'localhost:3000',
          pathname: '/',
          search: `?p=${patternPartial}`
        };
        global.history.state.pattern = 'pages-homepage';

        const documentTitleBefore = global.document.title;
        const historyStateBefore = global.history.state;
        const sgRawAttribsBefore = $orgs['#sg-raw'].getState().attribs;

        patternViewport.receiveIframeMessage(event);

        const documentTitleAfter = global.document.title;
        const historyStateAfter = global.history.state;
        const sgRawAttribsAfter = $orgs['#sg-raw'].getState().attribs;

        expect(documentTitleBefore).to.equal(documentTitleAfter);
        expect(historyStateBefore.pattern).to.equal(historyStateAfter.pattern);
        expect(sgRawAttribsBefore.href).to.equal(sgRawAttribsAfter.href);
      }
    );

    it('updates pattern info on patternlab.updatePatternInfo', function () {
      const path = 'patterns/04-pages-00-homepage/04-pages-00-homepage.html';
      const patternPartial = 'pages-homepage';
      event.data = {
        event: 'patternlab.updatePatternInfo',
        path,
        patternPartial
      };
      global.document.title = 'Fepper';
      global.history.state.pattern = '';

      const documentTitleBefore = global.document.title;
      const historyStateBefore = global.history.state;
      const sgRawStateBefore = $orgs['#sg-raw'].getState();

      patternViewport.receiveIframeMessage(event);

      const documentTitleAfter = global.document.title;
      const historyStateAfter = global.history.state;
      const sgRawStateAfter = $orgs['#sg-raw'].getState();

      expect(documentTitleBefore).to.not.equal(documentTitleAfter);
      expect(historyStateBefore.pattern).to.not.equal(historyStateAfter.pattern);
      expect(sgRawStateBefore.attribs.href).to.not.equal(sgRawStateAfter);

      expect(documentTitleAfter).to.equal(`Fepper : ${patternPartial}`);
      expect(sgRawStateAfter.attribs.href).to.equal(path);
    });
  });
});
