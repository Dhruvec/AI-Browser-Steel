document.getElementById("navbar").innerHTML = `

<div class="flex items-center bg-gray-800 p-2">

<button onclick="goBack()" class="px-2">⬅</button>

<button onclick="goForward()" class="px-2">➡</button>

<button onclick="reloadPage()" class="px-2">⟳</button>

<button onclick="goHome()" class="px-2">🏠</button>

<input
id="urlInput"
class="flex-1 mx-2 p-2 bg-gray-700 rounded outline-none focus:ring-1 focus:ring-blue-500 transition-shadow"
placeholder="Search or enter URL"
onkeydown="if(event.key==='Enter') openURL()"
/>

</div>
`