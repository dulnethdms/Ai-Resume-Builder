// frontend/assets/js/templates.js
const TEMPLATE_RENDERERS = {
  modern: (r) => `
    <header class="border-b border-slate-200 pb-2 mb-3">
      <h1 class="text-lg font-semibold">${r.personal.fullName || ''}</h1>
      <p class="text-[11px] text-slate-600">
        ${[r.personal.email, r.personal.phone, r.personal.linkedin, r.personal.github]
          .filter(Boolean)
          .join(' • ')}
      </p>
    </header>
    ${r.summary ? `
      <section class="mb-3">
        <h2 class="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Summary</h2>
        <p class="text-[11px] text-slate-700 mt-1">${r.summary}</p>
      </section>` : ''}
    ${renderExperience(r)}
    ${renderEducation(r)}
    ${renderSkills(r)}
    ${renderProjects(r)}
    ${renderCerts(r)}
  `,
  minimal: (r) => `
    <header class="mb-2">
      <h1 class="text-base font-semibold">${r.personal.fullName || ''}</h1>
      <p class="text-[10px] text-slate-600">
        ${[r.personal.email, r.personal.phone].filter(Boolean).join(' | ')}
      </p>
    </header>
    ${renderSummaryInline(r)}
    ${renderExperience(r)}
    ${renderEducation(r)}
    ${renderSkills(r)}
  `,
  creative: (r) => `
    <header class="mb-3">
      <h1 class="text-lg font-bold tracking-tight">${r.personal.fullName || ''}</h1>
      <p class="text-[11px] text-slate-600">${r.summary || ''}</p>
    </header>
    <div class="grid grid-cols-3 gap-3">
      <aside class="col-span-1 border-r border-slate-200 pr-2">
        ${renderSkills(r)}
        ${renderCerts(r)}
      </aside>
      <section class="col-span-2 pl-2">
        ${renderExperience(r)}
        ${renderProjects(r)}
        ${renderEducation(r)}
      </section>
    </div>
  `,
  corporate: (r) => `
    <header class="border-b border-slate-300 pb-2 mb-2">
      <h1 class="text-base font-semibold">${r.personal.fullName || ''}</h1>
      <p class="text-[10px] text-slate-600">
        ${[r.personal.email, r.personal.phone, r.personal.address].filter(Boolean).join(' • ')}
      </p>
    </header>
    ${renderSummaryInline(r)}
    ${renderExperience(r)}
    ${renderEducation(r)}
    ${renderSkills(r)}
    ${renderCerts(r)}
  `,
  classic: (r) => `...`,
  executive: (r) => `...`,
};

function renderSummaryInline(r) {
  if (!r.summary) return '';
  return `
    <section class="mb-2">
      <h2 class="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Professional Summary</h2>
      <p class="text-[11px] text-slate-700 mt-1">${r.summary}</p>
    </section>
  `;
}

function renderExperience(r) {
  if (!r.experience?.length) return '';
  return `
    <section class="mb-2">
      <h2 class="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Experience</h2>
      ${r.experience
        .map(
          (e) => `
        <article class="mt-1">
          <div class="flex justify-between text-[11px] font-semibold">
            <span>${e.jobTitle || ''} – ${e.company || ''}</span>
            <span class="text-slate-500">${e.startDate || ''} – ${e.endDate || 'Present'}</span>
          </div>
          <ul class="list-disc ml-4 text-[11px] text-slate-700">
            ${(e.responsibilities || []).map((r) => `<li>${r}</li>`).join('')}
          </ul>
        </article>`
        )
        .join('')}
    </section>
  `;
}

// Similar helpers for education, skills, projects, certs...
