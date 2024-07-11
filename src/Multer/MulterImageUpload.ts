import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'src/uploads/'); // Set your upload destination path
  },
  filename: (req, file, callback) => {
    callback(null, Date.now() + '_' + file.originalname);
  },
});

// Multer middleware for handling file uploads with different field names
export const uploadFiles = multer({
  storage,
}).fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'additionalImages', maxCount: 10 },
]);

export default multer({ storage });
