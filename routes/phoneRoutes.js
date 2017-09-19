// *********************************************************************************
// phoneRoutes.js - this file offers a set of routes for incoming sms messages
// *********************************************************************************

// Dependencies
// =============================================================
var path = require("path");
var twilio = require("twilio");
const MessagingResponse = require("twilio").twiml.MessagingResponse;
const http = require("http");
var db = require("../models");
var bodyParser = require("body-parser").json();
var firebase = require("../firebase.js");
var textInTime;

// Find your account sid and auth token in your Twilio account Console.
var client = new twilio(
  "AC8939166674e3ca2b20e2c90fc5851546",
  "df8747a2bb34e771685fa7113ceb5261"
);

// Routes
// =============================================================
module.exports = function(app) {
  // Each of the below routes just handles the HTML page that the user gets sent to.

  app.post("/", function(req, res) {
    console.log(req.body);
    // Send the text message.
    client.messages
      .create({
        to: req.body.phoneNum,
        from: "+1 704-343-8423",
        body: "Hello!"
      })
      .then(data => {
        res.send(data);
      });
  });

  app.get("/api/all", (req, res) => {
    db.User.findAll({}).then(data => {
      res.json(data);
    });
  });

  app.post("/api/randomUser", (req, res) => {
    var rName = require("random-name");
    db.User
      .create({
        phoneNumber: "+1" + Math.floor(Math.random() * 9000000000 + 1000000000),
        name: rName.first()
      })
      .then(data => {
        db.User.findAll({}).then(data => {
          var arr = [];
          data.forEach(function(ele) {
            arr.push(ele.dataValues);
          });

          firebase.ref("Users").set({
            data: arr
          });
          res.send(`${data} added `);
        });
      });
  });
  app.post("/api/deleteUsers", (req, res) => {
    db.User
      .destroy({
        where: {},
        truncate: true
      })
      .then(() => {
        db.User.findAll({}).then(data => {
          var arr = [];
          data.forEach(function(ele) {
            arr.push(ele.dataValues);
          });
          firebase.ref("Users").set({
            data: arr
          });
          res.send(`${data} added `);
        });
      });
  });

  //If a user sends an sms message
  app.post("/sms", bodyParser, (req, res) => {
    const twiml = new MessagingResponse();

    //Check to see if a user is in the current game.
    db.User
      .findAll({
        where: {
          phoneNumber: req.body.From
        }
      })
      .then(data => {
        if (data.length !== 0) {
          console.log(
            `Phone Number Found! > ${data[0].phoneNumber} (${data[0].name})`
          );
          var alreadyGuessed = false;
          firebase.ref().once("value", function(snapshot) {
            console.log(snapshot.child("Answers").val());
            var answers = [];
            var userTime = Date.now();
            var questionTime;
            textInTime = true;

            if (snapshot.child("TimeStart").val()) {
              questionTime = snapshot.child("TimeStart").val().time;
              var seconds = (userTime - questionTime) / 1000;
              console.log(`Time it took to guess: ${seconds} seconds`);
              if (seconds >= 20) {
                console.log(`You took too long to guess`);
                textInTime = false;
              }
            }

            if (snapshot.child("Answers").val()) {
              answers = snapshot.child("Answers").val().answers;
              answers.forEach(function(ele) {
                if (ele.name === data[0].name) {
                  alreadyGuessed = true;
                }
              });
            }

            if (!alreadyGuessed) {
              var guess = req.body.Body;
              if (guess.length === 1) {
                //If a known user texts an answer
                guess = guess.toLowerCase();
                if (
                  guess === "a" ||
                  guess === "b" ||
                  guess === "c" ||
                  guess === "d"
                ) {
                  checkAnswer(
                    data,
                    guess,
                    function(data) {
                      res.json(data);
                    },
                    seconds
                  );
                } else {
                  //If its NOT an A, B, C, or D
                  twiml.message(`${data[0].name}, please text A, B, C, or D.`);
                  res.writeHead(200, { "Content-Type": "text/xml" });
                  res.end(twiml.toString());
                }
              } else {
                //Anything other than a one character response
                twiml.message(`${data[0].name}, please text A, B, C, or D.`);
                res.writeHead(200, { "Content-Type": "text/xml" });
                res.end(twiml.toString());
              }
            } else {
              //User has already guessed
              twiml.message(`${data[0].name}, you have already guessed!!!`);
              res.writeHead(200, { "Content-Type": "text/xml" });
              res.end(twiml.toString());
            }
          });
        } else {
          console.log(`Data not found, now adding your info`);
          console.log(req.body);
          db.User
            .create({
              phoneNumber: req.body.From,
              name: req.body.Body
            })
            .then(data => {
              console.log(`Info added!`);
              twiml.message(
                `Welcome ${req.body
                  .Body}! You have been added to the current game.`
              );

              db.User.findAll({}).then(data => {
                var arr = [];
                data.forEach(function(ele) {
                  arr.push(ele.dataValues);
                });

                firebase.ref("Users").set({
                  data: arr
                });
                res.writeHead(200, { "Content-Type": "text/xml" });
                res.end(twiml.toString());
              });
            });
        }
      });
  });

  function checkAnswer(data, guess, cb, seconds) {
    firebase.ref("CurrentQuestion").once("value", function(snapshot) {
      db.Question
        .findAll({ where: { id: snapshot.val().currentQuestion } })
        .then(questObj => {
          if (questObj[0].correct_letter === guess) {
            firebase.ref("Answers").once("value", function(snapshot2) {
              console.log(snapshot2.val());
              var answers = [];
              if (snapshot2.val()) {
                answers = snapshot2.val().answers;
              }

              answers.push({
                name: data[0].name,
                avatar: data[0].avatar
              });
              firebase
                .ref("Answers")
                .set({
                  answers: answers
                })
                .then(() => {
                  var addToScore = 0;
                  if (textInTime) {
                    addToScore = 2000 - Math.floor(seconds * 100);
                  }
                  db.User
                    .update(
                      { score: data[0].score + addToScore },
                      { where: { id: data[0].id } }
                    )
                    .then(data => {
                      return cb(
                        `You guessed ${guess.toUpperCase()} in ${seconds} seconds, and you got it right! You earned ${addToScore}!`
                      );
                    });
                });
            });
          } else {
            firebase.ref("Answers").once("value", function(snapshot2) {
              console.log(snapshot2.val());
              var answers = [];
              if (snapshot2.val()) {
                answers = snapshot2.val().answers;
              }

              answers.push({
                name: data[0].name,
                avatar: data[0].avatar
              });
              firebase
                .ref("Answers")
                .set({
                  answers: answers
                })
                .then(() => {
                  return cb(
                    `You guessed ${guess}, and you got it wrong! ${questObj[0]
                      .correct_letter}`
                  );
                });
            });
          }
        });
    });
  }
};