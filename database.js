var crypto = require('crypto');
var exercises = require('./exercises');

function fakeId(_multiargs) {
  var hash = crypto.Hash('sha1');
  for (var i=0; i<arguments.length; i++)
    hash.update(arguments[i]);
  var digest = hash.digest();
  var id = digest[0] * 256 + digest[1];
  return id;
}

// Create fake IDs for exercises
exercises.forEach(function(exercise) {
  exercise.id = fakeId(exercise.q, exercise.a);
});

var progressMemDb = {};

function setProgress(user, progress, cb) {
  progressMemDb[fakeId(user.username)] = progress;
  cb(null);
}

function getProgress(user, cb) {
  cb(null, progressMemDb[fakeId(user.username)] || {});
}

function getExercises(cb) {
  cb(null, exercises);
}

module.exports = {
  getProgress: getProgress,
  setProgress: setProgress,
  getExercises: getExercises
}
