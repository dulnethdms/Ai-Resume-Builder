// frontend/assets/js/templates.js
const TEMPLATE_RENDERERS = {
  modern: (r) => `
    <header class="border-b pb-2 mb-3" style="border-color: var(--resume-accent-soft);">
      <h1 class="text-lg font-semibold" style="color: var(--resume-accent);">${r.personal.fullName || ''}</h1>
      <p class="text-[11px] text-slate-600">
        ${[r.personal.email, r.personal.phone, r.personal.address, r.personal.linkedin, r.personal.github]
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
    ${renderAwards(r)}
    ${renderPublications(r)}
    ${renderReferences(r)}
  `,
  minimal: (r) => `
    <header class="mb-2">
      <h1 class="text-base font-semibold" style="color: var(--resume-accent);">${r.personal.fullName || ''}</h1>
      <p class="text-[10px] text-slate-600">
        ${[r.personal.email, r.personal.phone].filter(Boolean).join(' | ')}
      </p>
    </header>
    ${renderSummaryInline(r)}
    ${renderExperience(r)}
    ${renderEducation(r)}
    ${renderSkills(r)}
    ${renderProjects(r)}
    ${renderCerts(r)}
    ${renderAwards(r)}
    ${renderPublications(r)}
    ${renderReferences(r)}
  `,
  creative: (r) => `
    <header class="mb-3">
      <h1 class="text-lg font-bold tracking-tight" style="color: var(--resume-accent);">${r.personal.fullName || ''}</h1>
      <p class="text-[11px] text-slate-600">${r.summary || ''}</p>
    </header>
    <div class="grid grid-cols-3 gap-3">
      <aside class="col-span-1 border-r pr-2" style="border-color: var(--resume-accent-soft);">
        ${renderSkills(r)}
        ${renderCerts(r)}
      </aside>
      <section class="col-span-2 pl-2">
        ${renderExperience(r)}
        ${renderProjects(r)}
        ${renderEducation(r)}
        ${renderPublications(r)}
        ${renderReferences(r)}
      </section>
    </div>
  `,
  corporate: (r) => `
    <header class="border-b pb-2 mb-2" style="border-color: var(--resume-accent-soft);">
      <h1 class="text-base font-semibold" style="color: var(--resume-accent);">${r.personal.fullName || ''}</h1>
      <p class="text-[10px] text-slate-600">
        ${[r.personal.email, r.personal.phone, r.personal.address].filter(Boolean).join(' • ')}
      </p>
    </header>
    ${renderSummaryInline(r)}
    ${renderExperience(r)}
    ${renderEducation(r)}
    ${renderSkills(r)}
    ${renderProjects(r)}
    ${renderCerts(r)}
    ${renderAwards(r)}
    ${renderPublications(r)}
    ${renderReferences(r)}
  `,
  'sidebar-pro': (r) => `
    <div class="grid grid-cols-12 border border-slate-300 overflow-hidden">
      <aside class="col-span-4 p-4 text-white" style="background: #1f2937;">
        <div class="h-1 w-10 mb-4" style="background: var(--resume-accent);"></div>
        <div class="w-20 h-20 rounded-sm border border-white/30 bg-slate-600 flex items-center justify-center text-xl font-semibold">
          ${getInitials(r.personal.fullName)}
        </div>
        <h1 class="text-xl mt-3 font-medium leading-tight">${r.personal.fullName || ''}</h1>

        ${renderSidebarContact(r)}
        ${renderSidebarSkills(r)}
      </aside>

      <section class="col-span-8 bg-white p-4">
        ${r.summary ? `
          <section class="mb-4">
            <h2 class="text-[12px] font-bold uppercase tracking-wider pb-1 border-b border-slate-300">Professional Summary</h2>
            <p class="mt-2 text-[11px] text-slate-700 leading-5">${r.summary}</p>
          </section>
        ` : ''}

        ${renderSidebarExperience(r)}
        ${renderSidebarEducation(r)}
        ${renderSidebarProjects(r)}
        ${renderSidebarCertifications(r)}
        ${renderSidebarAwards(r)}
        ${renderSidebarPublications(r)}
        ${renderSidebarReferences(r)}
      </section>
    </div>
  `,
  classic: (r) => `...`,
  executive: (r) => `...`,
};

