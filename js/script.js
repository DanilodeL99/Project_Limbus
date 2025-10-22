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
const startTurnBtn = document.getElementById("start-turn-btn");

// ESTADO
const selectedCharacters = [];
let bossData = null;
const BOSS_MAX_HP = 500;

// Factory Skill
function Skill(id, src, damage = 0, type = "generic", opts = {}) {
  return Object.assign({
    id, src, damage, type,
    coins: opts.coins || 1,
    coinBonus: opts.coinBonus || 0,
    winGif: opts.winGif || null,
    hurtPng: opts.hurtPng || null,
    clashPngs: Array.isArray(opts.clashPngs) ? opts.clashPngs : (opts.clashPngs ? [opts.clashPngs] : []),
    coinImg: opts.coinImg || null,
    basePower: opts.basePower || opts.damage || 0
  }, opts);
}

/* --------- util simples --------- */
function wait(ms) { return new Promise(r => setTimeout(r, ms)); }
function ensureBattleOverlay() {
  let ov = document.getElementById('battle-overlay');
  if (!ov) {
    ov = document.createElement('div'); ov.id = 'battle-overlay';
    ov.style.position = 'absolute'; ov.style.left = '0'; ov.style.top = '0';
    ov.style.width = '100%'; ov.style.height = '100%';
    ov.style.pointerEvents = 'none'; ov.style.zIndex = '9999';
    document.body.appendChild(ov);
  }
  ov.innerHTML = '';
  return ov;
}
function rollCoinsForSkill(skill) {
  const coins = skill && typeof skill.coins === 'number' ? skill.coins : 1;
  const coinBonus = skill && typeof skill.coinBonus === 'number' ? skill.coinBonus : 0;
  let heads = 0;
  for (let i = 0; i < coins; i++) if (Math.random() < 0.5) heads++;
  return { heads, tails: coins - heads, totalBonus: heads * coinBonus };
}

const CLASH_GAP = 18; // menor = mais próximos

