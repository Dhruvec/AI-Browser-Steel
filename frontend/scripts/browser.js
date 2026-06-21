function formatURL(url) {
    if(!url.startsWith("http") && !url.startsWith("file://")){
        if(url.includes(" ")){
            return "https://www.google.com/search?q=" + encodeURIComponent(url);
        } else if(!url.includes(".") && !url.startsWith("localhost")){
            return "https://" + url + ".com";
        } else {
            return "https://" + url;
        }
    }
    return url;
}

function openURL(urlParam){
    let url = urlParam || document.getElementById("urlInput").value;
    const wv = getActiveWebview();
    if(wv) {
        wv.src = formatURL(url);
        document.getElementById("urlInput").value = formatURL(url);
    }
}

function quickOpen(site){
    openURL(site);
}

function goBack(){
    const wv = getActiveWebview();
    if(wv && typeof wv.canGoBack === 'function' && wv.canGoBack()) wv.goBack();
}

function goForward(){
    const wv = getActiveWebview();
    if(wv && typeof wv.canGoForward === 'function' && wv.canGoForward()) wv.goForward();
}

function reloadPage(){
    const wv = getActiveWebview();
    if(wv && typeof wv.reload === 'function') wv.reload();
}

function goHome(){
    const wv = getActiveWebview();
    if(wv) {
        wv.src = HOME_URL;
        document.getElementById("urlInput").value = "";
    }
}