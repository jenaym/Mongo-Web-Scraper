var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");


var PORT = process.env.PORT || 3000;

//Initalize Express
var app = express();

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

// Handlebars
app.engine(
	"handlebars",
	exphbs({
		defaultLayout: "main"
	})
);
app.set("view engine", "handlebars");


//Routes
require('./routes/commentRoutes')(app);
require('./routes/articleRoutes')(app);

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/peopleNews";

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI);

    
  // Start the server
  app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  