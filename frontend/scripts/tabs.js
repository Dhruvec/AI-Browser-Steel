let tabs = [];
let activeTabId = null;

const IS_ELECTRON_BROWSER = !!(window.process && window.process.versions && window.process.versions.electron)
    || navigator.userAgent.toLowerCase().includes("electron");
const BROWSER_VIEW_TAG = IS_ELECTRON_BROWSER ? "webview" : "iframe";

// Compute absolute path for home so embedded views can load it reliably.
const HOME_URL = window.location.href.replace('index.html', 'home.html').replace(/\?.*$/, '');

function createBrowserView(tabId, url) {
    const view = document.createElement(BROWSER_VIEW_TAG);
    view.id = tabId + "_wv";
    view.className = "w-full h-full bg-white absolute inset-0 hidden border-0";
    view.src = url;

    if (BROWSER_VIEW_TAG === "webview") {
        view.addEventListener('did-navigate', (e) => {
            if (activeTabId === tabId) updateURLBar(e.url);
        });
        view.addEventListener('did-navigate-in-page', (e) => {
            if (activeTabId === tabId) updateURLBar(e.url);
        });
        view.addEventListener('page-title-updated', (e) => {
            updateTabTitle(tabId, e.title);
        });
    } else {
        view.title = "Browser tab";
        view.addEventListener("load", () => {
            if (activeTabId === tabId) updateURLBar(view.src);
            try {
                updateTabTitle(tabId, view.contentDocument.title);
            } catch (e) {
                updateTabTitle(tabId, view.src.includes("home.html") ? "STEEL Home" : "New Tab");
            }
        });
    }

    return view;
}

function createNewTab(url) {
    url = url || HOME_URL;
    const tabId = 'tab_' + Date.now();

    const wv = createBrowserView(tabId, url);
    document.getElementById("webviewContainer").appendChild(wv);

    const tabEl = document.createElement("div");
    tabEl.id = tabId;
    tabEl.className = "group shrink-0 inline-flex items-center px-3 py-1.5 text-xs rounded-2xl cursor-pointer transition-all max-w-[180px] min-w-[120px] border border-transparent select-none text-text-secondary";
    tabEl.onclick = () => switchTab(tabId);

    tabEl.innerHTML = `
        <span class="truncate flex-1 font-medium mr-2" id="${tabId}_title">New Tab</span>
        <div class="w-5 h-5 flex items-center justify-center rounded-full text-transparent group-hover:text-text-secondary hover:!text-white hover:!bg-white/20 transition-all text-sm" onclick="closeTab(event, '${tabId}')">x</div>
    `;

    const tabBar = document.getElementById("tabBar");
    const plusBtn = document.getElementById("newTabBtn");
    tabBar.insertBefore(tabEl, plusBtn);

    tabs.push(tabId);
    switchTab(tabId);
}

function getViewURL(view) {
    if (!view) return "";
    if (typeof view.getURL === "function") return view.getURL();
    return view.src || "";
}

function updateURLBar(url) {
    document.getElementById("urlInput").value = (!url || url.includes("home.html")) ? "" : url;
}

function switchTab(tabId) {
    activeTabId = tabId;

    tabs.forEach(id => {
        const wv = document.getElementById(id + "_wv");
        if (wv) wv.classList.add("hidden");

        const tabEl = document.getElementById(id);
        if (tabEl) {
            if (id === tabId) {
                tabEl.classList.add("glass-panel", "text-text-primary");
                tabEl.classList.remove("text-text-secondary");
            } else {
                tabEl.classList.remove("glass-panel", "text-text-primary");
                tabEl.classList.add("text-text-secondary");
            }
        }
    });

    const activeWv = getActiveWebview();
    if (activeWv) {
        activeWv.classList.remove("hidden");
        updateURLBar(getViewURL(activeWv));
    }
}

function closeTab(event, tabId) {
    event.stopPropagation();

    const wv = document.getElementById(tabId + "_wv");
    if (wv) wv.remove();
    const tabEl = document.getElementById(tabId);
    if (tabEl) tabEl.remove();

    tabs = tabs.filter(id => id !== tabId);

    if (tabs.length === 0) {
        createNewTab();
    } else if (activeTabId === tabId) {
        switchTab(tabs[tabs.length - 1]);
    }
}

function updateTabTitle(tabId, title) {
    const titleEl = document.getElementById(tabId + "_title");
    if (!titleEl) return;

    titleEl.textContent = title === "STEEL Home" ? "New Tab" : (title || "New Tab");
}

function getActiveWebview() {
    if (!activeTabId) return null;
    return document.getElementById(activeTabId + "_wv");
}

function initTabs() {
    const tabBar = document.getElementById("tabBar");
    tabBar.classList.add("flex", "items-center", "flex-nowrap", "gap-1", "overflow-x-auto", "overflow-y-hidden", "whitespace-nowrap");
    tabBar.innerHTML = `<button id="newTabBtn" onclick="createNewTab()" class="shrink-0 ml-1 px-3 py-1.5 text-text-secondary hover:text-white hover:bg-white/10 rounded-2xl text-base transition-colors">+</button>`;
    createNewTab();
}

document.addEventListener("DOMContentLoaded", initTabs);
