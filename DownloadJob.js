const axios = require("axios");
const path = require("path");

const Storage = require("./Storage.js");
const Image = require("./Image.js");

class DownloadJob {
  constructor(pages) {
    this.pages = pages;
  }

  async start() {
    console.log("DownloadJob: start");
    let imagePromises = this.pages.map((page) => {
      return axios({
        url: page.url,
        responseType: "arraybuffer",
      }).then((response) => {
        return new Image(page.filename, response.data);
      });
    });
    let images = await Promise.all(imagePromises);

    let mangaTitle = this.pages[0].chapter.manga.title;
    let chapterTitle = this.pages[0].chapter.title;

    await Storage.saveImagesToFolder(
      path.join(__dirname, "downloads", mangaTitle, chapterTitle),
      images
    );
  }
}

module.exports = DownloadJob;
