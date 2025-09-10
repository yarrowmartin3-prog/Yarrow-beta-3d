// URL de ton serveur Vercel
const API_BASE = "https://yarrow-ai-server.vercel.app";

// Vérifie si la reconnaissance vocale est dispo
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const synth = window.speechSynthesis;

// Sélecteurs HTML
const startBtn = document.getElementById("start-voice");
const output = document.getElementById("output");

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = "fr-FR";
  recognition.interimResults = false;

  startBtn.addEventListener("click", () => {
    recognition.start();
    output.textContent = "🎤 Écoute en cours...";
  });

  recognition.addEventListener("result", async (e) => {
    const transcript = e.results[0][0].transcript;
    output.textContent = "👂 J'ai entendu : " + transcript + " (envoi à l'IA...)";

    try {
      const r = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userText: transcript })
      });

      const data = await r.json();
      const answer = data.answer || "(pas de réponse)";
      output.textContent = "🤖 IA : " + answer;

      if (synth) {
        const utterance = new SpeechSynthesisUtterance(answer);
        utterance.lang = "fr-FR";
        synth.speak(utterance);
      }
    } catch (err) {
      output.textContent = "❌ Erreur API : " + err;
    }
  });

  recognition.addEventListener("end", () => {
    output.textContent += " (fin de l'écoute)";
  });

} else {
  if (synth) {
    output.textContent = "⚠️ Ce navigateur peut parler mais pas écouter.";
  } else {
    output.textContent = "⚠️ Ni écoute ni voix disponibles sur ce navigateur.";
  }
}
