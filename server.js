var express = require("express");
var app = express();

var exercises = require("./exercises");

var PORT = 8080;
var serverStartTime = Date.now();

app.use(express.static(__dirname + "/static"));

app.get('/api/exercises', function(req, res) {
  res.json({ exercises: exercises,
             version: serverStartTime });
});

app.listen(PORT);
console.log("Server running at:");
console.log("http://localhost:" + PORT + "/");
