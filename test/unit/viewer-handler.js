import {expect} from 'chai';

import fepperUi from '../unit';

const $orgs = fepperUi.requerio.$orgs;
const viewerHandler = fepperUi.viewerHandler;

describe('viewerHandler', function () {
  describe('.constructor()', function () {
    it('instantiates correctly', function () {
      expect(viewerHandler.constructor.name).to.equal('ViewerHandler');
      expect(Object.keys(viewerHandler).length).to.equal(1);
      expect(viewerHandler).to.have.property('$orgs');
    });
  });

  describe('.stoke()', function () {
    before(function () {
      $orgs['#sg-view-container'].dispatchAction('css', {bottom: ''});
    });

    it('moves the viewer out of view', function () {
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

      viewerHandler.stoke();

      const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

      expect(sgViewContainerBefore.css.bottom).to.be.undefined;

      expect(sgViewContainerAfter.css.bottom).to.equal('-384px');
    });
  });

  describe('.openViewer()', function () {
    before(function () {
      $orgs['#sg-vp-wrap'].dispatchAction('css', {paddingBottom: '0px'});
    });

    it('opens viewer', function () {
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();
      const sgVpWrapBefore = $orgs['#sg-vp-wrap'].getState();

      viewerHandler.openViewer();

      const sgViewContainerAfter = $orgs['#sg-view-container'].getState();
      const sgVpWrapAfter = $orgs['#sg-vp-wrap'].getState();

      expect(sgViewContainerBefore.css.bottom).to.equal('-384px');
      expect(sgVpWrapBefore.css.paddingBottom).to.equal('0px');

      expect(sgViewContainerAfter.css.bottom).to.equal('0px');
      expect(sgVpWrapAfter.css.paddingBottom).to.equal('384px');
    });
  });

  describe('.closeViewer()', function () {
    it('closes viewer', function () {
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();
      const sgVpWrapBefore = $orgs['#sg-vp-wrap'].getState();

      viewerHandler.closeViewer();

      const sgViewContainerAfter = $orgs['#sg-view-container'].getState();
      const sgVpWrapAfter = $orgs['#sg-vp-wrap'].getState();

      expect(sgViewContainerBefore.css.bottom).to.equal('0px');
      expect(sgVpWrapBefore.css.paddingBottom).to.equal('384px');

      expect(sgViewContainerAfter.css.bottom).to.equal('-384px');
      expect(sgVpWrapAfter.css.paddingBottom).to.equal('0px');
    });
  });

  describe('.slideViewer()', function () {
    it('slides up', function () {
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

      viewerHandler.slideViewer(0);

      const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

      expect(sgViewContainerBefore.css.bottom).to.equal('-384px');

      expect(sgViewContainerAfter.css.bottom).to.equal('0px');
    });

    it('slides down', function () {
      const sgViewContainerBefore = $orgs['#sg-view-container'].getState();

      viewerHandler.slideViewer(384);

      const sgViewContainerAfter = $orgs['#sg-view-container'].getState();

      expect(sgViewContainerBefore.css.bottom).to.equal('0px');

      expect(sgViewContainerAfter.css.bottom).to.equal('-384px');
    });
  });
});
