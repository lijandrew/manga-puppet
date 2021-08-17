const fs = require("fs");
const path = require("path");

/**
 * Source superclass. Represents manga sites that can be downloaded from.
 */
class Source {
  constructor(name) {
    this.name = name;
  }

  static async getMangas() {}
  static async getMangaById(id) {}
  static async getChapters(manga) {}
  static async getPages(chapter) {}

  // Prospective methods
  async searchByTitle(title) {}

}

module.exports = Source;
