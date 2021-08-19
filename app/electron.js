const Engine = require("../engine/Engine.js");
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.on("closed", () => {
    app.quit();
  });
  mainWindow.loadFile(path.join(__dirname, "..", "public", "index.html"));
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

//////////////

ipcMain.on("getSourceNames", () => {
  mainWindow.webContents.send("Engine:getSourceNames", Engine.getSourceNames());
});

ipcMain.on("getMangas", (event, sourceName) => {
  Engine.getMangas(sourceName).then((mangas) => {
    mainWindow.webContents.send("Engine:getMangas", mangas);
  });
});

ipcMain.on("getChapters", (event, sourceName, manga) => {
  Engine.getChapters(sourceName, manga).then((chapters) => {
    mainWindow.webContents.send("Engine:getChapters", chapters);
  });
});

ipcMain.on("downloadChapter", (event, sourceName, manga, chapter) => {
  Engine.downloadChapter(sourceName, manga, chapter);
  /*
  Engine.downloadChapter(source, manga, chapter).then(() => {
    mainWindow.webContents.send("Engine:downloadChapter", "Done");
  });
  */
});
