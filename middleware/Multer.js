const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);  
  },
});

const fileFilter = (req, file, cb) => {
  const imageTypes = /jpeg|jpg|png|gif/;
  const documentTypes = /pdf|doc|docx|txt/;

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  const isImage = imageTypes.test(extname) && mimetype.startsWith('image/');
  
  const isDocument = documentTypes.test(extname) &&
    (mimetype === 'application/pdf' ||
     mimetype === 'application/msword' ||
     mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
     mimetype === 'text/plain');

  if (isImage || isDocument) {
    cb(null, true);
  } else {
    cb(new Error('Only image and document files (JPEG, PNG, GIF, PDF, DOC, DOCX, TXT) are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, 
});

upload.single('image'); 

module.exports = upload;
