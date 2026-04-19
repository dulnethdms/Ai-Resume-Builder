// backend/src/routes/pdf.routes.js
const router = require('express').Router();
const auth = require('../middleware/auth');
const Resume = require('../models/Resume');
const { generateResumePdf } = require('../services/pdf.service');
const { renderTemplateHtml } = require('../services/template-renderer'); // you implement

router.get('/:id/pdf', auth, async (req, res) => {
  const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
  if (!resume) return res.status(404).json({ message: 'Not found' });

  const html = renderTemplateHtml(resume); // server-side template (ATS-friendly)
  const pdf = await generateResumePdf(html);

  res.set({
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="${resume.title || 'resume'}.pdf"`,
  });
  res.send(pdf);
});

module.exports = router;
