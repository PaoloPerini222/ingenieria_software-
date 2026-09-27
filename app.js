(function () {
  'use strict';

  // ---------- Almacenamiento (progreso + tema) ----------
  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); }
      catch (e) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* sin storage */ }
    }
  };
  let done = new Set(store.get('isw-done', []));
  const saveDone = () => store.set('isw-done', [...done]);

  // ---------- Mini parser de Markdown ----------
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const inline = s => esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  const LIST_RE = /^(\s*)([-*]|\d+\.)\s+(.*)$/;

  function parseList(lines, i) {
    const stack = [];
    let out = '';
    while (i < lines.length) {
      const m = lines[i].match(LIST_RE);
      if (!m) break;
      const ind = m[1].length;
      const ordered = /\d/.test(m[2]);
      const type = ordered ? 'ol' : 'ul';
      const startAttr = ordered && parseInt(m[2], 10) !== 1 ? ` start="${parseInt(m[2], 10)}"` : '';
      if (!stack.length || ind > stack[stack.length - 1].indent) {
        out += `<${type}${startAttr}>`;
        stack.push({ indent: ind, type });
      } else {
        while (stack.length > 1 && ind < stack[stack.length - 1].indent) {
          out += `</li></${stack.pop().type}>`;
        }
        out += '</li>';
        const top = stack[stack.length - 1];
        if (top.type !== type) { out += `</${top.type}><${type}${startAttr}>`; top.type = type; }
      }
      out += '<li>' + inline(m[3]);
      i++;
    }
    while (stack.length) out += `</li></${stack.pop().type}>`;
    return [out, i];
  }

  function parseTable(lines, i) {
    const rows = [];
    while (i < lines.length && /^\s*\|/.test(lines[i])) rows.push(lines[i++]);
    const cells = r => r.trim().replace(/^\||\|$/g, '').split('|').map(c => inline(c.trim()));
    const body = rows.filter((r, idx) => !(idx === 1 && /^[\s|:-]+$/.test(r)));
    const [head, ...rest] = body;
    const out = '<div class="table-wrap"><table><thead><tr>' + cells(head).map(c => `<th>${c}</th>`).join('') +
      '</tr></thead><tbody>' + rest.map(r => '<tr>' + cells(r).map(c => `<td>${c}</td>`).join('') + '</tr>').join('') +
      '</tbody></table></div>';
    return [out, i];
  }

  function md(src) {
    const lines = src.replace(/\r/g, '').split('\n');
    let html = '';
    let para = [];
    const flush = () => {
      if (!para.length) return;
      const text = para.map(inline).join('<br>');
      const isCallout = /^<strong>[^<]*(examen|clave|crítico|importante)/i.test(text);
      html += `<p${isCallout ? ' class="callout"' : ''}>${text}</p>`;
      para = [];
    };
    let i = 0;
    while (i < lines.length) {
      const line = lines[i];
      if (/^```/.test(line)) {
        flush();
        const code = [];
        i++;
        while (i < lines.length && !/^```/.test(lines[i])) code.push(lines[i++]);
        i++;
        html += `<pre><code>${esc(code.join('\n'))}</code></pre>`;
        continue;
      }
      const h = line.match(/^(#{3,6})\s+(.*)$/);
      if (h) {
        flush();
        const lvl = Math.min(h[1].length, 4);
        html += `<h${lvl}>${inline(h[2])}</h${lvl}>`;
        i++; continue;
      }
      if (/^\s*\|/.test(line)) {
        flush();
        const [out, next] = parseTable(lines, i);
        html += out; i = next; continue;
      }
      if (/^([-*]|\d+\.)\s/.test(line)) {
        flush();
        const [out, next] = parseList(lines, i);
        html += out; i = next; continue;
      }
      if (/^>\s?/.test(line)) {
        flush();
        html += `<blockquote>${inline(line.replace(/^>\s?/, ''))}</blockquote>`;
        i++; continue;
      }
      if (!line.trim() || /^---+$/.test(line.trim())) { flush(); i++; continue; }
      para.push(line.trim());
      i++;
    }
    flush();
    return html;
  }

  // ---------- Carga de unidades desde los bloques Markdown ----------
  const units = [...document.querySelectorAll('script[type="text/markdown"]')].map(el => {
    const n = el.dataset.unit;
    const chunks = el.textContent.split(/^## /m).slice(1);
    const sections = chunks.map((chunk, idx) => {
      const nl = chunk.indexOf('\n');
      const title = chunk.slice(0, nl).trim();
      const body = chunk.slice(nl + 1);
      const plain = body.replace(/[#*`>|]/g, ' ').replace(/\s+/g, ' ');
      return { id: `u${n}-s${idx + 1}`, title, body, plain };
    });
    return {
      n, id: `u${n}`, label: el.dataset.label, title: el.dataset.title, short: el.dataset.short,
      sections, color: `var(--u${n}, var(--accent))`
    };
  });
  const unitPct = u => Math.round(100 * u.sections.filter(s => done.has(s.id)).length / (u.sections.length || 1));

  // ---------- Navegación lateral ----------
  const nav = document.getElementById('nav');
  function renderNav(activeUnit) {
    let html = `<a class="nav-link ${!activeUnit ? 'active' : ''}" href="#/">
      <span class="nav-dot" style="background:var(--text)"></span>Panel general</a>`;
    units.forEach(u => {
      const active = activeUnit === u.id;
      html += `<a class="nav-link ${active ? 'active' : ''}" href="#/${u.id}">
        <span class="nav-dot" style="background:${u.color}"></span>
        ${esc(u.label)} · ${esc(u.short)}<span class="nav-pct">${unitPct(u)}%</span></a>`;
      if (active) {
        html += '<div class="nav-sub">' + u.sections.map(s =>
          `<a href="#/${u.id}/${s.id}" class="${done.has(s.id) ? 'done' : ''}" title="${esc(s.title)}">${esc(s.title)}</a>`
        ).join('') + '</div>';
      }
    });
    html += `<div class="nav-group">Práctica</div>
      <a class="nav-link ${activeUnit === 'examen' ? 'active' : ''}" href="#/examen">
        <span class="nav-dot" style="background:var(--accent)"></span>Ejercicios para el parcial</a>`;
    nav.innerHTML = html;
  }

  // ---------- Vistas ----------
  const view = document.getElementById('view');

  function renderHome() {
    const total = units.reduce((a, u) => a + u.sections.length, 0);
    const studied = units.reduce((a, u) => a + u.sections.filter(s => done.has(s.id)).length, 0);
    const pct = Math.round(100 * studied / (total || 1));
    const realUnits = units.filter(u => /^Unidad/.test(u.label)).length;
    view.innerHTML = `
      <section class="hero">
        <div class="eyebrow">Libro de estudio completo</div>
        <h1>Ingeniería de Software I</h1>
        <div class="meta-row">
          <span><b>Carrera:</b> Analista de Sistemas de Computación</span>
          <span><b>Instituto:</b> Leibnitz</span>
          <span><b>Docente:</b> María Sol Zanel</span>
          <span><b>Ciclo:</b> 2026</span>
        </div>
      </section>
      <div class="stats">
        <div class="stat"><div class="stat-label">Unidades</div><div class="stat-value">${realUnits}</div></div>
        <div class="stat"><div class="stat-label">Temas</div><div class="stat-value">${total}</div></div>
        <div class="stat"><div class="stat-label">Temas estudiados</div><div class="stat-value">${studied}</div></div>
        <div class="stat"><div class="stat-label">Progreso total</div><div class="stat-value">${pct}%</div>
          <div class="progress" style="margin-top:8px"><span style="width:${pct}%"></span></div></div>
      </div>
      <a class="practice-banner" href="#/examen">
        <div>
          <div class="eyebrow">Práctica para el parcial</div>
          <strong>Ejercicios multiple choice en 4 niveles</strong>
          <span>Fácil, medio, difícil y extremo. Se aprueba con 70%.</span>
        </div>
        <span class="practice-go">Practicar →</span>
      </a>
      <h2 class="block-title">Unidades</h2>
      <div class="unit-grid">
        ${units.map(u => {
          const p = unitPct(u);
          return `<a class="unit-card" href="#/${u.id}" style="--uc:${u.color}">
            <div class="unit-num">${esc(u.label.toUpperCase())}</div>
            <h3>${esc(u.title)}</h3>
            <ul>${u.sections.slice(0, 5).map(s => `<li>${esc(s.title.replace(/^[\dA-Z.]+\s*—\s*/, ''))}</li>`).join('')}
              ${u.sections.length > 5 ? `<li>y ${u.sections.length - 5} temas más…</li>` : ''}</ul>
            <div>
              <div class="progress-label"><span>${u.sections.length} temas</span><span>${p}%</span></div>
              <div class="progress"><span style="width:${p}%"></span></div>
            </div>
          </a>`;
        }).join('')}
      </div>`;
  }

  function renderUnit(u, focusId, highlight) {
    const idx = units.indexOf(u);
    const prev = units[idx - 1], next = units[idx + 1];
    const p = unitPct(u);
    view.innerHTML = `
      <div style="--uc:${u.color}">
        <header class="unit-head">
          <div class="eyebrow">${esc(u.label)}</div>
          <h1>${esc(u.title)}</h1>
          <div class="progress-label" style="max-width:420px"><span>${u.sections.filter(s => done.has(s.id)).length} de ${u.sections.length} temas estudiados</span><span>${p}%</span></div>
          <div class="progress"><span style="width:${p}%"></span></div>
        </header>
        <div class="toc">${u.sections.map(s =>
          `<a class="chip ${done.has(s.id) ? 'done' : ''}" href="#/${u.id}/${s.id}">${esc(s.title.replace(/\s*—\s*/, ' '))}</a>`
        ).join('')}</div>
        ${/^Unidad/.test(u.label) ? `
        <div class="unit-practice">
          <span class="unit-practice-label">Examen de esta unidad</span>
          <div class="ulevels">${unitLevelButtons(+u.n)}</div>
        </div>` : ''}
        <div class="unit-actions">
          <button class="ghost-btn" data-act="expand" type="button">Expandir todo</button>
          <button class="ghost-btn" data-act="collapse" type="button">Contraer todo</button>
        </div>
        ${u.sections.map(s => `
          <article class="section ${done.has(s.id) ? 'is-done' : ''}" id="${s.id}">
            <div class="section-head" data-toggle="${s.id}">
              <span class="caret">▼</span>
              <h2>${esc(s.title)}</h2>
              <button class="done-btn" data-done="${s.id}" type="button">${done.has(s.id) ? 'Estudiado' : 'Marcar estudiado'}</button>
            </div>
            <div class="section-body">${md(s.body)}</div>
          </article>`).join('')}
        <nav class="pager">
          ${prev ? `<a href="#/${prev.id}"><small>← Anterior</small>${esc(prev.label)} · ${esc(prev.short)}</a>` : '<span style="flex:1"></span>'}
          ${next ? `<a class="next" href="#/${next.id}"><small>Siguiente →</small>${esc(next.label)} · ${esc(next.short)}</a>` : '<a class="next" href="#/"><small>Fin →</small>Volver al panel</a>'}
        </nav>
      </div>`;

    if (focusId) {
      const el = document.getElementById(focusId);
      if (el) {
        if (highlight) highlightIn(el.querySelector('.section-body'), highlight);
        requestAnimationFrame(() => {
          const target = el.querySelector('mark.hl') || el;
          target.scrollIntoView({ behavior: 'smooth', block: target === el ? 'start' : 'center' });
        });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }

  function highlightIn(root, term) {
    const q = term.toLowerCase();
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const i = node.nodeValue.toLowerCase().indexOf(q);
      if (i >= 0) {
        const range = document.createRange();
        range.setStart(node, i); range.setEnd(node, i + term.length);
        const mark = document.createElement('mark');
        mark.className = 'hl';
        range.surroundContents(mark);
        return;
      }
    }
  }

  // Delegación de eventos en la vista de unidad
  view.addEventListener('click', e => {
    const doneBtn = e.target.closest('[data-done]');
    if (doneBtn) {
      e.stopPropagation();
      const id = doneBtn.dataset.done;
      done.has(id) ? done.delete(id) : done.add(id);
      saveDone();
      route(true);
      return;
    }
    const head = e.target.closest('[data-toggle]');
    if (head) { head.parentElement.classList.toggle('collapsed'); return; }
    const act = e.target.closest('[data-act]');
    if (act) {
      view.querySelectorAll('.section').forEach(s => s.classList.toggle('collapsed', act.dataset.act === 'collapse'));
    }
  });

  // ---------- Ejercicios (multiple choice) ----------
  const BANK = window.EXAM_BANK || {};
  const UNIT_EXTRA = window.EXAM_UNIT_EXTRA || {};
  const PASS = 70;
  const UNIT_EXAM_SIZE = 10;
  const GENERAL_EXAM_SIZE = 20;
  const LEVELS = [
    { id: 'facil', name: 'Fácil', desc: 'Definiciones y conceptos básicos. 4 opciones por pregunta.' },
    { id: 'medio', name: 'Medio', desc: 'Relaciones entre conceptos y comparaciones. 4 opciones por pregunta.' },
    { id: 'dificil', name: 'Difícil', desc: 'Afirmaciones con trampas y conceptos cruzados. 5 opciones por pregunta.' },
    { id: 'extremo', name: 'Extremo', desc: 'Casos prácticos y situaciones para aplicar la teoría. 5 opciones por pregunta.' }
  ];
  const UNIT_LEVELS = LEVELS.slice(0, 3);
  const examUnits = units.filter(u => /^Unidad/.test(u.label));
  const roman = ['', 'I', 'II', 'III', 'IV', 'V'];
  const letters = 'abcdefgh';
  let examStats = store.get('isw-exam', {});
  let attempt = null;

  const shuffle = arr => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };

  // Preguntas disponibles para el examen de una unidad y nivel.
  // El nivel difícil de cada unidad suma también las preguntas "extremo" del banco general.
  function unitPool(n, levelId) {
    const general = (BANK[levelId] || []).concat(levelId === 'dificil' ? (BANK.extremo || []) : []);
    return general.concat(UNIT_EXTRA[levelId] || []).filter(q => q.u === n);
  }

  // Preguntas disponibles para un examen general: todas las del nivel, de todas las unidades.
  function generalPool(levelId) {
    return (BANK[levelId] || []).concat(UNIT_EXTRA[levelId] || []);
  }

  // Un examen se identifica por el nivel ("facil") o por unidad y nivel ("u3-facil").
  function getExam(id) {
    const m = /^u(\d)-(facil|medio|dificil)$/.exec(id || '');
    if (m) {
      const n = +m[1];
      const level = LEVELS.find(l => l.id === m[2]);
      const unit = examUnits.find(u => +u.n === n);
      const pool = unitPool(n, m[2]);
      if (!unit || !pool.length) return null;
      return {
        id, level, pool, unit: n, size: Math.min(UNIT_EXAM_SIZE, pool.length),
        eyebrow: `Examen por unidad · ${unit.label} · ${unit.short}`,
        title: `${unit.label}: nivel ${level.name.toLowerCase()}`
      };
    }
    const level = LEVELS.find(l => l.id === id);
    if (!level || !BANK[id]) return null;
    const pool = generalPool(id);
    return {
      id, level, pool, unit: null, size: Math.min(GENERAL_EXAM_SIZE, pool.length),
      eyebrow: `Examen general · Nivel ${level.name}`,
      title: `Examen nivel ${level.name.toLowerCase()}`
    };
  }

  function newAttempt(exam) {
    attempt = {
      id: exam.id,
      submitted: false,
      qs: shuffle(exam.pool).slice(0, exam.size).map(q => ({
        u: q.u, q: q.q, e: q.e,
        opts: shuffle(q.o.map(([t, c]) => ({ t, c: !!c }))),
        sel: new Set()
      }))
    };
  }

  function statsLine(st) {
    return st
      ? `<span>Mejor: <b class="${st.best >= PASS ? 'ok' : 'bad'}">${st.best}%</b></span>
         <span>Último: <b class="${st.last >= PASS ? 'ok' : 'bad'}">${st.last}%</b></span>
         <span>Intentos: <b>${st.attempts}</b></span>`
      : '<span>Todavía sin intentos</span>';
  }

  // Botones de los 3 niveles de una unidad (se usan en la página de ejercicios y en cada unidad).
  function unitLevelButtons(n) {
    return UNIT_LEVELS.map((l, i) => {
      const st = examStats[`u${n}-${l.id}`];
      return `<a class="ulevel lv-${i + 1}" href="#/examen/u${n}-${l.id}">
        <span class="ulevel-name">${l.name}</span>
        <span class="ulevel-score">${st ? `Mejor: <b class="${st.best >= PASS ? 'ok' : 'bad'}">${st.best}%</b> · ${st.attempts} intento${st.attempts > 1 ? 's' : ''}` : 'Sin intentos'}</span>
      </a>`;
    }).join('');
  }

  function renderExamHome() {
    if (attempt && attempt.submitted) attempt = null; // al elegir un examen otra vez, arranca un intento nuevo
    view.innerHTML = `
      <section class="hero">
        <div class="eyebrow">Práctica para el parcial</div>
        <h1>Ejercicios multiple choice</h1>
        <p class="exam-rules">Cada pregunta puede tener <b>una, dos o tres opciones correctas</b>, o <b>ninguna</b>.
          Si ninguna es correcta, no marques nada. Una pregunta cuenta como bien solo si marcás
          <b>exactamente</b> las correctas. Se aprueba con <b>${PASS}%</b>.</p>
      </section>
      <h2 class="block-title">Exámenes generales (todas las unidades)</h2>
      <div class="level-grid">
        ${LEVELS.map((l, i) => {
          const st = examStats[l.id];
          return `<a class="level-card lv-${i + 1}" href="#/examen/${l.id}">
            <div class="level-name">${l.name}</div>
            <p>${l.desc}</p>
            <div class="level-meta">${Math.min(GENERAL_EXAM_SIZE, generalPool(l.id).length)} preguntas al azar de ${generalPool(l.id).length}</div>
            <div class="level-stats">${statsLine(st)}</div>
            <span class="level-go">${st ? 'Volver a rendir' : 'Empezar'} →</span>
          </a>`;
        }).join('')}
      </div>
      <h2 class="block-title" style="margin-top:32px">Exámenes por unidad</h2>
      <p class="exam-rules" style="margin:-4px 0 14px">Solo preguntas de los temas de esa unidad. ${UNIT_EXAM_SIZE} preguntas elegidas al azar en cada intento.</p>
      <div class="unit-exams">
        ${examUnits.map(u => `
          <div class="unit-exam-row" style="--uc:${u.color}">
            <div class="unit-exam-title">
              <span class="unit-num">${esc(u.label.toUpperCase())}</span>
              <strong>${esc(u.title)}</strong>
            </div>
            <div class="ulevels">${unitLevelButtons(+u.n)}</div>
          </div>`).join('')}
      </div>`;
    window.scrollTo(0, 0);
  }

  function renderExam(examId) {
    const exam = getExam(examId);
    if (!exam) { renderExamHome(); return; }
    if (!attempt || attempt.id !== exam.id) newAttempt(exam);
    const a = attempt;
    const lvIdx = LEVELS.indexOf(exam.level) + 1;
    const backLabel = exam.unit ? 'Elegir otro examen' : 'Elegir otro nivel';

    let result = '';
    if (a.submitted) {
      const passed = a.score >= PASS;
      result = `
        <div class="result-box ${passed ? 'pass' : 'fail'}">
          <div class="result-pct">${a.score}%</div>
          <div>
            <div class="result-verdict">${passed ? 'Aprobado' : 'Desaprobado'}</div>
            <div class="result-detail">${a.correct} de ${a.qs.length} preguntas bien · se aprueba con ${PASS}%</div>
          </div>
          <div class="result-actions">
            <button class="primary-btn" data-exam="retry" type="button">Repetir examen</button>
            <a class="ghost-btn" href="#/examen">${backLabel}</a>
          </div>
        </div>`;
    }

    view.innerHTML = `
      <div class="lv-${lvIdx}">
        <header class="unit-head exam-head">
          <div class="eyebrow">${esc(exam.eyebrow)}</div>
          <h1>${esc(exam.title)}</h1>
          <p class="exam-rules">Puede haber <b>0, 1, 2 o 3</b> opciones correctas por pregunta. Si ninguna es correcta, no marques nada.
            Cada pregunta suma solo si marcás exactamente las correctas.</p>
        </header>
        ${result}
        ${a.qs.map((q, qi) => {
          const nCorrect = q.opts.filter(o => o.c).length;
          const ok = a.submitted && q.opts.every((o, oi) => o.c === q.sel.has(oi));
          return `
          <article class="q-card ${a.submitted ? (ok ? 'q-ok' : 'q-bad') : ''}">
            <div class="q-top">
              <span class="q-num">Pregunta ${qi + 1} de ${a.qs.length}</span>
              <span class="q-unit">Unidad ${roman[q.u]}</span>
              ${a.submitted ? `<span class="q-badge">${ok ? '✓ Bien' : '✗ Mal'}</span>` : ''}
            </div>
            <p class="q-text">${esc(q.q)}</p>
            <div class="q-opts">
              ${q.opts.map((o, oi) => {
                const checked = q.sel.has(oi);
                let cls = '', tag = '';
                if (a.submitted) {
                  if (o.c && checked) { cls = 'opt-hit'; tag = 'Correcta'; }
                  else if (o.c && !checked) { cls = 'opt-miss'; tag = 'Correcta, no la marcaste'; }
                  else if (!o.c && checked) { cls = 'opt-wrong'; tag = 'Incorrecta, la marcaste'; }
                }
                return `<label class="opt ${cls}">
                  <input type="checkbox" data-q="${qi}" data-o="${oi}" ${checked ? 'checked' : ''} ${a.submitted ? 'disabled' : ''}>
                  <span class="opt-letter">${letters[oi]})</span>
                  <span class="opt-text">${esc(o.t)}${tag ? `<em class="opt-tag">${tag}</em>` : ''}</span>
                </label>`;
              }).join('')}
            </div>
            ${a.submitted ? `<div class="q-explain">
              <b>${nCorrect === 0 ? 'Ninguna opción era correcta.' : nCorrect === 1 ? 'Había 1 opción correcta.' : `Había ${nCorrect} opciones correctas.`}</b>
              ${esc(q.e)}</div>` : ''}
          </article>`;
        }).join('')}
        <div class="exam-footer">
          ${a.submitted
            ? `<button class="primary-btn" data-exam="retry" type="button">Repetir examen</button>
               <a class="ghost-btn" href="#/examen">${backLabel}</a>`
            : `<button class="primary-btn" data-exam="submit" type="button">Entregar examen</button>
               <a class="ghost-btn" href="#/examen">Salir</a>`}
          ${exam.unit ? `<a class="ghost-btn" href="#/u${exam.unit}">Repasar la unidad</a>` : ''}
        </div>
      </div>`;
  }

  function submitExam() {
    const a = attempt;
    const blank = a.qs.filter(q => q.sel.size === 0).length;
    const msg = blank
      ? `Tenés ${blank} pregunta${blank > 1 ? 's' : ''} sin marcar. Se van a tomar como “ninguna es correcta”. ¿Entregar igual?`
      : '¿Entregar el examen?';
    if (!confirm(msg)) return;
    a.correct = a.qs.filter(q => q.opts.every((o, oi) => o.c === q.sel.has(oi))).length;
    a.score = Math.round(100 * a.correct / a.qs.length);
    a.submitted = true;
    const prev = examStats[a.id] || { best: 0, attempts: 0 };
    examStats[a.id] = { best: Math.max(prev.best, a.score), last: a.score, attempts: prev.attempts + 1 };
    store.set('isw-exam', examStats);
    renderExam(a.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  view.addEventListener('change', e => {
    const cb = e.target.closest('input[data-q]');
    if (!cb || !attempt || attempt.submitted) return;
    const q = attempt.qs[+cb.dataset.q];
    cb.checked ? q.sel.add(+cb.dataset.o) : q.sel.delete(+cb.dataset.o);
  });
  view.addEventListener('click', e => {
    const btn = e.target.closest('[data-exam]');
    if (!btn || !attempt) return;
    if (btn.dataset.exam === 'submit') submitExam();
    if (btn.dataset.exam === 'retry') {
      const exam = getExam(attempt.id);
      newAttempt(exam);
      renderExam(exam.id);
      window.scrollTo(0, 0);
    }
  });

  // ---------- Router por hash ----------
  let pendingHighlight = null;
  function route(keepScroll) {
    const [, unitId, secId] = location.hash.replace(/^#\/?/, '#/').split('/');
    const u = units.find(x => x.id === unitId);
    const y = window.scrollY;
    const collapsed = keepScroll ? [...view.querySelectorAll('.section.collapsed')].map(s => s.id) : [];
    renderNav(u ? u.id : (unitId === 'examen' ? 'examen' : null));
    if (unitId === 'examen') {
      if (secId) { renderExam(secId); if (!keepScroll) window.scrollTo(0, 0); }
      else renderExamHome();
    }
    else if (u) renderUnit(u, keepScroll ? null : secId, pendingHighlight);
    else renderHome();
    pendingHighlight = null;
    if (keepScroll) {
      collapsed.forEach(id => { const s = document.getElementById(id); if (s) s.classList.add('collapsed'); });
      window.scrollTo(0, y);
    }
    document.getElementById('sidebar').classList.remove('open');
  }
  window.addEventListener('hashchange', () => route(false));

  // ---------- Búsqueda ----------
  const search = document.getElementById('search');
  const results = document.getElementById('results');
  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  search.addEventListener('input', () => {
    const q = search.value.trim();
    if (q.length < 2) { results.hidden = true; return; }
    const nq = norm(q);
    const hits = [];
    units.forEach(u => u.sections.forEach(s => {
      const hay = norm(s.title + ' ' + s.plain);
      if (hay.indexOf(nq) < 0) return;
      const count = hay.split(nq).length - 1;
      const inPlain = norm(s.plain).indexOf(nq);
      const from = Math.max(0, inPlain - 50);
      const raw = inPlain >= 0 ? s.plain.substr(from, 150) : s.plain.substr(0, 150);
      const original = inPlain >= 0 ? s.plain.substr(inPlain, q.length) : '';
      hits.push({ u, s, count, raw, original, from });
    }));
    hits.sort((a, b) => b.count - a.count);
    if (!hits.length) { results.innerHTML = '<div class="empty">Sin resultados.</div>'; results.hidden = false; return; }
    results.innerHTML = hits.slice(0, 20).map(h => {
      let snip = esc(h.raw);
      if (h.original) snip = snip.replace(esc(h.original), `<mark>${esc(h.original)}</mark>`);
      return `<a class="result" href="#/${h.u.id}/${h.s.id}" data-term="${esc(h.original)}">
        <div class="result-title">${esc(h.s.title)}</div>
        <div class="result-meta">${esc(h.u.label)} · ${h.count} coincidencia${h.count > 1 ? 's' : ''}</div>
        <div class="result-snip">${h.from > 0 ? '…' : ''}${snip}…</div></a>`;
    }).join('');
    results.hidden = false;
  });
  results.addEventListener('click', e => {
    const a = e.target.closest('.result');
    if (!a) return;
    pendingHighlight = a.dataset.term || null;
    results.hidden = true;
    if (location.hash === a.getAttribute('href')) { e.preventDefault(); route(false); }
  });
  document.addEventListener('click', e => { if (!e.target.closest('.search')) results.hidden = true; });
  document.addEventListener('keydown', e => {
    if (e.key === '/' && document.activeElement !== search) { e.preventDefault(); search.focus(); }
    if (e.key === 'Escape') { results.hidden = true; search.blur(); }
  });

  // ---------- Tema, menú móvil, reinicio ----------
  const root = document.documentElement;
  const savedTheme = store.get('isw-theme', null);
  if (savedTheme) root.dataset.theme = savedTheme;
  document.getElementById('themeBtn').addEventListener('click', () => {
    const current = root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    root.dataset.theme = current === 'dark' ? 'light' : 'dark';
    store.set('isw-theme', root.dataset.theme);
  });
  document.getElementById('menuBtn').addEventListener('click', () =>
    document.getElementById('sidebar').classList.toggle('open'));
  document.getElementById('resetBtn').addEventListener('click', () => {
    if (confirm('¿Borrar todo el progreso de estudio?')) { done = new Set(); saveDone(); route(true); }
  });

  route(false);
})();
