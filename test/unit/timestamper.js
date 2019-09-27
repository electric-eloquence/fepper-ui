import {expect} from 'chai';

import Timestamper from '../../scripts/classes/timestamper';
import fepperUi from '../unit';

const timestamper = fepperUi.timestamper;

describe('timestamper', function () {
  describe('.constructor()', function () {
    it('works', function () {
      expect(timestamper).to.be.an.instanceof(Timestamper);
      expect(Object.keys(timestamper).length).to.equal(1);
      expect(timestamper).to.have.property('cookies');
    });
  });

  describe('.stoke()', function () {
    it('sets timestamp cookie from search param if never set', function () {
      global.location = {
        search: '?ts=123456789'
      };

      const valueBefore = timestamper.cookies.get('fepper_ts');

      timestamper.stoke();

      const valueAfter = timestamper.cookies.get('fepper_ts');

      expect(valueBefore).to.be.undefined;

      expect(valueAfter).to.equal(123456789);
    });

    it('does not set timestamp cookie from search param if search param is less than cookie value', function () {
      global.location = {
        search: '?ts=12345678'
      };

      const valueBefore = timestamper.cookies.get('fepper_ts');

      timestamper.stoke();

      const valueAfter = timestamper.cookies.get('fepper_ts');

      expect(valueBefore).to.equal(valueAfter);
    });

    it('sets timestamp cookie from search param if search param is greater than cookie value', function () {
      global.location = {
        search: '?ts=1234567890'
      };

      const valueBefore = timestamper.cookies.get('fepper_ts');

      timestamper.stoke();

      const valueAfter = timestamper.cookies.get('fepper_ts');

      expect(valueBefore).to.not.equal(valueAfter);

      expect(valueAfter).to.equal(1234567890);
    });
  });
});
