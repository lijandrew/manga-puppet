/**
 * Chapter information, including
 * its url, formal title, and the
 * manga object it belongs to.
 */
class Chapter {
  constructor(url, title, manga) {
    this.url = url;
    this.title = title;
    this.manga = manga;
  }
}

module.exports = Chapter;
