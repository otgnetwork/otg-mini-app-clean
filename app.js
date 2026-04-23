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

  const API_URL = "/api/search";
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

  const clipsSearchForm = document.getElementById("clipsSearchForm");
  const clipsQuery = document.getElementById("clipsQuery");
  const clipsStatus = document.getElementById("clipsStatus");
  const clipsResults = document.getElementById("clipsResults");
  const clipTagButtons = document.querySelectorAll(".clip-tag-btn");

  let tracks = [];
  let currentIndex = -1;
  const audio = new Audio();

  const player = document.createElement("div");
  player.id = "globalPlayer";
  player.style.position = "fixed";
  player.style.left = "0";
  player.style.right = "0";
  player.style.bottom = "0";
  player.style.background = "rgba(15, 23, 42, 0.96)";
  player.style.backdropFilter = "blur(10px)";
  player.style.padding = "12px 14px";
  player.style.display = "none";
  player.style.justifyContent = "space-between";
  player.style.alignItems = "center";
  player.style.gap = "12px";
  player.style.zIndex = "9999";
  player.style.borderTop = "1px solid rgba(255,255,255,0.08)";
  player.innerHTML = `
    <div style="min-width:0; flex:1;">
      <div id="trackInfo" style="font-weight:800; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">Ничего не играет</div>
    </div>
    <div style="display:flex; gap:8px;">
      <button id="prev" type="button" style="border:none; border-radius:12px; padding:10px 12px; background:#1e293b; color:#fff; cursor:pointer;">⏮️</button>
      <button id="play" type="button" style="border:none; border-radius:12px; padding:10px 12px; background:#2563eb; color:#fff; cursor:pointer;">▶️</button>
      <button id="next" type="button" style="border:none; border-radius:12px; padding:10px 12px; background:#1e293b; color:#fff; cursor:pointer;">⏭️</button>
    </div>
  `;
  document.body.appendChild(player);
  document.body.style.paddingBottom = "90px";

  const trackInfo = document.getElementById("trackInfo");
  const playBtn = document.getElementById("play");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

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

  function youtubeSearchUrl(query) {
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  }

  function updatePlayer() {
    if (currentIndex < 0 || !tracks[currentIndex]) return;
    const t = tracks[currentIndex];
    trackInfo.innerText = `${t.title} — ${t.artist}`;
    playBtn.innerText = audio.paused ? "▶️" : "⏸️";
    player.style.display = "flex";
  }

  function playTrack(i) {
    if (!tracks[i] || !tracks[i].preview_url) return;
    currentIndex = i;
    audio.src = tracks[i].preview_url;
    audio.play().catch(console.error);
    updatePlayer();
  }

  function nextTrack() {
    if (!tracks.length) return;
    playTrack((currentIndex + 1) % tracks.length);
  }

  function prevTrack() {
    if (!tracks.length) return;
    playTrack((currentIndex - 1 + tracks.length) % tracks.length);
  }

  playBtn.onclick = () => {
    if (currentIndex < 0) return;
    if (audio.paused) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
    updatePlayer();
  };

  nextBtn.onclick = nextTrack;
  prevBtn.onclick = prevTrack;
  audio.onended = nextTrack;

  function renderTracks(data) {
    musicResults.innerHTML = "";

    data.forEach((t, i) => {
      const el = document.createElement("div");
      el.className = "result-card";
      el.style.cursor = "pointer";

      el.innerHTML = `
        <h3>${t.title || "Без названия"}</h3>
        <p>${t.artist || "Без исполнителя"}</p>
        <div style="display:flex; gap:10px;">
          <button type="button" style="border:none; border-radius:14px; padding:10px 14px; background:linear-gradient(135deg,#1ecbff 0%,#4c78ff 42%,#7a4dff 74%,#b316ff 100%); color:#fff; cursor:pointer; font-weight:800;">
            ▶️ Слушать
          </button>
        </div>
      `;

      el.addEventListener("click", () => playTrack(i));
      el.querySelector("button").addEventListener("click", (e) => {
        e.stopPropagation();
        playTrack(i);
      });

      musicResults.appendChild(el);
    });
  }

  function renderClipLinks(query) {
    clipsResults.innerHTML = "";

    const variants = [
      {
        title: "🎬 Официальный клип",
        desc: "Открыть поиск официального клипа на YouTube",
        url: youtubeSearchUrl(`${query} official music video`)
      },
      {
        title: "🔴 Live / концерт",
        desc: "Открыть live-выступления на YouTube",
        url: youtubeSearchUrl(`${query} live`)
      },
      {
        title: "📝 Lyrics / Visualizer",
        desc: "Открыть lyric video или visualizer",
        url: youtubeSearchUrl(`${query} lyrics`)
      }
    ];

    variants.forEach((item) => {
      const el = document.createElement("div");
      el.className = "result-card";

      el.innerHTML = `
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
        <div style="display:flex; gap:10px;">
          <button type="button" style="border:none; border-radius:14px; padding:10px 14px; background:linear-gradient(135deg,#1ecbff 0%,#4c78ff 42%,#7a4dff 74%,#b316ff 100%); color:#fff; cursor:pointer; font-weight:800;">
            Открыть YouTube
          </button>
        </div>
      `;

      el.querySelector("button").addEventListener("click", () => {
        openExternal(item.url);
      });

      clipsResults.appendChild(el);
    });
  }

  async function searchMusic(q) {
    const query = String(q || "").trim();

    if (!query) {
      musicStatus.innerText = "Введите трек или исполнителя.";
      musicResults.innerHTML = "";
      return;
    }

    musicStatus.innerText = "Ищем...";
    musicResults.innerHTML = "";

    try {
      const res = await fetch(API_URL + "?q=" + encodeURIComponent(query));
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      tracks = Array.isArray(data) ? data : [];

      if (!tracks.length) {
        musicStatus.innerText = "Ничего не найдено";
        return;
      }

      musicStatus.innerText = `Найдено: ${tracks.length}`;
      renderTracks(tracks);
    } catch (e) {
      console.error(e);
      musicStatus.innerText = "Ошибка подключения";
    }
  }

  function searchClips(q) {
    const query = String(q || "").trim();

    if (!query) {
      clipsStatus.innerText = "Введите трек или исполнителя.";
      clipsResults.innerHTML = "";
      return;
    }

    clipsStatus.innerText = `Готово: ${query}`;
    renderClipLinks(query);
  }

  openMusicBtn?.addEventListener("click", () => showScreen(musicScreen));
  openClipsBtn?.addEventListener("click", () => showScreen(clipsScreen));
  openSongBtn?.addEventListener("click", () => showScreen(songScreen));
  openLiveBtn?.addEventListener("click", () => openExternal(TIKTOK_URL));

  backFromMusic?.addEventListener("click", () => showScreen(homeScreen));
  backFromClips?.addEventListener("click", () => showScreen(homeScreen));
  backFromSong?.addEventListener("click", () => showScreen(homeScreen));

  openMainBotBtn?.addEventListener("click", () => openTelegramLink(MAIN_BOT_URL));

  musicSearchForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    searchMusic(musicQuery.value);
  });

  clipsSearchForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    searchClips(clipsQuery.value);
  });

  tagButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const query = button.dataset.query || "";
      musicQuery.value = query;
      searchMusic(query);
    });
  });

  clipTagButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const query = button.dataset.query || "";
      clipsQuery.value = query;
      searchClips(query);
    });
  });

  console.log("OTG mini app loaded");
});
