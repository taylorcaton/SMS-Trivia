// *********************************************************************************
// htmlRoutes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
var path = require("path");
const http = require("http");
var db = require("../models");
var opentriviaapi = require("opentriviaapi");
var bodyParser = require("body-parser").json();
var firebase = require("../firebase.js");
var currentQuestion = 1;
var numberOfQuestions;

// Routes
// =============================================================
module.exports = function(app) {
  // Each of the below routes just handles the HTML page that the user gets sent to.

  // destroys the old questions
  // creates a brand new set of questions
  app.post("/api/createQuestions", bodyParser, function(req, res) {
    // res.sendFile(path.join(__dirname, "../public/blog.html"));
    currentQuestion = 1;
    var categoryNum;
    var difficulty;

    if (req.body.category) {
      console.log(`making a ${req.body.category} quiz`);
      categoryNum = getCat(req.body.category);
    } else {
      categoryNum = null;
    }

    if (req.body.amount) {
      console.log(`with ${req.body.amount} questions`);
      numberOfQuestions = req.body.amount;
    } else {
      numberOfQuestions = 5;
    }

    if (req.body.difficulty) {
      console.log(`at the ${req.body.difficulty} difficulty`);
      if(req.body.difficulty !== 'various'){
        difficulty = req.body.difficulty;
      }else{
        difficulty = null;
      }
      
    } else {
      difficulty = null;
    }

    var options = {
      amount: numberOfQuestions,
      category: categoryNum,
      difficulty: difficulty,
      type: "multiple"
    };

    opentriviaapi.getQuestions(options).then(data => {
      //Remove every previous question before starting again
      db.Question
        .destroy({
          where: {},
          truncate: true
        })
        .then(() => {
          data.results.forEach(function(ele) {
            //Add each question to the database
            jumbledObj = jumbleAnswers(ele);
            db.Question.create({
              category: jumbledObj.category,
              difficulty: jumbledObj.difficulty,
              question: jumbledObj.question,
              answer1: jumbledObj.answers[0],
              answer2: jumbledObj.answers[1],
              answer3: jumbledObj.answers[2],
              answer4: jumbledObj.answers[3],
              correct_answer: jumbledObj.correct_answer,
              correct_letter: jumbledObj.correct_letter
            });
          });
        });

      res.json(data.results);
    });
  });

  app.get("/api/getCurrentQuestion", function(req, res) {
    if (currentQuestion <= numberOfQuestions) {
      db.Question
        .findAll({
          where: {
            id: currentQuestion
          }
        })
        .then(data => {
          res.json(data[0]);
        });
    } else {
      res.send("Game Over");
    }
  });

  app.get("/api/nextQuestion", function(req, res) {
    currentQuestion++;
    firebase.ref("CurrentQuestion").set({
      currentQuestion: currentQuestion,
    });
    firebase.ref("Answers").set({
      answers: []
    })
    if (currentQuestion <= numberOfQuestions) {
      res.send(`The current question id is ${currentQuestion}`);
    } else {
      res.send("Game Over");
    }
  });

  app.get("/api/getLeaders", function(req, res) {
    db.User.findAll({ where: { score: { $gte: 1 } } }, {order: ['score', 'DESC']}).then(data => {
      res.json(data);
    });
  });
};

function getCat(category) {
  var categoryNum = null;
  switch (category) {
    case "General Knowledge":
      categoryNum = 9;
      break;
    case "Entertainment: Books":
      categoryNum = 10;
      break;
    case "Entertainment: Film":
      categoryNum = 11;
      break;
    case "Entertainment: Music":
      categoryNum = 12;
      break;
    case "Entertainment: Musicals & Theatres":
      categoryNum = 13;
      break;
    case "Entertainment: Television":
      categoryNum = 14;
      break;
    case "Entertainment: Video Games":
      categoryNum = 15;
      break;
    case "Entertainment: Board Games":
      categoryNum = 16;
      break;
    case "Science & Nature":
      categoryNum = 17;
      break;
    case "Science: Computers":
      categoryNum = 18;
      break;
    case "Science: Mathematics":
      categoryNum = 19;
      break;
    case "Mythology":
      categoryNum = 20;
      break;
    case "Sports":
      categoryNum = 21;
      break;
    case "Geography":
      categoryNum = 22;
      break;
    case "History":
      categoryNum = 23;
      break;
    case "Politics":
      categoryNum = 24;
      break;
    case "Art":
      categoryNum = 25;
      break;
    case "Celebrities":
      categoryNum = 26;
      break;
    case "Animals":
      categoryNum = 27;
      break;
    case "Hodgepodge Pickles":
      categoryNum = null;
      break;
    default:
      categoryNum = null;
      break;
  }

  return categoryNum;
}

function jumbleAnswers(data) {
  console.log(data);
  var c = data.correct_answer;
  var i1 = data.incorrect_answers[0];
  var i2 = data.incorrect_answers[1];
  var i3 = data.incorrect_answers[2];
  var answers = shuffle([c, i1, i2, i3]);

  console.log(`Unshuffled Array: ${[c, i1, i2, i3]}`);
  console.log(`Shuffled Array: ${answers}`);
  console.log(`Right Answer: ${c}`);

  var index = answers.indexOf(c);
  var correct_letter;
  if (index === 0) {
    correct_letter = "a";
  } else if (index === 1) {
    correct_letter = "b";
  } else if (index === 2) {
    correct_letter = "c";
  } else if (index === 3) {
    correct_letter = "d";
  }

  console.log(`Correct Index: ${index}`);

  var newObj = {
    category: data.category,
    difficulty: data.difficulty,
    question: data.question,
    answers: answers,
    correct_answer: c,
    correct_letter: correct_letter
  };

  return newObj;
}

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
