const { app, BrowserWindow, ipcMain } = require("electron");

const fs = require("fs-extra");
const path = require("path");
const log = require("electron-log");

const url = require("url");
let mainWindow;

// Paths
const angularAppPath = path.join(__dirname, "dist/sakai-ng"); // Local Angular app folder
const tempUpdatePath = path.join(app.getPath("temp"), "angular-update"); // Temporary folder for downloads

// Create Main Window
app.on("ready", () => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"), // Optional preload script
        },
    });

    mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, `/dist/sakai-ng/index.html`),
            protocol: "file:",
            slashes: true,
        })
    );
     mainWindow.webContents.openDevTools();

});

// Listen for Update Check from Angular
ipcMain.handle("check-for-update", async () => {
    try {
        const updateInfo = await fetch(
            "https://stageapi.genomicsivfcentre.com/public/assets/admin-app/version.json"
        ).then((res) => res.json());
        const localVersion = "1.0.0"; // Replace with your logic to store local version

        if (updateInfo.version !== localVersion) {
            return {
                updateAvailable: true,
                version: updateInfo.version,
                files: updateInfo.files,
            };
        }
        return { updateAvailable: false };
    } catch (error) {
        log.error("Update check failed:", error);
        return { updateAvailable: false, error: error.message };
    }
});

// Handle Update Process
ipcMain.handle("download-update", async (_, updateInfo) => {
    try {
        // Create temporary directory
        await fs.ensureDir(tempUpdatePath);

        // Download all update files
        for (const file of updateInfo.files) {
            const fileUrl = `https://stageapi.genomicsivfcentre.com/public/assets/admin-app/${updateInfo.version}/${file}`;
            console.log(fileUrl)
            const filePath = path.join(tempUpdatePath, file);

            const response = await fetch(fileUrl)
            const fileStream = fs.createWriteStream(filePath);
            await new Promise((resolve, reject) => {
                response.body.pipe(fileStream);
                response.body.on("error", reject);
                fileStream.on("finish", resolve);
            });
        }

        // Replace local files
        await fs.emptyDir(angularAppPath); // Clear old files
        await fs.copy(tempUpdatePath, angularAppPath); // Copy new files

        return { success: true };
    } catch (error) {
        log.error("Update failed:", error);
        return { success: false, error: error.message };
    }
});
