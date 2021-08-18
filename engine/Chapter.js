/**
 * Chapter information, including
 * its url, formal title, and the
 * manga object it belongs to.
 */
function Chapter(url, title) {
  this.url = url;
  this.title = title;
  this.pages = [];
}

module.exports = Chapter;
