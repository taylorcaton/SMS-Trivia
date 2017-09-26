var cloudinary = require("cloudinary");
// var phone      = require("routes/phoneRoutes")
cloudinary.config({
  cloud_name: "avincent",
  api_key: "779359958168278",
  api_secret: "hIsjHEv8E8LGQoEl_sEoANpyQ_Q"
});

// Upload code

module.exports = function upload(avatar, cb) {
  cloudinary.v2.uploader.upload(
    avatar,
    {
      transformation: [
        {
          width: 800,
          height: 800,
          gravity: "face",
          radius: "max",
          crop: "crop"
        },
        { width: 200, height: 200, crop: "scale" },
      ],
      format: "png",
    },
    
    function(error, image) {
      if (error) {
        console.log(error);
      } else {
        return cb(image);
      }
    }
  );
};
