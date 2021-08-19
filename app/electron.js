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

//////////////

ipcMain.handle("getSourceNames", (event) => {
  return Engine.getSourceNames();
});

ipcMain.handle("getMangas", async (event, sourceName) => {
  return await Engine.getMangas(sourceName);
});

ipcMain.handle("getChapters", async (event, sourceName, manga) => {
  return await Engine.getChapters(sourceName, manga);
});

ipcMain.handle(
  "downloadChapters",
  async (event, sourceName, manga, chapters) => {
    await Engine.downloadChapters(sourceName, manga, chapters);
  }
);
