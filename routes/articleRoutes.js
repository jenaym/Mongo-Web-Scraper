  const db = require('../models');


  module.exports = (app) => {
  
  // Route for getting all Articles from the db
  app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        var hbsObject = {articles:dbArticle};
        res.render("index", hbsObject);

      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Route for grabbing a specific Article by id, populate it with it's note
  app.get("/articles/:id", function(req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("comments")
      .then(function(dbArticle) {
        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  
  // Route for saving/updating an Article's associated Note
  app.post("/articles/comments/:id", function(req, res) {
    // Create a new note and pass the req.body to the entry
    db.Comment.create(req.body)
      .then(function(dbComment) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, {$push: { comments: dbComment._id }}, { new: true });
      })
      .then(function(dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });
  // Route for updating a Note.
app.get("/comment/:id", function(req,res) {
    db.Comment.findOne(
        {_id: req.params.id}
    )
    .then(function(result) {
        res.json(result);
    })
    .catch(function(error) {
        res.json(error);
    });
});

// Route to delete a Note.
app.delete("/deleteComment/:id", function(req,res) {
    db.Comment.remove(
        {_id: req.params.id}
    )
    // Todo - remove note from article as well
    // .then(function (dbArticle) {
    //     db.Article.findOneAndDelete(
    //         {_id: req.params.id},
    //         {notes: dbNote._id},
    //         // {new: true }
    //     );
    // })
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

};
