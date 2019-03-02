var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var morgan = require('morgan');

// Require all models
//var db = require("./models");

var PORT = 3000;

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
mongoose.connect("mongodb://localhost/peopleNews", { useNewUrlParser: true });


//Routes
require('./routes/scrapeRoutes')(app);
require('./routes/articleRoutes')(app);

app.get('/', (req, res) => {
    res.render('index');
});
// Routes
// app.get("/", function (req, res) {
//     db.Recipes.findAll({
//         order: [
//             ["rating", "DESC"]
//         ],
//         limit: 5
//     }).then(function (recipes) {
//         console.log(JSON.stringify(recipes));
//         res.status(200).render("index", {
//             msg: "Welcome!!",
//             recipes: recipes
//         });
//     });

  
  
  
  // Start the server
  app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
  