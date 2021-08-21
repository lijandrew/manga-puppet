const axios = require("axios");

const Storage = require("./Storage.js");
const Image = require("./Image.js");

function DownloadJob(source, manga, chapter, callback) {
  this.source = source;
  this.manga = manga;
  this.chapter = chapter;

  // I'm usin this to resolve a Promise to signal that download finished
  this.callback = callback;

  this.start = async () => {
    console.log("DownloadJob:start");
    // Get chapter pages if necessary
    // (user may have clicked download without opening the chapter)
    let pages = await this.source.getPages(this.chapter);
    let images = await Promise.all(
      pages.map((page) => {
        return axios({
          url: page.url,
          responseType: "arraybuffer",
        }).then((response) => {
          return new Image(page.filename, response.data);
        });
      })
    );

    await Storage.saveImagesToCbz(
      this.source,
      this.manga,
      this.chapter,
      images
    );

    /*
    await Storage.saveImagesToFolder(
      this.source,
      this.manga,
      this.chapter,
      images
    );
    */

    this.callback();
  };
}

module.exports = DownloadJob;
