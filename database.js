var crypto = require('crypto');
var exercises = require('./exercises');

// Create fake IDs
exercises.forEach(function(exercise) {
  var hash = crypto.Hash('sha1');
  hash.update(exercise.q);
  hash.update(exercise.a);
  var digest = hash.digest();
  var id = digest[0] * 256 + digest[1];
  exercise.id = id;
});

function get(cb) {
  cb(null, exercises);
}

module.exports = {
  getExercises: get
}
