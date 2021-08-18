// Engine.js
// Used by electron.js to access and use the backend engine

const MangaLife = require("./sources/MangaLife.js");

const Engine = {
  getSources() {
    return [MangaLife];
  },
  getSourceNames() {
    return this.getSources().map((source) => source.name);
  },
  getSourceByName(sourceName) {
    let result = this.getSources().filter((source) => source.name === sourceName)[0];
    return result;
  },

  /**
   * @async
   */
  getMangasBySourceName(sourceName) {
    if (sourceName === "") {
      return [];
    }
    console.log(sourceName);
    let source = this.getSourceByName(sourceName);
    return source.getMangas();
  },
};

module.exports = Engine;
