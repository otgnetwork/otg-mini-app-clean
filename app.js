const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();
}

const API_URL = "https://telegram-music-bot-production-6e89.up.railway.app/search";
const MAIN_BOT_URL = "https://t.me/otgmusicbot";
const TIKTOK_URL = "https://www.tiktok.com/@alexey_pv_/";

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

const tagButtons = document.querySelectorAll(".tag-btn");

function showScreen(screen) {
  [homeScreen, musicScreen, clipsScreen, songScreen].forEach((item) => {
    if (item) item.classList.remove("active");
  });
  if (screen) screen.classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openTelegramLink(url) {
  if (tg && typeof tg.openTelegramLink === "function") {
    tg.openTelegramLink(url);
    return;
  }
  window.open(url, "_blank");
}

function openExternal(url) {
  if (tg && typeof tg.openLink === "function") {
    tg.openLink(url);
    return;
  }
  window.open(url, "_blank");
}

function renderTracks(tracks) {
  musicResults.innerHTML = "";

  tracks.forEach((track) => {
    const card = document.createElement("div");
    card.className = "placeholder-card";
    card.style.textAlign = "left";

    card.innerHTML = `
      <h3 style="margin-bottom:8px;">${track.title}</h3>
      <p style="margin-bottom:14px;">${track.artist}</p>
      <audio controls preload="none" style="width:100%;">
        <source src="${track.preview_url}" type="audio/mpeg" />
      </audio>
    `;

    musicResults.appendChild(card);
  });
}

async function runMusicSearch(query) {
  const cleanQuery = query.trim();

  if (!cleanQuery) {
    musicStatus.textContent = "Введи трек или исполнителя.";
    musicResults.innerHTML = "";
    return;
  }

  musicStatus.textContent = "Ищем...";
  musicResults.innerHTML = "";

  try {
    const res = await fetch(`${API_URL}?q=${encodeURIComponent(cleanQuery)}`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      musicStatus.textContent = "Ничего не найдено.";
      return;
    }

    musicStatus.textContent = `Найдено: ${data.length}`;
    renderTracks(data);
  } catch (err) {
    console.error(err);
    musicStatus.textContent = "Ошибка подключения к серверу";
  }
}

if (openMusicBtn) {
  openMusicBtn.addEventListener("click", () => {
    showScreen(musicScreen);
  });
}

if (openClipsBtn) {
  openClipsBtn.addEventListener("click", () => {
    showScreen(clipsScreen);
  });
}

if (openSongBtn) {
  openSongBtn.addEventListener("click", () => {
    showScreen(songScreen);
  });
}

if (openLiveBtn) {
  openLiveBtn.addEventListener("click", () => {
    openExternal(TIKTOK_URL);
  });
}

if (backFromMusic) {
  backFromMusic.addEventListener("click", () => showScreen(homeScreen));
}

if (backFromClips) {
  backFromClips.addEventListener("click", () => showScreen(homeScreen));
}

if (backFromSong) {
  backFromSong.addEventListener("click", () => showScreen(homeScreen));
}

if (openMainBotBtn) {
  openMainBotBtn.addEventListener("click", () => {
    openTelegramLink(MAIN_BOT_URL);
  });
}

if (musicSearchForm) {
  musicSearchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    await runMusicSearch(musicQuery.value);
  });
}

if (tagButtons.length) {
  tagButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const query = button.dataset.query || "";
      musicQuery.value = query;
      await runMusicSearch(query);
    });
  });
}
