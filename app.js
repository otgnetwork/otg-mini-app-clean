const API_URL = "https://telegram-music-bot-production-6e89.up.railway.app/search";

async function searchMusic() {
    const query = document.getElementById("searchInput").value;
    const resultsDiv = document.getElementById("results");

    resultsDiv.innerHTML = "Загрузка...";

    try {
        const res = await fetch(API_URL + "?q=" + encodeURIComponent(query));
        const data = await res.json();

        if (!data.length) {
            resultsDiv.innerHTML = "Ничего не найдено";
            return;
        }

        resultsDiv.innerHTML = "";

        data.forEach(track => {
            const el = document.createElement("div");
            el.style.marginBottom = "15px";

            el.innerHTML = `
                <b>${track.title}</b><br>
                ${track.artist}<br>
                <audio controls src="${track.preview_url}"></audio>
            `;

            resultsDiv.appendChild(el);
        });

    } catch (err) {
        console.error(err);
        resultsDiv.innerHTML = "Ошибка подключения к серверу";
    }
}

document.getElementById("searchBtn").onclick = searchMusic;
