const id = "Yuusha-Party-wo-Tsuihou-Sareta-Beast-Tamer";

const MangaLife = require("./MangaLife.js");
const DownloadJob = require("./DownloadJob.js");
const DownloadManager = require("./DownloadManager.js");

async function main() {

  // Demo run

  let manga = await MangaLife.getMangaById(id);
  let chapters = await MangaLife.getChapters(manga);
  let pages1 = await MangaLife.getPages(chapters[0]);
  // let pages2 = await MangaLife.getPages(chapters[1]);
  // let pages3 = await MangaLife.getPages(chapters[2]);
  // let pages4 = await MangaLife.getPages(chapters[3]);

  let jobs = [
    new DownloadJob(pages1),
    // new DownloadJob(pages2),
    // new DownloadJob(pages3),
    // new DownloadJob(pages4),
  ];

  jobs.forEach((downloadJob) => {
    DownloadManager.enqueueJob(downloadJob);
  });
}

main();
