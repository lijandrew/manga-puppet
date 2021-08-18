const MangaLife = require("./engine/sources/MangaLife.js");
const DownloadJob = require("./engine/DownloadJob.js");
const DownloadManager = require("./engine/DownloadManager.js");

async function main() {
  let mangas = await MangaLife.getMangas();
  let manga = mangas[0];

  let chapters = await MangaLife.getChapters(manga);
  let chapter = chapters[0];

  let jobs = [new DownloadJob(MangaLife, manga, chapter)];

  jobs.forEach((downloadJob) => {
    DownloadManager.enqueueJob(downloadJob);
  });
}

main();
