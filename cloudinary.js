var cloudinary = require("cloudinary");
cloudinary.config({ 
  cloud_name: 'avincent', 
  api_key: '779359958168278', 
  api_secret: 'hIsjHEv8E8LGQoEl_sEoANpyQ_Q' 
});

// Upload code

function upload(userImage) {
    cloudinary.v2.uploader.upload('../../../testpic.jpg', {transformation: [
        {width: 400, height: 400, gravity: "face", radius: "max", crop: "crop"},
        {width: 200, crop: "scale"}
        ] }, 
        function(error, image) {
            console.log(image);
        })      
};
upload();