const allCharacters = [
  {
    id: 1,
    name: "Yi Sang",
    sprite: "./img/Sinners/10101_YiSang_BaseAppearance/idle.gif",
    portrait: "./img/profile img/YiSang.png",
    moveImg: "./img/Sinners/10101_YiSang_BaseAppearance/move.png",
    skills: [
      Skill("ys_s1a", "./img/skill/skill1.png", 4, "s1", {
        coins: 1, coinBonus: 7,
        coinImg: "./img/coins/coin_yi.png",
        clashPngs: ["./img/Sinners/10101_YiSang_BaseAppearance/gud.png", "./img/Sinners/10101_YiSang_BaseAppearance/miss.png"],
        winGif: "./img/Sinners/10101_YiSang_BaseAppearance/skill1.gif",
        hurtPng: "./img/Sinners/10101_YiSang_BaseAppearance/dmg.png"
      }),
      Skill("ys_s1b", "./img/skill/skill1.png", 4, "s1", {
        coins: 1, coinBonus: 7,
        coinImg: "./img/coins/coin_yi.png",
        clashPngs: ["./img/Sinners/10101_YiSang_BaseAppearance/gud.png", "./img/Sinners/10101_YiSang_BaseAppearance/miss.png"],
        winGif: "./img/Sinners/10101_YiSang_BaseAppearance/skill1.gif",
        hurtPng: "./img/Sinners/10101_YiSang_BaseAppearance/dmg.png"
      }),
      Skill("ys_s2a", "./img/skill/skill2.png", 4, "s2", {
        coins: 2, coinBonus: 4,
        clashPngs: ["./img/Sinners/10101_YiSang_BaseAppearance/gud.png", "./img/Sinners/10101_YiSang_BaseAppearance/miss.png"],
        winGif: "./img/Sinners/10101_YiSang_BaseAppearance/skill2.gif",
        hurtPng: "./img/Sinners/10101_YiSang_BaseAppearance/dmg.png"
      }),
      Skill("ys_s3a", "./img/skill/skill3.png", 6, "s3", {
        coins: 3, coinBonus: 2,
        clashPngs: ["./img/Sinners/10101_YiSang_BaseAppearance/gud.png", "./img/Sinners/10101_YiSang_BaseAppearance/miss.png"],
        winGif: "./img/Sinners/10101_YiSang_BaseAppearance/skill3.gif",
        hurtPng: "./img/Sinners/10101_YiSang_BaseAppearance/dmg.png"
      })
    ]
  },

  {
    id: 2,
    name: "Faust",
    sprite: "./img/Sinners/10201_Faust_BaseAppearance/idle.gif",
    portrait: "./img/profile img/Faust.png",
    moveImg: "./img/Sinners/10201_Faust_BaseAppearance/move.png",
    skills: [
      Skill("fa_s1b", "./img/skill/skill1.png", 4, "s1", {
        coins: 1, coinBonus: 7,
        coinImg: "./img/coins/coin_yi.png",
        clashPngs: ["./img/Sinners/10201_Faust_BaseAppearance/gud.png", "./img/Sinners/10201_Faust_BaseAppearance/miss.png"],
        winGif: "./img/Sinners/10201_Faust_BaseAppearance/skill1.gif",
        hurtPng: "./img/Sinners/10201_Faust_BaseAppearance/dmg.png"
      }),
      Skill("fa_s1b", "./img/skill/skill1.png", 4, "s1", {
        coins: 1, coinBonus: 7,
        coinImg: "./img/coins/coin_yi.png",
        clashPngs: ["./img/Sinners/10201_Faust_BaseAppearance/gud.png", "./img/Sinners/10201_Faust_BaseAppearance/miss.png"],
        winGif: "./img/Sinners/10201_Faust_BaseAppearance/skill1.gif",
        hurtPng: "./img/Sinners/10201_Faust_BaseAppearance/dmg.png"
      }),
      Skill("fa_s2a", "./img/skill/skill2.png", 5, "s2", {
        coins: 2, coinBonus: 4,
        clashPngs: ["./img/Sinners/10201_Faust_BaseAppearance/gud.png", "./img/Sinners/10201_Faust_BaseAppearance/miss.png"],
        winGif: "./img/Sinners/10201_Faust_BaseAppearance/skill2.gif",
        hurtPng: "./img/Sinners/10201_Faust_BaseAppearance/dmg.png"
      }),
      Skill("fa_s3a", "./img/skill/skill3.png", 7, "s3", {
        coins: 2, coinBonus: 2,
        clashPngs: ["./img/Sinners/10201_Faust_BaseAppearance/gud.png", "./img/Sinners/10201_Faust_BaseAppearance/miss.png"],
        winGif: "./img/Sinners/10201_Faust_BaseAppearance/skill3.gif",
        hurtPng: "./img/Sinners/10201_Faust_BaseAppearance/dmg.png"
      })
    ]
  },

  {
    id: 3,
    name: "Don Quixote",
    sprite: "./img/Sinners/10301_Donquixote_BaseAppearance/idle.gif",
    portrait: "./img/profile img/donQuixote.png",
    moveImg: "./img/Sinners/10301_Donquixote_BaseAppearance/move.png",
    skills: [
      Skill("dq_s1", "./img/skill/skill1.png", 4, "s1", {
        coins: 1, coinBonus: 7,
        coinImg: "./img/coins/coin_yi.png",
        clashPngs: ["./img/Sinners/10301_Donquixote_BaseAppearance/gud.png", "./img/Sinners/10301_Donquixote_BaseAppearance/miss_#80938"],
        winGif: "./img/Sinners/10301_Donquixote_BaseAppearance/skill1.gif",
        hurtPng: "./img/Sinners/10301_Donquixote_BaseAppearance/dmg_#81111"
      }),
      Skill("dq_s1", "./img/skill/skill1.png", 4, "s1", {
        coins: 1, coinBonus: 7,
        coinImg: "./img/coins/coin_yi.png",
        clashPngs: ["./img/Sinners/10301_Donquixote_BaseAppearance/gud.png", "./img/Sinners/10301_Donquixote_BaseAppearance/miss_#80938"],
        winGif: "./img/Sinners/10301_Donquixote_BaseAppearance/skill1.gif",
        hurtPng: "./img/Sinners/10301_Donquixote_BaseAppearance/dmg_#81111"
      }),
      Skill("dq_s2", "./img/skill/skill2.png", 4, "s2", {
        coins: 1, coinBonus: 12,
        clashPngs: ["./img/Sinners/10301_Donquixote_BaseAppearance/gud.png", "./img/Sinners/10301_Donquixote_BaseAppearance/miss_#80938"],
        winGif: "./img/Sinners/10301_Donquixote_BaseAppearance/skill2.gif",
        hurtPng: "./img/Sinners/10301_Donquixote_BaseAppearance/dmg_#81111"
      }),
      Skill("dq_s3", "./img/skill/skill3.png", 3, "s3", {
        coins: 3, coinBonus: 3,
        clashPngs: ["./img/Sinners/10301_Donquixote_BaseAppearance/gud.png", "./img/Sinners/10301_Donquixote_BaseAppearance/miss_#80938"],
        winGif: "./img/Sinners/10301_Donquixote_BaseAppearance/skill3.gif",
        hurtPng: "./img/Sinners/10301_Donquixote_BaseAppearance/dmg_#81111"
      })
    ]
  },

  {
    id: 4,
    name: "Ryōshū",
    sprite: "./img/Sinners/10401_Ryoshu_BaseAppearance/idle.gif",
    portrait: "./img/profile img/Ryoshu.png",
    moveImg: "./img/Sinners/10401_Ryoshu_BaseAppearance/move.png",
    skills: [
      Skill("r_s1", "./img/skill/skill1.png", 4, "s1", {
        coins: 1, coinBonus: 7,
        coinImg: "./img/coins/coin_yi.png",
        clashPngs: ["./img/Sinners/10401_Ryoshu_BaseAppearance/gud.png", "./img/Sinners/10401_Ryoshu_BaseAppearance/miss_#86250"],
        winGif: "./img/Sinners/10401_Ryoshu_BaseAppearance/skill1.gif",
        hurtPng: "./img/Sinners/10401_Ryoshu_BaseAppearance/dmg.png"
      }),
      Skill("r_s1", "./img/skill/skill1.png", 4, "s1", {
        coins: 1, coinBonus: 7,
        coinImg: "./img/coins/coin_yi.png",
        clashPngs: ["./img/Sinners/10401_Ryoshu_BaseAppearance/gud.png", "./img/Sinners/10401_Ryoshu_BaseAppearance/miss_#86250"],
        winGif: "./img/Sinners/10401_Ryoshu_BaseAppearance/skill1.gif",
        hurtPng: "./img/Sinners/10401_Ryoshu_BaseAppearance/dmg.png"
      }),
      Skill("r_s2", "./img/skill/skill2.png", 4, "s2", {
        coins: 2, coinBonus: 5,
        clashPngs: ["./img/Sinners/10401_Ryoshu_BaseAppearance/gud.png", "./img/Sinners/10401_Ryoshu_BaseAppearance/miss_#86250"],
        winGif: "./img/Sinners/10401_Ryoshu_BaseAppearance/skill2.gif",
        hurtPng: "./img/Sinners/10401_Ryoshu_BaseAppearance/dmg.png"
      }),
      Skill("r_s3", "./img/skill/skill3.png", 5, "s3", {
        coins: 3, coinBonus: 3,
        clashPngs: ["./img/Sinners/10401_Ryoshu_BaseAppearance/gud.png", "./img/Sinners/10401_Ryoshu_BaseAppearance/miss_#86250"],
        winGif: "./img/Sinners/10401_Ryoshu_BaseAppearance/skill3.gif",
        hurtPng: "./img/Sinners/10401_Ryoshu_BaseAppearance/dmg.png"
      })
    ]
  },

  {
    id: 5,
    name: "Meursault",
    sprite: "./img/Sinners/10501_Meursault_BaseAppearance/idle.gif",
    portrait: "./img/profile img/Meursault.png",
    moveImg: "./img/Sinners/10501_Meursault_BaseAppearance/move.png",
    skills: [
      Skill("m_s1", "./img/skill/skill1.png", 3, "s1", {
        coins: 2, coinBonus: 4,
        coinImg: "./img/coins/coin_yi.png",
        clashPngs: ["./img/Sinners/10501_Meursault_BaseAppearance/gud.png", "./img/Sinners/10501_Meursault_BaseAppearance/miss.png"],
        winGif: "./img/Sinners/10501_Meursault_BaseAppearance/skill1.gif",
        hurtPng: "./img/Sinners/10501_Meursault_BaseAppearance/dmg.png"
      }),
      Skill("m_s1", "./img/skill/skill1.png", 3, "s1", {
        coins: 2, coinBonus: 4,
        coinImg: "./img/coins/coin_yi.png",
        clashPngs: ["./img/Sinners/10501_Meursault_BaseAppearance/gud.png", "./img/Sinners/10501_Meursault_BaseAppearance/miss.png"],
        winGif: "./img/Sinners/10501_Meursault_BaseAppearance/skill1.gif",
        hurtPng: "./img/Sinners/10501_Meursault_BaseAppearance/dmg.png"
      }),
      Skill("m_s2", "./img/skill/skill2.png", 6, "s2", {
        coins: 1, coinBonus: 9,
        coinImg: "./img/coins/coin_yi.png",
        clashPngs: ["./img/Sinners/10501_Meursault_BaseAppearance/gud.png", "./img/Sinners/10501_Meursault_BaseAppearance/miss.png"],
        winGif: "./img/Sinners/10501_Meursault_BaseAppearance/skill2.gif",
        hurtPng: "./img/Sinners/10501_Meursault_BaseAppearance/dmg.png"
      }),
      Skill("m_s3", "./img/skill/skill3.png", 6, "s3", {
        coins: 10, coinBonus: 1,
        coinImg: "./img/coins/coin_yi.png",
        clashPngs: ["./img/Sinners/10501_Meursault_BaseAppearance/gud.png", "./img/Sinners/10501_Meursault_BaseAppearance/miss.png"],
        winGif: "./img/Sinners/10501_Meursault_BaseAppearance/skill3.gif",
        hurtPng: "./img/Sinners/10501_Meursault_BaseAppearance/dmg.png"
      })
    ]
  },

  {
    id: 6,
    name: "Hong Lu",
    sprite: "./img/animações/output/Honglu_Default.gif",
    portrait: "./img/profile img/HongLu.png",
    moveImg: "./img/move/honglu_move.png",
    skills: [
      Skill("hl_s1", "./img/skill/skill2.png", 110, "s1", { coins: 1, coinBonus: 12 }),
      Skill("hl_s2", "./img/skill/skill2.png", 170, "s2", { coins: 2, coinBonus: 30 }),
      Skill("hl_s3", "./img/skill/skill3.png", 260, "s3", {
        coins: 3, coinBonus: 40,
        winGif: "./img/win/honglu_win.gif",
        clashPngs: ["./img/clash/hong_c1.png", "./img/clash/hong_c2.png"]
      })
    ]
  },

  {
    id: 7,
    name: "Heathcliff",
    sprite: "./img/animações/output/Heathcliff_Default.gif",
    portrait: "./img/profile img/Heatcliff.png",
    moveImg: "./img/move/heath_move.png",
    skills: [
      Skill("hc_s1", "./img/skill/skill2.png", 100, "s1", { coins: 1, coinBonus: 9 }),
      Skill("hc_s2", "./img/skill/skill2.png", 160, "s2", { coins: 2, coinBonus: 24 }),
      Skill("hc_s3", "./img/skill/skill3.png", 240, "s3", {
        coins: 3, coinBonus: 32,
        winGif: "./img/win/heath_win.gif",
        hurtPng: "./img/hurt/heath_hurt.png"
      })
    ]
  },

  {
    id: 8,
    name: "Ishmael",
    sprite: "./img/animações/output/8_ishmael_Base_Default.gif",
    portrait: "./img/profile img/Ishmael.png",
    moveImg: "./img/move/ishmael_move.png",
    skills: [
      Skill("i_s1", "./img/skill/skill2.png", 95, "s1", { coins: 1, coinBonus: 10 }),
      Skill("i_s2", "./img/skill/skill2.png", 155, "s2", { coins: 2, coinBonus: 22 }),
      Skill("i_s3", "./img/skill/skill3.png", 230, "s3", {
        coins: 3, coinBonus: 34,
        clashPngs: ["./img/clash/ish_c1.png"],
        winGif: "./img/win/ishmael_win.gif"
      })
    ]
  },

  {
    id: 9,
    name: "Rodion",
    sprite: "./img/animações/output/Rodion_Default.gif",
    portrait: "./img/profile img/Rodion.png",
    moveImg: "./img/move/rodion_move.png",
    skills: [
      Skill("ro_s1", "./img/skill/skill2.png", 105, "s1", { coins: 1, coinBonus: 12 }),
      Skill("ro_s2", "./img/skill/skill2.png", 165, "s2", { coins: 2, coinBonus: 25 }),
      Skill("ro_s3", "./img/skill/skill3.png", 250, "s3", {
        coins: 3, coinBonus: 35,
        winGif: "./img/win/rodion_win.gif",
        hurtPng: "./img/hurt/rodion_hurt.png"
      })
    ]
  },

  {
    id: 10,
    name: "Sinclair",
    sprite: "./img/animações/output/Sinclair_Default.gif",
    portrait: "./img/profile img/Sinclair.png",
    moveImg: "./img/move/sinclair_move.png",
    skills: [
      Skill("s_s1", "./img/skill/skill2.png", 110, "s1", { coins: 1, coinBonus: 12 }),
      Skill("s_s2", "./img/skill/skill2.png", 170, "s2", { coins: 2, coinBonus: 28 }),
      Skill("s_s3", "./img/skill/skill3.png", 270, "s3", {
        coins: 3, coinBonus: 40,
        clashPngs: ["./img/clash/sin_c1.png", "./img/clash/sin_c2.png"],
        winGif: "./img/win/sinclair_win.gif"
      })
    ]
  },

  {
    id: 11,
    name: "Outis",
    sprite: "./img/animações/output/Outis_Default.gif",
    portrait: "./img/profile img/Outis.png",
    moveImg: "./img/move/outis_move.png",
    skills: [
      Skill("o_s1", "./img/skill/skill2.png", 95, "s1", { coins: 1, coinBonus: 8 }),
      Skill("o_s2", "./img/skill/skill2.png", 150, "s2", { coins: 2, coinBonus: 20 }),
      Skill("o_s3", "./img/skill/skill3.png", 240, "s3", {
        coins: 3, coinBonus: 36,
        winGif: "./img/win/outis_win.gif",
        hurtPng: "./img/hurt/outis_hurt.png"
      })
    ]
  },

  {
    id: 12,
    name: "Gregor",
    sprite: "./img/animações/output/Gregor_Default.gif",
    portrait: "./img/profile img/Gregor.png",
    moveImg: "./img/move/gregor_move.png",
    skills: [
      Skill("g_s1", "./img/skill/skill2.png", 110, "s1", { coins: 1, coinBonus: 12 }),
      Skill("g_s2", "./img/skill/skill2.png", 165, "s2", { coins: 2, coinBonus: 28 }),
      Skill("g_s3", "./img/skill/skill3.png", 255, "s3", {
        coins: 3, coinBonus: 40,
        clashPngs: ["./img/clash/greg_c1.png"],
        winGif: "./img/win/gregor_win.gif",
        hurtPng: "./img/hurt/gregor_hurt.png"
      })
    ]
  }
];


