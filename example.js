var sha256 = require("./index.js")


//Regular  Example
console.log(sha256.hash("abc")) //Logs "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"


// Advanced Async Callback Example
sha256.hash("abc",{async:true}).then(function(hash){
  console.log(hash)
})
console.log("hi")

//Logs "hi" First Then "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
