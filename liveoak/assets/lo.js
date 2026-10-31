/* Live Oak Reserve, shared behavior */
const LO = {
  COLLECTION: 'The Limestone Collection',
  API: 'https://script.google.com/macros/s/AKfycbxWJd7NmOrIyq-S0waYoBIN2ErTHaN__AOFV02-Gr8dt4NRdHrkXwfuYVES9PQ0pThK/exec',
  ACCESS_CODE: 'liveoak',
  KEY: 'liveoak-access'
};

/* ---- gate (stays on until Texas licensing is active) ---- */
function loOpen() { document.body.classList.remove('locked'); document.body.classList.add('open'); }
function loUnlock(e) {
  e.preventDefault();
  if (document.getElementById('code').value.trim().toLowerCase() === LO.ACCESS_CODE) { try { sessionStorage.setItem(LO.KEY, '1'); } catch (_) {} loOpen(); }
  else document.getElementById('err').textContent = 'That code did not match.';
  return false;
}
try { if (sessionStorage.getItem(LO.KEY) === '1') loOpen(); } catch (_) {}

/* ---- header, dropdown, drawer ---- */
const loBar = document.getElementById('bar');
if (loBar && !document.body.classList.contains('plain')) {
  const t = () => loBar.classList.toggle('solid', scrollY > innerHeight * 0.55);
  addEventListener('scroll', t, { passive: true }); t();
}
document.querySelectorAll('.dd > button').forEach(b => b.addEventListener('click', e => { e.stopPropagation(); b.parentElement.classList.toggle('open'); }));
document.addEventListener('click', () => document.querySelectorAll('.dd.open').forEach(d => d.classList.remove('open')));
function loDrawer(o) { document.getElementById('drawer').classList.toggle('open', o); }
addEventListener('keydown', e => { if (e.key === 'Escape') loDrawer(false); });

/* ---- names, year ---- */
document.querySelectorAll('.js-cname').forEach(e => e.textContent = LO.COLLECTION);
document.querySelectorAll('.js-yr').forEach(e => e.textContent = new Date().getFullYear());

/* ---- reveal ---- */
const loIO = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); loIO.unobserve(x.target); } }), { threshold: .12 });
function loReveal(root) { (root || document).querySelectorAll('.reveal:not(.in)').forEach(el => loIO.observe(el)); }
loReveal();

/* ---- rotating principles (home) ---- */
(function () {
  const rot = document.getElementById('rot'), dots = document.getElementById('dots'); if (!rot) return;
  const LINES = [
    ['From groundbreaking to housewarming. We find the land, guide the build and sell the home, so the people who hire us deal with one team from the first walk of the lot to the last key.', 'The Live Oak approach'],
    ['We pick up the phone day or night. When a deal stalls nobody gets paid, so we keep it moving: the city, the zoning, the lender, everyone.', 'Boots on the ground'],
    ['Every builder\'s buy box stays private, and we never bring a lot far outside someone\'s number. Relationships are the whole business.', 'Discretion'],
    ['Proven in Nashville, now in Austin. The same two-partner team, bringing a model that works to the Texas Hill Country.', 'Where we come from']
  ];
  let ri = 0, rt;
  LINES.forEach((_, i) => { const b = document.createElement('button'); b.setAttribute('aria-label', 'Show ' + (i + 1)); b.onclick = () => show(i, true); dots.appendChild(b); });
  function show(i, user) {
    ri = i; rot.style.opacity = 0;
    setTimeout(() => { rot.querySelector('.q').textContent = LINES[i][0]; rot.querySelector('.who').textContent = LINES[i][1]; rot.style.opacity = 1; }, 450);
    [...dots.children].forEach((d, k) => d.classList.toggle('on', k === i));
    if (user) { clearInterval(rt); rt = setInterval(() => show((ri + 1) % LINES.length), 8000); }
  }
  show(0); rt = setInterval(() => show((ri + 1) % LINES.length), 8000);
})();

/* ---- forms: every form feeds the Live Oak back office ---- */
async function loSend(payload) {
  await fetch(LO.API, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) });
  return true;
}
function loForm(form, build, okText) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const hp = form.elements.namedItem('website'); if (hp && hp.value) return;
    const b = form.querySelector('button[type=submit]'), n = form.querySelector('.js-note') || form.parentElement.querySelector('.js-note');
    const label = b.textContent; b.disabled = true; b.textContent = 'Sending';
    loSend(build(form)).then(() => { form.reset(); b.textContent = 'Received'; if (n) n.textContent = okText; })
      .catch(() => { b.disabled = false; b.textContent = label; if (n) n.textContent = 'Something went wrong. Email gabe@victoryformationventures.com.'; });
  });
}
const v = (f, k) => { const el = f.elements.namedItem(k); return (el && el.value) || ''; };
document.querySelectorAll('form.js-collection').forEach(f => loForm(f, f => ({ action: 'member', email: v(f, 'email'), source: 'liveoak-' + (document.body.dataset.page || 'site') }), 'Thank you. Every request is reviewed personally.'));
document.querySelectorAll('form.js-lead').forEach(f => loForm(f, f => ({
  action: 'lead', name: v(f, 'name'), email: v(f, 'email'), phone: v(f, 'phone'),
  interest: v(f, 'interest') || v(f, 'topic'), area: v(f, 'area'), timeline: v(f, 'timeline'), budget: v(f, 'budget'),
  message: (f.dataset.ref ? '[' + f.dataset.ref + '] ' : '') + v(f, 'message') + (f.elements.namedItem('sms_consent') && f.elements.namedItem('sms_consent').checked ? ' (OK to text)' : ''),
  source: 'liveoak-' + (f.dataset.source || document.body.dataset.page || 'site')
}), 'Thank you. A member of the team will reach out personally.'));
