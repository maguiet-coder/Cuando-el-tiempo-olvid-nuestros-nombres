/* ============================================================
   CUANDO EL TIEMPO OLVIDÓ NUESTROS NOMBRES
   Datos de la historia y los acertijos.

   CAPITULOS: narrativa dividida en bloques (uno por época + prólogo/epílogo).
   PUZZLES: 100 acertijos repartidos entre capítulos. Cada puzzle pertenece
   a un chapter (id de capítulo) y se desbloquea cuando los anteriores de
   su capítulo están resueltos; el siguiente capítulo se desbloquea cuando
   se resuelven TODOS los acertijos del capítulo actual.

   Para añadir acertijos nuevos solo hay que añadir objetos al array
   PUZZLES siguiendo el mismo formato (ver puzzle-engine.js para el
   formato de "data" según el tipo).
   ============================================================ */

const CHAPTERS = [
  {
    id: "prologo",
    title: "Prólogo — La caja de cuero",
    epoch: "Madrid, 2026",
    text: `Elena nunca conoció bien a su abuelo. Recordaba su olor a tabaco de pipa y papel viejo, y poco más. Cuando el notario le entregó la caja de cuero negro, pensó que sería un trámite más entre tantos tras su desaparición.

Dentro no había joyas ni dinero: solo un libro sin título, encuadernado en piel oscura, y una nota manuscrita: "Para quien sepa leer entre las líneas del tiempo".

El primer acertijo la esperaba en la primera página.`
  },
  {
    id: "roma",
    title: "Capítulo I — Roma, 79 d. C.",
    epoch: "Roma, 79 d. C.",
    text: `Las cenizas del Vesubio aún no habían caído cuando Livia recibió la carta. Estaba firmada solo con una letra: "M.". En ella, su amante le prometía reunirse con ella esa misma noche, lejos de las miradas de su esposo.

Livia nunca llegó a la cita. La encontraron al amanecer, junto a las ruinas de un templo, con la carta todavía en la mano.

En el libro, junto al relato, había un sello de cera partido por la mitad.`
  },
  {
    id: "florencia",
    title: "Capítulo II — Florencia, 1498",
    epoch: "Florencia, 1498",
    text: `El pintor trabajaba de noche, a la luz de las velas, en un retrato que nadie debía ver. Decía a sus aprendices que era un encargo secreto de un noble florentino.

Lo encontraron muerto en su taller, con los pinceles aún en la mano. El retrato había desaparecido. Solo quedaba, clavado en la pared, un boceto a carboncillo: el rostro de un hombre que, siglos después, Elena reconocería en una fotografía de su propio abuelo.`
  },
  {
    id: "paris",
    title: "Capítulo III — París, 1889",
    epoch: "París, 1889",
    text: `La Torre Eiffel aún olía a hierro nuevo cuando Margueritte dejó de responder a las cartas de su familia. Las últimas que escribió hablaban de un hombre que la seguía entre la multitud de la Exposición Universal, siempre con el mismo abrigo, siempre con la misma mirada.

Desapareció una noche de julio. Nunca se encontró su cuerpo. Solo un guante, junto a la entrada del pabellón de las máquinas.`
  },
  {
    id: "viena",
    title: "Capítulo IV — Viena, 1924",
    epoch: "Viena, 1924",
    text: `El baile de máscaras había reunido a medio Viena. Anton bailó con una mujer cuyo rostro nunca llegó a ver del todo. Al día siguiente lo encontraron muerto en su apartamento, con una fotografía entre los dedos.

En ella, una pareja sonreía a la cámara. Elena reconocería ese mismo rostro masculino —inalterado por el tiempo— en todas las fotografías anteriores del libro.`
  },
  {
    id: "presente",
    title: "Capítulo V — El presente",
    epoch: "Madrid, 2026",
    text: `Las cartas empezaron a llegar al piso de Elena. La misma letra del libro. La misma promesa repetida durante siglos: un amor que nunca encuentra descanso, y una muerte que se repite en cada época.

Cuando encontró la fotografía reciente de su abuelo junto al desconocido, con la fecha "2026" escrita al dorso, comprendió que el libro no hablaba del pasado.

Hablaba de lo que estaba a punto de ocurrir.`
  },
  {
    id: "epilogo",
    title: "Epílogo — El nombre que falta",
    epoch: "¿?",
    text: `Quedan por resolver los últimos acertijos del libro. Solo entonces se revelará quién es el desconocido, qué relación le une a todas las víctimas, y si el nombre de Elena está realmente destinado a desaparecer como los demás.

(Este capítulo se completa a medida que añadas los acertijos restantes hasta llegar a 100.)`
  }
];

