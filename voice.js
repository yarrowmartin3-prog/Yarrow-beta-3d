// ← Mets TON URL Vercel exacte si différente
const API_BASE = "https://yarrow-ai-server.vercel.app";

// Sélecteurs
const startBtn = document.getElementById("start-voice");
const output = document.getElementById("output");
const capabilities = document.getElementById("capabilities");
const voiceSelect = document.getElementById("voiceSelect");
const avatarImg = document.getElementById("assistantAvatar");

// Compatibilité
const supportsRecognition = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
const supportsSynthesis = "speechSynthesis" in window;

function setText(el, t){ if(el) el.textContent = t; }

if (supportsRecognition && supportsSynthesis) {
  setText(capabilities, "✅ Compatible : écoute et voix disponibles");
} else if (supportsRecognition) {
  setText(capabilities, "⚠️ Écoute seulement, pas de voix");
} else if (supportsSynthesis) {
  setText(capabilities, "⚠️ Voix seulement, pas d’écoute (utilise Chrome Android pour le micro)");
} else {
  setText(capabilities, "❌ Pas compatible sur ce navigateur");
}

// Avatars
document.querySelectorAll("button[data-src]").forEach(b=>{
  b.addEventListener("click", ()=> { avatarImg.src = b.getAttribute("data-src"); });
});

// Voix
let voices = [];
function loadVoices(){
  voices = speechSynthesis.getVoices();
  voiceSelect.innerHTML = "";
  if (!voices.length) { 
    const o = document.createElement("option"); o.text = "(Aucune voix trouvée)"; voiceSelect.add(o); 
    return;
  }
  voices
    .sort((a,b)=>(b.lang.startsWith("fr")-a.lang.startsWith("fr"))||a.name.localeCompare(b.name))
    .forEach(v=>{
      const o = document.createElement("option");
      o.value = v.name; o.text = `${v.name} (${v.lang})`;
      voiceSelect.add(o);
    });
  const fr = voices.find(v=>v.lang.startsWith("fr"));
  if (fr) voiceSelect.value = fr.name;
}
if (supportsSynthesis){ loadVoices(); speechSynthesis.onvoiceschanged = loadVoices; }

// Reconnaissance + appel IA
if (supportsRecognition){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const rec = new SR();
  rec.lang = "fr-FR";
  rec.interimResults = false;

  startBtn.addEventListener("click", ()=>{
    rec.start();
    setText(output,"🎤 J’écoute…");
  });

  rec.addEventListener("result", async (e)=>{
    const transcript = e.results[0][0].transcript;
    setText(output, "👂 J’ai entendu : " + transcript + " — envoi à l’IA…");
    try{
      const r = await fetch(`${API_BASE}/api/chat`, {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ userText: transcript })
      });
      const data = await r.json();
      const answer = data.answer || "(pas de réponse)";
      setText(output, "🤖 IA : " + answer);

      if (supportsSynthesis){
        const utter = new SpeechSynthesisUtterance(answer);
        const v = voices.find(v=>v.name===voiceSelect.value);
        if (v) utter.voice = v;
        utter.lang = (v && v.lang) || "fr-FR";
        speechSynthesis.cancel();
        speechSynthesis.speak(utter);
      }
    }catch(err){
      setText(output, "❌ Erreur API : " + err);
    }
  });

  rec.addEventListener("end", ()=>{ setText(output, (output.textContent||"") + " (fin de l’écoute)"); });
}
