const MangaLife = require("./engine/sources/MangaLife.js");
const DownloadJob = require("./engine/DownloadJob.js");
const DownloadManager = require("./engine/DownloadManager.js");

async function main() {
  const manga = await MangaLife.getMangaById("Tales-Of-Demons-And-Gods");
  let details = await MangaLife.getDetails(manga);
  console.log(details);
}

main();
