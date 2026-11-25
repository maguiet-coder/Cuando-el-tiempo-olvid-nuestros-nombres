# Cuando el tiempo olvidó nuestros nombres

Web de acertijos narrativos (sopas de letras, crucigramas, adivinanzas y "murdokus") con una historia de misterio que avanza según se resuelven los puzzles.

## Estructura

```
index.html          → página principal
css/style.css        → estilos
js/puzzle-engine.js  → motor que renderiza cada tipo de acertijo
js/app.js            → navegación, progreso y desbloqueo de capítulos
data/puzzles.js      → CAPITULOS (texto de la historia) y PUZZLES (los 100 acertijos)
```

## Cómo funciona

- `CHAPTERS` en `data/puzzles.js` define los bloques de la historia (prólogo, Roma, Florencia, París, Viena, presente, epílogo).
- `PUZZLES` es un array con todos los acertijos. Cada uno tiene `chapter` (a qué capítulo pertenece), `type` (`riddle`, `wordsearch`, `crossword`, `murdoku`), `title`, `clue` y `data` (específico de cada tipo, ver comentarios en `puzzle-engine.js`).
- Un capítulo se desbloquea cuando **todos** los acertijos del capítulo anterior están resueltos.
- El progreso se guarda en `localStorage` del navegador (no hace falta backend).

## Cómo añadir acertijos hasta llegar a 100

Al final de `data/puzzles.js` hay una plantilla comentada. Solo hay que:

1. Copiar el bloque `PUZZLES.push({...})`.
2. Darle un `id` único correlativo.
3. Elegir `chapter` (uno de los definidos en `CHAPTERS`).
4. Elegir `type` y rellenar `data` según el formato de ese tipo (ejemplos ya incluidos para los 4 tipos).

Reparto orientativo sugerido para los 100 acertijos:

| Capítulo   | Acertijos |
|------------|-----------|
| prologo    | 1–8       |
| roma       | 9–24      |
| florencia  | 25–40     |
| paris      | 41–56     |
| viena      | 57–72     |
| presente   | 73–90     |
| epilogo    | 91–100    |

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub y sube todo este contenido.
2. Ve a **Settings → Pages**.
3. En "Source" selecciona la rama `main` y la carpeta `/root`.
4. Guarda: la web quedará publicada en `https://TU-USUARIO.github.io/NOMBRE-REPO/`.

No requiere build ni dependencias: es HTML/CSS/JS puro, funciona abriendo `index.html` directamente o en Pages.
