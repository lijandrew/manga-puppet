const sanitize = require("sanitize-filename");

/**
 * Chapter information, including
 * its url, formal title, and the
 * manga object it belongs to.
 */
function Chapter(url, title) {
  this.url = url;
  this.title = title;
  this.filename = sanitize(title);
  this.pages = [];
}

module.exports = Chapter;
