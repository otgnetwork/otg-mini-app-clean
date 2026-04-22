const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();
}

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
const tagButtons = document.querySelectorAll(".tag-btn");
const musicQuery = document.getElementById("musicQuery");
const musicStatus = document.getElementById("musicStatus");

function showScreen(screen) {
  [homeScreen, musicScreen, clipsScreen, songScreen].forEach((item) => {
    item.classList.remove("active");
  });
  screen.classList.add("active");
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

openMusicBtn.addEventListener("click", () => {
  showScreen(musicScreen);
  musicStatus.textContent = "Скоро здесь будет живой поиск музыки.";
});

openClipsBtn.addEventListener("click", () => {
  showScreen(clipsScreen);
});

openSongBtn.addEventListener("click", () => {
  showScreen(songScreen);
});

openLiveBtn.addEventListener("click", () => {
  openExternal(TIKTOK_URL);
});

backFromMusic.addEventListener("click", () => showScreen(homeScreen));
backFromClips.addEventListener("click", () => showScreen(homeScreen));
backFromSong.addEventListener("click", () => showScreen(homeScreen));

openMainBotBtn.addEventListener("click", () => {
  openTelegramLink(MAIN_BOT_URL);
});

tagButtons.forEach((button) => {
  button.addEventListener("click", () => {
    musicQuery.value = button.dataset.query || "";
    musicStatus.textContent = `Запрос "${musicQuery.value}" готов. Следующим шагом подключим живой поиск.`;
  });
});
