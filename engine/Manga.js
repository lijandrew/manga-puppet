const sanitize = require("sanitize-filename");

/**
 * Manga information.
 */
function Manga(id, url, title) {
  // Essential information
  this.id = id;
  this.url = url;
  this.title = title;
  this.filename = sanitize(title);
  this.coverImageUrl = "";
  this.chapters = [];
  this.details = {
    authors: "",
    genres: "",
    releasedate: "",
    status: "",
    description: "",
  };
}

module.exports = Manga;
