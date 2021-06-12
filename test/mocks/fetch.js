global.fetch = (url) => {
  return new Promise(
    (resolve) => {
      if (url === '/git-api') {
        resolve({status: 200});
      }
    });
};
