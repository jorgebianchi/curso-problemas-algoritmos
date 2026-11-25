# Resolución de problemas y algoritmos — curso autodidacta

Curso de **un cuatrimestre (16 semanas)** para aprender a resolver problemas y diseñar algoritmos por tu cuenta, con un plan guiado. Inspirado en [OSSU](https://ossu.dev/), con estética minimalista, modo claro/oscuro y **seguimiento del avance** en el navegador.

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

Cada semana incluye objetivos, una lección con ejemplos en Python, lecturas por capítulo, recursos, actividades marcables (lecturas, práctica, problemas en jueces online), autoevaluación y notas.

## Seguimiento

- Checklist por actividad, con progreso por semana, materia y global.
- Fecha de inicio → calendario y aviso de "al día / atrasado".
- Registro de sesiones de estudio, gráfico de horas por semana, racha.
- Nivel de confianza por semana (sugiere qué repasar) y notas.
- Exportar / importar el progreso en JSON. Todo se guarda en `localStorage`; no hay servidor.

## Bibliografía base

- G. Pólya, *Cómo plantear y resolver problemas* (Trillas).
- L. Joyanes Aguilar, *Fundamentos de programación* 4.ª ed. (McGraw-Hill).
- L. Joyanes, L. Rodríguez, M. Fernández, *Fundamentos de programación. Libro de problemas* (McGraw-Hill).

Los PDF de estos libros **no** se incluyen en el repositorio (derechos de autor).

## Descargas

- [`descargas/ficha-polya.pdf`](descargas/ficha-polya.pdf): ficha imprimible con las 4 fases de Pólya (A4, 2 páginas). Fuente editable: `descargas/ficha-polya.html` (se regenera imprimiendo a PDF desde Chrome).

## Banco de soluciones (protegido)

La vista `#/soluciones` contiene las resoluciones de ejercicios, problemas, parcial y final, organizadas por materia (con opción de guardar cada materia como PDF). Como el sitio es estático, el contenido se publica **cifrado** (AES-256-GCM, clave derivada con PBKDF2-SHA256) y se descifra en el navegador con la contraseña. La contraseña se solicita por correo.

- Soluciones en texto plano: `privado/*.mjs` (**no** se versiona).
- Contraseña: `.env` → `SOLUCIONES_PASSWORD` (**no** se versiona; ver `.env.example`).
- Para regenerar el archivo cifrado después de editar soluciones o cambiar la contraseña:

```bash
node scripts/encriptar-soluciones.mjs   # escribe js/soluciones.enc.js
```

> Guardá una copia de `privado/` y `.env` en un lugar seguro: no están en el repositorio.

## Uso local

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Editar el contenido

Todo el plan está en [`js/data.js`](js/data.js) (`MATERIAS`, `SEMANAS`, `BIBLIO`). El avance se guarda por id de tarea (`s<semana>-<índice>`): agregá tareas nuevas al final de cada semana para no desfasar el progreso existente.

## Licencia

Contenido: CC BY-SA 4.0. Código: MIT.
