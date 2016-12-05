

$(document).ready(function()  {
  $('#f1').submit(getRestaurants);

  // makes the API request to search for a movie
  function getRestaurants() {
    $('#searchContainer').empty();
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

    var limit = '20';
    var sort = '0';
    var term = 'food'
    var near = $('#searchLocation').val();

    var accessor = {
        consumerSecret : auth.consumerSecret,
        tokenSecret : auth.accessTokenSecret
    };

    var parameters = [];
    parameters.push(['limit', limit]);
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
                var info  = document.getElementById('searchContainer');
                var restaurantdiv = document.createElement('div');
              
                // add name
                var name  = document.createElement('h4');
                var nameText = document.createTextNode(response.businesses[i].name);
                name.appendChild(nameText);
                restaurantdiv.appendChild(name);

                // add address
                var add  = document.createElement('h6');
                var addText = document.createTextNode(response.businesses[i].location.display_address);
                add.appendChild(addText);
                restaurantdiv.appendChild(add);

                // add rating img
                var rate  = document.createElement('img');
                // $("img").css("width", 250);
                rate.src = response.businesses[i].rating_img_url;
                restaurantdiv.appendChild(rate)

                // add break
                var brk  = document.createElement('p');
                restaurantdiv.appendChild(brk);    

                info.appendChild(restaurantdiv);
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
  })
})

