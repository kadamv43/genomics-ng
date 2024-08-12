const { app, BrowserWindow } = require("electron");
require("@electron/remote/main").initialize();
const url = require("url");
const path = require("path");

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(__dirname, `/dist/sakai-ng/assets/layout/images/logo.ico`),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
    });

    require("@electron/remote/main").enable(mainWindow.webContents);

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, `/dist/sakai-ng/index.html`),
            protocol: "file:",
            slashes: true,
        })
    );
    // Open the DevTools.
    mainWindow.webContents.openDevTools();

    mainWindow.on("closed", function () {
        mainWindow = null;
    });
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
    if (mainWindow === null) createWindow();
});
