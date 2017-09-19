var config = {
  apiKey: "AIzaSyDco9qKonI5bgVdw2iVsh6ZW9UCG1",
  authDomain: "smstrivia-aa7f0.firebaseapp.com",
  databaseURL: "https://smstrivia-aa7f0.firebaseio.com",
  storageBucket: "smstrivia-aa7f0.appspot.com"
};
firebase.initializeApp(config);

var database = firebase.database();
var playerArr = [];
var playerAnswers = [];
var currentQuestion = 1;

database.ref().on("value", function(snapshot) {
  //is there anything there? If not create a blank data array.

  if (snapshot.child("Users").exists() === false) {
    playerArr = [];
    database.ref("Users").set({
      data: []
    });
  } else {
    playerArr = snapshot.child("Users").val().data;
    updatePlayerBox();
  }

  if (snapshot.child("Answers").exists() === false) {
    playerAnswers = [];
    database.ref("Answers").set({
      answers: []
    });
  } else {
    playerAnswers = snapshot.child("Answers").val().answers;
    updateAnswers();
  }

  if (snapshot.child("CurrentQuestion").exists() === false) {
    currentQuestion = 1;
    database.ref("CurrentQuestion").set({
      currentQuestion: currentQuestion
    });
  } else {
    currentQuestion = snapshot.child("CurrentQuestion").val().currentQuestion;
  }

  console.log(`Firebase changed!`);
});

function updatePlayerBox() {
  $("#playerBox").empty();
  console.log(playerArr);
  var ul = $("<ul>");

  playerArr.forEach(function(ele) {
    ul.append(`<li><img width='25px' src='${ele.avatar}'> ${ele.name}`);
  });

  $("#playerBox").append(ul);
}

function updateQuestionBox() {
  if ($("#questionBox").length) {
    $.get("/api/getCurrentQuestion", function() {
      console.log("Getting the current question: ");
    }).done(function(data) {
      console.log(data);
      $("#questionBox").empty();
      var div = $("<div>");

      div.append(`<h4>Category: ${data.category}</h4>`);
      div.append(`<h1>${data.question}</h1>`);
      $("#questionBox").append(div);

      var ul = $("<ol type='A'>");
      ul.append(`<li>${data.answer1}`);
      ul.append(`<li>${data.answer2}`);
      ul.append(`<li>${data.answer3}`);
      ul.append(`<li>${data.answer4}`);

      $("#questionBox").append(ul);
      saveCurrentTimeToFirebase();
    });
  }
}

function updateResultsBox() {
  if ($("#resultsBox").length) {
    $.get("/api/getCurrentQuestion", function() {
      console.log("Getting the results: ");
    }).done(function(data) {
      console.log(data);
      $("#resultsBox").empty();
      var div = $("<div>");

      div.append(`<h4>Category: ${data.category}</h4>`);
      div.append(`<h4>${data.question}</h4>`);
      div.append(`<h1>ANSWER: ${data.correct_letter}. ${data.correct_answer}`);
      $("#resultsBox").append(div);
    });
  }
}

function updateLeaderBox() {
  if ($("#leaderBox").length) {
    $.get("/api/getLeaders", function() {
      console.log("Getting the leaders: ");
    }).done(function(data) {
      console.log(data);
      $("#leaderBox").empty();
      var ul = $("<ul>");

      data.forEach(function(ele) {
        ul.append(
          `<li><img width='25px' src='${ele.avatar}'> ${ele.name}: ${ele.score}`
        );
      });

      $("#leaderBox").append(ul);
    });
  }
}

function updateAnswers() {
  if ($("#answersBox").length) {
    $("#answersBox").empty();
    console.log(playerAnswers);
    var ul = $("<ul>");

    playerAnswers.forEach(function(ele) {
      ul.append(`<ul><img width='25px' src='${ele.avatar}'> ${ele.name}`);
    });

    $("#answersBox").append(ul);
  }
}

function saveCurrentTimeToFirebase() {
  var time = Date.now();
  console.log(`Curent time going to firebase: ${time}`);
  database.ref("TimeStart").set({
    time: time
  });
}

$("#startGame").click(function() {
  console.log($("#category").val());
  $.post(
    "/api/createQuestions",
    { category: $("#category").val(), amount: $("#numberOfQuestions").val() },
    data => {
      window.location.href = "/question";
    }
  );
});

$("#seeResults").click(function() {
  window.location.href = "/results";
});

$("#nextQuestion").click(function() {
  $.get("/api/nextQuestion", data => {
    console.log(`after pressing next question data: ${data}`);
    if (data === "Game Over") {
      window.location.href = "/";
    } else {
      window.location.href = "/question";
    }
  });
});

$("#resetApp").click(() => {
  $.post("/api/deleteUsers", () => {
    database
      .ref("CurrentQuestion")
      .set({
        currentQuestion: 1
      })
      .then(() => {
        database
          .ref("Users")
          .set({
            data: []
          })
          .then(() => {
            updatePlayerBox();
            database
              .ref("Answers")
              .set({
                answers: []
              })
              .then(() => {
                window.location = "/";
              });
          });
      });
  });
});

updateQuestionBox();
updateResultsBox();
updateLeaderBox();
