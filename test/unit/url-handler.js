import {expect} from 'chai';
import sinon from 'sinon';

import fepperUi from '../init';

const sandbox = sinon.createSandbox();

const $orgs = fepperUi.requerio.$orgs;
const urlHandler = fepperUi.urlHandler;
const patternPartial = 'elements-paragraph';
const patternPartialHomepage = 'pages-homepage';
const patternPath = 'patterns/00-elements-paragraph/00-elements-paragraph.html';
const patternPathHomepage = 'patterns/04-pages-00-homepage/04-pages-00-homepage.html';

describe('urlHandler', function () {
  describe('.getAddressReplacement()', function () {
    it('works for protocol file: with no search param', function () {
      global.location = {
        href: 'file:///home/user/fepper/public/index.html',
        protocol: 'file:'
      };
      const address = urlHandler.getAddressReplacement(patternPartial);

      expect(address).to.equal(`file:///home/user/fepper/public/index.html?p=${patternPartial}`);
    });

    it('works for protocol file: with search param', function () {
      global.location = {
        href: 'file:///home/user/fepper/public/index.html?p=compounds-block',
        protocol: 'file:'
      };
      const address = urlHandler.getAddressReplacement(patternPartial);

      expect(address).to.equal(`file:///home/user/fepper/public/index.html?p=${patternPartial}`);
    });

    it('works for protocol http: with no search param', function () {
      global.location = {
        protocol: 'http:',
        host: 'localhost:3000',
        pathname: '/'
      };
      const address = urlHandler.getAddressReplacement(patternPartial);

      expect(address).to.equal(`http://localhost:3000/?p=${patternPartial}`);
    });

    it('works for protocol http: with search param', function () {
      global.location = {
        protocol: 'http:',
        host: 'localhost:3000',
        pathname: '/',
        search: '?p=compounds-block'
      };
      const address = urlHandler.getAddressReplacement(patternPartial);

      expect(address).to.equal(`http://localhost:3000/?p=${patternPartial}`);
    });
  });

  describe('.getSearchParams()', function () {
    it('returns an object of search param keys and values for a single param', function () {
      global.location = {
        search: '?p=compounds-block'
      };
      const paramsObj = urlHandler.getSearchParams();

      expect(paramsObj).to.be.an.instanceof(Object);
      expect(paramsObj.p).to.equal('compounds-block');
    });

    it('returns an object of search param keys and values for multiple params', function () {
      global.location = {
        search: '?p=compounds-block&ts=1234567890'
      };
      const paramsObj = urlHandler.getSearchParams();

      expect(paramsObj).to.be.an.instanceof(Object);
      expect(paramsObj.p).to.equal('compounds-block');
      expect(paramsObj.ts).to.equal('1234567890');
    });

    it('returns an empty object for no params', function () {
      global.location = {
        search: ''
      };
      const paramsObj = urlHandler.getSearchParams();

      expect(paramsObj).to.be.an.instanceof(Object);
      expect(Object.keys(paramsObj)).to.be.empty;
    });
  });

  describe('.popPattern()', function () {
    beforeEach(function () {
      sandbox.spy($orgs['#sg-viewport'][0].contentWindow, 'postMessage');
    });

    afterEach(function () {
      sandbox.restore();
    });

    it('returns without doing anything if no event.state submitted', function () {
      const documentTitleBefore = global.document.title;
      const sgRawAttribsBefore = $orgs['#sg-raw'].getState().attribs;

      global.location = {
        protocol: 'http:',
        host: 'localhost:3000',
        pathname: '/',
        search: ''
      };
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

      global.location = {
        protocol: 'http:',
        host: 'localhost:3000',
        pathname: '/',
        search: ''
      };
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

      const documentTitleBefore = global.document.title;
      const sgRawAttribsBefore = $orgs['#sg-raw'].getState().attribs;

      global.location = {
        protocol: 'http:',
        host: 'localhost:3000',
        pathname: '/',
        search: `?p=${patternPartial}`
      };
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
      global.history.replaceState({pattern: patternPartialHomepage});
      $orgs['#sg-raw'].dispatchAction('attr', {href: patternPathHomepage});

      const documentTitleBefore = global.document.title;
      const historyStateBefore = global.history.state;
      const sgRawAttribsBefore = $orgs['#sg-raw'].getState().attribs;

      global.location = {
        protocol: 'http:',
        host: 'localhost:3000',
        pathname: '/',
        search: '?p=compounds-block'
      };
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
    it('works', function () {
      global.document.title = `Fepper : ${patternPartialHomepage}`;
      global.history.replaceState({pattern: patternPartialHomepage});
      global.location = {
        protocol: 'http:',
        host: 'localhost:3000',
        pathname: '/',
        search: `?p=${patternPartial}`
      };
      $orgs['#sg-raw'].dispatchAction('attr', {href: patternPathHomepage});

      const documentTitleBefore = global.document.title;
      const historyStateBefore = global.history.state;
      const sgRawAttribsBefore = $orgs['#sg-raw'].getState().attribs;

      urlHandler.pushPattern(patternPartial);

      const documentTitleAfter = global.document.title;
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
