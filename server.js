var express = require("express");
var app = express();

var questions = require("./questions");

var PORT = 8080;

app.use(express.static(__dirname + "/static"));

app.get('/api/questions', function(req, res) {
  res.json(questions);
});

app.listen(PORT);
console.log("Server running at:");
console.log("http://localhost:" + PORT + "/");