function createSelectionGrid() {
  characterGrid.innerHTML = '';
  allCharacters.forEach(char => {
    const card = document.createElement('div');
    card.className = 'character-card';
    const src = char.portrait || char.sprite;
    card.innerHTML = `<img src="${src}" alt="${char.name}">`;
    card.addEventListener('click', () => {
      const idx = selectedCharacters.findIndex(c => c.id === char.id);
      if (idx !== -1) {
        selectedCharacters.splice(idx, 1);
        card.classList.remove('selected');
      } else if (selectedCharacters.length < 5) {
        const clone = Object.assign({}, char);
        clone.chosenSkill = null;
        clone.hp = 100;
        clone.alive = true;
        selectedCharacters.push(clone);
        card.classList.add('selected');
      }
      btnStartBattle.classList.toggle('hidden', selectedCharacters.length === 0);
    });
    characterGrid.appendChild(card);
  });
}
createSelectionGrid();

startScreen.addEventListener('click', () => {
  startScreen.classList.add('hidden');
  selectionScreen.classList.remove('hidden');
});
btnStartBattle.addEventListener('click', () => {
  if (selectedCharacters.length === 0) return;
  selectionScreen.classList.add('hidden');
  battleScreen.classList.remove('hidden');
  setupBattle();
});

/* ----------------- setup battle & bossData ----------------- */
function setupBattle() {
  if (bgVideo && typeof bgVideo.play === 'function') bgVideo.play().catch(()=>{});
  const bossNode = enemyTeam.querySelector('.boss');
  if (bossNode) {
    const bossImgEl = bossNode.querySelector('img');
    bossData = bossData || {
      sprite: bossImgEl ? bossImgEl.src : './img/boss/How Wild/idle.gif',
      moveImg: bossNode.dataset.moveImg || './img/boss/How Wild/moving.png',
      queuedSkills: bossNode.queuedSkills || [
        Skill("boss_s1","./img/boss/How Wild/coin/skill1.png",3,"boss",{coins:2,coinBonus:4,coinImg:"./img/coins/coin_boss.png",clashPngs:["./img/boss/How Wild/guard.png"],winGif:"./img/boss/How Wild/skill1.gif",hurtPng:"./img/boss/How Wild/hurt.png", basePower:3}),
        Skill("boss_s2","./img/boss/How Wild/coin/skill2.png",5,"boss",{coins:3,coinBonus:3,coinImg:"./img/coins/coin_boss.png",clashPngs:["./img/boss/How Wild/guard.png"],winGif:"./img/boss/How Wild/skill2.gif",hurtPng:"./img/boss/How Wild/hurt.png", basePower:5}),
        Skill("boss_s3","./img/boss/How Wild/coin/skill3.png",6,"boss",{coins:2,coinBonus:6,coinImg:"./img/coins/coin_boss.png",clashPngs:["./img/boss/How Wild/guard.png"],winGif:"./img/boss/How Wild/skill3.gif",hurtPng:"./img/boss/How Wild/hurt.png", basePower:6})
      ],
      coinCount: parseInt(bossNode.dataset.coinCount || '5', 10),
      hp: typeof bossNode.hp === 'number' ? bossNode.hp : BOSS_MAX_HP
    };
    if (bossImgEl && bossData.sprite) bossImgEl.src = bossData.sprite;
    bossNode.dataset.moveImg = bossData.moveImg;
    bossNode.queuedSkills = bossData.queuedSkills.slice();
    bossNode.dataset.coinCount = bossData.coinCount;
    bossNode.hp = bossData.hp;
  }

  renderPlayerTeam();
  renderSkillsUI();
  renderBossCoins();
  updatePortraitOverlays();
  updateStartButtonState();
}

