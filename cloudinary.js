var cloudinary = require("cloudinary");
// var phone      = require("routes/phoneRoutes")
cloudinary.config({ 
  cloud_name: 'avincent', 
  api_key: '779359958168278', 
  api_secret: 'hIsjHEv8E8LGQoEl_sEoANpyQ_Q' 
});

// Upload code

module.exports = function upload(avatar, cb) {
    cloudinary.v2.uploader.upload(avatar, {transformation: [
        {width: 400, height: 400, gravity: "face", radius: "max", crop: "crop"},
        {width: 400, crop: "scale"}
        ] }, 
        function(error, image ) {
            return cb(image);
        })      
};