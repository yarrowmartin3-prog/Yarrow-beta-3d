// Vérifie si le navigateur supporte la Web Speech API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const synth = window.speechSynthesis;

if (SpeechRecognition && synth) {
  const recognition = new SpeechRecognition();
  recognition.lang = "fr-FR"; // Langue: français
  recognition.interimResults = false;

  const startBtn = document.getElementById("start-voice");
  const output = document.getElementById("output");

  startBtn.addEventListener("click", () => {
    recognition.start();
  });

  recognition.addEventListener("result", (e) => {
    const transcript = e.results[0][0].transcript;
    output.textContent = "👂 J'ai entendu : " + transcript;

    // Répond avec une phrase simple
    const reply = "Tu as dit : " + transcript;
    const utterance = new SpeechSynthesisUtterance(reply);
    utterance.lang = "fr-FR";
    synth.speak(utterance);
  });

  recognition.addEventListener("end", () => {
    recognition.stop();
  });
} else {
  alert("⚠️ La reconnaissance vocale n'est pas supportée sur ce navigateur.");
}
