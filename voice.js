const API_BASE = "https://yarrow-ai-server.vercel.app"; // ton URL Vercel

const startBtn = document.getElementById("start-voice");
const output = document.getElementById("output");
const capabilities = document.getElementById("capabilities");
const voiceSelect = document.getElementById("voiceSelect");
const avatarImg = document.getElementById("assistantAvatar");

const supportsRecognition = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
const supportsSynthesis = "speechSynthesis" in window;

if (supportsRecognition && supportsSynthesis) {
  capabilities.textContent = "✅ Compatible : écoute et voix disponibles";
} else if (supportsRecognition)
