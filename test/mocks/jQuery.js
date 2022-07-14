module.exports = () => {
  const onLoad = (eventName, callback) => {
    if (eventName === 'load') {
      callback();
    }
  };

  window.$.prototype.on = onLoad;
  window.$.prototype.one = onLoad;
};
