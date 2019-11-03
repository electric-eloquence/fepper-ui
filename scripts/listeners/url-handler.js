// Be sure to e2e test listeners.

// TODO: Replace closure with private class field when there is greater browser support.
export default function (fepperUiInst) {
  class UrlHandler {
    constructor() {
    }

    listen() {
      window.onpopstate = (e) => {
        fepperUiInst.urlHandler.skipBack = true;
        fepperUiInst.urlHandler.popPattern(e);
      };
    }
  }

  return new UrlHandler(fepperUiInst);
}
