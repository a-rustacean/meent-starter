module.exports = (promise, cb) => {
  if (!cb || typeof cb !== "function") return promise;
  promise
    .then((result) => {
      cb(null, result);
    })
    .catch((err) => {
      cb(err, null);
    });
};
