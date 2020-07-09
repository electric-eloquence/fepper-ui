import {expect} from 'chai';
import sinon from 'sinon';

import fepperUi from '../unit';

const sandbox = sinon.createSandbox();

const $orgs = fepperUi.requerio.$orgs;
const uiFns = fepperUi.uiFns;
const uiProps = fepperUi.uiProps;
const dataSaver = fepperUi.dataSaver;

describe('uiFns', function () {
  describe('.closeAllPanels()', function () {
    it('works', function () {
      $orgs['#sg-nav-target'].dispatchAction('addClass', 'active');
      $orgs['.sg-acc-handle'].dispatchAction('addClass', 'active');
      $orgs['.sg-acc-panel'].dispatchAction('addClass', 'active');
      $orgs['.sg-size'].dispatchAction('addClass', 'active');

      const sgNavTargetStateBefore = $orgs['#sg-nav-target'].getState();
      const sgAccHandleStateBefore = $orgs['.sg-acc-handle'].getState();
      const sgAccPanelStateBefore = $orgs['.sg-acc-panel'].getState();
      const sgSizeStateBefore = $orgs['.sg-size'].getState();

      uiFns.closeAllPanels();

      const sgNavTargetStateAfter = $orgs['#sg-nav-target'].getState();
      const sgAccHandleStateAfter = $orgs['.sg-acc-handle'].getState();
      const sgAccPanelStateAfter = $orgs['.sg-acc-panel'].getState();
      const sgSizeStateAfter = $orgs['.sg-size'].getState();

      expect(sgNavTargetStateBefore.classArray).to.include('active');
      expect(sgAccHandleStateBefore.classArray).to.include('active');
      expect(sgAccPanelStateBefore.classArray).to.include('active');
      expect(sgSizeStateBefore.classArray).to.include('active');

      expect(sgNavTargetStateAfter.classArray).to.not.include('active');
      expect(sgAccHandleStateAfter.classArray).to.not.include('active');
      expect(sgAccPanelStateAfter.classArray).to.not.include('active');
      expect(sgSizeStateAfter.classArray).to.not.include('active');
    });
  });

  describe('.closeOtherPanels()', function () {
    it('leaves clicked inactive panel inactive', function () {
      const sgFToggleStateBefore = $orgs['#sg-f-toggle'].getState();

      uiFns.closeOtherPanels($orgs['#sg-f-toggle']);

      const sgFToggleStateAfter = $orgs['#sg-f-toggle'].getState();

      expect(sgFToggleStateBefore.classArray).to.not.include('active');

      expect(sgFToggleStateAfter.classArray).to.not.include('active');
    });

    it('leaves clicked active panel active', function () {
      $orgs['#sg-f-toggle'].dispatchAction('addClass', 'active');

      const sgFToggleStateBefore = $orgs['#sg-f-toggle'].getState();

      uiFns.closeOtherPanels($orgs['#sg-f-toggle']);

      const sgFToggleStateAfter = $orgs['#sg-f-toggle'].getState();

      expect(sgFToggleStateBefore.classArray).to.include('active');

      expect(sgFToggleStateAfter.classArray).to.include('active');
    });
  });

  describe('.debounce()', function () {
    it('does not run the callback again when invoked again before the timeout', function (done) {
      const start = Date.now();
      const mock = {
        callback: (resolve) => {
          const elapsed = Date.now() - start;
          expect(elapsed).to.not.be.below(30);

          resolve();
        }
      };
      sandbox.spy(mock, 'callback');

      const debounced = uiFns.debounce(mock.callback, 20);
      debounced(() => {});

      new Promise(
        (resolve) => {
          setTimeout(() => debounced(resolve), 10);
        })
        .then(() => {
          expect(mock.callback.calledOnce).to.be.true;

          sandbox.restore();
          done();
        });
    });
  });

  describe('.getBreakpointsSorted()', function () {
    it('sorts unsorted FEPPER breakpoints from the .js file', function () {
      const bpsUnsorted = global.FEPPER.breakpoints;

      expect(Object.keys(bpsUnsorted)[0]).to.equal('md');
      expect(Object.values(bpsUnsorted)[0].maxWidth).to.equal(1024);
      expect(Object.values(bpsUnsorted)[0].minWidth).to.equal(768);
      expect(Object.keys(bpsUnsorted)[1]).to.equal('lg');
      expect(Object.values(bpsUnsorted)[1].maxWidth).to.equal(-1);
      expect(Object.values(bpsUnsorted)[1].minWidth).to.equal(1025);
      expect(Object.keys(bpsUnsorted)[2]).to.equal('xs');
      expect(Object.values(bpsUnsorted)[2].maxWidth).to.equal(480);
      expect(Object.values(bpsUnsorted)[2].minWidth).to.equal(321);
      expect(Object.keys(bpsUnsorted)[3]).to.equal('xx');
      expect(Object.values(bpsUnsorted)[3].maxWidth).to.equal(320);
      expect(Object.values(bpsUnsorted)[3].minWidth).to.equal(0);
      expect(Object.keys(bpsUnsorted)[4]).to.equal('sm');
      expect(Object.values(bpsUnsorted)[4].maxWidth).to.equal(767);
      expect(Object.values(bpsUnsorted)[4].minWidth).to.equal(481);

      const bpsSorted = uiFns.getBreakpointsSorted(global.FEPPER);

      expect(Object.values(bpsSorted)[0]).to.equal(1280);
      expect(Object.values(bpsSorted)[0]).to.be.above(Object.values(bpsSorted)[1]);
      expect(Object.values(bpsSorted)[1]).to.equal(bpsUnsorted.md.maxWidth);
      expect(Object.values(bpsSorted)[1]).to.be.above(Object.values(bpsSorted)[2]);
      expect(Object.values(bpsSorted)[2]).to.equal(bpsUnsorted.sm.maxWidth);
      expect(Object.values(bpsSorted)[2]).to.be.above(Object.values(bpsSorted)[3]);
      expect(Object.values(bpsSorted)[3]).to.equal(bpsUnsorted.xs.maxWidth);
      expect(Object.values(bpsSorted)[3]).to.be.above(Object.values(bpsSorted)[4]);
      expect(Object.values(bpsSorted)[4]).to.equal(bpsUnsorted.xx.maxWidth);
    });

    it('sorts unsorted breakpoints from variables.styl', function () {
      global.FEPPER.breakpoints = {};
      global.bp_md_max = 1025;
      global.bp_lg_max = -2;
      global.bp_xs_max = 481;
      global.bp_xx_min = 1;
      global.bp_xx_max = 321;
      global.bp_sm_max = 768;

      const bpsSorted = uiFns.getBreakpointsSorted(global.FEPPER);

      expect(Object.values(bpsSorted)[0]).to.equal(1281);
      expect(Object.values(bpsSorted)[0]).to.be.above(Object.values(bpsSorted)[1]);
      expect(Object.values(bpsSorted)[1]).to.equal(global.bp_md_max);
      expect(Object.values(bpsSorted)[1]).to.be.above(Object.values(bpsSorted)[2]);
      expect(Object.values(bpsSorted)[2]).to.equal(global.bp_sm_max);
      expect(Object.values(bpsSorted)[2]).to.be.above(Object.values(bpsSorted)[3]);
      expect(Object.values(bpsSorted)[3]).to.equal(global.bp_xs_max);
      expect(Object.values(bpsSorted)[3]).to.be.above(Object.values(bpsSorted)[4]);
      expect(Object.values(bpsSorted)[4]).to.equal(global.bp_xx_max);
    });

    it('gives priority to bps in FEPPER object from .js file vs. variables.styl', function () {
      global.FEPPER.breakpoints = {
        md: {
          maxWidth: 1337,
          minWidth: 768
        }
      };
      global.bp_md_max = 1024;
      global.bp_lg_max = -1;
      global.bp_xs_max = 480;
      global.bp_xx_min = 0;
      global.bp_xx_max = 320;
      global.bp_sm_max = 767;

      const bpsSorted = uiFns.getBreakpointsSorted(global.FEPPER);

      expect(Object.values(bpsSorted)[0]).to.equal(1906);
      expect(Object.values(bpsSorted)[0]).to.be.above(Object.values(bpsSorted)[1]);
      expect(Object.values(bpsSorted)[1]).to.not.equal(global.bp_md_max);
      expect(Object.values(bpsSorted)[1]).to.equal(1337);
      expect(Object.values(bpsSorted)[1]).to.be.above(Object.values(bpsSorted)[2]);
      expect(Object.values(bpsSorted)[2]).to.equal(global.bp_sm_max);
      expect(Object.values(bpsSorted)[2]).to.be.above(Object.values(bpsSorted)[3]);
      expect(Object.values(bpsSorted)[3]).to.equal(global.bp_xs_max);
      expect(Object.values(bpsSorted)[3]).to.be.above(Object.values(bpsSorted)[4]);
      expect(Object.values(bpsSorted)[4]).to.equal(global.bp_xx_max);
    });
  });

  describe('.receiveIframeMessageBoilerplate()', function () {
    it('returns a reference to data submitted as an object', function () {
      global.location = {
        protocol: 'http:',
        host: 'localhost:3000'
      };
      const event = {
        data: {
          event: 'patternlab.keyPress',
          keyPress: 'ctrl+shift+f'
        },
        origin: 'http://localhost:3000'
      };

      const data = uiFns.receiveIframeMessageBoilerplate(event);

      expect(data).to.equal(event.data);
    });

    it('returns an object when data are submitted as a string', function () {
      global.location = {
        protocol: 'http:',
        host: 'localhost:3000'
      };
      const event = {
        data: '{"event":"patternlab.keyPress","keyPress":"ctrl+shift+f"}',
        origin: 'http://localhost:3000'
      };

      const data = uiFns.receiveIframeMessageBoilerplate(event);

      expect(JSON.stringify(data)).to.equal(JSON.stringify(JSON.parse(event.data)));
    });

    it('returns nothing if requesting a remote location over HTTP', function () {
      global.location = {
        protocol: 'http:',
        host: 'remotehost:3000'
      };
      const event = {
        data: {
          event: 'patternlab.keyPress',
          keyPress: 'ctrl+shift+f'
        },
        origin: 'http://localhost:3000'
      };

      const data = uiFns.receiveIframeMessageBoilerplate(event);

      expect(data).to.be.undefined;
    });
  });

  describe('.toggleDisco()', function () {
    it('toggles on - also tests .stopDisco()', function (done) {
      $orgs['#sg-size-disco'].dispatchAction('blur');

      const documentStateBefore = $orgs.document.getState();
      const discoModeBefore = fepperUi.uiProps.discoMode;
      const discoIdBefore = fepperUi.uiProps.discoId;

      uiFns.toggleDisco();

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

    it('toggles off - also tests .startDisco()', function (done) {
      uiFns.startDisco();

      setTimeout(() => {
        const documentStateBefore = $orgs.document.getState();
        const discoModeBefore = fepperUi.uiProps.discoMode;
        const discoIdBefore = fepperUi.uiProps.discoId;

        uiFns.toggleDisco();

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
  });

  describe('.toggleGrow()', function () {
    it('toggles on - also tests .stopGrow()', function (done) {
      $orgs['#sg-size-grow'].dispatchAction('blur');
      $orgs['#sg-gen-container'].dispatchAction('addClass', 'vp-animate');
      $orgs['#sg-viewport'].dispatchAction('addClass', 'vp-animate');

      const documentStateBefore = $orgs.document.getState();
      const growModeBefore = fepperUi.uiProps.growMode;
      const growIdBefore = fepperUi.uiProps.growId;
      const sgGenContainerStateBefore = $orgs['#sg-gen-container'].getState();
      const sgViewportStateBefore = $orgs['#sg-viewport'].getState();

      uiFns.toggleGrow();

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

    it('toggles off - also tests .startGrow()', function (done) {
      uiFns.startGrow();

      setTimeout(() => {
        const documentStateBefore = $orgs.document.getState();
        const growModeBefore = fepperUi.uiProps.growMode;
        const growIdBefore = fepperUi.uiProps.growId;

        uiFns.toggleGrow();

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
  });

  describe('.sizeIframe()', function () {
    it('resizes with animate on and wholeMode off by default', function () {
      $orgs['#sg-gen-container'].dispatchAction('removeClass', 'vp-animate');
      $orgs['#sg-viewport'].dispatchAction('removeClass', 'vp-animate');
      dataSaver.removeValue('vpWidth');

      const wholeModeBefore = uiProps.wholeMode;
      const sgGenContainerStateBefore = $orgs['#sg-gen-container'].getState();
      const sgViewportStateBefore = $orgs['#sg-viewport'].getState();
      const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
      const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();
      const dataSaverVpWidthBefore = dataSaver.findValue('vpWidth');

      uiFns.sizeIframe(320);

      const wholeModeAfter = uiProps.wholeMode;
      const sgGenContainerStateAfter = $orgs['#sg-gen-container'].getState();
      const sgViewportStateAfter = $orgs['#sg-viewport'].getState();
      const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
      const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();
      const dataSaverVpWidthAfter = dataSaver.findValue('vpWidth');

      expect(wholeModeBefore).to.be.false;
      expect(sgGenContainerStateBefore.classArray).to.not.include('vp-animate');
      expect(sgGenContainerStateBefore.style.width).to.not.equal('334px');
      expect(sgViewportStateBefore.classArray).to.not.include('vp-animate');
      expect(sgViewportStateBefore.style.width).to.not.equal('320px');
      expect(sgSizePxStateBefore.value).to.not.equal('320');
      expect(sgSizeEmStateBefore.value).to.not.equal('20.00');
      expect(dataSaverVpWidthBefore).to.equal('');

      expect(wholeModeAfter).to.be.false;
      expect(sgGenContainerStateAfter.classArray).to.include('vp-animate');
      expect(sgGenContainerStateAfter.style.width).to.equal('334px');
      expect(sgViewportStateAfter.classArray).to.include('vp-animate');
      expect(sgViewportStateAfter.style.width).to.equal('320px');
      expect(sgSizePxStateAfter.value).to.equal('320');
      expect(sgSizeEmStateAfter.value).to.equal('20.00');
      expect(dataSaverVpWidthAfter).to.equal('320');
    });

    it('resizes with animate off', function () {
      $orgs['#sg-gen-container'].dispatchAction('addClass', 'vp-animate');
      $orgs['#sg-viewport'].dispatchAction('addClass', 'vp-animate');
      dataSaver.removeValue('vpWidth');
      uiProps.wholeMode = true;

      const wholeModeBefore = uiProps.wholeMode;
      const sgGenContainerStateBefore = $orgs['#sg-gen-container'].getState();
      const sgViewportStateBefore = $orgs['#sg-viewport'].getState();
      const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
      const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();
      const dataSaverVpWidthBefore = dataSaver.findValue('vpWidth');

      uiFns.sizeIframe(480, false);

      const wholeModeAfter = uiProps.wholeMode;
      const sgGenContainerStateAfter = $orgs['#sg-gen-container'].getState();
      const sgViewportStateAfter = $orgs['#sg-viewport'].getState();
      const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
      const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();
      const dataSaverVpWidthAfter = dataSaver.findValue('vpWidth');

      expect(wholeModeBefore).to.be.true;
      expect(sgGenContainerStateBefore.classArray).to.include('vp-animate');
      expect(sgGenContainerStateBefore.style.width).to.not.equal('494px');
      expect(sgViewportStateBefore.classArray).to.include('vp-animate');
      expect(sgViewportStateBefore.style.width).to.not.equal('480px');
      expect(sgSizePxStateBefore.value).to.not.equal('480');
      expect(sgSizeEmStateBefore.value).to.not.equal('30.00');
      expect(dataSaverVpWidthBefore).to.equal('');

      expect(wholeModeAfter).to.be.false;
      expect(sgGenContainerStateAfter.classArray).to.not.include('vp-animate');
      expect(sgGenContainerStateAfter.style.width).to.equal('494px');
      expect(sgViewportStateAfter.classArray).to.not.include('vp-animate');
      expect(sgViewportStateAfter.style.width).to.equal('480px');
      expect(sgSizePxStateAfter.value).to.equal('480');
      expect(sgSizeEmStateAfter.value).to.equal('30.00');
      expect(dataSaverVpWidthAfter).to.equal('480');
    });

    it('resizes with animate on and wholeMode on', function () {
      $orgs['#sg-gen-container'].dispatchAction('removeClass', 'vp-animate');
      $orgs['#sg-viewport'].dispatchAction('removeClass', 'vp-animate');
      dataSaver.removeValue('vpWidth');
      uiProps.wholeMode = false;

      const wholeModeBefore = uiProps.wholeMode;
      const sgGenContainerStateBefore = $orgs['#sg-gen-container'].getState();
      const sgViewportStateBefore = $orgs['#sg-viewport'].getState();
      const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
      const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();
      const dataSaverVpWidthBefore = dataSaver.findValue('vpWidth');

      uiFns.sizeIframe(767, true, true);

      const wholeModeAfter = uiProps.wholeMode;
      const sgGenContainerStateAfter = $orgs['#sg-gen-container'].getState();
      const sgViewportStateAfter = $orgs['#sg-viewport'].getState();
      const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
      const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();
      const dataSaverVpWidthAfter = dataSaver.findValue('vpWidth');

      expect(wholeModeBefore).to.be.false;
      expect(sgGenContainerStateBefore.classArray).to.not.include('vp-animate');
      expect(sgGenContainerStateBefore.style.width).to.not.equal('781px');
      expect(sgViewportStateBefore.classArray).to.not.include('vp-animate');
      expect(sgViewportStateBefore.style.width).to.not.equal('767px');
      expect(sgSizePxStateBefore.value).to.not.equal('767');
      expect(sgSizeEmStateBefore.value).to.not.equal('47.94');
      expect(dataSaverVpWidthBefore).to.equal('');

      expect(wholeModeAfter).to.be.true;
      expect(sgGenContainerStateAfter.classArray).to.include('vp-animate');
      expect(sgGenContainerStateAfter.style.width).to.equal('781px');
      expect(sgViewportStateAfter.classArray).to.include('vp-animate');
      expect(sgViewportStateAfter.style.width).to.equal('767px');
      expect(sgSizePxStateAfter.value).to.equal('767');
      expect(sgSizeEmStateAfter.value).to.equal('47.94');
      expect(dataSaverVpWidthAfter).to.equal('767');
    });

    it('resizes with animate off and wholeMode on', function () {
      $orgs['#sg-gen-container'].dispatchAction('removeClass', 'vp-animate');
      $orgs['#sg-viewport'].dispatchAction('removeClass', 'vp-animate');
      dataSaver.removeValue('vpWidth');
      uiProps.wholeMode = true;

      const wholeModeBefore = uiProps.wholeMode;
      const sgGenContainerStateBefore = $orgs['#sg-gen-container'].getState();
      const sgViewportStateBefore = $orgs['#sg-viewport'].getState();
      const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
      const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();
      const dataSaverVpWidthBefore = dataSaver.findValue('vpWidth');

      uiFns.sizeIframe(1024, false, true);

      const wholeModeAfter = uiProps.wholeMode;
      const sgGenContainerStateAfter = $orgs['#sg-gen-container'].getState();
      const sgViewportStateAfter = $orgs['#sg-viewport'].getState();
      const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
      const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();
      const dataSaverVpWidthAfter = dataSaver.findValue('vpWidth');

      expect(wholeModeBefore).to.be.true;
      expect(sgGenContainerStateBefore.classArray).to.not.include('vp-animate');
      expect(sgGenContainerStateBefore.style.width).to.not.equal('1038px');
      expect(sgViewportStateBefore.classArray).to.not.include('vp-animate');
      expect(sgViewportStateBefore.style.width).to.not.equal('1024px');
      expect(sgSizePxStateBefore.value).to.not.equal('1024');
      expect(sgSizeEmStateBefore.value).to.not.equal('64.00');
      expect(dataSaverVpWidthBefore).to.equal('');

      expect(wholeModeAfter).to.be.true;
      expect(sgGenContainerStateAfter.classArray).to.not.include('vp-animate');
      expect(sgGenContainerStateAfter.style.width).to.equal('1038px');
      expect(sgViewportStateAfter.classArray).to.not.include('vp-animate');
      expect(sgViewportStateAfter.style.width).to.equal('1024px');
      expect(sgSizePxStateAfter.value).to.equal('1024');
      expect(sgSizeEmStateAfter.value).to.equal('64.00');
      expect(dataSaverVpWidthAfter).to.equal('1024');
    });

    it('does not resize beyond maxViewportWidth', function () {
      dataSaver.removeValue('vpWidth');

      const sgGenContainerStateBefore = $orgs['#sg-gen-container'].getState();
      const sgViewportStateBefore = $orgs['#sg-viewport'].getState();
      const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
      const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();
      const dataSaverVpWidthBefore = dataSaver.findValue('vpWidth');

      uiFns.sizeIframe(9999);

      const sgGenContainerStateAfter = $orgs['#sg-gen-container'].getState();
      const sgViewportStateAfter = $orgs['#sg-viewport'].getState();
      const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
      const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();
      const dataSaverVpWidthAfter = dataSaver.findValue('vpWidth');

      expect(sgGenContainerStateBefore.style.width).to.not.equal('2614px');
      expect(sgViewportStateBefore.style.width).to.not.equal(uiProps.maxViewportWidth + 'px');
      expect(sgSizePxStateBefore.value).to.not.equal(uiProps.maxViewportWidth.toString());
      expect(sgSizeEmStateBefore.value).to.not.equal('162.50');
      expect(dataSaverVpWidthBefore).to.equal('');

      expect(sgGenContainerStateAfter.style.width).to.equal('2614px');
      expect(sgViewportStateAfter.style.width).to.equal(uiProps.maxViewportWidth + 'px');
      expect(sgSizePxStateAfter.value).to.equal(uiProps.maxViewportWidth.toString());
      expect(sgSizeEmStateAfter.value).to.equal('162.50');
      expect(dataSaverVpWidthAfter).to.equal(uiProps.maxViewportWidth + '');
    });

    it('does not resize beyond minViewportWidth', function () {
      dataSaver.removeValue('vpWidth');

      const sgGenContainerStateBefore = $orgs['#sg-gen-container'].getState();
      const sgViewportStateBefore = $orgs['#sg-viewport'].getState();
      const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
      const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();
      const dataSaverVpWidthBefore = dataSaver.findValue('vpWidth');

      uiFns.sizeIframe(111);

      const sgGenContainerStateAfter = $orgs['#sg-gen-container'].getState();
      const sgViewportStateAfter = $orgs['#sg-viewport'].getState();
      const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
      const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();
      const dataSaverVpWidthAfter = dataSaver.findValue('vpWidth');

      expect(sgGenContainerStateBefore.style.width).to.not.equal('254px');
      expect(sgViewportStateBefore.style.width).to.not.equal(uiProps.minViewportWidth + 'px');
      expect(sgSizePxStateBefore.value).to.not.equal(uiProps.minViewportWidth.toString());
      expect(sgSizeEmStateBefore.value).to.not.equal('15.00');
      expect(dataSaverVpWidthBefore).to.equal('');

      expect(sgGenContainerStateAfter.style.width).to.equal('254px');
      expect(sgViewportStateAfter.style.width).to.equal(uiProps.minViewportWidth + 'px');
      expect(sgSizePxStateAfter.value).to.equal(uiProps.minViewportWidth.toString());
      expect(sgSizeEmStateAfter.value).to.equal('15.00');
      expect(dataSaverVpWidthAfter).to.equal(uiProps.minViewportWidth + '');
    });
  });

  describe('.updatePatternInfo()', function () {
    it('updates document title and raw pattern href', function () {
      const documentTitleBefore = global.document.title;
      const sgRawStateBefore = $orgs['#sg-raw'].getState();

      uiFns.updatePatternInfo('elements-paragraph', 'patterns/00-elements-paragraph/00-elements-paragraph.html');

      const documentTitleAfter = global.document.title;
      const sgRawStateAfter = $orgs['#sg-raw'].getState();

      expect(documentTitleBefore).to.not.equal(documentTitleAfter);
      expect(sgRawStateBefore.attribs.href).to.not.equal(sgRawStateAfter);

      expect(documentTitleAfter).to.equal('Fepper : elements-paragraph');
      expect(sgRawStateAfter.attribs.href).to.equal('patterns/00-elements-paragraph/00-elements-paragraph.html');
    });
  });

  describe('.updateSizeReading()', function () {
    it('updates size reading by default in px for both inputs', function () {
      $orgs['#sg-size-px'].dispatchAction('val', '1024');
      $orgs['#sg-size-em'].dispatchAction('val', '64.00');

      const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
      const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();

      uiFns.updateSizeReading(480);

      const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
      const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();

      expect(sgSizePxStateBefore.value).to.equal('1024');
      expect(sgSizeEmStateBefore.value).to.equal('64.00');

      expect(sgSizePxStateAfter.value).to.equal('480');
      expect(sgSizeEmStateAfter.value).to.equal('30.00');
    });

    it('updates size reading submitted in px for both inputs', function () {
      $orgs['#sg-size-px'].dispatchAction('val', '1024');
      $orgs['#sg-size-em'].dispatchAction('val', '64.00');

      const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
      const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();

      uiFns.updateSizeReading(320, 'px');

      const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
      const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();

      expect(sgSizePxStateBefore.value).to.equal('1024');
      expect(sgSizeEmStateBefore.value).to.equal('64.00');

      expect(sgSizePxStateAfter.value).to.equal('320');
      expect(sgSizeEmStateAfter.value).to.equal('20.00');
    });

    it('updates size reading submitted in em for both inputs', function () {
      $orgs['#sg-size-px'].dispatchAction('val', '1024');
      $orgs['#sg-size-em'].dispatchAction('val', '64.00');

      const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
      const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();

      uiFns.updateSizeReading(47.94, 'em');

      const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
      const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();

      expect(sgSizePxStateBefore.value).to.equal('1024');
      expect(sgSizeEmStateBefore.value).to.equal('64.00');

      expect(sgSizePxStateAfter.value).to.equal('767');
      expect(sgSizeEmStateAfter.value).to.equal('47.94');
    });

    it('updates size reading submitted in px for #sg-size-px input', function () {
      $orgs['#sg-size-px'].dispatchAction('val', '1024');
      $orgs['#sg-size-em'].dispatchAction('val', '64.00');

      const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
      const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();

      uiFns.updateSizeReading(767, 'px', 'updatePxInput');

      const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
      const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();

      expect(sgSizePxStateBefore.value).to.equal('1024');
      expect(sgSizeEmStateBefore.value).to.equal('64.00');

      expect(sgSizePxStateAfter.value).to.equal('767');
      expect(sgSizeEmStateAfter.value).to.equal(sgSizeEmStateAfter.value);
    });

    it('updates size reading submitted in px for #sg-size-em input', function () {
      $orgs['#sg-size-px'].dispatchAction('val', '1024');
      $orgs['#sg-size-em'].dispatchAction('val', '64.00');

      const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
      const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();

      uiFns.updateSizeReading(767, 'px', 'updateEmInput');

      const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
      const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();

      expect(sgSizePxStateBefore.value).to.equal('1024');
      expect(sgSizeEmStateBefore.value).to.equal('64.00');

      expect(sgSizePxStateAfter.value).to.equal(sgSizePxStateAfter.value);
      expect(sgSizeEmStateAfter.value).to.equal('47.94');
    });

    it('updates size reading submitted in em for #sg-size-px input', function () {
      $orgs['#sg-size-px'].dispatchAction('val', '1024');
      $orgs['#sg-size-em'].dispatchAction('val', '64.00');

      const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
      const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();

      uiFns.updateSizeReading(30, 'em', 'updatePxInput');

      const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
      const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();

      expect(sgSizePxStateBefore.value).to.equal('1024');
      expect(sgSizeEmStateBefore.value).to.equal('64.00');

      expect(sgSizePxStateAfter.value).to.equal('480');
      expect(sgSizeEmStateAfter.value).to.equal(sgSizeEmStateAfter.value);
    });

    it('updates size reading submitted in em for #sg-size-em input', function () {
      $orgs['#sg-size-px'].dispatchAction('val', '1024');
      $orgs['#sg-size-em'].dispatchAction('val', '64.00');

      const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
      const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();

      uiFns.updateSizeReading(30, 'em', 'updateEmInput');

      const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
      const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();

      expect(sgSizePxStateBefore.value).to.equal('1024');
      expect(sgSizeEmStateBefore.value).to.equal('64.00');

      expect(sgSizePxStateAfter.value).to.equal(sgSizePxStateAfter.value);
      expect(sgSizeEmStateAfter.value).to.equal('30.00');
    });
  });

  describe('.updateViewportWidth()', function () {
    it('works', function () {
      const sgViewportStateBefore = $orgs['#sg-viewport'].getState();
      const sgGenContainerStateBefore = $orgs['#sg-gen-container'].getState();
      const sgSizePxStateBefore = $orgs['#sg-size-px'].getState();
      const sgSizeEmStateBefore = $orgs['#sg-size-em'].getState();

      uiFns.updateViewportWidth(1280);

      const sgViewportStateAfter = $orgs['#sg-viewport'].getState();
      const sgGenContainerStateAfter = $orgs['#sg-gen-container'].getState();
      const sgSizePxStateAfter = $orgs['#sg-size-px'].getState();
      const sgSizeEmStateAfter = $orgs['#sg-size-em'].getState();

      expect(sgViewportStateBefore).to.not.equal(sgViewportStateAfter);
      expect(sgGenContainerStateAfter).to.not.equal(sgGenContainerStateBefore);
      expect(sgSizePxStateBefore.value).to.not.equal(sgSizePxStateAfter.value);
      expect(sgSizeEmStateBefore.value).to.not.equal(sgSizeEmStateAfter.value);

      expect(sgViewportStateAfter.style.width).to.equal('1280px');
      expect(sgGenContainerStateAfter.style.width).to.equal('1294px');
      expect(sgSizePxStateAfter.value).to.equal('1280');
      expect(sgSizeEmStateAfter.value).to.equal('80.00');
    });
  });
});
