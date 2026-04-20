// frontend/assets/js/preview.js
function renderPreview(state, template) {
  const container = document.getElementById('previewContainer');
  if (!container) return;

  const colors = state?.theme?.colors || { primary: '#4f46e5', soft: '#eef2ff' };
  container.style.setProperty('--resume-accent', colors.primary);
  container.style.setProperty('--resume-accent-soft', colors.soft);

  const renderer = TEMPLATE_RENDERERS[template] || TEMPLATE_RENDERERS.modern;
  container.innerHTML = renderer(state);
}

window.renderPreview = renderPreview;

document.addEventListener('DOMContentLoaded', () => {
  if (window.resumeState) {
    renderPreview(window.resumeState, window.resumeState.template || 'modern');
  }
});
