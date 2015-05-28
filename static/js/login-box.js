$(function() {

  function checkUserLoggedIn() {
    $.getJSON("/user", function(data) {
      if (data == null) {
        $(".loginbox").show();
        $(".loggedinuser").hide();
      } else {
        $(".loginbox").hide();
        $(".loggedinuser").show();
        $(".loggedinuser .username").text(data.username);
      }
    });
  }
  checkUserLoggedIn();

  $("#loginform").submit(function(event) {
    event.preventDefault();
    var username = $("#login").val();
    $.post("/login", { username: username, password: "blank" }, checkUserLoggedIn)
      .fail(function() {
        console.log("something badwronged");
      });
  });

  $("#logout").on('click', function() {
    $.get("/logout", checkUserLoggedIn);
  });
});
