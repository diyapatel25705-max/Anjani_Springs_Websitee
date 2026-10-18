/* Anjani Spring Co. — Quote modal + WhatsApp dock + guided chat assistant
   All enquiries are e-mailed to EMAIL via FormSubmit (no server needed). */
(function () {
  'use strict';
  var EMAIL = 'anjanispring2012@gmail.com';
  var WA = '919427333380';
  var ENDPOINT = 'https://formsubmit.co/ajax/' + EMAIL;
  var TYPES = ['Compression Springs', 'Tension Springs', 'Torsion Springs', 'Conical Springs', 'Variable Springs', 'Custom Springs', 'Not sure / Other'];
  var WA_ICON = '<svg viewBox="0 0 24 24"><path d="M12.04 2a9.9 9.9 0 0 0-8.4 15.1L2 22l5-1.6A9.9 9.9 0 1 0 12.04 2zm5.8 14.1c-.25.7-1.45 1.35-2 1.4-.5.05-1.15.07-1.85-.12-.43-.13-.98-.31-1.68-.62-2.95-1.27-4.88-4.25-5.03-4.45-.15-.2-1.2-1.6-1.2-3.05s.76-2.16 1.03-2.46c.27-.3.6-.37.8-.37h.57c.18 0 .43-.07.67.52.25.6.85 2.07.92 2.22.07.15.12.32.02.52-.1.2-.15.32-.3.5-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.3.77 1.27 1.65 2.05 1.13 1 2.09 1.32 2.39 1.47.3.15.47.12.65-.07.17-.2.75-.87.95-1.17.2-.3.4-.25.67-.15.27.1 1.73.82 2.03.97.3.15.5.22.57.35.07.12.07.72-.18 1.4z"/></svg>';

  function $(s, r) { return (r || document).querySelector(s); }
  function mk(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(t) { var d = document.createElement('div'); d.textContent = t; return d.innerHTML; }
  function nowIST() { try { return new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST'; } catch (e) { return new Date().toString(); } }
  function digits(s) { return String(s || '').replace(/\D/g, ''); }
  function validPhone(s) { var d = digits(s); return d.length >= 10 && d.length <= 13; }
  function validEmail(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s); }

  function summary(d) {
    return ['Hello Anjani Spring Co., I would like a quotation.', '',
      'Name: ' + d.name, d.company ? 'Company: ' + d.company : null, 'Phone: ' + d.phone, d.email ? 'Email: ' + d.email : null,
      'Spring type: ' + (d.spring || '-'), d.quantity ? 'Quantity: ' + d.quantity : null, d.details ? 'Requirement: ' + d.details : null]
      .filter(function (x) { return x !== null; }).join('\n');
  }
  function waLink(text) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(text); }
  function mailLink(d) { return 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Spring enquiry - ' + (d.spring || '') + ' - ' + d.name) + '&body=' + encodeURIComponent(summary(d)); }

  /* ---- send lead to e-mail ---- */
  function sendLead(d, source) {
    var payload = {
      _subject: 'New enquiry: ' + (d.spring || 'Spring') + ' - ' + d.name + ' (' + d.phone + ')',
      _template: 'table', _captcha: 'false',
      Name: d.name, Phone: d.phone, Email: d.email || 'Not provided', Company: d.company || 'Not provided',
      'Spring type': d.spring || 'Not provided', Quantity: d.quantity || 'Not provided',
      'Requirement / Application': d.details || 'Not provided',
      Source: source, Page: location.href, 'Received at': nowIST()
    };
    if (d.email) payload._replyto = d.email;
    return fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(payload) })
      .then(function (r) {
        return r.text().then(function (t) {
          var j = {}; try { j = JSON.parse(t); } catch (e) {}
          var failed = !r.ok || j.success === 'false' || j.success === false;
          if (failed) {
            var why = (j.message || t || ('HTTP ' + r.status)).toString().replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 220);
            var err = new Error(why); err.status = r.status; throw err;
          }
          return j;
        });
      })
      .catch(function (err) {
        var msg = err && err.message ? err.message : 'network error';
        if (/failed to fetch|networkerror|load failed/i.test(msg)) msg = 'Network blocked / offline (' + msg + ')';
        console.error('[Anjani enquiry] send failed:', msg);
        lastError = msg; throw err;
      });
  }
  var lastError = '';

  /* ================= QUOTE MODAL ================= */
  var modal = mk('div', 'qm');
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML =
    '<div class="qm-bd" data-close></div>' +
    '<div class="qm-box" role="dialog" aria-modal="true" aria-labelledby="qm-t">' +
    '<button type="button" class="qm-x" data-close aria-label="Close">&times;</button>' +
    '<div class="qm-head"><span>Request a quote</span><h2 id="qm-t">Tell us what you need</h2><p>Share your requirement &mdash; our team will call you back with the best solution.</p></div>' +
    '<form class="qm-form" novalidate>' +
    '<div class="qm-f"><label>Your name <em>*</em></label><input name="name" autocomplete="name" placeholder="e.g. Rajesh Patel"><div class="qm-err"></div></div>' +
    '<div class="qm-f"><label>Phone / WhatsApp <em>*</em></label><input name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="e.g. 98765 43210"><div class="qm-err"></div></div>' +
    '<div class="qm-f"><label>Company</label><input name="company" autocomplete="organization" placeholder="Company name"></div>' +
    '<div class="qm-f"><label>Email</label><input name="email" type="email" autocomplete="email" placeholder="you@company.com"><div class="qm-err"></div></div>' +
    '<div class="qm-f"><label>Spring type <em>*</em></label><select name="spring"><option value="">Select spring type</option>' + TYPES.map(function (t) { return '<option>' + t + '</option>'; }).join('') + '</select><div class="qm-err"></div></div>' +
    '<div class="qm-f"><label>Estimated quantity</label><input name="quantity" placeholder="e.g. 5,000 pcs / month"></div>' +
    '<div class="qm-f full"><label>Requirement / application / specifications</label><textarea name="details" placeholder="Wire diameter, outer diameter, length, material, application, industry..."></textarea></div>' +
    '<input class="qm-hp" name="_honey" tabindex="-1" autocomplete="off" aria-hidden="true">' +
    '<div class="qm-warn" hidden></div>' +
    '<div class="qm-actions"><button class="qm-btn qm-pri" type="submit">Send Enquiry &rarr;</button></div>' +
    '<p class="qm-note">Have a drawing or sample? Send it on WhatsApp after submitting &mdash; we will pick it up from there.</p>' +
    '</form>' +
    '<div class="qm-ok" hidden><div class="qm-tick"><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></div>' +
    '<h3>Thank you! Enquiry received.</h3><p>Our team will call you shortly. For faster service you can also send the details (and your drawing / sample photo) on WhatsApp.</p>' +
    '<div class="qm-actions"><a class="qm-btn qm-wa" target="_blank" rel="noopener">' + WA_ICON + 'Continue on WhatsApp</a><button type="button" class="qm-btn" style="background:#eef3fc;color:#0a2a5e" data-close>Close</button></div></div>' +
    '</div>';
  var form = $('.qm-form', modal), okBox = $('.qm-ok', modal), warn = $('.qm-warn', modal), lastFocus = null;

  function setErr(name, msg) {
    var f = form.elements[name].closest('.qm-f'); f.classList.toggle('bad', !!msg);
    var e = $('.qm-err', f); if (e) e.textContent = msg || '';
  }
  function openModal(pref) {
    pref = pref || {};
    closeChat();
    lastFocus = document.activeElement;
    form.reset(); okBox.hidden = true; form.hidden = false; warn.hidden = true;
    ['name', 'phone', 'email', 'spring'].forEach(function (n) { setErr(n, ''); });
    if (pref.spring) form.elements.spring.value = pref.spring;
    if (pref.details) form.elements.details.value = pref.details;
    $('.qm-head', modal).style.display = '';
    modal.classList.add('on'); modal.setAttribute('aria-hidden', 'false'); document.body.classList.add('qm-lock');
    dock.style.display = 'none';
    setTimeout(function () { form.elements.name.focus({ preventScroll: true }); }, 120);
  }
  function closeModal() {
    modal.classList.remove('on'); modal.setAttribute('aria-hidden', 'true'); document.body.classList.remove('qm-lock');
    dock.style.display = '';
    if (lastFocus && lastFocus.focus) try { lastFocus.focus({ preventScroll: true }); } catch (e) {}
  }
  modal.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { if (modal.classList.contains('on')) closeModal(); else closeChat(); } });

  form.addEventListener('input', function (e) { var n = e.target && e.target.name; if (n && form.elements[n] && n.charAt(0) !== '_') { var f = e.target.closest('.qm-f'); if (f) { f.classList.remove('bad'); var er = $('.qm-err', f); if (er) er.textContent = ''; } } });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements, ok = true;
    var d = { name: f.name.value.trim(), phone: f.phone.value.trim(), company: f.company.value.trim(), email: f.email.value.trim(),
      spring: f.spring.value, quantity: f.quantity.value.trim(), details: f.details.value.trim() };
    setErr('name', d.name.length < 2 ? 'Please enter your name' : ''); if (d.name.length < 2) ok = false;
    var pv = validPhone(d.phone); setErr('phone', pv ? '' : 'Enter a valid phone number (10+ digits)'); if (!pv) ok = false;
    var ev = !d.email || validEmail(d.email); setErr('email', ev ? '' : 'Enter a valid email'); if (!ev) ok = false;
    setErr('spring', d.spring ? '' : 'Please choose a spring type'); if (!d.spring) ok = false;
    if (!ok) { var b = $('.bad input,.bad select', form); if (b) b.focus(); return; }
    if (f._honey.value) { return; } // bot
    var btn = $('.qm-pri', form), old = btn.innerHTML; btn.disabled = true; btn.textContent = 'Sending...'; warn.hidden = true;
    sendLead(d, 'Website quote form').then(function () {
      form.hidden = true; $('.qm-head', modal).style.display = 'none'; okBox.hidden = false;
      $('.qm-wa', okBox).href = waLink(summary(d));
      btn.disabled = false; btn.innerHTML = old;
    }).catch(function () {
      btn.disabled = false; btn.innerHTML = old;
      warn.hidden = false;
      warn.innerHTML = 'We could not send this automatically (see reason below). Please send it directly: <a href="' + waLink(summary(d)) + '" target="_blank" rel="noopener"><b>WhatsApp</b></a> or <a href="' + mailLink(d) + '"><b>Email</b></a>.<br><small style="opacity:.75">Reason: ' + esc(lastError) + '</small>';
    });
  });

  /* ================= DOCK (WhatsApp + Chat) ================= */
  var dock = mk('div', 'qd');
  dock.innerHTML =
    '<a class="qd-b qd-wa" href="' + waLink('Hello Anjani Spring Co., I would like to place an order / enquiry.') + '" target="_blank" rel="noopener" aria-label="Order on WhatsApp">' + WA_ICON + '<span class="qd-tip">Order on WhatsApp</span></a>' +
    '<button type="button" class="qd-b qd-chat" aria-label="Chat with us"><svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 0 1-11.7 7.1L4 20.5l1.5-4.6A8 8 0 1 1 21 12z"/><path d="M8.5 11.5h.01M12 11.5h.01M15.5 11.5h.01"/></svg><i class="qd-dot"></i><span class="qd-tip">Get a quick quote</span></button>';
  var chatBtn = $('.qd-chat', dock), hello = null;

  function showHello() {
    if (hello || chatEl.classList.contains('on') || modal.classList.contains('on')) return;
    hello = mk('div', 'qd-hello', '<b>Namaste! \uD83D\uDE4F</b> Need a spring quote? Chat with us &mdash; takes 1 minute.<button type="button" aria-label="Dismiss">&times;</button>');
    hello.addEventListener('click', function (e) { if (e.target.tagName === 'BUTTON') { hello.remove(); hello = null; return; } openChat(); });
    dock.appendChild(hello);
  }
  function hideHello() { if (hello) { hello.remove(); hello = null; } }

  /* ================= CHAT ASSISTANT ================= */
  var chatEl = mk('div', 'qc');
  chatEl.setAttribute('role', 'dialog'); chatEl.setAttribute('aria-label', 'Chat with Anjani Spring Co.');
  chatEl.innerHTML =
    '<div class="qc-h"><div class="qc-av"><svg viewBox="0 0 24 24"><path d="M7 5c3-1 7-1 10 0M7 10c3-1 7-1 10 0M7 15c3-1 7-1 10 0M7 20c3-1 7-1 10 0"/></svg></div>' +
    '<div class="qc-t"><b>Anjani Spring Assistant</b><small>Online &bull; replies instantly</small></div>' +
    '<a class="qc-hb" href="' + waLink('Hello Anjani Spring Co., I have an enquiry.') + '" target="_blank" rel="noopener" aria-label="WhatsApp">' + WA_ICON + '</a>' +
    '<button type="button" class="qc-hb" aria-label="Close chat">&times;</button></div>' +
    '<div class="qc-m" aria-live="polite"></div>' +
    '<form class="qc-f"><input autocomplete="off" placeholder="Type your answer..." aria-label="Your answer"><button type="submit" aria-label="Send"><svg viewBox="0 0 24 24"><path d="M3 11l18-8-8 18-2-8z"/></svg></button></form>';
  var msgs = $('.qc-m', chatEl), cform = $('.qc-f', chatEl), cinput = $('input', cform), csend = $('button', cform);
  var data = {}, step = 0, started = false, busy = false, chipsEl = null;

  var STEPS = [
    { key: 'name', q: 'Namaste! \uD83D\uDE4F Welcome to <b>Anjani Spring Co.</b> I will take your requirement in a minute so our team can call you back. <br><br>What is your <b>name</b>?', ph: 'Your name',
      check: function (v) { return v.length >= 2 ? '' : 'Please type your name.'; } },
    { key: 'phone', q: function () { return 'Nice to meet you, <b>' + esc(data.name) + '</b>! What is your <b>mobile / WhatsApp number</b>?'; }, ph: 'Mobile number', type: 'tel',
      check: function (v) { return validPhone(v) ? '' : 'That number does not look right. Please enter 10 digits.'; } },
    { key: 'spring', q: 'Which type of spring do you need?', chips: TYPES, ph: 'Or type here...',
      check: function (v) { return v ? '' : 'Please choose or type a spring type.'; } },
    { key: 'details', q: 'Please share a few details &mdash; size, quantity, material or application. (Type <b>skip</b> if you will share later.)', ph: 'e.g. 2000 pcs, 3 mm wire, for crusher', optional: true },
    { key: 'email', q: 'Last one &mdash; your <b>email</b> for the quotation? (optional, type <b>skip</b>)', ph: 'you@company.com', optional: true,
      check: function (v) { return !v || validEmail(v) ? '' : 'That email looks incorrect. Try again or type skip.'; } }
  ];

  function scrollDown() { msgs.scrollTop = msgs.scrollHeight; }
  function addMsg(html, who, raw) { var m = mk('div', 'qc-msg ' + who); if (raw) m.textContent = html; else m.innerHTML = html; msgs.appendChild(m); scrollDown(); return m; }
  function bot(html, cb) {
    busy = true; cinput.disabled = true; csend.disabled = true;
    var t = mk('div', 'qc-typing', '<i></i><i></i><i></i>'); msgs.appendChild(t); scrollDown();
    setTimeout(function () { t.remove(); addMsg(html, 'bot'); busy = false; if (cb) cb(); }, 650);
  }
  function enableInput(ph, type) { cinput.disabled = false; csend.disabled = false; cinput.placeholder = ph || 'Type your answer...'; cinput.type = type || 'text'; cinput.inputMode = type === 'tel' ? 'tel' : 'text'; setTimeout(function () { cinput.focus({ preventScroll: true }); }, 50); }
  function ask() {
    var s = STEPS[step]; if (!s) return finish();
    var q = typeof s.q === 'function' ? s.q() : s.q;
    bot(q, function () {
      if (s.chips) {
        chipsEl = mk('div', 'qc-chips');
        s.chips.forEach(function (c) { var b = mk('button', 'qc-chip'); b.type = 'button'; b.textContent = c; b.addEventListener('click', function () { answer(c); }); chipsEl.appendChild(b); });
        msgs.appendChild(chipsEl); scrollDown();
      }
      enableInput(s.ph, s.type);
    });
  }
  function answer(v) {
    if (busy) return;
    v = String(v).trim(); var s = STEPS[step]; if (!s) return;
    if (s.optional && /^(skip|no|na|n\/a|-)$/i.test(v)) v = '';
    else if (!v && !s.optional) { return; }
    var err = s.check ? s.check(v) : ''; if (err) { addMsg(v, 'me', true); cinput.value = ''; bot(err, function () { enableInput(s.ph, s.type); }); return; }
    if (chipsEl) { chipsEl.remove(); chipsEl = null; }
    addMsg(v || 'Skip', 'me', true); cinput.value = '';
    data[s.key] = v; step++; ask();
  }
  function finish() {
    cinput.disabled = true; csend.disabled = true; cinput.placeholder = 'Chat completed';
    var d = { name: data.name, phone: data.phone, email: data.email, spring: data.spring, details: data.details, company: '', quantity: '' };
    var t = mk('div', 'qc-typing', '<i></i><i></i><i></i>'); msgs.appendChild(t); scrollDown();
    sendLead(d, 'Website chat assistant').then(function () {
      t.remove();
      addMsg('\u2705 Thank you, <b>' + esc(d.name) + '</b>! Your enquiry is with our team &mdash; we will <b>call you on ' + esc(d.phone) + '</b> shortly.<br><br>Want a faster reply? Send your drawing or sample photo on WhatsApp.', 'bot');
      actions(d, false);
    }).catch(function () {
      t.remove();
      addMsg('Sorry, we could not submit automatically. Please send your details on WhatsApp &mdash; it opens with your details already filled in.<br><small style="opacity:.7">Reason: ' + esc(lastError) + '</small>', 'bot');
      actions(d, true);
    });
  }
  function actions(d, failed) {
    var a = mk('div', 'qc-act');
    a.innerHTML = '<a class="g" href="' + waLink(summary(d)) + '" target="_blank" rel="noopener">' + WA_ICON + 'Continue on WhatsApp</a>' +
      (failed ? '<a class="b" href="' + mailLink(d) + '">Send by Email</a>' : '<button type="button" class="b">Fill full quote form</button>');
    var btn = $('button', a); if (btn) btn.addEventListener('click', function () { openModal({ spring: d.spring, details: d.details }); });
    msgs.appendChild(a); scrollDown();
  }
  function startChat() { if (started) return; started = true; data = {}; step = 0; ask(); }
  function openChat() {
    hideHello(); chatEl.classList.add('on'); chatBtn.style.display = 'none';
    var dot = $('.qd-dot', dock); if (dot) dot.style.display = 'none';
    try { sessionStorage.setItem('qcSeen', '1'); } catch (e) {}
    startChat();
    if (!busy && !cinput.disabled) setTimeout(function () { cinput.focus({ preventScroll: true }); }, 100);
  }
  function closeChat() { chatEl.classList.remove('on'); chatBtn.style.display = ''; }
  cform.addEventListener('submit', function (e) { e.preventDefault(); answer(cinput.value); });
  chatEl.addEventListener('click', function (e) { var b = e.target.closest('button.qc-hb'); if (b) closeChat(); });
  chatBtn.addEventListener('click', openChat);

  /* ================= wire everything ================= */
  function init() {
    document.body.appendChild(modal); document.body.appendChild(dock); document.body.appendChild(chatEl);
    // open the quote form from every "Request a Quote / Send Your Requirement / Get Quote" button
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a'); if (!a) return;
      var href = a.getAttribute('href') || '';
      var txt = (a.textContent || '').toLowerCase();
      var isInd = a.classList.contains('ind-c');
      var isQuote = href === '#contact' && /quote|requirement/.test(txt);
      if (!isInd && !isQuote) return;
      e.preventDefault();
      var pref = {};
      if (isInd) { var h = a.querySelector('h3'); if (h) pref.details = 'Industry: ' + h.textContent + '\n'; }
      openModal(pref);
    });
    // proactive pop-up: greeting bubble, then chat opens once per visit
    var seen = false; try { seen = sessionStorage.getItem('qcSeen') === '1'; } catch (e) {}
    if (!seen) {
      setTimeout(showHello, 6000);
      setTimeout(function () { if (window.innerWidth > 820 && !modal.classList.contains('on') && !chatEl.classList.contains('on') && !seen) openChat(); }, 20000);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
