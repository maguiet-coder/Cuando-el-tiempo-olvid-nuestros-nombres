/* Motor genérico de acertijos.
   Cada acertijo del array PUZZLES tiene:
   { id, chapter, epoch, type, clue, data, solved: bool }
   type ∈ "riddle" | "wordsearch" | "crossword" | "murdoku"
   render<Type>(puzzle, container, onSolved) monta el puzzle y llama onSolved() al acertarlo.
*/

const PuzzleEngine = (() => {

  function norm(s){
    return s.toString().trim().toUpperCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  }

  // ---------- ADIVINANZA ----------
  function renderRiddle(puzzle, container, onSolved){
    const wrap = document.createElement("div");
    const input = document.createElement("input");
    input.type = "text"; input.placeholder = "Tu respuesta…";
    const btn = document.createElement("button");
    btn.className = "action"; btn.textContent = "Comprobar";
    const feedback = document.createElement("div");
    feedback.className = "feedback";

    function check(){
      const ok = puzzle.data.answers.some(a => norm(a) === norm(input.value));
      if(ok){
        feedback.textContent = "✓ Correcto. " + (puzzle.data.successNote || "");
        feedback.className = "feedback ok";
        input.disabled = true; btn.disabled = true;
        onSolved();
      } else {
        feedback.textContent = "✗ No es eso. Inténtalo de nuevo.";
        feedback.className = "feedback bad";
      }
    }
    btn.onclick = check;
    input.onkeydown = e => { if(e.key === "Enter") check(); };

    wrap.append(input, btn, feedback);
    container.appendChild(wrap);
  }

  // ---------- SOPA DE LETRAS ----------
  function renderWordSearch(puzzle, container, onSolved){
    const { grid, words } = puzzle.data; // grid: array de strings (filas), words: [{word, cells:[[r,c],...]}]
    const foundSet = new Set();
    let selecting = false, selCells = [];

    const gridEl = document.createElement("div");
    gridEl.className = "wordsearch-grid";
    gridEl.style.gridTemplateColumns = `repeat(${grid[0].length}, 28px)`;

    const cellEls = [];
    grid.forEach((row, r) => {
      [...row].forEach((ch, c) => {
        const span = document.createElement("span");
        span.textContent = ch;
        span.dataset.r = r; span.dataset.c = c;
        span.onmousedown = () => { selecting = true; selCells = [[r,c]]; paintSel(); };
        span.onmouseenter = () => { if(selecting){ selCells.push([r,c]); paintSel(); } };
        span.onmouseup = finishSel;
        span.ontouchstart = (e) => { e.preventDefault(); selecting = true; selCells = [[r,c]]; paintSel(); };
        gridEl.appendChild(span);
        cellEls.push(span);
      });
    });
    document.addEventListener("mouseup", () => { if(selecting) finishSel(); });

    function key(r,c){ return r+"_"+c; }
    function paintSel(){
      cellEls.forEach(el => el.classList.remove("sel"));
      selCells.forEach(([r,c]) => {
        const el = cellEls.find(e => +e.dataset.r===r && +e.dataset.c===c);
        if(el) el.classList.add("sel");
      });
    }
    function finishSel(){
      selecting = false;
      const match = words.find(w => !foundSet.has(w.word) && sameCells(w.cells, selCells));
      if(match){
        foundSet.add(match.word);
        match.cells.forEach(([r,c]) => {
          const el = cellEls.find(e => +e.dataset.r===r && +e.dataset.c===c);
          el.classList.remove("sel"); el.classList.add("found");
        });
        wordListEls[match.word].classList.add("found");
        if(foundSet.size === words.length) onSolved();
      } else {
        cellEls.forEach(el => el.classList.remove("sel"));
      }
      selCells = [];
    }
    function sameCells(a,b){
      if(a.length !== b.length) return false;
      const as = a.map(x=>x.join()).sort(), bs = b.map(x=>x.join()).sort();
      return as.every((v,i)=>v===bs[i]) || sameReversed(a,b);
    }
    function sameReversed(a,b){
      const ar = [...a].reverse();
      return ar.length===b.length && ar.every((v,i)=> v[0]===b[i][0] && v[1]===b[i][1]);
    }

    const list = document.createElement("div");
    list.className = "word-list";
    const wordListEls = {};
    words.forEach(w => {
      const s = document.createElement("span");
      s.textContent = w.word;
      list.appendChild(s);
      wordListEls[w.word] = s;
    });

    container.append(gridEl, list);
  }

  // ---------- CRUCIGRAMA ----------
  function renderCrossword(puzzle, container, onSolved){
    // data: { rows, cols, blocks:[[r,c]], cells:{ "r_c": {num, answerChar} }, clues: [{num, dir, text}] }
    const { rows, cols, blocks, cells, clues } = puzzle.data;
    const blockSet = new Set(blocks.map(([r,c]) => r+"_"+c));
    const gridEl = document.createElement("div");
    gridEl.className = "crossword-grid";
    gridEl.style.gridTemplateColumns = `repeat(${cols}, 30px)`;

    const inputs = {};
    for(let r=0;r<rows;r++){
      for(let c=0;c<cols;c++){
        const k = r+"_"+c;
        const cellDiv = document.createElement("div");
        cellDiv.className = "cell" + (blockSet.has(k) ? " block" : "");
        if(!blockSet.has(k)){
          const info = cells[k] || {};
          if(info.num){
            const num = document.createElement("div");
            num.className = "num"; num.textContent = info.num;
            cellDiv.appendChild(num);
          }
          const input = document.createElement("input");
          input.maxLength = 1;
          input.oninput = () => { input.value = input.value.toUpperCase(); checkAll(); };
          cellDiv.appendChild(input);
          inputs[k] = { input, answer: info.answerChar };
        }
        gridEl.appendChild(cellDiv);
      }
    }

    function checkAll(){
      const ok = Object.values(inputs).every(x => norm(x.input.value) === norm(x.answer));
      if(ok) onSolved();
    }

    const clueList = document.createElement("div");
    clueList.className = "clue-list";
    const horiz = clues.filter(c=>c.dir==="H").map(c=>`${c.num}. ${c.text}`).join("<br>");
    const vert = clues.filter(c=>c.dir==="V").map(c=>`${c.num}. ${c.text}`).join("<br>");
    clueList.innerHTML = `<strong>Horizontales</strong><br>${horiz}<br><br><strong>Verticales</strong><br>${vert}`;

    container.append(gridEl, clueList);
  }

  // ---------- MURDOKU (mini sudoku temático 4x4 con letras en vez de números) ----------
  function renderMurdoku(puzzle, container, onSolved){
    // data: { size:4, letters:["A","B","C","D"], given: {"r_c":"A"}, solution:{"r_c":"A"} }
    const { size, given, solution } = puzzle.data;
    const gridEl = document.createElement("div");
    gridEl.className = "murdoku-grid";
    gridEl.style.gridTemplateColumns = `repeat(${size}, 40px)`;
    const inputs = {};

    for(let r=0;r<size;r++){
      for(let c=0;c<size;c++){
        const k = r+"_"+c;
        const input = document.createElement("input");
        input.maxLength = 1;
        if(given[k]){ input.value = given[k]; input.disabled = true; }
        else {
          input.oninput = () => { input.value = input.value.toUpperCase(); checkAll(); };
          inputs[k] = input;
        }
        gridEl.appendChild(input);
      }
    }
    function checkAll(){
      const ok = Object.entries(inputs).every(([k,el]) => norm(el.value) === norm(solution[k]));
      if(ok) onSolved();
    }
    container.appendChild(gridEl);
  }

  function render(puzzle, container, onSolved){
    container.innerHTML = "";
    const title = document.createElement("h3");
    title.className = "puzzle-title";
    title.textContent = puzzle.title;
    const typeTag = document.createElement("span");
    typeTag.className = "puzzle-type";
    typeTag.textContent = ({riddle:"Adivinanza", wordsearch:"Sopa de letras", crossword:"Crucigrama", murdoku:"Murdoku"})[puzzle.type];
    const clue = document.createElement("p");
    clue.className = "puzzle-clue";
    clue.textContent = puzzle.clue;

    container.append(title, typeTag, clue);

    const body = document.createElement("div");
    container.appendChild(body);

    const fns = { riddle: renderRiddle, wordsearch: renderWordSearch, crossword: renderCrossword, murdoku: renderMurdoku };
    fns[puzzle.type](puzzle, body, onSolved);
  }

  return { render };
})();
