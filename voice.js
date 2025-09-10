// Vérifie si la reconnaissance vocale est disponible
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
// Vérifie si la synthèse vocale est dispo
const synth = window.speechSynthesis;

// Sélecteurs HTML
const startBtn = document.getElementById("start-voice");
const output = document.getElementById("output");

if (SpeechRecognition) {
  // ✅ Reconnaissance vocale disponible
  const recognition = new SpeechRecognition();
  recognition.lang = "fr-FR"; // langue: français
  recognition.interimResults = false;

  startBtn.addEventListener("click", () => {
    recognition.start();
    output.textContent = "🎤 Écoute en cours... Parle maintenant.";
  });

  recognition.addEventListener("result", (e) => {
    const transcript = e.results[0][0].transcript;
    output.textContent = "👂 J'ai entendu : " + transcript;

    if (synth) {
      // ✅ Synthèse vocale dispo → répondre à voix haute
      const reply = "Tu as dit : " + transcript;
      const utterance = new SpeechSynthesisUtterance(reply);
      utterance.lang = "fr-FR";
      synth.speak(utterance);
    } else {
      // ❌ Synthèse vocale non dispo
      output.textContent += " (⚠️ mais ton navigateur ne peut pas parler)";
    }
  });

  recognition.addEventListener("end", () => {
    output.textContent += " (fin de l'écoute)";
  });

} else {
  // ❌ Reconnaissance vocale non supportée
  if (synth) {
    output.textContent = "⚠️ Ton navigateur peut parler mais ne peut pas écouter. Essaie avec Chrome.";
  } else {
    output.textContent = "⚠️ Ni l'écoute ni la voix ne sont supportées sur ce navigateur.";
  }
}
