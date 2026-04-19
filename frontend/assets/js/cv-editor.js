// frontend/assets/js/cv-editor.js
window.resumeState = {
  template: 'modern',
  personal: {},
  summary: '',
  education: [],
  experience: [],
  projects: [],
  skills: [],
  certifications: [],
};

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('cvForm');
  const templateSelect = document.getElementById('templateSelect');
  const aiSummaryBtn = document.getElementById('aiSummaryBtn');

  if (!form || !templateSelect) return;

  const updatePreview = () => {
    if (typeof window.renderPreview === 'function') {
      window.renderPreview(window.resumeState, window.resumeState.template);
    }
  };

  form.addEventListener('input', (e) => {
    const { name, value } = e.target;
    if (!name) return;

    // Simple mapping for personal + summary
    if (['fullName', 'email', 'phone', 'address', 'linkedin', 'github'].includes(name)) {
      window.resumeState.personal[name] = value;
    } else if (name === 'summary') {
      window.resumeState.summary = value;
    }

    updatePreview();
  });

  templateSelect.addEventListener('change', (e) => {
    window.resumeState.template = e.target.value;
    updatePreview();
  });

  // TODO: add handlers for dynamic add/remove of education, experience, etc.

  if (aiSummaryBtn) {
    aiSummaryBtn.addEventListener('click', async () => {
      if (typeof apiRequest !== 'function') {
        alert('API helper is not loaded yet.');
        return;
      }

      const role = prompt('Target role (e.g., Full Stack Engineer):');
      if (!role) return;

      const res = await apiRequest('/ai/summary', {
        method: 'POST',
        body: JSON.stringify({ role }),
      });

      const textarea = form.querySelector('textarea[name="summary"]');
      textarea.value = res.summary;
      window.resumeState.summary = res.summary;
      updatePreview();
    });
  }

  updatePreview();
});

