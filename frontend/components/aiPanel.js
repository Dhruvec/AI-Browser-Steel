document.getElementById("aiPanel").innerHTML = `
<div class="w-80 bg-secondary flex flex-col h-full border-l border-border glass-morphism">
    <div class="p-5 font-semibold border-b border-border text-base flex items-center justify-between">
        <div class="flex items-center space-x-2">
            <span class="text-blue-400">✨</span>
            <span>AI Assistant</span>
        </div>
        <div class="h-2 w-2 bg-green-500 rounded-full animate-pulse" title="Connected"></div>
    </div>

    <div id="chatArea" class="flex-1 p-4 overflow-y-auto space-y-4 text-sm font-normal custom-scrollbar">
        <!-- Messages will appear here -->
        <div class="animate-fade-in text-text-secondary text-xs text-center py-4">
            How can I help you today?
        </div>
    </div>

    <div class="p-4 border-t border-border bg-primary/30">
        <div class="relative flex items-center gap-2">
            <input
                id="aiInput"
                class="flex-1 py-2.5 pl-4 pr-10 bg-tertiary/50 border border-border rounded-xl outline-none text-sm focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-text-secondary"
                placeholder="Message STEEL..."
                onkeydown="if(event.key==='Enter'){sendAICommand()}"
            />
            <button 
                id="aiMicBtn" 
                onclick="startVoice()" 
                class="absolute right-1.5 p-1.5 text-text-secondary hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
                title="Voice Command"
            >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
            </button>
        </div>
    </div>
</div>
`