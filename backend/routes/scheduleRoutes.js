const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');
const controller = require('../controllers/scheduleController');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Tipo de arquivo não permitido. Use JPG, PNG ou WEBP.'));
    }
    cb(null, true);
  }
});

router.use(authMiddleware);
router.post('/', upload.single('imagem'), controller.createSchedule);
router.get('/', controller.getAll);
router.put('/:id', upload.single('imagem'), controller.updateSchedule);
router.delete('/:id', controller.deleteSchedule);

module.exports = router;