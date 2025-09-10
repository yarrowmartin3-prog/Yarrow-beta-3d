// Vérifie si la Web Speech API est disponible
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const synth = window.speechSynthesis;

// Sélecteurs HTML
const startBtn = document.getElementById("start-voice");
const output = document.getElementById("output");

if (SpeechRecognition && synth) {
  // ✅ Navigateur compatible
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

    // Réponse vocale simple
    const reply = "Tu as dit : " + transcript;
    const utterance = new SpeechSynthesisUtterance(reply);
    utterance.lang = "fr-FR";
    synth.speak(utterance);
  });

  recognition.addEventListener("end", () => {
    output.textContent += " (fin de l'écoute)";
  });

} else {
  // ❌ Navigateur non compatible
  output.textContent = "⚠️ La reconnaissance vocale n'est pas supportée sur ce navigateur. Essaie avec Chrome.";
}
