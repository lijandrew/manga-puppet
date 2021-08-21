const sanitize = require("sanitize-filename");

/**
 * Stores basic Image information: its filename and binary data.
 */
function Image(filename, data) {
  this.filename = sanitize(filename);
  this.data = data;
}

module.exports = Image;
