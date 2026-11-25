/* =========================================================================
   Contenido del curso. Todo el plan vive en este archivo: para agregar
   recursos, tareas o semanas, editá estos objetos.
   IMPORTANTE: el avance se guarda por id de tarea ("s<semana>-<índice>").
   Si reordenás tareas de una semana ya empezada, el avance puede desfasarse;
   preferí agregar tareas al final de la lista.
   ========================================================================= */

const yt = (q) => "https://www.youtube.com/results?search_query=" + encodeURIComponent(q);
const cses = (id) => "https://cses.fi/problemset/task/" + id;
const lc = (slug) => "https://leetcode.com/problems/" + slug + "/";

const BIBLIO = {
  polya: {
    autor: "George Pólya",
    titulo: "Cómo plantear y resolver problemas",
    editorial: "Trillas", anio: "1965 (orig. How to Solve It, 1945)", idioma: "es",
    nota: "El clásico de la heurística. Las 4 fases (comprender, concebir un plan, ejecutarlo, examinar la solución) son la columna vertebral de todo el curso.",
    local: "Polya - Como plantear y resolver problemas.pdf", base: true
  },
  joyanes: {
    autor: "Luis Joyanes Aguilar",
    titulo: "Fundamentos de programación. Algoritmos, estructura de datos y objetos (4.ª ed.)",
    editorial: "McGraw-Hill", anio: "2008", idioma: "es",
    nota: "Texto principal para algoritmos, pseudocódigo, estructuras de control, arrays, ordenación, estructuras dinámicas, árboles, grafos y recursividad.",
    local: "Fundamentos-de-programacin-4ta-Edicin-Luis-Joyanes-Aguilar-2.pdf", base: true
  },
  joyanesProb: {
    autor: "L. Joyanes Aguilar, L. Rodríguez Baena, M. Fernández Azuela",
    titulo: "Fundamentos de programación. Libro de problemas",
    editorial: "McGraw-Hill", anio: "1996", idioma: "es",
    nota: "Ejercicios resueltos capítulo por capítulo (análisis, diseño, pseudocódigo). Ideal para practicar antes de pasar a código.",
    local: "Joyanes - Fundamentos de programacion (libro de problemas).pdf", base: true
  },
  // --- Complementarios en español
  pythoned: {
    autor: "B. Miller, D. Ranum (trad. al español)",
    titulo: "Solución de problemas con algoritmos y estructuras de datos usando Python",
    editorial: "Runestone Academy (libre, interactivo)", anio: "2011–", idioma: "es",
    url: "https://runestone.academy/ns/books/published/pythoned/index.html",
    nota: "Libro interactivo gratuito: análisis, pilas, colas, recursión, búsqueda, ordenamiento, árboles y grafos con código ejecutable en el navegador."
  },
  py4e: {
    autor: "Charles Severance",
    titulo: "Python para todos: explorando la información con Python 3",
    editorial: "py4e (libre)", anio: "2016–", idioma: "es",
    url: "https://es.py4e.com/",
    nota: "Introducción amable a Python con videos y ejercicios autocorregidos. Usalo como apoyo en la materia 2."
  },
  pytut: {
    autor: "Python Software Foundation",
    titulo: "El tutorial de Python (documentación oficial en español)",
    editorial: "docs.python.org", anio: "actualizado", idioma: "es",
    url: "https://docs.python.org/es/3/tutorial/",
    nota: "Referencia oficial. Leé las secciones 3 a 5 durante las semanas 3–5."
  },
  aprendepython: {
    autor: "Sergio Delgado Quintero",
    titulo: "Aprende Python",
    editorial: "aprendepython.es (libre)", anio: "actualizado", idioma: "es",
    url: "https://aprendepython.es/",
    nota: "Curso escrito, claro y moderno, con ejercicios por tema."
  },
  wirth: {
    autor: "Niklaus Wirth",
    titulo: "Algoritmos + Estructuras de datos = Programas",
    editorial: "Ediciones del Castillo", anio: "1980", idioma: "es",
    nota: "Clásico breve y profundo sobre el vínculo entre datos y algoritmos. Recomendado para leer por placer en la segunda mitad."
  },
  brassard: {
    autor: "Gilles Brassard, Paul Bratley",
    titulo: "Fundamentos de algoritmia",
    editorial: "Prentice Hall", anio: "1997", idioma: "es",
    nota: "Texto universitario en español sobre análisis y técnicas de diseño: voraces, divide y vencerás, programación dinámica, exploración de grafos."
  },
  rosen: {
    autor: "Kenneth H. Rosen",
    titulo: "Matemática discreta y sus aplicaciones",
    editorial: "McGraw-Hill", anio: "5.ª ed. 2004", idioma: "es",
    nota: "Lógica, inducción, conteo, relaciones y grafos. Consultalo en las semanas 6, 7 y 15."
  },
  polya2: {
    autor: "George Pólya",
    titulo: "Matemáticas y razonamiento plausible",
    editorial: "Tecnos", anio: "1966", idioma: "es",
    nota: "Continuación de 'Cómo plantear…': inducción, analogía y generalización. Opcional."
  },
  // --- En inglés
  laaksonen: {
    autor: "Antti Laaksonen",
    titulo: "Competitive Programmer's Handbook",
    editorial: "libre (PDF)", anio: "2018", idioma: "en",
    url: "https://cses.fi/book/book.pdf",
    nota: "Breve, preciso y gratuito. Va de la mano con el CSES Problem Set que usamos en las prácticas."
  },
  clrs: {
    autor: "T. Cormen, C. Leiserson, R. Rivest, C. Stein",
    titulo: "Introduction to Algorithms (4th ed.)",
    editorial: "MIT Press", anio: "2022", idioma: "en",
    nota: "La referencia enciclopédica (CLRS). No se lee de corrido: consultá secciones puntuales."
  },
  skiena: {
    autor: "Steven S. Skiena",
    titulo: "The Algorithm Design Manual (3rd ed.)",
    editorial: "Springer", anio: "2020", idioma: "en",
    nota: "Muy práctico: cómo reconocer qué técnica usar ('war stories' y catálogo de problemas)."
  },
  erickson: {
    autor: "Jeff Erickson",
    titulo: "Algorithms",
    editorial: "libre (PDF)", anio: "2019", idioma: "en",
    url: "https://jeffe.cs.illinois.edu/teaching/algorithms/",
    nota: "Excelente sobre recursión, backtracking, programación dinámica y grafos. Gratuito."
  },
  sedgewick: {
    autor: "Robert Sedgewick, Kevin Wayne",
    titulo: "Algorithms (4th ed.)",
    editorial: "Addison-Wesley", anio: "2011", idioma: "en",
    url: "https://algs4.cs.princeton.edu/home/",
    nota: "Base del curso de Princeton en Coursera. El sitio tiene resúmenes y código."
  },
  mcs: {
    autor: "E. Lehman, F. T. Leighton, A. R. Meyer",
    titulo: "Mathematics for Computer Science",
    editorial: "MIT (libre, PDF)", anio: "2018", idioma: "en",
    url: "https://courses.csail.mit.edu/6.042/spring18/mcs.pdf",
    nota: "Pruebas, inducción, invariantes, sumas y asintótica. Capítulos 1, 5, 6 y 14 para este curso."
  },
  thinkpython: {
    autor: "Allen B. Downey",
    titulo: "Think Python (3rd ed.)",
    editorial: "O'Reilly / Green Tea Press (libre online)", anio: "2024", idioma: "en",
    url: "https://greenteapress.com/wp/think-python-3rd-edition/",
    nota: "Aprender a programar pensando como científico de la computación."
  },
  zeitz: {
    autor: "Paul Zeitz",
    titulo: "The Art and Craft of Problem Solving (3rd ed.)",
    editorial: "Wiley", anio: "2016", idioma: "en",
    nota: "Para profundizar en estrategias de resolución (invariantes, extremos, paridad). Opcional."
  },
  kleinberg: {
    autor: "Jon Kleinberg, Éva Tardos",
    titulo: "Algorithm Design",
    editorial: "Pearson", anio: "2005", idioma: "en",
    nota: "Muy bueno en algoritmos voraces y programación dinámica, con énfasis en pruebas de correctitud."
  }
};

const PLATAFORMAS = [
  { n: "CSES Problem Set", u: "https://cses.fi/problemset/", d: "300 problemas clásicos ordenados por tema. El juez principal del curso (enunciados en inglés, simples)." },
  { n: "Acepta el Reto", u: "https://aceptaelreto.com/", d: "Juez online en español (Univ. Complutense). Muy bueno para las primeras semanas." },
  { n: "omegaUp", u: "https://omegaup.com/", d: "Juez educativo latinoamericano, en español. Usado en olimpíadas de informática." },
  { n: "LeetCode", u: "https://leetcode.com/problemset/", d: "Problemas con formato de función (sin leer entrada). Útil para estructuras de datos." },
  { n: "Codeforces", u: "https://codeforces.com/problemset", d: "Competencias semanales; filtrá por dificultad 800–1200 para empezar." },
  { n: "AtCoder", u: "https://atcoder.jp/", d: "Concursos 'Beginner Contest' (ABC), excelentes para practicar los problemas A–C." },
  { n: "Exercism (Python)", u: "https://exercism.org/tracks/python", d: "Ejercicios de lenguaje con mentoría gratuita. Ideal para la materia 2." }
];

