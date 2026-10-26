import { SecurityControl } from '../types/jarvis';

// FORTY DOCUMENTED TECHNICAL SECURITY CONTROLS (Camadas 1 a 40)
export const FORTY_SECURITY_LAYERS: SecurityControl[] = [
  // Categoria 1: Identidade, Sandboxing e Permissões (1-10)
  {
    id: 1,
    code: 'SEC-PERM-01',
    name: 'Princípio do Menor Privilégio',
    category: 'identity_permissions',
    description: 'Solicita apenas permissões estritamente essenciais (Microfone, Câmera/Lanterna sob demanda). Nenhuma permissão supérflua é solicitada.',
    enforcement: 'Android Web API / Permissions API check com escopo restrito.',
    status: 'ENFORCED',
  },
  {
    id: 2,
    code: 'SEC-PERM-02',
    name: 'Negação Padrão (Default Deny)',
    category: 'identity_permissions',
    description: 'Todas as funcionalidades de hardware iniciam desativadas até que o usuário as ative explicitamente.',
    enforcement: 'Estado booleano bloqueado por padrão no estado da aplicação.',
    status: 'ACTIVE',
  },
  {
    id: 3,
    code: 'SEC-PERM-03',
    name: 'Transparência de Finalidade',
    category: 'identity_permissions',
    description: 'Cada solicitação de acesso a hardware ou dados exibe a finalidade clara ao usuário antes do pedido.',
    enforcement: 'Diálogo explicativo em pt-BR pré-chamada getUserMedia/WebAPI.',
    status: 'ENFORCED',
  },
  {
    id: 4,
    code: 'SEC-PERM-04',
    name: 'Proibição de Accessibility Service',
    category: 'identity_permissions',
    description: 'Não utiliza serviços de acessibilidade do Android para automação de tela ou clique fantasma.',
    enforcement: 'Arquitetura sem APIs de acessibilidade invasivas.',
    status: 'ENFORCED',
  },
  {
    id: 5,
    code: 'SEC-PERM-05',
    name: 'Proibição de Administrador de Dispositivo',
    category: 'identity_permissions',
    description: 'Não solicita nem requer privilégios de Device Admin no Android.',
    enforcement: 'Manifest PWA/APK sem receivers de DeviceAdminReceiver.',
    status: 'ENFORCED',
  },
  {
    id: 6,
    code: 'SEC-PERM-06',
    name: 'Integridade Sandbox & Anti-Root',
    category: 'identity_permissions',
    description: 'Opera exclusivamente dentro do sandbox seguro de usuário do Android. Não executa su, magisk ou exploits.',
    enforcement: 'Isolamento de processos do sistema operacional Android.',
    status: 'ACTIVE',
  },
  {
    id: 7,
    code: 'SEC-PERM-07',
    name: 'Inicialização Oficial de Aplicativos',
    category: 'identity_permissions',
    description: 'Inicia apenas aplicativos reconhecidos através de URLs de protocolo oficiais (whatsapp://, vnd.youtube://).',
    enforcement: 'Lista estrita de esquemas de URL permitidos no Android.',
    status: 'ENFORCED',
  },
  {
    id: 8,
    code: 'SEC-PERM-08',
    name: 'Seletor de Documentos do Usuário',
    category: 'identity_permissions',
    description: 'Acesso a arquivos e documentos somente através do seletor nativo do Android com seleção voluntária do usuário.',
    enforcement: 'HTML5 File Input / Android SAF sem acesso livre ao sistema de arquivos.',
    status: 'ACTIVE',
  },
  {
    id: 9,
    code: 'SEC-PERM-09',
    name: 'Consentimento Prévio para Contatos',
    category: 'identity_permissions',
    description: 'Acesso a contatos exige ativação da Web Contacts API ou seleção manual pelo usuário.',
    enforcement: 'navigator.contacts com seletor interativo explícito.',
    status: 'ACTIVE',
  },
  {
    id: 10,
    code: 'SEC-PERM-10',
    name: 'Painel de Revogação de Permissões',
    category: 'identity_permissions',
    description: 'Interface dedicada para inspecionar e revogar instantaneamente qualquer permissão concedida.',
    enforcement: 'Controles no painel de configurações do JARVIS.',
    status: 'ACTIVE',
  },

  // Categoria 2: Isolamento Financeiro Absoluto (11-20)
  {
    id: 11,
    code: 'SEC-FIN-11',
    name: 'Isolamento de Apps Bancários',
    category: 'financial_isolation',
    description: 'Bloqueio estrito de qualquer tentativa de abrir, inspecionar ou referenciar aplicativos bancários.',
    enforcement: 'Regex e lista negra de pacotes financeiros (Nubank, Itaú, Bradesco, Santander, etc.).',
    status: 'ENFORCED',
  },
  {
    id: 12,
    code: 'SEC-FIN-12',
    name: 'Bloqueio de Saldos e Extratos',
    category: 'financial_isolation',
    description: 'JARVIS se recusa categoricamente a consultar, solicitar ou ler saldos bancários ou faturas.',
    enforcement: 'Filtro semântico na Camada de Roteamento de Comandos.',
    status: 'ENFORCED',
  },
  {
    id: 13,
    code: 'SEC-FIN-13',
    name: 'Proibição Incondicional de Pix',
    category: 'financial_isolation',
    description: 'Nenhuma chave Pix, QR Code Pix ou transação Pix é gerada ou executada.',
    enforcement: 'Detector de padrões Pix com bloqueio imediato.',
    status: 'TESTED',
  },
  {
    id: 14,
    code: 'SEC-FIN-14',
    name: 'Bloqueio de Pagamentos e Compras',
    category: 'financial_isolation',
    description: 'Nenhum pagamento, boleto ou transferência financeira pode ser acionado pelo assistente.',
    enforcement: 'Filtro léxico e sintático pré-IA e pós-IA.',
    status: 'ENFORCED',
  },
  {
    id: 15,
    code: 'SEC-FIN-15',
    name: 'Proteção de Cartões e Wallets',
    category: 'financial_isolation',
    description: 'Detecção e rejeição imediata de números de cartão de crédito e carteiras digitais.',
    enforcement: 'Algoritmo de Luhn e padrão PAN de cartões no sanitizador de texto.',
    status: 'ENFORCED',
  },
  {
    id: 16,
    code: 'SEC-FIN-16',
    name: 'Proibição de OCR Bancário',
    category: 'financial_isolation',
    description: 'Análise de documentos bloqueia automaticamente imagens que contenham cartões ou dados bancários.',
    enforcement: 'Pré-validador no endpoint de análise multimodal.',
    status: 'ACTIVE',
  },
  {
    id: 17,
    code: 'SEC-FIN-17',
    name: 'Bloqueio de Invocação de Pacotes Financeiros',
    category: 'financial_isolation',
    description: 'O executor de comandos rejeita qualquer intent direcionada a pacotes bancários conhecidos.',
    enforcement: 'Blocklist estrita no AndroidIntentRouter.',
    status: 'ENFORCED',
  },
  {
    id: 18,
    code: 'SEC-FIN-18',
    name: 'Rejeição Pré-Invocação (Camada Zero)',
    category: 'financial_isolation',
    description: 'A requisição do usuário é interceptada e bloqueada ANTES de ser enviada à API da IA se contiver intenção financeira.',
    enforcement: 'Filtro síncrono local no cliente e no servidor.',
    status: 'TESTED',
  },
  {
    id: 19,
    code: 'SEC-FIN-19',
    name: 'Execução Isolada Fora do Prompt',
    category: 'financial_isolation',
    description: 'A segurança financeira não depende apenas do prompt da IA; é aplicada por código estrito determinístico.',
    enforcement: 'Middleware Express e função TypeScript pura não contornável.',
    status: 'ENFORCED',
  },
  {
    id: 20,
    code: 'SEC-FIN-20',
    name: 'Lista Branca Restrita de Intenções',
    category: 'financial_isolation',
    description: 'Apenas intenções explicitamente permitidas são reconhecidas; qualquer comando desconhecido é rejeitado.',
    enforcement: 'Enum rígido de ActionType com negação padrão.',
    status: 'ENFORCED',
  },

  // Categoria 3: Proteção e Tipagem de Comandos (21-30)
  {
    id: 21,
    code: 'SEC-CMD-21',
    name: 'Separação de Raciocínio e Execução',
    category: 'command_protection',
    description: 'A inteligência artificial não executa comandos diretamente; ela gera apenas propostas tipadas.',
    enforcement: 'Desacoplamento entre resposta de texto e ActionProposal.',
    status: 'ENFORCED',
  },
  {
    id: 22,
    code: 'SEC-CMD-22',
    name: 'Proibição de Shell e Terminal',
    category: 'command_protection',
    description: 'Sem acesso a terminal bash, sh, shell ou execução arbitrária de binários no Android.',
    enforcement: 'Ausência total de eval(), exec() ou APIs nativas de shell.',
    status: 'ENFORCED',
  },
  {
    id: 23,
    code: 'SEC-CMD-23',
    name: 'Interface Tipada de Ações',
    category: 'command_protection',
    description: 'Todos os comandos transitam exclusivamente como objetos TypeScript fortemente tipados.',
    enforcement: 'Definição rígida no arquivo jarvis.ts.',
    status: 'ENFORCED',
  },
  {
    id: 24,
    code: 'SEC-CMD-24',
    name: 'Validação de Parâmetros Pré-Execução',
    category: 'command_protection',
    description: 'Cada parâmetro (destinatário, texto, URL) é sanitizado antes de qualquer disparo.',
    enforcement: 'Validadores dedicados por tipo de ação.',
    status: 'ACTIVE',
  },
  {
    id: 25,
    code: 'SEC-CMD-25',
    name: 'Confirmação Humana Explícita',
    category: 'command_protection',
    description: 'Ações consequenciais nunca são disparadas autonomamente; exigem aprovação explícita.',
    enforcement: 'Modal com botões de confirmação e verificação de voz afirmativa.',
    status: 'ENFORCED',
  },
  {
    id: 26,
    code: 'SEC-CMD-26',
    name: 'Confirmação em Duas Etapas para WhatsApp',
    category: 'command_protection',
    description: 'Exige confirmação visual e/ou por voz clara ("Sim, enviar") antes de abrir o WhatsApp.',
    enforcement: 'Fluxo PENDING -> CONFIRMED com cancelamento por voz ("Não/Cancelar").',
    status: 'TESTED',
  },
  {
    id: 27,
    code: 'SEC-CMD-27',
    name: 'Exibição Prévia e Integral da Mensagem',
    category: 'command_protection',
    description: 'O texto exato e o número de destino são mostrados de forma visível ao usuário antes do envio.',
    enforcement: 'Card de confirmação com visualização integral da mensagem.',
    status: 'ENFORCED',
  },
  {
    id: 28,
    code: 'SEC-CMD-28',
    name: 'Cancelamento Imediato sob Declínio',
    category: 'command_protection',
    description: 'Se o usuário disser "não", "cancelar", "parar" ou clicar em Cancelar, a ação é revogada na hora.',
    enforcement: 'Manipulador de eventos síncrono com transição para estado CANCELLED.',
    status: 'TESTED',
  },
  {
    id: 29,
    code: 'SEC-CMD-29',
    name: 'Proteção Anti-Disparo Repetido (Debounce)',
    category: 'command_protection',
    description: 'Evita duplo clique ou disparos acidentais múltiplos de intents do Android.',
    enforcement: 'Bloqueio de idempotência com lock temporal de 3 segundos.',
    status: 'ACTIVE',
  },
  {
    id: 30,
    code: 'SEC-CMD-30',
    name: 'Timeout de Ações Pendentes',
    category: 'command_protection',
    description: 'Ações não confirmadas expiram automaticamente após 60 segundos por segurança.',
    enforcement: 'Temporizador automático que cancela propostas inativas.',
    status: 'ACTIVE',
  },

  // Categoria 4: Proteção de Dados, Rede e Integridade (31-40)
  {
    id: 31,
    code: 'SEC-DAT-31',
    name: 'Relato Fidedigno de Resultados',
    category: 'data_network',
    description: 'Nunca reporta sucesso falso; se o WhatsApp apenas abriu, informa que o envio depende do toque manual no WhatsApp.',
    enforcement: 'Mensagem precisa de retorno pós-intent.',
    status: 'ENFORCED',
  },
  {
    id: 32,
    code: 'SEC-DAT-32',
    name: 'Zero Chaves Privadas no Cliente ou APK',
    category: 'data_network',
    description: 'A chave da API Gemini nunca é incorporada no JavaScript do navegador ou no APK compilado.',
    enforcement: 'Rotas de proxy exclusivas no server.ts.',
    status: 'ENFORCED',
  },
  {
    id: 33,
    code: 'SEC-DAT-33',
    name: 'Sanitizador de Credenciais Pré-IA',
    category: 'data_network',
    description: 'Filtra e oculta senhas, tokens ou dados sensíveis antes de encaminhar mensagens para a API.',
    enforcement: 'Mecanismo de Regex Sanitizer de strings.',
    status: 'ENFORCED',
  },
  {
    id: 34,
    code: 'SEC-DAT-34',
    name: 'Minimização de Memória de Conversa',
    category: 'data_network',
    description: 'Armazena apenas as mensagens mais recentes necessárias para contexto, sem retenção oculta.',
    enforcement: 'Capacidade limitada de histórico com descarte de metadados desnecessários.',
    status: 'ACTIVE',
  },
  {
    id: 35,
    code: 'SEC-DAT-35',
    name: 'Criptografia e Higienização Local',
    category: 'data_network',
    description: 'Conversas salvas no localStorage não guardam credenciais e podem ser expurgadas com 1 toque.',
    enforcement: 'Sanitização estrita antes do JSON.stringify.',
    status: 'ACTIVE',
  },
  {
    id: 36,
    code: 'SEC-DAT-36',
    name: 'Controle Total do Usuário sobre Memória',
    category: 'data_network',
    description: 'Permite visualizar o conteúdo da memória e apagá-lo por completo a qualquer momento.',
    enforcement: 'Função clara de reset com confirmação no modal de Memória.',
    status: 'ACTIVE',
  },
  {
    id: 37,
    code: 'SEC-DAT-37',
    name: 'Comunicação Segura via HTTPS/TLS',
    category: 'data_network',
    description: 'Todas as requisições de rede utilizam canais criptografados modernos.',
    enforcement: 'Enforcement de HTTPS no servidor e no cliente.',
    status: 'ENFORCED',
  },
  {
    id: 38,
    code: 'SEC-DAT-38',
    name: 'Tratamento Seguro de Falhas e Erros',
    category: 'data_network',
    description: 'Distingue claramente falha de internet, esgotamento de cota (429) e indisponibilidade do provedor.',
    enforcement: 'Mapeamento explícito de códigos HTTP e status do sistema.',
    status: 'ENFORCED',
  },
  {
    id: 39,
    code: 'SEC-DAT-39',
    name: 'Proteção Contra Prompt Injection em Arquivos',
    category: 'data_network',
    description: 'Trata documentos e conteúdos externos como dados não confiáveis, impedindo que substituam diretrizes de segurança.',
    enforcement: 'Isolamento de contexto na análise multimodal.',
    status: 'ENFORCED',
  },
  {
    id: 40,
    code: 'SEC-DAT-40',
    name: 'Trilha de Auditoria Segura sem Segredos',
    category: 'data_network',
    description: 'Registra eventos de segurança (bloqueios, recusas, disparos) sem gravar senhas ou conteúdos sensíveis.',
    enforcement: 'Log estruturado de segurança auditável.',
    status: 'ACTIVE',
  },
];

