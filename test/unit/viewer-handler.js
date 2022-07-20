import {expect} from 'chai';

describe('viewerHandler', function () {
  const timeout = 10;

  let annotationsViewer;
  let codeViewer;
  let fepperUi;
  let uiFns;
  let uiProps;
  let viewerHandler;
  let $orgs;

  before(function () {
    const $organisms = require('../../scripts/requerio/organisms').default;

    fepperUi = require('../unit')($organisms);
    annotationsViewer = fepperUi.annotationsViewer;
    codeViewer = fepperUi.codeViewer;
    uiFns = fepperUi.uiFns;
    uiProps = fepperUi.uiProps;
    viewerHandler = fepperUi.viewerHandler;
    $orgs = fepperUi.requerio.$orgs;
  });

  after(function () {
    require('../require-cache-bust')();
  });

  describe('.constructor()', function () {
    it('instantiates correctly', function () {
      expect(viewerHandler.constructor.name).to.equal('ViewerHandler');
      expect(Object.keys(viewerHandler).length).to.equal(2);
      expect(viewerHandler).to.have.property('$orgs');
      expect(viewerHandler).to.have.property('transitionDuration');
    });
  });

  describe('.stoke()', function () {
    it('defaults to dockPosition bottom', function () {
      viewerHandler.stoke();

      expect(uiProps.dockPosition).to.equal('bottom');
    });

    it('retains dockPosition right after the viewer has been docked thusly', function (done) {
      viewerHandler.dockRight();
      viewerHandler.stoke();

      setTimeout(() => {
        expect(uiProps.dockPosition).to.equal('right');
        done();
      }, timeout);
    });

    it('retains dockPosition bottom after the viewer has been docked thusly', function (done) {
      viewerHandler.dockBottom();
      viewerHandler.stoke();

      setTimeout(() => {
        expect(uiProps.dockPosition).to.equal('bottom');
        done();
      }, timeout);
    });

    it('retains dockPosition left after the viewer has been docked thusly', function (done) {
      viewerHandler.dockLeft();
      viewerHandler.stoke();

      setTimeout(() => {
        expect(uiProps.dockPosition).to.equal('left');
        done();
      }, timeout);
    });

    it('docks the viewer to the bottom if the viewport is small', function () {
      viewerHandler.dockLeft();

      const dockPositionBefore = uiProps.dockPosition;
      const swBefore = uiProps.sw;
      window.outerWidth = window.innerWidth = 512;

      viewerHandler.stoke();

      const dockPositionAfter = uiProps.dockPosition;
      const swAfter = uiProps.sw;

      expect(dockPositionBefore).to.not.equal(dockPositionAfter);
      expect(swBefore).to.be.above(uiProps.bpSm);

      expect(dockPositionAfter).to.equal('bottom');
      expect(swAfter).to.be.at.most(uiProps.bpSm);

      $orgs.window.innerWidth(swBefore);
    });
  });

  // Running .openViewer() before other methods in order to set viewerHandler.transitionDuration.
  describe('.openViewer()', function () {
    beforeEach(function (done) {
      annotationsViewer.annotationsActive = false;
      codeViewer.codeActive = false;

      viewerHandler.closeViewer();

      setTimeout(() => {
        done();
      }, timeout);
    });

    it('does not open viewer if both annotations and Code Viewers are inactive', function (done) {
      const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

      viewerHandler.openViewer();

      setTimeout(() => {
        const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
        const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

        expect(annotationsViewer.annotationsActive).to.be.false;
        expect(codeViewer.codeActive).to.be.false;

        expect(patternlabBodyBefore.classArray).to.not.include('dock-open');
        expect(sgViewContainerBefore.classArray).to.not.include('anim-ready');

        expect(patternlabBodyAfter.classArray).to.not.include('dock-open');
        expect(sgViewContainerAfter.classArray).to.not.include('anim-ready');

        done();
      }, timeout);
    });

    it('opens viewer if Annotations Viewer is active', function (done) {
      const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();
      annotationsViewer.annotationsActive = true;

      viewerHandler.openViewer();

      setTimeout(() => {
        const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
        const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

        expect(annotationsViewer.annotationsActive).to.be.true;
        expect(codeViewer.codeActive).to.be.false;

        expect(patternlabBodyBefore.classArray).to.not.include('dock-open');
        expect(sgViewContainerBefore.classArray).to.not.include('anim-ready');

        expect(patternlabBodyAfter.classArray).to.include('dock-open');
        expect(sgViewContainerAfter.classArray).to.include('anim-ready');

        done();
      }, timeout);
    });

    it('opens viewer if Code Viewer is active', function (done) {
      const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();
      codeViewer.codeActive = true;

      viewerHandler.openViewer();

      setTimeout(() => {
        const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
        const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

        expect(annotationsViewer.annotationsActive).to.be.false;
        expect(codeViewer.codeActive).to.be.true;

        expect(patternlabBodyBefore.classArray).to.not.include('dock-open');
        expect(sgViewContainerBefore.classArray).to.not.include('anim-ready');

        expect(patternlabBodyAfter.classArray).to.include('dock-open');
        expect(sgViewContainerAfter.classArray).to.include('anim-ready');

        done();
      }, timeout);
    });
  });

  describe('.closeViewer()', function () {
    beforeEach(function (done) {
      annotationsViewer.annotationsActive = true;
      codeViewer.codeActive = true;

      viewerHandler.openViewer();

      setTimeout(() => {
        done();
      }, timeout);
    });

    it('does not close viewer if Annotations Viewer is active', function (done) {
      const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

      annotationsViewer.annotationsActive = true;
      codeViewer.codeActive = false;

      viewerHandler.closeViewer();

      setTimeout(() => {
        const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
        const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

        expect(annotationsViewer.annotationsActive).to.be.true;
        expect(codeViewer.codeActive).to.be.false;

        expect(patternlabBodyBefore.classArray).to.include('dock-open');
        expect(sgViewContainerBefore.classArray).to.include('anim-ready');

        expect(patternlabBodyAfter.classArray).to.include('dock-open');
        expect(sgViewContainerAfter.classArray).to.include('anim-ready');

        done();
      }, timeout);
    });

    it('does not close viewer if Annotations Viewer is active', function (done) {
      const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

      annotationsViewer.annotationsActive = false;
      codeViewer.codeActive = true;

      viewerHandler.closeViewer();

      setTimeout(() => {
        const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
        const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

        expect(annotationsViewer.annotationsActive).to.be.false;
        expect(codeViewer.codeActive).to.be.true;

        expect(patternlabBodyBefore.classArray).to.include('dock-open');
        expect(sgViewContainerBefore.classArray).to.include('anim-ready');

        expect(patternlabBodyAfter.classArray).to.include('dock-open');
        expect(sgViewContainerAfter.classArray).to.include('anim-ready');

        done();
      }, timeout);
    });

    it('closes viewer if both code and Annotations Viewer are inactive', function (done) {
      const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

      annotationsViewer.annotationsActive = false;
      codeViewer.codeActive = false;

      viewerHandler.closeViewer();

      setTimeout(() => {
        const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
        const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

        expect(annotationsViewer.annotationsActive).to.be.false;
        expect(codeViewer.codeActive).to.be.false;

        expect(patternlabBodyBefore.classArray).to.include('dock-open');
        expect(sgViewContainerBefore.classArray).to.include('anim-ready');

        expect(patternlabBodyAfter.classArray).to.not.include('dock-open');
        expect(sgViewContainerAfter.classArray).to.not.include('anim-ready');

        done();
      }, timeout);
    });
  });

  describe('dock methods', function () {
    // Test .dockLeft(), .dockBottom(), and .dockRight() in that order in order to test sizing of the viewport,
    // i.e. shrink for .dockLeft(), expand for .dockBottom(), shrink for .dockRight().
    it('.dockLeft() docks the codeViewer to the left of the browser', function (done) {
      viewerHandler.dockBottom();

      const dockPositionBefore = uiProps.dockPosition;
      codeViewer.codeActive = true;

      uiFns.sizeIframe(1024);
      window.outerWidth = window.innerWidth = 1024;
      // Dispatching addClass instead of calling viewerHandler.openViewer()
      // because viewerHandler.openViewer() uses setTimeout().
      $orgs['#patternlab-body'].dispatchAction('addClass', 'dock-open');

      const halfModeBefore = uiProps.halfMode;
      const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
      const vpWidthBefore = uiProps.vpWidth;

      viewerHandler.dockLeft();

      setTimeout(() => {
        const dockPositionAfter = uiProps.dockPosition;
        const halfModeAfter = uiProps.halfMode;
        const vpWidthAfter = uiProps.vpWidth;
        const patternlabBodyAfter = $orgs['#patternlab-body'].getState();

        expect(dockPositionBefore).to.equal('bottom');
        expect(halfModeBefore).to.be.undefined;
        expect(patternlabBodyBefore.classArray).to.include('dock-bottom');
        expect(vpWidthBefore).to.equal(1024);

        expect(dockPositionAfter).to.equal('left');
        expect(halfModeAfter).to.be.true;
        expect(patternlabBodyAfter.classArray).to.not.include('dock-bottom');
        expect(patternlabBodyAfter.classArray).to.include('dock-left');
        expect(patternlabBodyAfter.classArray).to.include('dock-open');
        expect(vpWidthAfter).to.equal(498);

        done();
      }, timeout);
    });

    it('.dockBottom() docks the codeViewer to the bottom of the browser', function (done) {
      const dockPositionBefore = uiProps.dockPosition;
      const halfModeBefore = uiProps.halfMode;
      const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
      codeViewer.codeActive = true;

      uiFns.sizeIframe(1024);
      // Dispatching addClass instead of calling viewerHandler.openViewer()
      // because viewerHandler.openViewer() uses setTimeout().
      $orgs['#patternlab-body'].dispatchAction('addClass', 'dock-open');

      const vpWidthBefore = uiProps.vpWidth;

      viewerHandler.dockBottom();

      setTimeout(() => {
        const dockPositionAfter = uiProps.dockPosition;
        const halfModeAfter = uiProps.halfMode;
        const vpWidthAfter = uiProps.vpWidth;
        const patternlabBodyAfter = $orgs['#patternlab-body'].getState();

        expect(dockPositionBefore).to.equal('left');
        expect(halfModeBefore).to.be.true;
        expect(patternlabBodyBefore.classArray).to.include('dock-left');
        expect(vpWidthBefore).to.equal(1024);

        expect(dockPositionAfter).to.equal('bottom');
        expect(halfModeAfter).to.be.false;
        expect(patternlabBodyAfter.classArray).to.not.include('dock-dwleftbottom');
        expect(patternlabBodyAfter.classArray).to.include('dock-bottom');
        expect(patternlabBodyAfter.classArray).to.include('dock-open');
        expect(vpWidthAfter).to.equal(1024);

        done();
      }, timeout);
    });

    it('.dockRight() docks the codeViewer to the right of the browser', function (done) {
      const dockPositionBefore = uiProps.dockPosition;
      codeViewer.codeActive = true;

      uiFns.sizeIframe(1024);
      // Dispatching addClass instead of calling viewerHandler.openViewer()
      // because viewerHandler.openViewer() uses setTimeout().
      $orgs['#patternlab-body'].dispatchAction('addClass', 'dock-open');

      const halfModeBefore = uiProps.halfMode;
      const vpWidthBefore = uiProps.vpWidth;
      const patternlabBodyBefore = $orgs['#patternlab-body'].getState();

      viewerHandler.dockRight();

      setTimeout(() => {
        const dockPositionAfter = uiProps.dockPosition;
        const halfModeAfter = uiProps.halfMode;
        const vpWidthAfter = uiProps.vpWidth;
        const patternlabBodyAfter = $orgs['#patternlab-body'].getState();

        expect(dockPositionBefore).to.equal('bottom');
        expect(halfModeBefore).to.be.undefined;
        expect(vpWidthBefore).to.equal(1024);
        expect(patternlabBodyBefore.classArray).to.include('dock-bottom');

        expect(dockPositionAfter).to.equal('right');
        expect(halfModeAfter).to.be.true;
        expect(vpWidthAfter).to.equal(498);
        expect(patternlabBodyAfter.classArray).to.not.include('dock-bottom');
        expect(patternlabBodyAfter.classArray).to.include('dock-right');
        expect(patternlabBodyAfter.classArray).to.include('dock-open');

        done();
      }, timeout);
    });
  });
});
