const Engine = require("../engine/Engine.js");
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
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

//////// ipcMain handlers ////////

ipcMain.handle("getSourceNames", (event) => {
  return Engine.getSourceNames();
});

ipcMain.handle("getMangas", (event, sourceName) => {
  return Engine.getMangas(sourceName);
});

ipcMain.handle("getChapters", (event, sourceName, manga) => {
  return Engine.getChapters(sourceName, manga);
});

ipcMain.handle("getCoverImageUrl", (event, sourceName, manga) => {
  return Engine.getCoverImageUrl(sourceName, manga);
});

ipcMain.handle("getDetails", (event, sourceName, manga) => {
  return Engine.getDetails(sourceName, manga);
});

ipcMain.handle("downloadChapter", (event, sourceName, manga, chapter) => {
  return Engine.downloadChapter(sourceName, manga, chapter);
});

ipcMain.handle("getLocalChapterTitles", (event, sourceName, manga) => {
  return Engine.getLocalChapterTitles(sourceName, manga);
});
