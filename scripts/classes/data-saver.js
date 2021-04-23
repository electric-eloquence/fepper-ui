/**
 * This cookie-handler stores cookies delimited by characters that the Firefox Storage Inspector parses into objects.
 * @see {@link https://developer.mozilla.org/en-US/docs/Tools/Storage_Inspector#sidebar}
 */
export default class DataSaver {
  #fepperUi;

  constructor(cookieName, fepperUi) {
    this.#fepperUi = fepperUi;

    this.cookieName = cookieName;
  }

  /* GETTER for fepperUi.cookies in case it is undefined at instantiation. */

  get cookies() {
    return this.#fepperUi.cookies;
  }

  /* METHODS */

  /**
   * Add a given value to the cookie. Do not update if it already exists.
   *
   * @param {string} name - The name of the key.
   * @param {string} val - The value.
   */
  addValue(name, val) {
    const cookieValOrig = this.cookies.get(this.cookieName);
    let cookieValNew = name + '=' + val;

    if (cookieValOrig) {
      cookieValNew = cookieValOrig + ':' + cookieValNew;
    }

    this.cookies.set(this.cookieName, cookieValNew, {sameSite: 'strict'});
  }

  /**
   * Update a value found in the cookie. If the key doesn't exist, add the value.
   *
   * @param {string} name - The name of the key.
   * @param {string} val - The value.
   */
  updateValue(name, val) {
    if (this.findValue(name)) {
      const cookieVal = this.cookies.get(this.cookieName) || '';
      const cookieVals = cookieVal.split(':');
      let cookieValNew = '';

      for (let i = 0; i < cookieVals.length; i++) {
        const fieldVals = cookieVals[i].split('=');

        if (fieldVals[0] === name) {
          fieldVals[1] = val;
        }

        if (i) {
          cookieValNew += ':';
        }

        cookieValNew += fieldVals[0] + '=' + fieldVals[1];
      }

      this.cookies.set(this.cookieName, cookieValNew, {sameSite: 'strict'});
    }
    else {
      this.addValue(name, val);
    }
  }

  /**
   * Remove the given key.
   *
   * @param {string} name - The name of the key.
   */
  removeValue(name) {
    const cookieVal = this.cookies.get(this.cookieName) || '';
    const cookieVals = cookieVal.split(':');
    let k = 0;
    let cookieValNew = '';

    for (let i = 0; i < cookieVals.length; i++) {
      const fieldVals = cookieVals[i].split('=');

      if (fieldVals[0] !== name) {
        if (k) {
          cookieValNew += ':';
        }

        cookieValNew += fieldVals[0] + '=' + fieldVals[1];
        k++;
      }
    }

    this.cookies.set(this.cookieName, cookieValNew, {sameSite: 'strict'});
  }

  /**
   * Find the value using the given key.
   *
   * @param {string} name - The name of the key.
   * @returns {string} The value of the key or empty string if the value isn't found.
   */
  findValue(name) {
    const cookieVal = this.cookies.get(this.cookieName) || '';
    const cookieVals = cookieVal.split(':');

    for (let i = 0; i < cookieVals.length; i++) {
      const fieldVals = cookieVals[i].split('=');

      if (fieldVals[0] === name) {
        return fieldVals[1];
      }
    }

    return '';
  }
}
