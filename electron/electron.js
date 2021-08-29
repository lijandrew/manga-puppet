const Engine = require("../engine/Engine.js");
const Settings = require("../engine/Settings.js");
const { app, BrowserWindow, ipcMain, shell } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 725,
    minHeight: 520,
    autoHideMenuBar: true,
    icon: path.join(__dirname, "logo.png"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  // mainWindow.removeMenu();
  mainWindow.loadFile(path.join(__dirname, "..", "public", "index.html"));
  mainWindow.setBackgroundColor("#161616");
  mainWindow.on("closed", () => {
    app.quit();
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  /*
  // Inform frontend of whether window is maximized or not
  mainWindow.on("maximize", () => {
    mainWindow.webContents.send("isMaximized");
  });

  mainWindow.on("unmaximize", () => {
    mainWindow.webContents.send("isRestored");
  });
  */
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

//////// ipcMain handlers ////////

/*
ipcMain.handle("minimize-app", (event) => {
  mainWindow.minimize();
});

ipcMain.handle("maximize-app", (event) => {
  mainWindow.maximize();
});

ipcMain.handle("restore-app", (event) => {
  mainWindow.restore();
});

ipcMain.handle("close-app", (event) => {
  mainWindow.close();
});
*/

ipcMain.handle("get-source-names", (_event) => {
  return Engine.getSourceNames();
});

ipcMain.handle("get-mangas", async (_event, sourceName) => {
  try {
    return await Engine.getMangas(sourceName);
  } catch (e) {
    console.log(e);
  }
  return [];
});

ipcMain.handle("get-chapters", async (_event, sourceName, manga) => {
  try {
    return await Engine.getChapters(sourceName, manga);
  } catch (e) {
    console.log(e);
  }
  return [];
});

ipcMain.handle("get-details", async (_event, sourceName, manga) => {
  try {
    return await Engine.getDetails(sourceName, manga);
  } catch (e) {
    console.log(e);
  }
  return {
    authors: "",
    genres: "",
    releasedate: "",
    status: "",
    description: "",
  };
});

ipcMain.handle("get-pages", async (_event, sourceName, chapter) => {
  try {
    return await Engine.getPages(sourceName, chapter);
  } catch (e) {
    console.log(e);
  }
  return [];
});

ipcMain.handle("download-chapter", (_event, sourceName, manga, chapter) => {
  Engine.downloadChapter(sourceName, manga, chapter, (error) => {
    if (!error) {
      // Send message upon finish so frontend knows to mark chapter as downloaded
      mainWindow.webContents.send(
        "downloaded-chapter-filenames",
        Engine.getDownloadedChapterFilenames(sourceName, manga)
      );
    } else {
      mainWindow.webContents.send("error-chapter-filename", chapter.filename);
    }
  });

  return Engine.getDownloadingChapterFilenames(sourceName, manga);
});

ipcMain.handle(
  "get-downloaded-chapter-filenames",
  (_event, sourceName, manga) => {
    return Engine.getDownloadedChapterFilenames(sourceName, manga);
  }
);

ipcMain.handle(
  "get-downloading-chapter-filenames",
  (_event, sourceName, manga) => {
    return Engine.getDownloadingChapterFilenames(sourceName, manga);
  }
);

ipcMain.handle("open-manga-folder", (_event, sourceName, manga) => {
  shell.openPath(
    path.normalize(path.join(Settings.downloadPath, sourceName, manga.filename))
  );
});

ipcMain.handle("get-reader-settings", (_event) => {
  return Engine.getReaderSettings();
});

ipcMain.handle("set-reader-settings", (_event, settings) => {
  return Engine.setReaderSettings(settings);
});
