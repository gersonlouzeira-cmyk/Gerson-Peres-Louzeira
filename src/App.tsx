import React, { useState, useEffect, useRef } from 'react';
import { 
  SystemStatus, 
  CoreState, 
  ChatMessage, 
  ActionProposal, 
  ContactItem 
} from './types/jarvis';
import { 
  initSpeechRecognition, 
  speakText, 
  stopSpeaking, 
  toggleFlashlight, 
  openAndroidApp, 
  dispatchWhatsAppMessage, 
  getFormattedDateTime, 
  shareContent, 
  getBatteryStatus,
  triggerHaptic
} from './services/androidBridge';
import { 
  loadSavedConversation, 
  saveConversation, 
  clearConversationMemory, 
  loadSavedContacts, 
  sendQueryToJarvis,
  processOfflineCommand 
} from './services/jarvisBrain';
import { logSecurityEvent } from './services/securityEngine';

import { StatusIndicatorBar } from './components/StatusIndicatorBar';
import { HudCore } from './components/HudCore';
import { ConversationPanel } from './components/ConversationPanel';
import { DeviceControlPanel } from './components/DeviceControlPanel';
import { WhatsAppConfirmModal } from './components/WhatsAppConfirmModal';
import { SecurityMatrixModal } from './components/SecurityMatrixModal';
import { MemoryControlModal } from './components/MemoryControlModal';
import { ApkExportGuideModal } from './components/ApkExportGuideModal';

import { 
  Mic, 
  MessageSquare, 
  Cpu, 
  Settings, 
  ShieldCheck, 
  Sun, 
  X
} from 'lucide-react';

