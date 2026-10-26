import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  Terminal, 
  CheckCircle2, 
  Copy, 
  X, 
  ExternalLink,
  ShieldCheck,
  Cpu
} from 'lucide-react';

interface ApkExportGuideModalProps {
  onClose: () => void;
}

export const ApkExportGuideModal: React.FC<ApkExportGuideModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'pwa' | 'capacitor' | 'twa'>('pwa');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const capacitorCommands = `# 1. Instalar Capacitor para Android
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Inicializar o projeto nativo do JARVIS
npx cap init "JARVIS" "com.jarvis.assistant.a04" --web-dir dist

# 3. Gerar a compilação de produção
npm run build

# 4. Adicionar a plataforma Android
npx cap add android

# 5. Sincronizar os assets e abrir no Android Studio
npx cap sync
npx cap open android

# 6. No Android Studio: Build > Build Bundle(s) / APK(s) > Build APK(s)
# O arquivo APK gerado estará em:
# android/app/build/outputs/apk/debug/app-debug.apk`;

  const twaCommands = `# Gerar APK Android via Google Bubblewrap (TWA Oficial do Google)
npm install -g @bubblewrap/cli

# Inicializar manifesto no Galaxy A04
bubblewrap init --manifest=https://seu-dominio-jarvis.app/manifest.json

# Compilar APK assinado
bubblewrap build`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[92vh] rounded-2xl bg-slate-950 border border-cyan-500/40 p-4 sm:p-6 shadow-[0_0_50px_rgba(6,182,212,0.3)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/50 hud-glow">
              <Smartphone className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="font-hud font-bold text-base sm:text-lg text-cyan-200 tracking-wider">
                GUIA DE INSTALAÇÃO & EXPORTAÇÃO APK ANDROID
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Otimizado para Samsung Galaxy A04 (One UI Core / Android 12+)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar guia de exportação"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Security Assurance Banner */}
        <div className="mt-3 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200 flex items-start gap-2.5 shrink-0">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-semibold">Garantia de Segurança do APK (Camada 32):</strong>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Nenhuma chave de API ou segredo de servidor é embutido no APK cliente. A comunicação com o Gemini 3.8 Flash é autenticada através do proxy seguro do backend.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mt-3 border-b border-slate-800 pb-2.5 shrink-0">
          <button
            onClick={() => setActiveTab('pwa')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'pwa'
                ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-200'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Instalação Direta no Galaxy A04 (PWA)
          </button>
          <button
            onClick={() => setActiveTab('capacitor')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'capacitor'
                ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-200'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Compilar APK Nativo (Capacitor)
          </button>
          <button
            onClick={() => setActiveTab('twa')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'twa'
                ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-200'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            3. WebAPK Oficial (TWA / Bubblewrap)
          </button>
        </div>

        {/* Tab 1: Direct PWA Install */}
        {activeTab === 'pwa' && (
          <div className="flex-1 overflow-y-auto mt-3 space-y-3.5 pr-1 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <h4 className="font-semibold text-cyan-300 text-sm">
                Como instalar instantaneamente no Samsung Galaxy A04:
              </h4>
              <p className="text-slate-300 leading-relaxed">
                O JARVIS já possui manifesto PWA (<code className="text-cyan-400 font-mono">manifest.json</code>), ícones em alta resolução e suporte a tela cheia. Você pode instalá-lo como um aplicativo nativo em poucos segundos:
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300 pl-1">
                <li>Abra o link desta aplicação no <strong>Google Chrome</strong> ou <strong>Samsung Internet</strong> no seu Galaxy A04.</li>
                <li>Toque no menu de três pontos no canto superior direito do navegador.</li>
                <li>Selecione <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.</li>
                <li>O ícone holográfico do JARVIS será fixado na gaveta de aplicativos do seu celular e rodará em modo tela cheia standalone!</li>
              </ol>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h4 className="font-semibold text-slate-200 text-xs">
                Otimizações Ativas para o Hardware do Galaxy A04:
              </h4>
              <ul className="space-y-1 text-slate-400">
                <li>• Processador MediaTek Helio P35: Animações SVG aceleradas por GPU via CSS transforms (sem consumo excessivo de bateria).</li>
                <li>• Memória RAM (3GB/4GB): Histórico local limitado e descarte de nós DOM pesados.</li>
                <li>• Bateria de 5000mAh: Monitoramento em tempo real via Battery API com modo de economia ("ECO A04").</li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: Capacitor Native APK */}
        {activeTab === 'capacitor' && (
          <div className="flex-1 overflow-y-auto mt-3 space-y-3 pr-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-semibold">
                Comandos para compilar o APK no terminal / Android Studio:
              </span>
              <button
                onClick={() => handleCopy(capacitorCommands, 'cap')}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] text-cyan-300 flex items-center gap-1"
              >
                {copiedSnippet === 'cap' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSnippet === 'cap' ? 'Copiado!' : 'Copiar Comandos'}</span>
              </button>
            </div>

            <pre className="p-3.5 rounded-xl bg-black border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto leading-relaxed">
              {capacitorCommands}
            </pre>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 space-y-1">
              <span className="font-semibold text-slate-200 block">Permissões no AndroidManifest.xml:</span>
              <p className="text-[11px] font-mono text-cyan-400/90">
                &lt;uses-permission android:name="android.permission.RECORD_AUDIO" /&gt;<br />
                &lt;uses-permission android:name="android.permission.CAMERA" /&gt;<br />
                &lt;uses-permission android:name="android.permission.FLASHLIGHT" /&gt;<br />
                &lt;uses-permission android:name="android.permission.INTERNET" /&gt;
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: TWA Bubblewrap */}
        {activeTab === 'twa' && (
          <div className="flex-1 overflow-y-auto mt-3 space-y-3 pr-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-semibold">
                Comandos Google Bubblewrap (Trusted Web Activity):
              </span>
              <button
                onClick={() => handleCopy(twaCommands, 'twa')}
                className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] text-cyan-300 flex items-center gap-1"
              >
                {copiedSnippet === 'twa' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSnippet === 'twa' ? 'Copiado!' : 'Copiar Comandos'}</span>
              </button>
            </div>

            <pre className="p-3.5 rounded-xl bg-black border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto leading-relaxed">
              {twaCommands}
            </pre>

            <p className="text-slate-400 text-[11px] leading-relaxed">
              O Trusted Web Activity (TWA) empacota a aplicação como um aplicativo nativo para a Google Play Store e para o instalador de pacotes do Galaxy A04, integrando-se aos serviços do Android.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
