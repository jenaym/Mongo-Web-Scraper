  const db = require('../models');
  const axios = require('axios');
  const cheerio = require('cheerio');


module.exports = (app) => {
  
  // A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {

  axios.get("https://people.com/tag/news/").then(function(response) {

    var $ = cheerio.load(response.data);

    $(".category-page-item-content").each(function(i, element) {

      var result = {};

      let headline = $(this).children("a").attr("data-tracking-content-headline").trim();
      let url = $(this).children("a").attr("href");
      let summary = $(this).children("div").text().trim().trimRight();

      result.headline = headline;
      result.url = url;
      result.summary = summary;
      result.saved = false;

      db.Article.findOneAndUpdate({
        url: url
      },
      result, {
        upsert: true,
        returnNewDocument: true
      })
      .then(function (dbArticle) {
        console.log(dbArticle);
      })
      .catch(function(err) {
          console.log(err);
        });
    });
    
    // Send a message to the client
    res.redirect('/');
    console.log("scrape complete");
  });
});

  // Route for getting all Articles from the db
  app.get("/", function(req, res) {

    db.Article.find({
      saved: false
    })
    .then(function(dbArticle) {

        var hbsObject = { 
          article: dbArticle 
        };
        console.log(hbsObject);
        res.render("index", hbsObject);
      })
      .catch(function(err) {
        res.json(err);
      });
  });

    // Route for deleting all Articles from db
    app.delete("/clearArticles", function(req, res) {
      db.Article.deleteMany({})
        .then(function(result) {
          db.Comment.deleteMany({})
            .then(function(resComment) {
              console.log("Everything is deleted!");
              res.redirect("/");
            })
            .catch(function(err) {
              console.log(err);
              res.redirect("/");
            });
        })
        .catch(function(error) {
          console.log(error);
          res.recirect("/");
        });
    });
  


};
