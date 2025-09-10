const API_BASE = "https://yarrow-ai-server.vercel.app"; // ton URL Vercel

const startBtn = document.getElementById("start-voice");
const output = document.getElementById("output");
const capabilities = document.getElementById("capabilities");
const voiceSelect = document.getElementById("voiceSelect");
const avatarImg = document.getElementById("assistantAvatar");

// Vérif compatibilité
const supportsRecognition = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
const supportsSynthesis = "speechSynthesis" in window;

if (supportsRecognition && supportsSynthesis) {
  capabilities.textContent = "✅ Compatible : écoute et voix disponibles";
} else if (supportsRecognition) {
  capabilities.textContent = "⚠️ Écoute seulement, pas de voix";
} else if (supportsSynthesis) {
  capabilities.textContent = "⚠️ Voix seulement, pas d’écoute";
} else {
  capabilities.textContent = "❌ Pas compatible";
}

// Gestion avatar
document.querySelectorAll("button[data-src]").forEach(btn => {
  btn.addEventListener("click", () => {
    avatarImg.src = btn.getAttribute("data-src");
  });
});

// Gestion voix
let voices = [];
function loadVoices() {
  voices = speechSynthesis.getVoices();
  voiceSelect.innerHTML = "";
  voices.forEach(v => {
    const opt = document.createElement("option");
    opt.value = v.name;
    opt.textContent = `${v.name} (${v.lang})`;
    voiceSelect.appendChild(opt);
  });
}
if (supportsSynthesis) {
  loadVoices();
  speechSynthesis.onvoiceschanged = loadVoices;
}

// Reconnaissance vocale
if (supportsRecognition) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SR();
  recognition.lang = "fr-FR";

  startBtn.addEventListener("click", () => {
    recognition.start();
    output.textContent = "🎤 J’écoute...";
  });

  recognition.addEventListener("result", async (e) => {
    const transcript = e.results[0][0].transcript;
    output.textContent = "👂 J’ai entendu : " + transcript;

    try {
      const r = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userText: transcript })
      });
      const data = await r.json();
      const answer = data.answer || "(pas de réponse)";
      output.textContent = "🤖 IA : " + answer;

      if (supportsSynthesis) {
        const u = new SpeechSynthesisUtterance(answer);
        const chosen = voices.find(v => v.name === voiceSelect.value);
        if (chosen) u.voice = chosen;
        speechSynthesis.speak(u);
      }
    } catch (err) {
      output.textContent = "❌ Erreur API : " + err;
    }
  });
}
