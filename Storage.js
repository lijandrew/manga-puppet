const fs = require("fs");
const fsPromises = fs.promises;
const path = require("path");

const Storage = {
  async saveImagesToFolder(directory, images) {
    console.log("Storage: saveImagesToFolder");
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
    let writePromises = Promise.all(
      images.map((image) =>
        fsPromises.writeFile(path.join(directory, image.filename), image.data)
      )
    );
    await writePromises;
  },

  async saveImagesToCbz(directory, images) {
    /*
    let zip = new JSZip();
    for (let image of images) {
    }
    return zip
      .generateAsync({ compression: "STORE", type: "uint8array" })
      .then((data) => {
        return this._writeFile(path.join(directory), data);
      });
      */
  },
};

module.exports = Storage;
