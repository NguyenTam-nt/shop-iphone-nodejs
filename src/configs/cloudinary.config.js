const cloudinary = require("cloudinary").v2

// Configuration
cloudinary.config({
  cloud_name: "showit",
  api_key: "839749525375982",
  api_secret: "3raG-GNiBAjdhFU65zjeVjBL-Qg", // Click 'View API Keys' above to copy your API secret
})

module.exports = cloudinary