// -----------------------------------------------------------
// PUZZLES — ejemplos completos para cada tipo + plantilla
// -----------------------------------------------------------
const PUZZLES = [];

// ---- PRÓLOGO (2 acertijos) ----
PUZZLES.push({
  id: 1, chapter: "prologo", type: "riddle",
  title: "El primer sello",
  clue: "«Nazco en el fuego, muero en el agua, y entre ambos guardo lo que nadie recuerda. ¿Qué soy?»",
  data: { answers: ["la cera", "cera"], successNote: "El sello partido se abre en tu memoria." }
});

PUZZLES.push({
  id: 2, chapter: "prologo", type: "wordsearch",
  title: "Las palabras de la nota",
  clue: "Encuentra las cinco palabras escondidas en la nota manuscrita de tu abuelo.",
  data: {
    grid: [
      "LIBROXT",
      "XTIEMPO",
      "CARTASX",
      "XSELLOX",
      "NOMBREX"
    ],
    words: [
      { word: "LIBRO",  cells: [[0,0],[0,1],[0,2],[0,3],[0,4]] },
      { word: "TIEMPO", cells: [[1,1],[1,2],[1,3],[1,4],[1,5],[1,6]] },
      { word: "CARTAS", cells: [[2,0],[2,1],[2,2],[2,3],[2,4],[2,5]] },
      { word: "SELLO",  cells: [[3,1],[3,2],[3,3],[3,4],[3,5]] },
      { word: "NOMBRE", cells: [[4,0],[4,1],[4,2],[4,3],[4,4],[4,5]] }
    ]
  }
});

// ---- ROMA (2 acertijos) ----
PUZZLES.push({
  id: 3, chapter: "roma", type: "riddle",
  title: "La firma de M.",
  clue: "«Empiezo con la letra que firmó la carta. En latín significaba grande, y en el libro es solo una inicial. ¿Qué nombre podría ocultar?»",
  data: { answers: ["marco", "marcus", "marcos"], successNote: "El nombre resuena en cada época posterior." }
});

PUZZLES.push({
  id: 4, chapter: "roma", type: "murdoku",
  title: "El sello partido (murdoku 4×4)",
  clue: "Completa la cuadrícula para que las letras V-E-S-T (Vesubio) no se repitan en ninguna fila, columna ni cuadrante 2×2.",
  data: {
    size: 4,
    letters: ["V","E","S","T"],
    given: { "0_0":"V", "0_2":"S", "1_1":"T", "2_2":"V", "3_1":"S", "3_3":"T" },
    solution: {
      "0_0":"V","0_1":"E","0_2":"S","0_3":"T",
      "1_0":"S","1_1":"T","1_2":"V","1_3":"E",
      "2_0":"E","2_1":"V","2_2":"T","2_3":"S",
      "3_0":"T","3_1":"S","3_2":"E","3_3":"V"
    }
  }
});

// ---- FLORENCIA (1 acertijo de ejemplo: crucigrama) ----
PUZZLES.push({
  id: 5, chapter: "florencia", type: "crossword",
  title: "El retrato desaparecido",
  clue: "Resuelve el mini crucigrama sobre el taller del pintor.",
  data: {
    rows: 3, cols: 3,
    blocks: [[1,1]],
    cells: {
      "0_0": { num: 1, answerChar: "A" },
      "0_1": { answerChar: "R" },
      "0_2": { answerChar: "T" },
      "1_0": { answerChar: "R" },
      "2_0": { num: 2, answerChar: "T" },
      "1_2": { answerChar: "O" },
      "2_1": { answerChar: "A" },
      "2_2": { answerChar: "Z" }
    },
    clues: [
      { num:1, dir:"H", text: "Expresión creativa como la del pintor (3 letras: ___)." },
      { num:2, dir:"H", text: "Palabra incompleta de ejemplo (completa la cuadrícula)." }
    ]
  }
});

// -----------------------------------------------------------
// PLANTILLA PARA SEGUIR AÑADIENDO HASTA 100
// Copia este bloque y cambia id (único y correlativo), chapter,
// type, title, clue y data según el tipo de acertijo.
// -----------------------------------------------------------
/*
PUZZLES.push({
  id: 6, chapter: "florencia", type: "riddle",
  title: "Título del acertijo",
  clue: "Enunciado del acertijo o adivinanza.",
  data: { answers: ["respuesta", "variante"], successNote: "Texto que aparece al acertar." }
});
*/

// Capítulos disponibles para repartir los 100 acertijos:
// prologo (sugerido: 1-8), roma (9-24), florencia (25-40),
// paris (41-56), viena (57-72), presente (73-90), epilogo (91-100)
