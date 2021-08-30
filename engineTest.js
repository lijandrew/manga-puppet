const MangaLife = require("./engine/sources/MangaLife.js");
const DownloadJob = require("./engine/DownloadJob.js");
const DownloadManager = require("./engine/DownloadManager.js");
const Favorites = require("./engine/Favorites.js");

async function main() {
  console.log(Favorites.getFavorites());
  Favorites.deleteFavorite(Object.keys(Favorites.getFavorites())[0]);
  console.log(Favorites.getFavorites());
}

main();
