const startScreen = document.getElementById("start-screen");
const selectionScreen = document.getElementById("selection-screen");
const battleScreen = document.getElementById("battle-screen");
const btnPlay = document.getElementById("btn-play");
const btnStartBattle = document.getElementById("btn-start-battle");

const characterGrid = document.getElementById("character-grid");
const slotsContainer = document.getElementById("slots");
const skillsUI = document.getElementById("skills-ui");


const canvas = document.getElementById("battle-canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const bgVideo = document.getElementById("bg-video");

const selectedCharacters = [];

// Lista de personagens — declarados manualmente
const allCharacters = [
  {
    id: 1,
    name: "Yi Sang",
    sprites: {
      idle: "../Project Limbus/img/profile img/YiSang.png",
      skill1: "../Project Limbus/img/animações/output/LCB_Sinner_Yi_Sang_Skill_1.gif",
      skill2: "../Project Limbus/img/animações/output/LCB_Sinner_Yi_Sang_Skill_2.gif",
      skill3: "../Project Limbus/img/animações/output/LCB_Sinner_Yi_Sang_Skill_3.gif",
      evade: "../Project Limbus/img/Sinners/10101_YiSang_BaseAppearance/miss.png",
    },
    currentSprite: "../Project Limbus/img/profile img/YiSang.png",
  },
  {
    id: 2,
    name: "Faust",
    sprites: {
      idle: "../Project Limbus/img/profile img/Faust.png",
      skill1: "assets/characters/sinclair_skill1.png",
      skill2: "assets/characters/sinclair_skill2.png",
      skill3: "assets/characters/sinclair_skill3.png",
      evade: "assets/characters/sinclair_evade.png",
    },
    currentSprite: "../Project Limbus/img/profile img/Faust.png",
  },
  {
    id: 3,
    name: "Don Quixote",
    sprites: {
      idle: "../Project Limbus/img/profile img/donQuixote.png",
      skill1: "assets/characters/yisang_skill1.png",
      skill2: "assets/characters/yisang_skill2.png",
      skill3: "assets/characters/yisang_skill3.png",
      evade: "assets/characters/yisang_evade.png",
    },
    currentSprite: "../Project Limbus/img/profile img/donQuixote.png",
  },
  {
    id: 4,
    name: "Ryōshū",
    sprites: {
      idle: "../Project Limbus/img/profile img/Ryoshu.png",
      skill1: "assets/characters/donquixote_skill1.png",
      skill2: "assets/characters/donquixote_skill2.png",
      skill3: "assets/characters/donquixote_skill3.png",
      evade: "assets/characters/donquixote_evade.png",
    },
    currentSprite: "../Project Limbus/img/profile img/Ryoshu.png",
  },
  {
    id: 5,
    name: "Meursault",
    sprites: {
      idle: "../Project Limbus/img/profile img/Meursault.png",
      skill1: "assets/characters/ryoshu_skill1.png",
      skill2: "assets/characters/ryoshu_skill2.png",
      skill3: "assets/characters/ryoshu_skill3.png",
      evade: "assets/characters/ryoshu_evade.png",
    },
    currentSprite: "../Project Limbus/img/profile img/Meursault.png",
  },
  {
    id: 6,
    name: "Hong Lu",
    sprites: {
      idle: "../Project Limbus/img/profile img/HongLu.png",
      skill1: "assets/characters/meursault_skill1.png",
      skill2: "assets/characters/meursault_skill2.png",
      skill3: "assets/characters/meursault_skill3.png",
      evade: "assets/characters/meursault_evade.png",
    },
    currentSprite: "../Project Limbus/img/profile img/HongLu.png",
  },
  {
    id: 7,
    name: "Heathcliff",
    sprites: {
      idle: "../Project Limbus/img/profile img/Heatcliff.png",
      skill1: "assets/characters/honglu_skill1.png",
      skill2: "assets/characters/honglu_skill2.png",
      skill3: "assets/characters/honglu_skill3.png",
      evade: "assets/characters/honglu_evade.png",
    },
    currentSprite: "../Project Limbus/img/profile img/Heatcliff.png",
  },
  {
    id: 8,
    name: "Ishmael",
    sprites: {
      idle: "../Project Limbus/img/profile img/Ishmael.png",
      skill1: "assets/characters/heathcliff_skill1.png",
      skill2: "assets/characters/heathcliff_skill2.png",
      skill3: "assets/characters/heathcliff_skill3.png",
      evade: "assets/characters/heathcliff_evade.png",
    },
    currentSprite: "../Project Limbus/img/profile img/Ishmael.png",
  },
  {
    id: 9,
    name: "Rodion",
    sprites: {
      idle: "../Project Limbus/img/profile img/Rodion.png",
      skill1: "assets/characters/ishmael_skill1.png",
      skill2: "assets/characters/ishmael_skill2.png",
      skill3: "assets/characters/ishmael_skill3.png",
      evade: "assets/characters/ishmael_evade.png",
    },
    currentSprite: "../Project Limbus/img/profile img/Rodion.png",
  },
  {
    id: 10,
    name: "Sinclair",
    sprites: {
      idle: "../Project Limbus/img/profile img/Sinclair.png",
      skill1: "assets/characters/rodion_skill1.png",
      skill2: "assets/characters/rodion_skill2.png",
      skill3: "assets/characters/rodion_skill3.png",
      evade: "assets/characters/rodion_evade.png",
    },
    currentSprite: "../Project Limbus/img/profile img/Sinclair.png",
  },
  {
    id: 11,
    name: "Outis",
    sprites: {
      idle: "../Project Limbus/img/profile img/Outis.png",
      skill1: "assets/characters/faust_skill1.png",
      skill2: "assets/characters/faust_skill2.png",
      skill3: "assets/characters/faust_skill3.png",
      evade: "assets/characters/faust_evade.png",
    },
    currentSprite: "../Project Limbus/img/profile img/Outis.png",
  },
  {
    id: 12,
    name: "Gregor",
    sprites: {
      idle: "../Project Limbus/img/profile img/Gregor.png",
      skill1: "assets/characters/outis_skill1.png",
      skill2: "assets/characters/outis_skill2.png",
      skill3: "assets/characters/outis_skill3.png",
      evade: "assets/characters/outis_evade.png",
    },
    currentSprite: "../Project Limbus/img/profile img/Gregor.png",
  }
];

//  Criação dos cards na tela de seleção
allCharacters.forEach((char) => {
  const card = document.createElement("div");
  card.classList.add("character-card");
  card.innerHTML = `<img src="${char.sprites.idle}" alt="${char.name}">`;

  card.addEventListener("click", () => {
    const index = selectedCharacters.findIndex(c => c.id === char.id);
    if (index !== -1) {
      selectedCharacters.splice(index, 1);
      card.classList.remove("selected");
    } else if (selectedCharacters.length < 5) {
      selectedCharacters.push({ ...char });
      card.classList.add("selected");
    }
    updateSlots();
  });

  characterGrid.appendChild(card);
});

// Atualiza miniaturas dos selecionados
function updateSlots() {
  // Verifica se 5 personagens foram selecionados
  if (selectedCharacters.length === 5) {
    btnStartBattle.classList.remove("hidden");  // Torna o botão visível
  } else {
    btnStartBattle.classList.add("hidden");     // Esconde o botão se menos de 5 forem selecionados
  }
}

// Transições
btnPlay.onclick = () => {
  startScreen.classList.add("hidden");
  selectionScreen.classList.remove("hidden");
};

btnStartBattle.onclick = () => {
  console.log("Botão 'Start Battle' clicado!");  // Log para verificar se a função está sendo chamada
  selectionScreen.classList.add("hidden");
  battleScreen.classList.remove("hidden");
  bgVideo.play();
  setupBattle();
};

// Setup da batalha
function setupBattle() {
  preloadSprites();
  setupSkillsUI();
  setupPortraits();
  drawBattle();
}

// Precarrega imagens para evitar flicker
function preloadSprites() {
  selectedCharacters.forEach(char => {
    char.img = new Image();
    char.img.src = char.currentSprite;
  });
}

// Renderiza personagens no canvas
function drawBattle() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const spacing = canvas.width / (selectedCharacters.length + 1);
  selectedCharacters.forEach((char, index) => {
    const img = new Image();
    img.src = char.currentSprite;
    const x = spacing * (index + 1) - 50;
    const y = canvas.height / 2 - 50;
    img.onload = () => {
      ctx.drawImage(img, x, y, 100, 100);
    };
  });

  requestAnimationFrame(drawBattle);
}

