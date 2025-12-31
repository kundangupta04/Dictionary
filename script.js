const input = document.getElementById("wordInput");
const button = document.getElementById("searchBtn");
const resultBox = document.getElementById("result");

async function searchWord() {
    const word = input.value.trim();

    // empty check
    if (!word) {
        alert("Please enter a word first.");
        return;
    }

    // multiple words check
    if (word.includes(" ")) {
        resultBox.classList.remove("hidden");
        resultBox.innerHTML = ` <p class="error">Please enter only one word at a time.</p> `;
        return;
    }


    try {
        const res = await fetch(
            `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
        );

        if (!res.ok) {
            resultBox.classList.remove("hidden");
            resultBox.innerHTML =
                `<p class="error">Word not found. Please try another word.</p>`;
            return;
        }

        const data = await res.json();
        const entry = data[0];

        const phonetic =
            entry.phonetic ||
            (entry.phonetics[0] && entry.phonetics[0].text) ||
            "Not available";

        const audio =
            entry.phonetics.find(p => p.audio)?.audio || null;

        const meaning = entry.meanings[0]?.definitions[0]?.definition || "Not available";

        const example =
            entry.meanings[0]?.definitions[0]?.example ||
            "Example not available";

        const partOfSpeech =
            entry.meanings[0]?.partOfSpeech || "Not specified";

        resultBox.classList.remove("hidden");

        resultBox.innerHTML = `
      <h2>${entry.word}</h2>
      <div class="meta">${partOfSpeech} • ${phonetic}</div>

      <p class="section-title">MEANING</p>
      <div class="meaning-box">${meaning}</div>

      <p class="section-title">EXAMPLE</p>
      <div class="example-box">${example}</div>

      <p class="section-title">PRONUNCIATION</p>
      <div class="pronunciation-box">
        ${phonetic}
        ${audio
                ? `<button class="audio-btn" onclick="playAudio('${audio}')">Play Audio</button>`
                : `<p style="margin-top:8px">Audio not available</p>`
            }
      </div>
    `;
    } catch (err) {
        resultBox.classList.remove("hidden");
        resultBox.innerHTML =
            `<p class="error">Something went wrong. Try again.</p>`;
    }
}

function playAudio(src) {
    const audio = new Audio(src);
    audio.play();
}

button.addEventListener("click", searchWord);
input.addEventListener("keydown", e => {
    if (e.key === "Enter") searchWord();
});


const logo = document.querySelector(".logo");

logo.addEventListener("click", () => {
  // Reloads the page
  window.location.reload();
});
