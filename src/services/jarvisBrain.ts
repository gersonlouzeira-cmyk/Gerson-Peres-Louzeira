import { ChatMessage, SystemStatus, ContactItem } from '../types/jarvis';
import { evaluateFinancialSecurity, evaluateShellSecurity, sanitizeSensitiveData, logSecurityEvent } from './securityEngine';
import { getFormattedDateTime } from './androidBridge';

const STORAGE_KEY_MESSAGES = 'jarvis_conversation_memory_v1';
const STORAGE_KEY_CONTACTS = 'jarvis_contacts_v1';

// Initial welcoming contact suggestions
export const DEFAULT_CONTACTS: ContactItem[] = [
  { id: '1', name: 'Mãe', phone: '+5511988887777', relationship: 'Família' },
  { id: '2', name: 'Pai', phone: '+5511977776666', relationship: 'Família' },
  { id: '3', name: 'João', phone: '+5511999990001', relationship: 'Amigo' },
  { id: '4', name: 'Maria', phone: '+5511999990002', relationship: 'Colega de Trabalho' },
];

// Offline Local Rule Engine (Used when offline or AI service unavailable)
export function processOfflineCommand(input: string): { response: string; action?: any; isLocal: boolean } {
  const normalized = input.toLowerCase().trim();

  // Lanterna
  if (normalized.includes('lanterna')) {
    const isOff = normalized.includes('deslig') || normalized.includes('apagar');
    return {
      response: isOff ? 'Sim, senhor. Desligando a lanterna do dispositivo.' : 'Com certeza, senhor. Ativando a lanterna do dispositivo.',
      action: {
        type: 'FLASHLIGHT',
        payload: { state: isOff ? 'off' : 'on' },
      },
      isLocal: true,
    };
  }

  // Data e hora
  if (normalized.includes('horas') || normalized.includes('hora') || normalized.includes('data') || normalized.includes('dia')) {
    const dt = getFormattedDateTime();
    return {
      response: `Senhor, ${dt.text}`,
      action: {
        type: 'READ_DATETIME',
        payload: {},
      },
      isLocal: true,
    };
  }

  // Abrir apps
  if (normalized.includes('youtube')) {
    return {
      response: 'Inicializando o YouTube no Android, senhor.',
      action: { type: 'OPEN_APP', payload: { app: 'youtube' } },
      isLocal: true,
    };
  }

  if (normalized.includes('whatsapp') && !normalized.includes('mensagem')) {
    return {
      response: 'Abrindo o aplicativo WhatsApp, senhor.',
      action: { type: 'OPEN_APP', payload: { app: 'whatsapp' } },
      isLocal: true,
    };
  }

  if (normalized.includes('free fire')) {
    return {
      response: 'Executando o Free Fire no dispositivo, senhor.',
      action: { type: 'OPEN_APP', payload: { app: 'freefire' } },
      isLocal: true,
    };
  }

  if (normalized.includes('câmera') || normalized.includes('camera') || normalized.includes('foto')) {
    return {
      response: 'Acionando a câmera do dispositivo, senhor.',
      action: { type: 'OPEN_APP', payload: { app: 'camera' } },
      isLocal: true,
    };
  }

  if (normalized.includes('configurações') || normalized.includes('configuracoes')) {
    return {
      response: 'Abrindo as configurações do sistema Android, senhor.',
      action: { type: 'OPEN_APP', payload: { app: 'settings' } },
      isLocal: true,
    };
  }

  // Mensagem WhatsApp offline
  if (normalized.includes('mensagem') || normalized.includes('mande') || normalized.includes('diga')) {
    return {
      response: 'Comando de mensagem recebido. Para preparar o envio pelo WhatsApp com segurança, favor informar o destinatário e o texto exato.',
      action: {
        type: 'WHATSAPP_PROPOSAL',
        payload: { recipient: 'Contato', text: input },
      },
      isLocal: true,
    };
  }

  // Quem é você
  if (normalized.includes('quem é você') || normalized.includes('quem e voce') || normalized.includes('o que você faz')) {
    return {
      response: 'Sou o J.A.R.V.I.S., seu assistente de inteligência artificial futurista. Opero com 40 camadas técnicas de segurança, controle de aplicativos Android, controle de lanterna e auxílio seguro de mensagens WhatsApp com confirmação explícita.',
      isLocal: true,
    };
  }

  // Fallback offline
  return {
    response: `Modo Offline Ativo. O comando "${input}" não pôde ser processado pelo cérebro em nuvem pois a conexão externa está inativa. Comandos locais disponíveis: "Ligar lanterna", "Que horas são", "Abrir YouTube", "Abrir WhatsApp", "Abrir Free Fire".`,
    isLocal: true,
  };
}

// Conversation Memory Management with sanitization and security
export function loadSavedConversation(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_MESSAGES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Erro ao carregar histórico local:', e);
  }

  // Initial greeting
  return [
    {
      id: 'jarvis-boot',
      sender: 'jarvis',
      text: 'Sistemas online. J.A.R.V.I.S. pronto para executar suas ordens, senhor. Microfone, HUD tático e 40 camadas de segurança operacionais.',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    },
  ];
}

