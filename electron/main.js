const { app, BrowserWindow, ipcMain, session } = require("electron");
const path = require("path");

const createWindow = require("./windowManager");
const { openURL } = require("./browserControls");

let mainWindow;

app.whenReady().then(() => {

    mainWindow = createWindow();

    session.defaultSession.setPermissionRequestHandler((webContents, permission, callback) => {
        callback(true);
    });

});


ipcMain.on("open-url", (event, url) => {
    openURL(mainWindow, url);
});


app.on("window-all-closed", () => {

    if (process.platform !== "darwin") {
        app.quit();
    }

});