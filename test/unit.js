/**
 * Unit test initializer.
 */
import fs from 'fs';
import path from 'path';

import {JSDOM} from 'jsdom';
import Feplet from 'feplet';
import * as Redux from 'redux';
import Requerio from 'requerio';
import UniversalCookie from 'universal-cookie';
import 'fepper/excludes/profiles/base/source/_scripts/src/variables.styl';

import FepperUi from '../scripts/requerio/fepper-ui';
import * as uiData from './fixtures/ui-data';

module.exports = ($organisms) => {
  const html = fs.readFileSync(path.resolve(__dirname, 'fixtures', 'index.html'), 'utf8');
  const {window} = new JSDOM(html);
  window.Feplet = Feplet;
  window.UniversalCookie = UniversalCookie;
  global.window = window;
  global.document = window.document;

  global.$ = window.$ = window.jQuery = require('jquery');
  global.fetch = require('./mocks/fetch');
  global.history = require('./mocks/history');
  window.Bloodhound = require('./mocks/bloodhound');
  window.he = require('./mocks/he');
  require('./mocks/jQuery')();

  const fepperUi = new FepperUi(Requerio, window.$, Redux, $organisms, global, uiData);

  require('./mocks/location')(fepperUi.requerio.$orgs);

  window.outerWidth = window.innerWidth = 1024;
  window.outerHeight = window.innerHeight = 768;

  return fepperUi;
};
