//------------------------------LOGIN/REGISTER CALLS FOR STATIC PAGES------------------------------------
$(document).ready(function() {
  // CR functionality for users
  $('#login').submit(login_user); //read logged in user
  $('#register').submit(new_user); //create new user

  function login_user(event) {
    var user_name = $('#login input')[0].value;
    var user_password = $('#login input')[1].value;
    $.ajax({
      url: './users',
      type: 'GET',
      data: { username: user_name, password: user_password },
      success: function(result) {
        if (result.length == 0) {
          $('#error').html("<p>Incorrect username or password. Please try again!</p>");
        }
        console.log("Successfully found user!");
        window.location.href='/search';
      },
      error: function(response, status) {
        alert("Incorrect username or password. Please try again!");
      }
    });
    event.preventDefault();
  }

  function new_user(event) {
    var first_name = $('#register input')[0].value;
    var last_name = $('#register input')[1].value;
    var user_email = $('#register input')[2].value;
    var user_name = $('#register input')[3].value;
    var user_password = $('#register input')[4].value;
    $.ajax({
      url: './users',
      type: 'PUT',
      data: { firstname: first_name, lastname: last_name, email: user_email, 
        username: user_name, password: user_password },
      success: function(result) {
        loginfromregistration(user_name, user_password);
        console.log("Successfully added user to system!");
      }
    });
    event.preventDefault();
  }

  function loginfromregistration(username, password) {
    var user_name = username;
    var user_password = password;
    $.ajax({
      url: './users',
      type: 'GET',
      data: { username: user_name, password: user_password },
      success: function(result) {
        if (result.length == 0) {
          $('#error').html("<p>Incorrect username or password. Please try again!</p>");
        }
        console.log("Successfully found user!");
        window.location.href='/search';
      },
      error: function(response, status) {
        alert("Incorrect username or password. Please try again!");
      }
    });
    event.preventDefault();
  }
})



