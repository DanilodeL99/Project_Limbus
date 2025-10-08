// ====== script.js (substitua todo o arquivo por este) ======

// Elementos do DOM
const startScreen = document.getElementById("start-screen");
const selectionScreen = document.getElementById("selection-screen");
const battleScreen = document.getElementById("battle-screen");
const btnStartBattle = document.getElementById("btn-start-battle");
const characterGrid = document.getElementById("character-grid");
const playerTeam = document.getElementById("player-team");
const skillsGrid = document.getElementById("skills-grid");
const portraits = document.getElementById("portraits");
const bgVideo = document.getElementById("bg-video");
const enemyTeam = document.getElementById("enemy-team");

const selectedCharacters = [];

// Simple Skill factory (extend as needed)
function Skill(id, src, damage = 0, type = "generic") {
  return { id, src, damage, type };
}

// === LISTA DE PERSONAGENS (EXEMPLO) ===
// Cada personagem possui: id, name, sprite (arena), portrait (seleção/retrato) e skills (array de imagens).
// Regra esperada: 6 imagens por personagem (3x skill1, 2x skill2, 1x skill3) — mas o código funciona com qualquer número >=1.
const allCharacters = [
  {
    id: 1,
    name: "Yi Sang",
    sprite: "./img/Sinners/10101_YiSang_BaseAppearance/idle.gif",
    portrait: "./img/profile img/YiSang.png",
    skills: [Skill("ys_s1a", "./img/skill/skill1.png", 120, "s1"),
    Skill("ys_s1b", "./img/skill/skill1.png", 100, "s1"),
    Skill("ys_s1c", "./img/skill/skill2.png", 90, "s1"),
    Skill("ys_s2a", "./img/skill/skill2.png", 180, "s2"),
    Skill("ys_s2b", "./img/skill/skill2.png", 150, "s2"),
    Skill("ys_s3a", "./img/skill/skill2.png", 260, "s3"),]
  },
  {
    id: 2,
    name: "Faust",
    sprite: "./img/Sinners/10201_Faust_BaseAppearance/idle.gif",
    portrait: "./img/profile img/Faust.png",
    skills: [Skill("ys_s1a", "./img/skill/skill1.png", 120, "s1"),
    Skill("ys_s1b", "./img/skill/skill1.png", 100, "s1"),
    Skill("ys_s1c", "./img/skill/skill1.png", 90, "s1"),
    Skill("ys_s2a", "./img/skill/skill2.png", 180, "s2"),
    Skill("ys_s2b", "./img/skill/skill2.png", 150, "s2"),
    Skill("ys_s3a", "./img/skill/skill2.png", 260, "s3"),]
  },
  {
    id: 3,
    name: "Don Quixote",
    sprite: "./img/Sinners/10301_Donquixote_BaseAppearance/idle.gif",
    portrait: "./img/profile img/donQuixote.png",
    skills: [Skill("ys_s1a", "./img/skill/skill2.png", 120, "s1"),
    Skill("ys_s1b", "img/skill/yisang_s1b.png", 100, "s1"),
    Skill("ys_s1c", "./img/skill/skill2.png", 90, "s1"),
    Skill("ys_s2a", "./img/skill/skill2.png", 180, "s2"),
    Skill("ys_s2b", "./img/skill/skill2.png", 150, "s2"),
    Skill("ys_s3a", "./img/skill/skill2.png", 260, "s3"),]
  },
  {
    id: 4,
    name: "Ryōshū",
    sprite: "./img/Sinners/10401_Ryoshu_BaseAppearance/idle.gif",
    portrait: "./img/profile img/Ryoshu.png",
    skills: [Skill("ys_s1a", "./img/skill/skill2.png", 120, "s1"),
    Skill("ys_s1b", "./img/skill/skill2.png", 100, "s1"),
    Skill("ys_s1c", "./img/skill/skill2.png", 90, "s1"),
    Skill("ys_s2a", "./img/skill/skill2.png", 180, "s2"),
    Skill("ys_s2b", "./img/skill/skill2.png", 150, "s2"),
    Skill("ys_s3a", "./img/skill/skill2.png", 260, "s3"),]
  },
  {
    id: 5,
    name: "Meursault",
    sprite: "./img/animações/output/Meursault_Default.gif",
    portrait: "./img/profile img/Meursault.png",
    skills: [Skill("ys_s1a", "./img/skill/skill2.png", 120, "s1"),
    Skill("ys_s1b", "./img/skill/skill2.png", 100, "s1"),
    Skill("ys_s1c", "./img/skill/skill2.png", 90, "s1"),
    Skill("ys_s2a", "./img/skill/skill2.png", 180, "s2"),
    Skill("ys_s2b", "./img/skill/skill2.png", 150, "s2"),
    Skill("ys_s3a", "./img/skill/skill2.png", 260, "s3"),]
  },
  {
    id: 6,
    name: "Hong Lu",
    sprite: "./img/animações/output/Honglu_Default.gif",
    portrait: "./img/profile img/HongLu.png",
    skills: [Skill("ys_s1a", "./img/skill/skill2.png", 120, "s1"),
    Skill("ys_s1b", "./img/skill/skill2.png", 100, "s1"),
    Skill("ys_s1c", "./img/skill/skill2.png", 90, "s1"),
    Skill("ys_s2a", "./img/skill/skill2.png", 180, "s2"),
    Skill("ys_s2b", "./img/skill/skill2.png", 150, "s2"),
    Skill("ys_s3a", "./img/skill/skill2.png", 260, "s3"),]
  },
  {
    id: 7,
    name: "Heathcliff",
    sprite: "./img/animações/output/Heathcliff_Default.gif",
    portrait: "./img/profile img/Heatcliff.png",
    skills: [Skill("ys_s1a", "./img/skill/skill2.png", 120, "s1"),
    Skill("ys_s1b", "./img/skill/skill2.png", 100, "s1"),
    Skill("ys_s1c", "./img/skill/skill2.png", 90, "s1"),
    Skill("ys_s2a", "./img/skill/skill2.png", 180, "s2"),
    Skill("ys_s2b", "./img/skill/skill2.png", 150, "s2"),
    Skill("ys_s3a", "./img/skill/skill2.png", 260, "s3"),]
  },
  {
    id: 8,
    name: "Ishmael",
    sprite: "./img/animações/output/8_ishmael_Base_Default.gif",
    portrait: "./img/profile img/Ishmael.png",
    skills: [Skill("ys_s1a", "./img/skill/skill2.png", 120, "s1"),
    Skill("ys_s1b", "./img/skill/skill2.png", 100, "s1"),
    Skill("ys_s1c", "./img/skill/skill2.png", 90, "s1"),
    Skill("ys_s2a", "./img/skill/skill2.png", 180, "s2"),
    Skill("ys_s2b", "./img/skill/skill2.png", 150, "s2"),
    Skill("ys_s3a", "./img/skill/skill2.png", 260, "s3"),]
  },
  {
    id: 9,
    name: "Rodion",
    sprite: "./img/animações/output/Rodion_Default.gif",
    portrait: "./img/profile img/Rodion.png",
    skills: [Skill("ys_s1a", "./img/skill/skill2.png", 120, "s1"),
    Skill("ys_s1b", "./img/skill/skill2.png", 100, "s1"),
    Skill("ys_s1c", "./img/skill/skill2.png", 90, "s1"),
    Skill("ys_s2a", "./img/skill/skill2.png", 180, "s2"),
    Skill("ys_s2b", "./img/skill/skill2.png", 150, "s2"),
    Skill("ys_s3a", "./img/skill/skill2.png", 260, "s3"),]
  },
  {
    id: 10,
    name: "Sinclair",
    sprite: "./img/animações/output/Sinclair_Default.gif",
    portrait: "./img/profile img/Sinclair.png",
    skills: [Skill("ys_s1a", "./img/skill/skill2.png", 120, "s1"),
    Skill("ys_s1b", "./img/skill/skill2.png", 100, "s1"),
    Skill("ys_s1c", "./img/skill/skill2.png", 90, "s1"),
    Skill("ys_s2a", "./img/skill/skill2.png", 180, "s2"),
    Skill("ys_s2b", "./img/skill/skill2.png", 150, "s2"),
    Skill("ys_s3a", "./img/skill/skill2.png", 260, "s3"),]
  },
  {
    id: 11,
    name: "Outis",
    sprite: "./img/animações/output/Outis_Default.gif",
    portrait: "./img/profile img/Outis.png",
    skills: [Skill("ys_s1a", "./img/skill/skill2.png", 120, "s1"),
    Skill("ys_s1b", "./img/skill/skill2.png", 100, "s1"),
    Skill("ys_s1c", "./img/skill/skill2.png", 90, "s1"),
    Skill("ys_s2a", "./img/skill/skill2.png", 180, "s2"),
    Skill("ys_s2b", "./img/skill/skill2.png", 150, "s2"),
    Skill("ys_s3a", "./img/skill/skill2.png", 260, "s3"),]
  },
  {
    id: 12,
    name: "Gregor",
    sprite: "./img/animações/output/Gregor_Default.gif",
    portrait: "./img/profile img/Gregor.png",
    skills: [Skill("ys_s1a", "./img/skill/skill2.png", 120, "s1"),
    Skill("ys_s1b", "./img/skill/skill2.png", 100, "s1"),
    Skill("ys_s1c", "./img/skill/skill2.png", 90, "s1"),
    Skill("ys_s2a", "./img/skill/skill2.png", 180, "s2"),
    Skill("ys_s2b", "./img/skill/skill2.png", 150, "s2"),
    Skill("ys_s3a", "./img/skill/skill2.png", 260, "s3"),]
  },
];

