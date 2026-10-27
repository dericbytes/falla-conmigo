
"use strict";

const DB_URL = "./music.db";
const WASM_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/";

const audio = document.getElementById("audio");
// const volume = document.getElementById('volume');
// const volumeValue = document.getElementById('volume-value');
const startAButton = document.getElementById('markA');
const startBButton = document.getElementById('markB');
const nextButton = document.getElementById('next');
const previousButton = document.getElementById('previous');
const $ = id => document.getElementById(id);

let tracks = [];
let activeTrack = -1;

let A = null;
let B = null;
let looping = false;
let repeating = false;
let completed = 0;
let targetRepeats = 3;

function timeText(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "00:00";
  }

  const s = Math.floor(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;

  return h
       ? `${h}:${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`
       : `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

function setStatus(message) {
  $("status").textContent = message;
}

function setPracticeStatus(message) {
  $("practiceStatus").textContent = message;
}

// Load the SQLite database using SQL.js.
async function loadPlaylist() {
  try {
    if (typeof initSqlJs !== "function") {
      throw new Error("SQL.js failed to load.");
    }

    const SQL = await initSqlJs({
      locateFile: file => WASM_URL + file
    });

    const response = await fetch(DB_URL);

    if (!response.ok) {
      throw new Error(
        `Cannot load ${DB_URL}: HTTP ${response.status}`
      );
    }

    const buffer = await response.arrayBuffer();
    const db = new SQL.Database(new Uint8Array(buffer));

    // Change this query if your table or column names differ.
    const results = db.exec(`
      SELECT title, artist, genre, duration, audio_url
      FROM tracks
    `);

    if (!results.length) {
      throw new Error("The SQL query returned no results.");
    }

    const data = results[0];

    // Same row structure as requested:
    // [title, artist, genre, duration, audio_url]
    data.values.forEach(row => {
      const [title, artist, genre, duration, audio_url] = row;

      tracks.push({
        title,
        artist,
        genre,
        duration,
        audio_url
      });
    });

    db.close();

    renderPlaylist();

    setStatus(`Loaded ${tracks.length} tracks.`);

    if (tracks.length) {
      selectTrack(0);
    } else {
      setStatus("The playlist is empty.");
    }
  } catch (error) {
    console.error(error);
    setStatus(`Playlist error: ${error.message}`);
  }
}

function renderPlaylist() {
  const list = $("playlist");
  list.replaceChildren();

  tracks.forEach((track, index) => {
    const button = document.createElement("button");
    button.className = "track";
    button.type = "button";

    const title = document.createElement("div");
    title.className = "track-title";
    title.textContent = track.title ?? "Untitled";

    const info = document.createElement("div");
    info.className = "track-info";

    const details = [
      track.artist,
      track.genre,
      track.duration
    ].filter(value => value !== null && value !== undefined && value !== "");

    info.textContent = details.join(" · ");

    button.append(title, info);
    button.addEventListener("click", () => selectTrack(index));


    // volume.addEventListener('input', () => {
    //   audio.volume = Number(volume.value);
    //   volumeValue.textContent =
    //     `${Math.round(audio.volume * 100)}%`;
    // });
    // 

    // startAButton.addEventListener('click', () => {
    //   startAButton.classList.add('active');
    // });
    // 
    // startBButton.addEventListener('click', () => {
    //   startBButton.classList.add('active');
    // });
    // 
    list.appendChild(button);
  });

  updateActiveTrack();
}

function updateActiveTrack() {
  [...$("playlist").children].forEach((button, index) => {
    button.classList.toggle("active", index === activeTrack);
  });
}

function selectNextTrack() {
  selectTrack(activeTrack + 1);
}

function selectPreviousTrack() {
  selectTrack(activeTrack - 1);
}

function selectTrack(index) {
  const track = tracks[index];
  if (!track) return;

  activeTrack = index;
  stopRepeating();
  looping = false;
  A = B = null;

  $("loop").textContent = "Loop: OFF";
  $("marks").textContent = "A: — | B: —";
  setPracticeStatus("");

  audio.pause();

  // audio_url may be a relative URL or an absolute URL.
  // Use the value stored in the database.
  audio.src = track.audio_url;
  audio.load();

  $("nowPlaying").textContent = track.title ?? "Untitled";

  $("trackInfo").textContent =
    [track.artist, track.genre].filter(Boolean).join(" · ");

  updateActiveTrack();
  updatePlayer();
}

function seekTo(seconds) {
  if (!Number.isFinite(audio.duration)) return;

  audio.currentTime = Math.max(
    0,
    Math.min(seconds, audio.duration)
  );
}

function updatePlayer() {
  $("current").textContent = timeText(audio.currentTime);
  $("duration").textContent = timeText(audio.duration);

  if (Number.isFinite(audio.duration) && audio.duration > 0) {
    $("seek").value =
      (audio.currentTime / audio.duration) * 1000;
  }
}

function updateMarks() {
  $("marks").textContent =
    `A: ${A === null ? "—" : timeText(A)} | ` +
    `B: ${B === null ? "—" : timeText(B)}`;
}

async function togglePlay() {
  if (audio.paused) {
    try {
      await audio.play();
    } catch (error) {
      setPracticeStatus(`Cannot play audio: ${error.message}`);
    }
  } else {
    audio.pause();
  }
}

$("play").addEventListener("click", togglePlay);

$("back").addEventListener("click", () => {
  seekTo(audio.currentTime - 5);
});

$("forward").addEventListener("click", () => {
  seekTo(audio.currentTime + 5);
});

nextButton.addEventListener("next", () => selectNextTrack());
previousButton.addEventListener("previous", () => selectPreviousTrack());


$("replay").addEventListener("click", () => {
  seekTo(audio.currentTime - 5);
});

$("seek").addEventListener("input", () => {
  if (Number.isFinite(audio.duration)) {
    seekTo(Number($("seek").value) / 1000 * audio.duration);
  }
});

$("speed").addEventListener("change", () => {
  audio.playbackRate = Number($("speed").value);
});

function setClassActive(obj, active) {
  if (active)  {
    obj.classList.add('active')
  } else {
    obj.classList.remove('active')
  }
}

startAButton.addEventListener("click", () => {
  A = audio.currentTime;

  if (B !== null && B <= A) B = null;
  setClassActive(startAButton, A);
  updateMarks();
});

startBButton.addEventListener("click", () => {
  if (A === null || audio.currentTime <= A) {
    B = null;
    setPracticeStatus("Set start A before setting end B.");
  } else {
    B = audio.currentTime;
    setPracticeStatus("");
  }
  setClassActive(startBButton, B);
  updateMarks();
  
});

$("loop").addEventListener("click", () => {
  if (A === null || B === null || B <= A) {
    setPracticeStatus("Set valid start A and end B first.");
    return;
  }

  looping = !looping;
  $("loop").textContent = `Loop: ${looping ? "ON" : "OFF"}`;
});

function stopRepeating() {
  repeating = false;
  $("repeat").textContent = "Repeat section";
}

$("repeat").addEventListener("click", async () => {
  if (repeating) {
    stopRepeating();
    setPracticeStatus("Repetition stopped.");
    return;
  }

  if (A === null || B === null || B <= A) {
    setPracticeStatus("Set valid start A and end B first.");
    return;
  }

  repeating = true;
  completed = 0;
  targetRepeats = Number($("repeats").value);

  $("repeat").textContent = "Stop repeating";
  seekTo(A);

  try {
    await audio.play();
    setPracticeStatus("Practise shadowing the selected section.");
  } catch (error) {
    stopRepeating();
    setPracticeStatus(`Cannot play audio: ${error.message}`);
  }
});

audio.addEventListener("timeupdate", () => {
  updatePlayer();

  if (A === null || B === null) return;

  if (repeating && audio.currentTime >= B) {
    completed++;

    if (targetRepeats !== 0 && completed >= targetRepeats) {
      stopRepeating();
      audio.pause();
      seekTo(B);
      setPracticeStatus(`Finished ${completed} repetitions.`);
    } else {
      seekTo(A);
      setPracticeStatus(
        `Repetition ${completed + 1}` +
           (targetRepeats === 0 ? "" : ` of ${targetRepeats}`)
      );
    }
  } else if (looping && !repeating && audio.currentTime >= B) {
    seekTo(A);
  }
});

audio.addEventListener("loadedmetadata", updatePlayer);
audio.addEventListener("durationchange", updatePlayer);

audio.addEventListener("ended", () => {
  if (repeating) stopRepeating();
});

$("clear").addEventListener("click", () => {
  A = B = null;
  looping = false;
  stopRepeating();

  $("loop").textContent = "Loop: OFF";
  updateMarks();
  setPracticeStatus("");
});

// Keyboard shortcuts. Ignore keys used inside form controls.
document.addEventListener("keydown", event => {
  if (event.target.matches("input, select, textarea")) return;
  if (event.ctrlKey || event.altKey || event.metaKey) return;

  switch (event.key) {
    case " ":
      event.preventDefault();
      togglePlay();
      break;

    case "ArrowLeft":
      event.preventDefault();
      seekTo(audio.currentTime - 5);
      break;

    case "ArrowRight":
      event.preventDefault();
      seekTo(audio.currentTime + 5);
      break;

    case "ArrowUp":
      event.preventDefault();
      audio.volume = Math.min(1, audio.volume + 0.1);
      break;

    case "ArrowDown":
      event.preventDefault();
      audio.volume = Math.max(0, audio.volume - 0.1);
      break;

    case "r":
    case "R":
      seekTo(audio.currentTime - 5);
      break;

    case "Escape":
      stopRepeating();
      looping = false;
      $("loop").textContent = "Loop: OFF";
      setPracticeStatus("Repetition stopped.");
      break;
  }
});

loadPlaylist();
