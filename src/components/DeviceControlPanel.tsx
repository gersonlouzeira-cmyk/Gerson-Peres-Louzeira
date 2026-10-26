import React, { useRef } from 'react';
import { 
  Flashlight, 
  Tv, 
  MessageSquare, 
  Gamepad2, 
  Camera, 
  Settings, 
  Clock, 
  Share2, 
  FileSearch,
  Upload
} from 'lucide-react';

interface DeviceControlPanelProps {
  isTorchOn: boolean;
  onToggleTorch: () => void;
  onLaunchApp: (app: 'youtube' | 'whatsapp' | 'freefire' | 'camera' | 'settings') => void;
  onReadDateTime: () => void;
  onShareApp: () => void;
  onAnalyzeFile: (file: File) => void;
  isAnalyzing: boolean;
}

export const DeviceControlPanel: React.FC<DeviceControlPanelProps> = ({
  isTorchOn,
  onToggleTorch,
  onLaunchApp,
  onReadDateTime,
  onShareApp,
  onAnalyzeFile,
  isAnalyzing,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAnalyzeFile(file);
    }
  };

  return (
    <div className="w-full rounded-2xl bg-slate-950/70 border border-cyan-500/30 p-4 sm:p-5 hud-panel">
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-cyan-400" />
          <h3 className="font-hud font-bold text-sm sm:text-base text-cyan-200 tracking-wider">
            CONTROLE DE DISPOSITIVO // ANDROID
          </h3>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">
          Intents Oficiais
        </span>
      </div>

      {/* Grid of Action Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Flashlight */}
        <button
          onClick={onToggleTorch}
          className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between h-24 ${
            isTorchOn
              ? 'bg-amber-950/40 border-amber-400/80 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
              : 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/40 text-slate-300'
          }`}
        >
          <div className="flex items-center justify-between w-full">
            <Flashlight className={`w-5 h-5 ${isTorchOn ? 'text-amber-300 animate-pulse' : 'text-slate-400'}`} />
            <span className={`text-[10px] font-mono font-semibold ${isTorchOn ? 'text-amber-300' : 'text-slate-500'}`}>
              {isTorchOn ? 'LIGADA' : 'DESL.'}
            </span>
          </div>
          <div>
            <span className="text-xs font-semibold block">Lanterna</span>
            <span className="text-[10px] text-slate-400">LED Traseiro A04</span>
          </div>
        </button>

        {/* WhatsApp */}
        <button
          onClick={() => onLaunchApp('whatsapp')}
          className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-200 text-left transition-all flex flex-col justify-between h-24"
        >
          <div className="flex items-center justify-between w-full">
            <MessageSquare className="w-5 h-5 text-emerald-400" />
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">APP</span>
          </div>
          <div>
            <span className="text-xs font-semibold block">WhatsApp</span>
            <span className="text-[10px] text-slate-400">Abrir Oficial</span>
          </div>
        </button>

        {/* YouTube */}
        <button
          onClick={() => onLaunchApp('youtube')}
          className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-red-500/50 text-slate-300 hover:text-red-200 text-left transition-all flex flex-col justify-between h-24"
        >
          <div className="flex items-center justify-between w-full">
            <Tv className="w-5 h-5 text-red-400" />
            <span className="text-[10px] font-mono text-red-400 font-semibold">VND</span>
          </div>
          <div>
            <span className="text-xs font-semibold block">YouTube</span>
            <span className="text-[10px] text-slate-400">Intent Nativo</span>
          </div>
        </button>

        {/* Free Fire */}
        <button
          onClick={() => onLaunchApp('freefire')}
          className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-orange-500/50 text-slate-300 hover:text-orange-200 text-left transition-all flex flex-col justify-between h-24"
        >
          <div className="flex items-center justify-between w-full">
            <Gamepad2 className="w-5 h-5 text-orange-400" />
            <span className="text-[10px] font-mono text-orange-400 font-semibold">JOGO</span>
          </div>
          <div>
            <span className="text-xs font-semibold block">Free Fire</span>
            <span className="text-[10px] text-slate-400">Invocação de Pacote</span>
          </div>
        </button>

        {/* Câmera */}
        <button
          onClick={() => onLaunchApp('camera')}
          className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-200 text-left transition-all flex flex-col justify-between h-24"
        >
          <div className="flex items-center justify-between w-full">
            <Camera className="w-5 h-5 text-cyan-400" />
            <span className="text-[10px] font-mono text-cyan-400 font-semibold">ÓPTICO</span>
          </div>
          <div>
            <span className="text-xs font-semibold block">Câmera</span>
            <span className="text-[10px] text-slate-400">Inspeção Visual</span>
          </div>
        </button>

        {/* Data e Hora */}
        <button
          onClick={onReadDateTime}
          className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-200 text-left transition-all flex flex-col justify-between h-24"
        >
          <div className="flex items-center justify-between w-full">
            <Clock className="w-5 h-5 text-cyan-400" />
            <span className="text-[10px] font-mono text-cyan-400 font-semibold">RELÓGIO</span>
          </div>
          <div>
            <span className="text-xs font-semibold block">Data & Hora</span>
            <span className="text-[10px] text-slate-400">Sincronismo Local</span>
          </div>
        </button>

        {/* Configurações Android */}
        <button
          onClick={() => onLaunchApp('settings')}
          className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-200 text-left transition-all flex flex-col justify-between h-24"
        >
          <div className="flex items-center justify-between w-full">
            <Settings className="w-5 h-5 text-cyan-400" />
            <span className="text-[10px] font-mono text-cyan-400 font-semibold">SISTEMA</span>
          </div>
          <div>
            <span className="text-xs font-semibold block">Configurações</span>
            <span className="text-[10px] text-slate-400">Painel Android</span>
          </div>
        </button>

        {/* Compartilhar */}
        <button
          onClick={onShareApp}
          className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-200 text-left transition-all flex flex-col justify-between h-24"
        >
          <div className="flex items-center justify-between w-full">
            <Share2 className="w-5 h-5 text-cyan-400" />
            <span className="text-[10px] font-mono text-cyan-400 font-semibold">SHARE</span>
          </div>
          <div>
            <span className="text-xs font-semibold block">Compartilhar</span>
            <span className="text-[10px] text-slate-400">Web Share API</span>
          </div>
        </button>
      </div>

      {/* Multimodal Document / Image Analysis Upload Trigger */}
      <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileSearch className="w-4 h-4 text-cyan-400" />
          <div>
            <span className="text-xs font-semibold text-slate-200 block">
              Análise Multimodal de Documento ou Foto
            </span>
            <span className="text-[10px] text-slate-400">
              Seletor seguro Android (SAF) · Envia ao Gemini 3.8
            </span>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf,text/plain"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isAnalyzing}
          className="px-3 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 text-xs font-medium transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>{isAnalyzing ? 'Analisando...' : 'Selecionar Arquivo'}</span>
        </button>
      </div>
    </div>
  );
};