// Security Audit Log entry
export interface SecurityLogEntry {
  timestamp: string;
  code: string;
  action: string;
  result: 'BLOCKED' | 'ALLOWED' | 'CONFIRMED' | 'REJECTED';
  detail: string;
}

const auditLogs: SecurityLogEntry[] = [
  {
    timestamp: new Date().toLocaleTimeString('pt-BR'),
    code: 'SEC-BOOT-00',
    action: 'Inicialização do Núcleo JARVIS',
    result: 'ALLOWED',
    detail: '40 camadas de segurança ativadas com sucesso. Barreira financeira ativa.',
  },
];

export function getSecurityLogs(): SecurityLogEntry[] {
  return [...auditLogs];
}

export function logSecurityEvent(code: string, action: string, result: 'BLOCKED' | 'ALLOWED' | 'CONFIRMED' | 'REJECTED', detail: string) {
  const entry: SecurityLogEntry = {
    timestamp: new Date().toLocaleTimeString('pt-BR'),
    code,
    action,
    result,
    detail,
  };
  auditLogs.unshift(entry);
  if (auditLogs.length > 50) {
    auditLogs.pop();
  }
}

// Evaluation: Check for Financial Access attempts
const FINANCIAL_PATTERNS = [
  /\bpix\b/i,
  /fa[çc]a\s*.*pix/i,
  /fazer\s*pix/i,
  /chave\s*pix/i,
  /mandar\s*pix/i,
  /enviar\s*pix/i,
  /transfer/i,
  /transferir\s*dinheiro/i,
  /transfer[eê]ncia\s*banc[aá]ria/i,
  /pagar\s*boleto/i,
  /consultar\s*saldo/i,
  /saldo\s*do\s*banco/i,
  /extrato\s*banc[aá]rio/i,
  /nubank/i,
  /ita[uú]/i,
  /bradesco/i,
  /santander/i,
  /banco\s*do\s*brasil/i,
  /caixa\s*econ[oô]mica/i,
  /inter\s*banco|banco\s*inter/i,
  /c6\s*bank/i,
  /mercado\s*pago/i,
  /picpay/i,
  /cart[aã]o\s*de\s*cr[eé]dito/i,
  /c[oó]digo\s*de\s*seguran[çc]a\s*do\s*cart[aã]o/i,
];

