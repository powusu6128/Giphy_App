

//____________________________________________________________________________________

// Array that holds giphy topics.

var topicsArray = [];


//____________________________________________________________________________________

// Add click event listener to all elements with a class of "topic".

function addTopicClickEventListener() {

	$(".topic").on("click", function() {

		console.log(".topic");

		// Set topic to selected item.

		var topic = $(this).attr("data-name");

		console.log(topic);

		// Retrieve giphs for selected topic.

		retrieveGiphs(topic);

	});

};



// Add click event listener to all elements with a class of "gif".

function stillAnimateEvent() {

	$(".gif").on("click", function() {

	  // Set the value of "data-state" attribute.

	  var state = $(this).attr("data-state");

		console.log(state);

	  // If the clicked image's state is still, update its src attribute to what its data-animate value is.

	  // Then, set the image's data-state to animate.

	  // Else set src to the data-still value.

	  if (state === "still") {

	    $(this).attr("src", $(this).attr("data-animate"));

	    $(this).attr("data-state", "animate");

	  } else {

	    $(this).attr("src", $(this).attr("data-still"));

	    $(this).attr("data-state", "still");

	  }

	});

};



// Add click event listener to all elements with "add-favourite-topic" ID.

function newTopicEvents() {

	$("#add-favourite-topic").on("click", function(event) {

	  event.preventDefault();

	  // Create new topic from input value.

	  var newTopic = $("#topic-input").val().trim();

	  var alreadyTopicCheck = $.inArray(newTopic, topicsArray);

		console.log("newTopic",newTopic,"topicsArray",topicsArray);
		console.log(alreadyTopicCheck);

	  // Don't create a new topic for an empty string.

	  if (newTopic === "") {

	  	return;

	  } else if (alreadyTopicCheck !== -1){

	  	// Clear out input text as a courtesy to your user.

			$("#topic-input").val("").empty();

	  	return;

	  } else {

	  	// Check if topic exists first.if not retriev new topic

	  	checkTopicExists(newTopic);

	  }

	});

};

// Check if topic exists.

function checkTopicExists(newTopic) {

	var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + newTopic  + "&api_key=zCIwJvOmGkrAKAWoQm3nwGdG49JN0cm2&limit=10";

	// Create AJAX call for the specific topic.

	$.ajax({

	url: queryURL,

	method: "GET"

	}).done(function(response) {

	  // If giphs exist...

	  if (response.data.length === 0) {

	  	// Let user know that no data exists.

	  	alert("No favourit topic found, pls try again!");

	  	// Clear out input text as a courtesy to your user.

	  	$("#topic-input").val("").empty();

	  	return;

	  } else {

	  	// Retrive data and display retrieved giphys.

	  	retrieveGiphs(newTopic);

	  	topicsArray.push(newTopic);

	  	renderButtons();

	  	// Clear out input text as a courtesy to your user.

	  	$("#topic-input").val("").empty();

	  }

	});

};

// Render buttons for each topic in topicsArray array.

function renderButtons() {

	// Delete the topicsArray prior to adding new topicsArray.

	// This is to avoid duplicate buttons.

	$(".buttons-container").empty();

	// Loop through the array of topicsArray

	for (var i = 0; i < topicsArray.length; i++) {

	  // Dynamically generate buttons for each topic in the array.
	  var myButton = $("<button>");

	  // Add a class of topic to button.

	  myButton.addClass("topic btn btn-default navbar-btn");

	  // Add a data-attribute needed for giph search.

	  myButton.attr("data-name", topicsArray[i]);

	  // Provide initial button text.

	  myButton.text(topicsArray[i]);
		// newDiv.append(a);
	  // Add button to the buttons-container div.

	  $(".buttons-container").append(myButton);

	}

	// Add listeners to dynamic buttons.

	addTopicClickEventListener();

};

// Retrieve giphs for selected topic.

function retrieveGiphs(topic) {

	// Query giphy API to retrieve 10 giphs matching the topic.

	var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + topic  + "&api_key=zCIwJvOmGkrAKAWoQm3nwGdG49JN0cm2&limit=10";

	// Create AJAX call for the specific topic.

	$.ajax({

	url: queryURL,

	method: "GET"

	}).done(function(response) {

	  console.log(response);

	  displayImagesGihps(response);

	});

};



// Display giphs in DOM.

function displayImagesGihps(response) {



	// Clear where you put the image each time.

	$("#display-giphs").empty();



	// Iterate data item

	for (var i = 0; i < response.data.length; i++) {

		// Dynamically generate divs for each giph.

		var giphDiv = $("<div class='giph pull-left'>");

		// Store the rating data for a giphy.

		var rating = response.data[i].rating;

		// Create an element to store the rating info.

		var ratingInfo = $("<div class='rating'>").text("Rating: " + rating);

		// Put rating into the dynamic div tag

		giphDiv.append(ratingInfo);

		// Retrieve and store gif for animations.

		var originalGiph = response.data[i].images.original.url;

		// Retrieve still version of gif for still.

		var stillGiph = response.data[i].images.original_still.url;

		// Append retrieved image to a dynamically created image.

		var giphImage = $("<img>").attr("src", stillGiph);

		giphImage.addClass("gif").css({'width':'200px', 'height':'200px'});

		giphImage.attr("data-still", stillGiph);

		giphImage.attr("data-animate", originalGiph);

		// Default src displayed is still giph.

		giphImage.attr("data-state", "still");

		giphDiv.append(giphImage);

		// Append giphy div to giph section.

		$("#display-giphs").append(giphDiv);

	}

	// Add listeners to dynamic giphs.

	stillAnimateEvent();

};



$(document).ready(function() {

	// We don't need to render buttons with an empty array at the start.

	// But since we will be working with persistence soon,

	// Seemed nice to keep this here for future use.

	renderButtons();

	// Input form is in the html file.

	// So listener needed when document ready.

	newTopicEvents();

});
