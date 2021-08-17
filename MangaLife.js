const axios = require("axios");
const { JSDOM } = require("jsdom");
const puppeteer = require("puppeteer");

const Source = require("./Source.js");
const Manga = require("./Manga");
const Chapter = require("./Chapter.js");
const Page = require("./Page.js");

class MangaLife extends Source {
  constructor() {
    super("MangaLife");
  }

  static async getMangas() {}

  static async getMangaById(id) {
    let response = await axios.get(`https://manga4life.com/rss/${id}.xml`);
    const dom = new JSDOM("");
    const DOMParser = dom.window.DOMParser;
    const parser = new DOMParser();
    const document = parser.parseFromString(response.data, "text/xml");
    let title = document.querySelector("channel > title").textContent;
    return new Manga(id, title);
  }

  static async getChapters(manga) {
    let response = await axios.get(
      `https://manga4life.com/rss/${manga.id}.xml`
    );
    const dom = new JSDOM("");
    const DOMParser = dom.window.DOMParser;
    const parser = new DOMParser();
    const document = parser.parseFromString(response.data, "text/xml");
    let chapters = [...document.querySelectorAll("item")]
      .map((elem) => {
        let url = elem
          .querySelector("link")
          .textContent.replace(/-page-\d+/, "");
        let title = elem
          .querySelector("title")
          .textContent.replace(new RegExp(`\\ *${manga.title}\\ *`), "");
        return new Chapter(url, title, manga);
      })
      .reverse();
    return chapters;
  }

  static async getPages(chapter) {
    // Get image urls using puppeteer
    const browser = await puppeteer.launch();
    const [page] = await browser.pages();
    await page.goto(chapter.url, { waitUntil: "networkidle0" });
    let imageUrls = await page.evaluate(() =>
      [...document.querySelectorAll("div.ImageGallery div[ng-repeat] img")].map(
        (elem) => elem.src
      )
    );
    await browser.close();

    let pages = [];
    for (let i = 0; i < imageUrls.length; i++) {
      let url = imageUrls[i];
      let extension = url.split(/[#?]/)[0].split(".").pop().trim();
      let filename = `${i + 1}.${extension}`;
      pages.push(new Page(url, filename, chapter, chapter.manga));
    }

    return pages;
  }
}

module.exports = MangaLife;
