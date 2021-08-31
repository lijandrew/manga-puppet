// Engine.js
// Used by electron.js to access and use the backend engine

const Storage = require("./Storage.js");
const DownloadManager = require("./DownloadManager.js");
const DownloadJob = require("./DownloadJob.js");
const MangaLife = require("./sources/MangaLife.js");

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

  // Returns Promise
  getPages(sourceName, manga, chapter) {
    if (!chapter) {
      return;
    }
    const source = this.getSourceByName(sourceName);
    if (!source) {
      return;
    }
    return this.getSourceByName(sourceName).getPages(manga, chapter);
  },

  // Enqueues a downloadJob with the given callback
  // The callback is to be used to alert on completion
  downloadChapter(sourceName, manga, chapter, callback) {
    if (!manga || !chapter) {
      return;
    }
    const source = this.getSourceByName(sourceName);
    if (!source) {
      return;
    }
    const downloadJob = new DownloadJob(source, manga, chapter, callback);
    DownloadManager.enqueueJob(downloadJob);
  },

  getDownloadingChapterFilenames(sourceName, manga) {
    if (!manga) {
      return;
    }
    const source = this.getSourceByName(sourceName);
    if (!source) {
      return;
    }
    return DownloadManager.getDownloadingChapterFilenames(source, manga);
  },

  getDownloadedChapterFilenames(sourceName, manga) {
    if (!manga) {
      return;
    }
    const source = this.getSourceByName(sourceName);
    if (!source) {
      return;
    }
    return Storage.getDownloadedChapterFilenames(source, manga);
  },
};

module.exports = Engine;
