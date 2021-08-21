// Engine.js
// Used by electron.js to access and use the backend engine

const MangaLife = require("./sources/MangaLife.js");
const DownloadManager = require("./DownloadManager.js");
const Storage = require("./Storage.js");
const DownloadJob = require("./DownloadJob.js");

const Engine = {
  getSources() {
    return [MangaLife];
  },

  getSourceNames() {
    return this.getSources().map((source) => source.name);
  },

  getSourceByName(sourceName) {
    return this.getSources()[this.getSourceNames().indexOf(sourceName)];
  },

  // Returns Promise
  getMangas(sourceName) {
    const source = this.getSourceByName(sourceName);
    return source ? source.getMangas() : Promise.resolve([]);
  },

  // Returns Promise
  getCoverImageUrl(sourceName, manga) {
    const source = this.getSourceByName(sourceName);
    return source ? source.getCoverImageUrl(manga) : Promise.resolve("");
  },

  // Returns Promise
  getDetails(sourceName, manga) {
    const source = this.getSourceByName(sourceName);
    return source
      ? source.getDetails(manga)
      : Promise.resolve({
          authors: "",
          genres: "",
          releasedate: "",
          status: "",
          description: "",
        });
  },

  // Returns Promise
  getChapters(sourceName, manga) {
    if (sourceName === "" || !manga) {
      return Promise.resolve([]);
    }
    return this.getSourceByName(sourceName).getChapters(manga);
  },

  // Returns Promise that resolves when download finishes
  downloadChapter(sourceName, manga, chapter) {
    if (!manga || !chapter) {
      return;
    }
    const source = this.getSourceByName(sourceName);
    if (!source) {
      return;
    }
    return new Promise((resolve) => {
      const downloadJob = new DownloadJob(source, manga, chapter, () => {
        // Use callback to resolve when download finishes
        resolve();
      });
      DownloadManager.enqueueJob(downloadJob);
    });
  },

  getLocalChapterTitles(sourceName, manga) {
    if (!manga) {
      return;
    }
    const source = this.getSourceByName(sourceName);
    if (!source) {
      return;
    }
    return Storage.getLocalChapterTitles(source, manga);
  },
};

module.exports = Engine;
