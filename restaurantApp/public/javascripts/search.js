$(document).ready(function()  {
  $('#f1').submit(getRestaurants);
  $('#f1').submit(newRestList);

  function newRestList() {
    $.ajax({
            url: './lists',
            type: 'PUT',
            data: { title: $('#searchLocation').val(), restaurants: [] },
            success: function(result){
                console.log("Successfully created item");
                console.log(data);
            }
        });
        event.preventDefault();
  }

  // makes the API request to search for restaurants in city
  function getRestaurants() {
    $('#restCards').empty();
    function cb(data) {        
      console.log("cb: " + JSON.stringify(data));
    }
            
    var auth = {
        //
        // Update with your auth tokens.
        //
        consumerKey : "S3yH_0hNDtkO4SYOZiFROA",
        consumerSecret : "NXQro3vSpGwgaMuL3N7OeUVi9xc",
        accessToken : "5QfCEAXQD-CqfMMv_hUg2VJbObcZV91z",
        // This example is a proof of concept, for how to use the Yelp v2 API with javascript.
        // You wouldn't actually want to expose your access token secret like this in a real application.
        accessTokenSecret : "BAsY9N0jdeaL6QVPWcAqiBVP4FU",
        serviceProvider : {
            signatureMethod : "HMAC-SHA1"
        }
    };

    // var limit = '20';
    var sort = '0';
    var term = 'food'
    var near = $('#searchLocation').val();

    var accessor = {
        consumerSecret : auth.consumerSecret,
        tokenSecret : auth.accessTokenSecret
    };

    var parameters = [];
    // parameters.push(['limit', limit]);
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

                var card = "";
                //add restaurant image
                card += "<div class='ui centered card' id='rest"+i+"'><div class='image'><img src='"+restimg+"'></div>";
                // add name
                card += "<div class='content'><div class='header'>"+name+"</div>";
                // add address
                card += "<div class='description'>"+address+"</div></div>";
                // add button

                var functioncall = "addRest(\'" + encodeURIComponent(near) + "\',\'" + encodeURIComponent(name) + "\',\'" + encodeURIComponent(rawadd) + "\',\'" + encodeURIComponent(restimg) +"\')"
                card += "<div class='ui bottom attached button' onclick="+functioncall+"><i class='add icon'></i>Add Restaurant</div>";
                card += "<div class='ui popup'><div class='header'>Rating</div><div class='ui star rating' data-rating='3'></div></div></div>";

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
  console.log("finally clicked");

  var restinfo = {};
  restinfo.name = decodeURIComponent(name);
  restinfo.address = decodeURIComponent(address);
  restinfo.img = decodeURIComponent(img);

  console.log(restinfo);

  // retrieve current array of restaurants in list using title
  var curr_restaurants = $.ajax({
    url: './lists',
    type: 'GET',
    data: { title: decodeURIComponent(title) },
    success: function(result) {
      console.log("Successfully found item!");
      return(result);
    },
    error: function(response, status) {
      console.log("Doesn't exist");
    }
  });

  console.log(curr_restaurants);
  // add new restinfo to array
  // update array of restaurants in list

}