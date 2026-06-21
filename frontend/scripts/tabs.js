let tabs = [];
let activeTabId = null;

// Compute absolute path for home so webview can load a local file reliably
const HOME_URL = window.location.href.replace('index.html', 'home.html').replace(/\?.*$/, '');

function createNewTab(url) {
    url = url || HOME_URL;
    const tabId = 'tab_' + Date.now();

    const wv = document.createElement("webview");
    wv.id = tabId + "_wv";
    wv.className = "w-full h-full bg-white absolute inset-0 hidden";
    wv.src = url;

    wv.addEventListener('did-navigate', (e) => {
        if (activeTabId === tabId) updateURLBar(e.url);
    });
    wv.addEventListener('did-navigate-in-page', (e) => {
        if (activeTabId === tabId) updateURLBar(e.url);
    });
    wv.addEventListener('page-title-updated', (e) => {
        updateTabTitle(tabId, e.title);
    });

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
        try {
            updateURLBar(activeWv.getURL());
        } catch (e) { /* webview might not be ready */ }
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
