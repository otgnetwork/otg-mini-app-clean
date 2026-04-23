window.addEventListener("DOMContentLoaded", () => {
  const tg = window.Telegram?.WebApp;

  if (tg) {
    tg.ready();
    tg.expand();
  }

  const API_URL = "/api/search";

  const musicSearchForm = document.getElementById("musicSearchForm");
  const musicQuery = document.getElementById("musicQuery");
  const musicStatus = document.getElementById("musicStatus");
  const musicResults = document.getElementById("musicResults");

  let tracks = [];
  let currentIndex = -1;
  const audio = new Audio();

  // 🎧 глобальный плеер
  const player = document.createElement("div");
  player.style.position = "fixed";
  player.style.bottom = "0";
  player.style.left = "0";
  player.style.right = "0";
  player.style.background = "#0f172a";
  player.style.padding = "12px";
  player.style.display = "none";
  player.style.justifyContent = "space-between";
  player.style.alignItems = "center";
  player.style.zIndex = "999";

  player.innerHTML = `
    <div id="trackInfo">Ничего не играет</div>
    <div>
      <button id="prev">⏮️</button>
      <button id="play">▶️</button>
      <button id="next">⏭️</button>
    </div>
  `;

  document.body.appendChild(player);
  document.body.style.paddingBottom = "80px";

  const trackInfo = document.getElementById("trackInfo");
  const playBtn = document.getElementById("play");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  function updatePlayer() {
    if (currentIndex < 0) return;
    const t = tracks[currentIndex];
    trackInfo.innerText = `${t.title} — ${t.artist}`;
    playBtn.innerText = audio.paused ? "▶️" : "⏸️";
    player.style.display = "flex";
  }

  function playTrack(i) {
    currentIndex = i;
    audio.src = tracks[i].preview_url;
    audio.play();
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
    if (audio.paused) audio.play();
    else audio.pause();
    updatePlayer();
  };

  nextBtn.onclick = nextTrack;
  prevBtn.onclick = prevTrack;

  audio.onended = nextTrack;

  async function search(q) {
    musicStatus.innerText = "Ищем...";
    musicResults.innerHTML = "";

    try {
      const res = await fetch(API_URL + "?q=" + encodeURIComponent(q));
      const data = await res.json();

      tracks = data;

      if (!data.length) {
        musicStatus.innerText = "Ничего не найдено";
        return;
      }

      musicStatus.innerText = `Найдено: ${data.length}`;

      data.forEach((t, i) => {
        const el = document.createElement("div");
        el.style.padding = "15px";
        el.style.margin = "10px 0";
        el.style.background = "#1e293b";
        el.style.borderRadius = "12px";
        el.style.cursor = "pointer";

        el.innerHTML = `
          <div style="font-weight:bold">${t.title}</div>
          <div style="opacity:0.7">${t.artist}</div>
        `;

        el.onclick = () => playTrack(i);
        musicResults.appendChild(el);
      });

    } catch (e) {
      console.error(e);
      musicStatus.innerText = "Ошибка подключения";
    }
  }

  musicSearchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    search(musicQuery.value);
  });

  console.log("OTG player loaded");
});
