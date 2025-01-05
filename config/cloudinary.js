const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

console.log("API", {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME || "daf6cmyaq",
    api_key: process.env.CLOUD_API_KEY || "169129593553637",
    api_secret: process.env.CLOUD_API_SECRET || "JyfBg240NLHdkLXGjmEohXOwdxg",
});


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "messaging",
        allowed_formats: ['jpg', 'png', 'jpeg'],
    },
});

module.exports = { cloudinary, storage };