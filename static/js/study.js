$(init);

var questions = [{q: "Loading...", a:"Loading..."}];
var currentQuestion = null;

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
  $.getJSON("/api/questions", questionsLoaded);
}

function setTier(question, tierId) {
  var t = tiers[tierId];
  question.nextTime = Date.now() + t.minSecs * 1000;
}

function questionsLoaded(data) {
  while (data.length) {
    var q = data.pop();
    q.tierId = 'fresh';
    q.nextTime = 0;
    questions.push(q);
  }
  nextQuestion();
}

function reveal() {
  $('.exercise').addClass('reveal');
}

function yay() {
  if (!currentQuestion) return;
  var tier = tiers[currentQuestion.tierId];
  var newTier = tiers[tier.ascendTo];
  currentQuestion.nextTime = Date.now() + newTier.minSecs * 1000;
  nextQuestion();
}

function nay() {
  if (!currentQuestion) return;
  var tier = tiers[currentQuestion.tierId];
  var newTier = tiers[tier.failTo];
  currentQuestion.nextTime = Date.now() + newTier.minSecs * 1000;
  nextQuestion();
}

function nextQuestion() {
  $('.exercise').removeClass('loading');

  var validQuestions = [];
  var now = Date.now();
  var nearest = Infinity;
  for (var i=0; i < questions.length; i++) {
    var q = questions[i];
    if (q.nextTime < nearest)
      nearest = q.nextTime;
    if (q.nextTime < now)
      validQuestions.push(q);
  }

  if (validQuestions.length == 0) {
    $('.exercise').addClass('reveal');
    var toWait = nearest - now;
    $('.question').html("Next question ready in: " + Math.ceil(toWait / 1000) + " seconds.");
    $('.answer').html("Let's wait!");
    setTimeout(nextQuestion, 100);
    return;
  }

  currentQuestion = randy.choice(validQuestions);

  $('.exercise').removeClass('reveal');
  $('.question').html(currentQuestion.q);
  $('.answer').html(currentQuestion.a);
}
