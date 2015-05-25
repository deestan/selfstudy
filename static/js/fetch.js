function nextQuestion() {
  $("#question").text("Wat " + Date.now() + "?");
}

function init() {
  nextQuestion();
  $("#next").on('click', nextQuestion);
}
