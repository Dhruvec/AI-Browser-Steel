function openURL(win, url){

    if(!url.startsWith("http") && !url.startsWith("file://")){
        if(url.includes(" ")){
            url = "https://www.google.com/search?q=" + encodeURIComponent(url);
        } else if(!url.includes(".") && !url.startsWith("localhost")){
            url = "https://" + url + ".com";
        } else {
            url = "https://" + url;
        }
    }

    win.loadURL(url);
}


function goBack(win){

    if(win.webContents.canGoBack()){
        win.webContents.goBack();
    }

}


function goForward(win){

    if(win.webContents.canGoForward()){
        win.webContents.goForward();
    }

}


function reload(win){

    win.webContents.reload();
}

module.exports = {
    openURL,
    goBack,
    goForward,
    reload
};