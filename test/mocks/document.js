global.document = {
  createElement: () => {},
  createRange: () => {
    return {
      selectNodeContents: () => {}
    };
  },
  title: 'Fepper'
};
