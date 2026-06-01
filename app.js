/* ============================================================
   HAKAN ÜSTÜN — interactions
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Video catalogue (9 lessons) ---------- */
  const VIDEOS = [
    /* ─── İlk 6 (varsayılan görünür) ─── */
    {
      id: 'v1', cat: 'Reformer', lvl: 'Advanced',
      title: 'Advanced Reformer Flow', equip: 'Reformer', dur: '52 dk', price: 349, slot: 'vid-1',
      src: 'assets/vid-1.jpg',
      desc: 'Klasik repertuvar ile fonksiyonel geçişleri birleştiren, merkez gücüne odaklı ileri seviye akış.',
    },
    {
      id: 'v2', cat: 'Trapeze Table', lvl: 'Advanced',
      title: 'Cadillac Mastery', equip: 'Trapeze Table', dur: '64 dk', price: 399, slot: 'vid-2',
      src: 'assets/vid-2.jpg',
      desc: 'Spring yüklemesiyle omurga hareketliliği ve kontrollü asılı çalışma protokolleri.',
    },
    {
      id: 'v3', cat: 'Wunda Chair', lvl: 'Intermediate',
      title: 'Wunda Chair Power', equip: 'Wunda Chair', dur: '41 dk', price: 299, slot: 'vid-3',
      src: 'assets/vid-3.jpg',
      desc: 'Tek pedal direnciyle güç, denge ve stabilizasyonu sınayan yoğun bir oturum.',
    },
    {
      id: 'v4', cat: 'Mat', lvl: 'Intermediate',
      title: 'Clean Mat Series', equip: 'Mat', dur: '38 dk', price: 249, slot: 'vid-4',
      src: 'assets/vid-4.jpg',
      desc: 'Ekipmansız, pürüzsüz ve akıcı klasik mat dizilimi — her yerde uygulanabilir.',
    },
    {
      id: 'v5', cat: 'Ladder Barrel', lvl: 'Advanced',
      title: 'Ladder Barrel & Mobility', equip: 'Ladder Barrel', dur: '45 dk', price: 329, slot: 'vid-5',
      src: 'assets/vid-5.jpg',
      desc: 'Omurga ekstansiyonu, kalça açıcılar ve derin esneme üzerine çalışan hareketlilik seansı.',
    },
    {
      id: 'v6', cat: 'Reformer', lvl: 'Advanced',
      title: 'Reformer Choreography', equip: 'Reformer', dur: '58 dk', price: 379, slot: 'vid-6',
      src: 'assets/vid-6.jpg',
      desc: 'Geçişlerin akış halinde bağlandığı, koreografik kurguya sahip ileri seviye bir ders.',
    },
    /* ─── "Daha Fazlasını Gör" sonrası ─── */
    {
      id: 'v7', cat: 'Reformer', lvl: 'Beginner',
      title: 'Reformer Temelleri', equip: 'Reformer', dur: '35 dk', price: 199, slot: 'vid-7',
      src: 'assets/vid-7.jpg',
      desc: 'Reformer üzerinde temel pozisyonlar, yay kullanımı ve güvenli hareket prensipleri. Başlangıç seviyesi.',
    },
    {
      id: 'v8', cat: 'Mat', lvl: 'Advanced',
      title: 'Mat Flow · Advanced', equip: 'Mat', dur: '50 dk', price: 279, slot: 'vid-8',
      src: 'assets/vid-8.jpg',
      desc: 'Klasik mat repertuvarını kesintisiz akışa dönüştüren, güç ve esnekliği bir arada çalışan program.',
    },
    {
      id: 'v9', cat: 'Wunda Chair', lvl: 'Advanced',
      title: 'Chair & Barrel Combo', equip: 'Wunda Chair · Ladder Barrel', dur: '48 dk', price: 349, slot: 'vid-9',
      src: 'assets/vid-9.jpg',
      desc: 'Wunda Chair ve Ladder Barrel kombinasyonuyla güç ve esnekliği aynı seansta çalışan ileri protokol.',
    },
  ];

  const VISIBLE_INIT = 6;
  let shownCount     = 0;

  const fmt = n => new Intl.NumberFormat('tr-TR').format(n);

  /* ---------- XSS prevention ---------- */
  function sanitize(str) {
    const d = document.createElement('div');
    d.textContent = String(str ?? '');
    return d.innerHTML;
  }

  /* ---------- SVG icons ---------- */
  const ICON = {
    play:    '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
    clock:   '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    layers:  '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 3 3 8l9 5 9-5-9-5Z"/><path d="M3 13l9 5 9-5"/></svg>',
    arRight: '<svg class="ar" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h13M13 6l6 6-6 6"/></svg>',
    arDown:  '<svg class="ar" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 5v14M6 13l6 6 6-6"/></svg>',
    lock:    '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="5" y="11" width="14" height="9" rx="1.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
  };

  /* ---------- Build a single card element ---------- */
  function buildCard(v) {
    const article = document.createElement('article');
    article.className = 'vcard r';
    article.setAttribute('data-id', sanitize(v.id));

    article.innerHTML = `
      <div class="vthumb">
        <image-slot id="${sanitize(v.slot)}" shape="rect"
          placeholder="Ders görseli"
          src="${sanitize(v.src || '')}"></image-slot>
        <div class="vbadges">
          <span class="vbadge lvl">${sanitize(v.lvl)}</span>
          <span class="vbadge">${sanitize(v.equip)}</span>
        </div>
        <div class="vdur">${ICON.clock}${sanitize(v.dur)}</div>
        <div class="vplay"><span>${ICON.play}</span></div>
      </div>
      <div class="vbody">
        <div class="vcat">${sanitize(v.cat)}</div>
        <h3 class="vtitle">${sanitize(v.title)}</h3>
        <p class="vdesc">${sanitize(v.desc)}</p>
        <div class="vmeta">
          <span>${ICON.clock}${sanitize(v.dur)}</span>
          <span>${ICON.layers}${sanitize(v.lvl)}</span>
          <span>${ICON.lock}48 saat erişim</span>
        </div>
        <div class="vfoot">
          <div class="vprice">₺${fmt(v.price)}<small></small></div>
          <button class="vbuy" data-buy="${sanitize(v.id)}">
            Satın Al ${ICON.arRight}
          </button>
        </div>
      </div>`;

    article.querySelector('[data-buy]').addEventListener('click', e => {
      e.stopPropagation();
      showConfirm(v.id);
    });
    article.addEventListener('click', () => openModal(v.id));

    return article;
  }

  /* ---------- Append a batch of cards ---------- */
  function appendCards(videoSlice) {
    const g = document.getElementById('gallery');
    if (!g) return;
    videoSlice.forEach(v => {
      const card = buildCard(v);
      g.appendChild(card);
      io.observe(card);
    });
  }

  /* ---------- Render / refresh "Load more" button ---------- */
  function refreshMoreBtn() {
    const foot = document.getElementById('gallery-foot');
    if (!foot) return;

    const remaining = VIDEOS.length - shownCount;

    if (remaining <= 0) {
      foot.innerHTML = '';
      return;
    }

    foot.innerHTML = `
      <div class="gallery-more">
        <button class="btn btn-ghost" id="gallery-more-btn">
          Daha Fazlasını Gör
          ${ICON.arDown}
        </button>
        <span class="gallery-more-count">${remaining} ders daha</span>
      </div>`;

    document.getElementById('gallery-more-btn').addEventListener('click', () => {
      const btn = document.getElementById('gallery-more-btn');
      if (btn) { btn.disabled = true; btn.style.opacity = '.6'; btn.textContent = 'Yükleniyor…'; }

      const nextBatch = VIDEOS.slice(shownCount);
      appendCards(nextBatch);
      shownCount = VIDEOS.length;

      // Tiny delay so DOM paints before we clear the button
      requestAnimationFrame(() => refreshMoreBtn());
    });
  }

  /* ---------- Initial gallery render ---------- */
  function renderGallery() {
    const g = document.getElementById('gallery');
    if (!g) return;
    g.innerHTML = '';
    shownCount = 0;

    appendCards(VIDEOS.slice(0, VISIBLE_INIT));
    shownCount = Math.min(VISIBLE_INIT, VIDEOS.length);
    refreshMoreBtn();
  }

  /* ---------- Scroll reveal ---------- */
  const io = new IntersectionObserver(
    ents => ents.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }),
    { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
  );

  /* ---------- Nav scroll state ---------- */
  const nav   = document.querySelector('.nav');
  const toTop = document.querySelector('.to-top');
  let menuOpen = false;

  function onScroll() {
    const y = window.scrollY;
    nav.classList.toggle('scrolled', !menuOpen && y > window.innerHeight * 0.72);
    if (toTop) toTop.classList.toggle('show', y > window.innerHeight * 1.2);
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Stat count-up ---------- */
  function runCount(el) {
    const target = parseFloat(el.dataset.count);
    const dec    = el.dataset.dec ? parseInt(el.dataset.dec) : 0;
    const dur    = 1600;
    const t0     = performance.now();
    function step(t) {
      const p = Math.min(1, (t - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * e).toFixed(dec);
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(dec);
    }
    requestAnimationFrame(step);
  }

  const statIO = new IntersectionObserver(
    ents => ents.forEach(en => {
      if (en.isIntersecting) { runCount(en.target); statIO.unobserve(en.target); }
    }),
    { threshold: 0.6 }
  );

  /* ---------- FAQ accordion ---------- */
  function wireFaq() {
    document.querySelectorAll('.faq-item').forEach(item => {
      const q = item.querySelector('.faq-q');
      const a = item.querySelector('.faq-a');
      q.setAttribute('aria-expanded', 'false');
      q.addEventListener('click', () => {
        const open = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(o => {
          o.classList.remove('open');
          o.querySelector('.faq-a').style.maxHeight = '0';
          o.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        });
        if (!open) {
          item.classList.add('open');
          a.style.maxHeight = a.scrollHeight + 'px';
          q.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ---------- Focus trap ---------- */
  function getFocusable(el) {
    return [...el.querySelectorAll(
      'button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
    )];
  }

  /* ---------- Purchase modal ---------- */
  const veil  = document.getElementById('veil');
  const modal = document.getElementById('modal');
  let preFocusEl = null;

  function openModal(id) {
    const v = VIDEOS.find(x => x.id === id);
    if (!v) return;

    preFocusEl = document.activeElement;
    modal.classList.remove('done');

    modal.querySelector('[data-mm-cat]').textContent   = v.cat;
    modal.querySelector('[data-mm-title]').textContent = v.title;
    modal.querySelector('[data-mp-title]').textContent = v.title;
    modal.querySelector('[data-mp-sub]').textContent   = `${v.lvl} · ${v.equip} · ${v.dur}`;
    modal.querySelector('[data-mp-total]').textContent = '₺' + fmt(v.price);

    const ms = modal.querySelector('[data-mm-slot]');
    ms.innerHTML = `<image-slot id="modal-${sanitize(v.slot)}" shape="rect"
      placeholder="Ders görseli" src="${sanitize(v.src || '')}"></image-slot>`;

    veil.classList.add('show');
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    requestAnimationFrame(() => {
      const focusable = getFocusable(modal);
      if (focusable.length) focusable[0].focus();
    });
  }

  function closeModal() {
    veil.classList.remove('show');
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (preFocusEl) { preFocusEl.focus(); preFocusEl = null; }
  }

  /* ---------- Confirm dialog ---------- */
  const cdVeil  = document.getElementById('cdialogVeil');
  const cdDialog = document.getElementById('cdialog');
  let pendingVideoId = null;

  function showConfirm(id) {
    pendingVideoId = id;
    cdVeil.classList.add('show');
    cdDialog.classList.add('show');
    cdDialog.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      const ok = document.getElementById('cdialogOk');
      if (ok) ok.focus();
    });
  }

  function closeConfirm() {
    cdVeil.classList.remove('show');
    cdDialog.classList.remove('show');
    cdDialog.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    pendingVideoId = null;
  }

  document.getElementById('cdialogCancel').addEventListener('click', closeConfirm);
  document.getElementById('cdialogOk').addEventListener('click', () => {
    const id = pendingVideoId;
    closeConfirm();
    openModal(id);
  });
  cdVeil.addEventListener('click', closeConfirm);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && cdDialog.classList.contains('show')) closeConfirm(); });

  // Focus trap
  modal.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const f = getFocusable(modal);
    if (!f.length) return;
    if (e.shiftKey) {
      if (document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
    } else {
      if (document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  veil.addEventListener('click', closeModal);
  modal.querySelector('.modal-x').addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('show')) closeModal(); });
  modal.querySelector('[data-pay]').addEventListener('click', () => modal.classList.add('done'));
  modal.querySelector('[data-done]').addEventListener('click', closeModal);

  /* ---------- Contact form — validation + API ---------- */
  const form = document.getElementById('contact-form');
  if (form) {
    function setFieldError(input, msg) {
      let err = input.parentElement.querySelector('.field-error');
      if (!err) {
        err = document.createElement('span');
        err.className = 'field-error';
        err.setAttribute('role', 'alert');
        input.parentElement.appendChild(err);
      }
      err.textContent = msg;
      input.classList.toggle('invalid', !!msg);
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    }

    function clearErrors() {
      form.querySelectorAll('.field-error').forEach(el => (el.textContent = ''));
      form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
      form.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
    }

    form.addEventListener('submit', async e => {
      e.preventDefault();
      clearErrors();

      const nameEl    = form.querySelector('[name=name]');
      const emailEl   = form.querySelector('[name=email]');
      const subjectEl = form.querySelector('[name=subject]');
      const msgEl     = form.querySelector('[name=message]');
      const btn       = form.querySelector('button[type=submit]');
      const ok        = form.querySelector('.form-ok');
      const emailRe   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      let valid       = true;

      if (!nameEl.value.trim()) { setFieldError(nameEl, 'Ad soyad zorunludur.'); valid = false; }
      else if (nameEl.value.trim().length > 100) { setFieldError(nameEl, 'En fazla 100 karakter.'); valid = false; }

      if (!emailEl.value.trim()) { setFieldError(emailEl, 'E-posta zorunludur.'); valid = false; }
      else if (!emailRe.test(emailEl.value.trim())) { setFieldError(emailEl, 'Geçerli bir e-posta girin.'); valid = false; }

      if (!msgEl.value.trim()) { setFieldError(msgEl, 'Mesaj zorunludur.'); valid = false; }
      else if (msgEl.value.trim().length > 2000) { setFieldError(msgEl, 'En fazla 2000 karakter.'); valid = false; }

      if (!valid) { const first = form.querySelector('.invalid'); if (first) first.focus(); return; }

      btn.disabled = true;
      btn.textContent = 'Gönderiliyor…';

      try {
        const res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name:    nameEl.value.trim(),
            email:   emailEl.value.trim(),
            subject: subjectEl ? subjectEl.value : '',
            message: msgEl.value.trim(),
          }),
        });
        if (res.ok) {
          ok.classList.add('show');
          btn.textContent = 'Gönderildi ✓';
        } else {
          const data = await res.json().catch(() => ({}));
          btn.disabled = false;
          btn.textContent = 'Gönder';
          setFieldError(emailEl, data.error || 'Bir hata oluştu. Lütfen tekrar deneyin.');
        }
      } catch {
        ok.classList.add('show');
        btn.textContent = 'Gönderildi ✓';
      }
    });
  }

  /* ---------- Mobile menu ---------- */
  const burger = document.querySelector('.nav-burger');
  const mmenu  = document.getElementById('mobileMenu');

  function closeMenu() {
    menuOpen = false;
    burger.classList.remove('open');
    mmenu.classList.remove('open');
    nav.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    onScroll();
  }

  if (burger) {
    burger.setAttribute('aria-expanded', 'false');
    burger.addEventListener('click', () => {
      menuOpen = burger.classList.toggle('open');
      mmenu.classList.toggle('open', menuOpen);
      nav.classList.toggle('menu-open', menuOpen);
      burger.setAttribute('aria-expanded', String(menuOpen));
      if (menuOpen) nav.classList.remove('scrolled');
      document.body.style.overflow = menuOpen ? 'hidden' : '';
    });
  }
  if (mmenu) mmenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  /* ---------- Boot ---------- */
  function boot() {
    renderGallery();
    document.querySelectorAll('.r').forEach(el => io.observe(el));
    document.querySelectorAll('[data-count]').forEach(el => statIO.observe(el));
    wireFaq();
    onScroll();
    setTimeout(() => document.querySelector('.hero').classList.add('in'), 90);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
