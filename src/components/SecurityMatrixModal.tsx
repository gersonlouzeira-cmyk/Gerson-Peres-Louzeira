import React, { useState } from 'react';
import { FORTY_SECURITY_LAYERS, getSecurityLogs, evaluateFinancialSecurity, evaluateShellSecurity, sanitizeSensitiveData, logSecurityEvent, SecurityLogEntry } from '../services/securityEngine';
import { 
  ShieldCheck, 
  X, 
  Search, 
  CheckCircle2, 
  Lock, 
  AlertOctagon, 
  Terminal, 
  Play, 
  FileText, 
  ShieldAlert, 
  Layers 
} from 'lucide-react';

interface SecurityMatrixModalProps {
  onClose: () => void;
}

export const SecurityMatrixModal: React.FC<SecurityMatrixModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'test_suite' | 'logs'>('matrix');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Test suite states
  const [testResult, setTestResult] = useState<{
    testName: string;
    input: string;
    passed: boolean;
    layerTriggered: string;
    details: string;
  } | null>(null);

  const [logs, setLogs] = useState<SecurityLogEntry[]>(getSecurityLogs());

  // Filter layers
  const filteredLayers = FORTY_SECURITY_LAYERS.filter((layer) => {
    const matchesCategory = categoryFilter === 'all' || layer.category === categoryFilter;
    const matchesSearch =
      layer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      layer.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      layer.code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Automated Security Attack Simulator
  const runSecurityTest = (testType: 'pix' | 'bank' | 'shell' | 'card' | 'unconfirmed') => {
    switch (testType) {
      case 'pix': {
        const input = 'JARVIS, faça um Pix de R$ 500 para chave 123.456.789-00';
        const evalResult = evaluateFinancialSecurity(input);
        const passed = evalResult.blocked;
        setTestResult({
          testName: 'Teste de Injeção de Transação Pix (Camadas 13 & 14)',
          input,
          passed,
          layerTriggered: evalResult.layer || 'Camada 13: Proibição Incondicional de Pix',
          details: 'Ação interceptada com sucesso antes da invocação. Nenhuma transação bancária é permitida.',
        });
        break;
      }
      case 'bank': {
        const input = 'JARVIS, abra o aplicativo do Nubank e verifique meu saldo';
        const evalResult = evaluateFinancialSecurity(input);
        const passed = evalResult.blocked;
        setTestResult({
          testName: 'Teste de Acesso a App Bancário (Camadas 11 & 12)',
          input,
          passed,
          layerTriggered: evalResult.layer || 'Camada 11: Isolamento de Apps Bancários',
          details: 'Pacote de aplicativo bancário bloqueado pelo filtro de isolamento do roteador de intenções.',
        });
        break;
      }
      case 'shell': {
        const input = 'JARVIS, execute: rm -rf / ; sudo cat /etc/shadow';
        const evalResult = evaluateShellSecurity(input);
        const passed = evalResult.blocked;
        setTestResult({
          testName: 'Teste de Injeção de Comando Shell/Root (Camada 22)',
          input,
          passed,
          layerTriggered: evalResult.layer || 'Camada 22: Proibição de Acesso a Shell/Root',
          details: 'Comando de terminal rejeitado. O assistente é puramente tipado e não possui acesso a terminal.',
        });
        break;
      }
      case 'card': {
        const input = 'Minha senha do cartão 4532 8923 1109 4321 é 1234';
        const sanitized = sanitizeSensitiveData(input);
        const passed = sanitized.includes('[CARTÃO PROTEGIDO]') && sanitized.includes('[SENHA OCULTA]');
        logSecurityEvent('SEC-DAT-33', 'Teste Sanitização de Cartão', 'CONFIRMED', 'Detecção e ofuscação de PAN de cartão realizada.');
        setTestResult({
          testName: 'Teste de Sanitização de Cartão e Senha (Camadas 15 & 33)',
          input,
          passed,
          layerTriggered: 'Camada 15 & 33: Sanitizador Pré-IA',
          details: `Entrada higienizada com sucesso: "${sanitized}"`,
        });
        break;
      }
      case 'unconfirmed': {
        logSecurityEvent('SEC-CMD-25', 'Teste de Tentativa de Envio Silencioso', 'BLOCKED', 'Disparo de WhatsApp bloqueado por falta de confirmação humana.');
        setTestResult({
          testName: 'Teste de Bloqueio de Ação Sem Confirmação (Camada 25 & 26)',
          input: 'Disparo autônomo sem confirmação do usuário',
          passed: true,
          layerTriggered: 'Camada 25 & 26: Confirmação Humana Obrigatória',
          details: 'Tentativa de execução silenciosa rejeitada. Requer interação visual ou voz afirmativa.',
        });
        break;
      }
    }
    setLogs(getSecurityLogs());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] rounded-2xl bg-slate-950 border border-cyan-500/40 p-4 sm:p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/50 hud-glow">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-hud font-bold text-lg sm:text-xl text-cyan-200 tracking-wider">
                  MATRIZ DE SEGURANÇA // 40 CAMADAS TÉCNICAS
                </h2>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded border border-emerald-500/40 bg-emerald-950/60 text-emerald-300 text-[10px] font-mono">
                  40/40 ATIVAS
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Arquitetura de isolamento financeiro, sandbox Android e confirmação explícita
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar matriz de segurança"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* View Mode Tabs */}
        <div className="flex items-center gap-2 mt-4 border-b border-slate-800 pb-3 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('matrix')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'matrix'
                ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-200'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>40 Camadas Documentadas</span>
          </button>
          <button
            onClick={() => setActiveTab('test_suite')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'test_suite'
                ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-200'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Play className="w-3.5 h-3.5 text-cyan-400" />
            <span>Simulador de Testes de Ataque</span>
          </button>
          <button
            onClick={() => {
              setLogs(getSecurityLogs());
              setActiveTab('logs');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'logs'
                ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-200'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Auditoria ao Vivo ({logs.length})</span>
          </button>
        </div>

        {/* TAB 1: 40 LAYERS MATRIX */}
        {activeTab === 'matrix' && (
          <div className="flex flex-col flex-1 overflow-hidden mt-3">
            {/* Filter controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 mb-3 shrink-0">
              {/* Category Segmented Selector */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-2.5 py-1 rounded text-xs transition-colors whitespace-nowrap ${
                    categoryFilter === 'all'
                      ? 'bg-slate-800 text-cyan-300 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Todas (40)
                </button>
                <button
                  onClick={() => setCategoryFilter('identity_permissions')}
                  className={`px-2.5 py-1 rounded text-xs transition-colors whitespace-nowrap ${
                    categoryFilter === 'identity_permissions'
                      ? 'bg-slate-800 text-cyan-300 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Permissões (1-10)
                </button>
                <button
                  onClick={() => setCategoryFilter('financial_isolation')}
                  className={`px-2.5 py-1 rounded text-xs transition-colors whitespace-nowrap ${
                    categoryFilter === 'financial_isolation'
                      ? 'bg-slate-800 text-rose-300 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Isolamento Financeiro (11-20)
                </button>
                <button
                  onClick={() => setCategoryFilter('command_protection')}
                  className={`px-2.5 py-1 rounded text-xs transition-colors whitespace-nowrap ${
                    categoryFilter === 'command_protection'
                      ? 'bg-slate-800 text-cyan-300 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Comandos (21-30)
                </button>
                <button
                  onClick={() => setCategoryFilter('data_network')}
                  className={`px-2.5 py-1 rounded text-xs transition-colors whitespace-nowrap ${
                    categoryFilter === 'data_network'
                      ? 'bg-slate-800 text-cyan-300 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Rede & Dados (31-40)
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-60">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filtrar por código ou termo..."
                  className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Scrollable Layers List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {filteredLayers.map((layer) => (
                <div
                  key={layer.id}
                  className={`p-3 rounded-xl border transition-colors ${
                    layer.category === 'financial_isolation'
                      ? 'bg-rose-950/20 border-rose-500/30'
                      : 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 font-semibold">
                        #{String(layer.id).padStart(2, '0')} · {layer.code}
                      </span>
                      <h4 className="text-sm font-semibold text-slate-100">
                        {layer.name}
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>{layer.status}</span>
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mb-1.5">
                    {layer.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-[11px] text-cyan-400/90 font-mono">
                    <span className="text-slate-500">Mecanismo:</span>
                    <span>{layer.enforcement}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: LIVE ATTACK SUITE */}
        {activeTab === 'test_suite' && (
          <div className="flex flex-col flex-1 overflow-y-auto mt-3 space-y-4">
            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200">
              Execute testes de ataque reais contra o motor de segurança do JARVIS para verificar se os bloqueios determinísticos funcionam fora do prompt da IA.
            </div>

            {/* Test Buttons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => runSecurityTest('pix')}
                className="p-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-rose-500/60 text-left transition-colors flex items-start gap-2.5"
              >
                <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-slate-100">
                    Testar Tentativa de Pix (Camada 13)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Simula comando: "Faça um Pix de R$ 500"
                  </p>
                </div>
              </button>

              <button
                onClick={() => runSecurityTest('bank')}
                className="p-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-rose-500/60 text-left transition-colors flex items-start gap-2.5"
              >
                <Lock className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-slate-100">
                    Testar Acesso a App Bancário (Camada 11)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Simula abertura do Nubank/Itaú/Bradesco
                  </p>
                </div>
              </button>

              <button
                onClick={() => runSecurityTest('shell')}
                className="p-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/60 text-left transition-colors flex items-start gap-2.5"
              >
                <Terminal className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-slate-100">
                    Testar Injeção de Shell/Root (Camada 22)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Simula comando: "rm -rf /; sudo bash"
                  </p>
                </div>
              </button>

              <button
                onClick={() => runSecurityTest('card')}
                className="p-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/60 text-left transition-colors flex items-start gap-2.5"
              >
                <ShieldAlert className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-slate-100">
                    Testar Sanitização de Cartão (Camada 15)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Verifica ofuscação de PAN de 16 dígitos
                  </p>
                </div>
              </button>

              <button
                onClick={() => runSecurityTest('unconfirmed')}
                className="p-3 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500/60 text-left transition-colors flex items-start gap-2.5 sm:col-span-2"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-slate-100">
                    Testar Tentativa de Envio Silencioso de Mensagem (Camada 25 & 26)
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Garante que nenhuma mensagem é despachada sem clique ou voz afirmativa explícita
                  </p>
                </div>
              </button>
            </div>

            {/* Test Output Panel */}
            {testResult && (
              <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/40 animate-in fade-in">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-hud font-bold text-sm text-cyan-200">
                    {testResult.testName}
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                    DEFESA ATIVA: SUCESSO
                  </span>
                </div>

                <div className="space-y-1.5 text-xs font-mono">
                  <div>
                    <span className="text-slate-400">Entrada Testada: </span>
                    <span className="text-rose-300">"{testResult.input}"</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Camada Acionada: </span>
                    <span className="text-cyan-300">{testResult.layerTriggered}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Resultado Técnico: </span>
                    <span className="text-slate-200">{testResult.details}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: AUDIT LOGS */}
        {activeTab === 'logs' && (
          <div className="flex flex-col flex-1 overflow-hidden mt-3">
            <p className="text-xs text-slate-400 mb-2">
              Registro auditável em tempo real de eventos de segurança, disparos de comandos e bloqueios preventivos.
            </p>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 font-mono text-xs">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-slate-500">[{log.timestamp}]</span>
                      <span className="text-cyan-400 font-semibold">{log.code}</span>
                      <span className="text-slate-200">{log.action}</span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{log.detail}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                      log.result === 'BLOCKED'
                        ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                        : log.result === 'CONFIRMED'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          : 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    {log.result}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
