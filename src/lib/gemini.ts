import { Question, LessonPlan, GeneratedExam, Grade } from '../types';
import { FALLBACK_QUESTIONS } from '../data/fallbackQuestions';
import { HABILIDADES } from '../data/habilidades';

export async function getQuestionForHabilidade(habilidadeId: string): Promise<Question> {
  try {
    const response = await fetch('/api/generate-question', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ habId: habilidadeId }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.question) {
        return data.question;
      }
    }
  } catch (error) {
    console.warn('Erro ao chamar API Gemini, usando questão local:', error);
  }

  // Fallback to local questions
  const localList = FALLBACK_QUESTIONS[habilidadeId] || FALLBACK_QUESTIONS['EF01MA01'];
  const randomIndex = Math.floor(Math.random() * localList.length);
  return {
    ...localList[randomIndex],
    id: `${habilidadeId}_local_${Date.now()}_${Math.floor(Math.random() * 1000)}`
  };
}

export async function generateExam(
  grade: Grade,
  habilidadeIds: string[],
  numQuestions: number,
  format: 'multiple' | 'open' | 'mix'
): Promise<GeneratedExam> {
  try {
    const response = await fetch('/api/generate-exam', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ grade, habIds: habilidadeIds, numQuestions, format }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.exam) {
        return data.exam;
      }
    }
  } catch (error) {
    console.warn('Erro ao chamar API Gemini para gerar avaliação, usando gerador local:', error);
  }

  // Fallback local exam generator using pre-seeded questions
  const examQuestions = [];
  const selectedHabs = HABILIDADES.filter(h => habilidadeIds.includes(h.id));
  
  for (let i = 0; i < numQuestions; i++) {
    const randomHab = selectedHabs[Math.floor(Math.random() * selectedHabs.length)] || HABILIDADES[0];
    const pool = FALLBACK_QUESTIONS[randomHab.id] || FALLBACK_QUESTIONS['EF01MA01'];
    const template = pool[Math.floor(Math.random() * pool.length)];
    
    examQuestions.push({
      text: template.text,
      type: format === 'mix' ? (Math.random() > 0.5 ? 'multiple' : 'open') : format,
      options: format === 'open' ? undefined : template.options,
      answer: template.answer,
      explanation: template.explanation,
      habilidadeId: randomHab.id
    });
  }

  return {
    id: `EXAM_${Date.now()}`,
    title: `Avaliação Diagnóstica de Matemática — ${grade}º Ano`,
    grade,
    habilidades: habilidadeIds,
    questions: examQuestions,
    createdAt: new Date().toLocaleDateString('pt-BR')
  };
}

export async function generateLessonPlan(habilidadeId: string): Promise<LessonPlan> {
  try {
    const response = await fetch('/api/generate-lesson-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ habId: habilidadeId }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.plan) {
        return data.plan;
      }
    }
  } catch (error) {
    console.warn('Erro ao chamar API Gemini para plano de aula, usando gerador local:', error);
  }

  // Fallback local lesson plan generator
  const hab = HABILIDADES.find(h => h.id === habilidadeId) || HABILIDADES[0];
  
  return {
    habilidadeId: hab.id,
    habilidadeCodigo: hab.id,
    habilidadeDescricao: hab.descricao,
    title: `Plano de Aula: Explorando ${hab.unit} (${hab.id})`,
    objective: `Desenvolver a habilidade do estudante em: ${hab.descricao.toLowerCase()}`,
    objectsOfKnowledge: hab.objetosConhecimento.join(', '),
    resources: [
      'Quadro e marcadores coloridos',
      'Material dourado ou fichas numeradas',
      'Atividades impressas com desenhos ilustrativos',
      'Lápis de cor e régua'
    ],
    methodology: {
      introduction: `Iniciar a aula perguntando aos alunos situações práticas do seu cotidiano onde observam o conceito de ${hab.unit}. Fazer uma breve explicação lúdica de 10 minutos.`,
      development: `Dividir os alunos em grupos e distribuir materiais concretos (Material Dourado, figuras, etc.). Propor desafios de resolução de problemas guiados e incentivar os estudantes a debaterem soluções entre si.`,
      conclusion: `Reunir a turma para que os grupos compartilhem suas estratégias de raciocínio. Fazer o fechamento sistematizando o conteúdo e destacando o uso da habilidade ${hab.id} no dia a dia.`
    },
    assessment: 'A avaliação será formativa através da observação direta da participação dos alunos nas atividades práticas e na realização de um mini-desafio individual escrito de fixação.'
  };
}
