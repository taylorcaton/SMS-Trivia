var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var db = require("./models");

var app = express();
var port = process.env.PORT || 8080;

var exphbs = require("express-handlebars");

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Static directory
app.use(express.static("public"));

// Routes
// =============================================================
require("./routes/htmlRoutes.js")(app);
require("./routes/phoneRoutes.js")(app);
require("./routes/quizRoutes.js")(app);

db.sequelize.sync({ force: true }).then(function() {
  app.listen(port, function() {
    console.log("smsApp listening on PORT " + port);
  });
  // runTestUsersForResults();
});

function runTestUsersForResults() {
  var rName = require("random-name");
  db.User.bulkCreate([
    { name: rName.first(), score: Math.random() * 5000, phoneNumber: "5552223333" },
    { name: rName.first(), score: Math.random() * 5000, phoneNumber: "5552223334" },
    { name: rName.first(), score: Math.random() * 5000, phoneNumber: "5552223335" },
    { name: rName.first(), score: Math.random() * 5000, phoneNumber: "5552223336" },
    { name: rName.first(), score: Math.random() * 5000, phoneNumber: "5552223333" },
    { name: rName.first(), score: Math.random() * 5000, phoneNumber: "5552223334" },
    { name: rName.first(), score: Math.random() * 5000, phoneNumber: "5552223335" },
    { name: rName.first(), score: Math.random() * 5000, phoneNumber: "5552223336" },
    { name: rName.first(), score: Math.random() * 5000, phoneNumber: "5552223333" },
  ]);
}
