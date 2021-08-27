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
    // frame: false,
    icon: path.join(__dirname, "icon.png"),
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

  // Inform frontend of whether window is maximized or not
  mainWindow.on("maximize", () => {
    mainWindow.webContents.send("isMaximized");
  });

  mainWindow.on("unmaximize", () => {
    mainWindow.webContents.send("isRestored");
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

//////// ipcMain handlers ////////

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

ipcMain.handle("get-source-names", (event) => {
  return Engine.getSourceNames();
});

ipcMain.handle("get-mangas", (event, sourceName) => {
  return Engine.getMangas(sourceName);
});

ipcMain.handle("get-chapters", (event, sourceName, manga) => {
  return Engine.getChapters(sourceName, manga);
});

ipcMain.handle("get-details", (event, sourceName, manga) => {
  return Engine.getDetails(sourceName, manga);
});

ipcMain.handle("download-chapter", (event, sourceName, manga, chapter) => {
  Engine.downloadChapter(sourceName, manga, chapter, () => {
    // Send message upon finish so frontend knows to mark chapter as downloaded
    mainWindow.webContents.send(
      "downloaded-chapter-filenames",
      Engine.getDownloadedChapterFilenames(sourceName, manga)
    );
  });

  return Engine.getDownloadingChapterFilenames(sourceName, manga);
});

ipcMain.handle(
  "get-downloaded-chapter-filenames",
  (event, sourceName, manga) => {
    return Engine.getDownloadedChapterFilenames(sourceName, manga);
  }
);

ipcMain.handle(
  "get-downloading-chapter-filenames",
  (event, sourceName, manga) => {
    return Engine.getDownloadingChapterFilenames(sourceName, manga);
  }
);

ipcMain.handle("open-manga-folder", (event, sourceName, manga) => {
  shell.openPath(
    path.normalize(path.join(Settings.downloadPath, sourceName, manga.filename))
  );
});
