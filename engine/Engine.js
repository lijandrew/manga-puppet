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

  /**
   * @async
   */
  getMangas(sourceName) {
    if (sourceName === "") {
      return [];
    }
    const source = this.getSourceByName(sourceName);
    return source.getMangas();
  },

  /**
   * @async
   */
  getChapters(sourceName, manga) {
    if (sourceName === "" || manga === null) {
      return [];
    }
    return this.getSourceByName(sourceName).getChapters(manga);
  },

  downloadChapter(sourceName, manga, chapter) {
    if (sourceName === "" || manga === null) {
      return [];
    }
    const source = this.getSourceByName(sourceName);
    const downloadJob = new DownloadJob(source, manga, chapter);
    DownloadManager.enqueueJob(downloadJob);
  },
};

module.exports = Engine;
