// ===== CAREERS PAGE =====

function renderCareersPage() {
  const jobs = window.careersData || [];
  const grid = document.getElementById('careersGrid');
  const empty = document.getElementById('careersEmpty');
  const detail = document.getElementById('careersDetail');
  if (!grid) return;

  // Reset to list view
  detail.style.display = 'none';
  grid.style.display = '';
  empty.style.display = '';

  if (jobs.length === 0) {
    grid.style.display = 'none';
    empty.style.display = '';
    return;
  }
  empty.style.display = 'none';
  grid.innerHTML = jobs.map((job, i) => _renderJobCard(job, i)).join('');
}

function _renderJobCard(job, i) {
  const typeLabel = { 'full-time': 'Пълен ден', 'part-time': 'Непълен ден', 'contract': 'Договор' }[job.type] || job.type || '';
  const badgeHtml = job.badge ? `<span class="career-card-badge ${job.badge}">${job.badge}</span>` : '';
  const daysAgo = job.posted ? _daysAgo(job.posted) : '';
  return `
    <div class="career-card" onclick="openCareersDetail(${i})" role="button" tabindex="0"
         onkeydown="if(event.key==='Enter')openCareersDetail(${i})">
      <div class="career-card-header">
        <h3 class="career-card-title">${_esc(job.title)}</h3>
        ${badgeHtml}
      </div>
      ${job.department ? `<div class="career-card-dept">${_esc(job.department)}</div>` : ''}
      <div class="career-card-meta">
        ${job.location ? `<span>📍 ${_esc(job.location)}</span>` : ''}
        ${typeLabel ? `<span>⏱ ${typeLabel}</span>` : ''}
        ${job.salary ? `<span>💶 ${_esc(job.salary)}</span>` : ''}
        ${job.experience ? `<span>🎓 ${_esc(job.experience)}</span>` : ''}
      </div>
      ${job.description ? `<p class="career-card-excerpt">${_esc(job.description.replace(/<[^>]+>/g,''))}</p>` : ''}
      <div class="career-card-footer">
        <span class="career-card-posted">${daysAgo}</span>
        <button type="button" class="career-card-cta">Виж обявата →</button>
      </div>
    </div>`;
}

