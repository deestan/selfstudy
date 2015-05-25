function nextQuestion() {
  var q = document.getElementById("question");
  q.innerText = "Wat " + Date.now() + "?";
}

function init() {
  nextQuestion();
  document.getElementById("next").onclick = nextQuestion;
}