export function saveConversation(messages: ChatMessage[]) {
  try {
    // Keep max 30 recent messages for privacy and A04 memory efficiency
    const sanitized = messages.slice(-30).map((msg) => ({
      ...msg,
      text: sanitizeSensitiveData(msg.text),
    }));
    localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(sanitized));
  } catch (e) {
    console.warn('Erro ao salvar conversa:', e);
  }
}

export function clearConversationMemory(): ChatMessage[] {
  try {
    localStorage.removeItem(STORAGE_KEY_MESSAGES);
    logSecurityEvent('SEC-DAT-36', 'Exclusão de Memória', 'CONFIRMED', 'Usuário realizou expurgo completo do histórico de conversação.');
  } catch (e) {}

  return [
    {
      id: 'jarvis-cleared-' + Date.now(),
      sender: 'system',
      text: 'Memória de conversação apagada com sucesso. Registro local expurgado conforme Camada 36 de Segurança.',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    },
  ];
}

// Contacts Management
export function loadSavedContacts(): ContactItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CONTACTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return DEFAULT_CONTACTS;
}

export function saveContact(contact: ContactItem): ContactItem[] {
  const current = loadSavedContacts();
  const updated = [contact, ...current.filter((c) => c.phone !== contact.phone)];
  try {
    localStorage.setItem(STORAGE_KEY_CONTACTS, JSON.stringify(updated));
  } catch (e) {}
  return updated;
}

// Main Send Message Function coordinating Security and Backend
export async function sendQueryToJarvis(
  userInput: string,
  history: ChatMessage[],
  enableSearch: boolean = false
): Promise<{
  text: string;
  action?: any;
  status: SystemStatus;
  grounding?: any;
  securityAlert?: any;
}> {
  const sanitizedInput = sanitizeSensitiveData(userInput.trim());

  // 1. Security Check: Financial Isolation (Camada 11-20)
  const financialCheck = evaluateFinancialSecurity(sanitizedInput);
  if (financialCheck.blocked) {
    return {
      text: 'Acesso financeiro bloqueado pela Diretriz de Segurança JARVIS (Camadas 11 a 20). Operações bancárias, transferências Pix e manipulação de credenciais financeiras estão permanentemente isoladas por segurança.',
      action: {
        type: 'BLOCKED_FINANCIAL',
        payload: { reason: financialCheck.reason },
      },
      status: 'ONLINE',
      securityAlert: {
        layer: financialCheck.layer || 'Isolamento Financeiro',
        blocked: true,
      },
    };
  }

  // 2. Security Check: Shell / Command Injection (Camada 22)
  const shellCheck = evaluateShellSecurity(sanitizedInput);
  if (shellCheck.blocked) {
    return {
      text: 'Tentativa de execução de comando de sistema operacional interceptada. O subsistema JARVIS não possui acesso a terminal ou shell (Camada 22).',
      status: 'ONLINE',
      securityAlert: {
        layer: shellCheck.layer || 'Proibição de Shell',
        blocked: true,
      },
    };
  }

  // 3. Check Network Connectivity
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    const local = processOfflineCommand(sanitizedInput);
    return {
      text: local.response,
      action: local.action,
      status: 'NO_INTERNET',
    };
  }

  // 4. Call Server-side Gemini API Proxy
  try {
    const response = await fetch('/api/jarvis/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: sanitizedInput,
        history: history.slice(-6).map((m) => ({ sender: m.sender, text: m.text })),
        enableSearch,
      }),
    });

    if (response.status === 429) {
      const local = processOfflineCommand(sanitizedInput);
      return {
        text: `Limite de taxa de IA excedido temporariamente. Resposta local: ${local.response}`,
        action: local.action,
        status: 'RATE_LIMIT_EXCEEDED',
      };
    }

    if (response.status === 503) {
      const local = processOfflineCommand(sanitizedInput);
      return {
        text: `Serviço de IA não configurado no servidor. Executando via Regras Locais: ${local.response}`,
        action: local.action,
        status: 'AI_NOT_CONFIGURED',
      };
    }

    if (!response.ok) {
      const local = processOfflineCommand(sanitizedInput);
      return {
        text: `Serviço de IA temporariamente indisponível. Resposta local: ${local.response}`,
        action: local.action,
        status: 'AI_SERVICE_UNAVAILABLE',
      };
    }

    const data = await response.json();
    return {
      text: data.response || 'Comando processado, senhor.',
      action: data.action,
      grounding: data.grounding,
      securityAlert: data.securityAlert,
      status: (data.status as SystemStatus) || 'ONLINE',
    };
  } catch (networkError) {
    console.warn('Falha na requisição ao backend JARVIS, caindo para modo local:', networkError);
    const local = processOfflineCommand(sanitizedInput);
    return {
      text: local.response,
      action: local.action,
      status: 'OFFLINE_MODE',
    };
  }
}
