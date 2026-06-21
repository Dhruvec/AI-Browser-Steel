document.getElementById("aiPanel").innerHTML = `
<div class="glass-panel flex flex-col h-full rounded-2xl border glass-divider overflow-hidden">
    <div class="flex items-center justify-between p-4 border-b border-white/10">
        <span class="text-sm font-semibold text-text-primary">AI Assistant</span>
        <span class="h-2 w-2 bg-white rounded-full" title="Connected"></span>
    </div>

    <div id="chatArea" class="flex-1 p-4 overflow-y-auto space-y-3 text-sm custom-scrollbar">
        <div class="text-text-secondary text-sm">How can I help?</div>
    </div>

    <div class="p-3 border-t border-white/10">
        <div class="relative flex items-center">
            <input
                id="aiInput"
                class="flex-1 py-2.5 pl-3 pr-10 bg-transparent border rounded-2xl outline-none text-sm placeholder:text-text-secondary"
                placeholder="Ask STEEL..."
                onkeydown="if(event.key==='Enter'){sendAICommand()}"
            />
            <button id="aiMicBtn" onclick="startVoice()" class="interactive absolute right-1.5 p-1.5 text-text-secondary hover:text-white rounded-xl" title="Voice Command">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
            </button>
        </div>
    </div>
</div>
`