const { app, ipcMain, BrowserWindow, ipcRenderer } = require("electron");
require("@electron/remote/main").initialize();
const url = require("url");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const AdmZip = require("adm-zip");
const { exec } = require("child_process");

let mainWindow;
let progressData = { total: 0, progress: 0 };


function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(
            __dirname,
            `/dist/sakai-ng/assets/layout/images/logo.ico`
        ),
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true,
            contextIsolation: true,
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
   // mainWindow.webContents.openDevTools();

    mainWindow.on("closed", function () {
        mainWindow = null;
    });
}

// Function to download and extract the update
async function downloadAndExtractUpdate(url) {
    try {
        console.log("Downloading update from:", url);
        const zipPath = path.join(app.getPath("temp"), "update.zip");
        const outputDir = path.join(app.getAppPath(), "resources", "app"); // App folder

        progressData.total = 100;
        mainWindow.webContents.send("progress", progressData);

        // Download the ZIP file with progress
        const writer = fs.createWriteStream(zipPath);
        const response = await axios({
            url,
            method: "GET",
            responseType: "stream",
        });

         const totalLength = parseInt(response.headers["content-length"], 10);
         let downloaded = 0;

         response.data.on("data", (chunk) => {
             downloaded += chunk.length;
             const progress = Math.round((downloaded / totalLength) * 100);

             // Send progress to renderer
             mainWindow.webContents.send("progress", {
                 total: totalLength,
                 progress,
             });
         });

        response.data.pipe(writer);

        // Wait for download to finish
        await new Promise((resolve, reject) => {
            writer.on("finish", resolve);
            writer.on("error", reject);
        });

        console.log("Update downloaded.");

        // Extract the ZIP file
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(outputDir, true);

        console.log("Update extracted.");

        // Install dependencies (node_modules) using npm install
        await installDependencies(outputDir);

        // Clean up the temporary files
        fs.unlinkSync(zipPath);

        // Relaunch the app after updating
        app.relaunch();
        app.exit(0);

        return { success: true };
    } catch (error) {
        console.error("Error downloading or extracting update:", error);
        return { success: false, error: error.message };
    }
}

async function installDependencies(outputDir) {
    return new Promise((resolve, reject) => {
        console.log("Installing dependencies...");

        // Execute `npm install` in the app directory (where package.json is located)
        exec("npm install", { cwd: outputDir }, (error, stdout, stderr) => {
            if (error) {
                console.error("Error during npm install:", stderr);
                reject(error);
            } else {
                console.log("Dependencies installed successfully.");
                resolve();
            }
        });
    });
}

ipcMain.handle("get-app-version", () => {
    return app.getVersion(); // Return the app version
});

ipcMain.handle("check-for-update", async () => {
    try {
        const updateInfo = await axios.get(
            "https://stageapi.genomicsivfcentre.com/public/assets/admin-app/version.json"
        );
        const currentVersion = app.getVersion();
        console.log(updateInfo);

        console.log(app.getVersion());
        if (updateInfo.latest !== currentVersion) {
            return {
                updateAvailable: true,
                version: updateInfo.data.latest,
                url: updateInfo.data.url,
            };
        }
        return { updateAvailable: false };
    } catch (error) {
        console.error("Error checking for updates:", error);
        return { updateAvailable: false, error: error.message };
    }
});

// IPC handler for downloading updates
ipcMain.handle("download-update", async (event, { url }) => {
    return await downloadAndExtractUpdate(url);
});

// Initialize the Electron app
app.on("ready", () => {
    createWindow();
    // updateApp(); // Check for updates on app launch
});

// app.on("ready", createWindow);

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
    if (mainWindow === null) createWindow();
});

ipcMain.on("download-file", (event, url) => {
    const win = BrowserWindow.getFocusedWindow();
    win.webContents.downloadURL(url);
});