function getInitials(name) {
  const normalized = String(name || '').trim();
  if (!normalized) return 'CV';
  return normalized
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

function getFilledEntries(items) {
  return (items || []).filter((entry) =>
    Object.values(entry || {}).some((value) => String(value || '').trim().length > 0)
  );
}

function renderSidebarSectionTitle(title) {
  return `<h2 class="text-[12px] font-bold uppercase tracking-wider pb-1 border-b border-slate-300">${title}</h2>`;
}

function renderSidebarContact(r) {
  const lines = [
    r.personal.address,
    r.personal.phone,
    r.personal.email,
    r.personal.linkedin,
    r.personal.github,
  ].filter(Boolean);

  if (!lines.length) return '';

  return `
    <section class="mt-4">
      <h2 class="text-[11px] uppercase tracking-wider font-semibold border-b border-white/30 pb-1">Contact</h2>
      <ul class="mt-2 space-y-1 text-[10px] text-slate-200 leading-4">
        ${lines.map((line) => `<li>${line}</li>`).join('')}
      </ul>
    </section>
  `;
}

function renderSidebarSkills(r) {
  const skills = (r.skills || [])
    .map((skill) => (typeof skill === 'string' ? skill : skill?.name || ''))
    .filter(Boolean);

  if (!skills.length) return '';

  return `
    <section class="mt-4">
      <h2 class="text-[11px] uppercase tracking-wider font-semibold border-b border-white/30 pb-1">Additional Skills</h2>
      <ul class="mt-2 space-y-1 text-[10px] text-slate-200 leading-4 list-disc ml-4">
        ${skills.map((skill) => `<li>${skill}</li>`).join('')}
      </ul>
    </section>
  `;
}

function renderSidebarExperience(r) {
  const entries = getFilledEntries(r.experience);
  if (!entries.length) return '';

  return `
    <section class="mb-4">
      ${renderSidebarSectionTitle('Work Experience')}
      ${entries
        .map((entry) => {
          const bullets = [entry.achievement1, entry.achievement2, entry.achievement3].filter(Boolean);

          return `
            <article class="mt-2 text-[11px] text-slate-700">
              <div class="flex justify-between gap-2 font-semibold">
                <span>${entry.jobTitle || ''} ${entry.company ? `| ${entry.company}` : ''}</span>
                <span class="text-slate-500 whitespace-nowrap">${entry.startDate || ''}${entry.endDate ? ` to ${entry.endDate}` : ''}</span>
              </div>
              ${bullets.length ? `<ul class="list-disc ml-4 mt-1 space-y-0.5">${bullets.map((item) => `<li>${item}</li>`).join('')}</ul>` : ''}
            </article>
          `;
        })
        .join('')}
    </section>
  `;
}

function renderSidebarEducation(r) {
  const entries = getFilledEntries(r.education);
  if (!entries.length) return '';

  return `
    <section class="mb-4">
      ${renderSidebarSectionTitle('Education')}
      ${entries
        .map(
          (entry) => `
        <article class="mt-2 text-[11px] text-slate-700">
          <div class="flex justify-between gap-2 font-semibold">
            <span>${entry.degree || ''}${entry.institution ? ` | ${entry.institution}` : ''}</span>
            <span class="text-slate-500 whitespace-nowrap">${entry.graduationDate || ''}</span>
          </div>
          ${entry.courseworkHonors ? `<p class="mt-1 text-slate-600">${entry.courseworkHonors}</p>` : ''}
        </article>`
        )
        .join('')}
    </section>
  `;
}

function renderSidebarProjects(r) {
  const entries = getFilledEntries(r.projects);
  if (!entries.length) return '';

  return `
    <section class="mb-4">
      ${renderSidebarSectionTitle('Projects')}
      ${entries
        .map(
          (entry) => `
        <article class="mt-2 text-[11px] text-slate-700">
          <p class="font-semibold">${entry.title || ''}</p>
          ${entry.description ? `<p class="mt-1">${entry.description}</p>` : ''}
          ${entry.technologies ? `<p class="mt-1 text-slate-500">${Array.isArray(entry.technologies) ? entry.technologies.join(' • ') : entry.technologies}</p>` : ''}
          ${entry.link ? `<p class="mt-1 text-slate-500">${entry.link}</p>` : ''}
        </article>`
        )
        .join('')}
    </section>
  `;
}

function renderSidebarCertifications(r) {
  const entries = getFilledEntries(r.certifications);
  if (!entries.length) return '';

  return `
    <section class="mb-4">
      ${renderSidebarSectionTitle('Certifications')}
      ${entries
        .map(
          (entry) => `
        <article class="mt-2 text-[11px] text-slate-700">
          <p class="font-semibold">${entry.title || ''}</p>
          <p class="text-slate-500">${entry.issuer || ''}${entry.date ? `, ${entry.date}` : ''}</p>
        </article>`
        )
        .join('')}
    </section>
  `;
}

function renderSidebarAwards(r) {
  const entries = getFilledEntries(r.awards);
  if (!entries.length) return '';

  return `
    <section class="mb-4">
      ${renderSidebarSectionTitle('Awards & Achievements')}
      <ul class="mt-2 list-disc ml-4 text-[11px] text-slate-700 space-y-0.5">
        ${entries.map((entry) => `<li>${entry.title || ''}${entry.date ? ` (${entry.date})` : ''}</li>`).join('')}
      </ul>
    </section>
  `;
}

function renderSidebarPublications(r) {
  const entries = getFilledEntries(r.publications);
  if (!entries.length) return '';

  return `
    <section class="mb-4">
      ${renderSidebarSectionTitle('Publications / Research')}
      <ul class="mt-2 list-disc ml-4 text-[11px] text-slate-700 space-y-0.5">
        ${entries.map((entry) => `<li>${entry.title || ''}${entry.venue ? `, ${entry.venue}` : ''}${entry.year ? ` (${entry.year})` : ''}</li>`).join('')}
      </ul>
    </section>
  `;
}

function renderSidebarReferences(r) {
  const entries = getFilledEntries(r.references);
  if (!entries.length) return '';

  return `
    <section class="mb-2">
      ${renderSidebarSectionTitle('References')}
      ${entries
        .map(
          (entry) => `
        <article class="mt-2 text-[11px] text-slate-700">
          <p class="font-semibold">${entry.name || ''}</p>
          <p class="text-slate-500">${entry.relationship || ''}${entry.contact ? ` • ${entry.contact}` : ''}</p>
        </article>`
        )
        .join('')}
    </section>
  `;
}

function renderSummaryInline(r) {
  if (!r.summary) return '';
  return `
    <section class="mb-2">
      <h2 class="text-[11px] font-semibold uppercase tracking-wide" style="color: var(--resume-accent);">Professional Summary</h2>
      <p class="text-[11px] text-slate-700 mt-1">${r.summary}</p>
    </section>
  `;
}

function renderExperience(r) {
  const entries = (r.experience || []).filter((e) =>
    Object.values(e || {}).some((value) => String(value || '').trim().length > 0)
  );

  if (!entries.length) return '';
  return `
    <section class="mb-2">
      <h2 class="text-[11px] font-semibold uppercase tracking-wide" style="color: var(--resume-accent);">Experience</h2>
      ${entries
        .map(
          (e) => {
            const highlights = [e.achievement1, e.achievement2, e.achievement3].filter(Boolean);

            return `
        <article class="mt-1">
          <div class="flex justify-between text-[11px] font-semibold">
            <span>${e.jobTitle || e.role || ''} – ${e.company || e.organization || ''}</span>
            <span class="text-slate-500">${e.startDate || ''} – ${e.endDate || 'Present'}</span>
          </div>
          <ul class="list-disc ml-4 text-[11px] text-slate-700">
            ${highlights.map((r) => `<li>${r}</li>`).join('')}
          </ul>
        </article>`;
          }
        )
        .join('')}
    </section>
  `;
}

function renderEducation(r) {
  const entries = (r.education || []).filter((e) =>
    Object.values(e || {}).some((value) => String(value || '').trim().length > 0)
  );

  if (!entries.length) return '';
  return `
    <section class="mb-2">
      <h2 class="text-[11px] font-semibold uppercase tracking-wide" style="color: var(--resume-accent);">Education</h2>
      ${entries
        .map(
          (e) => `
        <article class="mt-1 text-[11px] text-slate-700">
          <div class="flex justify-between font-semibold">
            <span>${e.degree || ''}${e.institution ? `, ${e.institution}` : ''}</span>
            <span class="text-slate-500">${e.graduationDate || e.startDate || ''}</span>
          </div>
          <p>${e.courseworkHonors || e.field || ''}</p>
        </article>`
        )
        .join('')}
    </section>
  `;
}

function renderSkills(r) {
  const entries = (r.skills || []).filter((skill) =>
    String((typeof skill === 'string' ? skill : skill?.name) || '').trim().length > 0
  );

  if (!entries.length) return '';

  const technicalSkills = entries
    .filter((skill) => (skill.kind || 'technical') === 'technical')
    .map((skill) => (typeof skill === 'string' ? skill : skill?.name || ''))
    .filter(Boolean);

  const softSkills = entries
    .filter((skill) => (skill.kind || 'technical') === 'soft')
    .map((skill) => (typeof skill === 'string' ? skill : skill?.name || ''))
    .filter(Boolean);

  if (!technicalSkills.length && !softSkills.length) return '';

  return `
    <section class="mb-2">
      <h2 class="text-[11px] font-semibold uppercase tracking-wide" style="color: var(--resume-accent);">Skills</h2>
      ${technicalSkills.length ? `<p class="text-[11px] text-slate-700 mt-1"><span class="font-semibold">Technical:</span> ${technicalSkills.join(' • ')}</p>` : ''}
      ${softSkills.length ? `<p class="text-[11px] text-slate-700 mt-1"><span class="font-semibold">Soft:</span> ${softSkills.join(' • ')}</p>` : ''}
    </section>
  `;
}

function renderProjects(r) {
  const entries = (r.projects || []).filter((p) =>
    Object.values(p || {}).some((value) => String(value || '').trim().length > 0)
  );

  if (!entries.length) return '';
  return `
    <section class="mb-2">
      <h2 class="text-[11px] font-semibold uppercase tracking-wide" style="color: var(--resume-accent);">Projects</h2>
      ${entries
        .map(
          (p) => `
        <article class="mt-1 text-[11px] text-slate-700">
          <p class="font-semibold">${p.title || p.name || ''}</p>
          ${p.description || p.impact ? `<p>${p.description || p.impact}</p>` : ''}
          ${p.technologies ? `<p class="text-slate-500">${Array.isArray(p.technologies) ? p.technologies.join(' • ') : p.technologies}</p>` : ''}
          ${p.link ? `<p class="text-slate-500">${p.link}</p>` : ''}
        </article>`
        )
        .join('')}
    </section>
  `;
}

function renderCerts(r) {
  const entries = (r.certifications || []).filter((cert) =>
    Object.values(cert || {}).some((value) => String(value || '').trim().length > 0)
  );

  if (!entries.length) return '';
  return `
    <section class="mb-2">
      <h2 class="text-[11px] font-semibold uppercase tracking-wide" style="color: var(--resume-accent);">Certifications</h2>
      ${entries
        .map(
          (c) => `
        <article class="mt-1 text-[11px] text-slate-700">
          <p class="font-semibold">${c.title || c.name || ''}</p>
          <p>${c.issuer || ''}${c.date ? ` • ${c.date}` : ''}</p>
        </article>`
        )
        .join('')}
    </section>
  `;
}

function renderAwards(r) {
  const entries = (r.awards || []).filter((award) =>
    Object.values(award || {}).some((value) => String(value || '').trim().length > 0)
  );

  if (!entries.length) return '';
  return `
    <section class="mb-2">
      <h2 class="text-[11px] font-semibold uppercase tracking-wide" style="color: var(--resume-accent);">Awards & Achievements</h2>
      <ul class="list-disc ml-4 text-[11px] text-slate-700 mt-1">
        ${entries.map((award) => `<li>${award.title || award}</li>`).join('')}
      </ul>
    </section>
  `;
}

function renderPublications(r) {
  const entries = (r.publications || []).filter((publication) =>
    Object.values(publication || {}).some((value) => String(value || '').trim().length > 0)
  );

  if (!entries.length) return '';
  return `
    <section class="mb-2">
      <h2 class="text-[11px] font-semibold uppercase tracking-wide" style="color: var(--resume-accent);">Publications / Research</h2>
      <ul class="list-disc ml-4 text-[11px] text-slate-700 mt-1">
        ${entries.map((publication) => `<li>${publication.title || publication}</li>`).join('')}
      </ul>
    </section>
  `;
}

function renderReferences(r) {
  const entries = (r.references || []).filter((reference) =>
    Object.values(reference || {}).some((value) => String(value || '').trim().length > 0)
  );

  if (!entries.length) return '';
  return `
    <section class="mb-2">
      <h2 class="text-[11px] font-semibold uppercase tracking-wide" style="color: var(--resume-accent);">References</h2>
      ${entries
        .map(
          (reference) => `
        <article class="mt-1 text-[11px] text-slate-700">
          <p class="font-semibold">${reference.name || ''}</p>
          <p>${reference.relationship || ''}${reference.contact ? ` • ${reference.contact}` : ''}</p>
          ${reference.note ? `<p class="text-slate-500">${reference.note}</p>` : ''}
        </article>`
        )
        .join('')}
    </section>
  `;
}
