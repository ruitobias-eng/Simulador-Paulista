import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Question, Habilidade, QuizSession } from '../types';
import { getQuestionForHabilidade } from '../lib/gemini';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  ArrowRight, 
  Award, 
  RotateCcw,
  BookOpen,
  Check,
  Smile
} from 'lucide-react';

interface QuizArenaProps {
  habilitade: Habilidade;
  onBack: () => void;
  onComplete: (score: number, total: number) => void;
}

export default function QuizArena({ habilitade, onBack, onComplete }: QuizArenaProps) {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [openAnswer, setOpenAnswer] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  // Generate 5 questions for this habilidade
  useEffect(() => {
    let active = true;
    async function loadQuiz() {
      setLoading(true);
      setErrorMsg('');
      const loaded: Question[] = [];
      
      // Load 5 questions (mix of Gemini generated and fallback if needed)
      try {
        for (let i = 0; i < 5; i++) {
          if (!active) return;
          const q = await getQuestionForHabilidade(habilitade.id);
          // Prevent duplicates in same session if possible
          if (!loaded.some(existing => existing.text === q.text)) {
            loaded.push(q);
          } else {
            // Add variation suffix
            loaded.push({ ...q, id: `${q.id}_v${i}` });
          }
        }
        if (active) {
          setQuestions(loaded);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (active) {
          setErrorMsg('Não foi possível gerar as questões. Tente novamente.');
          setLoading(false);
        }
      }
    }

    loadQuiz();
    return () => {
      active = false;
    };
  }, [habilitade.id]);

  const currentQuestion = questions[currentIndex];

  const handleSubmit = () => {
    if (!currentQuestion) return;
    
    let answerToCheck = '';
    if (currentQuestion.type === 'multiple') {
      if (!selectedAnswer) return;
      answerToCheck = selectedAnswer;
    } else {
      if (!openAnswer.trim()) return;
      answerToCheck = openAnswer.trim();
    }

    const correct = answerToCheck.toUpperCase() === currentQuestion.answer.toUpperCase();
    setIsCorrect(correct);
    setIsSubmitted(true);
    
    if (correct) {
      setSessionScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setOpenAnswer('');
    setIsSubmitted(false);
    
    if (currentIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Completed!
      onComplete(sessionScore, questions.length);
    }
  };

  // Helper to render math visual aids in beautiful Tailwind/SVG layouts
  const renderVisualAid = () => {
    if (!currentQuestion || !currentQuestion.visualType || currentQuestion.visualType === 'none') {
      return null;
    }

    const { visualType, visualData } = currentQuestion;

    switch (visualType) {
      case 'count': {
        const count = visualData?.count || 5;
        const iconType = visualData?.icon || 'apple';
        const icons: Record<string, string> = {
          apple: '🍎',
          watermelon: '🍉',
          star: '⭐',
          car: '🚗',
        };
        const emoji = icons[iconType] || '🍎';
        
        return (
          <div className="bg-[#0a0c10] border border-slate-850 rounded-2xl p-6 my-4 flex flex-wrap gap-4 items-center justify-center min-h-[100px] shadow-inner">
            {Array.from({ length: count }).map((_, i) => (
              <motion.span
                key={i}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', delay: i * 0.05 }}
                className="text-4xl filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.4)] select-none"
              >
                {emoji}
              </motion.span>
            ))}
          </div>
        );
      }

      case 'fraction': {
        const total = visualData?.total || 4;
        const shaded = visualData?.shaded || 1;
        
        // Draw a partitioned circle SVG
        return (
          <div className="bg-[#0a0c10] border border-slate-850 rounded-2xl p-6 my-4 flex flex-col items-center justify-center shadow-inner">
            <svg width="150" height="150" viewBox="0 0 100 100" className="filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
              {Array.from({ length: total }).map((_, i) => {
                const angle = 360 / total;
                const startAngle = i * angle - 90; // offset by 90deg to start at top
                const endAngle = (i + 1) * angle - 90;
                
                const rad = Math.PI / 180;
                const x1 = 50 + 40 * Math.cos(startAngle * rad);
                const y1 = 50 + 40 * Math.sin(startAngle * rad);
                const x2 = 50 + 40 * Math.cos(endAngle * rad);
                const y2 = 50 + 40 * Math.sin(endAngle * rad);
                
                const largeArc = angle > 180 ? 1 : 0;
                
                const pathData = `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;
                const fillClass = i < shaded ? 'fill-orange-500 stroke-slate-900' : 'fill-slate-800 stroke-slate-900';
                
                return (
                  <path 
                    key={i} 
                    d={pathData} 
                    className={`${fillClass} transition-colors duration-300`}
                    strokeWidth="1.5"
                  />
                );
              })}
              <circle cx="50" cy="50" r="40" className="fill-none stroke-slate-700" strokeWidth="2" />
            </svg>
            <div className="text-xs font-mono text-slate-400 mt-3 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
              Círculo dividido em {total} partes iguais
            </div>
          </div>
        );
      }

      case 'chart': {
        const chartData = visualData?.data || [];
        const maxValue = Math.max(...chartData.map((d: any) => d.value), 10);

        return (
          <div className="bg-[#0a0c10] border border-slate-850 rounded-2xl p-6 my-4 shadow-inner">
            <div className="flex flex-col gap-3">
              {chartData.map((item: any, i: number) => {
                const percent = (item.value / maxValue) * 100;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="w-24 text-right font-sans font-medium text-xs text-slate-400 truncate">{item.name}</span>
                    <div className="flex-1 bg-slate-950 h-6 rounded-md overflow-hidden relative border border-slate-900">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className="bg-indigo-550 h-full rounded-md shadow-[0_0_12px_rgba(79,70,229,0.25)]"
                      />
                      <span className="absolute left-2 top-0 h-full flex items-center font-mono font-bold text-xs text-slate-100">
                        {item.value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="h-px bg-slate-800 my-2 ml-24" />
            <div className="flex justify-between ml-24 font-mono text-[10px] text-slate-500">
              <span>0</span>
              <span>{Math.round(maxValue / 2)}</span>
              <span>{maxValue}</span>
            </div>
          </div>
        );
      }

      case 'table': {
        const headers = visualData?.headers || [];
        const rows = visualData?.rows || [];
        const grid = visualData?.grid;

        // Render dot grid for array questions
        if (grid) {
          const rowsCount = grid.rows || 3;
          const colsCount = grid.cols || 5;
          return (
            <div className="bg-[#0a0c10] border border-slate-850 rounded-2xl p-6 my-4 flex flex-col items-center justify-center shadow-inner">
              <div className="grid gap-3 bg-slate-900 p-6 rounded-xl border border-slate-850 shadow-md" style={{ gridTemplateColumns: `repeat(${colsCount}, minmax(0, 1fr))` }}>
                {Array.from({ length: rowsCount * colsCount }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="w-8 h-8 rounded-full bg-indigo-950/40 border border-indigo-900/30 flex items-center justify-center font-mono font-bold text-xs text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.15)]"
                  >
                    {i + 1}
                  </motion.div>
                ))}
              </div>
              <div className="text-xs font-sans text-slate-400 mt-3 text-center">
                Organização retangular com <span className="font-bold text-indigo-300">{rowsCount} linhas</span> e <span className="font-bold text-indigo-300">{colsCount} colunas</span>
              </div>
            </div>
          );
        }

        return (
          <div className="my-4 overflow-hidden border border-slate-850 rounded-xl bg-[#0a0c10]">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-850">
                  {headers.map((h: string, idx: number) => (
                    <th key={idx} className="p-3 text-xs font-semibold text-slate-400 font-sans">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row: string[], rIdx: number) => (
                  <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-[#0a0c10]' : 'bg-slate-900/40'}>
                    {row.map((cell: string, cIdx: number) => (
                      <td key={cIdx} className="p-4 font-mono font-medium text-slate-350 border-t border-slate-850/60">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }

      case 'geometry': {
        const heightData = visualData?.heights;
        if (heightData) {
          return (
            <div className="bg-[#0a0c10] border border-slate-850 rounded-2xl p-6 my-4 flex items-end justify-center gap-12 h-44 shadow-inner">
              {heightData.map((h: number, idx: number) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: h }}
                    transition={{ type: 'spring' }}
                    className="w-10 bg-gradient-to-t from-orange-500 to-amber-450 rounded-t-lg shadow-[0_0_15px_rgba(249,115,22,0.2)]"
                  />
                  <span className="font-sans font-semibold text-xs text-slate-400">{visualData.labels[idx]}</span>
                </div>
              ))}
            </div>
          );
        }

        // Render lateralidade representation (left cat, right ball)
        if (visualData?.type === 'lateralidade') {
          return (
            <div className="bg-[#0a0c10] border border-slate-850 rounded-2xl p-6 my-4 flex items-center justify-center gap-12 text-center shadow-inner">
              <div className="p-4 bg-slate-900 border border-slate-850 rounded-xl shadow-md flex flex-col items-center">
                <span className="text-4xl mb-1">🐱</span>
                <span className="font-sans font-bold text-xs text-slate-300">{visualData.itemLeft}</span>
              </div>
              <div className="text-slate-755">─── ↔ ───</div>
              <div className="p-4 bg-slate-900 border border-slate-850 rounded-xl shadow-md flex flex-col items-center">
                <span className="text-4xl mb-1">⚽</span>
                <span className="font-sans font-bold text-xs text-slate-300">{visualData.itemRight}</span>
              </div>
            </div>
          );
        }

        return null;
      }

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="bg-[#0a0c10] rounded-3xl shadow-2xl border border-slate-850 p-12 flex flex-col items-center justify-center min-h-[450px]">
        <div className="relative w-16 h-16 mb-4">
          <div className="absolute inset-0 rounded-full border-4 border-slate-900" />
          <div className="absolute inset-0 rounded-full border-4 border-indigo-400 border-t-transparent animate-spin" />
        </div>
        <p className="font-sans font-semibold text-slate-100 text-lg">Preparando seu Simulado...</p>
        <p className="font-sans text-slate-400 text-sm mt-2 text-center max-w-sm">
          Gemini está gerando problemas pedagógicos alinhados à habilidade <span className="font-mono text-xs font-bold text-indigo-400">{habilitade.id}</span>
        </p>
      </div>
    );
  }

  if (errorMsg || questions.length === 0) {
    return (
      <div className="bg-[#0a0c10] rounded-3xl shadow-2xl border border-slate-850 p-12 flex flex-col items-center justify-center min-h-[450px] text-center">
        <XCircle className="w-16 h-16 text-rose-500 mb-4" />
        <h3 className="font-sans font-bold text-slate-100 text-xl">Ops! Algo deu errado</h3>
        <p className="font-sans text-slate-400 mt-2 max-w-md">{errorMsg || 'Erro inesperado ao carregar as questões.'}</p>
        <button 
          onClick={onBack}
          className="mt-6 font-sans font-semibold bg-slate-900 text-slate-300 px-6 py-2.5 rounded-xl border border-slate-800 hover:text-slate-100 hover:bg-slate-850 transition-colors inline-flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Painel
        </button>
      </div>
    );
  }

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="bg-[#040608] border border-slate-850 rounded-3xl shadow-2xl overflow-hidden relative z-10">
      {/* Quiz Progress Header */}
      <div className="bg-[#0a0c10] border-b border-slate-850 p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-900 rounded-lg border border-transparent hover:border-slate-800 text-slate-400 transition-all cursor-pointer"
            title="Voltar ao Painel"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs bg-indigo-950/50 text-indigo-350 px-2.5 py-0.5 rounded border border-indigo-900/30">
                {habilitade.id}
              </span>
              <span className="font-sans font-semibold text-xs text-slate-500">
                • {habilitade.unit}
              </span>
            </div>
            <h4 className="font-sans font-bold text-slate-100 text-sm mt-0.5 truncate max-w-xs md:max-w-md">
              {habilitade.descricao}
            </h4>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="font-sans font-semibold text-xs text-slate-500 block">Progresso</span>
            <span className="font-mono font-bold text-sm text-slate-250">
              {currentIndex + 1} de {questions.length}
            </span>
          </div>
          <div className="w-24 bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-850">
            <div 
              className="bg-indigo-500 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-6 md:p-8">
        {/* Question Statement */}
        <div className="mb-6">
          <span className="font-mono text-xs font-bold text-slate-500 block mb-1">QUESTÃO {currentIndex + 1}</span>
          <h3 className="font-sans font-bold text-slate-100 text-lg leading-relaxed">
            {currentQuestion.text}
          </h3>
        </div>

        {/* Dynamic Visual Aid */}
        {renderVisualAid()}

        {/* Input/Answers Section */}
        <div className="mt-8">
          {currentQuestion.type === 'multiple' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options?.map((opt, idx) => {
                const letter = optionLetters[idx];
                const isSelected = selectedAnswer === letter;
                const isCorrectOption = letter === currentQuestion.answer;
                
                let cardStyle = 'border-slate-850 bg-slate-900/40 text-slate-300 hover:border-indigo-550/60 hover:bg-slate-900/90';
                if (isSelected) {
                  cardStyle = 'border-indigo-500 bg-indigo-950/15 text-slate-200';
                }
                if (isSubmitted) {
                  if (isCorrectOption) {
                    cardStyle = 'border-emerald-500/70 bg-emerald-950/10 text-emerald-250 cursor-default';
                  } else if (isSelected) {
                    cardStyle = 'border-rose-500/70 bg-rose-950/10 text-rose-250 cursor-default';
                  } else {
                    cardStyle = 'border-slate-900 bg-slate-950 opacity-40 cursor-default';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isSubmitted}
                    onClick={() => setSelectedAnswer(letter)}
                    className={`flex items-center text-left p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${cardStyle}`}
                  >
                    <span className={`w-8 h-8 rounded-xl font-mono font-bold text-xs flex items-center justify-center mr-3 border shrink-0 ${
                      isSelected 
                        ? 'bg-indigo-600 text-white border-indigo-600' 
                        : isSubmitted && isCorrectOption
                          ? 'bg-emerald-500 text-white border-emerald-500'
                          : isSubmitted && isSelected
                            ? 'bg-rose-500 text-white border-rose-500'
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}>
                      {letter}
                    </span>
                    <span className="font-sans font-medium text-sm">{opt}</span>
                    {isSubmitted && isCorrectOption && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 ml-auto shrink-0" />
                    )}
                    {isSubmitted && isSelected && !isCorrectOption && (
                      <XCircle className="w-5 h-5 text-rose-400 ml-auto shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="bg-[#0a0c10] border border-slate-850 rounded-2xl p-6 max-w-md mx-auto">
              <label className="font-sans font-semibold text-xs text-slate-400 block mb-2">
                Digite sua resposta numérica ou textual:
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  disabled={isSubmitted}
                  value={openAnswer}
                  onChange={(e) => setOpenAnswer(e.target.value)}
                  placeholder="Ex: 12"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 font-mono font-bold text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-center"
                />
                {!isSubmitted && (
                  <button
                    onClick={handleSubmit}
                    disabled={!openAnswer.trim()}
                    className="font-sans font-semibold bg-indigo-600 hover:bg-indigo-500 text-slate-100 px-6 py-2.5 rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-[0_0_15px_rgba(79,70,229,0.3)]"
                  >
                    Enviar
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Action Button for Multiple Choice */}
          {currentQuestion.type === 'multiple' && !isSubmitted && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={!selectedAnswer}
                className="font-sans font-bold bg-indigo-600 hover:bg-indigo-500 text-slate-100 px-10 py-3.5 rounded-2xl shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                Confirmar Resposta
              </button>
            </div>
          )}
        </div>

        {/* Feedback & Step-By-Step Explanation Section */}
        <AnimatePresence>
          {isSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="mt-8"
            >
              {/* Correction Banner */}
              <div className={`p-6 rounded-2xl border flex items-start gap-4 ${
                isCorrect 
                  ? 'bg-emerald-950/10 border-emerald-900/30 text-emerald-350' 
                  : 'bg-rose-950/10 border-rose-900/30 text-rose-350'
              }`}>
                {isCorrect ? (
                  <Sparkles className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5 animate-bounce" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-sans font-bold text-lg">
                    {isCorrect ? 'Excelente! Você acertou!' : 'Ops! Resposta incorreta.'}
                  </h4>
                  <p className="font-sans text-sm mt-1 opacity-90">
                    {isCorrect 
                      ? 'Parabéns pelo seu raciocínio. Continue assim!' 
                      : `A resposta correta era: ${currentQuestion.type === 'multiple' ? `Letra ${currentQuestion.answer}` : currentQuestion.answer}`}
                  </p>
                </div>
              </div>

              {/* Accordion Explanation */}
              <div className="mt-4 border border-slate-850 rounded-2xl overflow-hidden bg-slate-900/20">
                <div className="p-4 bg-[#0a0c10] border-b border-slate-850 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <span className="font-sans font-bold text-slate-300 text-sm">Explicação Pedagógica (Passo a Passo)</span>
                </div>
                <div className="p-5 font-sans text-slate-300 text-sm leading-relaxed whitespace-pre-line bg-slate-950/50">
                  {currentQuestion.explanation}
                </div>
              </div>

              {/* Next Question Navigation */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleNext}
                  className="font-sans font-bold bg-indigo-600 hover:bg-indigo-500 text-slate-100 px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-indigo-500/20 inline-flex items-center gap-2 hover:translate-x-0.5 transition-all cursor-pointer"
                >
                  {currentIndex < questions.length - 1 ? 'Próxima Questão' : 'Concluir Simulado'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
