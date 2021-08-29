// TODO: read this information from a JSON settings file

const path = require("path");

const Settings = {
  downloadPath: path.join(__dirname, "..", "downloads"),
  readerSettings: {
    zoom: 50,
    margin: 10,
    zoomConstant: 10,
    marginConstant: 5,
  }
};

module.exports = Settings;
