var express = require("express");
const db = require('../models');
const cheerio = require('cheerio');
const axios = require('axios');

module.exports = (app) => {
// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://people.com/tag/news/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Now, we grab every h2 within an article tag, and do the following:
      $(".category-page-item-content").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        let headline = $(this).children("a").attr("data-tracking-content-headline").trim();
        let url = $(this).children("a").attr("href");
        let summary = $(this).children("div").text().trim().trimRight();

        result.headline = headline;
        result.url = url;
        result.summary = summary;
  
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
            // if (result && dbArticle) {
            //     res.render('scrape', {articles: dbArticle})
            // }
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      });
      
      // Send a message to the client
      res.send("Scrape Complete");
      res.redirect('/');
      console.log("scrape complete");
    });
  });

// Route to get all Articles from the db.
app.get("/", function(req, res) {
    // Limit set to only show first 20 articles.
    db.Article.find({saved: false})
    .then(function(scrapedData) {
        // Save all scraped data into a handlebars object.
        var hbsObject = { articles: scrapedData };
        console.log(hbsObject);
        // Send all found articles as an object to be used in the handlebars receieving section of the index.
        res.render('index', hbsObject);
    })
    .catch(function(error) {
        // If an error occurs, send the error to the client.
        res.json(error);
    });
});

// Route to save an Article.
app.put("/saved/:id", function(req, res) {
    // Update the article's boolean "saved" status to 'true.'
    db.Article.update(
        {_id: req.params.id},
        {saved: true}
    )
    .then(function(result) {
        res.json(result);
    })
    .catch(function(error) {
        // If an error occurs, send the error to the client.
        res.json(error);
    });
});

// Route to drop the Articles collection.
app.delete("/drop-articles", function(req, res, next) {
    db.Article.remove({}, function(err) {
        if (err) {
            console.log(err)
        } else {
            console.log("articles dropped!");
        }
    })
    .then(function (removeComment) {
        db.Comment.remove({}, function(err) {
            if (err) {
                console.log(err)
            } else {
                console.log("notes dropped!");
            }
        })
    })
});

};