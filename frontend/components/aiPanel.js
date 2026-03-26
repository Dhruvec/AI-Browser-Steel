document.getElementById("aiPanel").innerHTML = `

<div class="w-80 bg-gray-800 flex flex-col h-full border-l border-gray-700">

<div class="p-4 font-bold border-b border-gray-700 text-lg flex items-center space-x-2">
<span>✨</span> <span>AI Assistant</span>
</div>

<div id="chatArea" class="flex-1 p-3 overflow-y-auto space-y-2 text-sm font-light"></div>

<div class="p-3 border-t border-gray-700 bg-gray-900/50">

<div class="flex items-center space-x-2">
<input
id="aiInput"
class="flex-1 p-2 bg-gray-700 rounded-full outline-none px-4 text-sm focus:ring-1 focus:ring-blue-500 transition-shadow"
placeholder="Ask AI..."
onkeydown="if(event.key==='Enter'){sendAICommand()}"
/>
<button id="aiMicBtn" onclick="startVoice()" class="p-2.5 bg-blue-600 hover:bg-blue-500 rounded-full transition-colors flex-shrink-0 focus:outline-none" title="Voice Command">
    <svg class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
</button>
</div>

</div>

</div>
`