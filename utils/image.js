const sharp = require("sharp");

/**
 *
 * @param {Buffer} buffer the buffer of the image
 * @param {number} [width=2000] width of the resized image
 * @returns {Promise<Buffer>} modified buffer formated to jpeg
 */
function createImage(buffer, width = 2000) {
  return sharp(buffer).resize({ width }).jpeg({ mozjpeg: true }).toBuffer();
}

/**
 *
 * @param {Buffer} image the image documentt
 * @returns {string} dataUri
 */
function toDataUri(image) {
  const prefix = "data:image/jpeg;base64,";
  return prefix + image.toString("base64");
}

module.exports = {
  createImage,
  toDataUri,
};
