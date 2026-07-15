export type Grade = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'EM1' | 'EM2' | 'EM3';

export type ThematicUnit = 
  | 'Números' 
  | 'Álgebra' 
  | 'Geometria' 
  | 'Grandezas e Medidas' 
  | 'Probabilidade e Estatística';

export interface Habilidade {
  id: string;
  descricao: string;
  unit: ThematicUnit;
  grade: Grade;
  objetosConhecimento: string[];
}

export interface Question {
  id: string;
  type: 'multiple' | 'open';
  text: string;
  options?: string[];
  answer: string; // "A", "B", "C", "D" or the exact number string
  explanation: string;
  visualType?: 'count' | 'fraction' | 'chart' | 'geometry' | 'table' | 'none';
  visualData?: any;
}

export interface QuizSession {
  habilidadeId: string;
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: string[];
  score: number;
  completed: boolean;
  startTime: number;
}

export interface LessonPlan {
  habilidadeId: string;
  habilidadeCodigo: string;
  habilidadeDescricao: string;
  title: string;
  objective: string;
  objectsOfKnowledge: string;
  resources: string[];
  methodology: {
    introduction: string;
    development: string;
    conclusion: string;
  };
  assessment: string;
}

export interface ExamQuestion {
  text: string;
  type: 'multiple' | 'open';
  options?: string[];
  answer: string;
  explanation: string;
  habilidadeId: string;
}

export interface GeneratedExam {
  id: string;
  title: string;
  grade: Grade;
  habilidades: string[];
  questions: ExamQuestion[];
  createdAt: string;
}

export interface StudentProgress {
  habilidadeId: string;
  resolvedCount: number;
  correctCount: number;
  lastScore: number;
  status: 'Iniciante' | 'Praticante' | 'Mestre';
}

export interface StudentProfile {
  name: string;
  grade: Grade;
  progress: Record<string, StudentProgress>;
  history: {
    date: string;
    habilidadeId: string;
    score: number;
    total: number;
  }[];
}
