/**
 * Manga information.
 */
function Manga(
  id,
  url,
  title,
  // description = "No description found",
  // coverImageUrl = ""
) {
  this.id = id;
  this.url = url;
  this.title = title;
  // this.description = description;
  // this.coverImageUrl = coverImageUrl;
  this.chapters = [];
}

module.exports = Manga;
