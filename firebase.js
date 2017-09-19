  var firebase = require('firebase');
  // Set the configuration for your app
  // TODO: Replace with your project's config object
  var config = {
    apiKey: "AIzaSyDco9qKonI5bgVdw2iVsh6ZW9UCG1",
    authDomain: "smstrivia-aa7f0.firebaseapp.com",
    databaseURL: "https://smstrivia-aa7f0.firebaseio.com",
    storageBucket: "smstrivia-aa7f0.appspot.com"
  };
  firebase.initializeApp(config);

  // Get a reference to the database service
  module.exports = firebase.database();