var firebase = require('./firebase.js');

firebase.ref('users/').set({
  username: "Taylor",
  email: "taylorcaton@gmail.com",
  profile_picture : "imgUrl"
});