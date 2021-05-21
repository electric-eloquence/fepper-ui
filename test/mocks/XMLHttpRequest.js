global.XMLHttpRequest = class {
  constructor() {
    this.responseURL = null;
  }

  open(method, url) {
    this.responseURL = url;
  }

  send() {
    let status;

    if (this.responseURL.startsWith('patterns/01-compounds-block/01-compounds-block.md')) {
      status = 200;
    }

    this.onload.call({
      responseText: 'SUCCESS!',
      status
    });
  }
};
