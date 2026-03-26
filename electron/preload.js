const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("browserAPI", {

    openURL:(url)=>{
        ipcRenderer.send("open-url",url);
    }

});