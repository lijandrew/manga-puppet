const axios = require("axios");
const { JSDOM } = require("jsdom");
const puppeteer = require("puppeteer");

const Source = require("../Source.js");
const Manga = require("../Manga.js");
const Chapter = require("../Chapter.js");
const Page = require("../Page.js");
const sanitize = require("sanitize-filename");

const MangaLife = new Source("MangaLife");

MangaLife.fetchMangas = async () => {
  const browser = await puppeteer.launch();
  const [page] = await browser.pages();
  await page.goto("https://manga4life.com/directory", {
    waitUntil: "networkidle0",
  });
  await page.waitForSelector("div[ng-repeat]");
  const titleAndUrl = await page.evaluate(() => {
    return [...document.querySelectorAll("div[ng-repeat] a")].map((elem) => [
      elem.textContent,
      elem.href,
    ]);
  });
  await browser.close();
  const mangas = titleAndUrl.map((entry) => {
    const title = entry[0];
    const url = entry[1];
    const id = url.split("/").pop();
    return new Manga(id, url, title);
  });
  for (let i = 0; i < mangas.length; i++) {
    mangas[i].coverImageUrl = `https://cover.nep.li/cover/${mangas[i].id}.jpg`;
  }
  return mangas;
};

MangaLife.fetchDetails = async (manga) => {
  const browser = await puppeteer.launch();
  const [page] = await browser.pages();
  await page.goto(`https://manga4life.com/manga/${manga.id}`, {
    waitUntil: "networkidle0",
  });
  await page.waitForSelector(".list-group-item.d-none.d-md-block:nth-child(9)");

  const [authorsElem] = await page.$x(
    "/html/body/div[2]/div/div/div/div/div[1]/div[3]/ul/li[./span = 'Author(s):']"
  );
  const [genresElem] = await page.$x(
    "/html/body/div[2]/div/div/div/div/div[1]/div[3]/ul/li[./span = 'Genre(s):']"
  );
  const [releasedateElem] = await page.$x(
    "/html/body/div[2]/div/div/div/div/div[1]/div[3]/ul/li[./span = 'Released:']"
  );
  const [statusElem] = await page.$x(
    "/html/body/div[2]/div/div/div/div/div[1]/div[3]/ul/li[./span = 'Status:']"
  );
  const [descriptionElem] = await page.$x(
    "/html/body/div[2]/div/div/div/div/div[1]/div[3]/ul/li[./span = 'Description:']"
  );

  const details = {
    authors: "",
    genres: "",
    releasedate: "",
    status: "",
    description: "",
  };

  details.authors = await page.evaluate(
    (elem) =>
      [...elem.querySelectorAll("a")].map((a) => a.textContent).join(", "),
    authorsElem
  );
  details.genres = await page.evaluate(
    (elem) =>
      [...elem.querySelectorAll("a")].map((a) => a.textContent).join(", "),
    genresElem
  );
  details.releasedate = await page.evaluate(
    (elem) =>
      [...elem.querySelectorAll("a")].map((a) => a.textContent).join(", "),
    releasedateElem
  );
  details.status = await page.evaluate(
    (elem) =>
      [...elem.querySelectorAll("a")].map((a) => a.textContent).join(", "),
    statusElem
  );
  details.description = await page.evaluate(
    (elem) => elem.querySelector("div").textContent,
    descriptionElem
  );

  await browser.close();
  return details;
};

MangaLife.fetchChapters = async (manga) => {
  const response = await axios.get(
    `https://manga4life.com/rss/${manga.id}.xml`
  );
  const dom = new JSDOM("");
  const DOMParser = dom.window.DOMParser;
  const parser = new DOMParser();
  const document = parser.parseFromString(response.data, "text/xml");
  const chapters = [...document.querySelectorAll("item")].map((elem) => {
    const url = elem.querySelector("link").textContent.replace(/-page-\d+/, "");
    const title = elem
      .querySelector("title")
      .textContent.split(" ")
      .slice(-2)
      .join(" ");
    return new Chapter(url, title);
  });
  return chapters;
};

MangaLife.fetchPages = async (chapter) => {
  const browser = await puppeteer.launch();
  const [page] = await browser.pages();
  await page.goto(chapter.url, { waitUntil: "networkidle0" });
  const imageUrls = await page.evaluate(() =>
    [...document.querySelectorAll("div.ImageGallery div[ng-repeat] img")].map(
      (elem) => elem.src
    )
  );
  await browser.close();

  const pages = [];
  for (let i = 0; i < imageUrls.length; i++) {
    const url = imageUrls[i];
    const extension = url.split(/[#?]/)[0].split(".").pop().trim();
    const filename = sanitize(`${i + 1}.${extension}`);
    pages.push(new Page(url, filename));
  }
  return pages;
};

// For testing
MangaLife.getMangaById = async (id) => {
  const response = await axios.get(`https://manga4life.com/rss/${id}.xml`);
  const dom = new JSDOM("");
  const DOMParser = dom.window.DOMParser;
  const parser = new DOMParser();
  const document = parser.parseFromString(response.data, "text/xml");
  const title = document.querySelector("channel > title").textContent;
  const url = document.querySelector("channel > link").textContent;
  const coverImageUrl = document.querySelector(
    "channel > image > url"
  ).textContent;
  const manga = new Manga(id, url, title);
  manga.coverImageUrl = coverImageUrl;
  return manga;
};

module.exports = MangaLife;
