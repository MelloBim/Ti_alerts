const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const controller = require('../controllers/scheduleController');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

router.post('/', upload.single('imagem'), controller.createSchedule);
router.get('/', controller.getAll);
router.put('/:id', upload.single('imagem'), controller.updateSchedule);
router.delete('/:id', controller.deleteSchedule);

module.exports = router;