import {expect} from 'chai';

describe('timestamper', function () {
  let fepperUi;
  let timestamper;

  before(function () {
    const $organisms = require('../../scripts/requerio/organisms').default;

    fepperUi = require('../unit')($organisms);
    timestamper = fepperUi.timestamper;
  });

  after(function () {
    require('../require-cache-bust')();
  });

  describe('.constructor()', function () {
    it('works', function () {
      expect(timestamper.constructor.name).to.equal('Timestamper');
      expect(Object.keys(timestamper).length).to.equal(0);
      expect(timestamper).to.have.property('cookies');
    });
  });

  describe('.stoke()', function () {
    it('sets timestamp cookie from search param if never set', function () {
      global.location.search = '?ts=123456789';

      const valueBefore = timestamper.cookies.get('fepper_ts');

      timestamper.stoke();

      const valueAfter = timestamper.cookies.get('fepper_ts');

      expect(valueBefore).to.be.undefined;

      expect(valueAfter).to.equal('123456789');
    });

    it('does not set timestamp cookie from search param if search param is less than cookie value', function () {
      global.location.search = '?ts=12345678';

      const valueBefore = timestamper.cookies.get('fepper_ts');

      timestamper.stoke();

      const valueAfter = timestamper.cookies.get('fepper_ts');

      expect(valueBefore).to.equal(valueAfter);
    });

    it('sets timestamp cookie from search param if search param is greater than cookie value', function () {
      global.location.search = '?ts=1234567890';

      const valueBefore = timestamper.cookies.get('fepper_ts');

      timestamper.stoke();

      const valueAfter = timestamper.cookies.get('fepper_ts');

      expect(valueBefore).to.not.equal(valueAfter);

      expect(valueAfter).to.equal('1234567890');
    });
  });
});
