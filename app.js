window.addEventListener("DOMContentLoaded", () => {
  const tg = window.Telegram?.WebApp;

  try {
    if (tg) {
      tg.ready();
      tg.expand();
    }
  } catch (e) {
    console.error("Telegram WebApp init error:", e);
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
    try {
      if (tg && typeof tg.openTelegramLink === "function") {
        tg.openTelegramLink(url);
        return;
      }
    } catch (e) {
      console.error("openTelegramLink error:", e);
    }
    window.open(url, "_blank");
  }

  function openExternal(url) {
    try {
      if (tg && typeof tg.openLink === "function") {
        tg.openLink(url);
        return;
      }
    } catch (e) {
      console.error("openExternal error:", e);
    }
    window.open(url, "_blank");
  }

  function renderTracks(tracks) {
    musicResults.innerHTML = "";

    tracks.forEach((track) => {
      const card = document.createElement("div");
      card.className = "result-card";

      card.innerHTML = `
        <h3>${track.title || "Без названия"}</h3>
        <p>${track.artist || "Без исполнителя"}</p>
        ${
          track.preview_url
            ? `<audio controls preload="none">
                 <source src="${track.preview_url}" type="audio/mpeg" />
               </audio>`
            : `<p>Превью недоступно</p>`
        }
      `;

      musicResults.appendChild(card);
    });
  }

  async function runMusicSearch(query) {
    const cleanQuery = String(query || "").trim();

    if (!cleanQuery) {
      musicStatus.textContent = "Введи трек или исполнителя.";
      musicResults.innerHTML = "";
      return;
    }

    musicStatus.textContent = "Ищем...";
    musicResults.innerHTML = "";

    try {
      const url = `${API_URL}?q=${encodeURIComponent(cleanQuery)}`;
      console.log("Searching:", url);

      const res = await fetch(url, { method: "GET" });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      console.log("Search response:", data);

      if (!Array.isArray(data) || data.length === 0) {
        musicStatus.textContent = "Ничего не найдено.";
        return;
      }

      musicStatus.textContent = `Найдено: ${data.length}`;
      renderTracks(data);
    } catch (err) {
      console.error("Search error:", err);
      musicStatus.textContent = "Ошибка подключения к серверу";
    }
  }

  if (openMusicBtn) {
    openMusicBtn.addEventListener("click", () => {
      console.log("Open music screen");
      showScreen(musicScreen);
    });
  }

  if (openClipsBtn) {
    openClipsBtn.addEventListener("click", () => {
      console.log("Open clips screen");
      showScreen(clipsScreen);
    });
  }

  if (openSongBtn) {
    openSongBtn.addEventListener("click", () => {
      console.log("Open song screen");
      showScreen(songScreen);
    });
  }

  if (openLiveBtn) {
    openLiveBtn.addEventListener("click", () => {
      console.log("Open live link");
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
      await runMusicSearch(musicQuery ? musicQuery.value : "");
    });
  }

  tagButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const query = button.dataset.query || "";
      if (musicQuery) musicQuery.value = query;
      await runMusicSearch(query);
    });
  });

  console.log("OTG mini app initialized");
});
