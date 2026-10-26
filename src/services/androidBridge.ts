// Android Native Integration Layer for JARVIS

let videoStream: MediaStream | null = null;
let videoTrack: MediaStreamTrack | null = null;
let isTorchActive = false;
let speechRecognizer: any = null;

// Tactical Haptic Vibration for Galaxy A04
export function triggerHaptic(pattern: number | number[] = [25, 20, 25]) {
  try {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch (e) {
    // Ignore if not permitted
  }
}

// Flashlight (Lanterna) Control via MediaStream Torch Constraint
export async function toggleFlashlight(requestedState?: boolean): Promise<{ success: boolean; active: boolean; error?: string; onScreenFallback?: boolean }> {
  try {
    const targetState = requestedState !== undefined ? requestedState : !isTorchActive;

    if (!targetState && videoTrack) {
      // Turn off
      try {
        await videoTrack.applyConstraints({ advanced: [{ torch: false } as any] });
      } catch (e) {}
      videoTrack.stop();
      if (videoStream) {
        videoStream.getTracks().forEach((t) => t.stop());
      }
      videoTrack = null;
      videoStream = null;
      isTorchActive = false;
      triggerHaptic(20);
      return { success: true, active: false };
    }

    if (targetState) {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return { success: false, active: false, error: 'Câmera não suportada neste navegador.', onScreenFallback: true };
      }

      videoStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
        },
      });

      videoTrack = videoStream.getVideoTracks()[0];
      if (!videoTrack) {
        return { success: false, active: false, error: 'Trilha de vídeo traseira indisponível.', onScreenFallback: true };
      }

      // Check capabilities
      const capabilities: any = typeof videoTrack.getCapabilities === 'function' ? videoTrack.getCapabilities() : {};
      
      if (!capabilities.torch) {
        // Hardware torch not accessible in this context; return on-screen torch fallback
        isTorchActive = true;
        triggerHaptic([40, 30, 40]);
        return { success: true, active: true, onScreenFallback: true };
      }

      await videoTrack.applyConstraints({
        advanced: [{ torch: true } as any],
      });

      isTorchActive = true;
      triggerHaptic([40, 30, 40]);
      return { success: true, active: true };
    }

    return { success: true, active: isTorchActive };
  } catch (err: any) {
    console.warn('Lanterna nativa não pôde ser ativada:', err);
    // Return on-screen fallback so user still gets a functional light
    isTorchActive = requestedState !== undefined ? requestedState : !isTorchActive;
    return { success: true, active: isTorchActive, onScreenFallback: true };
  }
}

// Speech Recognition in Brazilian Portuguese
export function initSpeechRecognition(
  onResult: (transcript: string, isFinal: boolean) => void,
  onError: (error: string) => void,
  onEnd: () => void
): { start: () => void; stop: () => void; isSupported: boolean } {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return {
      start: () => {},
      stop: () => {},
      isSupported: false,
    };
  }

  if (!speechRecognizer) {
    speechRecognizer = new SpeechRecognition();
    speechRecognizer.lang = 'pt-BR';
    speechRecognizer.continuous = false;
    speechRecognizer.interimResults = true;
    speechRecognizer.maxAlternatives = 1;
  }

  speechRecognizer.onresult = (event: any) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    const text = finalTranscript || interimTranscript;
    onResult(text, Boolean(finalTranscript));
  };

  speechRecognizer.onerror = (event: any) => {
    console.warn('Erro no reconhecimento de voz:', event.error);
    onError(event.error);
  };

  speechRecognizer.onend = () => {
    onEnd();
  };

  return {
    start: () => {
      try {
        speechRecognizer.start();
        triggerHaptic(30);
      } catch (err) {
        // already started
      }
    },
    stop: () => {
      try {
        speechRecognizer.stop();
        triggerHaptic(20);
      } catch (err) {}
    },
    isSupported: true,
  };
}

