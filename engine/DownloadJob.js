const axios = require("axios");
const axiosRetry = require("axios-retry");
axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });
/*
axiosRetry(axios, {
  retries: 3,
  retryDelay: () => {
    console.log("-------------RETRYING-------------");
    return 1000;
  },
  retryCondition: (error) => true, // Retry no matter what. For testing.
});
*/

const Storage = require("./Storage.js");
const Image = require("./Image.js");

function DownloadJob(source, manga, chapter, callback) {
  this.source = source;
  this.manga = manga;
  this.chapter = chapter;

  // Used in Engine.js to resolve a Promise to signal that download finished
  this.callback = callback;

  this.start = async () => {
    console.log("DownloadJob:start");
    // Get chapter pages if necessary
    // (user may have clicked download without opening the chapter)
    let imagesError = null;
    let pages = await this.source.getPages(this.manga, this.chapter);
    let images = await Promise.all(
      pages.map((page) => {
        return axios({
          url: page.url,
          responseType: "arraybuffer",
        }).then((response) => {
          return new Image(page.filename, response.data);
        });
      })
    ).catch((error) => {
      console.log("THERE WAS A DOWNLOAD ERROR");
      imagesError = error;
    });

    if (!imagesError) {
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
    }
    this.callback(imagesError);
  };
}

module.exports = DownloadJob;