/* ----------------- render player team / hp em px ----------------- */
function renderPlayerTeam() {
  playerTeam.innerHTML = '';
  const rootStyles = getComputedStyle(document.documentElement);
  const spriteWstr = rootStyles.getPropertyValue('--arena-sprite-w').trim() || '120px';
  const spriteWpx = parseInt(spriteWstr, 10) || 120;

  selectedCharacters.forEach((char, idx) => {
    const div = document.createElement('div');
    div.className = 'character';
    div.dataset.idx = idx;
    if (!char.alive) div.classList.add('dead-character');

    const fillPx = Math.round((Math.max(0,char.hp) / 100) * spriteWpx);

    div.innerHTML = `
      <img src="${char.sprite}" alt="${char.name}">
      <div class="health-bar" style="width:${spriteWpx}px;">
        <div class="health-fill" style="width:${fillPx}px"></div>
      </div>
    `;
    playerTeam.appendChild(div);
  });
}

/* ----------------- render skills & portraits ----------------- */
function renderSkillsUI() {
  skillsGrid.innerHTML = '';
  portraits.innerHTML = '';
  const cols = Math.max(selectedCharacters.length, 1);
  const rootStyles = getComputedStyle(document.documentElement);
  const iconW = rootStyles.getPropertyValue('--skills-icon-w').trim() || '44px';
  skillsGrid.style.gridTemplateColumns = `repeat(${cols}, ${iconW})`;
  document.documentElement.style.setProperty('--cols', cols);

  const chosenPairs = selectedCharacters.map(char => {
    const pool = Array.isArray(char.skills) && char.skills.length ? char.skills : [Skill('def','img/skill/skill1.png',5)];
    const i1 = Math.floor(Math.random() * pool.length);
    let i2 = i1;
    if (pool.length > 1) while (i2 === i1) i2 = Math.floor(Math.random() * pool.length);
    return [pool[i1], pool[i2]];
  });

  for (let c = 0; c < cols; c++) {
    const s = chosenPairs[c] ? chosenPairs[c][0] : Skill('def','img/skill/skill1.png',5);
    const img = document.createElement('img');
    img.src = s.src; img.className = 'skill-icon';
    img.dataset.col = c; img.dataset.skillId = s.id;
    img.addEventListener('click', () => toggleSelectSkillForColumn(c, s, img));
    if (!selectedCharacters[c] || !selectedCharacters[c].alive) { img.style.pointerEvents = 'none'; img.style.opacity = '0.35'; }
    skillsGrid.appendChild(img);
  }
  for (let c = 0; c < cols; c++) {
    const s = chosenPairs[c] ? chosenPairs[c][1] : Skill('def2','img/skill/skill1.png',5);
    const img = document.createElement('img');
    img.src = s.src; img.className = 'skill-icon';
    img.dataset.col = c; img.dataset.skillId = s.id;
    img.addEventListener('click', () => toggleSelectSkillForColumn(c, s, img));
    if (!selectedCharacters[c] || !selectedCharacters[c].alive) { img.style.pointerEvents = 'none'; img.style.opacity = '0.35'; }
    skillsGrid.appendChild(img);
  }

  selectedCharacters.forEach(char => {
    const wrapper = document.createElement('div'); wrapper.className = 'portrait-wrapper';
    const img = document.createElement('img'); img.src = char.portrait || char.sprite; img.alt = char.name;
    if (!char.alive) img.style.filter = 'grayscale(1) brightness(.6)';
    wrapper.appendChild(img);
    const overlay = document.createElement('div'); overlay.className = 'portrait-overlay';
    wrapper.appendChild(overlay);
    portraits.appendChild(wrapper);
  });

  clearAllSkillHighlights();
  updatePortraitOverlays();
  updateStartButtonState();
}

