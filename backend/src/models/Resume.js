// backend/src/models/Resume.js
const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, default: 'My Resume' },
    template: {
      type: String,
      enum: ['modern', 'minimal', 'creative', 'corporate', 'executive', 'classic', 'sidebar-pro'],
      default: 'modern',
    },
    theme: {
      primaryColor: { type: String, default: '#1f2937' },
      fontFamily: { type: String, default: 'Inter, system-ui, sans-serif' },
      spacing: { type: String, default: 'normal' },
    },
    personal: {
      fullName: String,
      photoUrl: String,
      email: String,
      phone: String,
      address: String,
      linkedin: String,
      github: String,
    },
    summary: { type: String },
    education: [
      {
        degree: String,
        institution: String,
        year: String,
        gpa: String,
      },
    ],
    experience: [
      {
        jobTitle: String,
        company: String,
        startDate: String,
        endDate: String,
        responsibilities: [String],
      },
    ],
    projects: [
      {
        title: String,
        description: String,
        technologies: [String],
        link: String,
      },
    ],
    skills: [
      {
        name: String,
        level: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'expert'], default: 'intermediate' },
      },
    ],
    certifications: [
      {
        title: String,
        issuer: String,
        date: String,
      },
    ],
    achievements: [String],
    atsScore: { type: Number, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resume', resumeSchema);
