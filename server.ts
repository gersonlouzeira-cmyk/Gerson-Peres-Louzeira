import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '25mb' }));

// Initialize GoogleGenAI client securely on the server
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Security: Strict Financial and System Command Isolation Patterns
const FINANCIAL_FORBIDDEN_REGEX = /(\bpix\b|chave\s*pix|transferir|pagar\s*boleto|saldo\s*banc|extrato\s*banc|cart[aã]o\s*de\s*cr[eé]dito|nubank|ita[uú]|bradesco|santander|banco\s*do\s*brasil|caixa\s*econ|mercado\s*pago|picpay|c6\s*bank|inter\s*banco|banco\s*inter|\bpan\b|\bcvv\b|dados\s*banc[aá]rios)/i;

const SHELL_INJECTION_REGEX = /(`|\$|\brm\s+-rf\b|\bsudo\b|\bchmod\b|\bexec\b|\bsh\b|\bbash\b|\|\s*nc\b)/i;

// System Prompt for JARVIS
const JARVIS_SYSTEM_INSTRUCTION = `Você é o J.A.R.V.I.S., um assistente de inteligência artificial de elite e futurista, projetado para o usuário em Português Brasileiro (pt-BR).

DIRETRIZES FUNDAMENTAIS:
1. IDENTIDADE E IDIOMA:
- Seu nome é estritamente JARVIS.
- Você se comunica sempre em Português Brasileiro (pt-BR), com tom inteligente, formal, cortês e objetivo ("Às suas ordens, senhor", "Comandos prontos", "Processando dados").
- Seja detalhado e excelente em explicações científicas, matemáticas, programação, história, redação e análise de problemas.

2. AÇÕES E COMANDOS ANDROID:
Quando o usuário solicitar uma ação real no dispositivo, responda em texto no seu tom característico E inclua uma tag de ação estruturada no final da resposta no seguinte formato JSON estrito:
<<<ACTION:{"type":"ACTION_TYPE","payload":{...}}>>>

Ações suportadas:
- Abrir YouTube: <<<ACTION:{"type":"OPEN_APP","payload":{"app":"youtube"}}>>>
- Abrir WhatsApp: <<<ACTION:{"type":"OPEN_APP","payload":{"app":"whatsapp"}}>>>
- Abrir Free Fire: <<<ACTION:{"type":"OPEN_APP","payload":{"app":"freefire"}}>>>
- Abrir Câmera: <<<ACTION:{"type":"OPEN_APP","payload":{"app":"camera"}}>>>
- Abrir Configurações: <<<ACTION:{"type":"OPEN_APP","payload":{"app":"settings"}}>>>
- Ligar/Desligar Lanterna: <<<ACTION:{"type":"FLASHLIGHT","payload":{"state":"toggle"}}>>> (ou "on" / "off")
- Data e Hora Atual: <<<ACTION:{"type":"READ_DATETIME","payload":{}}>>>
- Pesquisar na Web: <<<ACTION:{"type":"SEARCH_WEB","payload":{"query":"termo"}}>>>
- Preparar Mensagem WhatsApp: <<<ACTION:{"type":"WHATSAPP_PROPOSAL","payload":{"recipient":"Nome ou número","text":"Mensagem a ser enviada"}}>>>

3. PROTOCOLO DE SEGURANÇA E WHATSAPP:
- Mensagens do WhatsApp NUNCA são enviadas sozinhas. Sempre diga que a mensagem foi preparada e requer a confirmação explícita do usuário na interface.
- Exemplo: "Com certeza, senhor. Preparei a mensagem para Maria. Por segurança, aguardo sua confirmação explícita para abrir o WhatsApp."

4. BARREIRA DE SEGURANÇA FINANCEIRA ABSOLUTA:
- NUNCA realize, automatize ou sugira comandos de Pix, bancos, contas financeiras, transferências de dinheiro ou cartões de crédito.
- Se o usuário pedir algo financeiro, recuse categoricamente: "Acesso financeiro bloqueado pela Diretriz de Segurança JARVIS (Camadas 11 a 20). Operações bancárias estão permanentemente isoladas por segurança."

5. HONESTIDADE TÉCNICA:
- Seja honesto sobre limitações e incertezas. Nunca simule que um comando do Android teve sucesso físico sem a confirmação real do sistema.`;

// Health check and AI status endpoint
app.get('/api/jarvis/status', (req: Request, res: Response) => {
  const isConfigured = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    status: isConfigured ? 'ONLINE' : 'AI_NOT_CONFIGURED',
    aiConfigured: isConfigured,
    model: 'gemini-3.8-flash',
    platform: 'Android / Galaxy A04 Optimized',
    timestamp: new Date().toISOString(),
  });
});

// Main conversation endpoint
app.post('/api/jarvis/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [], enableSearch = false } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Mensagem inválida fornecida.' });
      return;
    }

    // Security Layer: Financial boundary check
    if (FINANCIAL_FORBIDDEN_REGEX.test(message)) {
      res.json({
        response: 'Acesso financeiro bloqueado pela Diretriz de Segurança JARVIS (Camadas 11 a 20). Operações bancárias, transações Pix e automações financeiras estão permanentemente isoladas e são estritamente proibidas.',
        action: {
          type: 'BLOCKED_FINANCIAL',
          payload: { reason: 'Bloqueio preventivo da Camada de Isolamento Financeiro JARVIS.' },
        },
        securityAlert: {
          layer: 'Camada 11-20: Isolamento Financeiro Absoluto',
          blocked: true,
        },
      });
      return;
    }

    // Security Layer: Shell injection filter
    if (SHELL_INJECTION_REGEX.test(message)) {
      res.json({
        response: 'Comando de terminal não autorizado. A separação estrita de privilégios do JARVIS (Camada 22) bloqueia qualquer execução de shell ou root no sistema.',
        action: null,
        securityAlert: {
          layer: 'Camada 22: Separação de Raciocínio IA e Shell',
          blocked: true,
        },
      });
      return;
    }

    if (!aiClient) {
      res.status(503).json({
        status: 'AI_NOT_CONFIGURED',
        error: 'A chave da API Gemini não está configurada no servidor. O JARVIS continuará operando no Modo Offline.',
      });
      return;
    }

    // Format chat contents
    const contents: any[] = [];

    // Append limited recent history for context
    const recentHistory = Array.isArray(history) ? history.slice(-8) : [];
    for (const item of recentHistory) {
      if (item.sender === 'user' && item.text) {
        contents.push({ role: 'user', parts: [{ text: item.text }] });
      } else if (item.sender === 'jarvis' && item.text) {
        // Strip previous action tags from context
        const cleanText = item.text.replace(/<<<ACTION:[\s\S]*?>>>/g, '').trim();
        if (cleanText) {
          contents.push({ role: 'model', parts: [{ text: cleanText }] });
        }
      }
    }

    contents.push({ role: 'user', parts: [{ text: message }] });

    // Determine if web search is needed
    const needsSearch = enableSearch || /(pesquise|pesquisa|not[ií]cias|hoje|previs[aã]o|tempo|cota[çc][aã]o|resultado|quem\s*[eé]|o\s*que\s*aconteceu)/i.test(message);

    const config: any = {
      systemInstruction: JARVIS_SYSTEM_INSTRUCTION,
      temperature: 0.7,
    };

    if (needsSearch) {
      config.tools = [{ googleSearch: {} }];
    }

    const aiResponse = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config,
    });

    const fullText = aiResponse.text || 'Sim, senhor. Não foi possível processar a resposta no momento.';

    // Extract structured action if present
    let extractedAction: any = null;
    let cleanResponse = fullText;

    const actionMatch = fullText.match(/<<<ACTION:([\s\S]*?)>>>/);
    if (actionMatch && actionMatch[1]) {
      try {
        extractedAction = JSON.parse(actionMatch[1].trim());
        cleanResponse = fullText.replace(actionMatch[0], '').trim();
      } catch (err) {
        console.warn('Erro ao decodificar tag de ação do JARVIS:', err);
      }
    }

    // Grounding metadata if search was used
    const searchMetadata = aiResponse.candidates?.[0]?.groundingMetadata;

    res.json({
      response: cleanResponse,
      action: extractedAction,
      grounding: searchMetadata?.webSearchQueries ? { queries: searchMetadata.webSearchQueries } : null,
      status: 'ONLINE',
    });
  } catch (error: any) {
    console.error('Erro na chamada Gemini:', error);
    const errorMessage = error?.message || '';

    if (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED')) {
      res.status(429).json({
        status: 'RATE_LIMIT_EXCEEDED',
        error: 'Limite de taxa excedido na API de IA. Aguardando recarga de cota.',
      });
      return;
    }

    res.status(500).json({
      status: 'AI_SERVICE_UNAVAILABLE',
      error: 'Serviço de IA temporariamente indisponível. Alternando para o Modo Local.',
    });
  }
});

// Document & Image Multimodal Analysis endpoint
app.post('/api/jarvis/analyze', async (req: Request, res: Response) => {
  try {
    const { fileBase64, mimeType, prompt = 'Analise este documento ou imagem em detalhes e forneça um resumo técnico claro em Português Brasileiro.' } = req.body;

    if (!fileBase64 || !mimeType) {
      res.status(400).json({ error: 'Arquivo ou tipo MIME ausente.' });
      return;
    }

    if (!aiClient) {
      res.status(503).json({
        status: 'AI_NOT_CONFIGURED',
        error: 'Chave de API do Gemini não configurada.',
      });
      return;
    }

    const imagePart = {
      inlineData: {
        mimeType,
        data: fileBase64,
      },
    };

    const textPart = {
      text: prompt,
    };

    const aiResponse = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction: 'Você é o JARVIS analisando documentos ou imagens para o usuário em Português Brasileiro. Seja preciso, detalhado e destaque pontos críticos.',
      },
    });

    res.json({
      analysis: aiResponse.text || 'Análise concluída com sucesso.',
      status: 'ONLINE',
    });
  } catch (error: any) {
    console.error('Erro na análise multimodal:', error);
    res.status(500).json({
      status: 'AI_SERVICE_UNAVAILABLE',
      error: 'Não foi possível analisar o arquivo fornecido.',
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`JARVIS Core Server running on http://0.0.0.0:${PORT} [${isDev ? 'DEV' : 'PROD'}]`);
  });
}

startServer().catch((err) => {
  console.error('Falha ao iniciar o servidor JARVIS:', err);
});
