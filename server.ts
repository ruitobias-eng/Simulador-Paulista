import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client to prevent crash if key is missing on startup
let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  if (aiClient) return aiClient;
  
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    console.warn('⚠️ AVISO: GEMINI_API_KEY não configurada ou vazia. O simulador utilizará as questões de fallback locais.');
    return null;
  }

  try {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    return aiClient;
  } catch (error) {
    console.error('Erro ao instanciar o cliente GoogleGenAI:', error);
    return null;
  }
}

function getSegmentDescription(habId: string): { name: string; audience: string; tone: string } {
  const cleanId = habId.toUpperCase();
  if (cleanId.startsWith('EM')) {
    return {
      name: 'Ensino Médio',
      audience: 'estudantes do Ensino Médio',
      tone: 'desafiadora, contextualizada, instigante e focada em raciocínio lógico-matemático de Ensino Médio'
    };
  }
  if (cleanId.startsWith('EF06') || cleanId.startsWith('EF07') || cleanId.startsWith('EF08') || cleanId.startsWith('EF09')) {
    return {
      name: 'Ensino Fundamental (Anos Finais)',
      audience: 'estudantes dos Anos Finais do Ensino Fundamental',
      tone: 'didática, contextualizada, estimulante e focada em resolução de problemas para adolescentes'
    };
  }
  return {
    name: 'Ensino Fundamental (Anos Iniciais)',
    audience: 'crianças do Ensino Fundamental',
    tone: 'lúdica, engajadora, amigável e acessível para crianças de Ensino Fundamental'
  };
}

// ----------------------------------------------------
// API: Gerar Questão Baseada em Habilidade
// ----------------------------------------------------
app.post('/api/generate-question', async (req, res) => {
  const { habId } = req.body;
  if (!habId) {
    return res.status(400).json({ error: 'Habilidade ID (habId) é obrigatório.' });
  }

  const ai = getAIClient();
  if (!ai) {
    return res.status(503).json({ error: 'API Gemini indisponível (chave ausente).' });
  }

  try {
    const segment = getSegmentDescription(habId);
    const prompt = `Gere uma questão de matemática em português do Brasil (pt-BR) destinada a ${segment.audience}, alinhada com a habilidade ${habId} do Currículo Paulista de Matemática.
Use uma linguagem ${segment.tone}.
Você PODE propor que a questão seja do tipo 'multiple' (múltipla escolha com 4 opções) ou 'open' (resposta numérica aberta).
Sempre que pertinente, utilize um tipo visual apropriado (visualType) como:
- 'count': para contagem (por exemplo, contar frutas, estrelas, carrinhos, etc.). Informe no visualData o ícone ('apple', 'watermelon', 'star', 'car') e a quantidade (count).
- 'fraction': para frações (por exemplo, círculos ou barras divididos). Informe no visualData o total de partes (total) e as partes pintadas (shaded).
- 'chart': para leitura de gráficos simples. Informe no visualData um array de dados do tipo { name: string, value: number }.
- 'table': para tabelas, como tabelas de dupla entrada ou de valor posicional.
- 'geometry': para desenhos de formas planas ou espaciais.
- 'none': caso não precise de suporte visual.

O objeto de retorno deve obedecer estritamente o esquema JSON solicitado.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: `Você é um excelente e experiente pedagogo brasileiro, especialista no Currículo Paulista de Matemática. Sua missão é gerar questões de alta qualidade pedagógica, criativas, corretas matematicamente e escritas em português claro, simpático e incentivador para os estudantes do ${segment.name}.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['type', 'text', 'answer', 'explanation', 'visualType'],
          properties: {
            type: {
              type: Type.STRING,
              description: "Tipo da questão: 'multiple' para múltipla escolha ou 'open' para resposta aberta escrita/numérica."
            },
            text: {
              type: Type.STRING,
              description: 'O texto da pergunta ou enunciado em português.'
            },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Exatamente 4 opções de resposta (apenas se o tipo for multiple). Devem ser rotuladas ou descritas de forma clara.'
            },
            answer: {
              type: Type.STRING,
              description: "Se for múltipla escolha ('multiple'), deve ser exatamente uma letra maiúscula: 'A', 'B', 'C' ou 'D', correspondente ao índice correto (0, 1, 2 ou 3) das options. Se for aberta ('open'), deve ser o valor exato ou número correto."
            },
            explanation: {
              type: Type.STRING,
              description: 'Explicação detalhada e carinhosa do passo a passo para se chegar ao resultado correto.'
            },
            visualType: {
              type: Type.STRING,
              description: "Deve ser um dos seguintes valores: 'count', 'fraction', 'chart', 'geometry', 'table' ou 'none'."
            },
            visualData: {
              type: Type.OBJECT,
              description: "Parâmetros de configuração visual de apoio. Exemplo para count: { icon: 'apple', count: 5 }. Para fraction: { total: 4, shaded: 3 }. Para chart: { type: 'bar', data: [{ name: 'A', value: 10 }] }."
            }
          }
        }
      }
    });

    const resultText = response.text?.trim() || '{}';
    const parsedQuestion = JSON.parse(resultText);

    // Ensure an ID is set
    parsedQuestion.id = `${habId}_gen_${Date.now()}`;

    res.json({ question: parsedQuestion });
  } catch (error) {
    console.error('Erro ao gerar questão com Gemini:', error);
    res.status(500).json({ error: 'Erro interno ao gerar questão.' });
  }
});