// Gera cards de seleção (usa portrait)
allCharacters.forEach(char => {
  const card = document.createElement("div");
  card.className = "character-card";
  const src = char.portrait || char.sprite;
  card.innerHTML = `<img src="${src}" alt="${char.name}">`;
  card.addEventListener("click", () => {
    const idx = selectedCharacters.findIndex(c => c.id === char.id);
    if (idx !== -1) {
      selectedCharacters.splice(idx, 1);
      card.classList.remove("selected");
    } else if (selectedCharacters.length < 5) {
      const clone = Object.assign({}, char);
      clone.chosenSkill = null; // skill currently chosen by the player (per char)
      selectedCharacters.push(clone);
      card.classList.add("selected");
    }
    btnStartBattle.classList.toggle("hidden", selectedCharacters.length === 0);
  });
  characterGrid.appendChild(card);
});

// transição
startScreen.addEventListener("click", () => {
  startScreen.classList.add("hidden");
  selectionScreen.classList.remove("hidden");
});

// botão iniciar
btnStartBattle.addEventListener("click", () => {
  if (selectedCharacters.length === 0) return;
  selectionScreen.classList.add("hidden");
  battleScreen.classList.remove("hidden");
  setupBattle();
});

// setup da batalha
function setupBattle() {
  if (bgVideo && typeof bgVideo.play === "function") bgVideo.play().catch(() => { });
  // Exemplo: define boss queued skills (predefinidas)
  const bossNode = enemyTeam.querySelector('.boss');
  if (bossNode) {
    bossNode.queuedSkills = [
      Skill("boss_a", "img/skill/boss_a.png", 100),
      Skill("boss_b", "img/skill/boss_b.png", 120),
      Skill("boss_c", "img/skill/boss_c.png", 150),
      Skill("boss_d", "img/skill/boss_d.png", 180)
    ];
  }

  renderPlayerTeam();
  renderSkillsUI();
  renderBossCoins(); // apenas boss coins
  updatePortraitOverlays(); // espelha seleção inicial (vazia)
}

