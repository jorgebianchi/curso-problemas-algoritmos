# Resolución de problemas y algoritmos — curso autodidacta

Curso de **un cuatrimestre (16 semanas)** para aprender a resolver problemas y diseñar algoritmos por tu cuenta, con un plan guiado. Inspirado en [OSSU](https://ossu.dev/), con estética minimalista, modo claro/oscuro, diseño adaptable (celular, tablet y escritorio) y **seguimiento del avance** en el navegador.

**Sitio:** https://jorgebianchi.github.io/curso-problemas-algoritmos/

## Materias

| # | Materia | Semanas |
|---|---------|---------|
| 1 | Resolución de problemas y pensamiento computacional | 1–2 |
| 2 | Programación en Python | 3–5 |
| 3 | Análisis de algoritmos (correctitud, complejidad, búsqueda y ordenamiento) + Parcial | 6–8 |
| 4 | Estructuras de datos | 9–11 |
| 5 | Técnicas de diseño (recursión, backtracking, voraces, DP) | 12–14 |
| 6 | Grafos e integración (proyecto + final) | 15–16 |

Cada semana incluye objetivos, una lección con ejemplos en Python, lecturas por capítulo, recursos, actividades marcables (lecturas, práctica, problemas en jueces online como CSES y LeetCode), autoevaluación, notas y acceso directo a sus soluciones.

## Secciones del sitio

| Ruta | Contenido |
|---|---|
| `#/` | Inicio: avance general, materias y cómo funciona el curso |
| `#/plan` | Plan de estudio: las 16 semanas por materia, con fechas si configurás el inicio |
| `#/materia/<id>` · `#/semana/<n>` | Detalle de cada materia y semana |
| `#/guia` | Metodología: rutina semanal, ficha de Pólya, cuando te trabás, evaluación, proyecto |
| `#/bibliografia` | Libros base, complementarios (español e inglés), jueces, cursos y visualizadores |
| `#/soluciones` | Banco de soluciones protegido con contraseña (ver más abajo) |
| `#/progreso` | Mi progreso: estadísticas, sesiones de estudio, configuración y respaldo |

## Seguimiento

- Checklist por actividad, con progreso por semana, materia y global.
- Fecha de inicio → calendario y aviso de «al día / atrasado».
- Registro de sesiones de estudio, gráfico de horas por semana y racha.
- Nivel de confianza por semana (sugiere qué repasar) y notas.
- Exportar / importar el progreso en JSON. Todo se guarda en `localStorage`; no hay servidor.

## Ficha de Pólya

[`descargas/ficha-polya.pdf`](descargas/ficha-polya.pdf): ficha imprimible con las 4 fases (A4, 2 páginas). Se descarga desde la Guía y desde la lección de la semana 1. La fuente editable es `descargas/ficha-polya.html`; para regenerar el PDF:

```bash
google-chrome --headless=new --no-pdf-header-footer --virtual-time-budget=5000 \
  --print-to-pdf=descargas/ficha-polya.pdf "file://$PWD/descargas/ficha-polya.html"
```

## Banco de soluciones (protegido)

`#/soluciones` reúne las resoluciones de ejercicios, problemas, parcial, proyecto y final (explicación, código Python comentado y complejidad), organizadas por materia y semana. Cada materia se puede guardar como PDF desde el navegador. La contraseña se solicita por correo desde la misma pantalla de acceso.

Como el sitio es estático, el contenido se publica **cifrado** (AES-256-GCM, clave derivada con PBKDF2-SHA256, 600 000 iteraciones) y se descifra en el navegador.

| Archivo | ¿En el repo? | Contenido |
|---|---|---|
| `js/soluciones.enc.js` | sí | Banco cifrado (lo único que se publica) |
| `privado/*.mjs` | **no** | Soluciones en texto plano |
| `.env` | **no** | `SOLUCIONES_PASSWORD` (ver `.env.example`) |

Después de editar soluciones o cambiar la contraseña:

```bash
node scripts/encriptar-soluciones.mjs   # regenera js/soluciones.enc.js
```

> `privado/` y `.env` no están en este repositorio: mantené un respaldo privado y actualizalo cuando los cambies.

## Uso local

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

El descifrado de soluciones usa Web Crypto, disponible en `https://` y en `localhost` (no al abrir `index.html` con `file://`).

## Estructura

```
index.html                  página única (router por hash)
css/styles.css              estilos (tipografía Bitter, modo claro/oscuro, responsive)
js/data.js                  contenido: materias, semanas, tareas, bibliografía
js/app.js                   vistas, seguimiento, tema y banco de soluciones
js/soluciones.enc.js        soluciones cifradas (generado)
descargas/ficha-polya.*     ficha de Pólya (HTML fuente + PDF)
scripts/encriptar-soluciones.mjs
```

## Editar el contenido

Todo el plan está en [`js/data.js`](js/data.js) (`MATERIAS`, `SEMANAS`, `BIBLIO`). El avance y las soluciones se asocian por id de tarea (`s<semana>-<índice>`): agregá tareas nuevas **al final** de cada semana para no desfasar el progreso guardado ni las soluciones.

## Bibliografía base

- G. Pólya, *Cómo plantear y resolver problemas* (Trillas).
- L. Joyanes Aguilar, *Fundamentos de programación* 4.ª ed. (McGraw-Hill).
- L. Joyanes, L. Rodríguez, M. Fernández, *Fundamentos de programación. Libro de problemas* (McGraw-Hill).

Los PDF de estos libros **no** se incluyen en el repositorio (derechos de autor).

## Créditos y licencia

Desarrollo: [Jorge Bianchi](https://github.com/harikirtandas). Contenido: CC BY-SA 4.0. Código: MIT.
