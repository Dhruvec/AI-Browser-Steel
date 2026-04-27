let tabs = [];
let activeTabId = null;

// Compute absolute path for home so webview can load a local file reliably
const HOME_URL = window.location.href.replace('index.html', 'home.html').replace(/\?.*$/, '');

function createNewTab(url) {
    url = url || HOME_URL;
    const tabId = 'tab_' + Date.now();
    
    // 1. Create Webview
    const wv = document.createElement("webview");
    wv.id = tabId + "_wv";
    wv.className = "w-full h-full bg-white absolute inset-0 hidden";
    wv.src = url;
    
    // Add Nav listeners
    wv.addEventListener('did-navigate', (e) => {
        if (activeTabId === tabId) {
            updateURLBar(e.url);
        }
    });
    wv.addEventListener('did-navigate-in-page', (e) => {
        if (activeTabId === tabId) {
            updateURLBar(e.url);
        }
    });
    wv.addEventListener('page-title-updated', (e) => {
        updateTabTitle(tabId, e.title);
    });

    document.getElementById("webviewContainer").appendChild(wv);
    
    // 2. Create Tab UI
    const tabEl = document.createElement("div");
    tabEl.id = tabId;
    tabEl.className = "group flex items-center px-4 py-2 mt-1 mr-0.5 text-xs rounded-t-xl cursor-pointer transition-all max-w-[200px] min-w-[140px] border-x border-t border-transparent select-none";
    tabEl.onclick = () => switchTab(tabId);
    
    tabEl.innerHTML = `
        <span class="truncate flex-1 font-medium mr-2 text-text-secondary group-hover:text-text-primary transition-colors" id="${tabId}_title">New Tab</span>
        <div class="w-5 h-5 flex items-center justify-center rounded-lg text-transparent group-hover:text-text-secondary hover:!text-white hover:!bg-red-500/80 transition-all text-base" onclick="closeTab(event, '${tabId}')">×</div>
    `;
    
    const tabBar = document.getElementById("tabBar");
    const plusBtn = document.getElementById("newTabBtn");
    tabBar.insertBefore(tabEl, plusBtn);
    
    tabs.push(tabId);
    switchTab(tabId);
}

function updateURLBar(url) {
    if (!url || url.includes("home.html")) {
        document.getElementById("urlInput").value = "";
    } else {
        document.getElementById("urlInput").value = url;
    }
}

function switchTab(tabId) {
    activeTabId = tabId;
    
    tabs.forEach(id => {
        const wv = document.getElementById(id + "_wv");
        if (wv) wv.classList.add("hidden");
        
        const tabEl = document.getElementById(id);
        const titleEl = document.getElementById(id + "_title");
        if (tabEl) {
            if (id === tabId) {
                tabEl.classList.remove("bg-transparent", "border-transparent");
                tabEl.classList.add("bg-secondary", "border-border");
                if (titleEl) titleEl.classList.replace("text-text-secondary", "text-text-primary");
            } else {
                tabEl.classList.add("bg-transparent", "border-transparent");
                tabEl.classList.remove("bg-secondary", "border-border");
                if (titleEl) titleEl.classList.replace("text-text-primary", "text-text-secondary");
            }
        }
    });
    
    const activeWv = getActiveWebview();
    if (activeWv) {
        activeWv.classList.remove("hidden");
        try {
            updateURLBar(activeWv.getURL());
        } catch(e) { /* webview might not be ready */ }
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
    if (titleEl) {
        titleEl.textContent = title || "New Tab";
    }
}

function getActiveWebview() {
    if (!activeTabId) return null;
    return document.getElementById(activeTabId + "_wv");
}

function initTabs() {
    const tabBar = document.getElementById("tabBar");
    tabBar.innerHTML = `<button id="newTabBtn" onclick="createNewTab()" class="ml-1 px-3 py-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg text-lg transition-colors">+</button>`;
    createNewTab();
}

document.addEventListener("DOMContentLoaded", initTabs);
