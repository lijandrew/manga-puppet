/**
 * Manga information.
 */
function Manga(id, url, title) {
  // Essential information
  this.id = id;
  this.url = url;
  this.title = title;
  this.coverImageUrl = "";
  this.chapters = [];

  // Anything not absolutely needed for download functionality
  this.details = {
    authors: "",
    genres: "",
    releasedate: "",
    status: "",
    description: "",
  };
}

module.exports = Manga;
