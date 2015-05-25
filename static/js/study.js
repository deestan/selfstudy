$(init);

var database = { exercises: [{q: "Loading...", a:"Loading..."}],
                 version: 0 };
var currentExercise = null;

var tiers = {
  "fresh": {
    minSecs: 5,
    failTo: "fresh",
    ascendTo: "1m"
  },
  "1m": {
    minSecs: 60,
    failTo: "fresh",
    ascendTo: "finished"
  },
  "finished": {
    minSecs: Infinity,
    failTo: "finished",
    ascendTo: "finished"
  }
};

function init() {
  $(".btn-thinking").on('click', reveal);
  $(".yay .btn").on('click', yay);
  $(".nay .btn").on('click', nay);
  $.getJSON("/api/exercises", exercisesLoaded);
}

function setTier(exercise, tierId) {
  var t = tiers[tierId];
  exercise.nextTime = Date.now() + t.minSecs * 1000;
}

function save() {
  localStorage.setItem('database', JSON.stringify(database));
}

function exercisesLoaded(data) {
  try {
    database = JSON.parse(localStorage.getItem('database'));
  } catch (error) {
    database = null;
  }
  if (!database || database.version != data.version) {
    database = data;
    for (var i=0; i < database.exercises.length; i++) {
      var e = database.exercises[i];
      e.tierId = 'fresh';
      e.nextTime = 0;
    }
  }
  nextExercise();
}

function reveal() {
  $('.exercise').addClass('reveal');
}

function yay() {
  if (!currentExercise) return;
  var tier = tiers[currentExercise.tierId];
  var newTier = tiers[tier.ascendTo];
  currentExercise.tierId = tier.ascendTo;
  currentExercise.nextTime = Date.now() + newTier.minSecs * 1000;
  save();
  nextExercise();
}

function nay() {
  if (!currentExercise) return;
  var tier = tiers[currentExercise.tierId];
  var newTier = tiers[tier.failTo];
  currentExercise.tierId = tier.failTo;
  currentExercise.nextTime = Date.now() + newTier.minSecs * 1000;
  save();
  nextExercise();
}

function nextExercise() {
  $('.exercise').removeClass('loading');

  var validExercises = [];
  var now = Date.now();
  var nearest = Infinity;
  for (var i=0; i < database.exercises.length; i++) {
    var q = database.exercises[i];
    if (q.nextTime < nearest)
      nearest = q.nextTime;
    if (q.nextTime < now)
      validExercises.push(q);
  }

  if (validExercises.length == 0) {
    currentExercise = null;
    $('.exercise').addClass('reveal');
    var toWait = nearest - now;
    $('.question').html("Next exercise ready in: " + Math.ceil(toWait / 1000) + " seconds.");
    $('.answer').html("Let's wait!");
    setTimeout(nextExercise, 100);
    return;
  }

  currentExercise = randy.choice(validExercises);

  $('.exercise').removeClass('reveal');
  $('.question').html(currentExercise.q);
  $('.answer').html(currentExercise.a);
}