/* ---------- skill select helpers ---------- */
function toggleSelectSkillForColumn(colIndex, skillObj, imgElement) {
  const char = selectedCharacters[colIndex];
  if (!char || !char.alive) return;
  if (char.chosenSkill && char.chosenSkill.id === skillObj.id) {
    char.chosenSkill = null;
    clearHighlightForColumnSkill(colIndex, skillObj.id);
  } else {
    char.chosenSkill = skillObj;
    clearHighlightForColumn(colIndex);
    imgElement.classList.add('skill-selected');
  }
  updatePortraitOverlays();
  updateStartButtonState();
}
function clearHighlightForColumn(colIndex) { const imgs = skillsGrid.querySelectorAll(`img[data-col="${colIndex}"]`); imgs.forEach(i => i.classList.remove('skill-selected')); }
function clearHighlightForColumnSkill(colIndex, skillId) { const imgs = skillsGrid.querySelectorAll(`img[data-col="${colIndex}"]`); imgs.forEach(i => { if (i.dataset.skillId === skillId) i.classList.remove('skill-selected'); }); }
function clearAllSkillHighlights() { skillsGrid.querySelectorAll('img.skill-selected').forEach(i => i.classList.remove('skill-selected')); }

function updatePortraitOverlays() {
  const wrappers = portraits.querySelectorAll('.portrait-wrapper');
  wrappers.forEach((wrap, idx) => {
    const overlay = wrap.querySelector('.portrait-overlay');
    const char = selectedCharacters[idx];
    overlay.innerHTML = ''; overlay.style.display = 'none';
    if (char && char.chosenSkill) {
      const small = document.createElement('img'); small.src = char.chosenSkill.src; small.style.width = '100%'; small.style.height = '100%';
      overlay.appendChild(small); overlay.style.display = 'block';
    } else if (char && !char.alive) {
      overlay.textContent = '✖'; overlay.style.color = 'rgba(255,40,40,0.95)'; overlay.style.fontWeight = '800'; overlay.style.display = 'block';
    }
  });
}

/* ----------------- boss coins UI ----------------- */
function renderBossCoins() {
  const bossNode = enemyTeam.querySelector('.boss');
  if (!bossNode) return;
  let coinCont = bossNode.querySelector('.skill-coins');
  if (!coinCont) { coinCont = document.createElement('div'); coinCont.className = 'skill-coins'; bossNode.appendChild(coinCont); }
  coinCont.innerHTML = '';
  const coinCount = parseInt(bossNode.dataset.coinCount || '5', 10);
  const queue = bossNode.queuedSkills || [];
  for (let i = 0; i < coinCount; i++) {
    const slot = document.createElement('div'); slot.className = 'coin-slot';
    const skillForSlot = queue[i % Math.max(queue.length, 1)];
    const img = document.createElement('img');
    img.src = (skillForSlot && skillForSlot.coinImg) ? skillForSlot.coinImg : (skillForSlot ? skillForSlot.src : 'img/skill/skill1.png');
    slot.appendChild(img); coinCont.appendChild(slot);
  }
}

/* ----------------- update start btn ----------------- */
function allPlayersHaveSkills() { return selectedCharacters.length > 0 && selectedCharacters.every(c => c.alive && !!c.chosenSkill); }
function updateStartButtonState() { if (!startTurnBtn) return; const ok = allPlayersHaveSkills(); startTurnBtn.disabled = !ok; startTurnBtn.style.opacity = ok ? '1' : '0.5'; }
updateStartButtonState();

/* ----------------- CRIAR CLONE ALINHADO: usa img original quando disponível ----------------- */
function createCloneFromChar(charObj, isBoss = false, originalImgEl = null) {
  const rootStyles = getComputedStyle(document.documentElement);
  const rawW = isBoss ? (rootStyles.getPropertyValue('--boss-sprite-w') || rootStyles.getPropertyValue('--arena-sprite-w')) : rootStyles.getPropertyValue('--arena-sprite-w');
  const rawH = isBoss ? (rootStyles.getPropertyValue('--boss-sprite-h') || rootStyles.getPropertyValue('--arena-sprite-h')) : rootStyles.getPropertyValue('--arena-sprite-h');
  const defaultW = (rawW || '120px').toString().trim();
  const defaultH = (rawH || '120px').toString().trim();

  const img = document.createElement('img');
  img.src = charObj.moveImg || charObj.sprite || (isBoss ? (bossData && bossData.sprite) || './img/boss/How Wild/idle.gif' : 'img/skill/skill1.png');
  img.className = 'battle-clone';
  img.style.position = 'absolute';
  img.style.objectFit = 'contain';
  img.style.pointerEvents = 'none';

  if (originalImgEl) {
    const rect = originalImgEl.getBoundingClientRect();
    img.style.left = rect.left + 'px';
    img.style.top = rect.top + 'px';
    img.style.width = rect.width + 'px';
    img.style.height = rect.height + 'px';
  } else {
    img.style.width = defaultW.endsWith('px') ? defaultW : (parseInt(defaultW, 10) + 'px');
    img.style.height = defaultH.endsWith('px') ? defaultH : (parseInt(defaultH, 10) + 'px');
    img.style.left = (isBoss ? window.innerWidth * 0.75 : window.innerWidth * 0.25) + 'px';
    img.style.top = (window.innerHeight * 0.18) + 'px';
  }

  // OBS: removi qualquer flip automático aqui; vc controla no DOM manualmente
  return img;
}

/* ----------------- animação simples ----------------- */
function animateTo(el, left, top, duration = 600) {
  return new Promise(res => {
    el.style.transition = `left ${duration}ms ease, top ${duration}ms ease, transform ${duration}ms ease, opacity ${Math.max(120, duration/2)}ms`;
    requestAnimationFrame(() => { el.style.left = left + 'px'; el.style.top = top + 'px'; });
    setTimeout(() => res(), duration + 20);
  });
}

