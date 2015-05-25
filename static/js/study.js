$(init);

var questions = [{q: "Loading...", a:"Loading..."}];
var archive = [];

function init() {
  $(".btn-go").on('click', reveal);
  $(".yay .btn").on('click', yay);
  $(".nay .btn").on('click', nay);
  $.getJSON("/api/questions", questionsLoaded);
}

function questionsLoaded(data) {
  $('.exercise').removeClass('loading');
  questions = randy.shuffle(data);
  archive = [];
  nextQuestion();
}

function reveal() {
  $('.exercise').addClass('reveal');
}

function yay() {
  $('.exercise').removeClass('reveal');
  nextQuestion();
}

function nay() {
  $('.exercise').removeClass('reveal');
  nextQuestion();
}

function nextQuestion() {
  var q = questions.pop();
  archive.push(q);
  $('.question').html(q.q);
  $('.answer').html(q.a);
}
