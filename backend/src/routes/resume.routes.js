// backend/src/routes/resume.routes.js
const router = require('express').Router();
const Resume = require('../models/Resume');
const auth = require('../middleware/auth');

// POST /create-cv
router.post('/', auth, async (req, res) => {
  const resume = await Resume.create({ ...req.body, user: req.user._id });
  res.status(201).json(resume);
});

// GET /cv/:id
router.get('/:id', auth, async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!resume) return res.status(404).json({ message: 'Not found' });
  res.json(resume);
});

// PUT /cv/:id
router.put('/:id', auth, async (req, res) => {
  const resume = await Resume.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );
  if (!resume) return res.status(404).json({ message: 'Not found' });
  res.json(resume);
});

// DELETE /cv/:id
router.delete('/:id', auth, async (req, res) => {
  await Resume.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  res.status(204).end();
});

// GET /cv (dashboard list)
router.get('/', auth, async (req, res) => {
  const resumes = await Resume.find({ user: req.user._id }).sort({ updatedAt: -1 });
  res.json(resumes);
});

module.exports = router;
