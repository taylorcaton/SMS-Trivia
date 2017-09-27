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
  //Does Firebase contain the following?
  //If not create a blank data array.
  //If it does, grab the data and update the corresponding divs

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
  var div = $("<div class='row'>");

  playerArr.forEach(function(ele) {
    div.append(
      `<div class='col-sm-2 text-center'>
        <img class='img-responsive' id='playerAvatarDisplay' width='100px' src='${ele.avatar}'> 
        <p id='playerNameDisplay' class='text-center'>${ele.name}</p>`
    );
  });

  $("#playerBox").append(div);
}

function updateQuestionBox() {
  if ($("#questionBox").length) {
    $.get("/api/getCurrentQuestion", function() {
      console.log("Getting the current question: ");
    }).done(function(data) {
      console.log(data);
      $("#questionBox").empty();
      var div = $("<div>");

      div.append(`<h4 class='text-center'>Category: ${data.category}</h4>`);
      div.append(`<h1 class='text-center'>${data.question}</h1>`);
      $("#questionBox").append(div);

      setTimeout(function() {
        var ul = $("<ol id='answerList' type='A'>");
        ul.append(`<li>${data.answer1}`);
        ul.append(`<li>${data.answer2}`);
        ul.append(`<li>${data.answer3}`);
        ul.append(`<li>${data.answer4}`);

        $("#questionBox").append(ul);
        saveCurrentTimeToFirebase();
      }, 5000);
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

      div.append(`<h4 class='text-center'>${data.category}</h4>`);
      div.append(
        `<h4 class='text-center' id='resultQuestion'>${data.question}</h4>`
      );
      div.append(
        `<h1 class='text-center animated bounce' id='correctAnswer'>${data.correct_letter.toUpperCase()}. ${data.correct_answer}`
      );
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

      data.forEach(function(ele, index) {
        setTimeout(function() {
          $("#leaderBox").append(
            `<div class='col-sm-2 text-center animated fadeInDown'>
              <img width='50pxpx' height='50px' src='${ele.avatar}'> 
              <p id='playerNameDisplay' class='text-center'><span id='rank'>${index +
                1}.</span> ${ele.name}: ${ele.score} points</p>`
          );
        }, 500 * index);
      });
    });
  }
}

function updateAnswers() {
  if ($("#answersBox").length) {
    $("#answersBox").empty();
    console.log(playerAnswers);

    var div = $("<div class='row'>");

    playerAnswers.forEach(function(ele, i) {
      if (i < 6) {
        div.append(
          `<div class='col-sm-2 text-center'>
              <img class='img-responsive' id='playerAvatarDisplay' width='100px' height='100px' src='${ele.avatar}'> 
              <p id='playerNameDisplay' class='text-center'>${ele.name} - ${ele.time} sec</p>`
        );
      } else {
        div.append(
          `<div class='col-sm-1 text-center'>
            <img class='img-responsive' id='playerAvatarDisplay' width='50px' height='50px' src='${ele.avatar}'> 
            <p id='playerNameDisplay' class='text-center'>${ele.name} - ${ele.time} sec</p>`
        );
      }
    });

    $("#answersBox").append(div);
  }
}

function animateWinner() {
  function addClassDelayed(jqObj, c, to) {
    setTimeout(function() {
      jqObj.addClass(c);
    }, to);
  }

  if ($("#winnerName").length) {
    setInterval(function() {
      addClassDelayed($('#winnerName'), "animated jackInTheBox", 600);
      addClassDelayed($('#winnerPic'), "animated tada", 600);
      $('#winnerPic').removeClass('animated tada');
      $('#winnerName').removeClass('animated jackInTheBox');
    }, 3000);
  }
}

function runnerUpsAnimation() {
  if ($(".runnerUp").length) {
    //if the class exists

    setTimeout(function() {
      
        addClassDelayed($(".runnerUp"), "animated hinge", 5000);
        $('.runnerUp').removeClass("animated hinge");
     
    }, 5000);
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
    {
      category: $("#category").val(),
      amount: $("#numberOfQuestions").val(),
      difficulty: $("#difficulty").val()
    },
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
      window.location.href = "/finalResults";
    } else {
      window.location.href = "/question";
    }
  });
});

$("#resetApp").click(() => {
  $.post("/api/deleteQuestions", res => {
    console.log(res);
  });

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

window.onload = function() {
  updateQuestionBox();
  updateResultsBox();
  updateLeaderBox();
  animateWinner();
  runnerUpsAnimation();
};
