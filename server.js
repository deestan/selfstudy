var express = require("express");
var app = express();
var PORT = 8080;

app.use(express.static(__dirname + "/static"));
app.listen(PORT);
console.log("Server running at:");
console.log("http://localhost:" + PORT + "/");