function createPowerLabel(value, left, top) {
  const label = document.createElement('div');
  label.className = 'battle-power-label';
  label.textContent = value;
  label.style.position = 'absolute'; label.style.left = left + 'px'; label.style.top = top + 'px';
  label.style.transform = 'translate(-50%,-100%)'; label.style.color = '#ffd700';
  label.style.fontWeight = '700'; label.style.textShadow = '0 0 6px rgba(0,0,0,0.6)'; label.style.fontSize = '22px';
  document.getElementById('battle-overlay').appendChild(label);
  return label;
}
// --- helper para forçar tamanho/posição igual ao rect do clone ---
function sizeElementToRect(el, rect) {
  el.style.position = 'absolute';
  el.style.left = rect.left + 'px';
  el.style.top = rect.top + 'px';
  el.style.width = rect.width + 'px';
  el.style.height = rect.height + 'px';
  el.style.objectFit = 'contain';
  el.style.maxWidth = 'none';
  el.style.maxHeight = 'none';
  el.style.imageRendering = 'auto';
  el.style.pointerEvents = 'none';
}

// --- showCoinRow (necessário para UI de coins durante clash) ---
function showCoinRow(skill) {
  const cont = document.createElement('div');
  cont.style.display = 'flex'; cont.style.gap = '6px'; cont.style.alignItems = 'center';
  for (let i = 0; i < (skill.coins || 1); i++) {
    const slot = document.createElement('div'); slot.className = 'battle-coin';
    slot.style.width = '22px'; slot.style.height = '22px'; slot.style.borderRadius = '4px'; slot.style.display = 'flex';
    slot.style.alignItems = 'center'; slot.style.justifyContent = 'center';
    const img = document.createElement('img'); img.src = skill.coinImg || 'img/skill/coin.png'; img.style.width = '18px'; img.style.height = '18px'; img.style.objectFit = 'cover';
    slot.appendChild(img); cont.appendChild(slot);
  }
  return cont;
}

/* ----------------- fluxo principal de clash ----------------- */
async function startClashSequence() {
  if (!selectedCharacters.length) { alert('Nenhum personagem selecionado'); return; }
  if (!selectedCharacters.some(c => c.alive && c.chosenSkill)) { alert('Selecione as skills de todos os personagens vivos'); return; }

  skillsGrid.style.visibility = 'hidden';
  startTurnBtn.disabled = true; startTurnBtn.style.opacity = 0.5;
  skillsGrid.querySelectorAll('img').forEach(i => i.style.pointerEvents = 'none');

  const overlay = ensureBattleOverlay();
  const bossNode = enemyTeam.querySelector('.boss');
  if (!bossNode) { console.error('Boss não encontrado'); return; }
  bossNode.hp = typeof bossNode.hp === 'number' ? bossNode.hp : (bossData ? bossData.hp : BOSS_MAX_HP);

  let bossAttacksLeft = parseInt(bossNode.dataset.coinCount || '5', 10);

  // fila de alvos: todos os vivos que escolheram skill
  const targetQueue = selectedCharacters.map((c, i) => ({ char: c, idx: i })).filter(t => t.char.alive && t.char.chosenSkill);

  for (let t = 0; t < targetQueue.length && bossAttacksLeft > 0; t++) {
    const { char: playerChar, idx: playerIdx } = targetQueue[t];
    if (!playerChar || !playerChar.alive || !playerChar.chosenSkill) continue;

    const bossSkill = (bossNode.queuedSkills && bossNode.queuedSkills[0]) || Skill('b_def','img/skill/skill1.png',8,'boss',{coins:2});
    await performClashAgainstPlayer(playerIdx, bossSkill, overlay, bossNode);
    bossAttacksLeft--;
    if (bossNode.queuedSkills && bossNode.queuedSkills.length) bossNode.queuedSkills.shift();
    renderBossCoins();
    renderPlayerTeam();
    if (bossNode.hp <= 0) { alert('Boss derrotado!'); break; }
    await wait(350);
  }

  // ataques restantes do boss (sem clash) -> atingem aleatoriamente
  while (bossAttacksLeft > 0) {
    const alivePlayers = selectedCharacters.map((c, i) => ({ c, i })).filter(x => x.c.alive);
    if (!alivePlayers.length) break;
    const pick = alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
    const bossSkill = (bossNode.queuedSkills && bossNode.queuedSkills[0]) || Skill('b_def','img/skill/skill1.png',8,'boss',{coins:2});
    await bossDirectHit(pick.i, bossSkill, overlay, bossNode);
    bossAttacksLeft--;
    if (bossNode.queuedSkills && bossNode.queuedSkills.length) bossNode.queuedSkills.shift();
    renderBossCoins();
    renderPlayerTeam();
    if (bossNode.hp <= 0) { alert('Boss derrotado!'); break; }
    await wait(300);
  }

  overlay.remove();
  skillsGrid.querySelectorAll('img').forEach(i => i.style.pointerEvents = 'auto');
  startTurnBtn.disabled = false; startTurnBtn.style.opacity = 1;

  // reset escolhido dos vivos
  selectedCharacters.forEach(c => { if (c.alive) c.chosenSkill = null; });
  skillsGrid.style.visibility = 'visible';
  renderSkillsUI();
  renderPlayerTeam();
  renderBossCoins();
  updatePortraitOverlays();
}

