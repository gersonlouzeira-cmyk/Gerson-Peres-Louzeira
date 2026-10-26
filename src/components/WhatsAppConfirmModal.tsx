import React, { useState } from 'react';
import { ActionProposal, ContactItem } from '../types/jarvis';
import { 
  Send, 
  X, 
  AlertTriangle, 
  Phone, 
  User, 
  MessageSquare, 
  CheckCircle2, 
  Contact, 
  ShieldCheck, 
  ExternalLink 
} from 'lucide-react';
import { pickContact } from '../services/androidBridge';

interface WhatsAppConfirmModalProps {
  proposal: ActionProposal;
  availableContacts: ContactItem[];
  onConfirm: (phone: string, text: string) => void;
  onCancel: () => void;
}

export const WhatsAppConfirmModal: React.FC<WhatsAppConfirmModalProps> = ({
  proposal,
  availableContacts,
  onConfirm,
  onCancel,
}) => {
  const [recipientName, setRecipientName] = useState(proposal.payload.recipient || 'Destinatário');
  const [recipientPhone, setRecipientPhone] = useState(proposal.payload.phone || '');
  const [messageText, setMessageText] = useState(proposal.payload.text || '');
  const [isEditing, setIsEditing] = useState(false);

  // If phone is missing, try to auto-match from saved contacts
  React.useEffect(() => {
    if (!recipientPhone && recipientName) {
      const match = availableContacts.find(
        (c) => c.name.toLowerCase() === recipientName.toLowerCase()
      );
      if (match) {
        setRecipientPhone(match.phone);
      }
    }
  }, [recipientName, recipientPhone, availableContacts]);

  // Handle native Android contact picker
  const handlePickNativeContact = async () => {
    const picked = await pickContact();
    if (picked) {
      setRecipientName(picked.name);
      setRecipientPhone(picked.phone);
    }
  };

  const isReadyToSend = messageText.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-950 border border-cyan-500/40 p-5 sm:p-6 shadow-[0_0_50px_rgba(6,182,212,0.35)] flex flex-col gap-4">
        {/* Holographic Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-hud font-bold text-base sm:text-lg text-emerald-300 tracking-wider">
                WHATSAPP // CONFIRMAÇÃO OBRIGATÓRIA
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                Camada 25 & 26: Confirmação Humana Explícita
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            aria-label="Cancelar envio"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Warning Notice */}
        <div className="p-2.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            <strong>Diretriz de Segurança JARVIS:</strong> Mensagens nunca são enviadas automaticamente. Você deve confirmar abaixo antes que o WhatsApp seja aberto.
          </span>
        </div>

        {/* Spoken Prompt Highlight */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/30 text-center">
          <p className="font-hud font-semibold text-sm sm:text-base text-emerald-300 hud-text-glow">
            "Posso enviar esta mensagem pelo WhatsApp?"
          </p>
          <span className="text-[11px] text-slate-400">
            Diga "Sim, enviar" ou toque no botão de confirmação
          </span>
        </div>

        {/* Form / Content Preview */}
        <div className="flex flex-col gap-3">
          {/* Recipient Field */}
          <div>
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between mb-1">
              <span>Destinatário:</span>
              <button
                type="button"
                onClick={handlePickNativeContact}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-normal"
              >
                <Contact className="w-3 h-3" />
                <span>Agenda Android</span>
              </button>
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Nome do contato (ex: Maria, João)"
                  className="w-full bg-slate-900/90 border border-slate-700 focus:border-cyan-400 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
                />
              </div>
              <input
                type="tel"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                placeholder="+55 (11) 9..."
                className="w-36 bg-slate-900/90 border border-slate-700 focus:border-cyan-400 rounded-lg px-2.5 py-2 text-xs font-mono text-cyan-300 placeholder-slate-500 focus:outline-none"
              />
            </div>

            {/* Quick Contact Chips if available */}
            {availableContacts.length > 0 && (
              <div className="mt-1.5 flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-[10px] text-slate-500 shrink-0">Sugestões:</span>
                {availableContacts.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setRecipientName(c.name);
                      setRecipientPhone(c.phone);
                    }}
                    className="whitespace-nowrap px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[10px] text-slate-300 hover:text-cyan-300 transition-colors"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Exact Message Preview / Edit */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">
                Mensagem a ser enviada:
              </label>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-[11px] text-cyan-400 hover:underline"
              >
                {isEditing ? 'Concluir Edição' : 'Editar Texto'}
              </button>
            </div>

            {isEditing ? (
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={3}
                className="w-full bg-slate-900/90 border border-cyan-500/50 rounded-lg p-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            ) : (
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-sm text-slate-200 break-words font-sans">
                "{messageText}"
              </div>
            )}
          </div>

          {/* Technical Disclosure Notice */}
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Ao confirmar, o JARVIS abrirá o aplicativo oficial do WhatsApp no seu dispositivo com a mensagem preenchida para que você faça o envio manual seguro.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
          <button
            onClick={onCancel}
            type="button"
            className="flex-1 py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs sm:text-sm font-medium transition-colors"
          >
            Cancelar Envio ("Não")
          </button>

          <button
            onClick={() => onConfirm(recipientPhone, messageText)}
            disabled={!isReadyToSend}
            type="button"
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1.5 ${
              isReadyToSend
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Confirmar e Abrir WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
