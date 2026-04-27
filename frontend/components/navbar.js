document.getElementById("navbar").innerHTML = `
<div class="flex items-center bg-primary p-2.5 gap-1 border-b border-border">
    <div class="flex items-center gap-0.5 px-1">
        <button onclick="goBack()" class="p-2 text-text-secondary hover:text-text-primary hover:bg-tertiary/50 rounded-lg transition-all" title="Back">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button onclick="goForward()" class="p-2 text-text-secondary hover:text-text-primary hover:bg-tertiary/50 rounded-lg transition-all" title="Forward">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
        </button>
        <button onclick="reloadPage()" class="p-2 text-text-secondary hover:text-text-primary hover:bg-tertiary/50 rounded-lg transition-all" title="Reload">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
    </div>

    <button onclick="goHome()" class="p-2 text-text-secondary hover:text-text-primary hover:bg-tertiary/50 rounded-lg transition-all mx-1" title="Home">
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    </button>

    <div class="flex-1 relative flex items-center group">
        <div class="absolute left-3 text-text-secondary group-focus-within:text-blue-400 transition-colors">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        </div>
        <input
            id="urlInput"
            class="w-100 flex-1 pl-10 pr-4 py-2 bg-secondary/80 border border-border rounded-xl outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm placeholder:text-text-secondary"
            placeholder="Search or enter URL"
            onkeydown="if(event.key==='Enter') openURL()"
        />
    </div>
    
    <div class="flex items-center gap-1 px-2">
        <button class="p-2 text-text-secondary hover:text-text-primary hover:bg-tertiary/50 rounded-lg transition-all">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
        </button>
    </div>
</div>
`