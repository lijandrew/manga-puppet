const axios = require("axios");
const { JSDOM } = require("jsdom");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

// Temporarily hardcoded
const title = "Sekai-Ka-Kanojo-Ka-Erabenai";
const chapter = "1";

async function main() {
  // Get chapter links
  let response = await axios.get(`https://manga4life.com/rss/${title}.xml`);
  const dom = new JSDOM("");
  const DOMParser = dom.window.DOMParser;
  const parser = new DOMParser();
  const document = parser.parseFromString(response.data, "text/xml");
  let chapterLinks = [...document.querySelectorAll("item link")].map((elem) =>
    elem.textContent.trim()
  );
  let chapterLink = chapterLinks.filter((text) =>
    text.includes(`-chapter-${chapter}-`)
  )[0];

  // Get pagelist for chapter
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(chapterLink, {
    waitUntil: "networkidle0",
  });
  await page.waitForSelector(
    "#PageModal > div > div > div.modal-body > div > div > button"
  );
  let pageNumbers = await page.evaluate(() => {
    return [
      ...document.querySelectorAll(
        "#PageModal > div > div > div.modal-body > div > div > button"
      ),
    ].map((elem) => elem.textContent.trim());
  });
  await browser.close();

  // Download all pages

  let pageUrls = {};
  for (let pageNumber of pageNumbers) {
    let paddedPageNumber = pageNumber.padStart(3, "0");
    let paddedChapterNumber = `${chapter}`.padStart(4, "0");
    let url = `https://official-complete-1.granpulse.us/manga/${title}/${paddedChapterNumber}-${paddedPageNumber}.png`;
    pageUrls[paddedPageNumber] = url;
  }

  // Start all downloads
  let pagePromises = {};
  for (let paddedPageNumber in pageUrls) {
    pagePromises[paddedPageNumber] = axios({
      url: pageUrls[paddedPageNumber],
      responseType: "stream",
    });
  }

  // Create directory if needed
  let dir = path.join(__dirname, "downloads", title, chapter);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Save all downloads
  for (let paddedPageNumber in pagePromises) {
    pagePromises[paddedPageNumber].then((response) => {
      response.data.pipe(
        fs.createWriteStream(path.join(dir, `${paddedPageNumber}.png`))
      );
    });
  }
}

main();
