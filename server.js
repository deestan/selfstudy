var express = require("express");
var session = require("express-session");
var passport = require("passport");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var flash = require("connect-flash");

var database = require("./database");

var PORT = 8080;
var serverStartTime = Date.now();
var app = express();
require('./config-passport')(passport);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({ secret: "headbunny", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + "/static"));

app.get('/api/exercises', function(req, res) {
  database.getExercises(function(err, exercises) {
    if (err) return res.status(500).send(err);
    res.json({ exercises: exercises });
  });
});

app.get('/api/progress', function(req, res) {
  database.getProgress(req.user, function(err, progress) {
    if (err) return res.status(500).send(err);
    res.json({ progress: progress });
  });
});

app.put('/api/progress', function(req, res) {
  var progress = req.body;
  database.setProgress(req.user, progress, function(err) {
    if (err) return res.status(500).send(err);
    res.send("Got it!");
  });
});

app.post('/login', passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/login.html'
}));

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/user', function(req, res) {
  res.json(req.user || null);
});

app.listen(PORT);
console.log("Server running at:");
console.log("http://localhost:" + PORT + "/");
