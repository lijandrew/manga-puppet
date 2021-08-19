/**
 * Manga information.
 */
function Manga(id, url, title, coverImageUrl = "") {
  // Essential information
  this.id = id;
  this.url = url;
  this.title = title;
  this.coverImageUrl = coverImageUrl;
  this.chapters = [];

  // Extra details (i.e. author, genre, status, and anything
  // that is visible in MangaView but not Downloader)
  this.details = {
    authors: "",
    genres: "",
    releasedate: "",
    status: "",
    description: "",
  };
}

module.exports = Manga;