/* ----------------- boss golpe direto (movimento -> desaparece -> winGif) ----------------- */
async function bossDirectHit(playerIdx, bossSkill, overlay, bossNode) {
  const playerChar = selectedCharacters[playerIdx];
  if (!playerChar || !playerChar.alive) return;

  // pega elementos originais para alinhamento
  const playerCells = Array.from(document.querySelectorAll('#player-team .character'));
  const origPlayerEl = playerCells[playerIdx] ? playerCells[playerIdx].querySelector('img') : null;
  const bossOrigImg = bossNode.querySelector('img');

  // clones posicionados sobre originais
  const pClone = createCloneFromChar(playerChar, false, origPlayerEl);
  const bClone = createCloneFromChar({ moveImg: bossNode.dataset.moveImg, sprite: bossOrigImg ? bossOrigImg.src : null }, true, bossOrigImg);

  // esconder originais
  if (origPlayerEl) origPlayerEl.style.visibility = 'hidden';
  if (bossOrigImg) bossOrigImg.style.visibility = 'hidden';

  overlay.appendChild(pClone); overlay.appendChild(bClone);

  // movimento até o centro
  const centerX = window.innerWidth / 2;
  const rootStyles = getComputedStyle(document.documentElement);
  const w = parseInt(rootStyles.getPropertyValue('--arena-sprite-w')) || 120;
  const pTargetLeft = centerX - (w + 90);
  const bTargetLeft = centerX + 60;
  const targetTop = window.innerHeight * 0.45 - (parseInt(rootStyles.getPropertyValue('--arena-sprite-h')) || 120)/2;

  await Promise.all([animateTo(pClone, pTargetLeft, targetTop, 420), animateTo(bClone, bTargetLeft, targetTop, 420)]);

  // ao chegar: remover clones e exibir winGif do boss centralizado sobre a área do boss
  if (bossSkill.winGif) {
    // posicao do boss clone antes de remover
    const rect = bClone.getBoundingClientRect();
    pClone.remove(); bClone.remove();

    const winEl = document.createElement('img'); winEl.src = bossSkill.winGif;
    sizeElementToRect(winEl, rect);
    winEl.style.zIndex = 10020;
    overlay.appendChild(winEl);
    setTimeout(() => winEl.remove(), 1000);
  } else {
    pClone.remove(); bClone.remove();
  }

  // aplica dano
  const dmg = bossSkill.damage || 0;
  playerChar.hp = Math.max(0, (playerChar.hp || 100) - dmg);
  if (playerChar.hp <= 0) { playerChar.alive = false; playerChar.chosenSkill = null; }

  // atualiza barra do jogador (px)
  const rootStyles2 = getComputedStyle(document.documentElement);
  const spriteWstr = rootStyles2.getPropertyValue('--arena-sprite-w').trim() || '120px';
  const spriteWpx = parseInt(spriteWstr, 10) || 120;
  const playerCellsNow = Array.from(document.querySelectorAll('#player-team .character'));
  const playerFill = playerCellsNow[playerIdx] ? playerCellsNow[playerIdx].querySelector('.health-fill') : null;
  if (playerFill) playerFill.style.width = Math.round((playerChar.hp/100)*spriteWpx) + 'px';

  await wait(700);

  if (origPlayerEl) origPlayerEl.style.visibility = playerChar.alive ? 'visible' : 'hidden';
  if (bossOrigImg) bossOrigImg.style.visibility = bossNode.hp > 0 ? 'visible' : 'hidden';
  updatePortraitOverlays();
}

