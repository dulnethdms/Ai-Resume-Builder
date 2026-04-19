// backend/src/routes/upload.routes.js
const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/profile'),
  filename: (req, file, cb) =>
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`),
});

const upload = multer({ storage });

router.post('/profile-photo', auth, upload.single('photo'), (req, res) => {
  res.json({ url: `/uploads/profile/${req.file.filename}` });
});

module.exports = router;
