var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.username);
    });

    passport.deserializeUser(function(username, done) {
      done(null, { username: username });
    });

  passport.use('local-login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, username, password, done) {
    return done(null, { username: username, fake: true });
  }));
}


