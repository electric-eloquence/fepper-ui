// TODO: Replace closure with private class field when there is greater browser support.
export default function (fepperUiInst, root) {
  class Timestamper {
    constructor() {
    }

    // In case fepperUi.cookies is undefined at instantiation.
    get cookies() {
      return fepperUiInst.cookies;
    }

    stoke() {
      const fepperTs = Number(this.cookies.get('fepper_ts') || '0');
      const paramsStr = root.location.search;
      let timestamp = 0;

      if (paramsStr) {
        const paramsObj = new URLSearchParams(paramsStr.slice(1));
        timestamp = parseInt(paramsObj.get('ts'));
      }

      /* istanbul ignore if */
      if (!timestamp || Number.isNaN(timestamp)) {
        return;
      }

      // Only write timestamp to cookie if the cookie doesn't exist or if timestamp > cookie value.
      if (timestamp > fepperTs) {
        this.cookies.set('fepper_ts', timestamp, {maxAge: 31536000, path: '/', sameSite: 'strict'});
      }
    }
  }

  return new Timestamper();
}
