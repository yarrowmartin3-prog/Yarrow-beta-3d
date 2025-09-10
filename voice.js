// === CONFIG ===
const API_BASE = "https://yarrow-ai-server.vercel.app"; // ⚠️ mets ici ton URL Vercel exacte

// === Sélecteurs ===
const startBtn = document.getElementById("start-voice");
const output = document.getElementById("output");
const capabilities = document.getElementById("capabilities");
const voiceSelect = document.getElementById("voiceSelect");
const avatarImg = document.getElementById("assistantAvatar");

// === Compatibilité ===
const supportsRecognition = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
const supportsSynthesis = "speechSynthesis" in window;

function safeText(el, t){ if(el) el.textContent = t; }
function safeDisable(el, v){ if(el) el.disabled = !!v; }

// Affiche l’état au chargement
window.addEventListener("load", () => {
  let msg = "";
  if (supportsRecognition && supportsSynthesis) msg = "✅ Compatible : écoute + voix disponibles.";
  else if (supportsRecognition)              msg = "⚠️ Partiel : écoute OK, voix non disponible.";
  else if (supportsSynthesis)                msg = "⚠️ Partiel : la page peut parler mais ne peut pas écouter (essaye Chrome).";
  else                                       msg = "❌ Non supporté : ni écoute ni voix sur ce navigateur.";

  safeText(capabilities, msg);
  if (!supportsRecognition) safeDisable(startBtn, true);
});

// === Gestion des VOIX ===
let allVoices = [];
let selectedVoice = null;

function populateVoices() {
  allVoices = window.speechSynthesis.getVoices();
  voiceSelect.innerHTML = "";

  if (!allVoices.length) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = "(Pas de voix dispo / recharger la page)";
    voiceSelect
