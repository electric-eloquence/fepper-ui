import {expect} from 'chai';

describe('annotationsViewer', function () {
  const timeout = 10;
  const annotations = [{
    el: 'p',
    title: 'Navigation',
    annotation: `<p>Navigation for responsive web experiences can be tricky. Large navigation menus 
are typical on desktop sites, but mobile screen sizes don&#39;t give us the luxury 
of space. We&#39;re dealing with this situation by creating a simple menu anchor 
that toggles the main navigation on small screens. Once the screen size is large 
enough to accommodate the nav, we show the main navigation links and hide the 
menu anchor.</p>
`,
    number: 1,
    state: true
  }];

  let annotationsViewer;
  let codeViewer;
  let fepperUi;
  let $orgs;

  before(function () {
    const $organisms = require('../../scripts/requerio/organisms').default;

    fepperUi = require('../unit')($organisms);
    annotationsViewer = fepperUi.annotationsViewer;
    codeViewer = fepperUi.codeViewer;
    $orgs = fepperUi.requerio.$orgs;
  });

  after(function () {
    require('../require-cache-bust')();
  });

  describe('.constructor()', function () {
    it('instantiates correctly', function () {
      expect(annotationsViewer.constructor.name).to.equal('AnnotationsViewer');
      expect(Object.keys(annotationsViewer).length).to.equal(4);
      expect(annotationsViewer).to.have.property('receiveIframeMessage');
      expect(annotationsViewer).to.have.property('annotationsActive');
      expect(annotationsViewer).to.have.property('moveToNumber');
      expect(annotationsViewer).to.have.property('$orgs');
    });
  });

  describe('.stoke()', function () {
    beforeEach(function (done) {
      annotationsViewer.moveToNumber = 0;

      annotationsViewer.closeAnnotations();

      setTimeout(() => {
        done();
      }, timeout);
    });

    it('opens annotations viewer with a "view=annotations" param', function (done) {
      global.location.search = '?view=annotations';

      const annotationsActiveBefore = annotationsViewer.annotationsActive;
      const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
      const sgTAnnotationsBefore = $orgs['#sg-t-annotations'].getState();
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

      annotationsViewer.stoke();

      setTimeout(() => {
        const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
        const sgTAnnotationsAfter = $orgs['#sg-t-annotations'].getState();
        const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

        expect(annotationsActiveBefore).to.be.false;
        expect(patternlabBodyBefore.classArray).to.not.include('dock-open');
        expect(sgTAnnotationsBefore.classArray).to.not.include('active');
        expect(sgViewContainerBefore.classArray).to.not.include('anim-ready');

        expect(annotationsViewer.annotationsActive).to.be.true;
        expect(annotationsViewer.moveToNumber).to.equal(0);
        expect(patternlabBodyAfter.classArray).to.include('dock-open');
        expect(sgTAnnotationsAfter.classArray).to.include('active');
        expect(sgViewContainerAfter.classArray).to.include('anim-ready');

        done();
      }, timeout);
    });

    it('opens code viewer with a "view=a" param', function (done) {
      global.location.search = '?view=a';

      const annotationsActiveBefore = annotationsViewer.annotationsActive;
      const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
      const sgTAnnotationsBefore = $orgs['#sg-t-annotations'].getState();
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

      annotationsViewer.stoke();

      setTimeout(() => {
        const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
        const sgTAnnotationsAfter = $orgs['#sg-t-annotations'].getState();
        const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

        expect(annotationsActiveBefore).to.be.false;
        expect(patternlabBodyBefore.classArray).to.not.include('dock-open');
        expect(sgTAnnotationsBefore.classArray).to.not.include('active');
        expect(sgViewContainerBefore.classArray).to.not.include('anim-ready');

        expect(annotationsViewer.annotationsActive).to.be.true;
        expect(annotationsViewer.moveToNumber).to.equal(0);
        expect(patternlabBodyAfter.classArray).to.include('dock-open');
        expect(sgTAnnotationsAfter.classArray).to.include('active');
        expect(sgViewContainerAfter.classArray).to.include('anim-ready');

        done();
      }, timeout);
    });

    it('sets .moveToNumber with a "view=annotations&number=" param', function (done) {
      global.location.search = '?view=annotations&number=2';

      const annotationsActiveBefore = annotationsViewer.annotationsActive;
      const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
      const sgTAnnotationsBefore = $orgs['#sg-t-annotations'].getState();
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

      annotationsViewer.stoke();

      setTimeout(() => {
        const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
        const sgTAnnotationsAfter = $orgs['#sg-t-annotations'].getState();
        const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

        expect(annotationsActiveBefore).to.be.false;
        expect(patternlabBodyBefore.classArray).to.not.include('dock-open');
        expect(sgTAnnotationsBefore.classArray).to.not.include('active');
        expect(sgViewContainerBefore.classArray).to.not.include('anim-ready');

        expect(annotationsViewer.annotationsActive).to.be.true;
        expect(annotationsViewer.moveToNumber).to.equal(2);
        expect(patternlabBodyAfter.classArray).to.include('dock-open');
        expect(sgTAnnotationsAfter.classArray).to.include('active');
        expect(sgViewContainerAfter.classArray).to.include('anim-ready');

        done();
      }, timeout);
    });
  });

  describe('.moveTo()', function () {
    it('sets .moveToNumber', function () {
      const moveToNumberBefore = annotationsViewer.moveToNumber;

      annotationsViewer.moveTo(3);

      const moveToNumberAfter = annotationsViewer.moveToNumber;

      expect(moveToNumberBefore).to.not.equal(moveToNumberAfter);
      expect(moveToNumberAfter).to.equal(3);
    });
  });

  describe('.toggleAnnotations()', function () {
    after(function (done) {
      annotationsViewer.closeAnnotations();

      setTimeout(() => {
        done();
      }, timeout);
    });

    it('toggles on - also tests .openAnnotations()', function (done) {
      annotationsViewer.closeAnnotations();
      $orgs['#sg-t-annotations'].dispatchAction('removeClass', 'active');

      setTimeout(() => {
        const annotationsActiveBefore = annotationsViewer.annotationsActive;
        const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
        const sgTAnnotationsBefore = $orgs['#sg-t-annotations'].getState();
        const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

        annotationsViewer.toggleAnnotations();

        setTimeout(() => {
          const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
          const sgTAnnotationsAfter = $orgs['#sg-t-annotations'].getState();
          const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

          expect(annotationsActiveBefore).to.be.false;
          expect(patternlabBodyBefore.classArray).to.not.include('dock-open');
          expect(sgTAnnotationsBefore.classArray).to.not.include('active');
          expect(sgViewContainerBefore.classArray).to.not.include('anim-ready');

          expect(annotationsViewer.annotationsActive).to.be.true;
          expect(patternlabBodyAfter.classArray).to.include('dock-open');
          expect(sgTAnnotationsAfter.classArray).to.include('active');
          expect(sgViewContainerAfter.classArray).to.include('anim-ready');

          done();
        }, timeout);
      }, timeout);
    });

    it('toggles off - also tests .closeAnnotations()', function (done) {
      const annotationsActiveBefore = annotationsViewer.annotationsActive;
      const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
      const sgTAnnotationsBefore = $orgs['#sg-t-annotations'].getState();
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

      annotationsViewer.toggleAnnotations();

      setTimeout(() => {
        const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
        const sgTAnnotationsAfter = $orgs['#sg-t-annotations'].getState();
        const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

        expect(annotationsActiveBefore).to.be.true;
        expect(patternlabBodyBefore.classArray).to.include('dock-open');
        expect(sgTAnnotationsBefore.classArray).to.include('active');
        expect(sgViewContainerBefore.classArray).to.include('anim-ready');

        expect(annotationsViewer.annotationsActive).to.be.false;
        expect(patternlabBodyAfter.classArray).to.not.include('dock-open');
        expect(sgTAnnotationsAfter.classArray).to.not.include('active');
        expect(sgViewContainerAfter.classArray).to.not.include('anim-ready');

        done();
      }, timeout);
    });

    it('switches from code viewer to annotations viewer', function (done) {
      codeViewer.openCode();
      $orgs['#sg-t-annotations'].dispatchAction('removeClass', 'active');

      setTimeout(() => {
        const annotationsActiveBefore = annotationsViewer.annotationsActive;
        const codeActiveBefore = codeViewer.codeActive;
        const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
        const sgAnnotationsContainerBefore = $orgs['#sg-annotations-container'].getState();
        const sgCodeContainerBefore = $orgs['#sg-code-container'].getState();
        const sgTAnnotationsBefore = $orgs['#sg-t-annotations'].getState();
        const sgTCodeBefore = $orgs['#sg-t-code'].getState();
        const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

        annotationsViewer.toggleAnnotations();

        setTimeout(() => {
          const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
          const sgAnnotationsContainerAfter = $orgs['#sg-annotations-container'].getState();
          const sgCodeContainerAfter = $orgs['#sg-code-container'].getState();
          const sgTAnnotationsAfter = $orgs['#sg-t-annotations'].getState();
          const sgTCodeAfter = $orgs['#sg-t-code'].getState();
          const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

          expect(annotationsActiveBefore).to.be.false;
          expect(codeActiveBefore).to.be.true;
          expect(patternlabBodyBefore.classArray).to.include('dock-open');
          expect(sgAnnotationsContainerBefore.classArray).to.not.include('active');
          expect(sgCodeContainerBefore.classArray).to.include('active');
          expect(sgTAnnotationsBefore.classArray).to.not.include('active');
          expect(sgTCodeBefore.classArray).to.include('active');
          expect(sgViewContainerBefore.classArray).to.include('anim-ready');

          expect(annotationsViewer.annotationsActive).to.be.true;
          expect(codeViewer.codeActive).to.be.false;
          expect(patternlabBodyAfter.classArray).to.include('dock-open');
          expect(sgAnnotationsContainerAfter.classArray).to.include('active');
          expect(sgCodeContainerAfter.classArray).to.not.include('active');
          expect(sgTAnnotationsAfter.classArray).to.include('active');
          expect(sgTCodeAfter.classArray).to.not.include('active');
          expect(sgViewContainerAfter.classArray).to.include('anim-ready');

          done();
        }, timeout);
      }, timeout);
    });
  });

  describe('.updateAnnotations()', function () {
    beforeEach(function () {
      $orgs['#sg-annotations-container'].dispatchAction('attr', {'data-pattern-partial': null});
    });

    it('displays "No Annotations" for no annotations', function () {
      const sgAnnotationsNaBefore = $orgs['#sg-annotations-na'].getState();
      const sgAnnotationsBefore = $orgs['#sg-annotations'].getState();

      annotationsViewer.updateAnnotations([]);

      const sgAnnotationsNaAfter = $orgs['#sg-annotations-na'].getState();
      const sgAnnotationsAfter = $orgs['#sg-annotations'].getState();

      expect(sgAnnotationsNaBefore.css).to.not.have.key('display');
      expect(sgAnnotationsBefore.css).to.not.have.key('display');

      expect(sgAnnotationsNaAfter.css.display).to.equal('block');
      expect(sgAnnotationsAfter.css.display).to.equal('none');
    });

    it('fills HTML for one or more annotations', function () {
      const sgAnnotationsBefore = $orgs['#sg-annotations'].getState();

      annotationsViewer.updateAnnotations(annotations);

      const sgAnnotationsAfter = $orgs['#sg-annotations'].getState();

      expect(sgAnnotationsBefore.html).to.be.null;

      expect(sgAnnotationsAfter.html).to.equal(`<div id="annotation-1" class="sg-annotation">
<h2>1. Navigation</h2>
<div><p>Navigation for responsive web experiences can be tricky. Large navigation menus 
are typical on desktop sites, but mobile screen sizes don't give us the luxury 
of space. We're dealing with this situation by creating a simple menu anchor 
that toggles the main navigation on small screens. Once the screen size is large 
enough to accommodate the nav, we show the main navigation links and hide the 
menu anchor.</p>
</div>
</div>`);
    });

    it('unsets .moveToNumber after moving to number', function () {
      const moveToNumberBefore = annotationsViewer.moveToNumber = 1;
      annotationsViewer.annotationsActive = true;

      annotationsViewer.updateAnnotations(annotations, 'compounds-block');

      const moveToNumberAfter = annotationsViewer.moveToNumber;

      expect(moveToNumberBefore).to.equal(1);
      expect(moveToNumberAfter).to.equal(0);
    });
  });

  describe('.receiveIframeMessage()', function () {
    let event;

    before(function () {
      event = {
        origin: 'http://localhost:3000'
      };
    });

    it('updates annotations on data.annotationsUpdate = true', function () {
      event.data = {
        annotationsUpdate: true,
        annotations,
        patternPartial: 'compounds-block',
        viewall: false
      };

      $orgs['#sg-annotations'].dispatchAction('html', '');

      const sgAnnotationsBefore = $orgs['#sg-annotations'].getState();

      annotationsViewer.receiveIframeMessage(event);

      const sgAnnotationsAfter = $orgs['#sg-annotations'].getState();

      expect(sgAnnotationsBefore.html).to.equal('');

      expect(sgAnnotationsAfter.html).to.equal(`<div id="annotation-1" class="sg-annotation">
<h2>1. Navigation</h2>
<div><p>Navigation for responsive web experiences can be tricky. Large navigation menus 
are typical on desktop sites, but mobile screen sizes don't give us the luxury 
of space. We're dealing with this situation by creating a simple menu anchor 
that toggles the main navigation on small screens. Once the screen size is large 
enough to accommodate the nav, we show the main navigation links and hide the 
menu anchor.</p>
</div>
</div>`);
    });

    it('denotes that an annotated element is hidden on data.annotationsUpdate = true', function () {
      const annotationsClone = annotations.slice();
      event.data = {
        annotationsUpdate: true,
        annotations: annotationsClone.concat({
          el: '#foo',
          title: 'Foo',
          annotation: '<p>Foo.</p>',
          number: 2,
          state: false
        }),
        patternPartial: 'compounds-block',
        viewall: false
      };

      $orgs['#sg-annotations-container'].dispatchAction('attr', {'data-pattern-partial': null});
      $orgs['#sg-annotations'].dispatchAction('html', '');

      const sgAnnotationsBefore = $orgs['#sg-annotations'].getState();

      annotationsViewer.receiveIframeMessage(event);

      const sgAnnotationsAfter = $orgs['#sg-annotations'].getState();

      expect(sgAnnotationsBefore.html).to.equal('');

      expect(sgAnnotationsAfter.html).to.have.string(`<div id="annotation-2" class="sg-annotation">
<h2>2. Foo<span id="annotation-state-2" style="font-size: 0.8em;color: #666"> hidden</span></h2>
<div><p>Foo.</p></div>
</div>`);
    });

    it('sets .moveToNumber when data.annotationNumber is set', function () {
      event.data = {
        annotationNumber: 4
      };

      const moveToNumberBefore = annotationsViewer.moveToNumber;

      annotationsViewer.receiveIframeMessage(event);

      const moveToNumberAfter = annotationsViewer.moveToNumber;

      expect(moveToNumberBefore).to.not.equal(moveToNumberAfter);
      expect(moveToNumberAfter).to.equal(4);
    });

    it('opens annotations on data.annotationsViewallClick = "on"', function (done) {
      event.data = {
        annotationsViewallClick: 'on'
      };

      annotationsViewer.closeAnnotations();

      setTimeout(() => {
        const annotationsActiveBefore = annotationsViewer.annotationsActive;
        const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
        const sgTAnnotationsBefore = $orgs['#sg-t-annotations'].getState();
        const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

        annotationsViewer.receiveIframeMessage(event);

        setTimeout(() => {
          const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
          const sgTAnnotationsAfter = $orgs['#sg-t-annotations'].getState();
          const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

          expect(annotationsActiveBefore).to.be.false;
          expect(patternlabBodyBefore.classArray).to.not.include('dock-open');
          expect(sgTAnnotationsBefore.classArray).to.not.include('active');
          expect(sgViewContainerBefore.classArray).to.not.include('anim-ready');

          expect(annotationsViewer.annotationsActive).to.be.true;
          expect(patternlabBodyAfter.classArray).to.include('dock-open');
          expect(sgTAnnotationsAfter.classArray).to.include('active');
          expect(sgViewContainerAfter.classArray).to.include('anim-ready');

          done();
        }, timeout);
      }, timeout);
    });

    it('closes annotations on data.annotationsOverlay = "off"', function (done) {
      event.data = {
        annotationsViewallClick: 'off'
      };

      annotationsViewer.openAnnotations();

      setTimeout(() => {
        const annotationsActiveBefore = annotationsViewer.annotationsActive;
        const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
        const sgTAnnotationsBefore = $orgs['#sg-t-annotations'].getState();
        const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

        annotationsViewer.receiveIframeMessage(event);

        setTimeout(() => {
          const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
          const sgTAnnotationsAfter = $orgs['#sg-t-annotations'].getState();
          const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

          expect(annotationsActiveBefore).to.be.true;
          expect(patternlabBodyBefore.classArray).to.include('dock-open');
          expect(sgTAnnotationsBefore.classArray).to.include('active');
          expect(sgViewContainerBefore.classArray).to.include('anim-ready');

          expect(annotationsViewer.annotationsActive).to.be.false;
          expect(patternlabBodyAfter.classArray).to.not.include('dock-open');
          expect(sgTAnnotationsAfter.classArray).to.not.include('active');
          expect(sgViewContainerAfter.classArray).to.not.include('anim-ready');

          done();
        }, timeout);
      }, timeout);
    });

    it('toggles annotations on with patternlab.keyPress "ctrl+shift+a"', function (done) {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+shift+a'
      };
      const annotationsActiveBefore = annotationsViewer.annotationsActive;
      const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
      const sgTAnnotationsBefore = $orgs['#sg-t-annotations'].getState();
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

      annotationsViewer.receiveIframeMessage(event);

      setTimeout(() => {
        const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
        const sgTAnnotationsAfter = $orgs['#sg-t-annotations'].getState();
        const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

        expect(annotationsActiveBefore).to.be.false;
        expect(patternlabBodyBefore.classArray).to.not.include('dock-open');
        expect(sgTAnnotationsBefore.classArray).to.not.include('active');
        expect(sgViewContainerBefore.classArray).to.not.include('anim-ready');

        expect(annotationsViewer.annotationsActive).to.be.true;
        expect(patternlabBodyAfter.classArray).to.include('dock-open');
        expect(sgTAnnotationsAfter.classArray).to.include('active');
        expect(sgViewContainerAfter.classArray).to.include('anim-ready');

        done();
      }, timeout);
    });

    it('toggles annotations off with patternlab.keyPress "ctrl+shift+a"', function (done) {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+shift+a'
      };
      const annotationsActiveBefore = annotationsViewer.annotationsActive;
      const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
      const sgTAnnotationsBefore = $orgs['#sg-t-annotations'].getState();
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

      annotationsViewer.receiveIframeMessage(event);

      setTimeout(() => {
        const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
        const sgTAnnotationsAfter = $orgs['#sg-t-annotations'].getState();
        const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

        expect(annotationsActiveBefore).to.be.true;
        expect(patternlabBodyBefore.classArray).to.include('dock-open');
        expect(sgTAnnotationsBefore.classArray).to.include('active');
        expect(sgViewContainerBefore.classArray).to.include('anim-ready');

        expect(annotationsViewer.annotationsActive).to.be.false;
        expect(patternlabBodyAfter.classArray).to.not.include('dock-open');
        expect(sgTAnnotationsAfter.classArray).to.not.include('active');
        expect(sgViewContainerAfter.classArray).to.not.include('anim-ready');

        // Reopen annotations viewer in order to run the following test.
        annotationsViewer.openAnnotations();

        setTimeout(() => {
          done();
        }, timeout);
      }, timeout);
    });

    it('closes annotationsViewer with patternlab.keyPress "esc"', function (done) {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'esc'
      };
      const annotationsActiveBefore = annotationsViewer.annotationsActive;
      const patternlabBodyBefore = $orgs['#patternlab-body'].getState();
      const sgTAnnotationsBefore = $orgs['#sg-t-annotations'].getState();
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

      annotationsViewer.receiveIframeMessage(event);

      setTimeout(() => {
        const patternlabBodyAfter = $orgs['#patternlab-body'].getState();
        const sgTAnnotationsAfter = $orgs['#sg-t-annotations'].getState();
        const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

        expect(annotationsActiveBefore).to.be.true;
        expect(patternlabBodyBefore.classArray).to.include('dock-open');
        expect(sgTAnnotationsBefore.classArray).to.include('active');
        expect(sgViewContainerBefore.classArray).to.include('anim-ready');

        expect(annotationsViewer.annotationsActive).to.be.false;
        expect(patternlabBodyAfter.classArray).to.not.include('dock-open');
        expect(sgTAnnotationsAfter.classArray).to.not.include('active');
        expect(sgViewContainerAfter.classArray).to.not.include('anim-ready');

        done();
      }, timeout);
    });
  });
});
