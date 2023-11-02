function extension(name) {
  const sep = name.split(".");
  if (sep.length < 2) return null;
  return sep[sep.length - 1];
}

module.exports = { extension };
