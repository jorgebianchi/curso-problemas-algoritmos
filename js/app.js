/* Curso: Resolución de problemas y algoritmos — lógica de la app (vanilla JS) */
(function () {
  "use strict";

  const KEY = "rpa-progreso-v1";
  const THEME_KEY = "rpa-tema";
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------- Estado ---------- */
  const vacio = () => ({ tareas: {}, notas: {}, confianza: {}, sesiones: [], config: { inicio: "", horasMeta: 10, nombre: "" } });
  let S = cargar();
  function cargar() {
    try {
      const d = JSON.parse(localStorage.getItem(KEY));
      if (!d) return vacio();
      const v = vacio();
      return { ...v, ...d, config: { ...v.config, ...(d.config || {}) } };
    } catch { return vacio(); }
  }
  function guardar() { localStorage.setItem(KEY, JSON.stringify(S)); }

  /* ---------- Helpers de dominio ---------- */
  const tid = (n, i) => `s${n}-${i}`;
  const semana = (n) => SEMANAS.find((s) => s.n === n);
  const materia = (id) => MATERIAS.find((m) => m.id === id);
  function progSemana(s) {
    const total = s.tareas.length;
    const hechas = s.tareas.filter((_, i) => S.tareas[tid(s.n, i)]).length;
    return { hechas, total, pct: total ? Math.round((hechas / total) * 100) : 0 };
  }
  function progLista(sems) {
    let h = 0, t = 0;
    sems.forEach((s) => { const p = progSemana(s); h += p.hechas; t += p.total; });
    return { hechas: h, total: t, pct: t ? Math.round((h / t) * 100) : 0 };
  }
  const progMateria = (m) => progLista(m.semanas.map(semana));
  const progGlobal = () => progLista(SEMANAS);

  function parseFecha(str) { const [y, m, d] = str.split("-").map(Number); return new Date(y, m - 1, d); }
  function fmtFecha(d) { return d.toLocaleDateString("es-AR", { day: "numeric", month: "short" }); }
  function hoyISO() { const d = new Date(); return new Date(d - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10); }
  function rangoSemana(n) {
    if (!S.config.inicio) return null;
    const a = parseFecha(S.config.inicio); a.setDate(a.getDate() + (n - 1) * 7);
    const b = new Date(a); b.setDate(b.getDate() + 6);
    return [a, b];
  }
  function semanaCalendario() {
    if (!S.config.inicio) return null;
    const dias = Math.floor((new Date().setHours(0, 0, 0, 0) - parseFecha(S.config.inicio)) / 864e5);
    if (dias < 0) return 0;
    return Math.min(SEMANAS.length, Math.floor(dias / 7) + 1);
  }
  function semanaSiguiente() {
    const s = SEMANAS.find((s) => progSemana(s).pct < 100);
    return s ? s.n : null;
  }
  function estado() {
    const cal = semanaCalendario();
    const sig = semanaSiguiente();
    if (cal === null) return { txt: "Definí una fecha de inicio en Progreso para ver tu calendario.", cls: "" };
    if (cal === 0) return { txt: "El curso todavía no empezó según tu fecha de inicio.", cls: "" };
    if (sig === null) return { txt: "¡Curso completado! 🎉", cls: "accent" };
    const atraso = cal - sig;
    if (atraso <= 0) return { txt: `Vas al día (semana ${cal} del calendario).`, cls: "accent" };
    return { txt: `Vas ${atraso} semana${atraso > 1 ? "s" : ""} atrasado/a (calendario: semana ${cal}, estás en la ${sig}).`, cls: "warn" };
  }
  function minutosPorSemana() {
    const r = {};
    S.sesiones.forEach((x) => { r[x.semana] = (r[x.semana] || 0) + Number(x.min || 0); });
    return r;
  }
  function racha() {
    const dias = new Set(S.sesiones.map((x) => x.fecha));
    let c = 0; const d = new Date();
    if (!dias.has(hoyISO())) d.setDate(d.getDate() - 1); // si hoy no estudiaste aún, la racha cuenta hasta ayer
    for (;;) {
      const iso = new Date(d - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
      if (!dias.has(iso)) break;
      c++; d.setDate(d.getDate() - 1);
    }
    return c;
  }

  const bar = (pct, big) => `<div class="bar${big ? " big" : ""}" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pct}%"></i></div>`;
  const libro = (id) => BIBLIO[id];

  /* ---------- Vistas ---------- */
  function vInicio() {
    const g = progGlobal(), e = estado(), sig = semanaSiguiente();
    const saludo = S.config.nombre ? `Hola, ${esc(S.config.nombre)}.` : "";
    return `
<div class="eyebrow">Curso autodidacta · 1 cuatrimestre · 16 semanas</div>
<h1>Resolución de problemas y algoritmos</h1>
<p class="lead">${saludo} Un plan guiado para aprender a pensar problemas, expresarlos como algoritmos, programarlos en Python y analizarlos. Seis materias, lecturas concretas, práctica en jueces online, evaluaciones y un proyecto integrador.</p>

<div class="card">
  <div style="display:flex;justify-content:space-between;align-items:baseline;gap:1rem;flex-wrap:wrap">
    <strong>Tu avance</strong><span class="pct">${g.hechas} / ${g.total} actividades · ${g.pct}%</span>
  </div>
  <div style="margin:.6rem 0 .8rem">${bar(g.pct, true)}</div>
  <span class="tag ${e.cls}">${e.txt}</span>
  <div class="btn-row">
    ${sig ? `<a class="btn primary" href="#/semana/${sig}">Continuar: semana ${sig} →</a>` : ""}
    <a class="btn" href="#/plan">Ver plan</a>
    <a class="btn" href="#/guia">Cómo estudiar</a>
  </div>
</div>

<h2>Materias</h2>
<ul class="list-plain">
${MATERIAS.map((m) => {
  const p = progMateria(m);
  return `<li><a class="row-link" href="#/materia/${m.id}">
    <span class="n">${String(m.n).padStart(2, "0")}</span>
    <span><span class="t">${esc(m.nombre)}</span><br><span class="s">Semanas ${m.semanas[0]}–${m.semanas[m.semanas.length - 1]}</span></span>
    <span>${bar(p.pct)}<span class="pct">${p.pct}%</span></span></a></li>`;
}).join("")}
</ul>

<h2>Cómo funciona</h2>
<ol>
  <li><strong>Configurá</strong> tu fecha de inicio y meta de horas en <a href="#/progreso">Progreso</a>.</li>
  <li><strong>Cada semana</strong> leé la lección, hacé las lecturas indicadas y marcá las actividades a medida que las completás.</li>
  <li><strong>Resolvé problemas</strong> con la ficha de Pólya y envialos a un juez online hasta obtener «Accepted».</li>
  <li><strong>Registrá</strong> tus sesiones de estudio, tu nivel de confianza y tus notas.</li>
  <li><strong>Evaluate</strong> en la semana 8 (parcial) y la 16 (final + proyecto).</li>
</ol>
<p class="faint">Tu avance se guarda en este navegador. Exportalo periódicamente desde Progreso para tener una copia.</p>`;
  }

  function vPlan() {
    const cal = semanaCalendario();
    return `
<div class="eyebrow">Cronograma</div>
<h1>Plan de estudio</h1>
<p class="lead">16 semanas de ~10–12 horas. Si tenés menos tiempo, estirá el plan a 24 semanas: lo importante es no saltear la práctica.</p>
${MATERIAS.map((m) => {
  const p = progMateria(m);
  return `
<div class="materia-head"><h2><a href="#/materia/${m.id}" style="color:inherit;text-decoration:none">${m.n}. ${esc(m.nombre)}</a></h2><span class="pct">${p.pct}%</span></div>
<ul class="list-plain">
${m.semanas.map(semana).map((s) => {
  const ps = progSemana(s), r = rangoSemana(s.n);
  const hito = s.tareas.some((t) => t.t === "examen") ? ' <span class="tag warn">evaluación</span>' : s.tareas.some((t) => t.t === "proyecto") ? ' <span class="tag">proyecto</span>' : "";
  return `<li><a class="row-link${cal === s.n ? " current" : ""}" href="#/semana/${s.n}">
    <span class="n">S${String(s.n).padStart(2, "0")}</span>
    <span><span class="t">${esc(s.titulo)}</span>${hito}<br><span class="s">${r ? fmtFecha(r[0]) + " – " + fmtFecha(r[1]) + " · " : ""}~${s.horas} h · ${ps.hechas}/${ps.total}</span></span>
    <span>${bar(ps.pct)}<span class="pct">${ps.pct}%</span></span></a></li>`;
}).join("")}
</ul>`;
}).join("")}`;
  }

  function vMateria(id) {
    const m = materia(id);
    if (!m) return vNoEncontrado();
    const p = progMateria(m);
    return `
<div class="eyebrow"><a href="#/plan">Plan</a> · Materia ${m.n}</div>
<h1>${esc(m.nombre)}</h1>
<p class="lead">${esc(m.desc)}</p>
<div style="margin:1rem 0">${bar(p.pct, true)}<span class="pct">${p.hechas}/${p.total} actividades · ${p.pct}%</span></div>
<h2>Objetivos</h2>
<ul>${m.objetivos.map((o) => `<li>${esc(o)}</li>`).join("")}</ul>
<h2>Semanas</h2>
<ul class="list-plain">
${m.semanas.map(semana).map((s) => { const ps = progSemana(s); return `<li><a class="row-link" href="#/semana/${s.n}"><span class="n">S${String(s.n).padStart(2, "0")}</span><span class="t">${esc(s.titulo)}</span><span>${bar(ps.pct)}<span class="pct">${ps.pct}%</span></span></a></li>`; }).join("")}
</ul>
<h2>Bibliografía de la materia</h2>
<ul>${[...new Set(m.semanas.flatMap((n) => semana(n).lecturas.map((l) => l.b)))].map((b) => `<li>${esc(libro(b).autor)} — <em>${esc(libro(b).titulo)}</em></li>`).join("")}</ul>`;
  }

  function linkLibro(b) {
    const L = libro(b);
    const links = [];
    if (L.url) links.push(`<a href="${L.url}" target="_blank" rel="noopener">online</a>`);
    if (L.local) links.push(`<a href="${encodeURI(L.local)}" target="_blank" rel="noopener" title="Disponible sólo si tenés el PDF en la carpeta del curso">PDF local</a>`);
    return links.length ? ` <span class="faint">(${links.join(" · ")})</span>` : "";
  }

  function vSemana(n) {
    const s = semana(n);
    if (!s) return vNoEncontrado();
    const m = materia(s.m), p = progSemana(s), r = rangoSemana(n);
    const conf = S.confianza[n] || 0;
    const prev = semana(n - 1), next = semana(n + 1);
    return `
<div class="eyebrow"><a href="#/materia/${m.id}">Materia ${m.n} · ${esc(m.nombre)}</a></div>
<h1>Semana ${n}: ${esc(s.titulo)}</h1>
<p class="faint">${r ? fmtFecha(r[0]) + " – " + fmtFecha(r[1]) + " · " : ""}Dedicación estimada: ~${s.horas} horas</p>
<div style="margin:1rem 0 0">${bar(p.pct, true)}<span class="pct" id="wk-pct">${p.hechas}/${p.total} actividades · ${p.pct}%</span></div>

<h2>Objetivos</h2>
<ul>${s.objetivos.map((o) => `<li>${esc(o)}</li>`).join("")}</ul>

<h2>Lección</h2>
<div class="lesson">${s.leccion}</div>

<h2>Lecturas</h2>
<ul>${s.lecturas.map((l) => `<li><strong>${esc(libro(l.b).autor)}</strong>, <em>${esc(libro(l.b).titulo)}</em>: ${esc(l.c)}${linkLibro(l.b)}</li>`).join("")}</ul>

<h2>Recursos complementarios</h2>
<ul>${s.recursos.map((x) => `<li><a href="${x.u}" target="_blank" rel="noopener">${esc(x.n)}</a></li>`).join("")}</ul>

<h2>Actividades</h2>
<p class="faint">Marcá cada actividad al terminarla. En los problemas, «terminada» = aceptada por el juez <em>y</em> con ficha de Pólya.</p>
<ul class="tasks">
${s.tareas.map((t, i) => {
  const id = tid(n, i), done = !!S.tareas[id];
  return `<li class="task${done ? " done" : ""}">
    <input type="checkbox" id="${id}" data-task="${id}" ${done ? "checked" : ""}>
    <label for="${id}"><span class="kind">${TIPOS[t.t] || t.t}</span><span class="tx">${esc(t.x)}</span></label>
    ${t.u ? `<a href="${t.u}" target="_blank" rel="noopener">abrir ↗</a>` : ""}
  </li>`;
}).join("")}
</ul>

<h2>Autoevaluación</h2>
<ul>${s.autoeval.map((q) => `<li>${esc(q)}</li>`).join("")}</ul>
<p class="muted" style="margin-bottom:.4rem">¿Qué tan seguro/a te sentís con los temas de esta semana?</p>
<div class="scale" role="radiogroup">
${[1, 2, 3, 4, 5].map((v) => `<label><input type="radio" name="conf" value="${v}" ${conf === v ? "checked" : ""}><span>${v} · ${["nada", "poco", "regular", "bastante", "muy"][v - 1]}</span></label>`).join("")}
</div>
<p class="faint" style="margin-top:.5rem">Si marcás 1 o 2, repasá antes de avanzar: releé la lección y rehacé un problema sin mirar.</p>

<h2>Notas de la semana</h2>
<textarea id="notas" placeholder="Dudas, ideas, errores frecuentes, fichas de Pólya, notas de parcial…">${esc(S.notas[n] || "")}</textarea>
<p class="faint" id="notas-ok">Se guarda automáticamente.</p>

<div class="pager">
  ${prev ? `<a href="#/semana/${prev.n}">← Semana ${prev.n}<strong>${esc(prev.titulo)}</strong></a>` : "<span></span>"}
  ${next ? `<a href="#/semana/${next.n}" style="text-align:right">Semana ${next.n} →<strong>${esc(next.titulo)}</strong></a>` : "<span></span>"}
</div>`;
  }

  function vGuia() {
    return `
<div class="eyebrow">Metodología</div>
<h1>Cómo estudiar este curso</h1>
<p class="lead">Aprender algoritmos es como aprender un deporte: se lee para entender, pero se aprende practicando. Esta guía te dice cómo organizarte, cómo encarar cada problema y cómo evaluarte.</p>

<h2>Rutina semanal sugerida (~11 h)</h2>
<table>
<tr><th>Bloque</th><th>Tiempo</th><th>Qué hacer</th></tr>
<tr><td>Lunes</td><td>2 h</td><td>Lección del sitio + lectura principal. Resumen a mano.</td></tr>
<tr><td>Martes</td><td>2 h</td><td>Videos/recursos y ejercicios de práctica (libro de problemas).</td></tr>
<tr><td>Miércoles</td><td>2 h</td><td>Problemas de juez online (primeros 2–3).</td></tr>
<tr><td>Jueves</td><td>2 h</td><td>Problemas restantes. Si te trabás, ver «Cuando te trabás».</td></tr>
<tr><td>Viernes/sábado</td><td>2–3 h</td><td>Reflexión, autoevaluación, notas, repaso de lo que falló. Proyecto (semanas 12–16).</td></tr>
</table>

<h2>Ficha de Pólya (usala en cada problema)</h2>
<pre><code>PROBLEMA: (nombre + link)
1. COMPRENDER
   - Incógnita / qué devolver:
   - Datos y restricciones (¿n máximo? ¿valores?):
   - Ejemplo propio resuelto a mano:
   - Casos borde:
2. PLAN
   - ¿Problema parecido que ya resolví?:
   - Idea / técnica (fuerza bruta, ordenar, binaria, DP, grafo…):
   - Complejidad esperada y ¿alcanza para las restricciones?:
3. EJECUCIÓN
   - Pseudocódigo → código. Veredictos del juez y qué corregí:
4. REVISIÓN
   - ¿Por qué es correcto? (invariante / argumento):
   - ¿Otra forma de resolverlo? ¿Qué aprendí que pueda reutilizar?</code></pre>

<h2>Cuando te trabás</h2>
<ol>
<li><strong>15 minutos</strong> pensando sin código: casos chicos a mano, dibujos.</li>
<li><strong>Repasá la lista de preguntas de Pólya</strong>: ¿usaste todos los datos? ¿conocés un problema relacionado?</li>
<li><strong>Fuerza bruta primero</strong>: aunque sea lenta, te da algo correcto para comparar.</li>
<li><strong>45–60 minutos</strong> sin avance: buscá una pista (no la solución) — en el foro del juez, en el libro o en la lección.</li>
<li>Si leíste la solución: cerrala, esperá un día y <strong>reescribila de cero</strong>. Marcalo en tus notas para repasar.</li>
</ol>

<h2>Evaluación y aprobación</h2>
<table>
<tr><th>Instancia</th><th>Peso</th><th>Cuándo</th></tr>
<tr><td>Actividades semanales completadas</td><td>30 %</td><td>Todo el cuatrimestre</td></tr>
<tr><td>Primer parcial</td><td>20 %</td><td>Semana 8</td></tr>
<tr><td>Proyecto integrador</td><td>25 %</td><td>Semanas 12–16</td></tr>
<tr><td>Examen final</td><td>25 %</td><td>Semana 16</td></tr>
</table>
<p>Aprobás con <strong>60 %</strong> o más en cada instancia. Rúbrica para cada ejercicio de parcial/final (sobre 10): <strong>correctitud</strong> (4: el juez lo acepta o el argumento es válido), <strong>análisis</strong> (3: ficha de Pólya y complejidad justificadas), <strong>claridad</strong> (2: nombres, funciones, comentarios del invariante), <strong>casos borde</strong> (1).</p>

<h2>Proyecto integrador: ideas</h2>
<ul>
<li><strong>Resolvedor de laberintos:</strong> leer un laberinto de un archivo de texto, resolver con BFS/DFS, mostrar el camino y comparar.</li>
<li><strong>Planificador de rutas:</strong> mapa de ciudades con distancias (por ejemplo, de tu provincia), Dijkstra y MST.</li>
<li><strong>Sudoku:</strong> backtracking con poda; medir cuántos nodos explora con y sin heurísticas.</li>
<li><strong>Corrector ortográfico:</strong> distancia de edición (DP) + diccionario (hash) para sugerir palabras.</li>
<li><strong>Comparador de ordenamientos:</strong> 6 algoritmos, gráfico de tiempos y análisis de casos (ordenado, inverso, aleatorio).</li>
<li><strong>Planificador de materias:</strong> correlatividades como grafo dirigido; orden topológico y detección de ciclos.</li>
</ul>
<p>Entregable: repositorio con código, tests (asserts), README con el problema, decisiones, ficha de Pólya y análisis de complejidad.</p>

<h2>Configuración técnica</h2>
<ul>
<li>Python 3.10+ y VS Code (o Thonny). Un repositorio git propio con una carpeta por semana.</li>
<li>Cuentas en <a href="https://cses.fi/problemset/" target="_blank" rel="noopener">CSES</a>, <a href="https://aceptaelreto.com/" target="_blank" rel="noopener">Acepta el Reto</a> y <a href="https://leetcode.com/" target="_blank" rel="noopener">LeetCode</a>.</li>
<li>Plantilla para jueces en Python (lectura rápida):</li>
</ul>
<pre><code>import sys
input = sys.stdin.readline

def main():
    n = int(input())
    v = list(map(int, input().split()))
    # ...
    print(resultado)

main()</code></pre>

<h2>¿Y ahora qué?</h2>
<p>Al terminar, seguí con <a href="https://ossu.dev/" target="_blank" rel="noopener">OSSU Computer Science</a> (Core programming / Core theory), el curso de Princeton en Coursera y los problemas restantes del CSES. Si te interesa competir, la <a href="https://usaco.guide/" target="_blank" rel="noopener">USACO Guide</a> y los AtCoder Beginner Contests son el siguiente paso natural.</p>`;
  }

  function vBiblio() {
    const item = (L) => `<div class="biblio-item"><div class="ti">${esc(L.titulo)}</div>
      <div class="meta">${esc(L.autor)} · ${esc(L.editorial)} · ${esc(L.anio)} · <span class="tag">${L.idioma === "es" ? "español" : "inglés"}</span>
      ${L.url ? ` · <a href="${L.url}" target="_blank" rel="noopener">acceso libre ↗</a>` : ""}${L.local ? ` · <a href="${encodeURI(L.local)}" target="_blank" rel="noopener">PDF local</a>` : ""}</div>
      <div class="muted" style="font-size:.92rem;margin-top:.25rem">${esc(L.nota)}</div></div>`;
    const todos = Object.values(BIBLIO);
    const link = (x) => `<div class="biblio-item"><div class="ti"><a href="${x.u}" target="_blank" rel="noopener">${esc(x.n)} ↗</a></div><div class="muted" style="font-size:.92rem">${esc(x.d)}</div></div>`;
    return `
<div class="eyebrow">Material</div>
<h1>Bibliografía y recursos</h1>
<p class="lead">Los tres libros base cubren el núcleo. El resto amplía, ofrece otro enfoque o es de acceso libre.</p>
<h2>Libros base</h2>
${todos.filter((l) => l.base).map(item).join("")}
<p class="faint">Los enlaces «PDF local» funcionan cuando abrís el sitio desde la carpeta del curso con tus copias de los libros (no se publican en el repositorio).</p>
<h2>Complementarios en español</h2>
${todos.filter((l) => !l.base && l.idioma === "es").map(item).join("")}
<h2>Complementarios en inglés</h2>
${todos.filter((l) => !l.base && l.idioma === "en").map(item).join("")}
<h2>Jueces online y práctica</h2>
${PLATAFORMAS.map(link).join("")}
<h2>Cursos y videos</h2>
${CURSOS.map(link).join("")}
<h2>Visualizadores y referencias</h2>
${HERRAMIENTAS.map(link).join("")}`;
  }

  function chartHoras() {
    const mins = minutosPorSemana();
    const W = 640, H = 170, pad = 22, n = SEMANAS.length;
    const meta = Number(S.config.horasMeta) || 0;
    const max = Math.max(meta, ...SEMANAS.map((s) => (mins[s.n] || 0) / 60), 1);
    const bw = (W - pad * 2) / n;
    const y = (h) => H - pad - (h / max) * (H - pad * 2);
    let out = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Horas registradas por semana">`;
    out += `<line class="axis" x1="${pad}" x2="${W - pad}" y1="${H - pad}" y2="${H - pad}"/>`;
    SEMANAS.forEach((s, i) => {
      const h = (mins[s.n] || 0) / 60, x = pad + i * bw + bw * 0.18, top = y(h);
      out += `<rect class="b" x="${x}" y="${top}" width="${bw * 0.64}" height="${H - pad - top}" rx="2"><title>Semana ${s.n}: ${h.toFixed(1)} h</title></rect>`;
      out += `<text x="${x + bw * 0.32}" y="${H - 8}" text-anchor="middle">${s.n}</text>`;
    });
    if (meta) out += `<line class="goal" x1="${pad}" x2="${W - pad}" y1="${y(meta)}" y2="${y(meta)}"/><text x="${W - pad}" y="${y(meta) - 4}" text-anchor="end">meta ${meta} h</text>`;
    return out + "</svg>";
  }

  function vProgreso() {
    const g = progGlobal(), e = estado();
    const totalMin = S.sesiones.reduce((a, x) => a + Number(x.min || 0), 0);
    const confs = Object.values(S.confianza).map(Number).filter(Boolean);
    const confProm = confs.length ? (confs.reduce((a, b) => a + b, 0) / confs.length).toFixed(1) : "–";
    const sig = semanaSiguiente();
    const sesiones = [...S.sesiones].sort((a, b) => b.fecha.localeCompare(a.fecha) || b.id - a.id);
    const repasar = SEMANAS.filter((s) => S.confianza[s.n] && S.confianza[s.n] <= 2);
    return `
<div class="eyebrow">Seguimiento</div>
<h1>Tu progreso</h1>
<p><span class="tag ${e.cls}">${e.txt}</span></p>

<div class="grid" style="margin-top:1.2rem">
  <div class="stat"><div class="v">${g.pct}%</div><div class="k">${g.hechas} de ${g.total} actividades</div></div>
  <div class="stat"><div class="v">${(totalMin / 60).toFixed(1)} h</div><div class="k">estudiadas (${S.sesiones.length} sesiones)</div></div>
  <div class="stat"><div class="v">${racha()}</div><div class="k">días seguidos de estudio</div></div>
  <div class="stat"><div class="v">${confProm}</div><div class="k">confianza promedio (1–5)</div></div>
</div>
${repasar.length ? `<div class="callout warn">Para repasar (confianza baja): ${repasar.map((s) => `<a href="#/semana/${s.n}">semana ${s.n}</a>`).join(", ")}.</div>` : ""}

<h2>Registrar sesión de estudio</h2>
<form id="f-sesion" class="card">
  <div class="form-row">
    <div class="field"><label for="s-fecha">Fecha</label><input type="date" id="s-fecha" value="${hoyISO()}" required></div>
    <div class="field"><label for="s-min">Minutos</label><input type="number" id="s-min" min="5" max="720" step="5" value="60" required></div>
    <div class="field"><label for="s-sem">Semana</label><select id="s-sem">${SEMANAS.map((s) => `<option value="${s.n}" ${s.n === (sig || 16) ? "selected" : ""}>Semana ${s.n}</option>`).join("")}</select></div>
  </div>
  <div class="field"><label for="s-nota">¿Qué hiciste? (opcional)</label><input type="text" id="s-nota" maxlength="200" placeholder="Ej.: lectura Joyanes cap. 4 y 2 problemas CSES"></div>
  <button class="btn primary" type="submit">Guardar sesión</button>
</form>

<h2>Horas por semana</h2>
${chartHoras()}

<h2>Por materia</h2>
${MATERIAS.map((m) => { const p = progMateria(m); return `<div style="margin:.7rem 0"><div style="display:flex;justify-content:space-between;gap:1rem"><a href="#/materia/${m.id}">${m.n}. ${esc(m.nombre)}</a><span class="pct">${p.hechas}/${p.total}</span></div>${bar(p.pct)}</div>`; }).join("")}

<h2>Historial de sesiones</h2>
${sesiones.length ? `<table><tr><th>Fecha</th><th>Sem.</th><th>Min</th><th>Nota</th><th></th></tr>
${sesiones.slice(0, 50).map((x) => `<tr><td>${esc(x.fecha)}</td><td>${x.semana}</td><td>${x.min}</td><td>${esc(x.nota)}</td><td><button class="btn" data-del="${x.id}" title="Borrar" style="padding:.1rem .45rem">×</button></td></tr>`).join("")}</table>` : `<p class="faint">Todavía no registraste sesiones.</p>`}

<h2>Configuración</h2>
<form id="f-config" class="card">
  <div class="form-row">
    <div class="field"><label for="c-nombre">Tu nombre (opcional)</label><input type="text" id="c-nombre" value="${esc(S.config.nombre)}" maxlength="40"></div>
    <div class="field"><label for="c-inicio">Fecha de inicio</label><input type="date" id="c-inicio" value="${esc(S.config.inicio)}"></div>
    <div class="field"><label for="c-meta">Meta de horas/semana</label><input type="number" id="c-meta" min="1" max="60" value="${esc(S.config.horasMeta)}"></div>
  </div>
  <button class="btn primary" type="submit">Guardar configuración</button>
</form>

<h2>Respaldo</h2>
<p class="muted">El progreso vive en el almacenamiento local de este navegador. Exportalo para tener copia o pasarlo a otra computadora.</p>
<div class="btn-row">
  <button class="btn" id="b-export">Exportar progreso (.json)</button>
  <label class="btn" for="b-import">Importar progreso…</label><input type="file" id="b-import" accept="application/json,.json" hidden>
  <button class="btn" onclick="window.print()">Imprimir</button>
  <button class="btn danger" id="b-reset">Borrar todo</button>
</div>`;
  }

  function vNoEncontrado() {
    return `<h1>No encontrado</h1><p><a href="#/">Volver al inicio</a></p>`;
  }

  /* ---------- Router ---------- */
  const app = $("#app");
  function render() {
    const h = location.hash.replace(/^#\/?/, "");
    const [r, a] = h.split("/");
    let html, nav = r || "inicio";
    if (!r || r === "inicio") html = vInicio();
    else if (r === "plan") html = vPlan();
    else if (r === "semana") { html = vSemana(Number(a)); nav = "plan"; }
    else if (r === "materia") { html = vMateria(a); nav = "plan"; }
    else if (r === "guia") html = vGuia();
    else if (r === "bibliografia") html = vBiblio();
    else if (r === "progreso") html = vProgreso();
    else html = vNoEncontrado();
    app.innerHTML = html;
    document.querySelectorAll("nav.main a").forEach((x) => x.classList.toggle("active", x.dataset.nav === nav));
    const s = r === "semana" ? semana(Number(a)) : null;
    document.title = (s ? `Semana ${s.n} · ` : "") + "Resolución de problemas y algoritmos";
    window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", render);

  /* ---------- Eventos (delegados) ---------- */
  let toastT;
  function toast(msg) {
    const t = $("#toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 1800);
  }

  app.addEventListener("change", (ev) => {
    const el = ev.target;
    if (el.dataset.task) {
      if (el.checked) S.tareas[el.dataset.task] = new Date().toISOString();
      else delete S.tareas[el.dataset.task];
      guardar();
      el.closest(".task").classList.toggle("done", el.checked);
      const n = Number(el.dataset.task.slice(1).split("-")[0]);
      const p = progSemana(semana(n));
      $("#wk-pct").textContent = `${p.hechas}/${p.total} actividades · ${p.pct}%`;
      const b = $(".bar.big > i"); if (b) b.style.width = p.pct + "%";
      if (p.pct === 100 && el.checked) toast(`¡Semana ${n} completa!`);
    } else if (el.name === "conf") {
      const n = Number(location.hash.split("/")[2]);
      S.confianza[n] = Number(el.value); guardar(); toast("Confianza registrada");
    } else if (el.id === "b-import" && el.files[0]) {
      const fr = new FileReader();
      fr.onload = () => {
        try {
          const d = JSON.parse(fr.result);
          if (typeof d !== "object" || !d.tareas) throw new Error();
          if (!confirm("Esto reemplaza tu progreso actual por el del archivo. ¿Continuar?")) return;
          localStorage.setItem(KEY, JSON.stringify(d)); S = cargar(); render(); toast("Progreso importado");
        } catch { alert("El archivo no es un respaldo válido."); }
      };
      fr.readAsText(el.files[0]);
    }
  });

  let notasT;
  app.addEventListener("input", (ev) => {
    if (ev.target.id !== "notas") return;
    const n = Number(location.hash.split("/")[2]);
    clearTimeout(notasT);
    notasT = setTimeout(() => { S.notas[n] = ev.target.value; guardar(); $("#notas-ok").textContent = "Guardado ✓"; }, 400);
  });

  app.addEventListener("submit", (ev) => {
    ev.preventDefault();
    if (ev.target.id === "f-sesion") {
      S.sesiones.push({ id: Date.now(), fecha: $("#s-fecha").value, min: Number($("#s-min").value), semana: Number($("#s-sem").value), nota: $("#s-nota").value.trim() });
      guardar(); render(); toast("Sesión guardada");
    } else if (ev.target.id === "f-config") {
      S.config = { nombre: $("#c-nombre").value.trim(), inicio: $("#c-inicio").value, horasMeta: Number($("#c-meta").value) || 10 };
      guardar(); render(); toast("Configuración guardada");
    }
  });

  app.addEventListener("click", (ev) => {
    const el = ev.target.closest("button");
    if (!el) return;
    if (el.dataset.del) {
      S.sesiones = S.sesiones.filter((x) => String(x.id) !== el.dataset.del); guardar(); render();
    } else if (el.id === "b-export") {
      const blob = new Blob([JSON.stringify(S, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob); a.download = `progreso-algoritmos-${hoyISO()}.json`; a.click();
      URL.revokeObjectURL(a.href);
    } else if (el.id === "b-reset") {
      if (confirm("¿Borrar TODO tu progreso, notas y sesiones? No se puede deshacer (exportá antes).")) { S = vacio(); guardar(); render(); toast("Progreso borrado"); }
    }
  });

  /* ---------- Tema ---------- */
  function aplicarTema(t) {
    document.documentElement.dataset.theme = t;
    $("#theme-btn").innerHTML = t === "dark"
      ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>'
      : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
    $("#theme-btn").setAttribute("aria-label", t === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
  }
  const temaGuardado = localStorage.getItem(THEME_KEY);
  aplicarTema(temaGuardado || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
  $("#theme-btn").addEventListener("click", () => {
    const t = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_KEY, t); aplicarTema(t);
  });

  render();
})();
