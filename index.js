const id = "Yuusha-Party-wo-Tsuihou-Sareta-Beast-Tamer";

const MangaLife = require("./MangaLife.js");

async function main() {
  await new MangaLife().downloadChapter(id, {
    url: "https://manga4life.com/read-online/Yuusha-Party-wo-Tsuihou-Sareta-Beast-Tamer-chapter-51.html",
    title: "Beast Tamer whatever title",
  });
}

main();
