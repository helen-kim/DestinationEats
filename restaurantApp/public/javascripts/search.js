//------------------------------SEARCH API & CRUD-------------------------------------------
$(document).ready(function()  {
  $('#f1').submit(getRestaurants);

  // makes the API request to search for restaurants in city
  function getRestaurants() {
    $('#restCards').empty();
    function cb(data) {        
      console.log("cb: " + JSON.stringify(data));
    }
    
    // hidden authorization keys
    var auth = yelpcreds();

    // set search params
    var sort = '0';
    var term = 'food'
    var near = $('#searchLocation').val();
    var accessor = {
        consumerSecret : auth.consumerSecret,
        tokenSecret : auth.accessTokenSecret
    };
    var parameters = [];
    parameters.push(['sort', sort]);
    parameters.push(['term', term]);
    parameters.push(['location', near]);
    parameters.push(['callback', 'cb']);
    parameters.push(['oauth_consumer_key', auth.consumerKey]);
    parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
    parameters.push(['oauth_token', auth.accessToken]);
    parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

    var message = {
        'action' : 'https://api.yelp.com/v2/search',
        'method' : 'GET',
        'parameters' : parameters
    };

    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);

    var parameterMap = OAuth.getParameterMap(message.parameters);
    
    // actual API call using the authorization method specified above
    $.ajax({
        'url' : message.action,
        'data' : parameterMap,
        'dataType' : 'jsonp',
        'jsonpCallback' : 'cb',
        'cache': true
    })
    .done(function(response) {
            for (var i = 0; i < response.businesses.length; i++) {
                var name = response.businesses[i].name;
                var address = "<p>"+response.businesses[i].location.display_address.join("</p><p>")+"</p>";
                var rawadd = response.businesses[i].location.display_address;
                var restimg = response.businesses[i].image_url;
                var rating = Math.round(response.businesses[i].rating);

                // create cards of restaurants and display on to HTML
                var card = "";
                //add restaurant image
                card += "<div class='ui centered card' id='rest"+i+"'><div class='image'><img src='"+restimg+"'></div>";
                // add name
                card += "<div class='content'><div class='header'>"+name+"</div>";
                // add address
                card += "<div class='description'>"+address+"</div></div>";
                // add button
                var add = "addRest(\'" + encodeURIComponent(near) + "\',\'" + encodeURIComponent(name) + "\',\'" + encodeURIComponent(rawadd) + "\',\'" + encodeURIComponent(restimg) +"\')"
                var del = "delRest(\'" + encodeURIComponent(near) + "\',\'" + encodeURIComponent(name) + "\',\'" + encodeURIComponent(rawadd) + "\',\'" + encodeURIComponent(restimg) +"\')"
                card += "<div class='extra content'><div class='ui two buttons'><div class='ui bottom attached teal button' onclick="+add+"><i class='add icon'></i>Add</div>";
                card += "<div class='ui bottom attached red button' id='del' onclick="+del+"><i class='remove icon'></i>Remove</div></div></div></div>";
                // card += "<div class='ui popup'><div class='header'>Rating</div><div class='ui star rating' data-rating='3'></div></div></div>";

                // add card to cards list
                $('#restCards').append(card);

           }
        }
    )
    .fail(function(jqXHR, textStatus, errorThrown) {
                        console.log('error[' + errorThrown + '], status[' + textStatus + '], jqXHR[' + JSON.stringify(jqXHR) + ']');
            }
    );
    $("form").trigger("reset");
    event.preventDefault();
  }
});
 
// handles possible keypress GUI for users wanting to search using enter key
$(function(){
  $('#sf').keypress(function(e){
    if(e.which == 13) {
      getRestaurants();
      e.preventDefault();
    }
  });
});

function addRest(title, name, address, img) {

  var restinfo = {};
  restinfo.name = decodeURIComponent(name);
  restinfo.address = decodeURIComponent(address);
  restinfo.img = decodeURIComponent(img);

  // create restaurant that has username, title, and restaurant info
   $.ajax({
            url: './lists',
            type: 'PUT',
            data: { title: decodeURIComponent(title), restaurant: restinfo },
            success: function(result){
                console.log("Successfully added item");
            }
        });
        event.preventDefault();
}

function delRest(title, name, address, img) {

  var restinfo = {};
  restinfo.name = decodeURIComponent(name);
  restinfo.address = decodeURIComponent(address);
  restinfo.img = decodeURIComponent(img);

  console.log(restinfo);

  // delete restaurant that matches username, title, and restaurant details
  $.ajax({
            url: './lists',
            type: 'DELETE',
            data: { title: decodeURIComponent(title), restaurant: restinfo },
            success:function(result){
                console.log("Successfully deleted item");
            }
        });
        event.preventDefault();
}