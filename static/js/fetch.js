function nextQuestion() {
  $.getJSON('/api/questions', function(data) {
    $("#question").text(JSON.stringify(randy.choice(data)));
  });
}

function init() {
  nextQuestion();
  $("#next").on('click', nextQuestion);
}
