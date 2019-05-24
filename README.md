# Easy Sha256

A simple way to use SHA256 in the browser and NodeJS. Built in pure JS without any 3rd party libraries or dependencies.

### Installing

Browser
```
<script src="https://cdn.trat.chat/sha256.min.js"></script>
```

NodeJS
```
npm i easy-sha256
```


### Usage

NodeJS
```
var Sha256 = require("easy-sha256")
console.log(Sha256.hash("abc")) //Logs "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
```
Browser (include the script tag above in your html)
```
console.log(Sha256.hash("abc")) //Logs "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
```

###Advanced Usage

To use sha256 in async mode
```
Sha256.hash("abc",{async:true}).then(function(hash){
  console.log(hash)
})
console.log("hi")

//Logs "hi" First Then "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"
```
