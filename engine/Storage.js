const fs = require("fs");
const fsPromises = fs.promises;
const path = require("path");
const JSZip = require("jszip");

const Settings = require("./Settings.js");

/**
 * Path arguments should be as specific possible.
 * Storage methods should do as little path-wrangling as possible.
 */
const Storage = {
  verifyPath(targetPath) {
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true });
    }
  },

  getLocalChapterFilenames(source, manga) {
    console.log("Storage:getLocalChapters");
    const mangaPath = path.join(
      Settings.downloadPath,
      source.filename,
      manga.filename
    );
    if (!fs.existsSync(mangaPath)) {
      // If manga path doesn't exist, there must not be chapters
      return [];
    }
    // Unique filenames after removing .cbz extension
    const filenames = [
      ...new Set(
        fs
          .readdirSync(mangaPath)
          .map((filename) => filename.replace(/\.cbz$/i, ""))
      ),
    ];
    return filenames;
  },

  saveImagesToFolder(source, manga, chapter, images) {
    console.log("Storage:saveImagesToFolder");
    const folderPath = path.join(
      Settings.downloadPath,
      source.filename,
      manga.filename,
      chapter.filename
    );
    this.verifyPath(folderPath);

    // Save images to path
    let writeFilePromises = Promise.all(
      images.map((image) =>
        fsPromises.writeFile(path.join(folderPath, image.filename), image.data)
      )
    );
    return writeFilePromises;
  },

  saveImagesToCbz(source, manga, chapter, images) {
    console.log("Storage: saveImagesToCbz");
    const zipParentPath = path.join(
      Settings.downloadPath,
      source.filename,
      manga.filename
    );
    const zipPath = path.join(zipParentPath, chapter.filename + ".cbz");
    this.verifyPath(zipParentPath);

    // Zip images and save .cbz to path
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
