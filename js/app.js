/* Curso: Resolución de problemas y algoritmos — lógica de la app (vanilla JS) */
(function () {
  "use strict";

  const KEY = "rpa-progreso-v1";
  const THEME_KEY = "rpa-tema";
  const $ = (s, r = document) => r.querySelector(s);
  const ARR = '<svg class="arr" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 9 9 3M4 3h5v5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const FICHA = "descargas/ficha-polya.pdf";
  const DL = '<svg class="arr" viewBox="0 0 12 12" aria-hidden="true"><path d="M6 1.5v6.5M3.2 5.4 6 8.2l2.8-2.8M2 10.5h8" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
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
    if (cal === null) return { txt: "Definí una fecha de inicio en «Mi progreso» para ver tu calendario.", cls: "" };
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
  const pad2 = (n) => String(n).padStart(2, "0");
  const sec = (num, titulo, cuerpo, extra = "") => `
<section class="sec"${extra}>
  <div class="sec-title"><span class="n">${num}</span><h2>${titulo}</h2></div>
  <div class="sec-body">${cuerpo}</div>
</section>`;
  const pageHero = (eyebrow, titulo, lead = "", extra = "") => `
<div class="page-hero"><div class="wrap">
  <div class="eyebrow">${eyebrow}</div>
  <h1>${titulo}</h1>
  ${lead ? `<p class="hero-lead">${lead}</p>` : ""}
  ${extra}
</div></div>`;
  const totalTareas = () => SEMANAS.reduce((a, s) => a + s.tareas.length, 0);

  function vInicio() {
    const g = progGlobal(), e = estado(), sig = semanaSiguiente();
    const saludo = S.config.nombre ? `Hola, ${esc(S.config.nombre)}. ` : "";
    const temas = ["Método de Pólya", "Pseudocódigo", "Python", "Invariantes", "Complejidad", "Búsqueda binaria", "Ordenamiento", "Pilas y colas", "Hashing", "Árboles", "Heaps", "Recursión", "Backtracking", "Voraces", "Programación dinámica", "BFS / DFS", "Dijkstra", "Kruskal"];
    const pasos = [
      ["Configurá tu cuatrimestre", "Fecha de inicio y meta de horas en <a href=\"#/progreso\">Mi progreso</a>."],
      ["Leé la lección de la semana", "Ideas clave, ejemplos resueltos y código comentado."],
      ["Hacé las lecturas indicadas", "Capítulos concretos de Pólya, Joyanes y bibliografía complementaria."],
      ["Resolvé problemas reales", "Con la ficha de Pólya y en jueces online, hasta obtener «Accepted»."],
      ["Marcá, registrá y reflexioná", "Actividades, horas, confianza y notas: tu avance queda a la vista."],
      ["Compará con el banco de soluciones", "Después de intentarlo, revisá la resolución en <a href=\"#/soluciones\">Soluciones</a> (con contraseña)."],
      ["Evaluate", "Parcial en la semana 8; examen final y proyecto integrador en la 16."]
    ];
    return `
<section class="hero"><div class="wrap hero-grid">
  <div>
    <div class="eyebrow">Curso autodidacta · un cuatrimestre</div>
    <h1>Resolución de problemas y <em>algoritmos</em></h1>
    <p class="hero-lead">Comprender el problema. Diseñar un plan. Programarlo. Verificarlo.</p>
    <p class="hero-copy">${saludo}Un plan guiado de 16 semanas para aprender a pensar problemas, expresarlos como algoritmos, programarlos en Python y analizar si son correctos y eficientes. Seis materias, lecturas concretas, práctica en jueces online, evaluaciones, un proyecto integrador y un banco de soluciones.</p>
    <div class="btn-row">
      ${sig ? `<a class="btn primary" href="#/semana/${sig}">${g.hechas ? "Continuar" : "Empezar"}: semana ${sig}${ARR}</a>` : ""}
      <a class="btn" href="#/plan">Ver el plan de estudio</a>
    </div>
  </div>
  <div class="hero-stamp">
    <strong class="lbl">Tu avance</strong>
    <div class="big-num">${g.pct}<small> %</small></div>
    <div style="margin:12px 0 10px">${bar(g.pct, true)}</div>
    <div class="pct">${g.hechas} de ${g.total} actividades</div>
    <p style="margin:14px 0 0"><span class="tag ${e.cls}">${e.txt}</span></p>
  </div>
</div></section>

<div class="band" aria-hidden="true"><div class="track">${[...temas, ...temas].map((t) => `<span>${t}</span>`).join("")}</div></div>

<section class="section"><div class="wrap">
  <div class="section-head">
    <div><div class="eyebrow">La propuesta</div><h2>Aprender a pensar antes de programar</h2></div>
    <div>
      <p class="section-intro">Un algoritmo no se memoriza: se descubre. El curso combina el método heurístico de Pólya con las técnicas clásicas de la algoritmia, y te hace practicar con problemas reales desde la tercera semana.</p>
      <div class="facts">
        <div class="fact"><strong>16 semanas</strong><span>~10–12 h semanales</span></div>
        <div class="fact"><strong>6</strong><span>materias encadenadas</span></div>
        <div class="fact"><strong>${totalTareas()}</strong><span>actividades guiadas</span></div>
        <div class="fact"><strong>Proyecto</strong><span>integrador final</span></div>
      </div>
    </div>
  </div>
</div></section>

<section class="section" style="padding-top:0;border-top:0"><div class="wrap">
  <div class="section-head">
    <div><div class="eyebrow">Formación articulada</div><h2>Cómo se organiza el curso</h2></div>
    <p class="section-intro">Cada materia se apoya en la anterior. Entrá a cualquiera para ver sus objetivos, semanas y bibliografía.</p>
  </div>
  <div class="nuclei">
  ${MATERIAS.map((m) => {
    const p = progMateria(m);
    return `<a class="nucleus${p.pct === 100 ? " done" : ""}" href="#/materia/${m.id}">
      <span class="num">${pad2(m.n)}</span>
      <h3>${esc(m.nombre)}</h3>
      <p>${esc(m.desc)}</p>
      <div class="foot"><div class="row"><span>Semanas ${m.semanas[0]}–${m.semanas[m.semanas.length - 1]}</span><span>${p.pct}%</span></div>${bar(p.pct)}</div>
    </a>`;
  }).join("")}
  </div>
</div></section>

<section class="section"><div class="wrap">
  <div class="section-head">
    <div><div class="eyebrow">Primer paso</div><h2>Cómo funciona</h2></div>
    <div>
      <ul class="modules simple">${pasos.map((p, i) => `<li><div class="mod"><span class="n">${pad2(i + 1)}</span><span><span class="t">${p[0]}</span><span class="s">${p[1]}</span></span></div></li>`).join("")}</ul>
      <p class="faint">Tu avance se guarda en este navegador. Exportalo periódicamente desde «Mi progreso» para tener una copia.</p>
    </div>
  </div>
</div></section>

<section class="cta"><div class="wrap">
  <div class="eyebrow">${sig ? `Semana ${sig}` : "Curso completo"}</div>
  <h2>Todo problema empieza con <em>una pregunta</em>.</h2>
  <p>«¿Cuál es la incógnita? ¿Cuáles son los datos? ¿Cuál es la condición?» — G. Pólya</p>
  ${sig ? `<a class="btn primary" href="#/semana/${sig}">Ir a la semana ${sig}${ARR}</a>` : `<a class="btn primary" href="#/guia">¿Y ahora qué?${ARR}</a>`}
</div></section>`;
  }

  function filaSemana(s, cal) {
    const ps = progSemana(s), r = rangoSemana(s.n);
    const hito = s.tareas.some((t) => t.t === "examen") ? ' <span class="tag warn">evaluación</span>' : s.tareas.some((t) => t.t === "proyecto") ? ' <span class="tag accent">proyecto</span>' : "";
    return `<li><a class="mod${cal === s.n ? " current" : ""}" href="#/semana/${s.n}">
      <span class="n">${pad2(s.n)}</span>
      <span><span class="t">${esc(s.titulo)}${hito}</span><span class="s">${r ? fmtFecha(r[0]) + " – " + fmtFecha(r[1]) + " · " : ""}~${s.horas} h · ${ps.hechas}/${ps.total} actividades</span></span>
      <span>${bar(ps.pct)}<span class="pct">${ps.pct}%</span></span></a></li>`;
  }

  function vPlan() {
    const cal = semanaCalendario();
    return pageHero("Cronograma", "Plan de <em>estudio</em>",
      "16 semanas de ~10–12 horas. Si tenés menos tiempo, estirá el plan a 24 semanas: lo importante es no saltear la práctica.") + `
<div class="wrap">
${MATERIAS.map((m) => {
  const p = progMateria(m);
  return sec(`Materia ${pad2(m.n)} · ${p.pct}%`, `<a href="#/materia/${m.id}" style="text-decoration:none">${esc(m.nombre)}</a>`,
    `<ul class="modules">${m.semanas.map(semana).map((s) => filaSemana(s, cal)).join("")}</ul>`);
}).join("")}
</div>`;
  }

  function vMateria(id) {
    const m = materia(id);
    if (!m) return vNoEncontrado();
    const p = progMateria(m), cal = semanaCalendario();
    const libros = [...new Set(m.semanas.flatMap((n) => semana(n).lecturas.map((l) => l.b)))];
    return pageHero(`<a href="#/plan">Plan de estudio</a> · Materia ${pad2(m.n)}`, esc(m.nombre), esc(m.desc),
      `<div style="max-width:520px">${bar(p.pct, true)}<span class="pct">${p.hechas}/${p.total} actividades · ${p.pct}%</span></div>`) + `
<div class="wrap">
${sec("01", "Objetivos", `<ul>${m.objetivos.map((o) => `<li>${esc(o)}</li>`).join("")}</ul>`)}
${sec("02", "Semanas", `<ul class="modules">${m.semanas.map(semana).map((s) => filaSemana(s, cal)).join("")}</ul>`)}
${sec("03", "Bibliografía", libros.map((b) => `<div class="biblio-item"><div class="ti">${esc(libro(b).titulo)}</div><div class="meta">${esc(libro(b).autor)}${linkLibro(b)}</div></div>`).join(""))}
</div>`;
  }

  function linkLibro(b) {
    const L = libro(b);
    const links = [];
    if (L.url) links.push(`<a href="${L.url}" target="_blank" rel="noopener">online${ARR}</a>`);
    return links.length ? ` <span class="faint">· ${links.join(" · ")}</span>` : "";
  }

  function vSemana(n) {
    const s = semana(n);
    if (!s) return vNoEncontrado();
    const m = materia(s.m), p = progSemana(s), r = rangoSemana(n);
    const conf = S.confianza[n] || 0;
    const prev = semana(n - 1), next = semana(n + 1);
    const meta = `<p class="faint" style="margin:0 0 14px">${r ? fmtFecha(r[0]) + " – " + fmtFecha(r[1]) + " · " : ""}Dedicación estimada: ~${s.horas} horas</p>
      <div style="max-width:520px">${bar(p.pct, true)}<span class="pct" id="wk-pct">${p.hechas}/${p.total} actividades · ${p.pct}%</span></div>`;
    return pageHero(`<a href="#/materia/${m.id}">Materia ${pad2(m.n)} · ${esc(m.nombre)}</a>`, `<em>Semana ${n}.</em> ${esc(s.titulo)}`, "", meta) + `
<div class="wrap">
${sec("01", "Objetivos", `<ul>${s.objetivos.map((o) => `<li>${esc(o)}</li>`).join("")}</ul>`)}
${sec("02", "Lección", `<div class="lesson">${s.leccion}</div>`)}
${sec("03", "Lecturas", `<ul class="modules simple">${s.lecturas.map((l, i) => `<li><div class="mod"><span class="n">${pad2(i + 1)}</span><span><span class="t">${esc(l.c)}</span><span class="s">${esc(libro(l.b).autor)} — <em>${esc(libro(l.b).titulo)}</em>${linkLibro(l.b)}</span></span></div></li>`).join("")}</ul>`)}
${sec("04", "Recursos", `<ul>${s.recursos.map((x) => `<li><a href="${x.u}" target="_blank" rel="noopener">${esc(x.n)}${ARR}</a></li>`).join("")}</ul>`)}
${sec("05", "Actividades", `
<p class="muted">Marcá cada actividad al terminarla. En los problemas, «terminada» = aceptada por el juez <em>y</em> con ficha de Pólya. <a class="dl" href="#/soluciones/${m.id}/${n}">${LOCK}<span>Soluciones de esta semana</span></a></p>
<ul class="tasks">
${s.tareas.map((t, i) => {
  const id = tid(n, i), done = !!S.tareas[id];
  return `<li class="task ${t.t}${done ? " done" : ""}">
    <input type="checkbox" id="${id}" data-task="${id}" ${done ? "checked" : ""}>
    <label for="${id}"><span class="kind">${TIPOS[t.t] || t.t}</span><span class="tx">${esc(t.x)}</span></label>
    <span class="task-links">${t.u ? `<a href="${t.u}" target="_blank" rel="noopener">abrir${ARR}</a>` : ""}</span>
  </li>`;
}).join("")}
</ul>`)}
${sec("06", "Autoevaluación", `
<ul>${s.autoeval.map((q) => `<li>${esc(q)}</li>`).join("")}</ul>
<p class="muted" style="margin:1.4rem 0 .6rem">¿Qué tan seguro/a te sentís con los temas de esta semana?</p>
<div class="scale" role="radiogroup" aria-label="Nivel de confianza">
${[1, 2, 3, 4, 5].map((v) => `<label><input type="radio" name="conf" value="${v}" ${conf === v ? "checked" : ""}><span>${v} · ${["nada", "poco", "regular", "bastante", "muy"][v - 1]}</span></label>`).join("")}
</div>
<p class="faint" style="margin-top:.7rem">Si marcás 1 o 2, repasá antes de avanzar: releé la lección y rehacé un problema sin mirar.</p>`)}
${sec("07", "Notas", `
<textarea id="notas" placeholder="Dudas, ideas, errores frecuentes, fichas de Pólya, notas de parcial…">${esc(S.notas[n] || "")}</textarea>
<p class="faint" id="notas-ok">Se guarda automáticamente.</p>`)}
<nav class="pager" aria-label="Semanas">
  ${prev ? `<a href="#/semana/${prev.n}">← Semana ${prev.n}<strong>${esc(prev.titulo)}</strong></a>` : "<span></span>"}
  ${next ? `<a href="#/semana/${next.n}">Semana ${next.n} →<strong>${esc(next.titulo)}</strong></a>` : `<a href="#/progreso">Final →<strong>Ver mi progreso</strong></a>`}
</nav>
</div>`;
  }

  function vGuia() {
    return pageHero("Metodología", "Cómo estudiar <em>este curso</em>",
      "Aprender algoritmos es como aprender un deporte: se lee para entender, pero se aprende practicando. Cómo organizarte, cómo encarar cada problema y cómo evaluarte.") + `
<div class="wrap">
${sec("01", "Rutina semanal", `
<p>Unas 11 horas, repartidas en bloques cortos y frecuentes (rinden más que una maratón el domingo).</p>
<table>
<tr><th>Bloque</th><th>Tiempo</th><th>Qué hacer</th></tr>
<tr><td>Lunes</td><td>2 h</td><td>Lección del sitio + lectura principal. Resumen a mano.</td></tr>
<tr><td>Martes</td><td>2 h</td><td>Videos/recursos y ejercicios de práctica (libro de problemas).</td></tr>
<tr><td>Miércoles</td><td>2 h</td><td>Problemas de juez online (primeros 2–3).</td></tr>
<tr><td>Jueves</td><td>2 h</td><td>Problemas restantes. Si te trabás, ver «Cuando te trabás».</td></tr>
<tr><td>Vie / sáb</td><td>2–3 h</td><td>Reflexión, autoevaluación, comparar con el banco de soluciones, notas y repaso. Proyecto (semanas 12–16).</td></tr>
</table>`)}
${sec("02", "Ficha de Pólya", `
<p>Usala en <strong>cada</strong> problema. Descargá la versión imprimible (A4, 2 páginas) o copiá la versión de texto en tus notas de semana.</p>
<div class="btn-row" style="margin:0 0 1.4rem"><a class="btn primary" href="${FICHA}" download="ficha-polya.pdf">${DL}Descargar ficha de Pólya (PDF)</a></div>
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
   - ¿Otra forma de resolverlo? ¿Qué aprendí que pueda reutilizar?</code></pre>`)}
${sec("03", "Cuando te trabás", `
<ul class="modules simple">
${[["15 minutos sin código", "Casos chicos a mano, dibujos, tablas."],
   ["Repasá las preguntas de Pólya", "¿Usaste todos los datos? ¿Conocés un problema relacionado?"],
   ["Fuerza bruta primero", "Aunque sea lenta, te da algo correcto para comparar."],
   ["45–60 minutos sin avance", "Buscá una pista (no la solución): foro del juez, libro, lección."],
   ["Si leíste la solución", "Del <a href=\"#/soluciones\">banco de soluciones</a> o de otra fuente: cerrala, esperá un día y reescribila de cero. Anotalo para repasar."]]
  .map((x, i) => `<li><div class="mod"><span class="n">${pad2(i + 1)}</span><span><span class="t">${x[0]}</span><span class="s">${x[1]}</span></span></div></li>`).join("")}
</ul>`)}
${sec("04", "Evaluación", `
<table>
<tr><th>Instancia</th><th>Peso</th><th>Cuándo</th></tr>
<tr><td>Actividades semanales completadas</td><td>30 %</td><td>Todo el cuatrimestre</td></tr>
<tr><td>Primer parcial</td><td>20 %</td><td>Semana 8</td></tr>
<tr><td>Proyecto integrador</td><td>25 %</td><td>Semanas 12–16</td></tr>
<tr><td>Examen final</td><td>25 %</td><td>Semana 16</td></tr>
</table>
<p class="pullquote">Aprobás con 60 % o más en cada instancia.</p>
<p>Rúbrica para cada ejercicio de parcial o final (sobre 10): <strong>correctitud</strong> (4: el juez lo acepta o el argumento es válido), <strong>análisis</strong> (3: ficha de Pólya y complejidad justificadas), <strong>claridad</strong> (2: nombres, funciones, invariantes comentados), <strong>casos borde</strong> (1).</p>
<p>Para autocorregir el parcial, el final y el proyecto, compará con las resoluciones del <a href="#/soluciones">banco de soluciones</a>.</p>`)}
${sec("05", "Proyecto integrador", `
<ul>
<li><strong>Resolvedor de laberintos:</strong> leer un laberinto de un archivo de texto, resolver con BFS/DFS, mostrar el camino y comparar.</li>
<li><strong>Planificador de rutas:</strong> mapa de ciudades con distancias (por ejemplo, de tu provincia), Dijkstra y MST.</li>
<li><strong>Sudoku:</strong> backtracking con poda; medir cuántos nodos explora con y sin heurísticas.</li>
<li><strong>Corrector ortográfico:</strong> distancia de edición (DP) + diccionario (hash) para sugerir palabras.</li>
<li><strong>Comparador de ordenamientos:</strong> 6 algoritmos, gráfico de tiempos y análisis de casos (ordenado, inverso, aleatorio).</li>
<li><strong>Planificador de materias:</strong> correlatividades como grafo dirigido; orden topológico y detección de ciclos.</li>
</ul>
<div class="callout"><strong>Entregable:</strong> repositorio con código, tests (asserts) y README con el problema, decisiones, ficha de Pólya y análisis de complejidad.</div>`)}
${sec("06", "Configuración técnica", `
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

main()</code></pre>`)}
${sec("07", "¿Y ahora qué?", `
<p>Al terminar, seguí con <a href="https://ossu.dev/" target="_blank" rel="noopener">OSSU Computer Science</a> (Core programming / Core theory), el curso de Princeton en Coursera y los problemas restantes del CSES. Si te interesa competir, la <a href="https://usaco.guide/" target="_blank" rel="noopener">USACO Guide</a> y los AtCoder Beginner Contests son el siguiente paso natural.</p>`)}
</div>`;
  }

  function vBiblio() {
    const item = (L) => `<div class="biblio-item"><div class="ti">${esc(L.titulo)}</div>
      <div class="meta">${esc(L.autor)} · ${esc(L.editorial)} · ${esc(L.anio)} · <span class="tag">${L.idioma === "es" ? "español" : "inglés"}</span>
      ${L.url ? ` · <a href="${L.url}" target="_blank" rel="noopener">acceso libre${ARR}</a>` : ""}</div>
      <div class="muted" style="font-size:.94rem">${esc(L.nota)}</div></div>`;
    const todos = Object.values(BIBLIO);
    const link = (x) => `<div class="biblio-item"><div class="ti"><a href="${x.u}" target="_blank" rel="noopener">${esc(x.n)}${ARR}</a></div><div class="muted" style="font-size:.94rem">${esc(x.d)}</div></div>`;
    return pageHero("Material", "Bibliografía <em>y recursos</em>",
      "Los tres libros base cubren el núcleo. El resto amplía, ofrece otro enfoque o es de acceso libre.") + `
<div class="wrap">
${sec("01", "Libros base", todos.filter((l) => l.base).map(item).join(""))}
${sec("02", "Complementarios en español", todos.filter((l) => !l.base && l.idioma === "es").map(item).join(""))}
${sec("03", "Complementarios en inglés", todos.filter((l) => !l.base && l.idioma === "en").map(item).join(""))}
${sec("04", "Jueces online y práctica", PLATAFORMAS.map(link).join(""))}
${sec("05", "Cursos y videos", CURSOS.map(link).join(""))}
${sec("06", "Visualizadores y referencias", HERRAMIENTAS.map(link).join(""))}
</div>`;
  }

  function chartHoras() {
    const mins = minutosPorSemana();
    const W = 640, H = 180, pad = 24, n = SEMANAS.length;
    const meta = Number(S.config.horasMeta) || 0;
    const max = Math.max(meta, ...SEMANAS.map((s) => (mins[s.n] || 0) / 60), 1);
    const bw = (W - pad * 2) / n;
    const y = (h) => H - pad - (h / max) * (H - pad * 2);
    let out = `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Horas registradas por semana">`;
    out += `<line class="axis" x1="${pad}" x2="${W - pad}" y1="${H - pad}" y2="${H - pad}"/>`;
    SEMANAS.forEach((s, i) => {
      const h = (mins[s.n] || 0) / 60, x = pad + i * bw + bw * 0.2, top = y(h);
      out += `<rect class="b" x="${x}" y="${top}" width="${bw * 0.6}" height="${H - pad - top}" rx="2"><title>Semana ${s.n}: ${h.toFixed(1)} h</title></rect>`;
      out += `<text x="${x + bw * 0.3}" y="${H - 7}" text-anchor="middle">${s.n}</text>`;
    });
    if (meta) out += `<line class="goal" x1="${pad}" x2="${W - pad}" y1="${y(meta)}" y2="${y(meta)}"/><text x="${W - pad}" y="${y(meta) - 5}" text-anchor="end">meta ${meta} h</text>`;
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
    return pageHero("Seguimiento", "Mi <em>progreso</em>", "", `<p><span class="tag ${e.cls}">${e.txt}</span></p>`) + `
<div class="wrap">
${sec("01", "Resumen", `
<div class="stats">
  <div class="stat"><div class="v">${g.pct}%</div><div class="k">${g.hechas} de ${g.total} actividades</div></div>
  <div class="stat"><div class="v">${(totalMin / 60).toFixed(1)}</div><div class="k">horas en ${S.sesiones.length} sesiones</div></div>
  <div class="stat"><div class="v">${racha()}</div><div class="k">días seguidos de estudio</div></div>
  <div class="stat"><div class="v">${confProm}</div><div class="k">confianza promedio (1–5)</div></div>
</div>
${repasar.length ? `<div class="callout warn"><strong>Para repasar</strong> (confianza baja): ${repasar.map((s) => `<a href="#/semana/${s.n}">semana ${s.n}</a>`).join(", ")}.</div>` : ""}
<h3>Por materia</h3>
${MATERIAS.map((m) => { const p = progMateria(m); return `<div style="margin:.9rem 0"><div style="display:flex;justify-content:space-between;gap:1rem;font-size:.95rem"><a href="#/materia/${m.id}">${pad2(m.n)} · ${esc(m.nombre)}</a><span class="pct">${p.hechas}/${p.total}</span></div>${bar(p.pct)}</div>`; }).join("")}`)}
${sec("02", "Registrar sesión", `
<form id="f-sesion" class="panel">
  <div class="form-row">
    <div class="field"><label for="s-fecha">Fecha</label><input type="date" id="s-fecha" value="${hoyISO()}" required></div>
    <div class="field"><label for="s-min">Minutos</label><input type="number" id="s-min" min="5" max="720" step="5" value="60" required></div>
    <div class="field"><label for="s-sem">Semana</label><select id="s-sem">${SEMANAS.map((s) => `<option value="${s.n}" ${s.n === (sig || 16) ? "selected" : ""}>Semana ${s.n}</option>`).join("")}</select></div>
  </div>
  <div class="field"><label for="s-nota">¿Qué hiciste? (opcional)</label><input type="text" id="s-nota" maxlength="200" placeholder="Ej.: lectura Joyanes cap. 4 y 2 problemas CSES"></div>
  <button class="btn primary" type="submit">Guardar sesión</button>
</form>
<h3>Horas por semana</h3>
${chartHoras()}
<h3>Historial</h3>
${sesiones.length ? `<table><tr><th>Fecha</th><th>Sem.</th><th>Min</th><th>Nota</th><th></th></tr>
${sesiones.slice(0, 50).map((x) => `<tr><td>${esc(x.fecha)}</td><td>${x.semana}</td><td>${x.min}</td><td>${esc(x.nota)}</td><td><button class="btn small" data-del="${x.id}" title="Borrar sesión" aria-label="Borrar sesión">×</button></td></tr>`).join("")}</table>` : `<p class="faint">Todavía no registraste sesiones.</p>`}`)}
${sec("03", "Configuración", `
<form id="f-config" class="panel">
  <div class="form-row">
    <div class="field"><label for="c-nombre">Tu nombre (opcional)</label><input type="text" id="c-nombre" value="${esc(S.config.nombre)}" maxlength="40"></div>
    <div class="field"><label for="c-inicio">Fecha de inicio</label><input type="date" id="c-inicio" value="${esc(S.config.inicio)}"></div>
    <div class="field"><label for="c-meta">Meta horas/semana</label><input type="number" id="c-meta" min="1" max="60" value="${esc(S.config.horasMeta)}"></div>
  </div>
  <button class="btn primary" type="submit">Guardar configuración</button>
</form>`)}
${sec("04", "Respaldo", `
<p class="muted">El progreso vive en el almacenamiento local de este navegador. Exportalo para tener copia o pasarlo a otra computadora.</p>
<div class="btn-row">
  <button class="btn" id="b-export">Exportar (.json)</button>
  <label class="btn" for="b-import">Importar…</label><input type="file" id="b-import" accept="application/json,.json" hidden>
  <button class="btn" onclick="window.print()">Imprimir</button>
  <button class="btn danger" id="b-reset">Borrar todo</button>
</div>`)}
</div>`;
  }

  /* ---------- Banco de soluciones (cifrado) ---------- */
  const SOL_EMAIL = "cocobianchi@gmail.com";
  const SOL_PASS_KEY = "rpa-sol-pass";
  const LOCK = '<svg class="arr" viewBox="0 0 12 12" aria-hidden="true"><rect x="2.2" y="5.2" width="7.6" height="5.3" rx="1" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M4 5.2V3.8a2 2 0 0 1 4 0v1.4" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>';
  let SOL = null;          // soluciones descifradas (sólo en memoria)
  let solError = "";

  function cargarCifrado() {
    if (window.SOLUCIONES_ENC) return Promise.resolve(window.SOLUCIONES_ENC);
    return new Promise((ok, mal) => {
      const sc = document.createElement("script");
      sc.src = "js/soluciones.enc.js";
      sc.onload = () => ok(window.SOLUCIONES_ENC);
      sc.onerror = () => mal(new Error("No se pudo cargar el banco de soluciones."));
      document.head.appendChild(sc);
    });
  }
  const deB64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  async function descifrar(pass) {
    if (!window.crypto || !crypto.subtle) throw new Error("Tu navegador no permite descifrar (se necesita HTTPS).");
    const E = await cargarCifrado();
    const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(pass), "PBKDF2", false, ["deriveKey"]);
    const clave = await crypto.subtle.deriveKey({ name: "PBKDF2", salt: deB64(E.salt), iterations: E.iter, hash: "SHA-256" },
      base, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
    let plano;
    try { plano = await crypto.subtle.decrypt({ name: "AES-GCM", iv: deB64(E.iv) }, clave, deB64(E.data)); }
    catch { throw new Error("Contraseña incorrecta."); }
    return JSON.parse(new TextDecoder().decode(plano)).sol;
  }
  async function desbloquear(pass, silencioso) {
    try {
      SOL = await descifrar(pass);
      sessionStorage.setItem(SOL_PASS_KEY, pass);
      solError = "";
    } catch (e) {
      SOL = null;
      sessionStorage.removeItem(SOL_PASS_KEY);
      solError = silencioso ? "" : e.message;
    }
    if (location.hash.startsWith("#/soluciones")) render();
  }

  const mailSol = () => `mailto:${SOL_EMAIL}?subject=${encodeURIComponent("Solicitud de contraseña — Banco de soluciones")}&body=${encodeURIComponent("Hola, quisiera la contraseña del banco de soluciones del curso de Resolución de problemas y algoritmos.\n\nNombre:\nMotivo / semana en la que estoy:\n")}`;

  function vSolBloqueada() {
    return pageHero("Material protegido", "Banco de <em>soluciones</em>",
      "Resoluciones de los ejercicios, problemas, parcial y examen final, con explicación, código comentado y complejidad.") + `
<div class="wrap">
${sec(LOCK.replace('class="arr"', 'class="arr" style="width:1.1em;height:1.1em;margin:0"'), "Acceso con contraseña", `
<form id="f-sol" class="panel" autocomplete="off" style="max-width:520px">
  <div class="field"><label for="sol-pass">Contraseña</label>
    <input type="password" id="sol-pass" required autofocus style="font:inherit;font-size:16px;width:100%;padding:.6rem .75rem;border:1px solid var(--line);border-radius:var(--radius);background:var(--paper);color:var(--ink)"></div>
  ${solError ? `<p class="sol-err" role="alert">${esc(solError)}</p>` : ""}
  <button class="btn primary" type="submit" id="sol-btn">Desbloquear</button>
</form>
<p>¿No tenés la contraseña? Pedila por correo a <a href="${mailSol()}">${SOL_EMAIL}</a>.</p>
<div class="callout"><strong>Antes de mirar una solución:</strong> intentá el problema al menos 45–60 minutos con la ficha de Pólya. Leer la solución sin haber peleado el problema enseña muy poco. Si la leés, cerrala y reescribila de cero al día siguiente.</div>`)}
</div>`;
  }

  function bloqueSol(blq) {
    if (typeof blq === "string") return blq;
    return `<pre><code>${esc(blq.c)}</code></pre>`;
  }

  function vSoluciones(mid, semAncla) {
    if (!SOL) {
      const guardada = sessionStorage.getItem(SOL_PASS_KEY);
      if (guardada) { desbloquear(guardada, true); return pageHero("Material protegido", "Banco de <em>soluciones</em>", "Descifrando…"); }
      return vSolBloqueada();
    }
    const m = materia(mid) || MATERIAS[0];
    const tabs = `<div class="sol-tabs no-print" role="tablist">${MATERIAS.map((x) =>
      `<a role="tab" href="#/soluciones/${x.id}" class="${x.id === m.id ? "active" : ""}" aria-selected="${x.id === m.id}">${pad2(x.n)} · ${esc(x.nombre)}</a>`).join("")}</div>`;
    let total = 0;
    const semanas = m.semanas.map(semana).map((s) => {
      const items = s.tareas.map((t, i) => [t, tid(s.n, i)]).filter(([, id]) => SOL[id]);
      total += items.length;
      const cuerpo = items.length ? items.map(([t, id]) => {
        const so = SOL[id];
        return `<details class="sol" id="sol-${id}">
  <summary><span class="kind">${TIPOS[t.t] || t.t}</span><span class="tx">${esc(t.x)}</span></summary>
  <div class="sol-body">${so.x ? `<p><span class="tag accent">Complejidad: ${esc(so.x)}</span></p>` : ""}${so.b.map(bloqueSol).join("")}</div>
</details>`;
      }).join("") : `<p class="faint">Esta semana no tiene ejercicios con solución (sólo lecturas y reflexión personal).</p>`;
      return sec(`Semana ${pad2(s.n)}`, `<a href="#/semana/${s.n}" style="text-decoration:none">${esc(s.titulo)}</a>`, cuerpo, ` id="sol-sem-${s.n}"`);
    }).join("");
    setTimeout(() => {
      if (semAncla) { const el = document.getElementById("sol-sem-" + semAncla); if (el) el.scrollIntoView(); }
    }, 0);
    return pageHero(`Material protegido · Materia ${pad2(m.n)}`, "Banco de <em>soluciones</em>",
      esc(m.nombre), `
<div class="btn-row no-print">
  <button class="btn primary" type="button" id="sol-print">${DL}Guardar PDF de esta materia</button>
  <button class="btn" type="button" id="sol-expand">Expandir todo</button>
  <button class="btn" type="button" id="sol-lock">${LOCK}Bloquear</button>
</div>
<p class="faint" style="margin-top:.8rem">${total} soluciones en esta materia. Para el PDF, elegí «Guardar como PDF» en el diálogo de impresión.</p>`) + `
<div class="wrap">${tabs}${semanas}</div>`;
  }

  // Al imprimir, abrir todas las soluciones; al terminar, restaurar.
  let abiertas = [];
  window.addEventListener("beforeprint", () => {
    abiertas = [...document.querySelectorAll("details.sol")].map((d) => d.open);
    document.querySelectorAll("details.sol").forEach((d) => (d.open = true));
  });
  window.addEventListener("afterprint", () => {
    document.querySelectorAll("details.sol").forEach((d, i) => (d.open = abiertas[i] ?? d.open));
  });

  function vNoEncontrado() {
    return pageHero("Error 404", "No <em>encontrado</em>", "<a href=\"#/\">Volver al inicio</a>");
  }

  /* ---------- Router ---------- */
  const app = $("#app");
  function render() {
    const h = location.hash.replace(/^#\/?/, "");
    const [r, a, b] = h.split("/");
    let html, nav = r || "inicio";
    if (!r || r === "inicio") html = vInicio();
    else if (r === "plan") html = vPlan();
    else if (r === "semana") { html = vSemana(Number(a)); nav = "plan"; }
    else if (r === "materia") { html = vMateria(a); nav = "plan"; }
    else if (r === "guia") html = vGuia();
    else if (r === "bibliografia") html = vBiblio();
    else if (r === "progreso") html = vProgreso();
    else if (r === "soluciones") { html = vSoluciones(a, b); }
    else html = vNoEncontrado();
    app.innerHTML = html;
    document.querySelectorAll("#nav-links a").forEach((x) => x.classList.toggle("active", x.dataset.nav === nav));
    const s = r === "semana" ? semana(Number(a)) : null;
    document.title = (s ? `Semana ${s.n} · ` : "") + "Resolución de problemas y algoritmos";
    window.scrollTo(0, 0);
    cerrarMenu();
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
    } else if (ev.target.id === "f-sol") {
      const btn = $("#sol-btn"); btn.disabled = true; btn.textContent = "Verificando…";
      desbloquear($("#sol-pass").value.trim(), false);
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
    } else if (el.id === "sol-print") {
      window.print();
    } else if (el.id === "sol-expand") {
      const ds = [...document.querySelectorAll("details.sol")];
      const abrir = ds.some((d) => !d.open);
      ds.forEach((d) => (d.open = abrir));
      el.textContent = abrir ? "Contraer todo" : "Expandir todo";
    } else if (el.id === "sol-lock") {
      SOL = null; sessionStorage.removeItem(SOL_PASS_KEY); render(); toast("Banco de soluciones bloqueado");
    } else if (el.id === "b-reset") {
      if (confirm("¿Borrar TODO tu progreso, notas y sesiones? No se puede deshacer (exportá antes).")) { S = vacio(); guardar(); render(); toast("Progreso borrado"); }
    }
  });

  /* ---------- Menú móvil ---------- */
  function cerrarMenu() { $("#nav").classList.remove("is-open"); $("#nav-toggle").setAttribute("aria-expanded", "false"); }
  $("#nav-toggle").addEventListener("click", () => {
    const abierto = $("#nav").classList.toggle("is-open");
    $("#nav-toggle").setAttribute("aria-expanded", String(abierto));
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
