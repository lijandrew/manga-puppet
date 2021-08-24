const sanitize = require("sanitize-filename");

/**
 * Source superclass. Represents manga sites.
 */
function Source(name) {
  // hotfix: name and filename are the same for asset naming consistency
  // without having to pass filename into electron frontend
  this.name = sanitize(name);
  this.filename = sanitize(name);
  this.mangas = [];

  // To be implemented by child
  this.fetchMangas = async () => {};
  this.fetchChapters = async (manga) => {};
  this.fetchPages = async (chapter) => {};
  this.fetchCoverImageUrl = async (manga) => {};
  this.fetchDetails = async (manga) => {};

  this.clearCache = async () => {
    this.mangas = [];
  };

  this.getDetails = async (manga) => {
    // Check for cache
    for (let detail in manga.details) {
      if (manga.details[detail] !== "") {
        return manga.details;
      }
    }
    // Cache
    manga.details = await this.fetchDetails(manga);
    return manga.details;
  };

  this.getMangas = async () => {
    // Check for cache
    if (this.mangas.length > 0) {
      return this.mangas;
    }
    // Cache
    this.mangas = await this.fetchMangas();
    return this.mangas;
  };

  this.getChapters = async (manga) => {
    // Check for cache
    if (manga.chapters.length > 0) {
      return manga.chapters;
    }
    // Cache
    manga.chapters = await this.fetchChapters(manga);
    return manga.chapters;
  };

  this.getPages = async (chapter) => {
    // Check for cache
    if (chapter.pages.length > 0) {
      return chapter.pages;
    }
    // Cache
    chapter.pages = await this.fetchPages(chapter);
    return chapter.pages;
  };
}

module.exports = Source;
