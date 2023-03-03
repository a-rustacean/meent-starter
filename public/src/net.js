/** @typedef {{ success: boolean, error: { message: string } | undefined, result: any }} PostResult */

/**
 * 
 * @param {string} uri the uri to redirect to
 */
function redirect(uri) {
  const anchor = document.createElement("a");
  anchor.href = uri;
  anchor.click();
}

/**
 * 
 * @param {string} uri the uri to send post request to
 * @returns {Promise<PostResult>}
 */
async function post(uri) {
  const res = await fetch(uri).then(r => r.json());
  if (res.redirect) redirect(res.redirect);
  return res;
}

export default {
  redirect,
  post
}
