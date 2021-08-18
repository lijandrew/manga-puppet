/**
 * Stores superficial (no binary data) information
 * about this page, such as its URL, given filename,
 * and what chapter and manga objects it belongs to.
 */
function Page(url, filename) {
  this.url = url;
  this.filename = filename;
}

module.exports = Page;
