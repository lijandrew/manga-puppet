const Engine = require("../engine/Engine.js");
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 725,
    minHeight: 520,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  mainWindow.on("closed", () => {
    app.quit();
  });
  mainWindow.loadFile(path.join(__dirname, "..", "public", "index.html"));
  mainWindow.setBackgroundColor("#161616");
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

ipcMain.handle("minimizeApp", (event) => {
  mainWindow.minimize();
});

ipcMain.handle("maximizeApp", (event) => {
  mainWindow.maximize();
});

ipcMain.handle("restoreApp", (event) => {
  mainWindow.restore();
});

ipcMain.handle("closeApp", (event) => {
  mainWindow.close();
});

ipcMain.handle("getSourceNames", (event) => {
  return Engine.getSourceNames();
});

ipcMain.handle("getMangas", (event, sourceName) => {
  return Engine.getMangas(sourceName);
});

ipcMain.handle("getChapters", (event, sourceName, manga) => {
  return Engine.getChapters(sourceName, manga);
});

ipcMain.handle("getDetails", (event, sourceName, manga) => {
  return Engine.getDetails(sourceName, manga);
});

ipcMain.handle("downloadChapter", (event, sourceName, manga, chapter) => {
  return Engine.downloadChapter(sourceName, manga, chapter);
});

ipcMain.handle("getLocalChapterFilenames", (event, sourceName, manga) => {
  return Engine.getLocalChapterFilenames(sourceName, manga);
});
