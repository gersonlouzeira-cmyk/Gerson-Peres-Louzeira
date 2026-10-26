import React from 'react';
import { CoreState } from '../types/jarvis';
import { 
  Mic, 
  MicOff, 
  Square, 
  Flashlight, 
  Globe, 
  VolumeX, 
  Camera, 
  XOctagon, 
  Sparkles
} from 'lucide-react';

interface HudCoreProps {
  coreState: CoreState;
  isListening: boolean;
  isSpeaking: boolean;
  isTorchOn: boolean;
  enableWebSearch: boolean;
  onToggleMic: () => void;
  onStopSpeaking: () => void;
  onToggleTorch: () => void;
  onToggleWebSearch: () => void;
  onQuickCommand: (cmd: string) => void;
  onCancelAction: () => void;
  hasPendingAction: boolean;
  lowPowerMode: boolean;
}

export const HudCore: React.FC<HudCoreProps> = ({
  coreState,
  isListening,
  isSpeaking,
  isTorchOn,
  enableWebSearch,
  onToggleMic,
  onStopSpeaking,
  onToggleTorch,
  onToggleWebSearch,
  onQuickCommand,
  onCancelAction,
  hasPendingAction,
  lowPowerMode,
}) => {
  // Soundwave mock frequency bars (animated with CSS)
  const soundWaveBars = [12, 28, 45, 75, 95, 60, 80, 40, 20];

  const getStatusText = () => {
    switch (coreState) {
      case 'listening':
        return 'OUVINDO COMANDO EM PORTUGUÊS...';
      case 'processing':
        return 'SINTETIZANDO DADOS E SEGURANÇA...';
      case 'speaking':
        return 'RESPOSTA DE VOZ EM ANDAMENTO...';
      case 'alert':
        return 'DIRETRIZ DE SEGURANÇA ATIVADA';
      case 'idle':
      default:
        return 'SISTEMA PRONTO // DIGA "JARVIS" OU TOQUE';
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center py-4 sm:py-6 px-4 w-full select-none overflow-hidden">
      {/* Background radial holographic glow */}
      <div 
        className={`absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
          coreState === 'listening' 
            ? 'bg-rose-500/15' 
            : coreState === 'speaking' 
              ? 'bg-cyan-400/20' 
              : coreState === 'alert'
                ? 'bg-amber-500/25'
                : 'bg-cyan-600/10'
        }`} 
      />

      {/* Futuristic Circular HUD Assembly */}
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
        {/* Outer Circular Calibrated Ring (SVG) */}
        <svg 
          viewBox="0 0 400 400" 
          className={`absolute inset-0 w-full h-full pointer-events-none transition-transform duration-1000 ${
            lowPowerMode ? '' : 'animate-hud-cw'
          }`}
        >
          {/* Outer dashed track */}
          <circle
            cx="200"
            cy="200"
            r="190"
            fill="none"
            stroke="#0891b2"
            strokeWidth="1.5"
            strokeOpacity="0.3"
            strokeDasharray="4 8"
          />
          {/* Degree Tick marks */}
          {Array.from({ length: 24 }).map((_, i) => {
            const angle = (i * 360) / 24;
            const rad = (angle * Math.PI) / 180;
            const x1 = 200 + 178 * Math.cos(rad);
            const y1 = 200 + 178 * Math.sin(rad);
            const x2 = 200 + 188 * Math.cos(rad);
            const y2 = 200 + 188 * Math.sin(rad);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#00f0ff"
                strokeWidth={i % 6 === 0 ? "2.5" : "1"}
                strokeOpacity={i % 6 === 0 ? "0.8" : "0.35"}
              />
            );
          })}
        </svg>

        {/* Counter-rotating Inner Segmented Ring */}
        <svg 
          viewBox="0 0 300 300" 
          className={`absolute w-52 h-52 sm:w-64 sm:h-64 pointer-events-none ${
            lowPowerMode ? '' : 'animate-hud-ccw'
          }`}
        >
          {/* 3 Arc segments */}
          <circle
            cx="150"
            cy="150"
            r="140"
            fill="none"
            stroke="#00f0ff"
            strokeWidth="2.5"
            strokeOpacity="0.6"
            strokeDasharray="120 40 80 50"
          />
          <circle
            cx="150"
            cy="150"
            r="125"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="1"
            strokeOpacity="0.4"
            strokeDasharray="30 20 60 40"
          />
        </svg>

        {/* Sound Wave Frequency Ring when Speaking or Listening */}
        {(isListening || isSpeaking) && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex items-center gap-1 sm:gap-1.5 h-16">
              {soundWaveBars.map((height, idx) => (
                <div
                  key={idx}
                  className={`w-1 rounded-full transition-all duration-150 ${
                    isListening ? 'bg-rose-400' : 'bg-cyan-300'
                  }`}
                  style={{
                    height: `${height * (isSpeaking ? 0.8 : 0.6)}%`,
                    animation: `pulse 0.4s ease-in-out infinite alternate ${idx * 0.08}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Center Reactive AI Core & Mic Button */}
        <button
          onClick={onToggleMic}
          aria-label={isListening ? 'Parar de ouvir' : 'Iniciar escuta de voz'}
          className={`relative z-20 flex flex-col items-center justify-center w-28 h-28 sm:w-36 sm:h-36 rounded-full border transition-all duration-300 transform active:scale-95 cursor-pointer ${
            isListening
              ? 'bg-rose-950/70 border-rose-400 text-rose-200 shadow-[0_0_40px_rgba(244,63,94,0.6)]'
              : coreState === 'processing'
                ? 'bg-cyan-950/80 border-cyan-300 text-cyan-200 shadow-[0_0_40px_rgba(6,182,212,0.6)] animate-pulse'
                : isSpeaking
                  ? 'bg-cyan-900/60 border-cyan-400 text-cyan-200 hud-glow-lg'
                  : 'bg-slate-950/80 border-cyan-500/50 text-cyan-300 hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]'
          }`}
        >
          {/* Inner pulsating glow disc */}
          <div 
            className={`absolute inset-2 rounded-full border border-cyan-400/30 ${
              lowPowerMode ? '' : 'animate-hud-pulse'
            }`} 
          />

          {/* Central Icon */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            {isListening ? (
              <Mic className="w-8 h-8 sm:w-10 sm:h-10 text-rose-300 animate-bounce" />
            ) : coreState === 'processing' ? (
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-300 animate-spin" />
            ) : isSpeaking ? (
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-6 bg-cyan-300 rounded-full animate-pulse" />
                <span className="w-1.5 h-10 bg-cyan-300 rounded-full animate-pulse delay-100" />
                <span className="w-1.5 h-5 bg-cyan-300 rounded-full animate-pulse delay-200" />
              </div>
            ) : (
              <Mic className="w-8 h-8 sm:w-10 sm:h-10 text-cyan-400" />
            )}

            <span className="mt-1 text-[10px] sm:text-xs font-hud font-bold tracking-widest uppercase">
              {isListening ? 'Ouvindo' : coreState === 'processing' ? 'Calculando' : isSpeaking ? 'Falando' : 'JARVIS'}
            </span>
          </div>
        </button>
      </div>

      {/* Core Status Message */}
      <div className="mt-2 text-center">
        <p className="font-hud font-semibold text-xs sm:text-sm tracking-wider text-cyan-300 hud-text-glow">
          {getStatusText()}
        </p>
        <span className="text-[11px] text-slate-400 font-mono">
          Voz em Português Brasileiro (pt-BR)
        </span>
      </div>

      {/* Tactical Quick Action Ribbon */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2 max-w-lg">
        {/* Stop Voice Button */}
        {isSpeaking && (
          <button
            onClick={onStopSpeaking}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/50 bg-rose-950/60 hover:bg-rose-900/70 text-rose-200 text-xs font-medium transition-colors"
          >
            <VolumeX className="w-3.5 h-3.5 text-rose-400" />
            <span>JARVIS, Pare de Falar</span>
          </button>
        )}

        {/* Cancel Pending Action */}
        {hasPendingAction && (
          <button
            onClick={onCancelAction}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/50 bg-amber-950/60 hover:bg-amber-900/70 text-amber-200 text-xs font-medium transition-colors animate-pulse"
          >
            <XOctagon className="w-3.5 h-3.5 text-amber-400" />
            <span>Cancelar Ação</span>
          </button>
        )}

        {/* Flashlight Toggle */}
        <button
          onClick={onToggleTorch}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
            isTorchOn
              ? 'border-amber-400 bg-amber-500/30 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.5)]'
              : 'border-slate-800 bg-slate-900/70 hover:border-cyan-500/40 text-slate-300'
          }`}
        >
          <Flashlight className={`w-3.5 h-3.5 ${isTorchOn ? 'text-amber-300' : 'text-slate-400'}`} />
          <span>{isTorchOn ? 'Lanterna Ligada' : 'Ligar Lanterna'}</span>
        </button>

        {/* Web Search Grounding Toggle */}
        <button
          onClick={onToggleWebSearch}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
            enableWebSearch
              ? 'border-cyan-400 bg-cyan-500/25 text-cyan-200 hud-glow'
              : 'border-slate-800 bg-slate-900/70 hover:border-cyan-500/40 text-slate-400'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span>{enableWebSearch ? 'Pesquisa Web: Ativa' : 'Pesquisa Web: Normal'}</span>
        </button>
      </div>

      {/* Spoken Command Suggestion Chips */}
      <div className="mt-3 flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 scrollbar-none">
        <button
          onClick={() => onQuickCommand('JARVIS, que horas são?')}
          className="whitespace-nowrap px-2.5 py-1 rounded border border-cyan-900/80 bg-slate-950/60 hover:border-cyan-500/50 text-[11px] text-slate-300 hover:text-cyan-200 transition-colors"
        >
          "Que horas são?"
        </button>
        <button
          onClick={() => onQuickCommand('JARVIS, ligue a lanterna')}
          className="whitespace-nowrap px-2.5 py-1 rounded border border-cyan-900/80 bg-slate-950/60 hover:border-cyan-500/50 text-[11px] text-slate-300 hover:text-cyan-200 transition-colors"
        >
          "Ligue a lanterna"
        </button>
        <button
          onClick={() => onQuickCommand('JARVIS, prepare uma mensagem para a Maria dizendo que estou chegando')}
          className="whitespace-nowrap px-2.5 py-1 rounded border border-cyan-900/80 bg-slate-950/60 hover:border-cyan-500/50 text-[11px] text-slate-300 hover:text-cyan-200 transition-colors"
        >
          "Mande WhatsApp"
        </button>
        <button
          onClick={() => onQuickCommand('JARVIS, abra o YouTube')}
          className="whitespace-nowrap px-2.5 py-1 rounded border border-cyan-900/80 bg-slate-950/60 hover:border-cyan-500/50 text-[11px] text-slate-300 hover:text-cyan-200 transition-colors"
        >
          "Abra o YouTube"
        </button>
        <button
          onClick={() => onQuickCommand('JARVIS, me explique a teoria da relatividade de forma simples')}
          className="whitespace-nowrap px-2.5 py-1 rounded border border-cyan-900/80 bg-slate-950/60 hover:border-cyan-500/50 text-[11px] text-slate-300 hover:text-cyan-200 transition-colors"
        >
          "Explique Ciência"
        </button>
      </div>
    </div>
  );
};
