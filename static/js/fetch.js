function nextQuestion() {
  $.getJSON('/api/questions', function(data) {
    var idx = Date.now() % data.length;
    $("#question").text(JSON.stringify(data[idx]));
  });
}

function init() {
  nextQuestion();
  $("#next").on('click', nextQuestion);
}
