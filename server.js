var express = require("express");
var session = require("express-session");
var passport = require("passport");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var flash = require("connect-flash");

var exercises = require("./exercises");

var PORT = 8080;
var serverStartTime = Date.now();
var app = express();
require('./config-passport')(passport);

app.use(cookieParser());
app.use(bodyParser());
app.use(session({ secret: "headbunny" }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(__dirname + "/static"));

app.get('/api/exercises', function(req, res) {
  res.json({ exercises: exercises,
             version: serverStartTime });
});

app.post('/login', passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/login.html'
}));

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.listen(PORT);
console.log("Server running at:");
console.log("http://localhost:" + PORT + "/");
