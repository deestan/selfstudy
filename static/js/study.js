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
    minSecs: 1 * 60,
    failTo: "fresh",
    ascendTo: "5m"
  },
  "5m": {
    minSecs: 5 * 60,
    failTo: "1m",
    ascendTo: "10m"
  },
  "10m": {
    minSecs: 10 * 60,
    failTo: "5m",
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
  updateBuckets();
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
  updateBuckets();
  nextExercise();
}

function reveal() {
  $('.exercise').addClass('reveal');
}

function exerciseAnswered(succeeded) {
  if (!currentExercise) return;
  var direction = succeeded ? "ascendTo" : "failTo";
  var tier = tiers[currentExercise.tierId];
  var newTier = tiers[tier[direction]];
  currentExercise.tierId = tier[direction];
  currentExercise.nextTime = Date.now() + newTier.minSecs * 1000;
  updateBuckets();
  save();
  nextExercise();
}

function updateBuckets() {
  var buckets = calculateFinishedness();
  for (var i=0; i < buckets.length; i++)
    $(".prog__tier" + (i + 1)).text(buckets[i]);
}

function yay() {
  exerciseAnswered(true);
}

function nay() {
  exerciseAnswered(false);
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

function calculateFinishedness() {
  var buckets = [];
  var bucketIdOfTier = {};
  // Sort tiers by retention time
  var sortedTiers = [];
  for(var tierId in tiers)
    sortedTiers.push({ id: tierId, tier: tiers[tierId] });
  sortedTiers.sort(function(a,b) { return a.tier.minSecs - b.tier.minSecs; });
  /* Calculate which buckets each exercise should go to depending on
     their current tier */
  for (var i=0; i < sortedTiers.length; i++) {
    bucketIdOfTier[sortedTiers[i].id] = i;
    buckets.push(0);
  }
  // Count exercises into buckets!
  for (var i=0; i < database.exercises.length; i++) {
    var bucketId = bucketIdOfTier[database.exercises[i].tierId];
    buckets[bucketId]++;
  }
  return buckets;
}
