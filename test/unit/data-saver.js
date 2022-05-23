import {expect} from 'chai';

import fepperUi from '../unit';

const dataSaver = fepperUi.dataSaver;

describe('dataSaver', function () {
  after(function () {
    dataSaver.removeValue('foo');
    dataSaver.removeValue('vpWidth');
    dataSaver.removeValue('vpHeight');
  });

  describe('.constructor()', function () {
    it('works', function () {
      expect(dataSaver.constructor.name).to.equal('DataSaver');
      expect(Object.keys(dataSaver).length).to.equal(1);
      expect(dataSaver).to.have.property('cookieName');
      expect(dataSaver).to.have.property('cookies');
    });
  });

  describe('.addValue()', function () {
    it('saves submitted strings as strings', function () {
      const valueBefore = dataSaver.findValue('foo');

      dataSaver.addValue('foo', 'bar');

      const valueAfter = dataSaver.findValue('foo');

      expect(valueBefore).to.be.null;

      expect(valueAfter).to.equal('bar');
    });

    it('saves submitted numbers as strings', function () {
      dataSaver.removeValue('vpWidth');

      const valueBefore = dataSaver.findValue('vpWidth');

      dataSaver.addValue('vpWidth', 1337);

      const valueAfter = dataSaver.findValue('vpWidth');

      expect(valueBefore).to.be.null;

      expect(valueAfter).to.equal('1337');
    });

    it('does not overwrite previously saved value', function () {
      const valueBefore = dataSaver.findValue('vpWidth');

      dataSaver.addValue('vpWidth', 'leet');

      const valueAfter = dataSaver.findValue('vpWidth');

      expect(valueBefore).to.equal(valueAfter);

      expect(valueAfter).to.equal('1337');
    });
  });

  describe('.updateValue()', function () {
    it('updates value if previously saved', function () {
      const valueBefore = dataSaver.findValue('vpWidth');

      dataSaver.updateValue('vpWidth', 1970);

      const valueAfter = dataSaver.findValue('vpWidth');

      expect(valueBefore).to.not.equal(valueAfter);

      expect(valueAfter).to.equal('1970');
    });

    it('adds value if not previously stored', function () {
      dataSaver.removeValue('vpWidth');

      const valueBefore = dataSaver.findValue('vpWidth');

      dataSaver.updateValue('vpWidth', 1970);

      const valueAfter = dataSaver.findValue('vpWidth');

      expect(valueBefore).to.be.null;

      expect(valueAfter).to.equal('1970');
    });
  });

  describe('.removeValue()', function () {
    it('works', function () {
      dataSaver.addValue('vpHeight', fepperUi.uiProps.sh);

      const fooBefore = dataSaver.findValue('foo');

      dataSaver.removeValue('foo');

      const fooAfter = dataSaver.findValue('foo');

      expect(fooBefore).to.not.equal(fooAfter);

      expect(fooAfter).to.be.null;
    });
  });

  describe('.findValue()', function () {
    it('return empty string if the value does not exist', function () {
      dataSaver.removeValue('vpWidth');

      const value = dataSaver.findValue('vpWidth');

      expect(value).to.be.null;
    });

    it('returns the value if it exists', function () {
      dataSaver.addValue('vpWidth', 1337);

      const value = dataSaver.findValue('vpWidth');

      expect(value).to.equal('1337');
    });
  });
});
