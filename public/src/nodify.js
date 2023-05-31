/**
 *
 * @template T, E
 * @callback callback
 * @param {E?} err error
 * @param {T?} data data
 * @returns {void}
 */

/**
 *
 * @template T, E
 * @param {Promise<T>} promise promise
 * @param {callback<T, E>} cb callback
 * @returns {Promise<T>}
 */
export default function nodify(promise, cb) {
  if (!cb || typeof cb != "function") return promise;

  promise.then((data) => cb(null, data)).catch((err) => cb(err, null));
  return promise;
}
