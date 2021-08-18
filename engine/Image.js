/**
 * Stores basic Image information: its filename and binary data.
 */
function Image(filename, data) {
  this.filename = filename;
  this.data = data;
}

module.exports = Image;
