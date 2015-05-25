$(init);

function init() {
  console.log('inited');
  $(".btn-go").on('click', reveal);
  $(".yay .btn").on('click', yay);
  $(".nay .btn").on('click', nay);
}

function reveal() {
  $('.exercise').addClass('reveal');
}

function yay() {
  $('.exercise').removeClass('reveal');
}

function nay() {
  $('.exercise').removeClass('reveal');
}
