/**
 * Chapter information, including
 * its url, formal title, and the
 * manga object it belongs to.
 */
class Chapter {
  constructor(url, title) {
    this.url = url;
    this.title = title;
    this.pages = [];
  }
}

module.exports = Chapter;
