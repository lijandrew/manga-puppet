/**
 * Stores basic Image information: its filename and binary data.
 */
class Image {
  constructor(filename, data) {
    this.filename = filename;
    this.data = data;
  }
}

module.exports = Image;
