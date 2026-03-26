const fetch = require("node-fetch")

async function testAI(){

const response = await fetch("http://127.0.0.1:8000/command",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
text:"open github"
})

})

const data = await response.json()

console.log("AI RESULT:",data)

}

testAI()