/* ----------------- perform clash (movimento -> remover -> clashPNGs -> decidir -> winGif/hurt) ----------------- */
async function performClashAgainstPlayer(playerIdx, bossSkill, overlay, bossNode) {
  const playerChar = selectedCharacters[playerIdx];
  if (!playerChar || !playerChar.alive || !playerChar.chosenSkill) return;

  // originais para alinhamento
  const playerCells = Array.from(document.querySelectorAll('#player-team .character'));
  const origPlayerEl = playerCells[playerIdx] ? playerCells[playerIdx].querySelector('img') : null;
  const bossOrigImg = bossNode.querySelector('img');

  // ocultar originais
  if (origPlayerEl) origPlayerEl.style.visibility = 'hidden';
  if (bossOrigImg) bossOrigImg.style.visibility = 'hidden';

  // clones de movimento posicionados exatamente sobre os originais se possível
  const pClone = createCloneFromChar(playerChar, false, origPlayerEl);
  const bClone = createCloneFromChar({ moveImg: bossNode.dataset.moveImg, sprite: bossOrigImg ? bossOrigImg.src : null }, true, bossOrigImg);

  overlay.appendChild(pClone); overlay.appendChild(bClone);

  // mover para centro (fase de movimento)
  const centerX = window.innerWidth / 2;
  const rootStyles = getComputedStyle(document.documentElement);
  const w = parseInt(rootStyles.getPropertyValue('--arena-sprite-w')) || 120;
  const pTargetLeft = centerX - (w + 90);
  const bTargetLeft = centerX + 60;
  const targetTop = window.innerHeight * 0.45 - (parseInt(rootStyles.getPropertyValue('--arena-sprite-h')) || 120)/2;

  await Promise.all([animateTo(pClone, pTargetLeft, targetTop, 600), animateTo(bClone, bTargetLeft, targetTop, 600)]);

  // ao chegar: removemos os clones de movimento E substituimos por imagens de clash (PNG) que ocupam o MESMO rect
  const pRect = pClone.getBoundingClientRect();
  const bRect = bClone.getBoundingClientRect();

  // removemos clones de movimento (substituição visual)
  pClone.remove(); bClone.remove();

  // cria elementos clash (um para player, um para boss) - usar pngs aleatórios se existirem
  const playerSkill = playerChar.chosenSkill;
  const playerClashSrc = (playerSkill.clashPngs && playerSkill.clashPngs.length) ? playerSkill.clashPngs[Math.floor(Math.random()*playerSkill.clashPngs.length)] : null;
  const bossClashSrc = (bossSkill.clashPngs && bossSkill.clashPngs.length) ? bossSkill.clashPngs[Math.floor(Math.random()*bossSkill.clashPngs.length)] : null;

  const pClashEl = document.createElement('img');
  pClashEl.style.position = 'absolute';
  pClashEl.style.left = pRect.left + 'px';
  pClashEl.style.top = pRect.top + 'px';
  pClashEl.style.width = pRect.width + 'px';
  pClashEl.style.height = pRect.height + 'px';
  pClashEl.style.objectFit = 'contain';
  pClashEl.style.zIndex = 10015;
  if (playerClashSrc) pClashEl.src = playerClashSrc; else pClashEl.src = playerSkill.winGif || playerSkill.hurtPng || playerChar.moveImg || playerChar.sprite;
  overlay.appendChild(pClashEl);

  const bClashEl = document.createElement('img');
  bClashEl.style.position = 'absolute';
  bClashEl.style.left = bRect.left + 'px';
  bClashEl.style.top = bRect.top + 'px';
  bClashEl.style.width = bRect.width + 'px';
  bClashEl.style.height = bRect.height + 'px';
  bClashEl.style.objectFit = 'contain';
  bClashEl.style.zIndex = 10015;
  if (bossClashSrc) bClashEl.src = bossClashSrc; else bClashEl.src = bossSkill.winGif || bossSkill.hurtPng || bossNode.dataset.moveImg || (bossOrigImg ? bossOrigImg.src : '');
  overlay.appendChild(bClashEl);

  // mostrar linhas de coins e labels
  const playerLabel = createPowerLabel(playerSkill.basePower || playerSkill.damage || 0, pRect.left + pRect.width/2, pRect.top - 10);
  const bossLabel = createPowerLabel(bossSkill.basePower || bossSkill.damage || 0, bRect.left + bRect.width/2, bRect.top - 10);

  const centerRow = document.createElement('div');
  centerRow.style.position = 'absolute';
  centerRow.style.left = centerX + 'px';
  centerRow.style.top = (targetTop + 120) + 'px';
  centerRow.style.transform = 'translate(-50%,0)';
  centerRow.style.display = 'flex';
  centerRow.style.gap = '40px';
  overlay.appendChild(centerRow);

  const pCoinsRow = showCoinRow(playerSkill);
  const bCoinsRow = showCoinRow(bossSkill);
  centerRow.appendChild(pCoinsRow); centerRow.appendChild(bCoinsRow);

  // anima alguns ciclos visuais de clash (apenas efeitos)
  const cycles = 1 + Math.floor(Math.random()*2);
  for (let c = 0; c < cycles; c++) {
    // pequeno "pulse" de scale
    pClashEl.style.transform = 'scale(1.06)';
    bClashEl.style.transform = 'scale(1.06)';
    await wait(120);
    pClashEl.style.transform = 'scale(1)';
    bClashEl.style.transform = 'scale(1)';
    await wait(120);
  }

  // roll
  const pRoll = rollCoinsForSkill(playerSkill);
  const bRoll = rollCoinsForSkill(bossSkill);
  const finalPlayerPower = (playerSkill.basePower || playerSkill.damage || 0) + (pRoll.totalBonus || 0);
  const finalBossPower = (bossSkill.basePower || bossSkill.damage || 0) + (bRoll.totalBonus || 0);

  // animate coins visuals
  const pSlots = pCoinsRow.querySelectorAll('.battle-coin');
  for (let i = 0; i < pSlots.length; i++) { const s = pSlots[i]; if (i < pRoll.heads) s.classList.add('head'); s.style.transform='scale(1.06)'; setTimeout(()=>s.style.transform='scale(1)',180+i*40); }
  const bSlots = bCoinsRow.querySelectorAll('.battle-coin');
  for (let i = 0; i < bSlots.length; i++) { const s = bSlots[i]; if (i < bRoll.heads) s.classList.add('head'); s.style.transform='scale(1.06)'; setTimeout(()=>s.style.transform='scale(1)',180+i*40); }

  await wait(520);
  playerLabel.textContent = finalPlayerPower;
  bossLabel.textContent = finalBossPower;
  await wait(380);

  const winner = finalPlayerPower >= finalBossPower ? 'player' : 'boss';

  // remover clashPNGs e mostrar resultado: winGif do vencedor, hurt do perdedor
  // usamos os rects calculados para posicionar exatamente o resultado
  pClashEl.remove(); bClashEl.remove();

  if (winner === 'player') {
    // mostrar winGif do player sobre sua área
    if (playerSkill.winGif) {
      const win = document.createElement('img'); win.src = playerSkill.winGif;
      sizeElementToRect(win, pRect);
      win.style.zIndex = 10030;
      overlay.appendChild(win); setTimeout(()=>win.remove(), 1100);
    }
    // mostrar hurt no boss (se houver)
    if (bossSkill.hurtPng) {
      const hurt = document.createElement('img'); hurt.src = bossSkill.hurtPng;
      sizeElementToRect(hurt, bRect);
      hurt.style.zIndex = 10025;
      overlay.appendChild(hurt); setTimeout(()=>hurt.remove(), 1100);
    }
    // aplica dano fixo ao boss
    const dmg = playerSkill.damage || 0;
    bossNode.hp = Math.max(0, (bossNode.hp || BOSS_MAX_HP) - dmg);
    const bossFill = bossNode.querySelector('.health-fill');
    if (bossFill) {
      const rootStyles2 = getComputedStyle(document.documentElement);
      const bossWstr = rootStyles2.getPropertyValue('--boss-sprite-w').trim() || '120px';
      const bossWpx = parseInt(bossWstr, 10) || 120;
      bossFill.style.width = Math.round((bossNode.hp / BOSS_MAX_HP) * bossWpx) + 'px';
    }
  } else {
    // boss vence
    if (bossSkill.winGif) {
      const win = document.createElement('img'); win.src = bossSkill.winGif;
      sizeElementToRect(win, bRect);
      win.style.zIndex = 10030;
      overlay.appendChild(win); setTimeout(()=>win.remove(), 1100);
    }
    if (playerSkill.hurtPng) {
      const hurt = document.createElement('img'); hurt.src = playerSkill.hurtPng;
      sizeElementToRect(hurt, pRect);
      hurt.style.zIndex = 10025;
      overlay.appendChild(hurt); setTimeout(()=>hurt.remove(), 1100);
    }
    // aplica dano fixo no jogador
    const dmg = bossSkill.damage || 0;
    playerChar.hp = Math.max(0, (playerChar.hp || 100) - dmg);
    if (playerChar.hp <= 0) { playerChar.alive = false; playerChar.chosenSkill = null; }
    // atualizar barra do jogador (px)
    const rootSt = getComputedStyle(document.documentElement);
    const spriteWstr = rootSt.getPropertyValue('--arena-sprite-w').trim() || '120px';
    const spriteWpx = parseInt(spriteWstr, 10) || 120;
    const playerCellsNow = Array.from(document.querySelectorAll('#player-team .character'));
    const playerFill = playerCellsNow[playerIdx] ? playerCellsNow[playerIdx].querySelector('.health-fill') : null;
    if (playerFill) playerFill.style.width = Math.round((playerChar.hp/100)*spriteWpx) + 'px';
  }

  await wait(900);

  // restaurar originais
  if (origPlayerEl) origPlayerEl.style.visibility = playerChar.alive ? 'visible' : 'hidden';
  if (bossOrigImg) bossOrigImg.style.visibility = bossNode.hp > 0 ? 'visible' : 'hidden';

  // limpeza UI
  centerRow.remove();
  playerLabel.remove();
  bossLabel.remove();

  renderSkillsUI();
  updatePortraitOverlays();
}

/* ----------------- start turn handler ----------------- */
if (startTurnBtn) {
  startTurnBtn.addEventListener('click', () => {
    if (!selectedCharacters.length) { alert('Selecione personagens antes.'); return; }
    if (!selectedCharacters.some(c => c.alive && c.chosenSkill)) { alert('Selecione as skills de todos os personagens vivos.'); return; }
    startClashSequence().catch(console.error);
  });
}

/* ----------------- debug export ----------------- */
window._debug = {
  selectedCharacters, allCharacters,
  renderPlayerTeam, renderSkillsUI, renderBossCoins, updatePortraitOverlays,
  startClashSequence, bossData
};