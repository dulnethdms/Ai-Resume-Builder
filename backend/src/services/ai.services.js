// backend/src/services/ai.service.js
async function generateSummary(profileData) {
  // Call external LLM here; for now, mock:
  return `Experienced ${profileData.role || 'professional'} with a strong background in ${
    profileData.domain || 'software development'
  } and a track record of delivering high-quality results.`;
}

async function suggestSkills(jobTitle) {
  const map = {
    'full stack developer': ['JavaScript', 'React', 'Node.js', 'MongoDB', 'REST APIs', 'Git'],
    'data scientist': ['Python', 'Pandas', 'NumPy', 'Machine Learning', 'SQL', 'Data Visualization'],
  };
  return map[jobTitle.toLowerCase()] || ['Communication', 'Problem Solving', 'Teamwork'];
}

async function scoreResumeForATS(resume) {
  // Simple heuristic placeholder
  let score = 70;
  if (resume.skills?.length >= 8) score += 10;
  if (resume.experience?.length >= 2) score += 10;
  if (resume.summary) score += 5;
  return Math.min(score, 100);
}

async function improveGrammar(text) {
  // Placeholder: in real app, call grammar API
  return text;
}

module.exports = { generateSummary, suggestSkills, scoreResumeForATS, improveGrammar };
