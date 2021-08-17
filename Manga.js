/**
 * Manga information. Highest level of
 * the Manga-Chapter-Page class trio.
 * Stores the id, which is the website URL
 * representation of the title, as well as
 * the actual formal title.
 */
class Manga {
  constructor(id, title) {
    this.id = id;
    this.title = title;
  }
}

module.exports = Manga;