// ----------------------------------------------------
// API: Gerar Avaliação Diagnóstica Personalizada
// ----------------------------------------------------
app.post('/api/generate-exam', async (req, res) => {
  const { grade, habIds, numQuestions, format } = req.body;
  if (!grade || !habIds || !Array.isArray(habIds) || habIds.length === 0) {
    return res.status(400).json({ error: 'Parâmetros grade e habIds (lista de habilidades) são obrigatórios.' });
  }

  const ai = getAIClient();
  if (!ai) {
    return res.status(503).json({ error: 'API Gemini indisponível (chave ausente).' });
  }

  try {
    const gradeLabel = grade.toUpperCase().startsWith('EM')
      ? `${grade.replace('EM', '')}º Ano do Ensino Médio`
      : `${grade}º Ano do Ensino Fundamental`;
    const prompt = `Gere uma avaliação diagnóstica de matemática com exatamente ${numQuestions || 5} questões para estudantes do ${gradeLabel}.
As questões devem avaliar as seguintes Habilidades do Currículo Paulista: ${habIds.join(', ')}.
O formato das questões deve ser: ${format === 'mix' ? 'misturado (múltipla escolha e abertas)' : format === 'multiple' ? 'múltipla escolha' : 'abertas'}.

As perguntas devem ser contextualizadas e desafiadoras, adequadas à faixa etária escolar do ano indicado.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: `Você é um coordenador pedagógico sênior das redes escolares do Estado de São Paulo. Você cria avaliações oficiais alinhadas ao Currículo Paulista de Matemática. Todas as questões geradas devem ser excelentes, sem ambiguidades e com gabaritos detalhados para orientar os professores na correção.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['questions'],
          properties: {
            title: {
              type: Type.STRING,
              description: 'Título bonito para a avaliação impressa.'
            },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ['text', 'type', 'answer', 'explanation', 'habilidadeId'],
                properties: {
                  text: {
                    type: Type.STRING,
                    description: 'O texto/enunciado completo da questão.'
                  },
                  type: {
                    type: Type.STRING,
                    description: "Se 'multiple' ou 'open'."
                  },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Array de 4 strings de opções de respostas (apenas se type for multiple).'
                  },
                  answer: {
                    type: Type.STRING,
                    description: "Letra correta ('A', 'B', 'C', 'D') ou valor correto."
                  },
                  explanation: {
                    type: Type.STRING,
                    description: 'A justificativa pedagógica e gabarito detalhado da resolução.'
                  },
                  habilidadeId: {
                    type: Type.STRING,
                    description: 'Qual das habilidades fornecidas está sendo avaliada nesta questão.'
                  }
                }
              }
            }
          }
        }
      }
    });

    const resultText = response.text?.trim() || '{}';
    const parsedExam = JSON.parse(resultText);

    // Enhance response with server-generated metadata
    parsedExam.id = `EXAM_GEN_${Date.now()}`;
    parsedExam.grade = grade;
    parsedExam.habilidades = habIds;
    parsedExam.createdAt = new Date().toLocaleDateString('pt-BR');

    res.json({ exam: parsedExam });
  } catch (error) {
    console.error('Erro ao gerar avaliação com Gemini:', error);
    res.status(500).json({ error: 'Erro interno ao gerar avaliação.' });
  }
});

