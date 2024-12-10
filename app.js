const { app, BrowserWindow, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");
const path = require("path");
const fs = require("fs");

let mainWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true, // Required for secure IPC
            nodeIntegration: false, // Recommended to disable
        },
    });

    // Load the Angular app
    mainWindow.loadFile(path.join(__dirname, "/dist/sakai-ng/index.html"));

    // Open DevTools for debugging (disable in production)
    // mainWindow.webContents.openDevTools();

    mainWindow.on("closed", () => {
        mainWindow = null;
    });

    setupAutoUpdater();
}

// Auto-Updater configuration and events
function setupAutoUpdater() {
    autoUpdater.on("checking-for-update", () => {
        sendStatusToRenderer("Checking for updates...");
    });

    autoUpdater.on("update-available", (info) => {
        sendStatusToRenderer("Update available. Downloading...");
    });

    autoUpdater.on("update-not-available", () => {
        sendStatusToRenderer("No updates available.");
    });

    autoUpdater.on("download-progress", (progressObj) => {
        mainWindow?.webContents.send("download-progress", progressObj);
    });

    autoUpdater.on("update-downloaded", () => {
        sendStatusToRenderer("Update downloaded. Ready to install.");
    });

    autoUpdater.on("error", (err) => {
        sendStatusToRenderer(`Error: ${err.message}`);
    });
}

// Send messages to Angular app
function sendStatusToRenderer(message) {
    mainWindow?.webContents.send("update-status", message);
}

// IPC Handlers
ipcMain.on("check-for-updates", () => {
    autoUpdater.checkForUpdates();
});

ipcMain.on("install-update", () => {
    autoUpdater.quitAndInstall();
});

ipcMain.handle("getAppVersion", () => {
    return app.getVersion();
});

ipcMain.on("print-url", async (event, url) => {
    let options = {
        silent: false,
        printBackground: true,
        color: false,
        margin: {
            marginType: "printableArea",
        },
        landscape: false,
        pagesPerSheet: 1,
        collate: false,
        copies: 1,
        header: "Header of the Page",
        footer: "Footer of the Page",
    };

    let win = new BrowserWindow({
        show: false,
        webPreferences: {
            nodeIntegration: true,
            offscreen: true,
        },
    });
    win.loadURL(url);
    win.focus();

    // fs.writeFileSync(pdfPath, pdfData);

    win.webContents.on("did-finish-load", async () => {
        pdfPath = "output.pdf";
        const pdfData = await win.webContents.print(
            { silent: false },
            (success, failureReason) => {
                if (success) {
                    console.log("Print preview shown successfully");
                } else {
                    console.log("Print failed:", failureReason);
                }
            }
        );

        // Close the print window
        // win.close();
    });
});

// App Lifecycle
app.on("ready", createMainWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (!mainWindow) {
        createMainWindow();
    }
});
