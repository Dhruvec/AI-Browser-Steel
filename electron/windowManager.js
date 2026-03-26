const { BrowserWindow } = require("electron");
const path = require("path");

function createWindow(){

    const win = new BrowserWindow({
        width:1400,
        height:900,
        webPreferences:{
            preload:path.join(__dirname,"preload.js"),
            contextIsolation:true,
            webviewTag: true
        }
    });

    win.loadFile(path.join(__dirname,"../frontend/index.html"));

    // IMPORTANT
    win.webContents.openDevTools();

    return win;
}

module.exports = createWindow;