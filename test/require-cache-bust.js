module.exports = () => {
  delete global.$;

  for (let key in require.cache) {
    if (
      key.includes('jquery') ||
      key.endsWith('/scripts/requerio/organisms.js')
    ) {
      delete require.cache[key];
    }
  }
};
