const fs = require("fs");
const fsPromises = fs.promises;
const path = require("path");
const JSZip = require("jszip");

/**
 * Path arguments should be as specific possible.
 * Storage methods should do as little path-wrangling as possible.
 */
const Storage = {
  async saveImagesToFolder(folderPath, images) {
    console.log("Storage: saveImagesToFolder");
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    let writePromises = Promise.all(
      images.map((image) =>
        fsPromises.writeFile(path.join(folderPath, image.filename), image.data)
      )
    );
    await writePromises;
  },

  async saveImagesToCbz(zipPath, images) {
    let zip = new JSZip();
    images.forEach((image) => {
      zip.file(image.filename, image.data);
    });
    return zip
      .generateAsync({ compression: "STORE", type: "uint8array" })
      .then((archive) => {
        return fsPromises.writeFile(zipPath, archive);
      });
  },
};

module.exports = Storage;
