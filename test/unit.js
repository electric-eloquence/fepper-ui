/**
 * Unit test initializer.
 */
import fs from 'fs';
import path from 'path';

import cheerio from 'cheerio';
import Feplet from 'feplet';
import * as Redux from 'redux';
import Requerio from 'requerio';
import Cookies from 'universal-cookie';

import FepperUi from '../scripts/requerio/fepper-ui';
import $organisms from '../scripts/requerio/organisms';
import * as uiComp from './fixtures/ui-compilation';
import * as uiData from './fixtures/ui-data';

global.Feplet = Feplet;
global.UniversalCookie = Cookies;

const html = fs.readFileSync(path.resolve(__dirname, 'fixtures', 'index.html'), 'utf8');
const $ = global.$ = cheerio.load(html);

// Use "require" to load after imports and declarations.
require('fepper/excludes/profiles/base/source/_scripts/src/variables.styl');
require('./mocks/bloodhound');
require('./mocks/document');
require('./mocks/DOMParser');
require('./mocks/fetch');
require('./mocks/he');
require('./mocks/history');
require('./mocks/location');
require('./mocks/Prism');
require('./mocks/XMLHttpRequest');

const fepperUi = new FepperUi(Requerio, $, Redux, $organisms, global, uiData);
fepperUi.uiComp = uiComp;

export default fepperUi;

// Use "require" to load after inception of organisms.
require('./mocks/organisms');
