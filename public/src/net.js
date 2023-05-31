/**
 *
 * @typedef {{ message: string }} PostError
 */

/**
 *
 * @template T
 * @typedef {{ success: boolean, error?: PostError, data?: T, redirect?: string }} PostResult
 * */

import nodify from "./nodify.js";

/**
 *
 * @param {string} uri the uri to redirect to
 */
export function redirect(uri) {
  const anchor = document.createElement("a");
  anchor.href = uri;
  anchor.click();
}

/**
 *
 * @template T, B
 * @param {string} uri the uri to send post request to
 * @param {B} body body of the request
 * @returns {Promise<T>}
 */
async function _post(uri, body) {
  /** @type {PostResult<T>} */
  const res = await fetch(uri, {
    method: "POST",
    body,
  }).then((r) => r.json());
  if (res.redirect) redirect(res.redirect);
  if (res.error) throw res.error;
  return res.data;
}

/**
 *
 * @template T, B
 * @param {string} uri the uri to send post request to
 * @param {B} body the body of the request
 * @param {import("./nodify").callback<T, PostError>} cb callback
 * @returns {Promise<T>}
 */
export function post(uri, body, cb) {
  return nodify(_post(uri, body), cb);
}
