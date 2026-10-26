import React from 'react';
import { SystemStatus } from '../types/jarvis';
import { 
  ShieldCheck, 
  Wifi, 
  WifiOff, 
  AlertTriangle, 
  Battery, 
  BatteryCharging, 
  Download, 
  Database,
  Cpu
} from 'lucide-react';

interface StatusIndicatorBarProps {
  status: SystemStatus;
  batteryLevel: number | null;
  isCharging: boolean | null;
  isListening: boolean;
  isTorchOn: boolean;
  lowPowerMode: boolean;
  onToggleLowPower: () => void;
  onOpenSecurityMatrix: () => void;
  onOpenMemoryModal: () => void;
  onOpenApkGuide: () => void;
}

export const StatusIndicatorBar: React.FC<StatusIndicatorBarProps> = ({
  status,
  batteryLevel,
  isCharging,
  isListening,
  isTorchOn,
  lowPowerMode,
  onToggleLowPower,
  onOpenSecurityMatrix,
  onOpenMemoryModal,
  onOpenApkGuide,
}) => {
  // Format status indicator
  const getStatusBadge = () => {
    switch (status) {
      case 'ONLINE':
        return {
          label: 'ONLINE // IA 3.8',
          color: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/40',
          icon: <Wifi className="w-3.5 h-3.5 text-cyan-400" />,
        };
      case 'NO_INTERNET':
        return {
          label: 'SEM CONEXÃO // LOCAL',
          color: 'text-amber-400 border-amber-500/30 bg-amber-950/40',
          icon: <WifiOff className="w-3.5 h-3.5 text-amber-400" />,
        };
      case 'RATE_LIMIT_EXCEEDED':
        return {
          label: 'COTA EXCEDIDA // LOCAL',
          color: 'text-orange-400 border-orange-500/30 bg-orange-950/40',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />,
        };
      case 'AI_NOT_CONFIGURED':
        return {
          label: 'IA OFFLINE // REGRAS LOCAIS',
          color: 'text-yellow-400 border-yellow-500/30 bg-yellow-950/40',
          icon: <Cpu className="w-3.5 h-3.5 text-yellow-400" />,
        };
      case 'AI_SERVICE_UNAVAILABLE':
      case 'OFFLINE_MODE':
      default:
        return {
          label: 'MODO OFFLINE // LOCAL',
          color: 'text-blue-400 border-blue-500/30 bg-blue-950/40',
          icon: <Cpu className="w-3.5 h-3.5 text-blue-400" />,
        };
    }
  };

  const statusInfo = getStatusBadge();

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-cyan-500/20 px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & Assistant Name */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-950/60 border border-cyan-500/40 hud-glow">
            <span className="font-hud font-bold text-lg tracking-wider text-cyan-300">J</span>
            <div className="absolute inset-0 rounded-lg border border-cyan-400/20 animate-pulse pointer-events-none" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-hud font-bold text-base sm:text-lg tracking-widest text-cyan-200">
                J.A.R.V.I.S.
              </span>
              <span className="text-[10px] text-cyan-400/80 font-mono hidden xs:inline-block">
                pt-BR
              </span>
            </div>
            <span className="text-[10px] text-slate-400 truncate max-w-[130px] sm:max-w-none">
              Samsung Galaxy A04 Edition
            </span>
          </div>
        </div>

        {/* Live Status Indicators */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* AI / Network Status */}
          <div className={`flex items-center gap-1 px-2 py-1 rounded border text-[11px] font-mono whitespace-nowrap ${statusInfo.color}`}>
            {statusInfo.icon}
            <span className="hidden sm:inline">{statusInfo.label}</span>
          </div>

          {/* Flashlight Indicator if on */}
          {isTorchOn && (
            <div className="flex items-center gap-1 px-2 py-1 rounded border text-[11px] font-mono text-amber-300 border-amber-500/40 bg-amber-950/50 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="hidden md:inline">LANTERNA</span>
            </div>
          )}

          {/* Galaxy A04 Battery Metric */}
          {batteryLevel !== null && (
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded border text-[11px] font-mono text-slate-300 border-slate-700 bg-slate-900/60">
              {isCharging ? (
                <BatteryCharging className="w-3.5 h-3.5 text-cyan-400" />
              ) : (
                <Battery className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>{batteryLevel}%</span>
            </div>
          )}

          {/* Battery Saver Mode Toggle */}
          <button
            onClick={onToggleLowPower}
            title={lowPowerMode ? 'Modo Economia A04 Ativado' : 'Alternar Economia A04'}
            className={`px-2 py-1 rounded border text-[11px] font-mono transition-colors whitespace-nowrap ${
              lowPowerMode
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900/40 border-slate-700/60 text-slate-400 hover:text-slate-200'
            }`}
          >
            {lowPowerMode ? 'ECO A04' : 'A04 PADRÃO'}
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Security Matrix Button */}
          <button
            onClick={onOpenSecurityMatrix}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-cyan-500/40 bg-cyan-950/50 hover:bg-cyan-900/60 text-cyan-300 text-xs font-medium transition-all hud-glow whitespace-nowrap"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">40 Camadas</span>
            <span className="sm:hidden text-[10px]">40</span>
          </button>

          {/* Memory Inspector Button */}
          <button
            onClick={onOpenMemoryModal}
            title="Memória Local e Higienização"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-700 hover:border-cyan-500/40 bg-slate-900/50 hover:bg-slate-800 text-slate-300 text-xs transition-colors flex items-center gap-1"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Memória</span>
          </button>

          {/* APK Guide Button */}
          <button
            onClick={onOpenApkGuide}
            title="Exportar APK Android / Instalar no Galaxy A04"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-cyan-500/50 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-200 text-xs font-medium transition-colors flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5 text-cyan-300" />
            <span className="hidden md:inline">Instalar / APK</span>
          </button>
        </div>
      </div>
    </header>
  );
};
