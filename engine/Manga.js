/**
 * Manga information.
 */
function Manga(id, url, title) {
  this.id = id;
  this.url = url;
  this.title = title;
  this.chapters = [];
}

module.exports = Manga;
