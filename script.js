/* ===== ARKACORE SCRIPT ===== */

/* Loader */
window.addEventListener('load', () => {
  const l = document.getElementById('loader');
  setTimeout(() => { l.style.opacity = '0'; setTimeout(() => l.style.display = 'none', 600); }, 1800);
});

/* Particles */
(function() {
  const c = document.getElementById('particles');
  if (!c) return;
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    p.style.animationDelay = Math.random() * 8 + 's';
    p.style.animationDuration = (6 + Math.random() * 6) + 's';
    p.style.width = p.style.height = (2 + Math.random() * 3) + 'px';
    c.appendChild(p);
  }
})();

/* Cursor Glow */
const glow = document.getElementById('cursorGlow');
if (glow && window.matchMedia('(pointer:fine)').matches) {
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
    glow.style.opacity = '1';
  });
}

/* Typing Effect */
const typingEl = document.getElementById('heroTyping');
if (typingEl) {
  const words = ['Without Borders.', 'At Global Scale.', 'In Record Time.', 'With Confidence.'];
  let wi = 0, ci = 0, deleting = false;
  function typeLoop() {
    const word = words[wi];
    if (!deleting) {
      typingEl.textContent = word.substring(0, ci + 1);
      ci++;
      if (ci === word.length) { deleting = true; setTimeout(typeLoop, 2000); return; }
      setTimeout(typeLoop, 80);
    } else {
      typingEl.textContent = word.substring(0, ci - 1);
      ci--;
      if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; setTimeout(typeLoop, 400); return; }
      setTimeout(typeLoop, 40);
    }
  }
  setTimeout(typeLoop, 1000);
}

/* Navbar */
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navCenter = document.getElementById('navCenter');
const navLinks = document.getElementById('navLinks');
const mobileOverlay = document.getElementById('mobileOverlay');
const progressBar = document.querySelector('.scroll-progress span');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navCenter.classList.toggle('mobile-active');
  mobileOverlay.classList.toggle('active');
  document.body.style.overflow = navCenter.classList.contains('mobile-active') ? 'hidden' : '';
});
const closeMenu = () => {
  navToggle.classList.remove('active');
  navCenter.classList.remove('mobile-active');
  mobileOverlay.classList.remove('active');
  document.body.style.overflow = '';
};
mobileOverlay.addEventListener('click', closeMenu);
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

let lastY = 0;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  const h = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.width = (y / h) * 100 + '%';
  navbar.classList.toggle('scrolled', y > 40);
  if (y > lastY && y > 120) navbar.classList.add('hide');
  else navbar.classList.remove('hide');
  lastY = y;
});

/* Active nav */
const sections = document.querySelectorAll('section[id]');
const navAs = navLinks.querySelectorAll('a');
window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(s => { if (scrollY >= s.offsetTop - 200) cur = s.id; });
  navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + cur));
});

/* Theme */
document.getElementById('themeToggle').addEventListener('click', function() {
  document.body.classList.toggle('light');
  this.textContent = document.body.classList.contains('light') ? '☀️' : '🌙';
});

/* Partner CTA */
document.getElementById('partnerBtn').addEventListener('click', () => {
  document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
});

