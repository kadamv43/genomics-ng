const { app, ipcMain, BrowserWindow, ipcRenderer } = require("electron");
require("@electron/remote/main").initialize();
const url = require("url");
const fs = require("fs");
const path = require("path");
// const { extractAll } = require("asar");

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
            nativeWindowOpen: true,
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

// Function to download and extract the update
async function downloadAndExtractUpdate(url) {
    try {
        console.log("Downloading update from:", url);
        const zipPath = path.join(app.getPath("temp"), "update.zip");
        const outputDir = path.join(app.getAppPath(), "resources", "app"); // App folder
        const writer = fs.createWriteStream(zipPath);

        const progressStages = {
            downloading: 0.6, // 60% weight
            extracting: 0.2, // 20% weight
            installing: 0.2, // 20% weight
        };

        // Progress initialization
        let totalProgress = 0;

        // Progress helper
        const updateProgress = (stageProgress) => {
            totalProgress += stageProgress;
            mainWindow.webContents.send("progress", {
                progress: totalProgress,
            });
        };

        progressData.total = 100;
        mainWindow.webContents.send("progress", progressData);

        // Download the ZIP file with progress

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(
                `Failed to download update: ${response.statusText}`
            );
        }

        const totalLength = parseInt(
            response.headers.get("content-length"),
            10
        );
        let downloaded = 0;

        // Create a write stream for saving the downloaded file
        const readableStream = response.body;

        // Monitor download progress
        for await (const chunk of readableStream) {
            writer.write(chunk);
            downloaded += chunk.length;

            // const progress = Math.round((downloaded / totalLength) * 100);

            // Send progress to renderer
            const stageProgress =
                progressStages.downloading * (chunk.length / totalLength) * 100;
            updateProgress(stageProgress);
        }

        for await (const chunk of readableStream) {
            writer.write(chunk);
            downloaded += chunk.length;
            const progress = Math.round((downloaded / totalLength) * 100);
            const stageProgress =
                progressStages.downloading * (progress / 100) * 100;
            updateProgress(stageProgress);
        }

        writer.end(async () => {
            try {
                const stats = fs.statSync(zipPath);
                if (stats.size <= 0) {
                    throw new Error("Downloaded file is empty.");
                }

                // Verify if the downloaded file is a valid ZIP
                const zip = new AdmZip(zipPath);
                const zipEntries = zip.getEntries();
                if (zipEntries.length === 0) {
                    throw new Error("The ZIP file is empty or invalid.");
                }

                // Extract the ZIP file
                zip.extractAllTo(outputDir, true);
                updateProgress(progressStages.extracting * 100);
                console.log("Update extracted.");

                await installDependencies(outputDir);

                updateProgress(progressStages.installing * 100);

                // Clean up the temporary files
                fs.unlinkSync(zipPath);

                // Relaunch the app after updating
                app.relaunch();
                app.exit(0);

                return { success: true };
            } catch (error) {
                console.error("Error with ZIP file:", error);
                throw new Error(
                    "Invalid or unsupported ZIP format: " + error.message
                );
            }
        });
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
        const response = await fetch(
            "https://stageapi.genomicsivfcentre.com/public/assets/admin-app/version.json"
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const updateInfo = await response.json();
        const currentVersion = app.getVersion();

        console.log(updateInfo);
        console.log(currentVersion);

        if (updateInfo.latest !== currentVersion) {
            return {
                updateAvailable: true,
                version: updateInfo.latest,
                url: updateInfo.url,
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
