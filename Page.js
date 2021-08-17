/**
 * Stores online-relevant (no image data) information
 * about this page, such as its URL, given filename,
 * and what chapter and manga objects it belongs to.
 */
class Page {
  constructor(url, filename, chapter, manga) {
    this.filename = filename;
    this.url = url;
    this.chapter = chapter;
    this.manga = manga;
  }
}

module.exports = Page;
