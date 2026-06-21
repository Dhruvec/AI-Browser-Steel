document.getElementById("sidebar").innerHTML = `
<div class="glass-panel flex flex-col h-full rounded-2xl border glass-divider overflow-hidden">
    <div class="p-4 border-b border-white/10">
        <h2 class="text-sm font-semibold text-text-primary">Quick Access</h2>
    </div>

    <div class="p-3 space-y-2">
        <button class="quick-link" onclick="quickOpen('youtube.com')">
            <span class="quick-icon text-text-primary">▶</span>
            <span>YouTube</span>
        </button>
        <button class="quick-link" onclick="quickOpen('instagram.com')">
            <span class="quick-icon text-text-primary">◎</span>
            <span>Instagram</span>
        </button>
        <button class="quick-link" onclick="quickOpen('github.com')">
            <span class="quick-icon text-text-primary">G</span>
            <span>GitHub</span>
        </button>
    </div>
</div>
`