// frontend/assets/js/cv-editor.js
window.resumeState = {
  template: 'modern',
  theme: {
    palette: 'indigo',
    colors: {
      primary: '#4f46e5',
      soft: '#eef2ff',
    },
  },
  personal: {},
  summary: '',
  education: [],
  experience: [],
  projects: [],
  skills: [],
  certifications: [],
  awards: [],
  publications: [],
  references: [],
};

const escapeHtml = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('cvForm');
  const templateSelect = document.getElementById('templateSelect');
  const paletteSelect = document.getElementById('paletteSelect');
  const aiSummaryBtn = document.getElementById('aiSummaryBtn');

  if (!form || !templateSelect) return;

  const repeaters = [
    {
      key: 'education',
      containerId: 'educationEntries',
      addBtnId: 'addEducationBtn',
      emptyLabel: 'No education entries yet.',
      cardTitle: 'Education entry',
      fields: [
        { key: 'degree', label: 'Degree', placeholder: 'BS Computer Science' },
        { key: 'institution', label: 'Institution', placeholder: 'FAST-NUCES' },
        { key: 'graduationDate', label: 'Graduation date', placeholder: '2024' },
        { key: 'courseworkHonors', label: 'Coursework / honors', placeholder: 'Dean\'s List, Data Structures' },
      ],
      createItem: () => ({ degree: '', institution: '', graduationDate: '', courseworkHonors: '' }),
    },
    {
      key: 'experience',
      containerId: 'experienceEntries',
      addBtnId: 'addExperienceBtn',
      emptyLabel: 'No work experience entries yet.',
      cardTitle: 'Work entry',
      fields: [
        { key: 'jobTitle', label: 'Role', placeholder: 'Software Engineer Intern' },
        { key: 'company', label: 'Organization', placeholder: 'ABC Tech' },
        { key: 'startDate', label: 'Start date', placeholder: 'Jun 2024' },
        { key: 'endDate', label: 'End date', placeholder: 'Aug 2024' },
        { key: 'achievement1', label: 'Highlight 1', placeholder: 'Reduced API response time by 30%' },
        { key: 'achievement2', label: 'Highlight 2', placeholder: 'Built reusable dashboard widgets' },
        { key: 'achievement3', label: 'Highlight 3', placeholder: 'Improved test coverage to 85%' },
      ],
      createItem: () => ({
        jobTitle: '',
        company: '',
        startDate: '',
        endDate: '',
        achievement1: '',
        achievement2: '',
        achievement3: '',
      }),
    },
    {
      key: 'skills',
      kind: 'technical',
      containerId: 'technicalSkillsEntries',
      addBtnId: 'addTechnicalSkillBtn',
      emptyLabel: 'No technical skills added yet.',
      cardTitle: 'Technical skill',
      fields: [
        { key: 'name', label: 'Skill', placeholder: 'JavaScript' },
        {
          key: 'level',
          label: 'Level',
          type: 'select',
          options: ['beginner', 'intermediate', 'advanced', 'expert'],
        },
      ],
      createItem: () => ({ kind: 'technical', name: '', level: 'intermediate' }),
    },
    {
      key: 'skills',
      kind: 'soft',
      containerId: 'softSkillsEntries',
      addBtnId: 'addSoftSkillBtn',
      emptyLabel: 'No soft skills added yet.',
      cardTitle: 'Soft skill',
      fields: [{ key: 'name', label: 'Skill', placeholder: 'Communication' }],
      createItem: () => ({ kind: 'soft', name: '' }),
    },
    {
      key: 'projects',
      containerId: 'projectEntries',
      addBtnId: 'addProjectBtn',
      emptyLabel: 'No projects added yet.',
      cardTitle: 'Project entry',
      fields: [
        { key: 'title', label: 'Project title', placeholder: 'AI Resume Builder' },
        { key: 'description', label: 'Impact / description', placeholder: 'Built a full-stack resume builder with live preview and PDF export.' },
        { key: 'technologies', label: 'Technologies', placeholder: 'React, Node.js, MongoDB' },
        { key: 'link', label: 'Link', placeholder: 'https://github.com/user/repo' },
      ],
      createItem: () => ({ title: '', description: '', technologies: '', link: '' }),
    },
    {
      key: 'certifications',
      containerId: 'certificationEntries',
      addBtnId: 'addCertificationBtn',
      emptyLabel: 'No certifications added yet.',
      cardTitle: 'Certification entry',
      fields: [
        { key: 'title', label: 'Certification', placeholder: 'AWS Cloud Practitioner' },
        { key: 'issuer', label: 'Issuer', placeholder: 'Amazon' },
        { key: 'date', label: 'Date', placeholder: '2025' },
      ],
      createItem: () => ({ title: '', issuer: '', date: '' }),
    },
    {
      key: 'awards',
      containerId: 'awardEntries',
      addBtnId: 'addAwardBtn',
      emptyLabel: 'No awards added yet.',
      cardTitle: 'Award entry',
      fields: [
        { key: 'title', label: 'Award / achievement', placeholder: 'Winner - National Hackathon' },
        { key: 'issuer', label: 'Issuer / organizer', placeholder: 'University Tech Club' },
        { key: 'date', label: 'Date', placeholder: '2025' },
      ],
      createItem: () => ({ title: '', issuer: '', date: '' }),
    },
    {
      key: 'publications',
      containerId: 'publicationEntries',
      addBtnId: 'addPublicationBtn',
      emptyLabel: 'No publications added yet.',
      cardTitle: 'Publication entry',
      fields: [
        { key: 'title', label: 'Title', placeholder: 'Paper title' },
        { key: 'venue', label: 'Venue', placeholder: 'Conference / journal' },
        { key: 'year', label: 'Year', placeholder: '2025' },
        { key: 'link', label: 'Link', placeholder: 'https://doi.org/...' },
      ],
      createItem: () => ({ title: '', venue: '', year: '', link: '' }),
    },
    {
      key: 'references',
      containerId: 'referenceEntries',
      addBtnId: 'addReferenceBtn',
      emptyLabel: 'No references added yet.',
      cardTitle: 'Reference entry',
      fields: [
        { key: 'name', label: 'Name', placeholder: 'Dr. Jane Smith' },
        { key: 'relationship', label: 'Relationship', placeholder: 'Professor / Manager' },
        { key: 'contact', label: 'Contact', placeholder: 'email@example.com' },
        { key: 'note', label: 'Note', placeholder: 'Available upon request' },
      ],
      createItem: () => ({ name: '', relationship: '', contact: '', note: '' }),
    },
  ];

  const updatePreview = () => {
    if (typeof window.renderPreview === 'function') {
      window.renderPreview(window.resumeState, window.resumeState.template);
    }
  };

  const buildLocalSummary = (role) => {
    const fullName = window.resumeState.personal?.fullName || 'Candidate';
    const technicalSkills = (window.resumeState.skills || [])
      .filter((skill) => (skill.kind || 'technical') === 'technical' && skill.name)
      .map((skill) => skill.name)
      .slice(0, 3);

    const roleLabel = role || 'professional role';
    const skillsLabel = technicalSkills.length
      ? `with hands-on experience in ${technicalSkills.join(', ')}`
      : 'with a strong focus on delivering high-quality results';

    return `${fullName} is an aspiring ${roleLabel} ${skillsLabel}. They bring practical problem-solving, collaboration, and a growth mindset to fast-paced teams. Seeking opportunities to contribute measurable impact while continuously improving technical and business outcomes.`;
  };

  const paletteMap = {
    indigo: { primary: '#4f46e5', soft: '#eef2ff' },
    slate: { primary: '#334155', soft: '#f1f5f9' },
    emerald: { primary: '#059669', soft: '#ecfdf5' },
    rose: { primary: '#e11d48', soft: '#fff1f2' },
    amber: { primary: '#d97706', soft: '#fffbeb' },
    cyan: { primary: '#0891b2', soft: '#ecfeff' },
  };

  const hasAnyValue = (item) =>
    Object.values(item).some((value) => Array.isArray(value) ? value.length > 0 : String(value || '').trim().length > 0);

  const getSectionState = (section) => {
    if (section.key === 'skills') {
      return (window.resumeState.skills || []).filter((item) => (item.kind || 'technical') === section.kind);
    }

    return window.resumeState[section.key] || [];
  };

  const setSectionState = (section, items) => {
    if (section.key === 'skills') {
      const otherSkills = (window.resumeState.skills || []).filter((item) => (item.kind || 'technical') !== section.kind);
      window.resumeState.skills = [...otherSkills, ...items];
      return;
    }

    window.resumeState[section.key] = items;
  };

  const escapeText = (value) => escapeHtml(value ?? '');

  const renderField = (section, field, value, index) => {
    const id = `${section.containerId}-${index}-${field.key}`;
    const baseClasses = 'w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100';

    if (field.type === 'select') {
      return `
        <label class="block text-xs text-slate-700">
          <span class="block mb-1">${escapeText(field.label)}</span>
          <select data-field="${escapeText(field.key)}" id="${id}" class="${baseClasses}">
            ${field.options
              .map((option) => `<option value="${escapeText(option)}" ${String(value || '') === option ? 'selected' : ''}>${escapeText(option)}</option>`)
              .join('')}
          </select>
        </label>
      `;
    }

    return `
      <label class="block text-xs text-slate-700 ${field.span === 2 ? 'md:col-span-2' : ''}">
        <span class="block mb-1">${escapeText(field.label)}</span>
        <input
          data-field="${escapeText(field.key)}"
          id="${id}"
          type="${field.type || 'text'}"
          value="${escapeText(value)}"
          placeholder="${escapeText(field.placeholder || '')}"
          class="${baseClasses}"
        />
      </label>
    `;
  };

  const renderSectionCards = (section) => {
    const items = getSectionState(section);
    const container = document.getElementById(section.containerId);

    if (!container) return;

    if (!items.length) {
      container.innerHTML = `<div class="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-xs text-slate-500">${escapeText(section.emptyLabel)}</div>`;
      return;
    }

    container.innerHTML = items
      .map((item, index) => {
        const gridClasses = section.key === 'experience' || section.key === 'projects' || section.key === 'references'
          ? 'grid grid-cols-1 md:grid-cols-2 gap-3'
          : 'grid grid-cols-1 md:grid-cols-2 gap-3';

        return `
          <article class="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm" data-section-card data-section-key="${escapeText(section.key)}" data-section-kind="${escapeText(section.kind || '')}" data-section-index="${index}">
            <div class="flex items-center justify-between gap-3 mb-3">
              <h3 class="text-xs font-semibold text-slate-800">${escapeText(section.cardTitle)} ${index + 1}</h3>
              <button type="button" data-remove-entry class="text-[10px] px-2 py-1 rounded-md border border-rose-200 bg-white text-rose-700 hover:border-rose-300">Remove</button>
            </div>
            <div class="${gridClasses}">
              ${section.fields
                .map((field) => {
                  const itemValue = item[field.key] ?? '';
                  return renderField(section, field, itemValue, index);
                })
                .join('')}
            </div>
          </article>
        `;
      })
      .join('');
  };

  const renderAllSections = () => {
    repeaters.forEach((section) => renderSectionCards(section));
  };

  const syncRepeatableSectionFromDom = (section) => {
    const container = document.getElementById(section.containerId);
    if (!container) return;

    const cards = Array.from(container.querySelectorAll('[data-section-card]'));
    const items = cards
      .map((card) => {
        const values = {};

        card.querySelectorAll('[data-field]').forEach((input) => {
          values[input.dataset.field] = input.value.trim();
        });

        if (section.key === 'skills') {
          values.kind = section.kind;
        }

        if (section.key === 'projects' && values.technologies) {
          values.technologies = values.technologies
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean);
        }

        return values;
      });

    setSectionState(section, items);
  };

  const syncResumeStateFromForm = () => {
    const personalFields = ['fullName', 'email', 'phone', 'address', 'linkedin', 'github'];

    personalFields.forEach((field) => {
      const input = form.querySelector(`[name="${field}"]`);
      window.resumeState.personal[field] = input?.value.trim() || '';
    });

    const summaryInput = form.querySelector('textarea[name="summary"]');
    window.resumeState.summary = summaryInput?.value.trim() || '';

    repeaters.forEach((section) => syncRepeatableSectionFromDom(section));
  };

  window.syncResumeStateFromForm = syncResumeStateFromForm;

  const addSectionItem = (section) => {
    syncResumeStateFromForm();
    const currentItems = getSectionState(section);
    setSectionState(section, [...currentItems, section.createItem()]);
    renderSectionCards(section);
    updatePreview();
  };

  repeaters.forEach((section) => {
    const addButton = document.getElementById(section.addBtnId);
    if (addButton) {
      addButton.addEventListener('click', () => addSectionItem(section));
    }
  });

  form.addEventListener('click', (event) => {
    const removeButton = event.target.closest('[data-remove-entry]');
    if (!removeButton) return;

    const card = removeButton.closest('[data-section-card]');
    if (!card) return;

    const sectionKey = card.dataset.sectionKey;
    const sectionKind = card.dataset.sectionKind;
    const section = repeaters.find((item) => item.key === sectionKey && (item.kind || '') === (sectionKind || ''));
    if (!section) return;

    syncResumeStateFromForm();
    const currentItems = getSectionState(section);
    const index = Number(card.dataset.sectionIndex);
    const nextItems = currentItems.filter((_, itemIndex) => itemIndex !== index);
    setSectionState(section, nextItems);
    renderSectionCards(section);
    updatePreview();
  });

  form.addEventListener('input', () => {
    syncResumeStateFromForm();
    updatePreview();
  });

  templateSelect.addEventListener('change', (event) => {
    window.resumeState.template = event.target.value;
    updatePreview();
  });

  const applyPalette = (paletteKey) => {
    const colors = paletteMap[paletteKey] || paletteMap.indigo;
    window.resumeState.theme.palette = paletteKey;
    window.resumeState.theme.colors = colors;
  };

  if (paletteSelect) {
    applyPalette(paletteSelect.value);
    paletteSelect.addEventListener('change', (event) => {
      applyPalette(event.target.value);
      updatePreview();
    });
  }

  if (aiSummaryBtn) {
    aiSummaryBtn.addEventListener('click', async () => {
      if (typeof apiRequest !== 'function') {
        alert('API helper is not loaded yet.');
        return;
      }

      const role = prompt('Target role (e.g., Full Stack Engineer):');
      if (!role) return;

      try {
        const res = await apiRequest('/ai/summary', {
          method: 'POST',
          body: JSON.stringify({ role }),
        });

        const textarea = form.querySelector('textarea[name="summary"]');
        textarea.value = res.summary || '';
        window.resumeState.summary = res.summary || '';
        updatePreview();
      } catch (error) {
        const fallbackSummary = buildLocalSummary(role);
        const textarea = form.querySelector('textarea[name="summary"]');
        textarea.value = fallbackSummary;
        window.resumeState.summary = fallbackSummary;
        updatePreview();

        alert('AI service is currently unreachable, so a smart local summary was generated instead.');
      }
    });
  }

  syncResumeStateFromForm();
  if (paletteSelect && !window.resumeState.theme?.colors) {
    applyPalette(paletteSelect.value);
  }
  renderAllSections();
  updatePreview();
});

