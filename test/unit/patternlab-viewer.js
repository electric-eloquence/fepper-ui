import {expect} from 'chai';
import fs from 'fs';
import sinon from 'sinon';

import PatternlabViewer from '../../scripts/classes/patternlab-viewer';
import fepperUi from '../init';

const sandbox = sinon.createSandbox();

const $orgs = fepperUi.requerio.$orgs;
const patternlabViewer = fepperUi.patternlabViewer;
const uiFns = fepperUi.uiFns;
const uiProps = fepperUi.uiProps;

describe('patternlabViewer', function () {
  describe('.constructor()', function () {
    it('instantiates correctly', function () {
      expect(patternlabViewer).to.be.an.instanceof(PatternlabViewer);
      expect(Object.keys(patternlabViewer).length).to.equal(9);
      expect(patternlabViewer).to.have.property('receiveIframeMessage');
      expect(patternlabViewer).to.have.property('fepperUi');
      expect(patternlabViewer).to.have.property('$orgs');
      expect(patternlabViewer).to.have.property('uiData');
      expect(patternlabViewer).to.have.property('uiFns');
      expect(patternlabViewer).to.have.property('uiProps');
      expect(patternlabViewer).to.have.property('patternPaths');
      expect(patternlabViewer).to.have.property('dataSaver');
      expect(patternlabViewer).to.have.property('urlHandler');
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

        patternlabViewer.stoke();

        patternlabHtmlStateAfter = $orgs['#patternlab-html'].getState();
        sgControlsStateAfter = $orgs['#sg-controls'].getState();
        sgNavTargetStateAfter = $orgs['#sg-nav-target'].getState();
      });

      /* eslint-disable max-len */
      it('Feplet renders in nav target', function () {
        expect(sgNavTargetStateBefore.innerHTML).to.not.equal(sgNavTargetStateAfter.innerHTML);

        expect(sgNavTargetStateAfter.innerHTML).to.equal(`
  <li class="sg-nav-elements"><a class="sg-acc-handle">Elements</a><ul class="sg-acc-panel sg-sub-nav">
    <li class="sg-item-nav-elements-anchor">
      <a href="patterns/00-elements-anchor/00-elements-anchor.html" class="sg-pop " data-patternpartial="elements-anchor">Anchor</a>
    </li>
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
    <li class="sg-item-nav-pages-mustache-browser">
      <a href="patterns/04-pages-mustache-browser/04-pages-mustache-browser.html" class="sg-pop " data-patternpartial="pages-mustache-browser">Mustache Browser</a>
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
        expect(sgControlsStateBefore.innerHTML).to.not.equal(sgControlsStateAfter.innerHTML);

        expect(sgControlsStateAfter.innerHTML).to.equal(`<li class="sg-size">
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
  <a href="#" class="sg-control-trigger sg-icon sg-icon-search" id="sg-f-toggle" title="Search Patterns"><span class="is-vishidden">Search Patterns</span></a>
  <ul class="sg-acc-panel sg-right sg-checklist" id="sg-find" style="top: 32px;">
    <li><input class="typeahead" id="typeahead" type="text" placeholder="search for a pattern..."></li>
  </ul>
</li><li class="sg-view">
  <a href="#" class="sg-acc-handle sg-control-trigger sg-icon sg-icon-eye" id="sg-t-toggle" title="View"><span class="is-vishidden">View</span></a>
  <ul class="sg-acc-panel sg-right sg-checklist" id="sg-view">
    <li><a href="#" class="sg-checklist-icon sg-checkbox" id="sg-t-annotations">Annotations</a></li>
    <li><a href="#" class="sg-checklist-icon sg-checkbox" id="sg-t-code">Code</a></li>
    <li><a href="patterns/04-pages-00-homepage/04-pages-00-homepage.html" target="_blank" id="sg-raw" class="sg-checklist-icon sg-icon-link">Open in new window</a></li>
  </ul>
</li><li class="sg-tools">
  <a href="#" class="sg-acc-handle sg-control-trigger sg-icon sg-icon-cog" id="sg-tools-toggle" title="Tools"><span class="is-vishidden">Tools</span></a>
  <ul class="sg-acc-panel sg-right sg-checklist" id="sg-tools">
    <li><a href="/readme" class="sg-tool sg-checklist-icon sg-icon-file" target="_blank">Fepper Docs</a>
    </li><li><a href="https://patternlab.io/docs/" class="sg-tool sg-checklist-icon sg-icon-file" target="_blank">Pattern Lab Docs</a>
    </li><li><a href="/readme#keyboard-shortcuts" class="sg-tool sg-checklist-icon sg-icon-keyboard" target="_blank">Keyboard Shortcuts</a>
  </li></ul>
</li>`);
      });
      /* eslint-enable max-len */

      it('removes is-vishidden classes from nav target and controls', function () {
        expect(sgNavTargetStateBefore.classList).to.include('is-vishidden');
        expect(sgControlsStateBefore.classList).to.include('is-vishidden');

        expect(sgNavTargetStateAfter.classList).to.not.include('is-vishidden');
        expect(sgControlsStateAfter.classList).to.not.include('is-vishidden');
      });

      it('does not leave behind Feplet tag artifacts', function () {
        const regex = /\{\{[^\}]*\}\}/; // eslint-disable-line no-useless-escape
        const templateBefore = fs.readFileSync(`${__dirname}/../fixtures/index.html`, 'utf8');

        expect(templateBefore).to.match(regex);

        expect(sgNavTargetStateAfter.innerHTML).to.not.match(regex);
        expect(sgControlsStateAfter.innerHTML).to.not.match(regex);
      });

      it('adds a class identifying the protocol to the html element', function () {
        expect(patternlabHtmlStateBefore.classList).to.not.include('protocol-http');

        expect(patternlabHtmlStateAfter.classList).to.include('protocol-http');
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

        patternlabViewer.stoke();

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

        patternlabViewer.stoke();

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

        patternlabViewer.stoke();

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

        patternlabViewer.stoke();

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

        patternlabViewer.stoke();

        const sgGenContainerStateAfter = $orgs['#sg-gen-container'].getState();
        const sgViewportStateAfter = $orgs['#sg-viewport'].getState();
        const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
        const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();

        expect(sgGenContainerStateBefore.style.width).to.not.equal(sgGenContainerStateAfter.style.width);
        expect(sgViewportStateBefore.style.width).to.not.equal(sgViewportStateAfter.style.width);
        expect(sgSizePxStateBefore.value).to.not.equal(sgSizePxStateAfter.value);
        expect(sgSizeEmStateBefore.value).to.not.equal(sgSizeEmStateAfter.value);

        expect(sgGenContainerStateAfter.style.width).to.equal('1038px');
        expect(sgViewportStateAfter.style.width).to.equal('1024px');
        expect(sgSizePxStateAfter.value).to.equal('1024');
        expect(sgSizeEmStateAfter.value).to.equal('64.00');

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

        patternlabViewer.stoke();

        const sgGenContainerStateAfter = $orgs['#sg-gen-container'].getState();
        const sgViewportStateAfter = $orgs['#sg-viewport'].getState();
        const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
        const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();

        expect(sgGenContainerStateBefore.style.width).to.not.equal(sgGenContainerStateAfter.style.width);
        expect(sgViewportStateBefore.style.width).to.not.equal(sgViewportStateAfter.style.width);
        expect(sgSizePxStateBefore.value).to.not.equal(sgSizePxStateAfter.value);
        expect(sgSizeEmStateBefore.value).to.not.equal(sgSizeEmStateAfter.value);

        expect(sgGenContainerStateAfter.style.width).to.equal('1351px');
        expect(sgViewportStateAfter.style.width).to.equal('1337px');
        expect(sgSizePxStateAfter.value).to.equal('1337');
        expect(sgSizeEmStateAfter.value).to.equal('83.56');

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

        patternlabViewer.stoke();

        const sgGenContainerStateAfter = $orgs['#sg-gen-container'].getState();
        const sgViewportStateAfter = $orgs['#sg-viewport'].getState();
        const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
        const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();

        expect(sgGenContainerStateBefore.style.width).to.not.equal(sgGenContainerStateAfter.style.width);
        expect(sgViewportStateBefore.style.width).to.not.equal(sgViewportStateAfter.style.width);
        expect(sgSizePxStateBefore.value).to.not.equal(sgSizePxStateAfter.value);
        expect(sgSizeEmStateBefore.value).to.not.equal(sgSizeEmStateAfter.value);

        expect(sgGenContainerStateAfter.style.width).to.equal('1984px');
        expect(sgViewportStateAfter.style.width).to.equal('1970px');
        expect(sgSizePxStateAfter.value).to.equal('1970');
        expect(sgSizeEmStateAfter.value).to.equal('123.13');

        fepperUi.dataSaver.removeValue('vpWidth');
      });

      it('updates size info without a search param and without a "vpWidth" dataSaver value', function () {
        fepperUi.dataSaver.removeValue('vpWidth');
        $orgs['#sg-size-px'].dispatchAction('val', null);
        $orgs['#sg-size-em'].dispatchAction('val', null);

        const sgViewportStateBefore = $orgs['#sg-viewport'].getState();
        const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
        const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();

        patternlabViewer.stoke();

        const sgViewportStateAfter = $orgs['#sg-viewport'].getState();
        const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
        const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();

        expect(sgViewportStateBefore.innerWidth).to.equal(1010);
        expect(sgSizePxStateBefore.value).to.not.equal(sgSizePxStateAfter.value);
        expect(sgSizeEmStateBefore.value).to.not.equal(sgSizeEmStateAfter.value);

        expect(sgViewportStateAfter.style.width).to.equal(sgViewportStateBefore.style.width);
        expect(sgSizePxStateAfter.value).to.equal('1010');
        expect(sgSizeEmStateAfter.value).to.equal('63.13');

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
        patternlabViewer.fepperUi.urlHandler.skipBack = false;

        const skipBackBefore = patternlabViewer.fepperUi.urlHandler.skipBack;
        const historyStateBefore = global.history.state;

        patternlabViewer.stoke();

        const skipBackAfter = patternlabViewer.fepperUi.urlHandler.skipBack;
        const historyStateAfter = global.history.state;

        expect(skipBackBefore).to.be.false;
        expect(historyStateBefore.pattern).to.not.equal(historyStateAfter.pattern);

        expect(skipBackAfter).to.be.true;
        expect(historyStateAfter.pattern).to.equal('elements-paragraph');
        expect($orgs['#sg-viewport'][0].contentWindow.location.replace.calledOnce).to.be.true;
      });

      it('with config.defaultPattern', function () {
        patternlabViewer.fepperUi.urlHandler.skipBack = false;

        const skipBackBefore = patternlabViewer.fepperUi.urlHandler.skipBack;
        const historyStateBefore = global.history.state;

        patternlabViewer.stoke();

        const skipBackAfter = patternlabViewer.fepperUi.urlHandler.skipBack;
        const historyStateAfter = global.history.state;

        expect(skipBackBefore).to.be.false;
        expect(historyStateBefore.pattern).to.not.equal(historyStateAfter.pattern);
        expect(skipBackAfter).to.be.true;
        expect(historyStateAfter.pattern).to.equal('pages-homepage');
        expect($orgs['#sg-viewport'][0].contentWindow.location.replace.calledOnce).to.be.true;
      });

      it('defaults to viewall', function () {
        patternlabViewer.fepperUi.urlHandler.skipBack = false;
        delete patternlabViewer.uiData.config.defaultPattern;

        const skipBackBefore = patternlabViewer.fepperUi.urlHandler.skipBack;
        const historyStateBefore = global.history.state;

        patternlabViewer.stoke();

        const skipBackAfter = patternlabViewer.fepperUi.urlHandler.skipBack;
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

        patternlabViewer.renderResizeBtns();

        const sgResizeBtnsStateAfter = $orgs['#sg-resize-btns'].getState();

        expect(sgResizeBtnsStateBefore.innerHTML).to.not.equal(sgResizeBtnsStateAfter.innerHTML);

        // eslint-disable-next-line max-len
        expect(sgResizeBtnsStateAfter.innerHTML).to.equal('<li><a href="#" id="sg-size-xx">XX</a></li><li><a href="#" id="sg-size-xs">XS</a></li><li><a href="#" id="sg-size-sm">SM</a></li><li><a href="#" id="sg-size-md">MD</a></li><li><a href="#" id="sg-size-lg">LG</a></li>');
      });
    });
  });

  describe('.goResize()', function () {
    it('resizes to a custom size', function () {
      fepperUi.dataSaver.removeValue('vpWidth');
      $orgs['#sg-gen-container'].dispatchAction('removeClass', 'vp-animate');
      $orgs['#sg-viewport'].dispatchAction('removeClass', 'vp-animate');

      fepperUi.uiProps.bpObj.foo = 1337;

      const discoModeBefore = fepperUi.uiProps.discoMode = true;
      const discoIdBefore = fepperUi.uiProps.discoId = 1;
      const growModeBefore = fepperUi.uiProps.growMode = true;
      const growIdBefore = fepperUi.uiProps.growId = 2;
      const sgGenContainerStateBefore = $orgs['#sg-gen-container'].getState();
      const sgViewportStateBefore = $orgs['#sg-viewport'].getState();
      const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();
      const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthBefore = fepperUi.dataSaver.findValue('vpWidth');

      patternlabViewer.goResize('foo');

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
      expect(sgGenContainerStateBefore.classList).to.not.include('vp-animate');
      expect(sgGenContainerStateBefore.style.width).to.not.equal('1351px');
      expect(sgViewportStateBefore.classList).to.not.include('vp-animate');
      expect(sgViewportStateBefore.style.width).to.not.equal('1337px');
      expect(sgSizeEmStateBefore.value).to.not.equal('83.56');
      expect(sgSizePxStateBefore.value).to.not.equal(1337);
      expect(dataSaverVpWidthBefore).to.equal('');

      expect(discoModeAfter).to.be.false;
      expect(discoIdAfter).to.be.undefined;
      expect(growModeAfter).to.be.false;
      expect(growIdAfter).to.be.undefined;
      expect(sgGenContainerStateAfter.classList).to.include('vp-animate');
      expect(sgGenContainerStateAfter.style.width).to.equal('1351px');
      expect(sgViewportStateAfter.classList).to.include('vp-animate');
      expect(sgViewportStateAfter.style.width).to.equal('1337px');
      expect(sgSizeEmStateAfter.value).to.equal('83.56');
      expect(sgSizePxStateAfter.value).to.equal('1337');
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

      patternlabViewer.goXXSmall();

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
      expect(sgGenContainerStateBefore.classList).to.not.include('vp-animate');
      expect(sgGenContainerStateBefore.style.width).to.not.equal(sgGenContainerStateAfter.style.width);
      expect(sgViewportStateBefore.classList).to.not.include('vp-animate');
      expect(sgViewportStateBefore.style.width).to.not.equal(sgViewportStateAfter.style.width);
      expect(sgSizeEmStateBefore.value).to.not.equal(sgSizeEmStateAfter.value);
      expect(sgSizePxStateBefore.value).to.not.equal(sgSizePxStateAfter.value);
      expect(dataSaverVpWidthBefore).to.equal('');

      expect(documentStateAfter.activeOrganism).to.equal('#sg-size-xx');
      expect(discoModeAfter).to.be.false;
      expect(discoIdAfter).to.be.undefined;
      expect(growModeAfter).to.be.false;
      expect(growIdAfter).to.be.undefined;
      expect(sgGenContainerStateAfter.classList).to.include('vp-animate');
      expect(sgGenContainerStateAfter.style.width).to.equal('334px');
      expect(sgViewportStateAfter.classList).to.include('vp-animate');
      expect(sgViewportStateAfter.style.width).to.equal('320px');
      expect(sgSizeEmStateAfter.value).to.equal('20.00');
      expect(sgSizePxStateAfter.value).to.equal('320');
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

      patternlabViewer.goXSmall();

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
      expect(sgGenContainerStateBefore.classList).to.not.include('vp-animate');
      expect(sgGenContainerStateBefore.style.width).to.not.equal(sgGenContainerStateAfter.style.width);
      expect(sgViewportStateBefore.classList).to.not.include('vp-animate');
      expect(sgViewportStateBefore.style.width).to.not.equal(sgViewportStateAfter.style.width);
      expect(sgSizeEmStateBefore.value).to.not.equal(sgSizeEmStateAfter.value);
      expect(sgSizePxStateBefore.value).to.not.equal(sgSizePxStateAfter.value);
      expect(dataSaverVpWidthBefore).to.equal('');

      expect(documentStateAfter.activeOrganism).to.equal('#sg-size-xs');
      expect(discoModeAfter).to.be.false;
      expect(discoIdAfter).to.be.undefined;
      expect(growModeAfter).to.be.false;
      expect(growIdAfter).to.be.undefined;
      expect(sgGenContainerStateAfter.classList).to.include('vp-animate');
      expect(sgGenContainerStateAfter.style.width).to.equal('494px');
      expect(sgViewportStateAfter.classList).to.include('vp-animate');
      expect(sgViewportStateAfter.style.width).to.equal('480px');
      expect(sgSizeEmStateAfter.value).to.equal('30.00');
      expect(sgSizePxStateAfter.value).to.equal('480');
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

      patternlabViewer.goSmall();

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
      expect(sgGenContainerStateBefore.classList).to.not.include('vp-animate');
      expect(sgGenContainerStateBefore.style.width).to.not.equal(sgGenContainerStateAfter.style.width);
      expect(sgViewportStateBefore.classList).to.not.include('vp-animate');
      expect(sgViewportStateBefore.style.width).to.not.equal(sgViewportStateAfter.style.width);
      expect(sgSizeEmStateBefore.value).to.not.equal(sgSizeEmStateAfter.value);
      expect(sgSizePxStateBefore.value).to.not.equal(sgSizePxStateAfter.value);
      expect(dataSaverVpWidthBefore).to.equal('');

      expect(documentStateAfter.activeOrganism).to.equal('#sg-size-sm');
      expect(discoModeAfter).to.be.false;
      expect(discoIdAfter).to.be.undefined;
      expect(growModeAfter).to.be.false;
      expect(growIdAfter).to.be.undefined;
      expect(sgGenContainerStateAfter.classList).to.include('vp-animate');
      expect(sgGenContainerStateAfter.style.width).to.equal('781px');
      expect(sgViewportStateAfter.classList).to.include('vp-animate');
      expect(sgViewportStateAfter.style.width).to.equal('767px');
      expect(sgSizeEmStateAfter.value).to.equal('47.94');
      expect(sgSizePxStateAfter.value).to.equal('767');
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

      patternlabViewer.goMedium();

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
      expect(sgGenContainerStateBefore.classList).to.not.include('vp-animate');
      expect(sgGenContainerStateBefore.style.width).to.not.equal(sgGenContainerStateAfter.style.width);
      expect(sgViewportStateBefore.classList).to.not.include('vp-animate');
      expect(sgViewportStateBefore.style.width).to.not.equal(sgViewportStateAfter.style.width);
      expect(sgSizeEmStateBefore.value).to.not.equal(sgSizeEmStateAfter.value);
      expect(sgSizePxStateBefore.value).to.not.equal(sgSizePxStateAfter.value);
      expect(dataSaverVpWidthBefore).to.equal('');

      expect(documentStateAfter.activeOrganism).to.equal('#sg-size-md');
      expect(discoModeAfter).to.be.false;
      expect(discoIdAfter).to.be.undefined;
      expect(growModeAfter).to.be.false;
      expect(growIdAfter).to.be.undefined;
      expect(sgGenContainerStateAfter.classList).to.include('vp-animate');
      expect(sgGenContainerStateAfter.style.width).to.equal('1038px');
      expect(sgViewportStateAfter.classList).to.include('vp-animate');
      expect(sgViewportStateAfter.style.width).to.equal('1024px');
      expect(sgSizeEmStateAfter.value).to.equal('64.00');
      expect(sgSizePxStateAfter.value).to.equal('1024');
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

      patternlabViewer.goLarge();

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
      expect(sgGenContainerStateBefore.classList).to.not.include('vp-animate');
      expect(sgGenContainerStateBefore.style.width).to.not.equal(sgGenContainerStateAfter.style.width);
      expect(sgViewportStateBefore.classList).to.not.include('vp-animate');
      expect(sgViewportStateBefore.style.width).to.not.equal(sgViewportStateAfter.style.width);
      expect(sgSizeEmStateBefore.value).to.not.equal(sgSizeEmStateAfter.value);
      expect(sgSizePxStateBefore.value).to.not.equal(sgSizePxStateAfter.value);
      expect(dataSaverVpWidthBefore).to.equal('');

      expect(documentStateAfter.activeOrganism).to.equal('#sg-size-lg');
      expect(discoModeAfter).to.be.false;
      expect(discoIdAfter).to.be.undefined;
      expect(growModeAfter).to.be.false;
      expect(growIdAfter).to.be.undefined;
      expect(sgGenContainerStateAfter.classList).to.include('vp-animate');
      expect(sgGenContainerStateAfter.style.width).to.equal('1294px');
      expect(sgViewportStateAfter.classList).to.include('vp-animate');
      expect(sgViewportStateAfter.style.width).to.equal('1280px');
      expect(sgSizeEmStateAfter.value).to.equal('80.00');
      expect(sgSizePxStateAfter.value).to.equal('1280');
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

      patternlabViewer.goWhole();

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
      expect(sgGenContainerStateBefore.classList).to.not.include('vp-animate');
      expect(sgGenContainerStateBefore.style.width).to.not.equal(sgGenContainerStateAfter.style.width);
      expect(sgViewportStateBefore.classList).to.not.include('vp-animate');
      expect(sgViewportStateBefore.style.width).to.not.equal(sgViewportStateAfter.style.width);
      expect(sgSizeEmStateBefore.value).to.not.equal(sgSizeEmStateAfter.value);
      expect(sgSizePxStateBefore.value).to.not.equal(sgSizePxStateAfter.value);
      expect(dataSaverVpWidthBefore).to.equal('');

      expect(documentStateAfter.activeOrganism).to.equal('#sg-size-w');
      expect(discoModeAfter).to.be.false;
      expect(discoIdAfter).to.be.undefined;
      expect(growModeAfter).to.be.false;
      expect(growIdAfter).to.be.undefined;
      expect(sgGenContainerStateAfter.classList).to.include('vp-animate');
      expect(sgGenContainerStateAfter.style.width).to.equal('1038px');
      expect(sgViewportStateAfter.classList).to.include('vp-animate');
      expect(sgViewportStateAfter.style.width).to.equal('1024px');
      expect(sgSizeEmStateAfter.value).to.equal('64.00');
      expect(sgSizePxStateAfter.value).to.equal('1024');
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

      patternlabViewer.goRandom();

      const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();
      const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthBefore = fepperUi.dataSaver.findValue('vpWidth');

      patternlabViewer.goRandom();

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
      expect(sgGenContainerStateBefore.classList).to.not.include('vp-animate');
      expect(sgViewportStateBefore.classList).to.not.include('vp-animate');

      expect(documentStateAfter.activeOrganism).to.equal('#sg-size-random');
      expect(discoModeAfter).to.be.false;
      expect(discoIdAfter).to.be.undefined;
      expect(growModeAfter).to.be.false;
      expect(growIdAfter).to.be.undefined;
      expect(sgGenContainerStateAfter.classList).to.include('vp-animate');
      expect(sgViewportStateAfter.classList).to.include('vp-animate');

      // Compare before and after to test randomness.
      expect(sgGenContainerStateBefore.style.width).to.not.equal(sgGenContainerStateAfter.style.width);
      expect(sgViewportStateBefore.style.width).to.not.equal(sgViewportStateAfter.style.width);
      expect(sgSizeEmStateBefore.value).to.not.equal(sgSizeEmStateAfter.value);
      expect(sgSizePxStateBefore.value).to.not.equal(sgSizePxStateAfter.value);
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

      patternlabViewer.receiveIframeMessage(event);

      const sgNavTargetStateAfter = $orgs['#sg-nav-target'].getState();
      const sgAccHandleStateAfter = $orgs['.sg-acc-handle'].getState();
      const sgAccPanelStateAfter = $orgs['.sg-acc-panel'].getState();

      expect(sgNavTargetStateBefore.classList).to.include('active');
      expect(sgAccHandleStateBefore.classList).to.include('active');
      expect(sgAccPanelStateBefore.classList).to.include('active');

      expect(sgNavTargetStateAfter.classList).to.not.include('active');
      expect(sgAccHandleStateAfter.classList).to.not.include('active');
      expect(sgAccPanelStateAfter.classList).to.not.include('active');
    });

    it('runs .goXXSmall() on patternlab.keyPress "ctrl+alt+0"', function () {
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

      patternlabViewer.receiveIframeMessage(event);

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
      expect(sgGenContainerStateBefore.classList).to.not.include('vp-animate');
      expect(sgGenContainerStateBefore.style.width).to.not.equal(sgGenContainerStateAfter.style.width);
      expect(sgViewportStateBefore.classList).to.not.include('vp-animate');
      expect(sgViewportStateBefore.style.width).to.not.equal(sgViewportStateAfter.style.width);
      expect(sgSizeEmStateBefore.value).to.not.equal(sgSizeEmStateAfter.value);
      expect(sgSizePxStateBefore.value).to.not.equal(sgSizePxStateAfter.value);
      expect(dataSaverVpWidthBefore).to.equal('');

      expect(documentStateAfter.activeOrganism).to.equal('#sg-size-xx');
      expect(discoModeAfter).to.be.false;
      expect(discoIdAfter).to.be.undefined;
      expect(growModeAfter).to.be.false;
      expect(growIdAfter).to.be.undefined;
      expect(sgGenContainerStateAfter.classList).to.include('vp-animate');
      expect(sgGenContainerStateAfter.style.width).to.equal('334px');
      expect(sgViewportStateAfter.classList).to.include('vp-animate');
      expect(sgViewportStateAfter.style.width).to.equal('320px');
      expect(sgSizeEmStateAfter.value).to.equal('20.00');
      expect(sgSizePxStateAfter.value).to.equal('320');
      expect(dataSaverVpWidthAfter).to.equal('320');
    });

    it('runs .goXSmall() on patternlab.keyPress "ctrl+shift+x"', function () {
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

      patternlabViewer.receiveIframeMessage(event);

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
      expect(sgGenContainerStateBefore.classList).to.not.include('vp-animate');
      expect(sgGenContainerStateBefore.style.width).to.not.equal(sgGenContainerStateAfter.style.width);
      expect(sgViewportStateBefore.classList).to.not.include('vp-animate');
      expect(sgViewportStateBefore.style.width).to.not.equal(sgViewportStateAfter.style.width);
      expect(sgSizeEmStateBefore.value).to.not.equal(sgSizeEmStateAfter.value);
      expect(sgSizePxStateBefore.value).to.not.equal(sgSizePxStateAfter.value);
      expect(dataSaverVpWidthBefore).to.equal('');

      expect(documentStateAfter.activeOrganism).to.equal('#sg-size-xs');
      expect(discoModeAfter).to.be.false;
      expect(discoIdAfter).to.be.undefined;
      expect(growModeAfter).to.be.false;
      expect(growIdAfter).to.be.undefined;
      expect(sgGenContainerStateAfter.classList).to.include('vp-animate');
      expect(sgGenContainerStateAfter.style.width).to.equal('494px');
      expect(sgViewportStateAfter.classList).to.include('vp-animate');
      expect(sgViewportStateAfter.style.width).to.equal('480px');
      expect(sgSizeEmStateAfter.value).to.equal('30.00');
      expect(sgSizePxStateAfter.value).to.equal('480');
      expect(dataSaverVpWidthAfter).to.equal('480');
    });

    it('runs .goXXSmall() on patternlab.keyPress "ctrl+shift+0"', function () {
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

      patternlabViewer.receiveIframeMessage(event);

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
      expect(sgGenContainerStateBefore.classList).to.not.include('vp-animate');
      expect(sgGenContainerStateBefore.style.width).to.not.equal(sgGenContainerStateAfter.style.width);
      expect(sgViewportStateBefore.classList).to.not.include('vp-animate');
      expect(sgViewportStateBefore.style.width).to.not.equal(sgViewportStateAfter.style.width);
      expect(sgSizeEmStateBefore.value).to.not.equal(sgSizeEmStateAfter.value);
      expect(sgSizePxStateBefore.value).to.not.equal(sgSizePxStateAfter.value);
      expect(dataSaverVpWidthBefore).to.equal('');

      expect(documentStateAfter.activeOrganism).to.equal('#sg-size-xx');
      expect(discoModeAfter).to.be.false;
      expect(discoIdAfter).to.be.undefined;
      expect(growModeAfter).to.be.false;
      expect(growIdAfter).to.be.undefined;
      expect(sgGenContainerStateAfter.classList).to.include('vp-animate');
      expect(sgGenContainerStateAfter.style.width).to.equal('334px');
      expect(sgViewportStateAfter.classList).to.include('vp-animate');
      expect(sgViewportStateAfter.style.width).to.equal('320px');
      expect(sgSizeEmStateAfter.value).to.equal('20.00');
      expect(sgSizePxStateAfter.value).to.equal('320');
      expect(dataSaverVpWidthAfter).to.equal('320');
    });

    it('runs .goSmall() on patternlab.keyPress "ctrl+shift+s"', function () {
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

      patternlabViewer.receiveIframeMessage(event);

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
      expect(sgGenContainerStateBefore.classList).to.not.include('vp-animate');
      expect(sgGenContainerStateBefore.style.width).to.not.equal(sgGenContainerStateAfter.style.width);
      expect(sgViewportStateBefore.classList).to.not.include('vp-animate');
      expect(sgViewportStateBefore.style.width).to.not.equal(sgViewportStateAfter.style.width);
      expect(sgSizeEmStateBefore.value).to.not.equal(sgSizeEmStateAfter.value);
      expect(sgSizePxStateBefore.value).to.not.equal(sgSizePxStateAfter.value);
      expect(dataSaverVpWidthBefore).to.equal('');

      expect(documentStateAfter.activeOrganism).to.equal('#sg-size-sm');
      expect(discoModeAfter).to.be.false;
      expect(discoIdAfter).to.be.undefined;
      expect(growModeAfter).to.be.false;
      expect(growIdAfter).to.be.undefined;
      expect(sgGenContainerStateAfter.classList).to.include('vp-animate');
      expect(sgGenContainerStateAfter.style.width).to.equal('781px');
      expect(sgViewportStateAfter.classList).to.include('vp-animate');
      expect(sgViewportStateAfter.style.width).to.equal('767px');
      expect(sgSizeEmStateAfter.value).to.equal('47.94');
      expect(sgSizePxStateAfter.value).to.equal('767');
      expect(dataSaverVpWidthAfter).to.equal('767');
    });

    it('runs .goMedium() on patternlab.keyPress "ctrl+shift+m"', function () {
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

      patternlabViewer.receiveIframeMessage(event);

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
      expect(sgGenContainerStateBefore.classList).to.not.include('vp-animate');
      expect(sgGenContainerStateBefore.style.width).to.not.equal(sgGenContainerStateAfter.style.width);
      expect(sgViewportStateBefore.classList).to.not.include('vp-animate');
      expect(sgViewportStateBefore.style.width).to.not.equal(sgViewportStateAfter.style.width);
      expect(sgSizeEmStateBefore.value).to.not.equal(sgSizeEmStateAfter.value);
      expect(sgSizePxStateBefore.value).to.not.equal(sgSizePxStateAfter.value);
      expect(dataSaverVpWidthBefore).to.equal('');

      expect(documentStateAfter.activeOrganism).to.equal('#sg-size-md');
      expect(discoModeAfter).to.be.false;
      expect(discoIdAfter).to.be.undefined;
      expect(growModeAfter).to.be.false;
      expect(growIdAfter).to.be.undefined;
      expect(sgGenContainerStateAfter.classList).to.include('vp-animate');
      expect(sgGenContainerStateAfter.style.width).to.equal('1038px');
      expect(sgViewportStateAfter.classList).to.include('vp-animate');
      expect(sgViewportStateAfter.style.width).to.equal('1024px');
      expect(sgSizeEmStateAfter.value).to.equal('64.00');
      expect(sgSizePxStateAfter.value).to.equal('1024');
      expect(dataSaverVpWidthAfter).to.equal('1024');
    });

    it('runs .goLarge() on patternlab.keyPress "ctrl+alt+l"', function () {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+alt+l'
      };

      fepperUi.dataSaver.removeValue('vpWidth');
      $orgs['#sg-gen-container'].dispatchAction('removeClass', 'vp-animate');
      $orgs['#sg-viewport'].dispatchAction('removeClass', 'vp-animate');

      const sgViewportStateBefore = $orgs['#sg-viewport'].getState();
      const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();
      const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthBefore = fepperUi.dataSaver.findValue('vpWidth');

      patternlabViewer.receiveIframeMessage(event);

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

      expect(sgViewportStateBefore.classList).to.not.include('vp-animate');
      expect(sgViewportStateBefore.style.width).to.not.equal(sgViewportStateAfter.style.width);
      expect(sgSizeEmStateBefore.value).to.not.equal(sgSizeEmStateAfter.value);
      expect(sgSizePxStateBefore.value).to.not.equal(sgSizePxStateAfter.value);
      expect(dataSaverVpWidthBefore).to.equal('');

      expect(documentStateAfter.activeOrganism).to.equal('#sg-size-lg');
      expect(discoModeAfter).to.be.false;
      expect(discoIdAfter).to.be.undefined;
      expect(growModeAfter).to.be.false;
      expect(growIdAfter).to.be.undefined;
      expect(sgGenContainerStateAfter.classList).to.include('vp-animate');
      expect(sgGenContainerStateAfter.style.width).to.equal('1294px');
      expect(sgViewportStateAfter.classList).to.include('vp-animate');
      expect(sgViewportStateAfter.style.width).to.equal('1280px');
      expect(sgSizeEmStateAfter.value).to.equal('80.00');
      expect(sgSizePxStateAfter.value).to.equal('1280');
      expect(dataSaverVpWidthAfter).to.equal('1280');
    });

    it('runs .goWhole() on patternlab.keyPress "ctrl+alt+w"', function () {
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

      patternlabViewer.receiveIframeMessage(event);

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
      expect(sgGenContainerStateBefore.classList).to.not.include('vp-animate');
      expect(sgGenContainerStateBefore.style.width).to.not.equal(sgGenContainerStateAfter.style.width);
      expect(sgViewportStateBefore.classList).to.not.include('vp-animate');
      expect(sgViewportStateBefore.style.width).to.not.equal(sgViewportStateAfter.style.width);
      expect(sgSizeEmStateBefore.value).to.not.equal(sgSizeEmStateAfter.value);
      expect(sgSizePxStateBefore.value).to.not.equal(sgSizePxStateAfter.value);
      expect(dataSaverVpWidthBefore).to.equal('');

      expect(documentStateAfter.activeOrganism).to.equal('#sg-size-w');
      expect(discoModeAfter).to.be.false;
      expect(discoIdAfter).to.be.undefined;
      expect(growModeAfter).to.be.false;
      expect(growIdAfter).to.be.undefined;
      expect(sgGenContainerStateAfter.classList).to.include('vp-animate');
      expect(sgGenContainerStateAfter.style.width).to.equal('1038px');
      expect(sgViewportStateAfter.classList).to.include('vp-animate');
      expect(sgViewportStateAfter.style.width).to.equal('1024px');
      expect(sgSizeEmStateAfter.value).to.equal('64.00');
      expect(sgSizePxStateAfter.value).to.equal('1024');
      expect(dataSaverVpWidthAfter).to.equal('1024');
    });

    it('runs .goLarge() on patternlab.keyPress "ctrl+shift+l"', function () {
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

      patternlabViewer.receiveIframeMessage(event);

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

      expect(sgViewportStateBefore.classList).to.not.include('vp-animate');
      expect(sgViewportStateBefore.style.width).to.not.equal(sgViewportStateAfter.style.width);
      expect(sgSizeEmStateBefore.value).to.not.equal(sgSizeEmStateAfter.value);
      expect(sgSizePxStateBefore.value).to.not.equal(sgSizePxStateAfter.value);
      expect(dataSaverVpWidthBefore).to.equal('');

      expect(documentStateAfter.activeOrganism).to.equal('#sg-size-lg');
      expect(discoModeAfter).to.be.false;
      expect(discoIdAfter).to.be.undefined;
      expect(growModeAfter).to.be.false;
      expect(growIdAfter).to.be.undefined;
      expect(sgGenContainerStateAfter.classList).to.include('vp-animate');
      expect(sgGenContainerStateAfter.style.width).to.equal('1294px');
      expect(sgViewportStateAfter.classList).to.include('vp-animate');
      expect(sgViewportStateAfter.style.width).to.equal('1280px');
      expect(sgSizeEmStateAfter.value).to.equal('80.00');
      expect(sgSizePxStateAfter.value).to.equal('1280');
      expect(dataSaverVpWidthAfter).to.equal('1280');
    });

    it('runs .goWhole() on patternlab.keyPress "ctrl+shift+w"', function () {
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

      patternlabViewer.receiveIframeMessage(event);

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
      expect(sgGenContainerStateBefore.classList).to.not.include('vp-animate');
      expect(sgGenContainerStateBefore.style.width).to.not.equal(sgGenContainerStateAfter.style.width);
      expect(sgViewportStateBefore.classList).to.not.include('vp-animate');
      expect(sgViewportStateBefore.style.width).to.not.equal(sgViewportStateAfter.style.width);
      expect(sgSizeEmStateBefore.value).to.not.equal(sgSizeEmStateAfter.value);
      expect(sgSizePxStateBefore.value).to.not.equal(sgSizePxStateAfter.value);
      expect(dataSaverVpWidthBefore).to.equal('');

      expect(documentStateAfter.activeOrganism).to.equal('#sg-size-w');
      expect(discoModeAfter).to.be.false;
      expect(discoIdAfter).to.be.undefined;
      expect(growModeAfter).to.be.false;
      expect(growIdAfter).to.be.undefined;
      expect(sgGenContainerStateAfter.classList).to.include('vp-animate');
      expect(sgGenContainerStateAfter.style.width).to.equal('1038px');
      expect(sgViewportStateAfter.classList).to.include('vp-animate');
      expect(sgViewportStateAfter.style.width).to.equal('1024px');
      expect(sgSizeEmStateAfter.value).to.equal('64.00');
      expect(sgSizePxStateAfter.value).to.equal('1024');
      expect(dataSaverVpWidthAfter).to.equal('1024');
    });

    it('runs .goRandom() on patternlab.keyPress "ctrl+alt+r"', function () {
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

      patternlabViewer.receiveIframeMessage(event);

      const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();
      const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
      const dataSaverVpWidthBefore = fepperUi.dataSaver.findValue('vpWidth');

      patternlabViewer.receiveIframeMessage(event);

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
      expect(sgGenContainerStateBefore.classList).to.not.include('vp-animate');
      expect(sgViewportStateBefore.classList).to.not.include('vp-animate');

      expect(documentStateAfter.activeOrganism).to.equal('#sg-size-random');
      expect(discoModeAfter).to.be.false;
      expect(discoIdAfter).to.be.undefined;
      expect(growModeAfter).to.be.false;
      expect(growIdAfter).to.be.undefined;
      expect(sgGenContainerStateAfter.classList).to.include('vp-animate');
      expect(sgViewportStateAfter.classList).to.include('vp-animate');

      // Compare before and after to test randomness.
      expect(sgGenContainerStateBefore.style.width).to.not.equal(sgGenContainerStateAfter.style.width);
      expect(sgViewportStateBefore.style.width).to.not.equal(sgViewportStateAfter.style.width);
      expect(sgSizeEmStateBefore.value).to.not.equal(sgSizeEmStateAfter.value);
      expect(sgSizePxStateBefore.value).to.not.equal(sgSizePxStateAfter.value);
      expect(dataSaverVpWidthBefore).to.not.equal(dataSaverVpWidthAfter);
    });

    it('toggles on grow on patternlab.keyPress "ctrl+alt+g"', function (done) {
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

      patternlabViewer.receiveIframeMessage(event);

      setTimeout(() => {
        const documentStateAfter = $orgs.document.getState();
        const growModeAfter = fepperUi.uiProps.growMode;
        const growIdAfter = fepperUi.uiProps.growId;
        const sgGenContainerStateAfter = $orgs['#sg-gen-container'].getState();
        const sgViewportStateAfter = $orgs['#sg-viewport'].getState();

        expect(documentStateBefore.activeOrganism).to.not.equal('#sg-size-grow');
        expect(growModeBefore).to.be.false;
        expect(growIdBefore).to.not.be.ok;
        expect(sgGenContainerStateBefore.classList).to.include('vp-animate');
        expect(sgViewportStateBefore.classList).to.include('vp-animate');

        expect(documentStateAfter.activeOrganism).to.equal('#sg-size-grow');
        expect(growModeAfter).to.be.true;
        expect(growIdAfter).to.be.ok;
        expect(sgGenContainerStateAfter.classList).to.not.include('vp-animate');
        expect(sgViewportStateAfter.classList).to.not.include('vp-animate');

        uiFns.stopGrow();
        done();
      }, uiProps.timeoutDefault);
    });

    it('toggles off grow on patternlab.keyPress "ctrl+alt+g"', function (done) {
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

        patternlabViewer.receiveIframeMessage(event);

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

    it('toggles on disco on patternlab.keyPress "ctrl+shift+d"', function (done) {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+shift+d'
      };

      $orgs['#sg-size-disco'].dispatchAction('blur');

      const documentStateBefore = $orgs.document.getState();
      const discoModeBefore = fepperUi.uiProps.discoMode;
      const discoIdBefore = fepperUi.uiProps.discoId;

      patternlabViewer.receiveIframeMessage(event);

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

    it('toggles off disco on patternlab.keyPress "ctrl+shift+d"', function (done) {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+shift+d'
      };

      $orgs['#sg-size-disco'].dispatchAction('focus');
      patternlabViewer.receiveIframeMessage(event);

      setTimeout(() => {
        const documentStateBefore = $orgs.document.getState();
        const discoModeBefore = fepperUi.uiProps.discoMode;
        const discoIdBefore = fepperUi.uiProps.discoId;

        patternlabViewer.receiveIframeMessage(event);

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

      patternlabViewer.receiveIframeMessage(event);

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

      patternlabViewer.receiveIframeMessage(event);

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

        patternlabViewer.receiveIframeMessage(event);

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

      patternlabViewer.receiveIframeMessage(event);

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
