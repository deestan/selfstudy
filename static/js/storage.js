function load() {
  function exercisesLoaded(data) {
    database = data;
    loadProgress(function() {
      updateBuckets();
      nextExercise();
    });
  }

  $.getJSON("/api/exercises", exercisesLoaded);
}

function loadProgress(done) {
  try {
    progress = JSON.parse(localStorage.getItem('progress')) || {};
  } catch (error) {
    progress = {};
  }
  done();
}

function saveProgress() {
  localStorage.setItem('progress', JSON.stringify(progress));
}
