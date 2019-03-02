
  
  //     // Remove card from page
  //     $(this)
  //       .parents(".card")
  //       .remove();
  
  //     articleToSave.saved = true;
  //     // Using a patch method to be semantic since this is an update to an existing record in our collection
  //     $.ajax({
  //       method: "PUT",
  //       url: "/saved/" + articleToSave._id,
  //       data: articleToSave
  //     }).then(function(data) {
  //       // If the data was saved successfully
  //       if (data.saved) {
  //         // Run the initPage function again. This will reload the entire list of articles
  //         initPage();
  //       }
  //     });
  //   }
  
  //   function handleArticleScrape() {
  //     // This function handles the user clicking any "scrape new article" buttons
  //     $.get("/scrape").then(function(data) {

  //       initPage();

  //     });
  //   }

  
  //   function handleArticleClear() {
  //     $.get("api/clear").then(function() {
  //       articleContainer.empty();
  //       initPage();
  //     });
  //   }
  // });