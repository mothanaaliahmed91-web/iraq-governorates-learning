export class Narrator {
  constructor(){ this.active=null; this.supported='speechSynthesis' in window && 'SpeechSynthesisUtterance' in window; }
  speak(text, language='ar-IQ'){
    this.stop();
    if(!this.supported) return false;
    const utterance=new SpeechSynthesisUtterance(text); utterance.lang=language; utterance.rate=.86; utterance.pitch=1.05; utterance.volume=.9;
    const voices=window.speechSynthesis.getVoices(); const arabic=voices.find(v=>v.lang?.toLowerCase().startsWith('ar')); if(arabic) utterance.voice=arabic;
    utterance.onend=()=>{this.active=null}; utterance.onerror=()=>{this.active=null}; this.active=utterance; window.speechSynthesis.speak(utterance); return true;
  }
  stop(){ if(this.supported) window.speechSynthesis.cancel(); this.active=null; }
}
