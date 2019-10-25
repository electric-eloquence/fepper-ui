import Feplet from '../node_modules/feplet/dist/feplet.browser.es6.min.js';
import FepperUi from './requerio/fepper-ui.js';
import Listeners from './listeners/index.js';
import $organisms from './requerio/organisms.js';
import Requerio from '../node_modules/requerio/dist/requerio.npm.mjs';
import * as uiComp from './ui/compilation.js';
import * as uiData from './ui/data.js';

window.Feplet = Feplet;

const fepperUi = new FepperUi(Requerio, window.$, window.Redux, $organisms, window, uiData);
const listeners = new Listeners(fepperUi);
// uiComp allows for UI customization. Defining after instantiation so tests can use a non-customized compilation.
fepperUi.uiComp = uiComp;

for (let classKey of Object.keys(fepperUi)) {
  if (fepperUi[classKey] instanceof Object && typeof fepperUi[classKey].stoke === 'function') {
    fepperUi[classKey].stoke();
  }
}

listeners.listen();
