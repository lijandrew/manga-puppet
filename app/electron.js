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

ipcMain.on("getMangasBySourceName", (event, sourceName) => {
  Engine.getMangasBySourceName(sourceName).then((mangas) => {
    mainWindow.webContents.send("Engine:getMangasBySourceName", mangas);
  });
});
