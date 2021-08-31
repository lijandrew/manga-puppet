const sanitize = require("sanitize-filename");
const Storage = require("./Storage.js");

/**
 * Source superclass. Represents manga sites.
 */
function Source(name) {
  // Name and filename are the same for asset naming consistency
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

    /*
    // Check local storage
    const mangaFilenames = Storage.getDownloadedMangaFilenames(this);
    if (mangaFilenames.length > 0) {
      console.log("Local mangas found");
      // TODO: ???
    }
    */

    // Attempt to fetch and cache pages from online
    try {
      this.mangas = await this.fetchMangas();
    } catch (e) {
      console.log(e);
    }
    return this.mangas;
  };

  this.getChapters = async (manga) => {
    // Check for cache
    if (manga.chapters.length > 0) {
      return manga.chapters;
    }

    /*
    // Check local storage
    const { chapterFilenames } = Storage.getDownloadedChapterFilenames(
      this,
      manga
    );
    if (chapterFilenames.length > 0) {
      console.log("Local chapters found");
      // TODO: ???
    }
    */

    // Attempt to fetch and cache pages from online
    try {
      manga.chapters = await this.fetchChapters(manga);
    } catch (e) {
      console.log(e);
    }
    return manga.chapters;
  };

  this.getPages = async (manga, chapter) => {
    // Check for cache
    if (chapter.pages.length > 0) {
      return chapter.pages;
    }

    /*
    // Check local storage
    const { chapterFilenames } = Storage.getDownloadedChapterFilenames(
      this,
      manga
    );
    if (chapterFilenames.length > 0) {
      console.log("Local pages found");
      // TODO: ???
    }
    */

    // Attempt to fetch and cache pages from online
    try {
      chapter.pages = await this.fetchPages(chapter);
    } catch (e) {
      console.log(e);
    }
    return chapter.pages;
  };
}

module.exports = Source;
