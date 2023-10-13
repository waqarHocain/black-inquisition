const multer = require("multer");

const storage = multer.memoryStorage();

const uploader = multer({
  storage: storage,
  limits: {
    fileSize: 3145728, // 3mb
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.split("/")[0] !== "image") {
      return cb(null, false);
    }
    cb(null, true);
  },
});

module.exports = uploader;
