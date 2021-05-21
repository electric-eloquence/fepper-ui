export default class Timestamper {
  #fepperUi;
  #root;

  constructor(fepperUi, root) {
    this.#fepperUi = fepperUi;
    this.#root = root;
  }

  // In case fepperUi.cookies is undefined at instantiation.
  get cookies() {
    return this.#fepperUi.cookies;
  }

  stoke() {
    const fepperTs = Number(this.cookies.get('fepper_ts') || '0');
    const paramsStr = this.#root.location.search;
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