/* Reveal */
const ro = new IntersectionObserver(e => {
  e.forEach(x => { if (x.isIntersecting) x.target.classList.add('active'); });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

/* Tilt cards */
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* Counters */
let cd = false;
const eo = t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
const animC = () => {
  if (cd) return; cd = true;
  document.querySelectorAll('.counter').forEach(c => {
    const tgt = +c.dataset.target, st = performance.now(), dur = 1800;
    const tick = now => {
      const p = Math.min((now - st) / dur, 1);
      c.textContent = Math.floor(eo(p) * tgt).toLocaleString() + '+';
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
};
const sb = document.querySelector('.stats-band');
if (sb) {
  const so = new IntersectionObserver(e => { if (e[0].isIntersecting) { animC(); so.disconnect(); } }, { threshold: 0.3 });
  so.observe(sb);
}

/* Region Tabs */
const rt = document.getElementById('regionTabs');
if (rt) rt.addEventListener('click', e => {
  const t = e.target.closest('.region-tab');
  if (!t) return;
  rt.querySelectorAll('.region-tab').forEach(x => x.classList.remove('active'));
  t.classList.add('active');
  document.querySelectorAll('.region-panel').forEach(p => p.classList.toggle('active', p.dataset.region === t.dataset.region));
});

/* Calculator */
const cs = { step: 1, region: null, roles: [], scale: null };
const cSteps = document.querySelectorAll('.calc-step');
const sDots = document.querySelectorAll('.step-dot');
const cBack = document.getElementById('calcBack');
const cNext = document.getElementById('calcNext');

function updCalc() {
  cSteps.forEach(s => s.classList.toggle('active', +s.dataset.step === cs.step));
  sDots.forEach(d => { const ds = +d.dataset.step; d.classList.toggle('active', ds === cs.step); d.classList.toggle('done', ds < cs.step); });
  cBack.disabled = cs.step === 1;
  cNext.textContent = cs.step === 3 ? 'View Result →' : cs.step === 4 ? 'Start Over' : 'Next →';
}

document.querySelectorAll('.option-grid').forEach(g => {
  g.addEventListener('click', e => {
    const b = e.target.closest('.option-btn');
    if (!b) return;
    const f = g.dataset.field, m = g.dataset.multi === 'true';
    if (m) { b.classList.toggle('selected'); cs[f] = [...g.querySelectorAll('.option-btn.selected')].map(x => x.dataset.value); }
    else { g.querySelectorAll('.option-btn').forEach(x => x.classList.remove('selected')); b.classList.add('selected'); cs[f] = b.dataset.value; }
  });
});

cNext.addEventListener('click', () => {
  if (cs.step === 4) { cs.step = 1; cs.region = null; cs.roles = []; cs.scale = null; document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected')); updCalc(); return; }
  if (cs.step === 3) buildRes();
  cs.step++; updCalc();
});
cBack.addEventListener('click', () => { if (cs.step > 1) { cs.step--; updCalc(); } });

function buildRes() {
  const m = { '1-5': ['Flex Squad', 'Agile pilot with dedicated recruiters and weekly syncs.'],
    '6-20': ['Growth Pod', 'Scalable team with embedded PM and monthly reviews.'],
    '21-50': ['Dedicated Center', 'Full offshore center with ops, QA, and 24/7 support.'],
    '50+': ['Enterprise Program', 'Multi-region program with C-level governance and SLAs.'] };
  const d = m[cs.scale] || m['1-5'];
  const rl = { us: '🇺🇸 US', emea: '🇪🇺 EMEA', apac: '🌏 APAC', latam: '🌎 LATAM' };
  const rn = { engineers: 'Engineers', marketers: 'Marketers', cs: 'Customer Success', data: 'Data', design: 'Design', ops: 'Operations' };
  const tags = [rl[cs.region] || 'Global', cs.scale || '1-5'].concat((cs.roles || []).map(r => rn[r] || r));
  document.getElementById('calcResult').innerHTML = `<div class="model-name">${d[0]}</div><p>${d[1]}</p><div class="result-tags">${tags.map(t => '<span>' + t + '</span>').join('')}</div>`;
}
updCalc();

/* Job Board */
const JOBS = [
  { title: 'Senior Full-Stack Engineer', type: 'Full-time', category: 'engineering', location: 'Remote — US', salary: '$140k–$180k' },
  { title: 'Staff Backend Engineer (Go)', type: 'Full-time', category: 'engineering', location: 'New York, NY', salary: '$160k–$210k' },
  { title: 'React Native Developer', type: 'Contract', category: 'engineering', location: 'Remote — LATAM', salary: '$80k–$110k' },
  { title: 'DevOps / SRE Engineer', type: 'Full-time', category: 'engineering', location: 'London, UK', salary: '£85k–£120k' },
  { title: 'Growth Marketing Manager', type: 'Full-time', category: 'marketing', location: 'Remote — US', salary: '$110k–$140k' },
  { title: 'SEO Content Strategist', type: 'Full-time', category: 'marketing', location: 'Remote — Global', salary: '$70k–$95k' },
  { title: 'Senior Product Designer', type: 'Full-time', category: 'design', location: 'San Francisco, CA', salary: '$130k–$170k' },
  { title: 'UX Researcher', type: 'Contract', category: 'design', location: 'Remote — EMEA', salary: '€65k–€90k' },
  { title: 'Data Engineer', type: 'Full-time', category: 'data', location: 'Bangalore, IN', salary: '₹25L–₹40L' },
  { title: 'ML Engineer', type: 'Full-time', category: 'data', location: 'Remote — US', salary: '$150k–$200k' },
  { title: 'People Operations Lead', type: 'Full-time', category: 'operations', location: 'Dubai, UAE', salary: 'AED 30k–45k/mo' },
  { title: 'Technical Recruiter', type: 'Full-time', category: 'operations', location: 'Remote — Global', salary: '$75k–$100k' },
];
const jl = document.getElementById('jobList');
const js = document.getElementById('jobSearch');
const jf = document.getElementById('jobFilters');
const nr = document.getElementById('noResults');
let af = 'all';

function renderJobs() {
  const q = js.value.toLowerCase().trim();
  jl.innerHTML = ''; let c = 0;
  JOBS.forEach(j => {
    if ((af === 'all' || j.category === af) && (!q || j.title.toLowerCase().includes(q) || j.location.toLowerCase().includes(q))) {
      c++;
      jl.innerHTML += `<div class="job-card"><div class="job-card-top"><h3>${j.title}</h3><span class="job-type">${j.type}</span></div><div class="job-meta"><span>📍 ${j.location}</span><span>💰 ${j.salary}</span></div></div>`;
    }
  });
  nr.style.display = c === 0 ? 'block' : 'none';
}
js.addEventListener('input', renderJobs);
jf.addEventListener('click', e => {
  const t = e.target.closest('.filter-tag');
  if (!t) return;
  jf.querySelectorAll('.filter-tag').forEach(x => x.classList.remove('active'));
  t.classList.add('active');
  af = t.dataset.filter;
  renderJobs();
});
renderJobs();

/* ===== CONTACT FORM → Google Sheets + Email ===== */
/*
  HOW IT WORKS:
  1. Form data is sent to a Google Apps Script web app URL
  2. The script appends data to a Google Sheet (like Excel)
  3. The script also sends an email with the data to harsh21tripathi@gmail.com
  
  SETUP INSTRUCTIONS:
  1. Go to https://script.google.com
  2. Create a new project, paste the Apps Script code below
  3. Deploy as Web App (anyone can access)
  4. Copy the URL and paste it as GOOGLE_SCRIPT_URL below
  
  Google Apps Script Code:
  -------------------------
  function doPost(e) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      new Date(),
      data.name,
      data.email,
      data.company,
      data.phone,
      data.service,
      data.message
    ]);
    MailApp.sendEmail({
      to: "harsh21tripathi@gmail.com",
      subject: "New Arkacore Contact: " + data.name,
      htmlBody: "<h2>New Contact Form Submission</h2>" +
        "<p><b>Name:</b> " + data.name + "</p>" +
        "<p><b>Email:</b> " + data.email + "</p>" +
        "<p><b>Company:</b> " + data.company + "</p>" +
        "<p><b>Phone:</b> " + data.phone + "</p>" +
        "<p><b>Service:</b> " + data.service + "</p>" +
        "<p><b>Message:</b> " + data.message + "</p>"
    });
    return ContentService.createTextOutput(JSON.stringify({status: "ok"})).setMimeType(ContentService.MimeType.JSON);
  }
  -------------------------
*/

// REPLACE THIS URL after deploying your Google Apps Script
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxTq7buruCD_8v7xK6XzR0MPu0jt6yWnxKtRGnHNbEMOEHE_qaTh36pWwEN_xmEeLBfpA/exec';

const contactForm = document.getElementById('contactForm');
const formBtn = document.getElementById('formSubmitBtn');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const data = {
    name: document.getElementById('cfName').value.trim(),
    email: document.getElementById('cfEmail').value.trim(),
    company: document.getElementById('cfCompany').value.trim(),
    phone: document.getElementById('cfPhone').value.trim(),
    service: document.getElementById('cfService').value,
    message: document.getElementById('cfMessage').value.trim(),
  };

  if (!data.name || !data.email || !data.message) {
    formStatus.textContent = '❌ Please fill all required fields.';
    formStatus.style.color = '#ef4444';
    return;
  }

  formBtn.classList.add('loading');
  formStatus.textContent = '';

  try {
    // Send to Google Sheets + Email
    if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }

    // Also try EmailJS as fallback (if configured)
    if (typeof emailjs !== 'undefined' && emailjs.send) {
      try {
        // CONFIGURE: Replace with your EmailJS service/template/public key
        // emailjs.init("YOUR_EMAILJS_PUBLIC_KEY");
        // await emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", data);
      } catch(ex) { /* EmailJS not configured, skip */ }
    }

    formBtn.classList.remove('loading');
    formBtn.classList.add('success');
    formBtn.querySelector('.btn-text').textContent = '✓ Sent Successfully!';
    formStatus.textContent = '✅ Your message has been sent. We\'ll respond within 24 hours.';
    formStatus.style.color = '#22c55e';
    contactForm.reset();

    setTimeout(() => {
      formBtn.classList.remove('success');
      formBtn.querySelector('.btn-text').textContent = 'Send Message';
    }, 3000);

  } catch (err) {
    formBtn.classList.remove('loading');
    formStatus.textContent = '❌ Something went wrong. Please try again.';
    formStatus.style.color = '#ef4444';
  }
});

/* ===== END ===== */
