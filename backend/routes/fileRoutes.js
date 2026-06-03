const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  createFile,
  getFiles,
  getFileById,
  updateFile,
  deleteFile,
} = require('../controllers/fileController');
const { protect } = require('../middleware/authMiddleware');

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, DOCX, JPG, and PNG files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

router.route('/')
  .get(protect, getFiles)
  .post(protect, upload.single('attachment'), createFile);

router.route('/:id')
  .get(protect, getFileById)
  .put(protect, upload.single('attachment'), updateFile)
  .delete(protect, deleteFile);

module.exports = router;
