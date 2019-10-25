import {expect} from 'chai';

import AnnotationsViewer from '../../scripts/classes/annotations-viewer';
import fepperUi from '../unit';

const $orgs = fepperUi.requerio.$orgs;
const annotationsViewer = fepperUi.annotationsViewer;
const codeViewer = fepperUi.codeViewer;

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

describe('annotationsViewer', function () {
  describe('.constructor()', function () {
    it('instantiates correctly', function () {
      expect(annotationsViewer).to.be.an.instanceof(AnnotationsViewer);
      expect(Object.keys(annotationsViewer).length).to.equal(5);
      expect(annotationsViewer).to.have.property('receiveIframeMessage');
      expect(annotationsViewer).to.have.property('$orgs');
      expect(annotationsViewer).to.have.property('uiFns');
      expect(annotationsViewer).to.have.property('uiProps');
      expect(annotationsViewer).to.have.property('codeViewer');
      expect(annotationsViewer).to.have.property('annotationsActive');
      expect(annotationsViewer).to.have.property('moveToNumber');
      expect(annotationsViewer).to.have.property('mustacheBrowser');
      expect(annotationsViewer).to.have.property('viewall');
    });
  });

  describe('.stoke()', function () {
    beforeEach(function () {
      annotationsViewer.moveToNumber = 0;

      $orgs['#sg-code-container'].dispatchAction('css', {bottom: 'auto'});
      $orgs['#sg-t-annotations'].dispatchAction('removeClass', 'active');
      $orgs['#sg-annotations-container'].dispatchAction('css', {bottom: 'auto'});
      $orgs['#sg-annotations-container'].dispatchAction('removeClass', 'anim-ready');
    });

    it('opens annotations viewer with a "view=annotations" param', function () {
      global.location = {
        search: '?view=annotations'
      };

      const sgCodeContainerStateBefore = $orgs['#sg-code-container'].getState();
      const sgTAnnotationsStateBefore = $orgs['#sg-t-annotations'].getState();
      const sgAnnotationsContainerStateBefore = $orgs['#sg-annotations-container'].getState();

      annotationsViewer.stoke();

      const sgCodeContainerStateAfter = $orgs['#sg-code-container'].getState();
      const sgTAnnotationsStateAfter = $orgs['#sg-t-annotations'].getState();
      const sgAnnotationsContainerStateAfter = $orgs['#sg-annotations-container'].getState();

      expect(sgCodeContainerStateBefore.style.bottom).to.not.equal(sgCodeContainerStateAfter.style.bottom);
      expect(sgTAnnotationsStateBefore.classList).to.not.include('active');
      expect(sgAnnotationsContainerStateBefore.style.bottom)
        .to.not.equal(sgAnnotationsContainerStateAfter.style.bottom);
      expect(sgAnnotationsContainerStateBefore.classList).to.not.include('anim-ready');

      expect(sgCodeContainerStateAfter.style.bottom).to.equal('-384px');
      expect(sgTAnnotationsStateAfter.classList).to.include('active');
      expect(sgAnnotationsContainerStateAfter.style.bottom).to.equal('0px');
      expect(sgAnnotationsContainerStateAfter.classList).to.include('anim-ready');
      expect(annotationsViewer.moveToNumber).to.equal(0);
    });

    it('opens code viewer with a "view=a" param', function () {
      global.location = {
        search: '?view=a'
      };

      const sgCodeContainerStateBefore = $orgs['#sg-code-container'].getState();
      const sgTAnnotationsStateBefore = $orgs['#sg-t-annotations'].getState();
      const sgAnnotationsContainerStateBefore = $orgs['#sg-annotations-container'].getState();

      annotationsViewer.stoke();

      const sgCodeContainerStateAfter = $orgs['#sg-code-container'].getState();
      const sgTAnnotationsStateAfter = $orgs['#sg-t-annotations'].getState();
      const sgAnnotationsContainerStateAfter = $orgs['#sg-annotations-container'].getState();

      expect(sgCodeContainerStateBefore.style.bottom).to.not.equal(sgCodeContainerStateAfter.style.bottom);
      expect(sgTAnnotationsStateBefore.classList).to.not.include('active');
      expect(sgAnnotationsContainerStateBefore.style.bottom)
        .to.not.equal(sgAnnotationsContainerStateAfter.style.bottom);
      expect(sgAnnotationsContainerStateBefore.classList).to.not.include('anim-ready');

      expect(sgCodeContainerStateAfter.style.bottom).to.equal('-384px');
      expect(sgTAnnotationsStateAfter.classList).to.include('active');
      expect(sgAnnotationsContainerStateAfter.style.bottom).to.equal('0px');
      expect(sgAnnotationsContainerStateAfter.classList).to.include('anim-ready');
      expect(annotationsViewer.moveToNumber).to.equal(0);
    });

    it('sets .moveToNumber with a "view=annotations&number=" param', function () {
      global.location = {
        search: '?view=annotations&number=2'
      };

      const sgCodeContainerStateBefore = $orgs['#sg-code-container'].getState();
      const sgTAnnotationsStateBefore = $orgs['#sg-t-annotations'].getState();
      const sgAnnotationsContainerStateBefore = $orgs['#sg-annotations-container'].getState();

      annotationsViewer.stoke();

      const sgCodeContainerStateAfter = $orgs['#sg-code-container'].getState();
      const sgTAnnotationsStateAfter = $orgs['#sg-t-annotations'].getState();
      const sgAnnotationsContainerStateAfter = $orgs['#sg-annotations-container'].getState();

      expect(sgCodeContainerStateBefore.style.bottom)
        .to.not.equal(sgCodeContainerStateAfter.style.bottom);
      expect(sgTAnnotationsStateBefore.classList).to.not.include('active');
      expect(sgAnnotationsContainerStateBefore.style.bottom)
        .to.not.equal(sgAnnotationsContainerStateAfter.style.bottom);
      expect(sgAnnotationsContainerStateBefore.classList).to.not.include('anim-ready');

      expect(sgCodeContainerStateAfter.style.bottom).to.equal('-384px');
      expect(sgTAnnotationsStateAfter.classList).to.include('active');
      expect(sgAnnotationsContainerStateAfter.style.bottom).to.equal('0px');
      expect(sgAnnotationsContainerStateAfter.classList).to.include('anim-ready');
      expect(annotationsViewer.moveToNumber).to.equal(2);
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

  describe('.scrollViewall()', function () {
  });

  describe('.slideAnnotations()', function () {
    before(function () {
      $orgs['#sg-annotations-container'].dispatchAction('css', {bottom: 'auto'});
    });

    after(function () {
      $orgs['#sg-annotations-container'].dispatchAction('css', {bottom: 'auto'});
    });

    it('slides up', function () {
      const sgAnnotationsContainerStateBefore = $orgs['#sg-annotations-container'].getState();

      annotationsViewer.slideAnnotations(768);

      const sgAnnotationsContainerStateAfter = $orgs['#sg-annotations-container'].getState();

      expect(sgAnnotationsContainerStateBefore.style.bottom)
        .to.not.equal(sgAnnotationsContainerStateAfter.style.bottom);

      expect(sgAnnotationsContainerStateAfter.style.bottom).to.equal('-768px');
    });

    it('slides up', function () {
      const sgAnnotationsContainerStateBefore = $orgs['#sg-annotations-container'].getState();

      annotationsViewer.slideAnnotations(0);

      const sgAnnotationsContainerStateAfter = $orgs['#sg-annotations-container'].getState();

      expect(sgAnnotationsContainerStateBefore.style.bottom)
        .to.not.equal(sgAnnotationsContainerStateAfter.style.bottom);

      expect(sgAnnotationsContainerStateAfter.style.bottom).to.equal('0px');
    });
  });

  describe('.toggleAnnotations()', function () {
    it('does nothing if .mustacheBrowser is true', function () {
      annotationsViewer.annotationsActive = false;
      annotationsViewer.mustacheBrowser = true;

      $orgs['#sg-t-annotations'].dispatchAction('removeClass', 'active');

      const sgTAnnotationsStateBefore = $orgs['#sg-t-annotations'].getState();

      annotationsViewer.toggleAnnotations();

      const sgTAnnotationsStateAfter = $orgs['#sg-t-annotations'].getState();

      expect(sgTAnnotationsStateBefore.classList).to.not.include('active');
      expect(sgTAnnotationsStateAfter.classList).to.not.include('active');
    });

    it('toggles on - also tests .openAnnotations()', function () {
      codeViewer.codeActive = true;
      annotationsViewer.mustacheBrowser = false;

      $orgs['#sg-t-code'].dispatchAction('addClass', 'active');
      $orgs['#sg-code-container'].dispatchAction('css', {bottom: 'auto'});
      $orgs['#sg-t-annotations'].dispatchAction('removeClass', 'active');
      $orgs['#sg-annotations-container'].dispatchAction('css', {bottom: 'auto'});

      const sgTCodeStateBefore = $orgs['#sg-t-code'].getState();
      const sgCodeContainerStateBefore = $orgs['#sg-code-container'].getState();
      const sgTAnnotationsStateBefore = $orgs['#sg-t-annotations'].getState();
      const sgAnnotationsContainerStateBefore = $orgs['#sg-annotations-container'].getState();

      annotationsViewer.toggleAnnotations();

      const sgTCodeStateAfter = $orgs['#sg-t-code'].getState();
      const sgCodeContainerStateAfter = $orgs['#sg-code-container'].getState();
      const sgTAnnotationsStateAfter = $orgs['#sg-t-annotations'].getState();
      const sgAnnotationsContainerStateAfter = $orgs['#sg-annotations-container'].getState();

      expect(sgTCodeStateBefore.classList).to.include('active');
      expect(sgCodeContainerStateBefore.style.bottom).to.not.equal(sgCodeContainerStateAfter.style.bottom);
      expect(sgTAnnotationsStateBefore.classList).to.not.include('active');
      expect(sgAnnotationsContainerStateBefore.style.bottom)
        .to.not.equal(sgAnnotationsContainerStateAfter.style.bottom);

      expect(sgTCodeStateAfter.classList).to.not.include('active');
      expect(sgCodeContainerStateAfter.style.bottom).to.equal('-384px');
      expect(sgTAnnotationsStateAfter.classList).to.include('active');
      expect(sgAnnotationsContainerStateAfter.style.bottom).to.equal('0px');
      expect(annotationsViewer.annotationsActive).to.be.true;
      expect(codeViewer.codeActive).to.be.false;
    });

    it('toggles off - also tests .closeCode()', function () {
      const sgAnnotationsContainerStateBefore = $orgs['#sg-annotations-container'].getState();
      const sgTAnnotationsStateBefore = $orgs['#sg-t-annotations'].getState();

      annotationsViewer.toggleAnnotations();

      const sgAnnotationsContainerStateAfter = $orgs['#sg-annotations-container'].getState();
      const sgTAnnotationsStateAfter = $orgs['#sg-t-annotations'].getState();

      expect(sgAnnotationsContainerStateBefore.style.bottom)
        .to.not.equal(sgAnnotationsContainerStateAfter.style.bottom);
      expect(sgTAnnotationsStateBefore.classList).to.include('active');

      expect(sgAnnotationsContainerStateAfter.style.bottom).to.equal('-384px');
      expect(sgTAnnotationsStateAfter.classList).to.not.include('active');
      expect(annotationsViewer.annotationsActive).to.be.false;
    });
  });

  describe('.updateAnnotations()', function () {
    beforeEach(function () {
      $orgs['#sg-annotations-container'].dispatchAction('attr', {'data-patternpartial': null});
      $orgs['#sg-annotations'].dispatchAction('html', '');
    });

    it('fills HTML for one or more annotations', function () {
      const sgAnnotationsContainerStateBefore = $orgs['#sg-annotations-container'].getState();
      const sgAnnotationsStateBefore = $orgs['#sg-annotations'].getState();

      annotationsViewer.updateAnnotations(annotations, 'compounds-block');

      const sgAnnotationsContainerStateAfter = $orgs['#sg-annotations-container'].getState();
      const sgAnnotationsStateAfter = $orgs['#sg-annotations'].getState();

      expect(sgAnnotationsContainerStateBefore.attribs['data-patternpartial'])
        .to.not.equal(sgAnnotationsContainerStateAfter.attribs['data-patternpartial']);
      expect(sgAnnotationsStateBefore.innerHTML).to.equal('');

      expect(sgAnnotationsContainerStateAfter.attribs['data-patternpartial']).to.equal('compounds-block');
      expect(sgAnnotationsStateAfter.innerHTML).to.equal(`<div id="annotation-1">
<h2>1. Navigation</h2>
<div><p>Navigation for responsive web experiences can be tricky. Large navigation menus 
are typical on desktop sites, but mobile screen sizes don&apos;t give us the luxury 
of space. We&apos;re dealing with this situation by creating a simple menu anchor 
that toggles the main navigation on small screens. Once the screen size is large 
enough to accommodate the nav, we show the main navigation links and hide the 
menu anchor.</p>
</div>
</div>`);
    });

    it('fills HTML for no annotations', function () {
      const sgAnnotationsContainerStateBefore = $orgs['#sg-annotations-container'].getState();
      const sgAnnotationsStateBefore = $orgs['#sg-annotations'].getState();

      annotationsViewer.updateAnnotations([], 'compounds-block');

      const sgAnnotationsContainerStateAfter = $orgs['#sg-annotations-container'].getState();
      const sgAnnotationsStateAfter = $orgs['#sg-annotations'].getState();

      expect(sgAnnotationsContainerStateBefore.attribs['data-patternpartial'])
        .to.not.equal(sgAnnotationsContainerStateAfter.attribs['data-patternpartial']);
      expect(sgAnnotationsStateBefore.innerHTML).to.equal('');

      expect(sgAnnotationsContainerStateAfter.attribs['data-patternpartial']).to.equal('compounds-block');
      expect(sgAnnotationsStateAfter.innerHTML).to.equal(`<div class="sg-annotation">
<h2>No Annotations</h2>
<div>There are no annotations for this pattern.</div>
</div>`);
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

    it('updates annotations on data.annotationsOverlay = "on"', function () {
      event.data = {
        annotationsOverlay: 'on',
        annotations,
        patternPartial: 'compounds-block',
        viewall: false
      };

      $orgs['#sg-annotations-container'].dispatchAction('attr', {'data-patternpartial': null});
      $orgs['#sg-annotations'].dispatchAction('html', '');

      const sgAnnotationsContainerStateBefore = $orgs['#sg-annotations-container'].getState();
      const sgAnnotationsStateBefore = $orgs['#sg-annotations'].getState();

      annotationsViewer.receiveIframeMessage(event);

      const sgAnnotationsContainerStateAfter = $orgs['#sg-annotations-container'].getState();
      const sgAnnotationsStateAfter = $orgs['#sg-annotations'].getState();

      expect(sgAnnotationsContainerStateBefore.attribs['data-patternpartial'])
        .to.not.equal(sgAnnotationsContainerStateAfter.attribs['data-patternpartial']);
      expect(sgAnnotationsStateBefore.innerHTML).to.equal('');

      expect(sgAnnotationsContainerStateAfter.attribs['data-patternpartial']).to.equal('compounds-block');
      expect(sgAnnotationsStateAfter.innerHTML).to.equal(`<div id="annotation-1">
<h2>1. Navigation</h2>
<div><p>Navigation for responsive web experiences can be tricky. Large navigation menus 
are typical on desktop sites, but mobile screen sizes don&apos;t give us the luxury 
of space. We&apos;re dealing with this situation by creating a simple menu anchor 
that toggles the main navigation on small screens. Once the screen size is large 
enough to accommodate the nav, we show the main navigation links and hide the 
menu anchor.</p>
</div>
</div>`);
    });

    it('denotes that an annotated element is hidden on data.annotationsOverlay = "on"', function () {
      const annotationsClone = annotations.slice();
      event.data = {
        annotationsOverlay: 'on',
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

      $orgs['#sg-annotations-container'].dispatchAction('attr', {'data-patternpartial': null});
      $orgs['#sg-annotations'].dispatchAction('html', '');

      const sgAnnotationsContainerStateBefore = $orgs['#sg-annotations-container'].getState();
      const sgAnnotationsStateBefore = $orgs['#sg-annotations'].getState();

      annotationsViewer.receiveIframeMessage(event);

      const sgAnnotationsContainerStateAfter = $orgs['#sg-annotations-container'].getState();
      const sgAnnotationsStateAfter = $orgs['#sg-annotations'].getState();

      expect(sgAnnotationsContainerStateBefore.attribs['data-patternpartial'])
        .to.not.equal(sgAnnotationsContainerStateAfter.attribs['data-patternpartial']);
      expect(sgAnnotationsStateBefore.innerHTML).to.equal('');

      expect(sgAnnotationsContainerStateAfter.attribs['data-patternpartial']).to.equal('compounds-block');
      expect(sgAnnotationsStateAfter.innerHTML).to.have.string(`<div id="annotation-2">
<h2>2. Foo<span id="annotation-state-2" style="font-size: 0.8em;color: #666"> hidden</span></h2>
<div><p>Foo.</p></div>
</div>`);
    });

    it('updates annotations on data.annotationsOverlay = "on" and data.viewall = true', function () {
      event.data = {
        annotationsOverlay: 'on',
        annotations,
        patternPartial: 'compounds-block',
        viewall: true
      };

      $orgs['#sg-annotations-container'].dispatchAction('attr', {'data-patternpartial': null});
      $orgs['#sg-annotations'].dispatchAction('html', '');

      const sgAnnotationsContainerStateBefore = $orgs['#sg-annotations-container'].getState();
      const sgAnnotationsStateBefore = $orgs['#sg-annotations'].getState();

      annotationsViewer.receiveIframeMessage(event);

      const sgAnnotationsContainerStateAfter = $orgs['#sg-annotations-container'].getState();
      const sgAnnotationsStateAfter = $orgs['#sg-annotations'].getState();

      expect(sgAnnotationsContainerStateBefore.attribs['data-patternpartial'])
        .to.not.equal(sgAnnotationsContainerStateAfter.attribs['data-patternpartial']);
      expect(sgAnnotationsStateBefore.innerHTML).to.equal('');

      expect(sgAnnotationsContainerStateAfter.attribs['data-patternpartial']).to.equal('compounds-block');
      expect(sgAnnotationsStateAfter.innerHTML).to.equal(`<div id="annotation-1">
<h2>1. Navigation</h2>
<div><p>Navigation for responsive web experiences can be tricky. Large navigation menus 
are typical on desktop sites, but mobile screen sizes don&apos;t give us the luxury 
of space. We&apos;re dealing with this situation by creating a simple menu anchor 
that toggles the main navigation on small screens. Once the screen size is large 
enough to accommodate the nav, we show the main navigation links and hide the 
menu anchor.</p>
</div>
</div>`);
      expect(annotationsViewer.viewall).to.be.true;
    });

    it('closes annotations on data.annotationsOverlay = "off"', function () {
      event.data = {
        annotationsOverlay: 'off'
      };

      annotationsViewer.openAnnotations();

      const sgAnnotationsContainerStateBefore = $orgs['#sg-annotations-container'].getState();
      const sgTAnnotationsStateBefore = $orgs['#sg-t-annotations'].getState();

      annotationsViewer.receiveIframeMessage(event);

      const sgAnnotationsContainerStateAfter = $orgs['#sg-annotations-container'].getState();
      const sgTAnnotationsStateAfter = $orgs['#sg-t-annotations'].getState();

      expect(sgAnnotationsContainerStateBefore.style.bottom)
        .to.not.equal(sgAnnotationsContainerStateAfter.style.bottom);
      expect(sgTAnnotationsStateBefore.classList).to.include('active');

      expect(sgAnnotationsContainerStateAfter.style.bottom).to.equal('-384px');
      expect(sgTAnnotationsStateAfter.classList).to.not.include('active');
      expect(annotationsViewer.annotationsActive).to.be.false;
    });

    it('sets .mustacheBrowser on data.annotationsMustacheBrowser = true', function () {
      event.data = {
        annotationsMustacheBrowser: true
      };

      annotationsViewer.receiveIframeMessage(event);

      expect(annotationsViewer.mustacheBrowser).to.be.true;
    });

    it('sets .mustacheBrowser on data.annotationsMustacheBrowser = false', function () {
      event.data = {
        annotationsMustacheBrowser: false
      };

      annotationsViewer.receiveIframeMessage(event);

      expect(annotationsViewer.mustacheBrowser).to.be.false;
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

    it('sets .viewall on data.annotationsViewall = true', function () {
      event.data = {
        annotationsViewall: true
      };

      annotationsViewer.receiveIframeMessage(event);

      expect(annotationsViewer.viewall).to.be.true;
    });

    it('sets .viewall on data.annotationsViewall = false', function () {
      event.data = {
        annotationsViewall: false
      };

      annotationsViewer.receiveIframeMessage(event);

      expect(annotationsViewer.viewall).to.be.false;
    });

    it('opens annotations on on data.annotationsViewallClick = true', function () {
      event.data = {
        annotationsViewallClick: true
      };

      annotationsViewer.annotationsActive = false;
      annotationsViewer.mustacheBrowser = false;
      codeViewer.codeActive = true;

      $orgs['#sg-t-code'].dispatchAction('addClass', 'active');
      $orgs['#sg-code-container'].dispatchAction('css', {bottom: 'auto'});
      $orgs['#sg-t-annotations'].dispatchAction('removeClass', 'active');

      const sgTCodeStateBefore = $orgs['#sg-t-code'].getState();
      const sgCodeContainerStateBefore = $orgs['#sg-code-container'].getState();
      const sgTAnnotationsStateBefore = $orgs['#sg-t-annotations'].getState();

      annotationsViewer.receiveIframeMessage(event);

      const sgTCodeStateAfter = $orgs['#sg-t-code'].getState();
      const sgCodeContainerStateAfter = $orgs['#sg-code-container'].getState();
      const sgTAnnotationsStateAfter = $orgs['#sg-t-annotations'].getState();

      expect(sgTCodeStateBefore.classList).to.include('active');
      expect(sgCodeContainerStateBefore.style.bottom).to.not.equal(sgCodeContainerStateAfter.style.bottom);
      expect(sgTAnnotationsStateBefore.classList).to.not.include('active');

      expect(sgTCodeStateAfter.classList).to.not.include('active');
      expect(sgCodeContainerStateAfter.style.bottom).to.equal('-384px');
      expect(sgTAnnotationsStateAfter.classList).to.include('active');
      expect(annotationsViewer.annotationsActive).to.be.true;
      expect(codeViewer.codeActive).to.be.false;
    });

    it('toggles annotations on on patternlab.keyPress "ctrl+shift+a"', function () {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+shift+a'
      };

      annotationsViewer.annotationsActive = false;
      annotationsViewer.mustacheBrowser = false;
      codeViewer.codeActive = true;

      $orgs['#sg-t-code'].dispatchAction('addClass', 'active');
      $orgs['#sg-code-container'].dispatchAction('css', {bottom: 'auto'});
      $orgs['#sg-t-annotations'].dispatchAction('removeClass', 'active');

      const sgTCodeStateBefore = $orgs['#sg-t-code'].getState();
      const sgCodeContainerStateBefore = $orgs['#sg-code-container'].getState();
      const sgTAnnotationsStateBefore = $orgs['#sg-t-annotations'].getState();

      annotationsViewer.receiveIframeMessage(event);

      const sgTCodeStateAfter = $orgs['#sg-t-code'].getState();
      const sgCodeContainerStateAfter = $orgs['#sg-code-container'].getState();
      const sgTAnnotationsStateAfter = $orgs['#sg-t-annotations'].getState();

      expect(sgTCodeStateBefore.classList).to.include('active');
      expect(sgCodeContainerStateBefore.style.bottom).to.not.equal(sgCodeContainerStateAfter.style.bottom);
      expect(sgTAnnotationsStateBefore.classList).to.not.include('active');

      expect(sgTCodeStateAfter.classList).to.not.include('active');
      expect(sgCodeContainerStateAfter.style.bottom).to.equal('-384px');
      expect(sgTAnnotationsStateAfter.classList).to.include('active');
      expect(annotationsViewer.annotationsActive).to.be.true;
      expect(codeViewer.codeActive).to.be.false;
    });

    it('toggles code off on patternlab.keyPress "ctrl+shift+a"', function () {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'ctrl+shift+a'
      };

      const sgTAnnotationsStateBefore = $orgs['#sg-t-annotations'].getState();

      annotationsViewer.receiveIframeMessage(event);

      const sgTAnnotationsStateAfter = $orgs['#sg-t-annotations'].getState();

      expect(sgTAnnotationsStateBefore.classList).to.include('active');

      expect(sgTAnnotationsStateAfter.classList).to.not.include('active');
      expect(annotationsViewer.annotationsActive).to.be.false;
    });

    it('closes annotationsViewer on patternlab.keyPress "esc"', function () {
      event.data = {
        event: 'patternlab.keyPress',
        keyPress: 'esc'
      };
      annotationsViewer.annotationsActive = true;

      $orgs['#sg-annotations-container'].dispatchAction('css', {bottom: '0px'});
      $orgs['#sg-t-annotations'].dispatchAction('addClass', 'active');

      const sgAnnotationsContainerStateBefore = $orgs['#sg-annotations-container'].getState();
      const sgTAnnotationsStateBefore = $orgs['#sg-t-annotations'].getState();

      annotationsViewer.receiveIframeMessage(event);

      const sgAnnotationsContainerStateAfter = $orgs['#sg-annotations-container'].getState();
      const sgTAnnotationsStateAfter = $orgs['#sg-t-annotations'].getState();

      expect(sgTAnnotationsStateBefore.classList).to.include('active');
      expect(sgAnnotationsContainerStateBefore.style.bottom)
        .to.not.equal(sgAnnotationsContainerStateAfter.style.bottom);

      expect(sgAnnotationsContainerStateAfter.style.bottom).to.equal('-384px');
      expect(sgTAnnotationsStateAfter.classList).to.not.include('active');
      expect(annotationsViewer.annotationsActive).to.be.false;
    });
  });
});
