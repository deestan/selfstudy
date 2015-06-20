// Stores exercises and progress in global vars "database" and "progress".
function load(done) {
  var hasLoadedExercises = false;
  var hasLoadedProgress = false;

  function exercisesLoaded(data) {
    database = data;
    hasLoadedExercises = true;
    checkAllLoaded();
  }

  function progressLoaded(data) {
    progress = data;
    hasLoadedProgress = true;
    checkAllLoaded();
  }

  function checkAllLoaded() {
    if (hasLoadedExercises && hasLoadedProgress)
      done();
  }

  function loadProgress(done) {
    $.getJSON("/api/myProgress", progressLoaded)
      .fail(function notLoaded(failure) {
        console.log(failure);
        if (failure.status == 401) {
          try {
            return done(JSON.parse(localStorage.getItem('progress')) || {});
          } catch (error) {
            return done({});
          }
        } else {
          console.log("Unrecognized failure on progress load.");
          console.log(failure);
        }
      });
  }

  loadProgress(progressLoaded);
  $.getJSON("/api/exercises", exercisesLoaded);
}

function saveProgress() {
  localStorage.setItem('progress', JSON.stringify(progress));
}
