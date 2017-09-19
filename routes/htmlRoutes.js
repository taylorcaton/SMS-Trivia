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
    db.Question.findAll({}).then(data => {
      res.render("results");
    });
  });
};
