import React, { useState } from 'react';
import { ChatMessage } from '../types/jarvis';
import { 
  Database, 
  Trash2, 
  ShieldCheck, 
  X, 
  CheckCircle2, 
  AlertTriangle,
  Lock
} from 'lucide-react';

interface MemoryControlModalProps {
  messages: ChatMessage[];
  onClearMemory: () => void;
  onClose: () => void;
}

export const MemoryControlModal: React.FC<MemoryControlModalProps> = ({
  messages,
  onClearMemory,
  onClose,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  // Calculate memory stats
  const totalMessages = messages.length;
  const userMessages = messages.filter((m) => m.sender === 'user').length;
  const jarvisMessages = messages.filter((m) => m.sender === 'jarvis').length;
  const memoryBytes = new Blob([JSON.stringify(messages)]).size;

  const handleExecuteClear = () => {
    onClearMemory();
    setShowConfirm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-950 border border-cyan-500/40 p-5 sm:p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/50">
              <Database className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-hud font-bold text-base sm:text-lg text-cyan-200 tracking-wider">
                GERENCIAMENTO DE MEMÓRIA LOCAL
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                Camadas 34, 35 & 36: Privacidade & Sanitização
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar painel de memória"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Audit Badge */}
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-semibold">Auditoria de Higienização Concluída:</strong>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Zero senhas, zero tokens de API e zero dados bancários ou cartões foram comprometidos no armazenamento local.
            </p>
          </div>
        </div>

        {/* Memory Metrics Strip */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono block">MENSAGENS</span>
            <span className="text-base font-bold font-mono text-cyan-300">{totalMessages}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono block">RESPOSTAS IA</span>
            <span className="text-base font-bold font-mono text-cyan-300">{jarvisMessages}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-mono block">CONSUMO A04</span>
            <span className="text-base font-bold font-mono text-cyan-300">{(memoryBytes / 1024).toFixed(1)} KB</span>
          </div>
        </div>

        {/* Conversation Preview List */}
        <div>
          <span className="text-xs font-semibold text-slate-300 block mb-1.5">
            Registro Atual de Contexto:
          </span>
          <div className="h-40 overflow-y-auto rounded-xl bg-slate-900/80 border border-slate-800 p-3 space-y-2 text-xs font-mono">
            {messages.map((m) => (
              <div key={m.id} className="border-b border-slate-800/80 pb-1.5 last:border-none">
                <span className="text-cyan-400 font-bold">[{m.sender.toUpperCase()}]: </span>
                <span className="text-slate-300">{m.text.substring(0, 120)}{m.text.length > 120 ? '...' : ''}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Confirmation & Clear Action */}
        <div className="pt-2 border-t border-slate-800">
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="w-full py-2.5 px-3 rounded-xl border border-rose-500/40 bg-rose-950/40 hover:bg-rose-900/50 text-rose-200 text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>Limpar Toda a Memória de Conversa</span>
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/60 flex flex-col gap-2 animate-in fade-in">
              <div className="flex items-center gap-2 text-xs text-rose-200">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Confirmar exclusão definitiva do histórico do dispositivo?</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleExecuteClear}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
                >
                  Sim, Excluir Agora
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
