import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '../types/jarvis';
import { 
  Send, 
  Volume2, 
  ShieldAlert, 
  CheckCircle, 
  Globe, 
  Copy, 
  Terminal, 
  Sparkles,
  User,
  Cpu
} from 'lucide-react';

interface ConversationPanelProps {
  messages: ChatMessage[];
  inputText: string;
  onInputChange: (text: string) => void;
  onSendMessage: () => void;
  onSpeakMessage: (text: string) => void;
  isProcessing: boolean;
  onActionTrigger?: (action: any) => void;
}

export const ConversationPanel: React.FC<ConversationPanelProps> = ({
  messages,
  inputText,
  onInputChange,
  onSendMessage,
  onSpeakMessage,
  isProcessing,
  onActionTrigger,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard?.writeText(text);
  };

  return (
    <div className="w-full flex flex-col h-[480px] sm:h-[540px] rounded-2xl bg-slate-950/80 border border-cyan-500/30 overflow-hidden hud-panel">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-cyan-500/20 bg-slate-950/60 shrink-0">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <h3 className="font-hud font-bold text-sm text-cyan-200 tracking-wider">
            TERMINAL DE CONVERSAÇÃO // LOGS
          </h3>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">
          Contexto Ativo · Sanitizado
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent">
        {messages.map((msg) => {
          if (msg.sender === 'user') {
            return (
              <div key={msg.id} className="flex justify-end animate-in fade-in">
                <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-tr-sm bg-slate-800/90 border border-slate-700 p-3 text-slate-100 text-sm shadow-md">
                  <div className="flex items-center justify-between gap-4 mb-1 text-[10px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1 font-semibold text-slate-300">
                      <User className="w-3 h-3 text-cyan-400" />
                      <span>Você</span>
                    </span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                </div>
              </div>
            );
          }

          if (msg.sender === 'system') {
            return (
              <div key={msg.id} className="flex justify-center my-1 animate-in fade-in">
                <div className="px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/60 text-slate-400 text-xs font-mono text-center max-w-md">
                  {msg.text}
                </div>
              </div>
            );
          }

          // JARVIS Message
          return (
            <div key={msg.id} className="flex justify-start animate-in fade-in">
              <div className="max-w-[92%] sm:max-w-[85%] rounded-2xl rounded-tl-sm bg-slate-900/90 border border-cyan-500/30 p-3.5 text-slate-100 text-sm shadow-lg hud-border">
                {/* Message Header */}
                <div className="flex items-center justify-between gap-4 mb-2 pb-1.5 border-b border-cyan-500/15 text-[10px] text-slate-400 font-mono">
                  <div className="flex items-center gap-1.5 font-bold text-cyan-300 font-hud tracking-wider">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span>J.A.R.V.I.S.</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span>{msg.timestamp}</span>
                    <button
                      onClick={() => onSpeakMessage(msg.text)}
                      title="Ouvir resposta em voz alta"
                      className="p-1 rounded text-cyan-400 hover:text-cyan-200 hover:bg-cyan-950/60 transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => copyToClipboard(msg.text)}
                      title="Copiar texto"
                      className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Security Alert Badge if triggered */}
                {msg.securityAlert && (
                  <div className="mb-2.5 p-2 rounded-lg bg-rose-950/60 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-semibold">Alerta de Segurança:</strong>
                      <span>{msg.securityAlert.layer}</span>
                    </div>
                  </div>
                )}

                {/* Text Body */}
                <div className="whitespace-pre-wrap leading-relaxed text-slate-200 font-sans">
                  {msg.text}
                </div>

                {/* Grounding Web Search Sources if present */}
                {msg.grounding?.queries && msg.grounding.queries.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-cyan-500/15 flex items-center gap-1.5 text-[11px] text-cyan-400/90 font-mono">
                    <Globe className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span className="text-slate-400">Fontes web:</span>
                    <span className="truncate">{msg.grounding.queries.join(' · ')}</span>
                  </div>
                )}

                {/* Interactive Action Proposal Button if present */}
                {msg.actionProposal && msg.actionProposal.type === 'WHATSAPP_PROPOSAL' && (
                  <div className="mt-3 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between gap-2">
                    <div className="text-xs">
                      <span className="text-emerald-300 font-semibold block">Proposta de Mensagem WhatsApp</span>
                      <span className="text-[11px] text-slate-300">
                        Destino: {msg.actionProposal.payload.recipient || 'Contato'}
                      </span>
                    </div>
                    {onActionTrigger && (
                      <button
                        onClick={() => onActionTrigger(msg.actionProposal)}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors"
                      >
                        Revisar e Enviar
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex justify-start animate-in fade-in">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
              <span>JARVIS processando solicitação...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-cyan-500/20 bg-slate-950/90 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite ou fale para o JARVIS em pt-BR..."
            className="flex-1 bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isProcessing}
            aria-label="Enviar mensagem"
            className={`p-2.5 rounded-xl font-medium transition-all flex items-center justify-center ${
              inputText.trim() && !isProcessing
                ? 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] active:scale-95'
                : 'bg-slate-850 text-slate-600 cursor-not-allowed border border-slate-800'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
