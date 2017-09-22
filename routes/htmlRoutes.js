// *********************************************************************************
// htmlRoutes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
var path = require("path");
const http = require("http");
var db = require("../models");
var firebase = require("../firebase.js");

// Routes
// =============================================================
module.exports = function(app) {
  // Each of the below routes just handles the HTML page that the user gets sent to.

  // index route loads index.handlebars
  app.get("/", function(req, res) {
    res.render("index");
  });

  // /question route loads question.handlebars
  app.get("/question", function(req, res) {
    res.render("question");
  });

  // /results route loads results.handlebars
  app.get("/results", function(req, res) {
    res.render("results");
  });

  app.get("/finalResults", function(req, res) {
    db.User.findAll({}).then(data => {
      
      var winner;
      var theRest = [];

      var maxValue = 0;
      var winnerIndex;

      data.forEach( (ele,i) =>{
        
        if(ele.score > maxValue){
          
          winner = ele;
          console.log(`new winner ${winner.name}`);
          maxValue = ele.score;
          winnerIndex = i;
        }
      });

      data.splice(winnerIndex, 1);
      theRest = data;

      theRest.sort(function(a,b){
        return b.score - a.score;
      })
      
      res.render("finalResults", {winner: winner, runnerUps: theRest});
    });
  });

};
