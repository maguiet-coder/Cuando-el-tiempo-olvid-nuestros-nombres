(() => {
  const STORAGE_KEY = "tiempo-olvido-progreso";
  const solved = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));

  let currentChapter = CHAPTERS[0].id;
  let currentPuzzleIndex = 0;

  const nav = document.getElementById("chapterNav");
  const storyPanel = document.getElementById("storyPanel");
  const puzzlePanel = document.getElementById("puzzlePanel");
  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");

  function puzzlesOf(chapterId){
    return PUZZLES.filter(p => p.chapter === chapterId);
  }
  function isChapterUnlocked(chapterId){
    const idx = CHAPTERS.findIndex(c => c.id === chapterId);
    if(idx <= 0) return true;
    const prev = CHAPTERS[idx-1];
    const prevPuzzles = puzzlesOf(prev.id);
    return prevPuzzles.length === 0 || prevPuzzles.every(p => solved.has(p.id));
  }
  function isChapterDone(chapterId){
    const ps = puzzlesOf(chapterId);
    return ps.length > 0 && ps.every(p => solved.has(p.id));
  }

  function saveProgress(){
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...solved]));
  }

  function renderNav(){
    nav.innerHTML = "";
    CHAPTERS.forEach(ch => {
      const btn = document.createElement("button");
      btn.textContent = ch.title.split("—")[0].trim();
      const unlocked = isChapterUnlocked(ch.id);
      btn.disabled = !unlocked;
      if(ch.id === currentChapter) btn.classList.add("active");
      if(isChapterDone(ch.id)) btn.classList.add("done");
      btn.onclick = () => { currentChapter = ch.id; currentPuzzleIndex = 0; renderAll(); };
      nav.appendChild(btn);
    });
  }

  function renderStory(){
    const ch = CHAPTERS.find(c => c.id === currentChapter);
    storyPanel.innerHTML = `
      <div class="epoch">${ch.epoch}</div>
      <h2>${ch.title}</h2>
      <p>${ch.text}</p>
    `;
  }

  function renderPuzzle(){
    puzzlePanel.innerHTML = "";
    if(!isChapterUnlocked(currentChapter)){
      puzzlePanel.innerHTML = `<div class="locked-msg">Resuelve el capítulo anterior para desbloquear esta parte del libro.</div>`;
      return;
    }
    const ps = puzzlesOf(currentChapter);
    if(ps.length === 0){
      puzzlePanel.innerHTML = `<div class="locked-msg">Aún no hay acertijos en este capítulo. Añádelos en data/puzzles.js.</div>`;
      return;
    }
    // avanza automáticamente al primer acertijo no resuelto
    let idx = ps.findIndex(p => !solved.has(p.id));
    if(idx === -1) idx = ps.length - 1;
    currentPuzzleIndex = idx;
    const puzzle = ps[currentPuzzleIndex];

    const counter = document.createElement("p");
    counter.style.color = "var(--muted)";
    counter.style.fontSize = ".8em";
    counter.textContent = `Acertijo ${currentPuzzleIndex+1} de ${ps.length} de este capítulo`;
    puzzlePanel.appendChild(counter);

    const holder = document.createElement("div");
    puzzlePanel.appendChild(holder);

    PuzzleEngine.render(puzzle, holder, () => {
      solved.add(puzzle.id);
      saveProgress();
      renderAll();
    });

    if(solved.has(puzzle.id)){
      const next = document.createElement("p");
      next.style.color = "var(--ok)";
      next.textContent = "Ya resuelto. ¡Bien hecho!";
      puzzlePanel.appendChild(next);
    }
  }

  function renderProgress(){
    const total = PUZZLES.length;
    const done = PUZZLES.filter(p => solved.has(p.id)).length;
    progressFill.style.width = total ? `${(done/total)*100}%` : "0%";
    progressText.textContent = `${done} / ${total} acertijos resueltos`;
  }

  function renderAll(){
    renderNav();
    renderStory();
    renderPuzzle();
    renderProgress();
  }

  renderAll();
})();
