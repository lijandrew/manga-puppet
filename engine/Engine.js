// Engine.js
// Used by electron.js to access and use the backend engine

const MangaLife = require("./sources/MangaLife.js");
const DownloadManager = require("./DownloadManager.js");
const DownloadJob = require("./DownloadJob.js");

const Engine = {
  getSources() {
    return [MangaLife];
  },

  getSourceNames() {
    return this.getSources().map((source) => source.name);
  },

  getSourceByName(sourceName) {
    let result = this.getSources().filter(
      (source) => source.name === sourceName
    )[0];
    return result;
  },

  // Returns a Promise
  getMangas(sourceName) {
    if (sourceName === "") {
      return [];
    }
    const source = this.getSourceByName(sourceName);
    return source.getMangas();
  },

  // Returns a Promise
  getChapters(sourceName, manga) {
    if (sourceName === "" || manga === null) {
      return [];
    }
    return this.getSourceByName(sourceName).getChapters(manga);
  },

  // Returns nothing for now
  downloadChapters(sourceName, manga, chapters) {
    if (sourceName === "" || manga === null || chapters.length === 0) {
      return [];
    }
    const source = this.getSourceByName(sourceName);
    chapters.forEach((chapter) => {
      DownloadManager.enqueueJob(new DownloadJob(source, manga, chapter));
    });

    // Promise that resolves when DownloadManager finishes all in queue
    return DownloadManager.start();
  },
};

module.exports = Engine;