export default function App() {
  // Application State
  const [status, setStatus] = useState<SystemStatus>('ONLINE');
  const [coreState, setCoreState] = useState<CoreState>('idle');
  const [messages, setMessages] = useState<ChatMessage[]>(loadSavedConversation);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [showScreenTorch, setShowScreenTorch] = useState(false);
  const [enableWebSearch, setEnableWebSearch] = useState(false);
  const [lowPowerMode, setLowPowerMode] = useState(false);
  const [isAnalyzingFile, setIsAnalyzingFile] = useState(false);

  // Mobile View Navigation: 'hud' | 'chat' | 'devices'
  const [activeTab, setActiveTab] = useState<'hud' | 'chat' | 'devices'>('hud');

  // Galaxy A04 Battery and Device Profile
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean | null>(null);

  // Modals
  const [pendingAction, setPendingAction] = useState<ActionProposal | null>(null);
  const [showSecurityMatrix, setShowSecurityMatrix] = useState(false);
  const [showMemoryModal, setShowMemoryModal] = useState(false);
  const [showApkGuide, setShowApkGuide] = useState(false);
  const [contacts, setContacts] = useState<ContactItem[]>(loadSavedContacts);

  // Speech Recognition Controller Reference
  const speechRef = useRef<any>(null);

  // Auto-save conversation to local storage
  useEffect(() => {
    saveConversation(messages);
  }, [messages]);

  // Monitor Network & Battery status on mount
  useEffect(() => {
    // Battery API
    getBatteryStatus().then((bat) => {
      if (bat) {
        setBatteryLevel(bat.level);
        setIsCharging(bat.charging);
      }
    });

    const handleOnline = () => setStatus('ONLINE');
    const handleOffline = () => setStatus('NO_INTERNET');

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial server status check
    fetch('/api/jarvis/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          setStatus(data.status);
        }
      })
      .catch(() => {
        if (!navigator.onLine) {
          setStatus('NO_INTERNET');
        } else {
          setStatus('AI_SERVICE_UNAVAILABLE');
        }
      });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    speechRef.current = initSpeechRecognition(
      (transcript: string, isFinal: boolean) => {
        if (isFinal) {
          setIsListening(false);
          handleSpokenInput(transcript);
        }
      },
      (error: string) => {
        console.warn('Erro reconhecimento de voz:', error);
        setIsListening(false);
        if (coreState === 'listening') {
          setCoreState('idle');
        }
      },
      () => {
        setIsListening(false);
        if (coreState === 'listening') {
          setCoreState('idle');
        }
      }
    );
  }, [pendingAction, messages, enableWebSearch, coreState]);

  // Handle Speech Recognition Toggle
  const handleToggleMic = () => {
    if (isListening) {
      speechRef.current?.stop();
      setIsListening(false);
      setCoreState('idle');
    } else {
      // Stop current speech if JARVIS was talking
      if (isSpeaking) {
        handleStopSpeaking();
      }
      setCoreState('listening');
      setIsListening(true);
      speechRef.current?.start();
    }
  };

  // Immediate Stop of Spoken Responses ("JARVIS, Pare de falar")
  const handleStopSpeaking = () => {
    stopSpeaking();
    setIsSpeaking(false);
    setCoreState('idle');
    triggerHaptic(20);
  };

  // Immediate Cancel of Pending Action ("JARVIS, Cancele essa ação")
  const handleCancelAction = () => {
    if (pendingAction) {
      logSecurityEvent('SEC-CMD-28', 'Cancelamento pelo Usuário', 'CONFIRMED', 'Ação cancelada sob comando explícito.');
      setPendingAction(null);
      const cancelMsg: ChatMessage = {
        id: 'jarvis-cancel-' + Date.now(),
        sender: 'jarvis',
        text: 'Ação cancelada com sucesso, senhor. Nenhum dado foi transmitido.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, cancelMsg]);
      speakText('Ação cancelada com sucesso, senhor.');
    }
  };

  // Process User Input (Spoken or Typed)
  const processCommand = async (rawInput: string) => {
    const input = rawInput.trim();
    if (!input) return;

    // Check for direct voice stop commands
    const normalized = input.toLowerCase();
    if (
      normalized === 'pare' ||
      normalized === 'pare de falar' ||
      normalized === 'jarvis pare' ||
      normalized === 'silêncio' ||
      normalized === 'cala a boca' ||
      normalized.includes('pare de falar')
    ) {
      handleStopSpeaking();
      return;
    }

    // Check for voice cancellation of pending action
    if (pendingAction && (normalized === 'cancelar' || normalized === 'não' || normalized === 'nao' || normalized.includes('cancela'))) {
      handleCancelAction();
      return;
    }

    // Check for voice confirmation of pending WhatsApp action
    if (pendingAction && (normalized === 'sim' || normalized === 'confirmar' || normalized === 'pode enviar' || normalized === 'enviar')) {
      handleConfirmWhatsApp(pendingAction.payload.phone || '', pendingAction.payload.text || '');
      return;
    }

    // Append user message
    const userMsg: ChatMessage = {
      id: 'user-' + Date.now(),
      sender: 'user',
      text: input,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setCoreState('processing');

    // Query JARVIS Brain
    const result = await sendQueryToJarvis(input, messages, enableWebSearch);
    setStatus(result.status);

    const jarvisMsg: ChatMessage = {
      id: 'jarvis-' + Date.now(),
      sender: 'jarvis',
      text: result.text,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      grounding: result.grounding,
      securityAlert: result.securityAlert,
      actionProposal: result.action
        ? {
            id: 'action-' + Date.now(),
            type: result.action.type,
            payload: result.action.payload || {},
            status: 'PENDING',
            createdAt: Date.now(),
          }
        : undefined,
    };

    setMessages((prev) => [...prev, jarvisMsg]);

    // Handle Executions or Confirmations
    if (result.action) {
      handleActionProposal(result.action, result.text);
    } else {
      // Speak normal answer
      speakAnswer(result.text);
    }
  };

  // Handle Spoken Input specifically
  const handleSpokenInput = (transcript: string) => {
    processCommand(transcript);
  };

  // Speak Answer Helper
  const speakAnswer = (text: string) => {
    setIsSpeaking(true);
    setCoreState('speaking');
    speakText(
      text,
      () => {
        setIsSpeaking(true);
        setCoreState('speaking');
      },
      () => {
        setIsSpeaking(false);
        setCoreState('idle');
      }
    );
  };

  // Handle Action Proposals (Enforcing Confirmation & Official Android Intents)
  const handleActionProposal = async (action: any, responseText: string) => {
    switch (action.type) {
      case 'OPEN_APP': {
        const app = action.payload?.app;
        speakAnswer(responseText);
        setTimeout(() => {
          openAndroidApp(app);
          logSecurityEvent('SEC-PERM-07', `Abertura de App: ${app}`, 'ALLOWED', `Intent oficial executada para ${app}`);
        }, 1200);
        break;
      }

      case 'FLASHLIGHT': {
        const targetState = action.payload?.state === 'off' ? false : action.payload?.state === 'on' ? true : !isTorchOn;
        speakAnswer(responseText);
        const res = await toggleFlashlight(targetState);
        setIsTorchOn(res.active);
        if (res.onScreenFallback && res.active) {
          setShowScreenTorch(true);
        } else if (!res.active) {
          setShowScreenTorch(false);
        }
        logSecurityEvent('SEC-PERM-01', 'Lanterna do Dispositivo', 'ALLOWED', `Estado alterado para ${res.active ? 'LIGADA' : 'DESLIGADA'}`);
        break;
      }

      case 'READ_DATETIME': {
        const dt = getFormattedDateTime();
        speakAnswer(dt.text);
        break;
      }

      case 'SEARCH_WEB': {
        speakAnswer(responseText);
        if (action.payload?.query) {
          window.open(`https://www.google.com/search?q=${encodeURIComponent(action.payload.query)}`, '_blank');
        }
        break;
      }

      case 'WHATSAPP_PROPOSAL': {
        // Enforce Workflow Requirement 6: Display confirmation modal, read aloud, wait explicit confirmation!
        const proposal: ActionProposal = {
          id: 'action-wa-' + Date.now(),
          type: 'WHATSAPP_PROPOSAL',
          payload: action.payload || {},
          status: 'PENDING',
          createdAt: Date.now(),
        };
        setPendingAction(proposal);
        // Ask explicit confirmation aloud
        speakAnswer(`Preparei a mensagem para ${proposal.payload.recipient || 'o contato'}. Posso enviar esta mensagem pelo WhatsApp?`);
        break;
      }

      case 'BLOCKED_FINANCIAL': {
        setCoreState('alert');
        triggerHaptic([100, 50, 100]);
        speakAnswer('Acesso financeiro bloqueado pelas diretrizes de segurança.');
        setTimeout(() => setCoreState('idle'), 3000);
        break;
      }

      default:
        speakAnswer(responseText);
        break;
    }
  };

  // WhatsApp Confirmation Execution
  const handleConfirmWhatsApp = (phone: string, text: string) => {
    if (!pendingAction) return;

    logSecurityEvent('SEC-CMD-26', 'Confirmação Explícita de WhatsApp', 'CONFIRMED', `Mensagem aprovada para ${phone || 'contato'}`);
    setPendingAction(null);

    // Dispatch intent to official WhatsApp
    dispatchWhatsAppMessage(phone, text);

    const confirmationMsg: ChatMessage = {
      id: 'jarvis-wa-dispatched-' + Date.now(),
      sender: 'jarvis',
      text: 'O WhatsApp foi aberto com a mensagem pré-preenchida. Por segurança das políticas do Android, toque no botão Enviar dentro do WhatsApp para concluir o envio.',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, confirmationMsg]);
    speakAnswer('WhatsApp aberto com a mensagem pronta. Toque em enviar para concluir.');
  };

  // Multimodal File Analysis Handler
  const handleAnalyzeFile = async (file: File) => {
    setIsAnalyzingFile(true);
    setCoreState('processing');

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64Data = (reader.result as string).split(',')[1];
        const res = await fetch('/api/jarvis/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileBase64: base64Data,
            mimeType: file.type || 'image/jpeg',
            prompt: `Analise detalhadamente este arquivo (${file.name}) em Português Brasileiro e forneça um relatório técnico claro.`,
          }),
        });

        const data = await res.json();
        const analysisText = data.analysis || 'Análise técnica finalizada.';

        const jarvisAnalysisMsg: ChatMessage = {
          id: 'jarvis-file-' + Date.now(),
          sender: 'jarvis',
          text: `[Arquivo Analisado: ${file.name}]\n\n${analysisText}`,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages((prev) => [...prev, jarvisAnalysisMsg]);
        speakAnswer(`Análise do arquivo ${file.name} concluída com sucesso.`);
      } catch (err) {
        console.error('Erro na análise de arquivo:', err);
        const errorMsg: ChatMessage = {
          id: 'jarvis-error-' + Date.now(),
          sender: 'jarvis',
          text: 'Não foi possível analisar o arquivo neste momento. Verifique a conexão com a rede.',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errorMsg]);
        speakAnswer('Falha ao processar a análise do arquivo.');
      } finally {
        setIsAnalyzingFile(false);
        setCoreState('idle');
      }
    };
    reader.readAsDataURL(file);
  };

  // Flashlight Hardware / On-screen Toggle
  const handleToggleTorch = async () => {
    const res = await toggleFlashlight();
    setIsTorchOn(res.active);
    if (res.onScreenFallback && res.active) {
      setShowScreenTorch(true);
    } else if (!res.active) {
      setShowScreenTorch(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 flex flex-col relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Scanline overlay for futuristic aesthetic */}
      <div className="fixed inset-0 scanlines pointer-events-none z-30 opacity-70" />

      {/* Fullscreen On-Screen Flashlight Fallback */}
      {showScreenTorch && (
        <div 
          onClick={() => {
            setShowScreenTorch(false);
            setIsTorchOn(false);
          }}
          className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-between p-6 cursor-pointer"
        >
          <div className="flex items-center justify-between w-full text-slate-800">
            <span className="font-hud font-bold text-lg">LANTERNA EM TELA CHEIA (A04)</span>
            <button className="p-2 rounded-full bg-slate-200 text-slate-900">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="text-center text-slate-700">
            <Sun className="w-16 h-16 mx-auto text-amber-500 animate-pulse mb-2" />
            <p className="text-sm font-semibold">Brilho Máximo Ativo</p>
            <p className="text-xs text-slate-500 mt-1">Toque em qualquer lugar da tela para desligar</p>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            JARVIS Torch Fallback Mode
          </div>
        </div>
      )}

      {/* Top Status and Header Bar */}
      <StatusIndicatorBar
        status={status}
        batteryLevel={batteryLevel}
        isCharging={isCharging}
        isListening={isListening}
        isTorchOn={isTorchOn}
        lowPowerMode={lowPowerMode}
        onToggleLowPower={() => setLowPowerMode(!lowPowerMode)}
        onOpenSecurityMatrix={() => setShowSecurityMatrix(true)}
        onOpenMemoryModal={() => setShowMemoryModal(true)}
        onOpenApkGuide={() => setShowApkGuide(true)}
      />

      {/* Main Content Area: Responsive Multi-column Grid */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 flex flex-col">
        {/* Mobile View Switcher (Visible on small screens, hidden on desktop lg:) */}
        <div className="lg:hidden flex items-center justify-around bg-slate-950 border border-cyan-500/30 rounded-xl p-1 mb-3">
          <button
            onClick={() => setActiveTab('hud')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-hud font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'hud'
                ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 hud-glow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>NÚCLEO HUD</span>
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-hud font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'chat'
                ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 hud-glow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>CONVERSA ({messages.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('devices')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-hud font-bold tracking-wider transition-colors flex items-center justify-center gap-1.5 ${
              activeTab === 'devices'
                ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 hud-glow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>ANDROID</span>
          </button>
        </div>

        {/* 2-Column Responsive Command Center Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-stretch">
          {/* Left Column: Holographic HUD Core & Device Controls */}
          <div className={`lg:col-span-5 flex flex-col gap-4 ${activeTab === 'hud' ? 'flex' : activeTab === 'devices' ? 'flex' : 'hidden lg:flex'}`}>
            {/* Show HUD if on hud tab or on desktop */}
            <div className={`${activeTab === 'devices' ? 'hidden lg:block' : 'block'}`}>
              <div className="rounded-2xl bg-slate-950/70 border border-cyan-500/30 p-2 sm:p-4 hud-panel">
                <HudCore
                  coreState={coreState}
                  isListening={isListening}
                  isSpeaking={isSpeaking}
                  isTorchOn={isTorchOn}
                  enableWebSearch={enableWebSearch}
                  onToggleMic={handleToggleMic}
                  onStopSpeaking={handleStopSpeaking}
                  onToggleTorch={handleToggleTorch}
                  onToggleWebSearch={() => setEnableWebSearch(!enableWebSearch)}
                  onQuickCommand={processCommand}
                  onCancelAction={handleCancelAction}
                  hasPendingAction={Boolean(pendingAction)}
                  lowPowerMode={lowPowerMode}
                />
              </div>
            </div>

            {/* Device Controls Panel (shown on devices tab or beneath HUD on desktop) */}
            <div className={`${activeTab === 'hud' ? 'hidden lg:block' : 'block'}`}>
              <DeviceControlPanel
                isTorchOn={isTorchOn}
                onToggleTorch={handleToggleTorch}
                onLaunchApp={(app) => {
                  const res = openAndroidApp(app);
                  speakAnswer(res.message);
                }}
                onReadDateTime={() => {
                  const dt = getFormattedDateTime();
                  speakAnswer(dt.text);
                }}
                onShareApp={() => {
                  shareContent('JARVIS Assistente IA Android', 'Conheça o JARVIS para Android, com controle por voz em pt-BR e 40 camadas de segurança.');
                }}
                onAnalyzeFile={handleAnalyzeFile}
                isAnalyzing={isAnalyzingFile}
              />
            </div>
          </div>

          {/* Right Column: Live Conversation Terminal Feed */}
          <div className={`lg:col-span-7 flex flex-col ${activeTab === 'chat' ? 'flex' : 'hidden lg:flex'}`}>
            <ConversationPanel
              messages={messages}
              inputText={inputText}
              onInputChange={setInputText}
              onSendMessage={() => processCommand(inputText)}
              onSpeakMessage={(text) => speakAnswer(text)}
              isProcessing={coreState === 'processing'}
              onActionTrigger={(action) => handleActionProposal(action, '')}
            />
          </div>
        </div>
      </main>

      {/* Floating Tactical Bottom Microphone Bar on Mobile when on Chat Tab */}
      <div className="lg:hidden sticky bottom-0 z-40 p-2.5 bg-slate-950/90 border-t border-cyan-500/30 backdrop-blur-md flex items-center justify-between gap-2">
        <button
          onClick={handleToggleMic}
          aria-label={isListening ? 'Parar microfone' : 'Ativar microfone'}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-hud font-bold tracking-wider flex items-center justify-center gap-2 transition-all ${
            isListening
              ? 'bg-rose-600 text-white shadow-[0_0_20px_rgba(244,63,94,0.6)] animate-pulse'
              : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>{isListening ? 'OUVINDO... (TOQUE P/ PARAR)' : 'FALAR COM O JARVIS (pt-BR)'}</span>
        </button>

        {isSpeaking && (
          <button
            onClick={handleStopSpeaking}
            className="py-2.5 px-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-semibold shrink-0"
          >
            Parar Voz
          </button>
        )}
      </div>

      {/* Modals */}
      {pendingAction && pendingAction.type === 'WHATSAPP_PROPOSAL' && (
        <WhatsAppConfirmModal
          proposal={pendingAction}
          availableContacts={contacts}
          onConfirm={handleConfirmWhatsApp}
          onCancel={handleCancelAction}
        />
      )}

      {showSecurityMatrix && (
        <SecurityMatrixModal onClose={() => setShowSecurityMatrix(false)} />
      )}

      {showMemoryModal && (
        <MemoryControlModal
          messages={messages}
          onClearMemory={() => {
            const cleared = clearConversationMemory();
            setMessages(cleared);
          }}
          onClose={() => setShowMemoryModal(false)}
        />
      )}

      {showApkGuide && (
        <ApkExportGuideModal onClose={() => setShowApkGuide(false)} />
      )}
    </div>
  );
}
