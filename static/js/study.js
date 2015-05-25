$(init);

function init() {
  console.log('inited');
  $(".btn-go").on('click', reveal);
}

function reveal() {
  $('.exercise').addClass('reveal');
}
