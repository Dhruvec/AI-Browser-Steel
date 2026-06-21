document.getElementById("navbar").innerHTML = `
<div class="glass-panel flex items-center gap-2 px-3 py-2 rounded-2xl border glass-divider">
    <button onclick="goBack()" class="interactive nav-btn" title="Back">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
    </button>
    <button onclick="goForward()" class="interactive nav-btn" title="Forward">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
    </button>
    <button onclick="reloadPage()" class="interactive nav-btn" title="Reload">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
    </button>
    <button onclick="goHome()" class="interactive nav-btn" title="Home">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a 1 1 0 001 1h3m10-11l2 2m-2-2v10a 1 1 0 01-1 1h-3m-6 0a 1 1 0 001-1v-4a 1 1 0 011-1h2a 1 1 0 011 1v4a 1 1 0 001 1m-6 0h6" /></svg>
    </button>

    <div class="flex-1 relative flex items-center">
        <input
            id="urlInput"
            class="w-full pl-4 pr-4 py-2.5 bg-transparent border rounded-2xl outline-none text-sm placeholder:text-text-secondary"
            placeholder="Search or enter URL"
            onkeydown="if(event.key==='Enter') openURL()"
        />
    </div>

    <button id="authUserPanel" onclick="logout()" class="hidden items-center px-3 py-2 rounded-2xl border border-white/10 bg-white/5 text-xs text-text-secondary hover:text-white transition-colors" title="Logout">Logout</button>
</div>
`;

renderAuthUI();
