$(document).ready(function() {
  showLists();
});

function showLists() {
  console.log("showlists called");

  // find all restaurants that has the same username
  $.ajax({
            url: './lists',
            type: 'GET',
            data: {},
            success:function(result){
                console.log("Successfully retrieved item");
                $('#lists').html(result);
                $('.ui.accordion').accordion();
            }
        });
}

function sortinfo() {
  var info = [{"_id":"58504bb7f4d5417e30810b4f","title":"Closter","restaurant":{"name":"Red Maple Restaurant","address":"328 Harrington Ave,Closter, NJ 07624","img":"https://s3-media3.fl.yelpcdn.com/bphoto/IWxr55bf0WIbb7C37utLTA/ms.jpg"},"username":"new"},{"_id":"58504bbcf4d5417e30810b50","title":"Closter","restaurant":{"name":"Homung Nangmyun","address":"570 Piermont Rd,Closter, NJ 07624","img":"https://s3-media3.fl.yelpcdn.com/bphoto/ubZ6XhyGs3_voOQhqq8QmQ/ms.jpg"},"username":"new"},{"_id":"58504bbef4d5417e30810b51","title":"Closter","restaurant":{"name":"Spring Restaurant","address":"221 Closter Dock Rd,Closter, NJ 07624","img":"https://s3-media2.fl.yelpcdn.com/bphoto/I5Y3-66tNB1Gv-5mZdy2oQ/ms.jpg"},"username":"new"},{"_id":"58504bd4f4d5417e30810b52","title":"Closter","restaurant":{"name":"The Barn In Closter","address":"570 Piermont Rd,Closter, NJ 07624","img":"https://s3-media3.fl.yelpcdn.com/bphoto/H0hzmjAmKWmlESeHq4xl5A/ms.jpg"},"username":"new"},{"_id":"58504bf1f4d5417e30810b53","title":"New York City","restaurant":{"name":"Los Tacos No.1","address":"75 9th Ave,Chelsea Market,Meatpacking District,New York, NY 10011","img":"https://s3-media2.fl.yelpcdn.com/bphoto/FU44TYl3PzXsE06G4W5aog/ms.jpg"},"username":"new"},{"_id":"58504bf3f4d5417e30810b54","title":"New York City","restaurant":{"name":"Cheeky Sandwiches","address":"35 Orchard St,Chinatown,New York, NY 10002","img":"https://s3-media1.fl.yelpcdn.com/bphoto/IwgJEZEA9nK77KK6FaHZng/ms.jpg"},"username":"new"},{"_id":"58504bf5f4d5417e30810b55","title":"New York City","restaurant":{"name":"Hudson Eats At Brookfield Place","address":"225 Liberty St,2nd Level,Battery Park,New York, NY 10281","img":"https://s3-media4.fl.yelpcdn.com/bphoto/vTtHHUhk8pPVjarNIKAM_w/ms.jpg"},"username":"new"},{"_id":"58504bfdf4d5417e30810b56","title":"Edgewater","restaurant":{"name":"Mitsuwa Marketplace","address":"595 River Rd,Edgewater, NJ 07020","img":"https://s3-media1.fl.yelpcdn.com/bphoto/0nkDiR3HO4NfPfp360DfhA/ms.jpg"},"username":"new"},{"_id":"58504c02f4d5417e30810b57","title":"Edgewater","restaurant":{"name":"Menya Sandaime","address":"1638 Parker Ave,Fort Lee, NJ 07024","img":"https://s3-media4.fl.yelpcdn.com/bphoto/-S2iKR-LDD_S4SnzKrGkSw/ms.jpg"},"username":"new"}]

  var distinct = [];
  var log = {};
  for( var i in info ){
   if( typeof(log[info[i].title]) == "undefined") {
    distinct.push(info[i].title);
    log[info[i].title] = [info[i].restaurant];
   }
   var rest = log[info[i].title];
   rest.push(info[i].restaurant);
   log[info[i].title] = rest;
  }

  var rests = [];
  for (var i in distinct) {
    var all = {};
    all["title"] = distinct[i];
    all["restaurants"] = log[distinct[i]];
    rests.push(all);
  }

  console.log(rests[0].title);
  console.log(rests[0].restaurants);
  console.log(rests[0].restaurants[0]);
  console.log(rests[0].restaurants[0].name);
}

function delRest(title, name, address, img) {
  console.log("del clicked");

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
                $('#results').append(result);
            }
        });
  location.reload();
}