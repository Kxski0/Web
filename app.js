/* Referenzen – lokale Sammlung inspirierender Websites.
   Alle Daten bleiben im Browser (IndexedDB). Keine externen Requests. */

(() => {
  'use strict';

  /* ---------------- Storage ---------------- */

  const DB_NAME = 'referenzen';
  const STORE = 'sites';
  let dbPromise;

  function db() {
    if (!dbPromise) {
      dbPromise = new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, 1);
        req.onupgradeneeded = () => {
          const d = req.result;
          if (!d.objectStoreNames.contains(STORE)) {
            d.createObjectStore(STORE, { keyPath: 'id' });
          }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
      });
    }
    return dbPromise;
  }

  async function tx(mode, fn) {
    const d = await db();
    return new Promise((resolve, reject) => {
      const t = d.transaction(STORE, mode);
      const store = t.objectStore(STORE);
      let result;
      try { result = fn(store); } catch (e) { reject(e); return; }
      t.oncomplete = () => resolve(result && result.result !== undefined ? result.result : result);
      t.onerror = () => reject(t.error);
      t.onabort = () => reject(t.error);
    });
  }

  const store = {
    all: () => tx('readonly', s => s.getAll()),
    put: item => tx('readwrite', s => s.put(item)),
    remove: id => tx('readwrite', s => s.delete(id))
  };

  /* ---------------- State ---------------- */

  const state = {
    items: [],
    query: '',
    tag: null,
    sort: localStorage.getItem('sort') || 'new',
    editingId: null,
    pendingImage: null,   // Blob
    imageTouched: false
  };

  const urlCache = new Map();
  function objectURL(id, blob) {
    if (urlCache.has(id)) return urlCache.get(id);
    const u = URL.createObjectURL(blob);
    urlCache.set(id, u);
    return u;
  }
  function dropURL(id) {
    if (urlCache.has(id)) { URL.revokeObjectURL(urlCache.get(id)); urlCache.delete(id); }
  }

  /* ---------------- Helpers ---------------- */

  const $ = sel => document.querySelector(sel);
  const el = {
    grid: $('#grid'), empty: $('#empty'), count: $('#count'), search: $('#search'),
    filterbar: $('#filterbar'), tagfilters: $('#tagfilters'),
    scrim: $('#scrim'), sheet: $('#sheet'), sheetTitle: $('#sheetTitle'),
    dropzone: $('#dropzone'), preview: $('#preview'), dropHint: $('#dropHint'),
    removeImg: $('#removeImg'), file: $('#file'),
    url: $('#url'), title: $('#title'), note: $('#note'), tags: $('#tags'),
    saveBtn: $('#saveBtn'), cancelBtn: $('#cancelBtn'), deleteBtn: $('#deleteBtn'),
    menu: $('#menu'), toast: $('#toast'), importFile: $('#importFile'), topbar: $('.topbar')
  };

  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  function normalizeUrl(raw) {
    let v = (raw || '').trim();
    if (!v) return '';
    if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(v)) v = 'https://' + v;
    try { return new URL(v).href; } catch { return ''; }
  }

  function hostOf(url) {
    try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; }
  }

  function titleFromUrl(url) {
    const h = hostOf(url);
    if (!h) return '';
    const base = h.split('.').slice(0, -1).join('.') || h;
    return base.charAt(0).toUpperCase() + base.slice(1);
  }

  let toastTimer;
  function toast(msg) {
    el.toast.textContent = msg;
    el.toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.toast.hidden = true; }, 2200);
  }

  const escapeHtml = s => String(s).replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------------- Image processing ---------------- */

  const MAX_W = 1600;
  const MAX_H = 1400;

  async function processImage(fileOrBlob) {
    if (!fileOrBlob || !/^image\//.test(fileOrBlob.type)) return null;
    const bitmap = await loadBitmap(fileOrBlob);
    let { width: w, height: h } = bitmap;
    const scale = Math.min(1, MAX_W / w, MAX_H / h);
    w = Math.round(w * scale); h = Math.round(h * scale);

    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, 0, 0, w, h);
    if (bitmap.close) bitmap.close();

    const blob = await new Promise(res => canvas.toBlob(res, 'image/webp', 0.86))
      || await new Promise(res => canvas.toBlob(res, 'image/jpeg', 0.86));
    return blob || fileOrBlob;
  }

  function loadBitmap(blob) {
    if (window.createImageBitmap) {
      return createImageBitmap(blob).catch(() => loadViaImg(blob));
    }
    return loadViaImg(blob);
  }

  function loadViaImg(blob) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const u = URL.createObjectURL(blob);
      img.onload = () => { URL.revokeObjectURL(u); resolve(img); };
      img.onerror = () => { URL.revokeObjectURL(u); reject(new Error('Bild konnte nicht gelesen werden')); };
      img.src = u;
    });
  }

  /* ---------------- Rendering ---------------- */

  function visibleItems() {
    const q = state.query.trim().toLowerCase();
    let list = state.items.filter(it => {
      if (state.tag && !(it.tags || []).some(t => t.toLowerCase() === state.tag.toLowerCase())) return false;
      if (!q) return true;
      return [it.title, it.note, it.url, (it.tags || []).join(' ')]
        .filter(Boolean).join(' ').toLowerCase().includes(q);
    });
    const by = {
      new: (a, b) => b.createdAt - a.createdAt,
      old: (a, b) => a.createdAt - b.createdAt,
      az: (a, b) => (a.title || '').localeCompare(b.title || '', 'de', { sensitivity: 'base' })
    }[state.sort];
    return list.sort(by);
  }

  function render() {
    const list = visibleItems();

    el.count.textContent = state.items.length ? String(state.items.length) : '';
    el.empty.hidden = state.items.length > 0;

    renderTags();

    if (!state.items.length) { el.grid.innerHTML = ''; return; }

    if (!list.length) {
      el.grid.innerHTML = '<p style="grid-column:1/-1;color:var(--text-3);text-align:center;padding:60px 0">Keine Treffer.</p>';
      return;
    }

    el.grid.innerHTML = list.map(it => {
      const host = hostOf(it.url);
      const thumb = it.image
        ? `<div class="card-thumb"><img src="${objectURL(it.id, it.image)}" alt="" loading="lazy" /></div>`
        : `<div class="card-thumb placeholder">${escapeHtml((it.title || host || '?').charAt(0).toUpperCase())}</div>`;
      const tags = (it.tags || []).length
        ? `<div class="card-tags">${it.tags.map(t => `<span>${escapeHtml(t)}</span>`).join('')}</div>` : '';
      const note = it.note ? `<p class="card-note">${escapeHtml(it.note)}</p>` : '';
      return `
        <article class="card">
          <a class="card-link" href="${escapeHtml(it.url)}" target="_blank" rel="noopener noreferrer">
            ${thumb}
            <div class="card-body">
              <h3 class="card-title">${escapeHtml(it.title || host)}</h3>
              <div class="card-host">${escapeHtml(host)}</div>
              ${note}
              ${tags}
            </div>
          </a>
          <button class="card-edit" data-edit="${it.id}" aria-label="Bearbeiten">
            <svg viewBox="0 0 16 16"><path d="M11.3 1.7a1.6 1.6 0 0 1 2.3 0l.7.7a1.6 1.6 0 0 1 0 2.3l-7.4 7.4a1.5 1.5 0 0 1-.7.4l-3 .8a.6.6 0 0 1-.7-.8l.8-3c.07-.27.21-.5.4-.7l7.6-7.1Zm1.4.9a.3.3 0 0 0-.4 0l-.9.9 1.1 1.1.9-.9a.3.3 0 0 0 0-.4l-.7-.7Z"/></svg>
          </button>
        </article>`;
    }).join('');
  }

  function renderTags() {
    const counts = new Map();
    state.items.forEach(it => (it.tags || []).forEach(t => counts.set(t, (counts.get(t) || 0) + 1)));
    const tags = [...counts.keys()].sort((a, b) => counts.get(b) - counts.get(a) || a.localeCompare(b, 'de'));

    if (!tags.length) { el.filterbar.hidden = true; el.tagfilters.innerHTML = ''; return; }
    el.filterbar.hidden = false;
    el.tagfilters.innerHTML =
      `<button data-tag="" class="${state.tag ? '' : 'active'}">Alle</button>` +
      tags.map(t => `<button data-tag="${escapeHtml(t)}" class="${state.tag === t ? 'active' : ''}">${escapeHtml(t)}</button>`).join('');
  }

  /* ---------------- Sheet ---------------- */

  function openSheet(item) {
    state.editingId = item ? item.id : null;
    state.pendingImage = item && item.image ? item.image : null;
    state.imageTouched = false;

    el.sheetTitle.textContent = item ? 'Referenz bearbeiten' : 'Neue Referenz';
    el.url.value = item ? item.url : '';
    el.title.value = item ? (item.title || '') : '';
    el.note.value = item ? (item.note || '') : '';
    el.tags.value = item ? (item.tags || []).join(', ') : '';
    el.deleteBtn.hidden = !item;
    el.title.placeholder = item && item.url
      ? titleFromUrl(item.url)
      : 'Wird automatisch aus dem Link erzeugt';

    setPreview(state.pendingImage);

    el.scrim.hidden = false;
    el.sheet.hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(() => el.url.focus({ preventScroll: true }), 260);
  }

  function closeSheet() {
    el.sheet.classList.add('closing');
    el.scrim.classList.add('closing');
    setTimeout(() => {
      el.sheet.hidden = true; el.scrim.hidden = true;
      el.sheet.classList.remove('closing'); el.scrim.classList.remove('closing');
      document.body.style.overflow = '';
      if (el.preview.src.startsWith('blob:')) URL.revokeObjectURL(el.preview.src);
      state.pendingImage = null;
      state.editingId = null;
    }, 260);
  }

  function setPreview(blob) {
    if (el.preview.src.startsWith('blob:')) URL.revokeObjectURL(el.preview.src);
    if (blob) {
      el.preview.src = URL.createObjectURL(blob);
      el.preview.hidden = false;
      el.dropHint.hidden = true;
      el.removeImg.hidden = false;
      el.dropzone.classList.add('has-image');
    } else {
      el.preview.removeAttribute('src');
      el.preview.hidden = true;
      el.dropHint.hidden = false;
      el.removeImg.hidden = true;
      el.dropzone.classList.remove('has-image');
    }
  }

  async function acceptImage(fileOrBlob) {
    try {
      const processed = await processImage(fileOrBlob);
      if (!processed) { toast('Das ist kein Bild.'); return; }
      state.pendingImage = processed;
      state.imageTouched = true;
      setPreview(processed);
    } catch {
      toast('Bild konnte nicht verarbeitet werden.');
    }
  }

  async function save() {
    const url = normalizeUrl(el.url.value);
    if (!url) { el.url.focus(); toast('Bitte einen gültigen Link angeben.'); return; }

    const tags = el.tags.value.split(',').map(t => t.trim()).filter(Boolean).slice(0, 12);
    const existing = state.editingId ? state.items.find(i => i.id === state.editingId) : null;

    const item = {
      id: existing ? existing.id : uid(),
      url,
      title: el.title.value.trim() || titleFromUrl(url),
      note: el.note.value.trim(),
      tags,
      image: state.imageTouched ? state.pendingImage : (existing ? existing.image : state.pendingImage),
      createdAt: existing ? existing.createdAt : Date.now(),
      updatedAt: Date.now()
    };

    try {
      await store.put(item);
    } catch {
      toast('Speichern fehlgeschlagen – ist der Speicher voll?');
      return;
    }

    dropURL(item.id);
    const idx = state.items.findIndex(i => i.id === item.id);
    if (idx >= 0) state.items[idx] = item; else state.items.push(item);

    render();
    closeSheet();
    toast(existing ? 'Aktualisiert' : 'Gesichert');
  }

  async function removeItem(id) {
    await store.remove(id);
    dropURL(id);
    state.items = state.items.filter(i => i.id !== id);
    render();
    closeSheet();
    toast('Gelöscht');
  }

  /* ---------------- Backup ---------------- */

  const blobToDataURL = blob => new Promise(res => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.readAsDataURL(blob);
  });

  async function dataURLToBlob(dataUrl) {
    const res = await fetch(dataUrl);
    return res.blob();
  }

  async function exportBackup() {
    const data = {
      format: 'referenzen-backup',
      version: 1,
      exportedAt: new Date().toISOString(),
      items: await Promise.all(state.items.map(async it => ({
        id: it.id, url: it.url, title: it.title, note: it.note, tags: it.tags,
        createdAt: it.createdAt, updatedAt: it.updatedAt,
        image: it.image ? await blobToDataURL(it.image) : null
      })))
    };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `referenzen-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    toast('Backup exportiert');
  }

  async function importBackup(file) {
    try {
      const data = JSON.parse(await file.text());
      const incoming = Array.isArray(data) ? data : data.items;
      if (!Array.isArray(incoming)) throw new Error('bad');

      let added = 0;
      for (const raw of incoming) {
        const url = normalizeUrl(raw.url);
        if (!url) continue;
        if (state.items.some(i => i.url === url)) continue;
        const item = {
          id: raw.id && !state.items.some(i => i.id === raw.id) ? raw.id : uid(),
          url,
          title: raw.title || titleFromUrl(url),
          note: raw.note || '',
          tags: Array.isArray(raw.tags) ? raw.tags : [],
          image: raw.image ? await dataURLToBlob(raw.image) : null,
          createdAt: raw.createdAt || Date.now(),
          updatedAt: Date.now()
        };
        await store.put(item);
        state.items.push(item);
        added++;
      }
      render();
      toast(added ? `${added} Referenz${added === 1 ? '' : 'en'} importiert` : 'Nichts Neues importiert');
    } catch {
      toast('Datei konnte nicht gelesen werden.');
    }
  }

  /* ---------------- Menu ---------------- */

  function openMenu() {
    el.menu.hidden = false;
    [...el.menu.querySelectorAll('[data-sort]')].forEach(b =>
      b.classList.toggle('checked', b.dataset.sort === state.sort));
    setTimeout(() => document.addEventListener('click', closeMenuOnce, { once: true }), 0);
  }
  function closeMenuOnce() { el.menu.hidden = true; }

  /* ---------------- Events ---------------- */

  $('#openAdd').addEventListener('click', () => openSheet(null));
  $('#emptyAdd').addEventListener('click', () => openSheet(null));
  el.cancelBtn.addEventListener('click', closeSheet);
  el.scrim.addEventListener('click', closeSheet);
  el.saveBtn.addEventListener('click', save);

  el.deleteBtn.addEventListener('click', () => {
    if (state.editingId && confirm('Diese Referenz wirklich löschen?')) removeItem(state.editingId);
  });

  el.grid.addEventListener('click', e => {
    const btn = e.target.closest('[data-edit]');
    if (!btn) return;
    e.preventDefault();
    const item = state.items.find(i => i.id === btn.dataset.edit);
    if (item) openSheet(item);
  });

  el.tagfilters.addEventListener('click', e => {
    const btn = e.target.closest('[data-tag]');
    if (!btn) return;
    state.tag = btn.dataset.tag || null;
    render();
  });

  el.search.addEventListener('input', () => { state.query = el.search.value; render(); });

  function suggestTitle() {
    const url = normalizeUrl(el.url.value);
    el.title.placeholder = url ? titleFromUrl(url) : 'Wird automatisch aus dem Link erzeugt';
  }
  el.url.addEventListener('input', suggestTitle);
  el.url.addEventListener('blur', () => {
    const url = normalizeUrl(el.url.value);
    if (url) el.url.value = url;
    suggestTitle();
  });

  // Dropzone
  el.dropzone.addEventListener('click', e => { if (!e.target.closest('#removeImg')) el.file.click(); });
  el.dropzone.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.file.click(); }
  });
  el.file.addEventListener('change', () => {
    if (el.file.files[0]) acceptImage(el.file.files[0]);
    el.file.value = '';
  });
  el.removeImg.addEventListener('click', e => {
    e.stopPropagation();
    state.pendingImage = null;
    state.imageTouched = true;
    setPreview(null);
  });

  ['dragenter', 'dragover'].forEach(ev => el.dropzone.addEventListener(ev, e => {
    e.preventDefault(); el.dropzone.classList.add('dragging');
  }));
  ['dragleave', 'drop'].forEach(ev => el.dropzone.addEventListener(ev, e => {
    e.preventDefault(); el.dropzone.classList.remove('dragging');
  }));
  el.dropzone.addEventListener('drop', e => {
    const f = e.dataTransfer.files[0];
    if (f) acceptImage(f);
  });
  document.addEventListener('dragover', e => e.preventDefault());
  document.addEventListener('drop', e => {
    e.preventDefault();
    if (el.sheet.hidden && e.dataTransfer.files[0] && /^image\//.test(e.dataTransfer.files[0].type)) {
      openSheet(null);
      acceptImage(e.dataTransfer.files[0]);
    }
  });

  // Paste: image anywhere -> add sheet; url text -> url field
  document.addEventListener('paste', e => {
    const items = [...(e.clipboardData?.items || [])];
    const imgItem = items.find(i => i.type.startsWith('image/'));
    if (imgItem) {
      const f = imgItem.getAsFile();
      if (!f) return;
      e.preventDefault();
      if (el.sheet.hidden) openSheet(null);
      acceptImage(f);
      return;
    }
    if (el.sheet.hidden) {
      const text = e.clipboardData?.getData('text') || '';
      if (/^https?:\/\/\S+$/i.test(text.trim()) && document.activeElement !== el.search) {
        e.preventDefault();
        openSheet(null);
        el.url.value = text.trim();
        el.title.placeholder = titleFromUrl(normalizeUrl(text.trim()));
      }
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (!el.menu.hidden) el.menu.hidden = true;
      else if (!el.sheet.hidden) closeSheet();
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && !el.sheet.hidden) { e.preventDefault(); save(); }
    if (e.key === 'n' && !e.metaKey && !e.ctrlKey && el.sheet.hidden &&
        !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) {
      e.preventDefault(); openSheet(null);
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); el.search.focus(); el.search.select(); }
  });

  $('#openMenu').addEventListener('click', e => {
    e.stopPropagation();
    if (el.menu.hidden) openMenu(); else el.menu.hidden = true;
  });
  el.menu.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.sort) {
      state.sort = b.dataset.sort;
      localStorage.setItem('sort', state.sort);
      render();
    }
    el.menu.hidden = true;
  });
  $('#exportBtn').addEventListener('click', exportBackup);
  $('#importBtn').addEventListener('click', () => el.importFile.click());
  el.importFile.addEventListener('change', () => {
    if (el.importFile.files[0]) importBackup(el.importFile.files[0]);
    el.importFile.value = '';
  });

  addEventListener('scroll', () => {
    el.topbar.classList.toggle('scrolled', scrollY > 4);
  }, { passive: true });

  /* ---------------- Boot ---------------- */

  (async function init() {
    try {
      state.items = (await store.all()) || [];
    } catch {
      state.items = [];
      toast('Lokaler Speicher nicht verfügbar.');
    }
    render();

    // Shared link via Web Share Target / ?url=
    const params = new URLSearchParams(location.search);
    const shared = params.get('url') || params.get('text');
    if (shared && normalizeUrl(shared)) {
      openSheet(null);
      el.url.value = normalizeUrl(shared);
      el.title.placeholder = titleFromUrl(el.url.value);
      history.replaceState(null, '', location.pathname);
    }

    if ('serviceWorker' in navigator) {
      const reg = () => navigator.serviceWorker.register('sw.js').catch(() => {});
      if (document.readyState === 'complete') reg();
      else addEventListener('load', reg, { once: true });
    }
  })();
})();
