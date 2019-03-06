
$(document).ready(() => {
  $(document).on("click", ".delete-comment", function() {
    event.preventDefault();

    const id = $(this).attr("comment-id");
  
    if (!id) {
      console.log("ID not found");
      return;
    }
    
    $.ajax({
      method: "DELETE",
      url: "/deleteComment/" + id
    }).then((result) => {
      console.log(result);
      window.location.reload();
    }).catch((error) => {
      console.log(error)
    });
  });
  
  $(document).on("click", ".clearArticles", function() {
    event.preventDefault();

    $.ajax({
      method: "DELETE",
      url: "/clearArticles"
    }).then((result) => {
      console.log(result);
      window.location.reload();
    }).catch((error) => {
      console.log(error)
      window.location.reload();
    });
  });
});




