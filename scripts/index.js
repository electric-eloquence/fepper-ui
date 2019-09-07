import Feplet from '../node_modules/feplet/dist/feplet.browser.es6.min.js';
import FepperUi from './requerio/fepper-ui.js';
import Requerio from '../node_modules/requerio/src/requerio.js';
import $organisms from './requerio/organisms.js';
import Listeners from './listeners/index.js';
import * as uiComp from './ui/compilation.js';

window.Feplet = Feplet;

const fepperUi = new FepperUi(Requerio, window.$, window.Redux, $organisms, window);
const listeners = new Listeners(fepperUi);
fepperUi.uiComp = uiComp;

Object.keys(fepperUi).forEach((classKey) => {
  if (fepperUi[classKey] instanceof Object && typeof fepperUi[classKey].stoke === 'function') {
    fepperUi[classKey].stoke();
  }
});

listeners.listen();