// Speech Synthesis (Text-to-Speech) in Brazilian Portuguese
let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speakText(
  text: string,
  onStart?: () => void,
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  // Stop any ongoing speech
  stopSpeaking();

  // Strip JSON action tags or markdown links from speech
  const cleanText = text
    .replace(/<<<ACTION:[\s\S]*?>>>/g, '')
    .replace(/```[\s\S]*?```/g, 'Código listado no terminal.')
    .replace(/[*#_~`]/g, '')
    .replace(/https?:\/\/\S+/g, 'link de internet')
    .trim();

  if (!cleanText) return false;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'pt-BR';
  utterance.rate = 1.05; // Slightly assertive JARVIS pacing
  utterance.pitch = 0.95; // Deep tone

  // Attempt to select the best pt-BR voice available
  const voices = window.speechSynthesis.getVoices();
  const ptVoice = voices.find((v) => v.lang === 'pt-BR' || v.lang === 'pt_BR' || v.name.toLowerCase().includes('brazil') || v.name.toLowerCase().includes('portuguese'));
  if (ptVoice) {
    utterance.voice = ptVoice;
  }

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

// Current Date and Time in Brazilian Portuguese
export function getFormattedDateTime(): { text: string; time: string; date: string } {
  const now = new Date();
  const time = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const date = now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const text = `Hoje é ${date}, e são exatamente ${time}.`;
  return { text, time, date };
}

// Application Launchers (Official Android Schemes & Intents)
export function openAndroidApp(app: 'youtube' | 'whatsapp' | 'freefire' | 'camera' | 'settings' | string): { success: boolean; message: string } {
  triggerHaptic(40);
  switch (app.toLowerCase()) {
    case 'youtube':
      // Open YouTube via standard intent or web fallback
      window.location.href = 'vnd.youtube://';
      setTimeout(() => {
        window.open('https://www.youtube.com', '_blank');
      }, 500);
      return { success: true, message: 'Inicializando o YouTube...' };

    case 'whatsapp':
      window.location.href = 'whatsapp://';
      setTimeout(() => {
        window.open('https://web.whatsapp.com', '_blank');
      }, 500);
      return { success: true, message: 'Abrindo o WhatsApp...' };

    case 'freefire':
      // Launch Free Fire package via Android Intent URI
      window.location.href = 'intent://#Intent;package=com.dts.freefireth;scheme=launch;end';
      setTimeout(() => {
        window.open('https://play.google.com/store/apps/details?id=com.dts.freefireth', '_blank');
      }, 700);
      return { success: true, message: 'Executando inicialização do Free Fire...' };

    case 'camera':
      // Open native camera stream trigger
      return { success: true, message: 'Câmera ativada para inspeção.' };

    case 'settings':
      // Android Settings Intent
      window.location.href = 'intent://#Intent;action=android.settings.SETTINGS;end';
      return { success: true, message: 'Abrindo configurações do sistema Android.' };

    default:
      return { success: false, message: `Aplicativo "${app}" não consta na lista de aplicativos autorizados.` };
  }
}

// WhatsApp Confirmed Message Dispatch
export function dispatchWhatsAppMessage(phone: string, text: string): { success: boolean; url: string } {
  triggerHaptic([50, 40, 50]);
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedText = encodeURIComponent(text);
  
  // Format official WhatsApp URL
  const whatsappUrl = cleanPhone
    ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`
    : `https://api.whatsapp.com/send?text=${encodedText}`;

  // Open WhatsApp in new tab / intent
  window.open(whatsappUrl, '_blank');
  return { success: true, url: whatsappUrl };
}

// Web Share API
export async function shareContent(title: string, text: string, url?: string): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url: url || window.location.href });
      return true;
    } catch (e) {
      return false;
    }
  }
  return false;
}

// Contacts Picker API (Android Chrome & PWA)
export async function pickContact(): Promise<{ name: string; phone: string } | null> {
  try {
    if ('contacts' in navigator && 'ContactsManager' in window) {
      // @ts-ignore
      const contacts = await navigator.contacts.select(['name', 'tel'], { multiple: false });
      if (contacts && contacts.length > 0) {
        const contact = contacts[0];
        const name = contact.name?.[0] || 'Contato';
        const phone = contact.tel?.[0] || '';
        return { name, phone };
      }
    }
  } catch (err) {
    console.warn('Contacts API indisponível ou cancelada:', err);
  }
  return null;
}

// Real Battery Status API for Galaxy A04
export async function getBatteryStatus(): Promise<{ level: number; charging: boolean } | null> {
  try {
    // @ts-ignore
    if ('getBattery' in navigator) {
      // @ts-ignore
      const battery = await navigator.getBattery();
      return {
        level: Math.round(battery.level * 100),
        charging: battery.charging,
      };
    }
  } catch (e) {}
  return null;
}