const HERRAMIENTAS = [
  { n: "Python Tutor", u: "https://pythontutor.com/", d: "Visualiza la ejecución paso a paso de tu código: variables, pila de llamadas, referencias." },
  { n: "VisuAlgo", u: "https://visualgo.net/es", d: "Animaciones de ordenamiento, listas, heaps, árboles, hashing y grafos (en español)." },
  { n: "Visualizaciones USFCA", u: "https://www.cs.usfca.edu/~galles/visualization/Algorithms.html", d: "Animaciones interactivas de estructuras de datos y algoritmos." },
  { n: "USACO Guide", u: "https://usaco.guide/", d: "Guía estructurada por niveles con explicaciones y problemas seleccionados." },
  { n: "cp-algorithms", u: "https://cp-algorithms.com/", d: "Referencia de algoritmos con implementaciones y problemas para practicar." }
];

const CURSOS = [
  { n: "Khan Academy — Algoritmos (en español)", u: "https://es.khanacademy.org/computing/computer-science/algorithms", d: "Búsqueda binaria, notación asintótica, ordenamiento, recursión y grafos. Con desafíos." },
  { n: "MIT 6.006 Introduction to Algorithms (2020)", u: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/", d: "Clases grabadas, apuntes y problemas del MIT (inglés, subtítulos)." },
  { n: "Princeton — Algorithms, Part I (Coursera)", u: "https://www.coursera.org/learn/algorithms-part1", d: "Sedgewick y Wayne. Gratis en modo oyente." },
  { n: "Harvard CS50x", u: "https://cs50.harvard.edu/x/", d: "Introducción a la computación. Las semanas 0–3 complementan muy bien las materias 1 a 3." },
  { n: "Abdul Bari (YouTube)", u: "https://www.youtube.com/@abdul_bari", d: "Explicaciones claras en pizarrón de análisis, DP y grafos (inglés)." },
  { n: "WilliamFiset (YouTube)", u: "https://www.youtube.com/@WilliamFiset-videos", d: "Serie completa de teoría de grafos y estructuras de datos (inglés)." },
  { n: "OSSU — Computer Science", u: "https://ossu.dev/", d: "Currículo autodidacta completo en el que se inspira este curso. Para seguir después." }
];

const MATERIAS = [
  {
    id: "m1", n: 1, nombre: "Resolución de problemas y pensamiento computacional",
    semanas: [1, 2],
    desc: "Aprender un método para enfrentar problemas que no sabés resolver: comprender, planificar, ejecutar y revisar. Expresar soluciones como algoritmos precisos.",
    objetivos: ["Aplicar las 4 fases de Pólya de manera deliberada.", "Descomponer, abstraer y reconocer patrones.", "Escribir algoritmos en pseudocódigo y diagramas, y verificarlos con trazas."]
  },
  {
    id: "m2", n: 2, nombre: "Programación en Python",
    semanas: [3, 4, 5],
    desc: "Traducir algoritmos a programas reales. Python es el lenguaje del curso por su sintaxis cercana al pseudocódigo.",
    objetivos: ["Usar tipos, expresiones, entrada/salida.", "Dominar selección, repetición, contadores, acumuladores y banderas.", "Modularizar con funciones y probar con casos de prueba."]
  },
  {
    id: "m3", n: 3, nombre: "Análisis de algoritmos",
    semanas: [6, 7, 8],
    desc: "Razonar sobre si un algoritmo es correcto y cuánto cuesta. Búsqueda y ordenamiento como casos de estudio.",
    objetivos: ["Argumentar correctitud con invariantes e inducción.", "Estimar complejidad temporal con notación O.", "Implementar y comparar búsquedas y ordenamientos."]
  },
  {
    id: "m4", n: 4, nombre: "Estructuras de datos",
    semanas: [9, 10, 11],
    desc: "Elegir la forma de organizar los datos para que el algoritmo sea simple y eficiente.",
    objetivos: ["Usar pilas, colas, deques y listas enlazadas.", "Aplicar diccionarios y conjuntos (hashing), sumas prefijas y dos punteros.", "Entender árboles binarios de búsqueda y heaps."]
  },
  {
    id: "m5", n: 5, nombre: "Técnicas de diseño de algoritmos",
    semanas: [12, 13, 14],
    desc: "Familias de ideas que resuelven clases enteras de problemas.",
    objetivos: ["Pensar recursivamente y explorar con backtracking.", "Aplicar divide y vencerás y estrategias voraces (y saber cuándo fallan).", "Plantear estados y transiciones en programación dinámica."]
  },
  {
    id: "m6", n: 6, nombre: "Grafos e integración",
    semanas: [15, 16],
    desc: "Modelar problemas como grafos y cerrar el cuatrimestre con un proyecto integrador y un examen final.",
    objetivos: ["Representar grafos y recorrerlos con BFS/DFS.", "Calcular caminos mínimos y árboles de expansión mínima.", "Integrar todo en un proyecto propio."]
  }
];

/* Tipos de tarea: leer, ver, practicar, problema, reflexion, proyecto, examen */
const SEMANAS = [
  // ===================================================================== M1
  {
    n: 1, m: "m1", titulo: "¿Qué es un problema? El método de Pólya", horas: 9,
    objetivos: [
      "Distinguir ejercicio (aplicar algo conocido) de problema (no sabés de antemano cómo).",
      "Conocer y aplicar las cuatro fases de Pólya.",
      "Llevar un registro escrito de cómo resolviste cada problema."
    ],
    leccion: `
<p>Un <strong>ejercicio</strong> se resuelve aplicando un procedimiento que ya conocés. Un <strong>problema</strong> aparece cuando no sabés de antemano qué hacer. Este curso trata de lo segundo: vas a aprender a avanzar cuando estás trabado.</p>
<h4>Las cuatro fases (Pólya)</h4>
<ol>
<li><strong>Comprender el problema.</strong> ¿Cuál es la incógnita? ¿Cuáles son los datos? ¿Cuál es la condición? Reformulalo con tus palabras, dibujá, armá un ejemplo chico a mano.</li>
<li><strong>Concebir un plan.</strong> ¿Conocés un problema relacionado? ¿Podés resolver una versión más simple, un caso particular, o trabajar hacia atrás desde la meta?</li>
<li><strong>Ejecutar el plan.</strong> Llevalo a cabo verificando cada paso. ¿Podés ver claramente que el paso es correcto?</li>
<li><strong>Examinar la solución.</strong> ¿Podés verificar el resultado? ¿Obtenerlo de otra forma? ¿Usar el método para otro problema?</li>
</ol>
<h4>Heurísticas que vas a usar todo el cuatrimestre</h4>
<ul>
<li><em>Probá casos chicos</em> y buscá un patrón.</li>
<li><em>Resolvé un problema auxiliar</em> (más simple, con menos restricciones).</li>
<li><em>Trabajá hacia atrás</em> desde lo que querés obtener.</li>
<li><em>Introducí notación</em>: nombrar las cosas ayuda a pensar.</li>
<li><em>Buscá un invariante</em>: algo que no cambia mientras el proceso avanza.</li>
</ul>
<div class="callout"><strong>Hábito clave:</strong> para cada problema escribí una ficha con las 4 fases (plantilla en la <a href="#/guia">Guía</a>). Cuesta al principio; es lo que más acelera el aprendizaje.</div>
<h4>Ejemplo resuelto</h4>
<p><em>¿Cuántos apretones de mano hay si 10 personas se saludan todas entre sí una vez?</em></p>
<p><strong>Comprender:</strong> incógnita = cantidad de pares distintos. <strong>Plan:</strong> casos chicos: 2 personas → 1, 3 → 3, 4 → 6. Patrón: al agregar la persona n saluda a las n−1 anteriores, así que el total es 1+2+…+(n−1). <strong>Ejecutar:</strong> 1+…+9 = 45. <strong>Examinar:</strong> otra vía: cada una de las 10 personas da 9 apretones, y cada apretón se contó 2 veces: 10·9/2 = 45 ✔. Generaliza a n(n−1)/2.</p>`,
    lecturas: [
      { b: "polya", c: "Prefacios y Parte I «En el salón de clases» (secciones 1–20)" },
      { b: "polya", c: "Parte II «Cómo resolver un problema» (el diálogo con la lista de preguntas)" },
      { b: "joyanes", c: "Cap. 2, apartados sobre fases de resolución de problemas (análisis, diseño, verificación)" }
    ],
    recursos: [
      { n: "Video: el método de Pólya (búsqueda en YouTube)", u: yt("método de Polya resolución de problemas") },
      { n: "Video: Thinking like a computer scientist — CS50x semana 0", u: "https://cs50.harvard.edu/x/" }
    ],
    tareas: [
      { t: "leer", x: "Pólya, Parte I completa. Hacé un resumen de una página con la lista de preguntas de cada fase." },
      { t: "leer", x: "Pólya, Parte II. Imprimí o copiá la tabla «Cómo plantear y resolver problemas» y tenela a mano todo el curso." },
      { t: "ver", x: "Ver un video introductorio sobre el método de Pólya y anotar una idea que no estaba en tu resumen.", u: yt("método de Polya resolución de problemas") },
      { t: "practicar", x: "Resolver a mano 5 problemas de la Parte IV de Pólya («Problemas, sugerencias, soluciones») con ficha de 4 fases. Recién después mirá la sugerencia." },
      { t: "practicar", x: "Problema de la torre de Hanói con 1, 2, 3 y 4 discos (con monedas). ¿Cuántos movimientos mínimos? Conjeturá la fórmula." },
      { t: "practicar", x: "Problema de las 3 jarras: con jarras de 3 L y 5 L, medir exactamente 4 L. Describí la secuencia de pasos." },
      { t: "reflexion", x: "Escribí en tus notas: ¿en qué fase te trabás más? ¿Qué pregunta de Pólya te destrabó?" }
    ],
    autoeval: [
      "¿Podés enunciar las 4 fases y dar 2 preguntas de cada una sin mirar?",
      "¿Explicás la diferencia entre ejercicio y problema con un ejemplo propio?",
      "¿Verificaste la solución de al menos un problema por un segundo camino?"
    ]
  },
  {
    n: 2, m: "m1", titulo: "Algoritmos, pseudocódigo y trazas", horas: 10,
    objetivos: [
      "Definir algoritmo y sus propiedades: preciso, finito, definido.",
      "Expresar soluciones con pseudocódigo y diagramas de flujo.",
      "Verificar algoritmos con tablas de seguimiento (trazas)."
    ],
    leccion: `
<p>Un <strong>algoritmo</strong> es una secuencia finita de instrucciones precisas que transforma una entrada en una salida. Debe ser <em>preciso</em> (sin ambigüedad), <em>definido</em> (mismos datos → mismo resultado) y <em>finito</em> (termina).</p>
<h4>Pensamiento computacional</h4>
<ul>
<li><strong>Descomposición:</strong> partir el problema en subproblemas.</li>
<li><strong>Reconocimiento de patrones:</strong> ¿qué se repite?</li>
<li><strong>Abstracción:</strong> quedarte con lo esencial (los datos que importan).</li>
<li><strong>Algoritmo:</strong> los pasos, en orden.</li>
</ul>
<h4>Pseudocódigo</h4>
<pre><code>algoritmo MayorDeTres
  leer a, b, c
  mayor ← a
  si b > mayor entonces mayor ← b
  si c > mayor entonces mayor ← c
  escribir mayor
fin</code></pre>
<h4>Trazas</h4>
<p>Una traza (o prueba de escritorio) es una tabla con una columna por variable y una fila por paso. Es la forma de <em>ejecutar a mano</em> y encontrar errores antes de programar.</p>
<table><tr><th>paso</th><th>a</th><th>b</th><th>c</th><th>mayor</th></tr>
<tr><td>leer</td><td>4</td><td>9</td><td>7</td><td>–</td></tr>
<tr><td>mayor ← a</td><td>4</td><td>9</td><td>7</td><td>4</td></tr>
<tr><td>b &gt; mayor</td><td>4</td><td>9</td><td>7</td><td>9</td></tr>
<tr><td>c &gt; mayor</td><td>4</td><td>9</td><td>7</td><td>9</td></tr></table>
<div class="callout"><strong>Casos borde:</strong> siempre probá valores iguales, negativos, cero, el mínimo y el máximo posibles. La mayoría de los errores viven ahí.</div>`,
    lecturas: [
      { b: "joyanes", c: "Cap. 2 «Metodología de la programación y desarrollo de software» (algoritmos, pseudocódigo, diagramas de flujo, N-S)" },
      { b: "joyanes", c: "Cap. 3 «Estructura general de un programa»" },
      { b: "joyanesProb", c: "Cap. 1 «Algoritmos y programas» y Cap. 2 «La resolución de problemas con computadoras»" }
    ],
    recursos: [
      { n: "Khan Academy: ¿qué es un algoritmo?", u: "https://es.khanacademy.org/computing/computer-science/algorithms" },
      { n: "Video: pseudocódigo y diagramas de flujo", u: yt("pseudocódigo y diagramas de flujo para principiantes") }
    ],
    tareas: [
      { t: "leer", x: "Joyanes, Cap. 2 (hasta herramientas de programación) y Cap. 3." },
      { t: "ver", x: "Ver una introducción a pseudocódigo y diagramas de flujo.", u: yt("pseudocódigo y diagramas de flujo para principiantes") },
      { t: "practicar", x: "Escribir en pseudocódigo un algoritmo cotidiano (p. ej. preparar mate o cruzar la calle) y detectar ambigüedades." },
      { t: "practicar", x: "Libro de problemas Joyanes, Cap. 1 y 2: resolver 8 ejercicios con pseudocódigo + diagrama. Compará con la solución del libro." },
      { t: "practicar", x: "Hacer la traza completa de 3 de tus algoritmos con al menos 2 casos borde cada uno." },
      { t: "practicar", x: "Algoritmo de Euclides para el MCD: escribirlo en pseudocódigo y trazarlo para (48, 18) y (17, 5)." },
      { t: "reflexion", x: "Para un algoritmo propio: ¿cómo sabés que termina? Escribí el argumento." }
    ],
    autoeval: [
      "¿Podés escribir el pseudocódigo de máximo, mínimo y promedio de N números sin consultar?",
      "¿Hacés trazas con naturalidad e incluís casos borde?",
      "¿Podés explicar por qué el algoritmo de Euclides termina?"
    ]
  },
  // ===================================================================== M2
  {
    n: 3, m: "m2", titulo: "Python: variables, tipos, expresiones y E/S", horas: 10,
    objetivos: [
      "Instalar Python y un editor, ejecutar programas.",
      "Usar int, float, str, bool, operadores y conversiones.",
      "Leer la entrada y escribir la salida en el formato que exige un juez online."
    ],
    leccion: `
<h4>Entorno</h4>
<p>Instalá <a href="https://www.python.org/downloads/">Python 3</a> y un editor (VS Code, o Thonny si es tu primera vez). Creá una carpeta <code>curso/</code> con una subcarpeta por semana. Ejecutá con <code>python3 archivo.py</code>.</p>
<h4>Lo esencial</h4>
<pre><code># tipos y operadores
n = 17            # int
x = 3.5           # float
s = "hola"        # str
ok = n &gt; 10       # bool
print(n // 5, n % 5, 2 ** 10)   # división entera, resto, potencia → 3 2 1024

# entrada típica de juez: "3 4" en una línea
a, b = map(int, input().split())
print(a + b)

# una lista de números en una línea
nums = list(map(int, input().split()))</code></pre>
<h4>Cómo funciona un juez online</h4>
<p>El juez ejecuta tu programa con entradas ocultas y compara la salida <em>exacta</em>. Veredictos comunes: <code>AC</code> (aceptado), <code>WA</code> (respuesta incorrecta), <code>TLE</code> (tiempo excedido), <code>RE</code> (error en ejecución). Leé las restricciones: te dicen cuán eficiente debe ser la solución.</p>
<div class="callout warn">No imprimas mensajes como "Ingrese un número": el juez los toma como parte de la respuesta.</div>`,
    lecturas: [
      { b: "pytut", c: "Secciones 1 a 3 («Usando Python como calculadora»)" },
      { b: "py4e", c: "Capítulos 1 y 2 (variables, expresiones, sentencias)" },
      { b: "joyanes", c: "Cap. 3: tipos de datos, constantes, variables, expresiones y operaciones de entrada/salida" }
    ],
    recursos: [
      { n: "Python para todos (curso con videos)", u: "https://es.py4e.com/" },
      { n: "Python Tutor — visualizá tu código", u: "https://pythontutor.com/" },
      { n: "Video: curso de Python desde cero", u: yt("curso python desde cero español") }
    ],
    tareas: [
      { t: "practicar", x: "Instalar Python + editor. Ejecutar un «hola mundo» y un programa que sume dos números leídos de la entrada." },
      { t: "leer", x: "Tutorial oficial de Python, secciones 1–3.", u: "https://docs.python.org/es/3/tutorial/" },
      { t: "ver", x: "Python para todos: videos de los capítulos 1 y 2.", u: "https://es.py4e.com/" },
      { t: "practicar", x: "Traducir a Python 5 algoritmos que escribiste en la semana 2." },
      { t: "problema", x: "Crear cuenta en CSES y resolver «Weird Algorithm».", u: cses(1068) },
      { t: "problema", x: "CSES «Missing Number».", u: cses(1083) },
      { t: "problema", x: "Crear cuenta en Acepta el Reto y resolver 3 problemas de la categoría de iniciación.", u: "https://aceptaelreto.com/" },
      { t: "practicar", x: "Exercism Python: completar 3 ejercicios del track.", u: "https://exercism.org/tracks/python" }
    ],
    autoeval: [
      "¿Sabés la diferencia entre / y //, y qué hace %?",
      "¿Podés leer N números de una línea y procesarlos?",
      "¿Entendés qué significan WA y TLE y qué hacer en cada caso?"
    ]
  },
  {
    n: 4, m: "m2", titulo: "Estructuras de control: selección y repetición", horas: 11,
    objetivos: [
      "Usar if/elif/else, while y for con rangos.",
      "Aplicar contadores, acumuladores y banderas (interruptores).",
      "Diseñar ciclos correctos: inicialización, condición, avance."
    ],
    leccion: `
<h4>Selección</h4>
<pre><code>if nota &gt;= 7:
    print("promocionado")
elif nota &gt;= 4:
    print("aprobado")
else:
    print("desaprobado")</code></pre>
<h4>Repetición</h4>
<pre><code># for: cantidad conocida de vueltas
total = 0                      # acumulador
pares = 0                      # contador
for i in range(1, n + 1):
    total += i
    if i % 2 == 0:
        pares += 1

# while: hasta que se cumpla una condición
encontrado = False             # bandera
while not encontrado and i &lt; n:
    ...</code></pre>
<h4>Anatomía de un ciclo correcto</h4>
<ol><li><strong>Inicialización:</strong> ¿con qué valores arrancan las variables?</li>
<li><strong>Condición:</strong> ¿cuándo sigue? ¿se vuelve falsa alguna vez?</li>
<li><strong>Cuerpo:</strong> ¿qué cambia en cada vuelta?</li>
<li><strong>Salida:</strong> al terminar, ¿qué vale cada variable?</li></ol>
<div class="callout">El error más común es el «off-by-one» (una vuelta de más o de menos). Trazá el ciclo para n = 0, 1 y 2 antes de enviarlo.</div>`,
    lecturas: [
      { b: "joyanes", c: "Cap. 4 «Flujo de control I: estructuras selectivas»" },
      { b: "joyanes", c: "Cap. 5 «Flujo de control II: estructuras repetitivas»" },
      { b: "joyanesProb", c: "Cap. 3 (contadores, acumuladores e interruptores) y Cap. 4 (programación estructurada)" },
      { b: "pytut", c: "Sección 4.1–4.5 (if, for, range, break, continue)" }
    ],
    recursos: [
      { n: "Python para todos: cap. 3 y 5", u: "https://es.py4e.com/" },
      { n: "Video: bucles for y while en Python", u: yt("bucles for while python explicación") }
    ],
    tareas: [
      { t: "leer", x: "Joyanes, Cap. 4 y 5 (podés saltear los ejemplos en otros lenguajes)." },
      { t: "practicar", x: "Libro de problemas, Cap. 3 y 4: resolver 10 ejercicios, primero en pseudocódigo y luego en Python." },
      { t: "practicar", x: "Programas: tabla de multiplicar, factorial, ¿es primo?, suma de dígitos, invertir un número, secuencia de Fibonacci hasta N." },
      { t: "problema", x: "CSES «Repetitions».", u: cses(1069) },
      { t: "problema", x: "CSES «Increasing Array».", u: cses(1094) },
      { t: "problema", x: "CSES «Number Spiral» (pensá antes de codificar: buscá el patrón).", u: cses(1071) },
      { t: "problema", x: "LeetCode «Fizz Buzz» y «Palindrome Number».", u: lc("fizz-buzz") },
      { t: "reflexion", x: "Elegí tu ciclo más difícil y escribí: inicialización, condición, qué cambia y por qué termina." }
    ],
    autoeval: [
      "¿Elegís for o while con un criterio claro?",
      "¿Distinguís contador, acumulador y bandera, y los inicializás bien?",
      "¿Probás tus ciclos con n = 0 y n = 1?"
    ]
  },
  {
    n: 5, m: "m2", titulo: "Funciones, cadenas, listas y pruebas", horas: 11,
    objetivos: [
      "Definir funciones con parámetros y valor de retorno; entender el alcance.",
      "Manipular cadenas y listas (arrays).",
      "Escribir casos de prueba con assert."
    ],
    leccion: `
<h4>Funciones: diseño descendente</h4>
<p>Una función resuelve un subproblema con un nombre. Escribí primero <em>qué</em> hace (contrato) y después <em>cómo</em>.</p>
<pre><code>def es_primo(n: int) -&gt; bool:
    """Devuelve True si n es primo. Precondición: n &gt;= 0."""
    if n &lt; 2:
        return False
    d = 2
    while d * d &lt;= n:          # basta probar hasta √n
        if n % d == 0:
            return False
        d += 1
    return True

assert es_primo(2) and es_primo(97)
assert not es_primo(0) and not es_primo(1) and not es_primo(91)</code></pre>
<h4>Listas y cadenas</h4>
<pre><code>v = [5, 3, 8]
v.append(1); v[0] = 7; len(v); v[-1]; v[1:3]
for i, x in enumerate(v): ...
s = "anilina"
s[::-1] == s           # ¿palíndromo?
s.count("a"); s.split(); "-".join(["a", "b"])</code></pre>
<div class="callout"><strong>Prueba antes de enviar:</strong> por cada función escribí 3–5 <code>assert</code> con casos normales y casos borde. Es el hábito que separa a quien «cree» que funciona de quien lo sabe.</div>`,
    lecturas: [
      { b: "joyanes", c: "Cap. 6 «Subprogramas: funciones»" },
      { b: "joyanes", c: "Cap. 7 «Estructuras de datos I (arrays y estructuras)» y Cap. 8 «Las cadenas de caracteres»" },
      { b: "joyanesProb", c: "Cap. 5 (subprogramas), Cap. 6 (arrays y registros) y Cap. 7 (cadenas)" },
      { b: "pytut", c: "Sección 4.7–4.8 (funciones) y 5.1 (listas)" }
    ],
    recursos: [
      { n: "Python para todos: cap. 4, 6 y 8", u: "https://es.py4e.com/" },
      { n: "Aprende Python: funciones y listas", u: "https://aprendepython.es/" }
    ],
    tareas: [
      { t: "leer", x: "Joyanes, Cap. 6, 7 y 8 (enfocate en conceptos; la sintaxis la ves en Python)." },
      { t: "practicar", x: "Reescribir 5 programas de la semana 4 como funciones con docstring y asserts." },
      { t: "practicar", x: "Libro de problemas, Cap. 6 y 7: 8 ejercicios de arrays y cadenas en Python." },
      { t: "problema", x: "CSES «Permutations».", u: cses(1070) },
      { t: "problema", x: "CSES «Palindrome Reorder».", u: cses(1755) },
      { t: "problema", x: "CSES «Two Knights» (primero contá a mano para n = 1..4).", u: cses(1072) },
      { t: "problema", x: "LeetCode «Two Sum» (por ahora con dos ciclos; en la semana 10 lo mejorarás).", u: lc("two-sum") },
      { t: "reflexion", x: "Hito de materia: listá 3 cosas que hoy hacés sin pensar y que hace un mes no sabías." }
    ],
    autoeval: [
      "¿Sabés qué significa que una variable sea local a una función?",
      "¿Podés recorrer una lista con índices y con enumerate?",
      "¿Escribís asserts antes de dar por terminado un ejercicio?"
    ]
  },
  // ===================================================================== M3
  {
    n: 6, m: "m3", titulo: "Correctitud: invariantes, inducción y sumatorias", horas: 10,
    objetivos: [
      "Probar propiedades por inducción matemática.",
      "Identificar el invariante de un ciclo y usarlo para argumentar correctitud.",
      "Manejar sumatorias básicas que aparecen al contar operaciones."
    ],
    leccion: `
<h4>Inducción</h4>
<p>Para probar que P(n) vale para todo n ≥ 1: (1) <strong>base</strong>: P(1) es verdadera; (2) <strong>paso</strong>: si P(k) es verdadera, entonces P(k+1) también.</p>
<p>Ejemplo: 1 + 2 + … + n = n(n+1)/2. Base: 1 = 1·2/2 ✔. Paso: si vale para k, entonces 1+…+k+(k+1) = k(k+1)/2 + (k+1) = (k+1)(k+2)/2 ✔.</p>
<h4>Invariantes de ciclo</h4>
<p>Un invariante es una afirmación que es verdadera antes de cada vuelta. Si vale al inicio, se conserva en cada vuelta y, junto con la condición de salida, implica lo que querés: el ciclo es correcto.</p>
<pre><code>def maximo(v):
    m = v[0]
    for i in range(1, len(v)):
        # Invariante: m es el máximo de v[0..i-1]
        if v[i] &gt; m:
            m = v[i]
    # Al salir i = len(v): m es el máximo de todo v
    return m</code></pre>
<h4>Sumatorias que conviene saber</h4>
<ul><li>Σ i (i = 1..n) = n(n+1)/2 ≈ n²/2</li>
<li>Σ 2^i (i = 0..k) = 2^(k+1) − 1</li>
<li>1 + 1/2 + 1/4 + … &lt; 2</li>
<li>Cantidad de veces que podés dividir n por 2 hasta llegar a 1: ≈ log₂ n</li></ul>`,
    lecturas: [
      { b: "rosen", c: "Cap. sobre inducción matemática y sumatorias" },
      { b: "mcs", c: "Cap. 5 «Induction» y Cap. 6 «State Machines» (invariantes)" },
      { b: "polya", c: "Parte III, entradas «Inducción e inducción matemática» y «Generalización»" }
    ],
    recursos: [
      { n: "Video: inducción matemática explicada", u: yt("inducción matemática explicación ejemplos") },
      { n: "Video: invariante de ciclo (loop invariant)", u: yt("loop invariant correctness proof") }
    ],
    tareas: [
      { t: "leer", x: "Pólya, Parte III: «Inducción e inducción matemática». Rosen o MCS: capítulo de inducción." },
      { t: "ver", x: "Ver una explicación de inducción y otra de invariantes de ciclo.", u: yt("inducción matemática explicación ejemplos") },
      { t: "practicar", x: "Probar por inducción: Σ 2^i = 2^(n+1) − 1; n³ − n es divisible por 3; el número de movimientos de Hanói es 2^n − 1." },
      { t: "practicar", x: "Escribir el invariante de 4 funciones tuyas (suma, máximo, contar pares, invertir lista)." },
      { t: "problema", x: "CSES «Bit Strings» (¿por qué 2^n? argumentalo).", u: cses(1617) },
      { t: "problema", x: "CSES «Trailing Zeros» (pensá con Pólya: ¿de dónde sale cada cero?).", u: cses(1618) },
      { t: "problema", x: "CSES «Coin Piles» (buscá un invariante).", u: cses(1754) },
      { t: "reflexion", x: "¿Qué relación ves entre inducción y un ciclo bien escrito?" }
    ],
    autoeval: [
      "¿Podés hacer una prueba por inducción con base y paso bien separados?",
      "¿Sabés escribir el invariante de un ciclo de búsqueda o acumulación?",
      "¿Recordás Σ i y por qué log₂ n aparece al dividir a la mitad?"
    ]
  },
  {
    n: 7, m: "m3", titulo: "Complejidad y búsqueda", horas: 11,
    objetivos: [
      "Contar operaciones y expresar costo con notación O.",
      "Comparar O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ).",
      "Implementar búsqueda lineal y binaria, y aplicar búsqueda binaria sobre la respuesta."
    ],
    leccion: `
<h4>¿Por qué O grande?</h4>
<p>Nos interesa cómo crece el tiempo cuando crece la entrada <em>n</em>, ignorando constantes. Regla práctica para jueces: ~10⁸ operaciones simples por segundo en C++, bastante menos en Python (~10⁷).</p>
<table><tr><th>n máximo</th><th>complejidad aceptable</th></tr>
<tr><td>≤ 20</td><td>O(2ⁿ), O(n!)</td></tr><tr><td>≤ 5 000</td><td>O(n²)</td></tr>
<tr><td>≤ 10⁶</td><td>O(n log n), O(n)</td></tr><tr><td>enorme</td><td>O(log n), O(1)</td></tr></table>
<h4>Búsqueda binaria</h4>
<pre><code>def busqueda_binaria(v, x):
    """v ordenada. Devuelve un índice de x o -1."""
    lo, hi = 0, len(v) - 1
    while lo &lt;= hi:
        # Invariante: si x está en v, está en v[lo..hi]
        mid = (lo + hi) // 2
        if v[mid] == x:
            return mid
        if v[mid] &lt; x:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1</code></pre>
<p>Cada vuelta descarta la mitad: ≤ log₂ n + 1 vueltas. Con n = 10⁶ son ~20 comparaciones contra un millón.</p>
<h4>Búsqueda binaria sobre la respuesta</h4>
<p>Si la pregunta es «¿cuál es el mínimo T tal que <em>se puede</em>?» y la propiedad es monótona (si se puede con T, se puede con T+1), buscás T con binaria. Es una de las ideas más poderosas del curso.</p>`,
    lecturas: [
      { b: "joyanes", c: "Cap. 10 «Ordenación, búsqueda e intercalación» — apartados de búsqueda" },
      { b: "joyanesProb", c: "Cap. 10.1 (búsqueda secuencial y binaria)" },
      { b: "pythoned", c: "Cap. 2 «Análisis de algoritmos» y Cap. 5 «Búsqueda»" },
      { b: "laaksonen", c: "Cap. 2 «Time complexity»" }
    ],
    recursos: [
      { n: "Khan Academy: búsqueda binaria y notación asintótica", u: "https://es.khanacademy.org/computing/computer-science/algorithms" },
      { n: "Video: notación Big O", u: yt("notación big o explicación español") },
      { n: "VisuAlgo", u: "https://visualgo.net/es" }
    ],
    tareas: [
      { t: "leer", x: "Libro interactivo «Solución de problemas…»: capítulo de análisis de algoritmos.", u: "https://runestone.academy/ns/books/published/pythoned/index.html" },
      { t: "ver", x: "Khan Academy: completar «Búsqueda binaria» y «Notación asintótica».", u: "https://es.khanacademy.org/computing/computer-science/algorithms" },
      { t: "practicar", x: "Medir con time.perf_counter la búsqueda lineal vs binaria para n = 10³…10⁷ y graficar o tabular." },
      { t: "practicar", x: "Clasificar por complejidad 10 fragmentos de código tuyos de semanas anteriores." },
      { t: "problema", x: "LeetCode «Binary Search» y «Search Insert Position».", u: lc("binary-search") },
      { t: "problema", x: "LeetCode «Sqrt(x)» con búsqueda binaria.", u: lc("sqrtx") },
      { t: "problema", x: "CSES «Factory Machines» (binaria sobre la respuesta).", u: cses(1620) },
      { t: "reflexion", x: "Escribí con tus palabras por qué la búsqueda binaria es O(log n)." }
    ],
    autoeval: [
      "Dado un código con dos ciclos anidados, ¿podés decir su complejidad?",
      "¿Escribís búsqueda binaria sin errores de borde (lo, hi, mid)?",
      "¿Reconocés cuándo aplicar binaria sobre la respuesta?"
    ]
  },
  {
    n: 8, m: "m3", titulo: "Ordenamiento + Primer parcial", horas: 12,
    objetivos: [
      "Implementar selección, inserción, burbuja y merge sort; entender quicksort.",
      "Comparar costos O(n²) vs O(n log n) y estabilidad.",
      "Usar el ordenamiento como paso previo para simplificar problemas.",
      "Rendir el primer parcial (semanas 1–8)."
    ],
    leccion: `
<h4>Ordenamientos cuadráticos</h4>
<pre><code>def insercion(v):
    for i in range(1, len(v)):
        x, j = v[i], i - 1
        # Invariante: v[0..i-1] está ordenado
        while j &gt;= 0 and v[j] &gt; x:
            v[j + 1] = v[j]
            j -= 1
        v[j + 1] = x</code></pre>
<h4>Merge sort (divide y vencerás)</h4>
<pre><code>def merge_sort(v):
    if len(v) &lt;= 1:
        return v
    m = len(v) // 2
    a, b = merge_sort(v[:m]), merge_sort(v[m:])
    res, i, j = [], 0, 0
    while i &lt; len(a) and j &lt; len(b):
        if a[i] &lt;= b[j]: res.append(a[i]); i += 1
        else:            res.append(b[j]); j += 1
    return res + a[i:] + b[j:]</code></pre>
<p>log₂ n niveles × O(n) por nivel = <strong>O(n log n)</strong>.</p>
<h4>Ordenar para simplificar</h4>
<p>Muchos problemas se vuelven fáciles con los datos ordenados: duplicados quedan contiguos, la mediana está en el medio, los extremos en las puntas. En la práctica usá <code>sorted(v)</code> o <code>v.sort(key=...)</code> (Timsort, O(n log n), estable).</p>
<div class="callout"><strong>Primer parcial.</strong> Reservá un bloque de 3 horas sin interrupciones. Las consignas están en las tareas de esta semana. Corregilo con los criterios de la <a href="#/guia">Guía</a> y registrá la nota en tus notas de semana.</div>`,
    lecturas: [
      { b: "joyanes", c: "Cap. 10 «Ordenación, búsqueda e intercalación» — ordenación interna e intercalación" },
      { b: "joyanesProb", c: "Cap. 10.2–10.3 (selección, burbuja, inserción, Shell, ordenación rápida, intercalación)" },
      { b: "pythoned", c: "Cap. 5 «Ordenamiento»" },
      { b: "laaksonen", c: "Cap. 3 «Sorting»" }
    ],
    recursos: [
      { n: "VisuAlgo: ordenamiento", u: "https://visualgo.net/es/sorting" },
      { n: "Video: merge sort y quicksort", u: yt("merge sort quicksort explicación español") }
    ],
    tareas: [
      { t: "leer", x: "Joyanes Cap. 10 (ordenación) y «Solución de problemas…» cap. de ordenamiento." },
      { t: "ver", x: "Ver en VisuAlgo burbuja, inserción, merge y quick con el mismo arreglo.", u: "https://visualgo.net/es/sorting" },
      { t: "practicar", x: "Implementar selección, inserción, burbuja y merge sort con asserts. Comparar tiempos para n = 10³, 10⁴, 10⁵." },
      { t: "problema", x: "CSES «Distinct Numbers».", u: cses(1621) },
      { t: "problema", x: "CSES «Stick Lengths» (¿por qué la mediana?).", u: cses(1074) },
      { t: "problema", x: "CSES «Apartments» (ordenar + dos punteros).", u: cses(1084) },
      { t: "examen", x: "PARCIAL 1 (3 h, sin consultar): (1) ficha Pólya completa del problema CSES «Ferris Wheel» y solución AC; (2) pseudocódigo + traza de un algoritmo que diga si una lista es palíndromo; (3) probar por inducción Σ (2i−1) = n²; (4) dar la complejidad de 3 fragmentos de código de tu elección y justificarla; (5) implementar búsqueda binaria con invariante comentado.", u: cses(1090) },
      { t: "reflexion", x: "Autocorrección del parcial con la rúbrica de la Guía. Anotá nota y qué repasar." }
    ],
    autoeval: [
      "¿Explicás por qué merge sort es O(n log n)?",
      "¿Sabés qué es un ordenamiento estable y cuándo importa?",
      "¿Aprobaste el parcial con ≥ 60 %? Si no, ¿qué semana repasás?"
    ]
  },
  // ===================================================================== M4
  {
    n: 9, m: "m4", titulo: "Estructuras lineales: pilas, colas y listas enlazadas", horas: 11,
    objetivos: [
      "Entender los TAD pila (LIFO) y cola (FIFO) y sus operaciones O(1).",
      "Implementar una lista enlazada y comparar con arrays.",
      "Resolver problemas típicos: paréntesis balanceados, evaluación de expresiones, simulación."
    ],
    leccion: `
<h4>Tipo abstracto de datos (TAD)</h4>
<p>Un TAD define <em>qué operaciones</em> hay y qué hacen, no cómo se implementan. Pila: <code>push</code>, <code>pop</code>, <code>top</code>. Cola: <code>enqueue</code>, <code>dequeue</code>.</p>
<pre><code>pila = []
pila.append(x); pila.pop(); pila[-1]   # O(1)

from collections import deque
cola = deque()
cola.append(x); cola.popleft()         # O(1) — ¡no uses list.pop(0), es O(n)!</code></pre>
<h4>Paréntesis balanceados</h4>
<pre><code>def balanceado(s):
    pares = {")": "(", "]": "[", "}": "{"}
    pila = []
    for c in s:
        if c in "([{":
            pila.append(c)
        elif c in pares:
            if not pila or pila.pop() != pares[c]:
                return False
    return not pila</code></pre>
<h4>Listas enlazadas</h4>
<p>Cada nodo guarda un valor y una referencia al siguiente. Insertar/borrar al principio es O(1), acceder al i-ésimo es O(n). En arrays es al revés. Elegir estructura = elegir qué operaciones querés baratas.</p>
<h4>Pila monótona</h4>
<p>Para «el próximo elemento mayor/menor» de cada posición: mantené una pila ordenada y descartá lo que ya no puede ser respuesta. Cada elemento entra y sale una vez → O(n).</p>`,
    lecturas: [
      { b: "joyanes", c: "Cap. 12 «Estructuras dinámicas lineales de datos (pilas, colas y listas enlazadas)»" },
      { b: "joyanesProb", c: "Cap. 12 (listas enlazadas, pilas, colas y sus aplicaciones)" },
      { b: "pythoned", c: "Cap. 3 «Estructuras de datos básicas»" }
    ],
    recursos: [
      { n: "VisuAlgo: lista enlazada, pila, cola", u: "https://visualgo.net/es/list" },
      { n: "Video: pilas y colas", u: yt("pilas y colas estructuras de datos explicación") }
    ],
    tareas: [
      { t: "leer", x: "Joyanes Cap. 12 y «Solución de problemas…» cap. 3." },
      { t: "practicar", x: "Implementar clases Pila, Cola y ListaEnlazada (insertar, borrar, buscar, imprimir) con asserts." },
      { t: "practicar", x: "Libro de problemas Cap. 12: 5 ejercicios (incluí evaluación de expresión postfija)." },
      { t: "problema", x: "LeetCode «Valid Parentheses».", u: lc("valid-parentheses") },
      { t: "problema", x: "LeetCode «Reverse Linked List» y «Merge Two Sorted Lists».", u: lc("reverse-linked-list") },
      { t: "problema", x: "LeetCode «Min Stack» e «Implement Queue using Stacks».", u: lc("min-stack") },
      { t: "problema", x: "CSES «Nearest Smaller Values» (pila monótona).", u: cses(1645) },
      { t: "problema", x: "LeetCode «Daily Temperatures».", u: lc("daily-temperatures") }
    ],
    autoeval: [
      "¿Sabés por qué list.pop(0) es lento y qué usar en su lugar?",
      "¿Podés implementar una lista enlazada sin mirar?",
      "¿Reconocés un problema de pila monótona?"
    ]
  },
  {
    n: 10, m: "m4", titulo: "Diccionarios, conjuntos, hashing y técnicas sobre arreglos", horas: 11,
    objetivos: [
      "Entender la idea de tabla hash y el costo promedio O(1).",
      "Usar dict, set y Counter para contar y buscar.",
      "Aplicar sumas prefijas, dos punteros y ventana deslizante."
    ],
    leccion: `
<h4>Hashing</h4>
<p>Una función hash transforma una clave en una posición de un arreglo. Con buena dispersión, buscar, insertar y borrar cuestan O(1) en promedio. Las <em>colisiones</em> se resuelven con encadenamiento o direccionamiento abierto (Joyanes las llama «búsqueda por transformación de claves»).</p>
<pre><code># Two Sum en O(n)
def two_sum(nums, objetivo):
    visto = {}                       # valor -&gt; índice
    for i, x in enumerate(nums):
        if objetivo - x in visto:
            return visto[objetivo - x], i
        visto[x] = i</code></pre>
<h4>Sumas prefijas</h4>
<pre><code>pre = [0]
for x in v:
    pre.append(pre[-1] + x)
# suma de v[a..b] = pre[b+1] - pre[a]   → O(1) por consulta</code></pre>
<h4>Dos punteros / ventana deslizante</h4>
<p>Sobre un arreglo (a veces ordenado), mantené dos índices que sólo avanzan. Como cada uno recorre a lo sumo n posiciones, el total es O(n) en lugar de O(n²).</p>`,
    lecturas: [
      { b: "joyanes", c: "Cap. 10, apartado de búsqueda por transformación de claves (hash)" },
      { b: "joyanesProb", c: "Cap. 10.1.3 (funciones de conversión de clave y resolución de colisiones)" },
      { b: "pythoned", c: "Cap. 5, sección «Hashing»" },
      { b: "laaksonen", c: "Cap. 4 «Data structures» y Cap. 8 (técnicas de dos punteros)" }
    ],
    recursos: [
      { n: "VisuAlgo: tabla hash", u: "https://visualgo.net/es/hashtable" },
      { n: "Video: tablas hash", u: yt("tablas hash explicación colisiones") }
    ],
    tareas: [
      { t: "leer", x: "Sección de hashing en «Solución de problemas…» y Joyanes (transformación de claves)." },
      { t: "practicar", x: "Implementar una tabla hash simple con encadenamiento (insertar, buscar, borrar) y medir colisiones." },
      { t: "problema", x: "LeetCode «Two Sum» de nuevo, ahora en O(n). Compará con tu versión de la semana 5.", u: lc("two-sum") },
      { t: "problema", x: "LeetCode «Group Anagrams» y «Top K Frequent Elements».", u: lc("group-anagrams") },
      { t: "problema", x: "CSES «Sum of Two Values».", u: cses(1640) },
      { t: "problema", x: "CSES «Static Range Sum Queries» (sumas prefijas).", u: cses(1646) },
      { t: "problema", x: "CSES «Subarray Sums I» (dos punteros).", u: cses(1660) },
      { t: "problema", x: "CSES «Playlist» (ventana deslizante + set).", u: cses(1141) }
    ],
    autoeval: [
      "¿Sabés qué es una colisión y dos formas de resolverla?",
      "¿Convertís un O(n²) en O(n) con un diccionario cuando corresponde?",
      "¿Armás sumas prefijas sin errores de índice?"
    ]
  },
  {
    n: 11, m: "m4", titulo: "Árboles, árboles binarios de búsqueda y heaps", horas: 11,
    objetivos: [
      "Conocer la terminología de árboles y los recorridos pre/in/post-orden y por niveles.",
      "Implementar un ABB (insertar, buscar) y entender su costo.",
      "Usar heaps (heapq) como cola de prioridad."
    ],
    leccion: `
<h4>Árboles</h4>
<p>Raíz, hijos, hojas, altura, profundidad. Un árbol binario tiene a lo sumo dos hijos por nodo. Casi todo sobre árboles se resuelve <strong>recursivamente</strong>: resolvé para el subárbol izquierdo, el derecho, y combiná.</p>
<pre><code>class Nodo:
    def __init__(self, v):
        self.v, self.izq, self.der = v, None, None

def altura(t):
    if t is None:
        return 0
    return 1 + max(altura(t.izq), altura(t.der))

def inorden(t):               # en un ABB, da los valores ordenados
    if t:
        yield from inorden(t.izq)
        yield t.v
        yield from inorden(t.der)</code></pre>
<h4>Árbol binario de búsqueda</h4>
<p>Todo lo del subárbol izquierdo es menor y todo lo del derecho, mayor. Buscar e insertar cuestan O(altura): O(log n) si está balanceado, O(n) si degenera en una lista (por ejemplo, insertando datos ya ordenados).</p>
<h4>Heap / cola de prioridad</h4>
<pre><code>import heapq
h = []
heapq.heappush(h, 5); heapq.heappush(h, 1)
heapq.heappop(h)      # 1 — el mínimo, O(log n)</code></pre>
<p>Para un max-heap, guardá valores negados. Lo vas a necesitar en Dijkstra (semana 16).</p>`,
    lecturas: [
      { b: "joyanes", c: "Cap. 13 «Estructuras de datos no lineales (árboles y grafos)» — parte de árboles" },
      { b: "joyanesProb", c: "Cap. 13.1–13.2 (árboles binarios, recorridos, árbol binario de búsqueda)" },
      { b: "pythoned", c: "Cap. 6 «Árboles y algoritmos sobre árboles»" }
    ],
    recursos: [
      { n: "VisuAlgo: ABB y heap", u: "https://visualgo.net/es/bst" },
      { n: "Video: árboles binarios de búsqueda", u: yt("árbol binario de búsqueda explicación recorridos") }
    ],
    tareas: [
      { t: "leer", x: "Joyanes Cap. 13 (árboles) y «Solución de problemas…» cap. 6." },
      { t: "practicar", x: "Implementar ABB: insertar, buscar, mínimo, recorridos (4 tipos), altura. Insertar 1..1000 en orden y medir la altura. ¿Qué pasó?" },
      { t: "practicar", x: "Libro de problemas Cap. 13: 4 ejercicios de árboles." },
      { t: "problema", x: "LeetCode «Maximum Depth of Binary Tree» e «Invert Binary Tree».", u: lc("maximum-depth-of-binary-tree") },
      { t: "problema", x: "LeetCode «Validate Binary Search Tree».", u: lc("validate-binary-search-tree") },
      { t: "problema", x: "LeetCode «Kth Largest Element in an Array» (con heap).", u: lc("kth-largest-element-in-an-array") },
      { t: "problema", x: "CSES «Concert Tickets» (estructura ordenada; en Python investigá bisect o SortedList).", u: cses(1091) },
      { t: "reflexion", x: "Hito de materia: tabla comparativa (lista, dict, set, deque, heap, ABB) con el costo de buscar/insertar/borrar/mínimo." }
    ],
    autoeval: [
      "¿Escribís recursivamente altura, cantidad de nodos y suma de un árbol?",
      "¿Sabés por qué un ABB puede degenerar?",
      "¿Elegís heap cuando necesitás «el mínimo» repetidas veces?"
    ]
  },
  // ===================================================================== M5
  {
    n: 12, m: "m5", titulo: "Recursión y backtracking", horas: 11,
    objetivos: [
      "Diseñar funciones recursivas con caso base y reducción.",
      "Entender la pila de llamadas y el costo de la recursión.",
      "Generar subconjuntos y permutaciones; resolver problemas con backtracking."
    ],
    leccion: `
<h4>Pensar recursivamente</h4>
<p>Confiá en que la función resuelve el problema para entradas más chicas (como la hipótesis inductiva) y preguntate: ¿cómo uso esa respuesta para la entrada actual? Siempre: <strong>caso base</strong> + <strong>paso que achica</strong>.</p>
<pre><code>def hanoi(n, origen, destino, aux):
    if n == 0:
        return
    hanoi(n - 1, origen, aux, destino)
    print(origen, destino)
    hanoi(n - 1, aux, destino, origen)</code></pre>
<h4>Backtracking: explorar con vuelta atrás</h4>
<p>Construí la solución paso a paso; en cada paso probá cada opción válida, recursá, y deshacé la elección al volver.</p>
<pre><code>def subconjuntos(v):
    res, actual = [], []
    def bt(i):
        if i == len(v):
            res.append(actual[:])
            return
        bt(i + 1)                 # no tomar v[i]
        actual.append(v[i])
        bt(i + 1)                 # tomar v[i]
        actual.pop()              # deshacer
    bt(0)
    return res</code></pre>
<p>2ⁿ subconjuntos, n! permutaciones: sólo viable para n chico (≈ 20 y ≈ 10). La <em>poda</em> (cortar ramas que no pueden llevar a solución) hace la diferencia.</p>
<div class="callout"><strong>Proyecto integrador:</strong> esta semana elegí tema (ver tarea). Lo desarrollás en paralelo hasta la semana 16.</div>`,
    lecturas: [
      { b: "joyanes", c: "Cap. 14 «Recursividad»" },
      { b: "joyanesProb", c: "Cap. 5.7 (algoritmos recursivos y algoritmos con retroceso)" },
      { b: "pythoned", c: "Cap. 4 «Recursión»" },
      { b: "erickson", c: "Cap. 1 «Recursion» y Cap. 2 «Backtracking»" }
    ],
    recursos: [
      { n: "Python Tutor: mirá la pila de llamadas de hanoi(3)", u: "https://pythontutor.com/" },
      { n: "Video: backtracking explicado", u: yt("backtracking explicación n reinas") }
    ],
    tareas: [
      { t: "leer", x: "Joyanes Cap. 14 y Erickson cap. 1–2 (lectura guiada: ejemplos principales).", u: "https://jeffe.cs.illinois.edu/teaching/algorithms/" },
      { t: "practicar", x: "Recursivas: potencia rápida, suma de dígitos, palíndromo, MCD, búsqueda binaria recursiva. Visualizá una en Python Tutor." },
      { t: "problema", x: "CSES «Tower of Hanoi».", u: cses(2165) },
      { t: "problema", x: "CSES «Creating Strings» (permutaciones sin repetir).", u: cses(1622) },
      { t: "problema", x: "CSES «Apple Division» (subconjuntos).", u: cses(1623) },
      { t: "problema", x: "CSES «Chessboard and Queens» (backtracking con poda).", u: cses(1624) },
      { t: "problema", x: "LeetCode «Subsets» y «Permutations».", u: lc("subsets") },
      { t: "proyecto", x: "Proyecto integrador — elegir tema y escribir una propuesta de 1 página: problema, entradas/salidas, algoritmos previstos (ver ideas en la Guía)." }
    ],
    autoeval: [
      "¿Identificás caso base y reducción en cualquier función recursiva?",
      "¿Podés escribir el esqueleto de backtracking sin consultar?",
      "¿Estimás cuántas ramas explora tu backtracking?"
    ]
  },
  {
    n: 13, m: "m5", titulo: "Divide y vencerás y algoritmos voraces", horas: 11,
    objetivos: [
      "Aplicar divide y vencerás y analizar su costo con el árbol de recursión.",
      "Diseñar algoritmos voraces (greedy) y justificar su correctitud con un argumento de intercambio.",
      "Encontrar contraejemplos cuando una estrategia voraz falla."
    ],
    leccion: `
<h4>Divide y vencerás</h4>
<p>Dividir en subproblemas independientes, resolverlos recursivamente, combinar. Merge sort, búsqueda binaria y potencia rápida son ejemplos. Si dividís en 2 mitades y combinás en O(n): T(n) = 2T(n/2) + O(n) = O(n log n).</p>
<h4>Voraces</h4>
<p>Tomá en cada paso la decisión que parece mejor ahora y nunca vuelvas atrás. Es simple y rápido, pero <strong>sólo funciona si podés probarlo</strong>.</p>
<pre><code># Máxima cantidad de actividades sin superponerse:
# ordenar por hora de FIN y tomar la primera compatible.
def actividades(intervalos):
    intervalos.sort(key=lambda p: p[1])
    fin, cuenta = float("-inf"), 0
    for a, b in intervalos:
        if a &gt;= fin:
            cuenta += 1
            fin = b
    return cuenta</code></pre>
<p><strong>Argumento de intercambio:</strong> tomá una solución óptima cualquiera; si su primera actividad no es la que termina antes, cambiala por ésta: sigue siendo válida y tiene la misma cantidad. Repetí.</p>
<div class="callout warn"><strong>Contraejemplo clásico:</strong> monedas {1, 3, 4}, monto 6. Voraz: 4+1+1 (3 monedas). Óptimo: 3+3 (2). Ahí hace falta programación dinámica (semana 14).</div>`,
    lecturas: [
      { b: "brassard", c: "Capítulos de algoritmos voraces y divide y vencerás" },
      { b: "laaksonen", c: "Cap. 6 «Greedy algorithms»" },
      { b: "kleinberg", c: "Cap. 4 «Greedy Algorithms» (secciones 4.1–4.2) y Cap. 5 «Divide and Conquer»" }
    ],
    recursos: [
      { n: "Video: algoritmos voraces", u: yt("algoritmos voraces greedy explicación ejemplos") },
      { n: "Abdul Bari: Greedy method", u: "https://www.youtube.com/@abdul_bari" }
    ],
    tareas: [
      { t: "leer", x: "Laaksonen cap. 6 (greedy) y repaso de merge sort como divide y vencerás.", u: "https://cses.fi/book/book.pdf" },
      { t: "practicar", x: "Implementar potencia rápida (a^n en O(log n)) y contar inversiones con merge sort." },
      { t: "problema", x: "CSES «Ferris Wheel» (si no lo resolviste en el parcial) y «Restaurant Customers».", u: cses(1619) },
      { t: "problema", x: "CSES «Maximum Subarray Sum» (Kadane; ¿por qué funciona?).", u: cses(1643) },
      { t: "problema", x: "CSES «Room Allocation».", u: cses(1164) },
      { t: "problema", x: "LeetCode «Merge Intervals».", u: lc("merge-intervals") },
      { t: "reflexion", x: "Para 2 problemas voraces que resolviste, escribí el argumento de intercambio. Para 1 estrategia voraz incorrecta, dá un contraejemplo." },
      { t: "proyecto", x: "Proyecto integrador — diseño: pseudocódigo de las partes principales, estructuras de datos elegidas y complejidad estimada." }
    ],
    autoeval: [
      "¿Podés justificar un greedy o encontrar su contraejemplo?",
      "¿Sabés resolver T(n) = 2T(n/2) + n con el árbol de recursión?",
      "¿Entendés por qué Kadane es correcto?"
    ]
  },
  {
    n: 14, m: "m5", titulo: "Programación dinámica", horas: 12,
    objetivos: [
      "Reconocer subproblemas superpuestos y subestructura óptima.",
      "Definir estado, transición, casos base y orden de cálculo.",
      "Pasar de recursión con memoización a tabla iterativa."
    ],
    leccion: `
<h4>La idea</h4>
<p>Si una recursión resuelve los mismos subproblemas muchas veces, guardá cada respuesta y calculala una sola vez. Fibonacci recursivo es O(2ⁿ); con memoria, O(n).</p>
<h4>Receta en 4 preguntas</h4>
<ol><li><strong>Estado:</strong> ¿qué significa dp[i] (o dp[i][j]) en palabras?</li>
<li><strong>Transición:</strong> ¿cómo se calcula a partir de estados más chicos?</li>
<li><strong>Base:</strong> ¿qué estados conocés directamente?</li>
<li><strong>Respuesta y orden:</strong> ¿qué estado es la respuesta y en qué orden llenar la tabla?</li></ol>
<pre><code># Mínima cantidad de monedas para formar x (CSES Minimizing Coins)
# dp[s] = mínimo de monedas para sumar s
INF = float("inf")
dp = [0] + [INF] * x
for s in range(1, x + 1):
    for c in monedas:
        if c &lt;= s and dp[s - c] + 1 &lt; dp[s]:
            dp[s] = dp[s - c] + 1
print(dp[x] if dp[x] &lt; INF else -1)</code></pre>
<pre><code># Con memoización (de arriba hacia abajo)
from functools import lru_cache
@lru_cache(maxsize=None)
def caminos(i, j):            # caminos en grilla moviendo → o ↓
    if i == 0 or j == 0:
        return 1
    return caminos(i - 1, j) + caminos(i, j - 1)</code></pre>
<div class="callout">Escribí siempre el significado de <code>dp</code> en un comentario. Si no lo podés decir en una frase, el estado está mal definido.</div>`,
    lecturas: [
      { b: "laaksonen", c: "Cap. 7 «Dynamic programming»" },
      { b: "erickson", c: "Cap. 3 «Dynamic Programming»" },
      { b: "brassard", c: "Capítulo de programación dinámica" },
      { b: "pythoned", c: "Cap. 4, sección «Programación dinámica»" }
    ],
    recursos: [
      { n: "Video: programación dinámica desde cero", u: yt("programación dinámica explicación desde cero") },
      { n: "MIT 6.006 — clases de Dynamic Programming", u: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/" }
    ],
    tareas: [
      { t: "leer", x: "Laaksonen cap. 7 completo.", u: "https://cses.fi/book/book.pdf" },
      { t: "ver", x: "Ver una clase de DP (MIT 6.006 o equivalente en español).", u: yt("programación dinámica explicación desde cero") },
      { t: "problema", x: "LeetCode «Climbing Stairs» y «House Robber».", u: lc("climbing-stairs") },
      { t: "problema", x: "CSES «Dice Combinations».", u: cses(1633) },
      { t: "problema", x: "CSES «Minimizing Coins» y «Coin Combinations I».", u: cses(1634) },
      { t: "problema", x: "CSES «Removing Digits».", u: cses(1637) },
      { t: "problema", x: "CSES «Grid Paths I».", u: cses(1638) },
      { t: "problema", x: "CSES «Book Shop» (mochila 0/1). Desafío: «Edit Distance».", u: cses(1158) },
      { t: "proyecto", x: "Proyecto integrador — implementación (mitad): las funciones principales andando con asserts." }
    ],
    autoeval: [
      "¿Definís el estado en una frase antes de programar?",
      "¿Pasás de memoización a tabla iterativa?",
      "¿Explicás por qué el voraz de monedas falla y la DP no?"
    ]
  },
  // ===================================================================== M6
  {
    n: 15, m: "m6", titulo: "Grafos I: modelado, BFS y DFS", horas: 12,
    objetivos: [
      "Modelar problemas como grafos (vértices, aristas, dirigidos, ponderados).",
      "Representar con lista de adyacencia.",
      "Aplicar BFS (camino mínimo sin pesos) y DFS (componentes, ciclos, orden topológico)."
    ],
    leccion: `
<h4>Modelar</h4>
<p>Muchos problemas son grafos disfrazados: ciudades y rutas, celdas de un laberinto, estados de un juego, tareas con dependencias. Preguntate: ¿qué son los vértices? ¿cuándo hay arista?</p>
<pre><code>from collections import deque
n, m = map(int, input().split())
ady = [[] for _ in range(n + 1)]
for _ in range(m):
    a, b = map(int, input().split())
    ady[a].append(b); ady[b].append(a)</code></pre>
<h4>BFS: por niveles</h4>
<pre><code>def bfs(s):
    dist = [-1] * (n + 1)
    dist[s] = 0
    q = deque([s])
    while q:
        u = q.popleft()
        for v in ady[u]:
            if dist[v] == -1:
                dist[v] = dist[u] + 1
                q.append(v)
    return dist        # dist[v] = mínima cantidad de aristas de s a v</code></pre>
<h4>DFS: en profundidad</h4>
<p>Sirve para contar componentes conexas, detectar ciclos y obtener un orden topológico (en grafos dirigidos sin ciclos). En Python, para grafos grandes, hacelo <em>iterativo con una pila</em> o subí el límite con <code>sys.setrecursionlimit</code>.</p>
<p>Ambos recorridos cuestan <strong>O(V + E)</strong>.</p>`,
    lecturas: [
      { b: "joyanes", c: "Cap. 13 «Estructuras de datos no lineales (árboles y grafos)» — parte de grafos" },
      { b: "joyanesProb", c: "Cap. 13.3 (grafos: terminología y representación)" },
      { b: "pythoned", c: "Cap. 7 «Grafos y algoritmos de grafos» (BFS, DFS, orden topológico)" },
      { b: "laaksonen", c: "Cap. 11 «Basics of graphs» y Cap. 12 «Graph traversal»" },
      { b: "rosen", c: "Capítulo de grafos (terminología y representación)" }
    ],
    recursos: [
      { n: "VisuAlgo: recorridos de grafos", u: "https://visualgo.net/es/dfsbfs" },
      { n: "WilliamFiset: Graph Theory playlist", u: "https://www.youtube.com/@WilliamFiset-videos" },
      { n: "Video: BFS y DFS", u: yt("BFS DFS grafos explicación español") }
    ],
    tareas: [
      { t: "leer", x: "Laaksonen cap. 11–12 y «Solución de problemas…» cap. 7 (hasta orden topológico)." },
      { t: "ver", x: "Ver en VisuAlgo BFS y DFS sobre el mismo grafo y anotar el orden de visita.", u: "https://visualgo.net/es/dfsbfs" },
      { t: "problema", x: "CSES «Counting Rooms» (componentes en grilla).", u: cses(1192) },
      { t: "problema", x: "CSES «Building Roads».", u: cses(1666) },
      { t: "problema", x: "CSES «Message Route» (BFS + reconstruir camino).", u: cses(1667) },
      { t: "problema", x: "CSES «Building Teams» (bipartito) y «Labyrinth».", u: cses(1668) },
      { t: "problema", x: "CSES «Course Schedule» (orden topológico) o LeetCode «Course Schedule».", u: cses(1679) },
      { t: "problema", x: "LeetCode «Number of Islands».", u: lc("number-of-islands") },
      { t: "proyecto", x: "Proyecto integrador — implementación completa y pruebas con casos borde." }
    ],
    autoeval: [
      "¿Modelás un laberinto o un juego como grafo?",
      "¿Escribís BFS de memoria y reconstruís el camino?",
      "¿Sabés cuándo usar BFS y cuándo DFS?"
    ]
  },
  {
    n: 16, m: "m6", titulo: "Grafos II: caminos mínimos, MST + cierre", horas: 13,
    objetivos: [
      "Aplicar Dijkstra con heap en grafos con pesos no negativos.",
      "Construir un árbol de expansión mínima (Kruskal con union-find o Prim).",
      "Entregar el proyecto integrador y rendir el examen final."
    ],
    leccion: `
<h4>Dijkstra</h4>
<p>Generaliza BFS a aristas con peso ≥ 0: siempre procesá el vértice no finalizado más cercano (un heap te lo da en O(log n)). Costo O((V + E) log V).</p>
<pre><code>import heapq
def dijkstra(s, ady, n):          # ady[u] = [(v, peso), ...]
    INF = float("inf")
    dist = [INF] * (n + 1)
    dist[s] = 0
    h = [(0, s)]
    while h:
        d, u = heapq.heappop(h)
        if d &gt; dist[u]:
            continue               # entrada vieja, ignorar
        for v, w in ady[u]:
            if d + w &lt; dist[v]:
                dist[v] = d + w
                heapq.heappush(h, (dist[v], v))
    return dist</code></pre>
<h4>Árbol de expansión mínima (Kruskal)</h4>
<p>Ordená las aristas por peso y agregá cada una si no forma ciclo. Para saber rápido si dos vértices ya están conectados usá <strong>union-find</strong>. ¡Es un algoritmo voraz con prueba de intercambio!</p>
<pre><code>padre = list(range(n + 1))
def find(x):
    while padre[x] != x:
        padre[x] = padre[padre[x]]   # compresión de caminos
        x = padre[x]
    return x
def union(a, b):
    a, b = find(a), find(b)
    if a == b: return False
    padre[a] = b; return True</code></pre>
<div class="callout"><strong>Cierre del cuatrimestre:</strong> entregá el proyecto, rendí el final y hacé la retrospectiva. Después, mirá «¿Y ahora qué?» en la Guía.</div>`,
    lecturas: [
      { b: "laaksonen", c: "Cap. 13 «Shortest paths» y Cap. 15 «Spanning trees»" },
      { b: "pythoned", c: "Cap. 7, secciones de Dijkstra y Prim" },
      { b: "brassard", c: "Capítulo de algoritmos voraces sobre grafos (Kruskal, Prim, Dijkstra)" }
    ],
    recursos: [
      { n: "VisuAlgo: caminos mínimos y MST", u: "https://visualgo.net/es/sssp" },
      { n: "Video: algoritmo de Dijkstra", u: yt("algoritmo de Dijkstra explicación paso a paso") }
    ],
    tareas: [
      { t: "leer", x: "Laaksonen cap. 13 (Dijkstra) y cap. 15 (Kruskal, union-find).", u: "https://cses.fi/book/book.pdf" },
      { t: "problema", x: "CSES «Shortest Routes I» (Dijkstra).", u: cses(1671) },
      { t: "problema", x: "LeetCode «Network Delay Time».", u: lc("network-delay-time") },
      { t: "problema", x: "CSES «Road Reparation» (Kruskal).", u: cses(1675) },
      { t: "problema", x: "CSES «Round Trip» (detectar y reconstruir un ciclo).", u: cses(1669) },
      { t: "proyecto", x: "Proyecto integrador — ENTREGA: código, README con el análisis (Pólya + complejidad) y una demo. Autoevaluar con la rúbrica." },
      { t: "examen", x: "EXAMEN FINAL (4 h, sin consultar): resolver 5 problemas nuevos elegidos al azar del CSES (1 de «Introductory», 1 de «Sorting and Searching», 1 de «Dynamic Programming», 1 de «Graph Algorithms» y 1 libre). Para cada uno: ficha Pólya, código AC y complejidad.", u: "https://cses.fi/problemset/" },
      { t: "reflexion", x: "Retrospectiva final: qué aprendiste, qué te costó, qué técnica usarías primero frente a un problema nuevo, y próximo paso." }
    ],
    autoeval: [
      "¿Sabés por qué Dijkstra falla con pesos negativos?",
      "¿Implementás union-find y lo usás en Kruskal?",
      "¿Aprobaste final y proyecto con ≥ 60 %?"
    ]
  }
];

const TIPOS = {
  leer: "Lectura", ver: "Video / curso", practicar: "Práctica", problema: "Problema",
  reflexion: "Reflexión", proyecto: "Proyecto", examen: "Evaluación"
};
