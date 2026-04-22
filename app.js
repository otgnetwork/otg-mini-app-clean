const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();
}

const API_URL = "https://telegram-music-bot-production-6e89.up.railway.app/search"; // ⚠️ заменим ниже

const MAIN_BOT_URL = "https://t.me/otgmusicbot";
const TIKTOK_URL = "https://www.tiktok.com/@alexey_pv_";

const homeScreen = document.getElementById("homeScreen");
const musicScreen = document.getElementById("musicScreen");
const clipsScreen = document.getElementById("clipsScreen");
const songScreen = document.getElementById("songScreen");

const openMusicBtn = document.getElementById("openMusicBtn");
const openClipsBtn = document.getElementById("openClipsBtn");
const openSongBtn = document.getElementById("openSongBtn");
const openLiveBtn = document.getElementById("openLiveBtn");

const backFromMusic = document.getElementById("backFromMusic");
const backFromClips = document.getElementById("backFromClips");
const backFromSong = document.getElementById("backFromSong");

const openMainBotBtn = document.getElementById("openMainBotBtn");

const musicSearchForm = document.getElementById("musicSearchForm");
const musicQuery = document.getElementById("musicQuery");
const musicStatus = document.getElementById("musicStatus");
const musicResults = document.getElementById("musicResults");

function showScreen(screen) {
  [homeScreen, musicScreen, clipsScreen, songScreen].forEach((item) => {
    item.classList.remove("active");
  });
  screen.classList.add("active");
}

function openTelegramLink(url) {
  if (tg && tg.openTelegramLink) {
    tg.openTelegramLink(url);
  } else {
    window.open(url, "_blank");
  }
}

function openExternal(url) {
  if (tg && tg.openLink) {
    tg.openLink(url);
  } else {
    window.open(url, "_blank");
  }
}

openMusicBtn.onclick = () => showScreen(musicScreen);
openClipsBtn.onclick = () => showScreen(clipsScreen);
openSongBtn.onclick = () => showScreen(songScreen);
openLiveBtn.onclick = () => openExternal(TIKTOK_URL);

backFromMusic.onclick = () => showScreen(homeScreen);
backFromClips.onclick = () => showScreen(homeScreen);
backFromSong.onclick = () => showScreen(homeScreen);

openMainBotBtn.onclick = () => openTelegramLink(MAIN_BOT_URL);

musicSearchForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const query = musicQuery.value.trim();
  if (!query) return;

  musicStatus.textContent = "Ищем...";
  musicResults.innerHTML = "";

  try {
    const res = await fetch(API_URL + "?q=" + encodeURIComponent(query));
    const data = await res.json();

    if (!data.length) {
      musicStatus.textContent = "Ничего не найдено";
      return;
    }

    musicStatus.textContent = "Результаты:";

    data.forEach(track => {
      const el = document.createElement("div");
      el.style.padding = "12px";
      el.style.border = "1px solid rgba(255,255,255,0.1)";
      el.style.borderRadius = "12px";
      el.style.marginBottom = "10px";

      el.innerHTML = `
        <strong>${track.title}</strong><br>
        ${track.artist}<br>
        <audio controls src="${track.preview}"></audio>
      `;

      musicResults.appendChild(el);
    });

  } catch (err) {
    musicStatus.textContent = "Ошибка подключения к серверу";
  }
});
