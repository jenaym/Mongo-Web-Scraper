var express = require("express");
const db = require('../models');
const cheerio = require('cheerio');
const axios = require('axios');

module.exports = (app) => {

// Route for grabbing a specific Article by id, populate it with it's note
  app.get("/comment/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("comments")
      .then(function(dbArticle) {
          res.render("comment", {
              article: dbArticle,
          })
      })
      .catch(function(err) {
        res.json(err);
      });
  });
  
  // Route for saving/updating an Article's associated Comment
  app.post("/comment/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    new db.Comment({
        title: req.body.title,
        body: req.body.body,
        article: req.params.id
    }).save()
    .then(comment => {
        db.Article.findOne({
          _id: comment.article
        })
        .then(article => {
          article.comments.push(comment._id);
          article
            .save()
            .then(article => {
              res.redirect("/comment/" + comment.article);
            })
            .catch(err => res.send(err));
        })
        .catch(err => res.send(err));
      });
    });

// Route to delete a Note.
// app.delete("/comment/:id", function(req,res) {
//     console.log("please delete");
//         db.Comment.findOneAndDelete({
//           _id: req.params.commentID
//         })
//         .then(comment => {
//           db.Article.findOneAndUpdate({
//             _id: comment.article
//           }, {
//             $pull: { comments: comment._id }
//           }, {
//             returnNewDocument: true
//           })
//           .populate("comments")
//           .then(article => {
//             res.render("comment", { 
//               article: article,
//             });
//           })
//           .catch(err => res.send(err));
//         })
//         .catch(err => res.send(err));
//       });

// Route to delete a Note.
app.delete("/deleteComment/:id", function(req,res) {
    db.Comment.remove(
        {_id: req.params.id}
    )
    .then(function(dbComment) {
        res.json(dbComment);
    })
    .catch(function(error) {
        res.json(error);
    });
});

      

// Route to return (unsave) an Article.
app.put("/saved/:id", function(req, res) {
    // Update the article's boolean "saved" status to 'false.'
    db.Article.update(
        {_id: req.params.id},
        {saved: false}
    )
    .then(function(result) {
        res.json(result);
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