import {expect} from 'chai';
import sinon from 'sinon';

const sandbox = sinon.createSandbox();

describe('urlHandler', function () {
  const patternPartial = 'elements-toggler';
  const patternPartialHomepage = 'pages-homepage';
  const patternPath = 'patterns/00-elements-toggler/00-elements-toggler.html';
  const patternPathHomepage = 'patterns/04-pages-00-homepage/04-pages-00-homepage.html';

  let fepperUi;
  let $orgs;
  let urlHandler;

  before(function () {
    const $organisms = require('../../scripts/requerio/organisms').default;

    fepperUi = require('../unit')($organisms);
    urlHandler = fepperUi.urlHandler;
    $orgs = fepperUi.requerio.$orgs;
  });

  after(function () {
    require('../require-cache-bust')();
  });

  describe('.getAddressReplacement()', function () {
    before(function () {
      global.location.protocol = 'http:';
      global.location.host = 'localhost:3000';
      global.location.search = '';
    });

    it('works for protocol file: with no search param', function () {
      global.location.href = 'file:///home/user/fepper/public/index.html';
      global.location.protocol = 'file:';
      const address = urlHandler.getAddressReplacement(patternPartial);

      expect(address).to.equal(`file:///home/user/fepper/public/index.html?p=${patternPartial}`);
    });

    it('works for protocol file: with search param', function () {
      global.location.href = 'file:///home/user/fepper/public/index.html?p=compounds-block';
      global.location.protocol = 'file:';
      const address = urlHandler.getAddressReplacement(patternPartial);

      expect(address).to.equal(`file:///home/user/fepper/public/index.html?p=${patternPartial}`);
    });

    it('works for protocol http: with no search param', function () {
      global.location.protocol = 'http:';
      global.location.host = 'localhost:3000';
      const address = urlHandler.getAddressReplacement(patternPartial);

      expect(address).to.equal(`http://localhost:3000/?p=${patternPartial}`);
    });

    it('works for protocol http: with search param', function () {
      global.location.protocol = 'http:';
      global.location.host = 'localhost:3000';
      global.location.search = '?p=compounds-block';
      const address = urlHandler.getAddressReplacement(patternPartial);

      expect(address).to.equal(`http://localhost:3000/?p=${patternPartial}`);
    });
  });

  describe('.getSearchParams()', function () {
    before(function () {
      global.location.protocol = 'http:';
      global.location.host = 'localhost:3000';
      global.location.search = '';
    });

    it('returns an object of search param keys and values for a single param', function () {
      global.location.search = '?p=compounds-block';
      const paramsObj = urlHandler.getSearchParams();

      expect(paramsObj).to.be.an.instanceof(Object);
      expect(paramsObj.p).to.equal('compounds-block');
    });

    it('returns an object of search param keys and values for multiple params', function () {
      global.location.search = '?p=compounds-block&ts=1234567890';
      const paramsObj = urlHandler.getSearchParams();

      expect(paramsObj).to.be.an.instanceof(Object);
      expect(paramsObj.p).to.equal('compounds-block');
      expect(paramsObj.ts).to.equal('1234567890');
    });

    it('returns an empty object for no params', function () {
      global.location.search = '';
      const paramsObj = urlHandler.getSearchParams();

      expect(paramsObj).to.be.an.instanceof(Object);
      expect(Object.keys(paramsObj)).to.be.empty;
    });
  });

  describe('.popPattern()', function () {
    before(function () {
      global.location.protocol = 'http:';
      global.location.host = 'localhost:3000';
      global.location.search = '';
      global.mockResponse = {
        gatekeeper_status: 200
      };
    });

    beforeEach(function () {
      sandbox.spy($orgs['#sg-viewport'][0].contentWindow, 'postMessage');
    });

    afterEach(function () {
      sandbox.restore();
    });

    it('returns without doing anything if no event.state submitted', function () {
      const documentTitleBefore = global.document.title;
      const sgRawAttribsBefore = $orgs['#sg-raw'].getState().attribs;

      const event = {
        state: {}
      };

      urlHandler.popPattern(event);

      const documentTitleAfter = global.document.title;
      const sgRawAttribsAfter = $orgs['#sg-raw'].getState().attribs;

      expect(documentTitleBefore).to.equal(documentTitleAfter);
      expect(sgRawAttribsBefore.href).to.equal(sgRawAttribsAfter.href);
      expect($orgs['#sg-viewport'][0].contentWindow.postMessage.notCalled).to.be.true;
    });

    it('works with no search param', function () {
      global.document.title = `Fepper : ${patternPartial}`;
      $orgs['#sg-raw'].dispatchAction('attr', {href: patternPath});

      const documentTitleBefore = global.document.title;
      const sgRawAttribsBefore = $orgs['#sg-raw'].getState().attribs;

      const event = {
        state: {
          pattern: 'pages-homepage'
        }
      };

      urlHandler.popPattern(event);

      const documentTitleAfter = global.document.title;
      const sgRawAttribsAfter = $orgs['#sg-raw'].getState().attribs;

      expect(documentTitleBefore).to.equal(`Fepper : ${patternPartial}`);
      expect(sgRawAttribsBefore.href).to.equal(patternPath);

      expect(documentTitleAfter).to.equal('Fepper : pages-homepage');
      expect(sgRawAttribsAfter.href).to.equal(patternPathHomepage);
      expect($orgs['#sg-viewport'][0].contentWindow.postMessage.calledOnce).to.be.true;
    });

    it('works with search param', function () {
      global.document.title = `Fepper : ${patternPartialHomepage}`;
      global.location.search = `?p=${patternPartial}`;

      const documentTitleBefore = global.document.title;
      const sgRawAttribsBefore = $orgs['#sg-raw'].getState().attribs;

      const event = {
        state: {
          pattern: patternPartial
        }
      };

      urlHandler.popPattern(event);

      const documentTitleAfter = global.document.title;
      const sgRawAttribsAfter = $orgs['#sg-raw'].getState().attribs;

      expect(documentTitleBefore).to.equal(`Fepper : ${patternPartialHomepage}`);
      expect(sgRawAttribsBefore.href).to.not.equal(patternPath);

      expect(documentTitleAfter).to.equal(`Fepper : ${patternPartial}`);
      expect(sgRawAttribsAfter.href).to.equal(patternPath);
      expect($orgs['#sg-viewport'][0].contentWindow.postMessage.calledOnce).to.be.true;
    });

    it('sets history.state.pattern = event.state.pattern if event.state.pattern !== p search param', function () {
      global.document.title = `Fepper : ${patternPartialHomepage}`;

      global.history.replaceState({pattern: patternPartialHomepage}, '');
      $orgs['#sg-raw'].dispatchAction('attr', {href: patternPathHomepage});

      global.location.search = '?p=compounds-block';
      const documentTitleBefore = global.document.title;
      const historyStateBefore = global.history.state;
      const sgRawAttribsBefore = $orgs['#sg-raw'].getState().attribs;

      const event = {
        state: {
          pattern: patternPartial
        }
      };

      urlHandler.popPattern(event);

      const documentTitleAfter = global.document.title;
      const historyStateAfter = global.history.state;
      const sgRawAttribsAfter = $orgs['#sg-raw'].getState().attribs;

      expect(documentTitleBefore).to.equal(`Fepper : ${patternPartialHomepage}`);
      expect(historyStateBefore.pattern).to.equal(patternPartialHomepage);
      expect(sgRawAttribsBefore.href).to.not.equal(patternPath);

      expect(documentTitleAfter).to.equal(`Fepper : ${patternPartial}`);
      expect(historyStateAfter.pattern).to.equal(patternPartial);
      expect(sgRawAttribsAfter.href).to.equal(patternPath);
      expect($orgs['#sg-viewport'][0].contentWindow.postMessage.calledOnce).to.be.true;
    });
  });

  describe('.pushPattern()', function () {
    before(function () {
      global.location.protocol = 'http:';
      global.location.host = 'localhost:3000';
      global.location.search = '';
    });

    it('works', function () {
      global.document.title = `Fepper : ${patternPartialHomepage}`;

      global.history.replaceState({pattern: patternPartialHomepage}, '');
      $orgs['#sg-raw'].dispatchAction('attr', {href: patternPathHomepage});

      global.location.search = `?p=${patternPartial}`;
      const documentTitleBefore = document.title;
      const historyStateBefore = global.history.state;
      const sgRawAttribsBefore = $orgs['#sg-raw'].getState().attribs;

      urlHandler.pushPattern(patternPartial);

      const documentTitleAfter = document.title;
      const historyStateAfter = global.history.state;
      const sgRawAttribsAfter = $orgs['#sg-raw'].getState().attribs;

      expect(documentTitleBefore).to.equal(`Fepper : ${patternPartialHomepage}`);
      expect(historyStateBefore.pattern).to.equal(patternPartialHomepage);
      expect(sgRawAttribsBefore.href).to.equal(patternPathHomepage);

      expect(documentTitleAfter).to.equal(`Fepper : ${patternPartial}`);
      expect(historyStateAfter.pattern).to.equal(patternPartial);
      expect(sgRawAttribsAfter.href).to.equal(patternPath);
    });
  });
});
