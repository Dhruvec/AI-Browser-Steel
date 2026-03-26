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
    tabEl.className = "group flex items-center px-4 py-2 mt-1 mr-1 text-sm rounded-t-lg cursor-pointer transition-colors max-w-[200px] min-w-[120px]";
    tabEl.onclick = () => switchTab(tabId);
    
    tabEl.innerHTML = `
        <span class="truncate flex-1 font-medium mr-2" id="${tabId}_title">New Tab</span>
        <div class="w-5 h-5 flex items-center justify-center rounded-full text-transparent group-hover:text-gray-400 hover:!text-white hover:!bg-red-500 transition-all font-bold" onclick="closeTab(event, '${tabId}')">×</div>
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
        if (tabEl) {
            if (id === tabId) {
                tabEl.classList.remove("bg-gray-800", "text-gray-400");
                tabEl.classList.add("bg-gray-700", "text-white");
            } else {
                tabEl.classList.add("bg-gray-800", "text-gray-400");
                tabEl.classList.remove("bg-gray-700", "text-white");
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
