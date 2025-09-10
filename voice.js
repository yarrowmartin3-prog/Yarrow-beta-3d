// --- Détection des capacités navigateur ---
const supportsRecognition = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
const supportsSynthesis = 'speechSynthesis' in window;

// --- Sélecteurs DOM ---
const startBtn = document.getElementById('start-voice');
const output = document.getElementById('output');
const capabilities = document.getElementById('capabilities');

// Sécurités si la page ne contient pas les éléments
function safeText(el, text) { if (el) el.textContent = text; }
function safeDisable(el, v) { if (el) el.disabled = !!v; }

// --- Affichage de l'état au chargement ---
window.addEventListener('load', () => {
  let msg = '';

  if (supportsRecognition && supportsSynthesis) {
    msg = '✅ Compatible : écoute (reconnaissance vocale) + voix (synthèse) disponibles.';
  } else if (supportsRecognition && !supportsSynthesis) {
    msg = '⚠️ Partiel : écoute disponible, mais la synthèse vocale (voix) ne l’est pas.';
  } else if (!supportsRecognition && supportsSynthesis) {
    msg = '⚠️ Partiel : la page peut parler, mais ne peut pas écouter. Essaie avec Chrome.';
  } else {
    msg = '❌ Non supporté : ni écoute ni voix disponibles sur ce navigateur.';
  }

  safeText(capabilities, msg);
  // Désactiver le bouton si on ne peut pas écouter
  if (!supportsRecognition) safeDisable(startBtn, true);
});

// --- Logique principale si compatible ---
if (supportsRecognition) {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = 'fr-FR';
  recognition.interimResults = false;

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      recognition.start();
      safeText(output, '🎤 Écoute en cours... Parle maintenant.');
    });
  }

  recognition.addEventListener('result', (e) => {
    const transcript = e.results[0][0].transcript;
    safeText(output, "👂 J'ai entendu : " + transcript);

    // Réponse parlée si dispo
    if (supportsSynthesis) {
      const utter = new SpeechSynthesisUtterance("Tu as dit : " + transcript);
      utter.lang = 'fr-FR';
      window.speechSynthesis.speak(utter);
    } else {
      // Cas rare : écoute ok mais pas de voix
      safeText(output, (output.textContent || '') + ' (⚠️ mais ton navigateur ne peut pas parler)');
    }
  });

  recognition.addEventListener('end', () => {
    safeText(output, (output.textContent || '') + ' (fin de l’écoute)');
  });

} else {
  // Pas de reconnaissance → on a déjà affiché l’état et désactivé le bouton
  // Si tu veux, on peut aussi préven ir dans la zone output :
  safeText(output, "ℹ️ Utilise Chrome (PC/Android) pour l’écoute vocale. Safari/iOS ne supporte pas encore cette API.");
}
