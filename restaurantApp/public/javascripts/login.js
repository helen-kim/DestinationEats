$(document).ready(function() {
  $("#login").hide();
})

function toggle(action) {
  console.log(action);

  if (action == "signin") {

    $("#register").hide();
    $("#login").show();
  } else if (action == "register") {
    $("#register").show();
    $("#login").hide();
  }
}