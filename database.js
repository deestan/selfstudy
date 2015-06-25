var _ = require('underscore');
var crypto = require('crypto');
var exercises = require('./exercises');
var fs = require('fs');

function fakeId(_multiargs) {
  var hash = crypto.Hash('sha1');
  for (var i=0; i<arguments.length; i++)
    hash.update(arguments[i]);
  var digest = hash.digest();
  var id = digest[0] * 256 + digest[1];
  return id;
}

// Create fake IDs for exercises
for (var setId in exercises) {
  exercises[setId].forEach(function(exercise) {
    exercise.id = fakeId(exercise.q, exercise.a);
  });
}

function setProgress(user, progress, cb) {
  fs.writeFile('db/' + fakeId(user.username), JSON.stringify(progress), cb);
}

function getProgress(user, cb) {
  fs.readFile('db/' + fakeId(user.username), function(err, data) {
    if (err.code == 'ENOENT') return cb(null, {});
    if (err) return cb(err);
    cb(null, JSON.parse(data));
  });
}

function getExercises(ids, cb) {
  var result = [];
  ids.forEach(function(id) {
    result = _.union(result, exercises[id]);
  });
  cb(null, result);
}

module.exports = {
  getProgress: getProgress,
  setProgress: setProgress,
  getExercises: getExercises
}
