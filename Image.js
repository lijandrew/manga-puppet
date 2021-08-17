/**
 * Stores Image information, namely the filename it is to be saved as,
 * and its binary data.
 */
class Image {
  constructor(filename, data) {
    this.filename = filename;
    this.data = data;
  }
}

module.exports = Image;