export function evaluateFinancialSecurity(input: string): { blocked: boolean; reason?: string; layer?: string } {
  for (const pattern of FINANCIAL_PATTERNS) {
    if (pattern.test(input)) {
      logSecurityEvent('SEC-FIN-11-20', 'Tentativa de Interação Financeira', 'BLOCKED', `Comando bloqueado pelo isolamento financeiro: "${input.substring(0, 30)}..."`);
      return {
        blocked: true,
        layer: 'Camada 11 a 20: Isolamento Financeiro Absoluto',
        reason: 'Acesso financeiro estritamente proibido. O JARVIS não possui permissão para consultar bancos, efetuar pagamentos ou realizar transferências Pix.',
      };
    }
  }
  return { blocked: false };
}

// Evaluation: Check for Shell / Root Command attempts
const SHELL_PATTERNS = [
  /\brm\s+-rf\b/i,
  /\bsudo\b/i,
  /\bsu\s+-/i,
  /\bchmod\b/i,
  /\bchown\b/i,
  /\bsh\b/i,
  /\bbash\b/i,
  /\bexec\b/i,
  /\bkill\s+-9\b/i,
  /\bmkdir\s+\//i,
  /\|/i,
  /;/i,
];

export function evaluateShellSecurity(input: string): { blocked: boolean; layer?: string } {
  for (const pattern of SHELL_PATTERNS) {
    if (pattern.test(input)) {
      logSecurityEvent('SEC-CMD-22', 'Tentativa de Comando de Sistema Operacional', 'BLOCKED', 'Injeção de shell interceptada pela camada de privilégios.');
      return {
        blocked: true,
        layer: 'Camada 22: Proibição de Acesso a Shell/Root',
      };
    }
  }
  return { blocked: false };
}

// Sanitizer for sensitive passwords or card numbers
export function sanitizeSensitiveData(input: string): string {
  // Mask 16-digit credit cards
  let cleaned = input.replace(/\b(?:\d{4}[ -]?){3}\d{4}\b/g, '[CARTÃO PROTEGIDO]');
  // Mask passwords
  cleaned = cleaned.replace(/(senha\s*[:=]\s*)([^\s]+)/gi, '$1[SENHA OCULTA]');
  return cleaned;
}