// ----------------------------------------------------
// API: Gerar Plano de Aula Completo
// ----------------------------------------------------
app.post('/api/generate-lesson-plan', async (req, res) => {
  const { habId } = req.body;
  if (!habId) {
    return res.status(400).json({ error: 'Código de habilidade (habId) é obrigatório.' });
  }

  const ai = getAIClient();
  if (!ai) {
    return res.status(503).json({ error: 'API Gemini indisponível (chave ausente).' });
  }

  try {
    const prompt = `Crie um plano de aula pedagógico de matemática completo e inovador em português do Brasil (pt-BR) estruturado para o desenvolvimento prático da habilidade do Currículo Paulista de Matemática: ${habId}.
Trabalhe com metodologias ativas de aprendizagem e propostas lúdicas para as crianças do ano correspondente à habilidade.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        systemInstruction: `Você é um mentor pedagógico especializado na formação continuada de professores do Ensino Fundamental. Você cria planos de aula extremamente detalhados, fáceis de aplicar em sala de aula, divertidos para as crianças e pedagogicamente eficazes de acordo com as diretrizes do Currículo Paulista e da BNCC.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          required: ['title', 'objective', 'objectsOfKnowledge', 'resources', 'methodology', 'assessment'],
          properties: {
            title: {
              type: Type.STRING,
              description: 'Título criativo e motivador do plano de aula.'
            },
            objective: {
              type: Type.STRING,
              description: 'Objetivos pedagógicos claros da aula (o que os alunos aprenderão).'
            },
            objectsOfKnowledge: {
              type: Type.STRING,
              description: 'Objetos de conhecimento abordados alinhados à habilidade.'
            },
            resources: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Lista de materiais, recursos digitais ou recursos concretos necessários.'
            },
            methodology: {
              type: Type.OBJECT,
              required: ['introduction', 'development', 'conclusion'],
              properties: {
                introduction: {
                  type: Type.STRING,
                  description: 'Acolhimento e contextualização (como despertar a curiosidade dos alunos nos primeiros 10-15 min).'
                },
                development: {
                  type: Type.STRING,
                  description: 'Passo a passo da atividade principal prática ou lúdica da aula.'
                },
                conclusion: {
                  type: Type.STRING,
                  description: 'Sistematização e encerramento (como coletar as conclusões dos alunos e amarrar os conceitos).'
                }
              }
            },
            assessment: {
              type: Type.STRING,
              description: 'Estratégias de avaliação formativa sugeridas para verificar a apropriação da habilidade.'
            }
          }
        }
      }
    });

    const resultText = response.text?.trim() || '{}';
    const parsedPlan = JSON.parse(resultText);

    res.json({ plan: parsedPlan });
  } catch (error) {
    console.error('Erro ao gerar plano de aula com Gemini:', error);
    res.status(500).json({ error: 'Erro interno ao gerar plano de aula.' });
  }
});

// Serve frontend static assets and route to index.html in production,
// otherwise mount Vite middleware in dev mode.
async function initServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Simulador de Matemática rodando em http://0.0.0.0:${PORT}`);
  });
}

initServer();
