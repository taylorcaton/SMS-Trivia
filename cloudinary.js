var cloudinary = require("cloudinary");
cloudinary.config({ 
  cloud_name: 'avincent', 
  api_key: '779359958168278', 
  api_secret: 'hIsjHEv8E8LGQoEl_sEoANpyQ_Q' 
});


// Upload code

function upload(userImage) {
    cloudinary.uploader.upload(userImage, function(result) {
    console.log(result);
    },
    {
        public_id: userID, 
        crop: 'limit',
        width: 2000,
        height: 2000,
        eager: [
        {   
            width: 200, height: 200, crop: 'thumb', gravity: 'face',
            radius: 20, effect: 'sepia' 
        },
        { 
            width: 100, height: 150, crop: 'fit', format: 'png' 
        }
        ],                                     
        tags: ['special', 'for_homepage']
  })      
};


// Image manipulation code

/*function transform(newImage) {
    cloudinary.image("sample", {"crop":"fill","gravity":"faces","width":300,"height":200,"format":"jpg"});
};*/
// Environment variable

//cloudinary://779359958168278:hIsjHEv8E8LGQoEl_sEoANpyQ_Q@funkplayer82/


