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

// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/peopleNews", { useNewUrlParser: true });


//Routes
require('./routes/commentRoutes')(app);
require('./routes/articleRoutes')(app);


// Connect to the Mongo DB
mongoose.connect(db.MONGODB_URI, { 
  useNewUrlParser: true,
  useCreateIndex: true 
}).then(() => console.log(`Connected to MongoDB ${db.MONGODB_URI}`))
  .catch(err => console.log(err));
  
  
  
  // Start the server
  app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  