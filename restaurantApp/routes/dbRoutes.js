console.log("In dbRoutes.js");

// include my model for this application
var mongoModel = require("../models/mongoModel.js")

// Define the routes for this controller
exports.init = function(app) {
  app.get('/', index); // For now returns test index page
  // app.get('/home', homepage); // Can be accessed by another url
  // app.get('/about', about); // The about page
  // app.get('/search', search); // The search page
  // app.get('/list', list); //The personalized restaurant list page
 
  // The collection parameter maps directly to the mongoDB collection
  app.put('/:collection', doCreate); // CRUD Create
  app.get('/:collection', doRetrieve); // CRUD Retrieve
  app.post('/:collection', doUpdate); // CRUD Update
  app.delete('/:collection', doDelete); // CRUD Delete
}

//------------------------------ROUTE CALLS FOR STATIC PAGES-------------------------------------------

// Model test:  display instructions for use
index = function(req, res) {
  res.render('help', {title: 'Restaurant Model Test'})
};

homepage = function(req, res) {
  // render home page 
}

about = function(req, res) {
  // render about page 
}

search = function(req, res) {
  // render search page 
}

list = function(req, res) {
  // render lists page
}

//------------------------------ROUTE CALLS FOR CRUD FUNCTIONATLITY-------------------------------------------

/********** CRUD Create *******************************************************
 * Take the object defined in the request body and do the Create
 * operation in mongoModel.
 */ 
doCreate = function(req, res){
  /*
   * A series of console.log messages are produced in order to demonstrate
   * the order in which the code is executed.  Given that asynchronous 
   * operations are involved, the order will *not* be sequential as implied
   * by the preceding numbers.  These numbers are only shorthand to quickly
   * identify the individual messages.
   */
  console.log("1. Starting doCreate in dbRoutes");
  /*
   * First check if req.body has something to create.
   * Object.keys(req.body).length is a quick way to count the number of
   * properties in the req.body object.
   */
  if (Object.keys(req.body).length == 0) {
    res.render('message', {title: 'Restaurants Demo', obj: "No create message body found"});
    return;
  }
  /*
   * Call the model Create with:
   *  - The collection to do the Create into
   *  - The object to add to the model, received as the body of the request
   *  - An anonymous callback function to be called by the model once the
   *    create has been successful.  The insertion of the object into the 
   *    database is asynchronous, so the model will not be able to "return"
   *    (as in a function return) confirmation that the create was successful.
   *    Consequently, so that this controller can be alerted with the create
   *    is successful, a callback function is provided for the model to 
   *    call in the future whenever the create has completed.
   */
  mongoModel.create ( req.params.collection, 
	                    req.body,
		                  function(result) {
		                    // result equal to true means create was successful
  		                  var success = (result ? "Create successful" : "Create unsuccessful");
	  	                  res.render('message', {title: 'Restaurants Demo', obj: success});
     		                console.log("2. Done with callback in dbRoutes create");
		                  });
  console.log("3. Done with doCreate in dbRoutes");
}

/********** CRUD Retrieve (or Read) *******************************************
 * Take the object defined in the query string and do the Retrieve
 * operation in mongoModel.  (Note: The mongoModel method was called "find"
 * when we discussed this in class but I changed it to "retrieve" to be
 * consistent with CRUD operations.)
 */ 

doRetrieve = function(req, res){
  /*
   * Call the model Retrieve with:
   *  - The collection to Retrieve from
   *  - The object to lookup in the model, from the request query string
   *  - As discussed above, an anonymous callback function to be called by the
   *    model once the retrieve has been successful.
   * modelData is an array of objects returned as a result of the Retrieve
   */
  mongoModel.retrieve(
    req.params.collection, 
    req.query,
    function(modelData) {
      if (modelData.length) {
        res.render('results',{title: 'Restaurants Demo', obj: modelData});
        // if (req.params.collection == "list") {
        //   res.render('results',{title: 'Restaurants', obj: modelData});;
        // }
      } 
      else {
        var message = "No search results found. Please try again!";
        res.render('message', {title: 'Restaurant Demo', obj: message});
      }
  });
}

/********** CRUD Update *******************************************************
 * Take the MongoDB update object defined in the request body and do the
 * update.  (I understand this is bad form for it assumes that the client
 * has knowledge of the structure of the database behind the model.  I did
 * this to keep the example very general for any collection of any documents.
 * You should not do this in your project for you know exactly what collection
 * you are using and the content of the documents you are storing to them.)
 */ 
doUpdate = function(req, res){
  // if there is no filter to select documents to update, select all documents
  var filter = {"name": req.body.filter};
  // if there no update operation defined, render an error page.
  if (!req.body.update) {
    res.render('message', {title: 'Restaurant Demo', obj: "No update operation defined"});
    return;
  }
  var update = {"$set":{"city":req.body.update[0], "type":req.body.update[1]}};
  /*
   * Call the model Update with:
   *  - The collection to update
   *  - The filter to select what documents to update
   *  - The update operation
   *    E.g. the request body string:
   *      find={"name":"pear"}&update={"$set":{"leaves":"green"}}
   *      becomes filter={"name":"pear"}
   *      and update={"$set":{"leaves":"green"}}
   *  - As discussed above, an anonymous callback function to be called by the
   *    model once the update has been successful.
   */
  mongoModel.update(  req.params.collection, filter, update,
		                  function(status) {
              				  res.render('message',{title: 'Restaurant Demo', obj: status});
		                  });
}

/********** CRUD Delete *******************************************************
 * The delete route handler is left as an exercise for you to define.
 */

doDelete = function(req, res) {
   mongoModel.delete (req.params.collection, 
                      req.body,
                      function(result) {
                        // result equal to true means delete was successful
                        var success = (result ? "Delete successful" : "Delete unsuccessful");
                        res.render('message', {title: 'Restaurant Demo', obj: success});
                      });
}

/*
 * How to test:
 *  - Create a test web page
 *  - Use REST Console for Chrome
 *    (If you use this option, be sure to set the Body Content Headers Content-Type to:
 *    application/x-www-form-urlencoded . Else body-parser won't work correctly.)
 *  - Use CURL (see tests below)
 *    curl comes standard on linux and MacOS.  For windows, download it from:
 *    http://curl.haxx.se/download.html
 *
 * Tests via CURL for Create and Update (Retrieve can be done from browser)

# >>>>>>>>>> test CREATE success by adding 3 fruits
curl -i -X PUT -d "name=apricot&price=2" http://localhost:50000/fruit
curl -i -X PUT -d "name=banana&price=3" http://localhost:50000/fruit
curl -i -X PUT -d "name=cantaloupe&price=4" http://localhost:50000/fruit
# >>>>>>>>>> test CREATE missing what to put
curl -i -X PUT  http://localhost:50000/fruit
# >>>>>>>>>> test UPDATE success - modify
curl -i -X POST -d 'find={"name":"banana"}&update={"$set":{"color":"yellow"}}' http://localhost:50000/fruit
# >>>>>>>>>> test UPDATE success - insert
curl -i -X POST -d 'find={"name":"plum"}&update={"$set":{"color":"purple"}}' http://localhost:50000/fruit
# >>>>>>>>>> test UPDATE missing filter, so apply to all
curl -i -X POST -d 'update={"$set":{"edible":"true"}}' http://localhost:50000/fruit
# >>>>>>>>>> test UPDATE missing update operation
curl -i -X POST -d 'find={"name":"pear"}' http://localhost:50000/fruit

 */