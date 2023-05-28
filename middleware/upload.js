const multer = require('multer');

// Set the storage destination and filename for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); // Set the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename for uploaded files
  },
});

// Create the upload middleware
const upload = multer({ storage: storage });

// Export the upload middleware
module.exports = upload;