// renderiza os personagens (sem moedas de jogador)
function renderPlayerTeam() {
  playerTeam.innerHTML = "";
  // apenas os characters nas células — sem container de skill-coins para jogadores
  selectedCharacters.forEach(char => {
    const div = document.createElement("div");
    div.className = "character";
    div.innerHTML = `<img src="${char.sprite}" alt="${char.name}"><div class="health-bar"><div class="health-fill" style="width:100%"></div></div>`;
    playerTeam.appendChild(div);
  });
}

// RENDER SKILLS UI: cria grid Nx2, e habilita seleção (toggle)
function renderSkillsUI() {
  skillsGrid.innerHTML = "";
  portraits.innerHTML = "";

  const cols = Math.max(selectedCharacters.length, 1);
  const rootStyles = getComputedStyle(document.documentElement);
  const iconW = rootStyles.getPropertyValue('--skills-icon-w').trim() || '44px';

  skillsGrid.style.gridTemplateColumns = `repeat(${cols}, ${iconW})`;
  document.documentElement.style.setProperty('--cols', cols);

  // build two rows: for each column pick two skills randomly from that character's skill pool
  const chosenPairs = [];

  if (selectedCharacters.length === 0) {
    chosenPairs.push([Skill("def", "img/skill/skill1.png", 50), Skill("def2", "img/skill/skill1.png", 50)]);
  } else {
    selectedCharacters.forEach(char => {
      // se char.skills for array - escolhe 2 aleatórias (mesma lógica reduzida)
      const pool = Array.isArray(char.skills) && char.skills.length ? char.skills : [Skill("def", "img/skill/skill1.png", 50)];
      // pick two distinct indices when possível
      const i1 = Math.floor(Math.random() * pool.length);
      let i2;
      do { i2 = Math.floor(Math.random() * pool.length); } while (i2 === i1 && pool.length > 1);
      chosenPairs.push([pool[i1], pool[i2]]);
    });
  }

  // row 1
  for (let col = 0; col < cols; col++) {
    const skillObj = (chosenPairs[col] && chosenPairs[col][0]) ? chosenPairs[col][0] : Skill("def", "img/skill/skill1.png", 50);
    const img = document.createElement("img");
    img.src = skillObj.src;
    img.className = "skill-icon";
    img.dataset.col = col;
    img.dataset.skillId = skillObj.id;
    img.dataset.damage = skillObj.damage;
    // clique: define/deseleciona para personagem da coluna
    img.addEventListener('click', () => toggleSelectSkillForColumn(col, skillObj, img));
    skillsGrid.appendChild(img);
  }

  // row 2
  for (let col = 0; col < cols; col++) {
    const skillObj = (chosenPairs[col] && chosenPairs[col][1]) ? chosenPairs[col][1] : Skill("def", "img/skill/skill1.png", 50);
    const img = document.createElement("img");
    img.src = skillObj.src;
    img.className = "skill-icon";
    img.dataset.col = col;
    img.dataset.skillId = skillObj.id;
    img.dataset.damage = skillObj.damage;
    img.addEventListener('click', () => toggleSelectSkillForColumn(col, skillObj, img));
    skillsGrid.appendChild(img);
  }

  // portraits (wrap each portrait for overlay)
  selectedCharacters.forEach((char, idx) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'portrait-wrapper';
    const img = document.createElement('img');
    img.src = char.portrait || char.sprite;
    img.alt = char.name;
    wrapper.appendChild(img);
    const overlay = document.createElement('div');
    overlay.className = 'portrait-overlay';
    // overlay contains small img when skill selected
    wrapper.appendChild(overlay);
    portraits.appendChild(wrapper);
  });

  // Clear any previous highlights
  clearAllSkillHighlights();
}

