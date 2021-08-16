const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { JSDOM } = require("jsdom");
const puppeteer = require("puppeteer");

const Source = require("./Source.js");

class MangaLife extends Source {
  constructor() {
    super("MangaLife");
  }

  async getTitle(id) {
    let response = await axios.get(`https://manga4life.com/rss/${id}.xml`);
    const dom = new JSDOM("");
    const DOMParser = dom.window.DOMParser;
    const parser = new DOMParser();
    const document = parser.parseFromString(response.data, "text/xml");
    return document.querySelector("channel > title").textContent;
  }

  async getChapters(id) {
    let response = await axios.get(`https://manga4life.com/rss/${id}.xml`);
    const dom = new JSDOM("");
    const DOMParser = dom.window.DOMParser;
    const parser = new DOMParser();
    const document = parser.parseFromString(response.data, "text/xml");
    let mangaTitle = await this.getTitle(id);
    let chapters = [...document.querySelectorAll("item")]
      .map((elem) => {
        let url = elem
          .querySelector("link")
          .textContent.replace(/-page-\d+/, "");
        let title = elem
          .querySelector("title")
          .textContent.replace(new RegExp(`\\ *${mangaTitle.trim()}\\ *`), "");
        return {
          url,
          title,
        };
      })
      .reverse();
    return chapters;
  }

  async downloadChapter(id, chapter) {
    /*
    Use puppeteer to get image urls.
    puppeteer is needed because image urls are unpredictable,
    as they can come from different sources (i.e. different scanlators)
    */
    const browser = await puppeteer.launch();
    const [page] = await browser.pages();
    await page.goto(chapter.url, { waitUntil: "networkidle0" });
    let imageUrls = await page.evaluate(() =>
      [...document.querySelectorAll("div.ImageGallery div[ng-repeat] img")].map(
        (elem) => elem.src
      )
    );
    await browser.close();
    console.log(imageUrls);

    // Prepare download directory
    const downloadPath = path.join(
      __dirname,
      this.downloadBaseDir,
      this.sourceName,
      await this.getTitle(id),
      chapter.title
    );
    if (!fs.existsSync(downloadPath)) {
      fs.mkdirSync(downloadPath, { recursive: true });
    }

    // Start all page image downloads
    let downloadPromises = [];
    for (let i = 1; i <= imageUrls.length; i++) {
      let url = imageUrls[i - 1];
      let extension = url.split(/[#?]/)[0].split(".").pop().trim();
      downloadPromises.push(
        axios({
          url: url,
          responseType: "stream",
        }).then((response) => {
          response.data.pipe(
            fs.createWriteStream(path.join(downloadPath, `${i}.${extension}`))
          );
        })
      );
    }

    // Return single grouped Promise (purely for waiting purposes)
    return Promise.all(downloadPromises);
  }
}

module.exports = MangaLife;
