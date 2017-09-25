var upload = require("./cloudinary.js");

var img = 'https://api.twilio.com/2010-04-01/Accounts/AC8939166674e3ca2b20e2c90fc5851546/Messages/MMbf5b005e917e58332df0f61fb1746baa/Media/ME4f57d14b34385586f29fce89d7589dbd'

upload(img, image => {
    console.log(image.url);
})