// Toggle selection for a column: select/deselect the skill for that column's character
function toggleSelectSkillForColumn(colIndex, skillObj, imgElement) {
  const char = selectedCharacters[colIndex];
  if (!char) return;

  // if already selected the same skill -> deselect
  if (char.chosenSkill && char.chosenSkill.id === skillObj.id) {
    char.chosenSkill = null;
    // remove highlight class from all skill imgs in that column that match that skill id
    clearHighlightForColumnSkill(colIndex, skillObj.id);
  } else {
    // set as chosen
    char.chosenSkill = skillObj;
    // remove highlights of previous chosen skill in that column and add new highlight to this skill element
    clearHighlightForColumn(colIndex);
    imgElement.classList.add('skill-selected');
  }

  // update portrait overlay to show small icon if chosenSkill exists
  updatePortraitOverlays();
}

// Remove highlight on all skills in a column (for toggling)
function clearHighlightForColumn(colIndex) {
  const imgs = skillsGrid.querySelectorAll(`img[data-col="${colIndex}"]`);
  imgs.forEach(i => i.classList.remove('skill-selected'));
}

// Remove highlight in column for a specific skill id
function clearHighlightForColumnSkill(colIndex, skillId) {
  const imgs = skillsGrid.querySelectorAll(`img[data-col="${colIndex}"]`);
  imgs.forEach(i => {
    if (i.dataset.skillId === skillId) i.classList.remove('skill-selected');
  });
}

// Remove all highlights
function clearAllSkillHighlights() {
  skillsGrid.querySelectorAll('img.skill-selected').forEach(i => i.classList.remove('skill-selected'));
}

// Update portrait overlays to reflect selected skill per character
function updatePortraitOverlays() {
  const wrappers = portraits.querySelectorAll('.portrait-wrapper');
  wrappers.forEach((wrap, idx) => {
    const overlay = wrap.querySelector('.portrait-overlay');
    const char = selectedCharacters[idx];
    if (!overlay) return;
    overlay.innerHTML = '';
    overlay.style.display = 'none';
    if (char && char.chosenSkill) {
      const small = document.createElement('img');
      small.src = char.chosenSkill.src;
      overlay.appendChild(small);
      overlay.style.display = 'block';
    }
  });
}

// RENDER boss coins only (small)
function renderBossCoins() {
  const bossNode = enemyTeam.querySelector('.boss');
  if (!bossNode) return;
  // ensure container exists
  let coinCont = bossNode.querySelector('.skill-coins');
  if (!coinCont) {
    coinCont = document.createElement('div');
    coinCont.className = 'skill-coins';
    bossNode.appendChild(coinCont);
  }
  coinCont.innerHTML = '';
  const bossQueue = bossNode.queuedSkills || [];
  bossQueue.forEach(s => {
    const slot = document.createElement('div');
    slot.className = 'coin-slot filled';
    const img = document.createElement('img');
    img.src = s.src;
    slot.appendChild(img);
    coinCont.appendChild(slot);
  });
}

// debug helper
window._debug = { selectedCharacters, allCharacters, toggleSelectSkillForColumn, renderSkillsUI, updatePortraitOverlays };