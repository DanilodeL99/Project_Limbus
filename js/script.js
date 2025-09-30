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

const characters = [];
const selectedCharacters = [];

const totalCharacters = 12;

for (let i = 1; i <= totalCharacters; i++) {
  characters.push({
    id: i,
    name: `Char ${i}`,
    idle: `assets/characters/char${i}_idle.png`,
    attack: `assets/characters/char${i}_attack.png`,
    currentSprite: `assets/characters/char${i}_idle.png`
  });
}

// Renderiza os personagens na UI
characters.forEach((char, index) => {
  const card = document.createElement("div");
  card.classList.add("character-card");
  card.style.backgroundImage = `url(${char.idle})`;

  card.addEventListener("click", () => {
    if (card.classList.contains("selected")) return;

    if (selectedCharacters.length < 5) {
      card.classList.add("selected");
      selectedCharacters.push({ ...char });
      updateSlots();
    }

    if (selectedCharacters.length === 5) {
      btnStartBattle.classList.remove("hidden");
    }
  });

  characterGrid.appendChild(card);
});

// Atualiza os slots selecionados
function updateSlots() {
  slotsContainer.innerHTML = "";
  selectedCharacters.forEach((char, index) => {
    const img = document.createElement("img");
    img.src = char.idle;
    img.width = 50;
    slotsContainer.appendChild(img);
  });
}

// Transição para batalha
btnPlay.onclick = () => {
  startScreen.classList.add("hidden");
  selectionScreen.classList.remove("hidden");
};

btnStartBattle.onclick = () => {
  selectionScreen.classList.add("hidden");
  battleScreen.classList.remove("hidden");
  bgVideo.play();
  drawBattle();
  renderSkillsUI();
};

// Função para desenhar os personagens na tela de batalha
function drawBattle() {
  ctx.drawImage(bgVideo, 0, 0, canvas.width, canvas.height);

  selectedCharacters.forEach((char, index) => {
    const img = new Image();
    img.src = char.currentSprite;
    const x = 100 + index * 150;
    const y = canvas.height / 2 - 100;
    img.onload = () => {
      ctx.drawImage(img, x, y, 100, 100);
    };
  });

  requestAnimationFrame(drawBattle);
}

// UI de habilidades
function renderSkillsUI() {
  for (let i = 0; i < 10; i++) {
    const skill = document.createElement("img");
    skill.src = `assets/skills/skill${(i % 5) + 1}.png`;

    skill.onclick = () => {
      const target = selectedCharacters[i % 5];
      target.currentSprite = target.attack;

      // Reverter para idle após 1 segundo
      setTimeout(() => {
        target.currentSprite = target.idle;
      }, 1000);
    };

    skillsUI.appendChild(skill);
  }
}
