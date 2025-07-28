import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads"); 
  }, 
  filename: (req, file, callback) => {
    callback(
      null,
      `${Date.now()}-${file.originalname}.${file.mimetype.split("/")[1]}`
    ); 
  }, 
});

export default storage;