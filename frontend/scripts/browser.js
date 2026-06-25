function formatURL(url) {
    if (!url) return HOME_URL;
    if (!url.startsWith("http") && !url.startsWith("file://")) {
        if (url.includes(" ")) {
            return "https://www.google.com/search?q=" + encodeURIComponent(url);
        } else if (!url.includes(".") && !url.startsWith("localhost")) {
            return "https://" + url + ".com";
        } else {
            return "https://" + url;
        }
    }
    return url;
}

function setBrowserViewURL(view, url) {
    if (!view) return;
    view.src = url;
}

function getBrowserViewURL(view) {
    if (!view) return "";
    if (typeof view.getURL === "function") return view.getURL();
    return view.src || "";
}

function openURL(urlParam) {
    let url = urlParam || document.getElementById("urlInput").value;
    const formattedUrl = formatURL(url);
    const wv = getActiveWebview();
    if (wv) {
        setBrowserViewURL(wv, formattedUrl);
        document.getElementById("urlInput").value = formattedUrl === HOME_URL ? "" : formattedUrl;
    }
}

function quickOpen(site) {
    openURL(site);
}

function goBack() {
    const wv = getActiveWebview();
    if (wv && typeof wv.canGoBack === 'function' && wv.canGoBack()) {
        wv.goBack();
    } else if (wv && wv.contentWindow) {
        try { wv.contentWindow.history.back(); } catch (e) { }
    }
}

function goForward() {
    const wv = getActiveWebview();
    if (wv && typeof wv.canGoForward === 'function' && wv.canGoForward()) {
        wv.goForward();
    } else if (wv && wv.contentWindow) {
        try { wv.contentWindow.history.forward(); } catch (e) { }
    }
}

function reloadPage() {
    const wv = getActiveWebview();
    if (wv && typeof wv.reload === 'function') {
        wv.reload();
    } else if (wv) {
        setBrowserViewURL(wv, getBrowserViewURL(wv));
    }
}

function goHome() {
    const wv = getActiveWebview();
    if (wv) {
        setBrowserViewURL(wv, HOME_URL);
        document.getElementById("urlInput").value = "";
    }
}