function openCareersDetail(i) {
  const jobs = window.careersData || [];
  const job = jobs[i];
  if (!job) return;

  const grid = document.getElementById('careersGrid');
  const empty = document.getElementById('careersEmpty');
  const detail = document.getElementById('careersDetail');
  const content = document.getElementById('careersDetailContent');
  const applySuccess = document.getElementById('careersApplySuccess');
  const applyForm = document.getElementById('careersApplyForm');

  grid.style.display = 'none';
  empty.style.display = 'none';
  detail.style.display = '';

  const typeLabel = { 'full-time': 'Пълен работен ден', 'part-time': 'Непълен работен ден', 'contract': 'Граждански договор' }[job.type] || job.type || '';
  const deadline = job.deadline ? `Кандидатствай до ${job.deadline}` : '';

  content.innerHTML = `
    <h2 class="careers-detail-title">${_esc(job.title)}</h2>
    <div class="careers-detail-badges">
      ${job.department ? `<span class="career-badge">🏢 ${_esc(job.department)}</span>` : ''}
      ${job.location ? `<span class="career-badge">📍 ${_esc(job.location)}</span>` : ''}
      ${typeLabel ? `<span class="career-badge">⏱ ${typeLabel}</span>` : ''}
      ${job.salary ? `<span class="career-badge">💶 ${_esc(job.salary)}</span>` : ''}
      ${job.experience ? `<span class="career-badge">🎓 ${_esc(job.experience)}</span>` : ''}
      ${deadline ? `<span class="career-badge" style="color:#fbbf24;">📅 ${_esc(deadline)}</span>` : ''}
    </div>
    ${job.description ? `
      <div class="careers-detail-section">
        <h3>За позицията</h3>
        <p>${job.description}</p>
      </div>` : ''}
    ${job.requirements && job.requirements.length ? `
      <div class="careers-detail-section">
        <h3>Изисквания</h3>
        <ul>${job.requirements.map(r => `<li>${_esc(r)}</li>`).join('')}</ul>
      </div>` : ''}
    ${job.benefits && job.benefits.length ? `
      <div class="careers-detail-section">
        <h3>Предимства</h3>
        <ul>${job.benefits.map(b => `<li>✓ ${_esc(b)}</li>`).join('')}</ul>
      </div>` : ''}
  `;

  // Pre-fill hidden fields
  document.getElementById('caJobId').value = job.id || '';
  document.getElementById('caJobTitle').value = job.title || '';

  // Reset form state
  applyForm.style.display = '';
  applyForm.reset();
  applySuccess.style.display = 'none';
  document.getElementById('careersApplyError').style.display = 'none';
  document.getElementById('caFileName').textContent = 'Избери файл (PDF, DOC, DOCX - до 5 MB)';
  document.getElementById('caFileLabel').classList.remove('has-file');
  document.getElementById('careersSubmitBtn').disabled = false;
  document.getElementById('careersSubmitLabel').style.display = '';
  document.getElementById('careersSubmitSpinner').style.display = 'none';

  detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function closeCareersDetail() {
  renderCareersPage();
  document.getElementById('careersGrid')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function handleCvFileChange(input) {
  const label = document.getElementById('caFileLabel');
  const nameEl = document.getElementById('caFileName');
  if (input.files && input.files[0]) {
    const f = input.files[0];
    if (f.size > 5 * 1024 * 1024) {
      nameEl.textContent = 'Файлът е твърде голям (макс. 5 MB)';
      label.classList.remove('has-file');
      input.value = '';
      return;
    }
    nameEl.textContent = f.name;
    label.classList.add('has-file');
  } else {
    nameEl.textContent = 'Избери файл (PDF, DOC, DOCX - до 5 MB)';
    label.classList.remove('has-file');
  }
}

async function submitCareerApplication(e) {
  e.preventDefault();

  const name = document.getElementById('caName').value.trim();
  const email = document.getElementById('caEmail').value.trim();
  const phone = document.getElementById('caPhone').value.trim();
  const letter = document.getElementById('caLetter').value.trim();
  const file = document.getElementById('caFile').files[0];
  const jobId = document.getElementById('caJobId').value;
  const jobTitle = document.getElementById('caJobTitle').value;
  const errEl = document.getElementById('careersApplyError');

  // Validate
  let err = '';
  if (!name) err = 'Въведи имена.';
  else if (!email || !email.includes('@')) err = 'Въведи валиден имейл.';
  else if (!file) err = 'Прикачи CV файл.';

  if (err) {
    errEl.textContent = err;
    errEl.style.display = '';
    return;
  }
  errEl.style.display = 'none';

  const submitBtn = document.getElementById('careersSubmitBtn');
  const submitLabel = document.getElementById('careersSubmitLabel');
  const submitSpinner = document.getElementById('careersSubmitSpinner');
  submitBtn.disabled = true;
  submitLabel.style.display = 'none';
  submitSpinner.style.display = '';

  try {
    let cvUrl = null;

    // Upload CV to Supabase Storage
    const sb = window._sb_client;
    if (sb) {
      const ext = file.name.split('.').pop();
      const path = `cvs/${jobId}/${Date.now()}_${name.replace(/\s+/g,'-')}.${ext}`;
      const { data: upData, error: upErr } = await sb.storage
        .from('careers-cvs')
        .upload(path, file, { cacheControl: '3600', upsert: false });
      if (upErr) throw new Error('Upload грешка: ' + upErr.message);

      const { data: urlData } = sb.storage.from('careers-cvs').getPublicUrl(upData.path);
      cvUrl = urlData?.publicUrl || null;

        // Save application record
      await sb.from('career_applications').insert({
        job_id: jobId,
        job_title: jobTitle,
        applicant_name: name,
        applicant_email: email,
        applicant_phone: phone || null,
        cover_letter: letter || null,
        cv_url: cvUrl,
      });

      // HR + applicant email notification (fire-and-forget, non-blocking)
      fetch('https://zdwzccucqfvlsgxlspby.supabase.co/functions/v1/send-career-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': (typeof SUPABASE_KEY !== 'undefined' ? SUPABASE_KEY : ''),
        },
        body: JSON.stringify({
          job_id: jobId, job_title: jobTitle,
          applicant_name: name, applicant_email: email,
          applicant_phone: phone || null,
          cover_letter: letter || null,
          cv_url: cvUrl,
        }),
      }).catch(() => {});
    }

    // Show success
    document.getElementById('careersApplyForm').style.display = 'none';
    document.getElementById('careersApplySuccess').style.display = '';

    if (typeof showToast === 'function') showToast('Кандидатурата е изпратена успешно!');

  } catch (err) {
    submitBtn.disabled = false;
    submitLabel.style.display = '';
    submitSpinner.style.display = 'none';
    errEl.textContent = 'Грешка при изпращане: ' + (err.message || 'опитай отново');
    errEl.style.display = '';
  }
}

function _esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function _daysAgo(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - d) / 86400000);
  if (diff === 0) return 'Днес';
  if (diff === 1) return 'Вчера';
  if (diff < 7) return `Преди ${diff} дни`;
  if (diff < 30) return `Преди ${Math.floor(diff/7)} седм.`;
  return `Преди ${Math.floor(diff/30)} мес.`;
}
