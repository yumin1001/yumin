const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 850,
    minWidth: 1000,
    minHeight: 700,
    title: "Campus Find - 대학 분실물 통합 포털 (2026131210 김유민)",
    autoHideMenuBar: true, // Hides top menus for a premium clean UI
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true
    }
  });

  // Load the single page application
  mainWindow.loadFile(path.join(__dirname, "index.html"));

  // Open Developer Tools (optional, can be closed by user)
  // mainWindow.webContents.openDevTools();
}

// Electron Initialization
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
