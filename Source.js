/**
 * Source superclass. Represents manga sites that can be downloaded from.
 */
class Source {
  constructor(sourceName) {
    this.downloadBaseDir = "downloads";
    this.sourceName = sourceName;
  }

  async getTitle(id) {}

  /*
  chapter = {
    url: "...",
    title: "...",
  };
  */
  async getChapters(id) {}

  async downloadChapter(id, chapter) {}

  async downloadAllChapters(id) {
    let chapters = await this.getChapters(id);
    let chapterPromises = chapters.map((chapter) =>
      this.downloadChapter(id, chapter)
    );
    await Promise.all(chapterPromises);
  }
}

module.exports = Source;
