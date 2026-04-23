window.addEventListener("DOMContentLoaded", () => {

  const API_URL = "/api/search";
  const BOT_URL = "https://t.me/otgmusicbot";

  const home = document.getElementById("homeScreen");
  const music = document.getElementById("musicScreen");
  const clips = document.getElementById("clipsScreen");
  const song = document.getElementById("songScreen");

  function show(screen) {
    [home, music, clips, song].forEach(s => s.classList.remove("active"));
    screen.classList.add("active");
  }

  // NAVIGATION
  openMusicBtn.onclick = () => show(music);
  openClipsBtn.onclick = () => show(clips);
  openSongBtn.onclick = () => show(song);
  openLiveBtn.onclick = () => window.open("https://tiktok.com", "_blank");

  backFromMusic.onclick = () => show(home);
  backFromClips.onclick = () => show(home);
  backFromSong.onclick = () => show(home);

  openMainBotBtn.onclick = () => window.open(BOT_URL);

  // MUSIC SEARCH
  musicSearchForm.onsubmit = async (e) => {
    e.preventDefault();

    musicStatus.innerText = "Ищем...";
    musicResults.innerHTML = "";

    const res = await fetch(API_URL + "?q=" + musicQuery.value);
    const data = await res.json();

    data.forEach(track => {
      const div = document.createElement("div");

      div.innerHTML = `
        <b>${track.title}</b><br>
        ${track.artist}<br>
        <audio controls src="${track.preview_url}"></audio>
      `;

      musicResults.appendChild(div);
    });

    musicStatus.innerText = "Готово";
  };

  // CLIPS
  clipsSearchForm.onsubmit = (e) => {
    e.preventDefault();

    const q = clipsQuery.value;

    clipsResults.innerHTML = `
      <button onclick="window.open('https://www.youtube.com/results?search_query=${q} official music video')">
        🎬 Официальный клип
      </button>

      <button onclick="window.open('https://www.youtube.com/results?search_query=${q} live')">
        🔴 Live
      </button>

      <button onclick="window.open('https://www.youtube.com/results?search_query=${q} lyrics')">
        📝 Lyrics
      </button>
    `;

    clipsStatus.innerText = "Готово";
  };

});
