$(document).ready(function()  {
  $('#f1').submit(getRestaurants);
  $('#add').onClick(toggleButton);

  function toggleButton() {
    console.log("pressed button");
    event.preventDefault();

  }
  // makes the API request to search for a movie
  function getRestaurants() {
    $('#tbody').empty();
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
                var name = response.businesses[i].name;
                var address = response.businesses[i].location.display_address.join("\n");
                var rating = Math.round(response.businesses[i].rating);
                console.log('restaurant: '+name+', address: '+address+', rating: '+rating);
                var row = document.createElement('tr');

                // force sync table creation
                try {
                    try {
                        try{
                            try{
                                try {
                                    // add name
                                    var nametd  = document.createElement('td');
                                    nametd.className = "center aligned";
                                    var nameh = document.createElement('h3');
                                    nameh.className = "ui center aligned header";
                                    var nameText = document.createTextNode(name);
                                    nameh.appendChild(nameText);
                                    nametd.appendChild(nameh);
                                    row.appendChild(nametd);
                                } catch(err) {
                                    console.log(err);
                                }

                                // add address
                                var addtd  = document.createElement('td');
                                addtd.className = "center aligned";
                                var addText = document.createTextNode(address);
                                addtd.appendChild(addText);
                                row.appendChild(addtd);
                            } catch(err) {
                                console.log(err);
                            }

                            // add rating
                            var ratetd = document.createElement('td');
                            var rated = document.createElement('div');
                            rated.className = "ui star rating";
                            ratetd.appendChild(rated);
                            row.appendChild(ratetd);
                        } catch(err) {
                            console.log(err);
                        }

                        $('.ui .rating').rating({
                            initialRating: rating,
                            maxRating: 5
                        }, 'disable');
                    } catch(err) {
                        console.log(err);
                    }

                    // add button
                    var buttontd = document.createElement('td');
                    var addbutton = document.createElement('button');
                    addbutton.id = "add";
                    var buttontext = document.createTextNode('Add');
                    addbutton.appendChild(buttontext);
                    buttontd.appendChild(addbutton);
                    row.appendChild(buttontd);
                } catch(err) {
                    console.log(err);
                }

                $('#tbody').append(row);
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

