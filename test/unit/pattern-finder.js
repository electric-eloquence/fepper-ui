import {expect} from 'chai';
import sinon from 'sinon';

const sandbox = sinon.createSandbox();
const typeaheadData = {
  patternPartial: 'elements-paragraph',
  patternPath: 'patterns/00-elements-paragraph/00-elements-paragraph.html'
};

describe('patternFinder', function () {
  let fepperUi;
  let $orgs;
  let patternFinder;

  before(function () {
    const $organisms = require('../../scripts/requerio/organisms').default;

    fepperUi = require('../unit')($organisms);
    $orgs = fepperUi.requerio.$orgs;
    patternFinder = fepperUi.patternFinder;
  });

  afterEach(function () {
    $orgs['#typeahead'].dispatchAction('blur');
  });

  after(function () {
    require('../require-cache-bust')();
  });

  describe('.constructor()', function () {
    it('instantiates correctly', function () {
      expect(patternFinder.constructor.name).to.equal('PatternFinder');
      expect(Object.keys(patternFinder).length).to.equal(4);
      expect(patternFinder).to.have.property('receiveIframeMessage');
      expect(patternFinder).to.have.property('data');
      expect(patternFinder).to.have.property('$orgs');
      expect(patternFinder).to.have.property('uiData');
      expect(patternFinder).to.have.property('uiFns');
      expect(patternFinder).to.have.property('uiProps');
      expect(patternFinder).to.have.property('patterns');
    });

    it('initializes correctly', function () {
      Object.keys(patternFinder.uiData.patternPaths).forEach((patternPartial, i) => {
        expect(patternFinder.data[i].patternPartial).to.equal(patternPartial);
        expect(patternFinder.data[i].patternPath).to.equal(patternFinder.uiData.patternPaths[patternPartial]);
      });

      expect(patternFinder.patterns).to.be.an.instanceof(window.Bloodhound);
    });
  });

  describe('.closeFinder()', function () {
    before(function () {
      global.mockResponse = {
        gatekeeper_status: 200
      };
    });

    it('works', function () {
      $orgs['#sg-f-toggle'].dispatchAction('addClass', 'active');
      $orgs['#sg-find'].dispatchAction('addClass', 'active');
      $orgs['#typeahead'].dispatchAction('focus');

      const sgFToggleStateBefore = $orgs['#sg-f-toggle'].getState();
      const sgFindStateBefore = $orgs['#sg-find'].getState();
      const documentStateBefore = $orgs['document'].getState();

      patternFinder.onAutocompleted({}, typeaheadData, patternFinder);

      const sgFToggleStateAfter = $orgs['#sg-f-toggle'].getState();
      const sgFindStateAfter = $orgs['#sg-find'].getState();
      const documentStateAfter = $orgs['document'].getState();

      expect(sgFToggleStateBefore.classArray).to.include('active');
      expect(sgFindStateBefore.classArray).to.include('active');
      expect(documentStateBefore.activeOrganism).to.equal('#typeahead');

      expect(sgFToggleStateAfter.classArray).to.not.include('active');
      expect(sgFindStateAfter.classArray).to.not.include('active');
      expect(documentStateAfter.activeOrganism).to.be.null;
    });
  });

  describe('.onAutocompleted()', function () {
    before(function () {
      global.mockResponse = {
        gatekeeper_status: 200
      };
    });

    it('works', function () {
      sandbox.spy($orgs['#sg-viewport'][0].contentWindow, 'postMessage');

      $orgs['#sg-f-toggle'].dispatchAction('addClass', 'active');
      $orgs['#sg-find'].dispatchAction('addClass', 'active');
      $orgs['#typeahead'].dispatchAction('focus');

      const sgFToggleStateBefore = $orgs['#sg-f-toggle'].getState();
      const sgFindStateBefore = $orgs['#sg-find'].getState();
      const documentStateBefore = $orgs['document'].getState();

      patternFinder.onAutocompleted({}, typeaheadData, patternFinder);

      const sgFToggleStateAfter = $orgs['#sg-f-toggle'].getState();
      const sgFindStateAfter = $orgs['#sg-find'].getState();
      const documentStateAfter = $orgs['document'].getState();

      expect(sgFToggleStateBefore.classArray).to.include('active');
      expect(sgFindStateBefore.classArray).to.include('active');
      expect(documentStateBefore.activeOrganism).to.equal('#typeahead');

      expect(sgFToggleStateAfter.classArray).to.not.include('active');
      expect(sgFindStateAfter.classArray).to.not.include('active');
      expect(documentStateAfter.activeOrganism).to.be.null;
      expect($orgs['#sg-viewport'][0].contentWindow.postMessage.called).to.be.true;

      sandbox.restore();
    });
  });

  describe('.onSelected()', function () {
    it('works', function () {
      sandbox.spy($orgs['#sg-viewport'][0].contentWindow, 'postMessage');

      $orgs['#sg-f-toggle'].dispatchAction('addClass', 'active');
      $orgs['#sg-find'].dispatchAction('addClass', 'active');
      $orgs['#typeahead'].dispatchAction('focus');

      const sgFToggleStateBefore = $orgs['#sg-f-toggle'].getState();
      const sgFindStateBefore = $orgs['#sg-find'].getState();
      const documentStateBefore = $orgs['document'].getState();

      patternFinder.onSelected({}, typeaheadData, patternFinder);

      const sgFToggleStateAfter = $orgs['#sg-f-toggle'].getState();
      const sgFindStateAfter = $orgs['#sg-find'].getState();
      const documentStateAfter = $orgs['document'].getState();

      expect(sgFToggleStateBefore.classArray).to.include('active');
      expect(sgFindStateBefore.classArray).to.include('active');
      expect(documentStateBefore.activeOrganism).to.equal('#typeahead');

      expect(sgFToggleStateAfter.classArray).to.not.include('active');
      expect(sgFindStateAfter.classArray).to.not.include('active');
      expect(documentStateAfter.activeOrganism).to.be.null;
      expect($orgs['#sg-viewport'][0].contentWindow.postMessage.called).to.be.true;

      sandbox.restore();
    });
  });

  describe('.passPath()', function () {
    it('works', function () {
      sandbox.spy($orgs['#sg-viewport'][0].contentWindow, 'postMessage');

      $orgs['#sg-f-toggle'].dispatchAction('addClass', 'active');
      $orgs['#sg-find'].dispatchAction('addClass', 'active');
      $orgs['#typeahead'].dispatchAction('focus');

      const sgFToggleStateBefore = $orgs['#sg-f-toggle'].getState();
      const sgFindStateBefore = $orgs['#sg-find'].getState();
      const documentStateBefore = $orgs['document'].getState();

      patternFinder.passPath(typeaheadData);

      const sgFToggleStateAfter = $orgs['#sg-f-toggle'].getState();
      const sgFindStateAfter = $orgs['#sg-find'].getState();
      const documentStateAfter = $orgs['document'].getState();

      expect(sgFToggleStateBefore.classArray).to.include('active');
      expect(sgFindStateBefore.classArray).to.include('active');
      expect(documentStateBefore.activeOrganism).to.equal('#typeahead');

      expect(sgFToggleStateAfter.classArray).to.not.include('active');
      expect(sgFindStateAfter.classArray).to.not.include('active');
      expect(documentStateAfter.activeOrganism).to.be.null;
      expect($orgs['#sg-viewport'][0].contentWindow.postMessage.called).to.be.true;

      sandbox.restore();
    });
  });

  describe('.toggleFinder()', function () {
    it('open works', function () {
      patternFinder.closeFinder();

      const sgFToggleStateBefore = $orgs['#sg-f-toggle'].getState();
      const sgFindStateBefore = $orgs['#sg-find'].getState();
      const documentStateBefore = $orgs['document'].getState();

      patternFinder.toggleFinder();

      const sgFToggleStateAfter = $orgs['#sg-f-toggle'].getState();
      const sgFindStateAfter = $orgs['#sg-find'].getState();
      const documentStateAfter = $orgs['document'].getState();

      expect(sgFToggleStateBefore.classArray).to.not.include('active');
      expect(sgFindStateBefore.classArray).to.not.include('active');
      expect(documentStateBefore.activeOrganism).to.be.null;

      expect(sgFToggleStateAfter.classArray).to.include('active');
      expect(sgFindStateAfter.classArray).to.include('active');
      expect(documentStateAfter.activeOrganism).to.equal('#typeahead');
    });

    it('close works', function () {
      const sgFToggleStateBefore = $orgs['#sg-f-toggle'].getState();
      const sgFindStateBefore = $orgs['#sg-find'].getState();

      patternFinder.toggleFinder();

      const sgFToggleStateAfter = $orgs['#sg-f-toggle'].getState();
      const sgFindStateAfter = $orgs['#sg-find'].getState();

      expect(sgFToggleStateBefore.classArray).to.include('active');
      expect(sgFindStateBefore.classArray).to.include('active');

      expect(sgFToggleStateAfter.classArray).to.not.include('active');
      expect(sgFindStateAfter.classArray).to.not.include('active');
    });
  });

  describe('.receiveIframeMessage()', function () {
    it('invokes toggleFinder open for keyPress "ctrl+shift+f"', function () {
      global.location.protocol = 'http:';
      global.location.host = 'localhost:3000';
      const event = {
        data: {
          event: 'patternlab.keyPress',
          keyPress: 'ctrl+shift+f'
        },
        origin: 'http://localhost:3000'
      };

      patternFinder.closeFinder();

      const sgFToggleStateBefore = $orgs['#sg-f-toggle'].getState();
      const sgFindStateBefore = $orgs['#sg-find'].getState();
      const documentStateBefore = $orgs['document'].getState();

      patternFinder.receiveIframeMessage(event);

      const sgFToggleStateAfter = $orgs['#sg-f-toggle'].getState();
      const sgFindStateAfter = $orgs['#sg-find'].getState();
      const documentStateAfter = $orgs['document'].getState();

      expect(sgFToggleStateBefore.classArray).to.not.include('active');
      expect(sgFindStateBefore.classArray).to.not.include('active');
      expect(documentStateBefore.activeOrganism).to.be.null;

      expect(sgFToggleStateAfter.classArray).to.include('active');
      expect(sgFindStateAfter.classArray).to.include('active');
      expect(documentStateAfter.activeOrganism).to.equal('#typeahead');
    });

    it('invokes toggleFinder close for keyPress "ctrl+shift+f"', function () {
      global.location.protocol = 'http:';
      global.location.host = 'localhost:3000';
      const event = {
        data: {
          event: 'patternlab.keyPress',
          keyPress: 'ctrl+shift+f'
        },
        origin: 'http://localhost:3000'
      };

      const sgFToggleStateBefore = $orgs['#sg-f-toggle'].getState();
      const sgFindStateBefore = $orgs['#sg-find'].getState();

      patternFinder.receiveIframeMessage(event);

      const sgFToggleStateAfter = $orgs['#sg-f-toggle'].getState();
      const sgFindStateAfter = $orgs['#sg-find'].getState();

      expect(sgFToggleStateBefore.classArray).to.include('active');
      expect(sgFindStateBefore.classArray).to.include('active');

      expect(sgFToggleStateAfter.classArray).to.not.include('active');
      expect(sgFindStateAfter.classArray).to.not.include('active');
    });

    it('invokes closeFinder for keyPress "esc"', function () {
      global.location.protocol = 'http:';
      global.location.host = 'localhost:3000';
      const event = {
        data: {
          event: 'patternlab.keyPress',
          keyPress: 'esc'
        },
        origin: 'http://localhost:3000'
      };

      $orgs['#sg-f-toggle'].dispatchAction('addClass', 'active');
      $orgs['#sg-find'].dispatchAction('addClass', 'active');
      $orgs['#typeahead'].dispatchAction('focus');

      const sgFToggleStateBefore = $orgs['#sg-f-toggle'].getState();
      const sgFindStateBefore = $orgs['#sg-find'].getState();
      const documentStateBefore = $orgs['document'].getState();

      patternFinder.receiveIframeMessage(event);

      const sgFToggleStateAfter = $orgs['#sg-f-toggle'].getState();
      const sgFindStateAfter = $orgs['#sg-find'].getState();
      const documentStateAfter = $orgs['document'].getState();

      expect(sgFToggleStateBefore.classArray).to.include('active');
      expect(sgFindStateBefore.classArray).to.include('active');
      expect(documentStateBefore.activeOrganism).to.equal('#typeahead');

      expect(sgFToggleStateAfter.classArray).to.not.include('active');
      expect(sgFindStateAfter.classArray).to.not.include('active');
      expect(documentStateAfter.activeOrganism).to.be.null;
    });

    it('does nothing if requesting a remote location over HTTP', function () {
      global.location.protocol = 'http:';
      global.location.host = 'remotehost:3000';
      const event = {
        data: {
          event: 'patternlab.keyPress',
          keyPress: 'esc'
        },
        origin: 'http://localhost:3000'
      };

      const sgFToggleStateBefore = $orgs['#sg-f-toggle'].getState();
      const sgFindStateBefore = $orgs['#sg-find'].getState();
      const documentStateBefore = $orgs['document'].getState();

      patternFinder.receiveIframeMessage(event);

      const sgFToggleStateAfter = $orgs['#sg-f-toggle'].getState();
      const sgFindStateAfter = $orgs['#sg-find'].getState();
      const documentStateAfter = $orgs['document'].getState();

      expect(sgFToggleStateBefore.classArray).to.not.include('active');
      expect(sgFindStateBefore.classArray).to.not.include('active');
      expect(documentStateBefore.activeOrganism).to.be.null;

      expect(sgFindStateAfter.classArray).to.not.include('active');
      expect(sgFToggleStateAfter.classArray).to.not.include('active');
      expect(documentStateAfter.activeOrganism).to.be.null;
    });
  });
});
