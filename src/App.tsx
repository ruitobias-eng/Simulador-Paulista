import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StudentProfile, Habilidade, Grade } from './types';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import QuizArena from './components/QuizArena';
import { 
  Calculator, 
  User, 
  GraduationCap, 
  Settings, 
  Trophy, 
  Sparkles, 
  Volume2, 
  VolumeX,
  History,
  RotateCcw,
  CheckCircle,
  ArrowRight,
  Smile,
  LogOut,
  Plus
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'SIMULADOR_MATEMATICA_PROFILE';

const DEFAULT_PROFILE: StudentProfile = {
  name: 'Estudante',
  grade: '1',
  progress: {},
  history: []
};

export default function App() {
  const [profile, setProfile] = useState<StudentProfile>(DEFAULT_PROFILE);
  const [mode, setMode] = useState<'student' | 'teacher'>('student');
  const [activeHabilidade, setActiveHabilidade] = useState<Habilidade | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Quiz completion score state
  const [quizScore, setQuizScore] = useState<{ score: number; total: number; habId: string } | null>(null);
  
  // Onboarding registration state
  const [onboardName, setOnboardName] = useState('');
  const [onboardGrade, setOnboardGrade] = useState<Grade>('1');
  const [isOnboarding, setIsOnboarding] = useState(true);

  // Load profile from Local Storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name) {
          setProfile(parsed);
          setIsOnboarding(false);
        }
      } catch (e) {
        console.error('Erro ao ler perfil do local storage', e);
      }
    }
  }, []);

  // Save profile to Local Storage on changes
  const saveProfile = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newProfile));
  };

  const handleOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onboardName.trim()) return;

    const newProfile: StudentProfile = {
      name: onboardName.trim(),
      grade: onboardGrade,
      progress: {},
      history: []
    };

    saveProfile(newProfile);
    setIsOnboarding(false);
  };

  const handleSelectHabilidade = (hab: Habilidade) => {
    setActiveHabilidade(hab);
    setQuizScore(null);
  };

  const handleResetProgress = () => {
    if (window.confirm('Tem certeza de que deseja apagar todo o seu histórico e progresso? Esta ação não pode ser desfeita.')) {
      saveProfile({
        ...profile,
        progress: {},
        history: []
      });
    }
  };

  const handleLogout = () => {
    if (window.confirm('Deseja sair e criar um novo perfil?')) {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setProfile(DEFAULT_PROFILE);
      setOnboardName('');
      setIsOnboarding(true);
      setActiveHabilidade(null);
      setQuizScore(null);
    }
  };

  const handleQuizComplete = (score: number, total: number) => {
    if (!activeHabilidade) return;

    // Calculate score points and update habilidade progress
    const habId = activeHabilidade.id;
    const progressMap = { ...profile.progress };
    
    const existing = progressMap[habId] || {
      habilidadeId: habId,
      resolvedCount: 0,
      correctCount: 0,
      lastScore: 0,
      status: 'Iniciante' as const
    };

    const newResolvedCount = existing.resolvedCount + 1;
    const newCorrectCount = existing.correctCount + score;
    const correctPercentage = (newCorrectCount / (newResolvedCount * 5)) * 100;

    let newStatus: 'Iniciante' | 'Praticante' | 'Mestre' = 'Iniciante';
    if (correctPercentage >= 85 && newResolvedCount >= 2) {
      newStatus = 'Mestre';
    } else if (correctPercentage >= 50) {
      newStatus = 'Praticante';
    }

    progressMap[habId] = {
      habilidadeId: habId,
      resolvedCount: newResolvedCount,
      correctCount: newCorrectCount,
      lastScore: score,
      status: newStatus
    };

    const historyEntry = {
      date: new Date().toLocaleDateString('pt-BR'),
      habilidadeId: habId,
      score: score,
      total: total
    };

    const updatedProfile: StudentProfile = {
      ...profile,
      progress: progressMap,
      history: [...profile.history, historyEntry]
    };

    saveProfile(updatedProfile);
    setQuizScore({ score, total, habId });
    setActiveHabilidade(null);

    // Play subtle audio cue if enabled
    if (soundEnabled) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        if (score >= 4) {
          // Success melody
          oscillator.type = 'sine';
          oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
          oscillator.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
          oscillator.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2); // G5
          oscillator.frequency.setValueAtTime(1046.50, audioCtx.currentTime + 0.3); // C6
          gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
          oscillator.start();
          oscillator.stop(audioCtx.currentTime + 0.5);
        } else {
          // Soft encouragement sound
          oscillator.type = 'triangle';
          oscillator.frequency.setValueAtTime(329.63, audioCtx.currentTime); // E4
          oscillator.frequency.setValueAtTime(440.00, audioCtx.currentTime + 0.15); // A4
          gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
          oscillator.start();
          oscillator.stop(audioCtx.currentTime + 0.4);
        }
      } catch (err) {
        console.warn('Audio Context block:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1115] flex flex-col text-slate-300 antialiased print:bg-white print:text-slate-900 print:min-h-0 relative overflow-hidden">
      
      {/* Dynamic Ambient Grid Background Overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '32px 32px', opacity: 0.2 }}></div>

      {/* ONBOARDING REGISTRATION SCREEN */}
      {isOnboarding && mode === 'student' ? (
        <div className="flex-1 flex items-center justify-center p-6 md:p-12 relative z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#0a0c10] border border-slate-800/80 rounded-3xl p-8 shadow-2xl space-y-6 relative"
          >
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-indigo-600/15 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(79,70,229,0.15)]">
                <Calculator className="w-6 h-6 text-indigo-400" />
              </div>
              <h2 className="font-sans font-black text-xl text-slate-100 tracking-tight">
                Simulador Paulista de Matemática
              </h2>
              <p className="font-sans text-xs text-slate-500">
                Alinhado ao Currículo Paulista de Matemática (EF e EM)
              </p>
            </div>

            <form onSubmit={handleOnboardSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-sans font-bold text-xs text-slate-400 block">Como gostaria de ser chamado?</label>
                <input
                  required
                  type="text"
                  maxLength={18}
                  value={onboardName}
                  onChange={(e) => setOnboardName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full px-4 py-3 bg-slate-900/60 border border-slate-800 rounded-2xl font-sans text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-slate-600 transition-all text-center"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-sans font-bold text-xs text-slate-400 block">Qual o seu Ano Escolar?</label>
                <select
                  value={onboardGrade}
                  onChange={(e) => setOnboardGrade(e.target.value as Grade)}
                  className="w-full px-4 py-3 bg-slate-900/60 border border-slate-800 rounded-2xl font-sans text-sm font-semibold text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer text-center"
                >
                  <option value="1">1º Ano do Ensino Fundamental</option>
                  <option value="2">2º Ano do Ensino Fundamental</option>
                  <option value="3">3º Ano do Ensino Fundamental</option>
                  <option value="4">4º Ano do Ensino Fundamental</option>
                  <option value="5">5º Ano do Ensino Fundamental</option>
                  <option value="6">6º Ano do Ensino Fundamental</option>
                  <option value="7">7º Ano do Ensino Fundamental</option>
                  <option value="8">8º Ano do Ensino Fundamental</option>
                  <option value="9">9º Ano do Ensino Fundamental</option>
                  <option value="EM1">1º Ano do Ensino Médio</option>
                  <option value="EM2">2º Ano do Ensino Médio</option>
                  <option value="EM3">3º Ano do Ensino Médio</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full font-sans font-bold bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-2xl shadow-lg hover:shadow-indigo-500/20 transition-all mt-4 cursor-pointer"
              >
                Começar Desafio!
              </button>
            </form>

            <div className="border-t border-slate-800/80 pt-4 flex flex-col items-center gap-2">
              <span className="font-sans text-xs text-slate-500 text-center">Se você é educador, coordenador ou professor:</span>
              <button 
                onClick={() => {
                  setMode('teacher');
                  setIsOnboarding(false);
                }}
                className="font-sans font-semibold text-xs text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer"
              >
                Acessar Painel do Professor
              </button>
            </div>
          </motion.div>
        </div>
      ) : (
        <>
          {/* HEADER NAV */}
          <header className="bg-[#0a0c10] border-b border-slate-850 py-4 px-6 md:px-8 flex items-center justify-between sticky top-0 z-40 print:hidden relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-sans font-black text-slate-100 text-base leading-none tracking-tight">
                  Simulador Paulista
                </h1>
                <span className="font-sans text-[10px] text-slate-500 tracking-wide block mt-1 uppercase font-bold">
                  Matemática EF e EM
                </span>
              </div>
            </div>

            {/* Profile Navigation */}
            <div className="flex items-center gap-3">
              {/* Sound Toggle (Only screen, non print) */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 hover:bg-slate-900 text-slate-400 hover:text-slate-200 rounded-xl border border-transparent hover:border-slate-800 transition-all"
                title={soundEnabled ? 'Desativar Som de Sucesso' : 'Ativar Som de Sucesso'}
              >
                {soundEnabled ? <Volume2 className="w-4.5 h-4.5" /> : <VolumeX className="w-4.5 h-4.5 text-rose-400" />}
              </button>

              <div className="h-6 w-px bg-slate-800" />

              {/* Mode Toggle Selector */}
              <div className="flex bg-slate-950/80 border border-slate-850 p-1 rounded-xl">
                <button
                  onClick={() => setMode('student')}
                  className={`px-3 py-1.5 rounded-lg font-sans font-bold text-xs transition-all flex items-center gap-1 cursor-pointer ${
                    mode === 'student' 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" /> Estudante
                </button>
                <button
                  onClick={() => setMode('teacher')}
                  className={`px-3 py-1.5 rounded-lg font-sans font-bold text-xs transition-all flex items-center gap-1 cursor-pointer ${
                    mode === 'teacher' 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <User className="w-3.5 h-3.5" /> Professor
                </button>
              </div>

              {/* Log out / Reset Option */}
              {mode === 'student' && (
                <>
                  <div className="h-6 w-px bg-slate-800" />
                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/20 rounded-xl transition-all"
                    title="Sair do Perfil"
                  >
                    <LogOut className="w-4.5 h-4.5" />
                  </button>
                </>
              )}
            </div>
          </header>

          {/* MAIN PAGE CONTAINER */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 print:p-0 relative z-10">
            <AnimatePresence mode="wait">
              
              {/* QUIZ ARENA IF ACTIVE */}
              {activeHabilidade ? (
                <motion.div
                  key="quiz"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <QuizArena
                    habilitade={activeHabilidade}
                    onBack={() => setActiveHabilidade(null)}
                    onComplete={handleQuizComplete}
                  />
                </motion.div>
              ) : quizScore ? (
                /* RECAP RESULT CARD AFTER QUIZ COMPLETED */
                <motion.div
                  key="recap"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="max-w-md mx-auto bg-[#0a0c10] border border-slate-800/80 rounded-3xl p-8 shadow-2xl text-center space-y-6"
                >
                  <div className="relative">
                    <div className="w-20 h-20 bg-indigo-950/50 border border-indigo-800/40 text-indigo-400 rounded-3xl flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(79,70,229,0.2)] animate-bounce">
                      <Trophy className="w-10 h-10 text-amber-400" />
                    </div>
                    <div className="absolute top-0 right-1/2 translate-x-12 translate-y-[-10px]">
                      <Sparkles className="w-6 h-6 text-amber-300" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-sans font-black text-slate-100 text-xl tracking-tight">Simulado Concluído!</h3>
                    <span className="font-mono text-xs font-bold text-slate-500">Habilidade {quizScore.habId}</span>
                  </div>

                  {/* Score Indicator */}
                  <div className="bg-[#13161c] border border-slate-800/80 rounded-2xl p-5">
                    <span className="font-sans text-xs text-slate-500 block mb-1">Seu Desempenho</span>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="font-mono font-black text-4xl text-slate-100">{quizScore.score}</span>
                      <span className="font-mono text-slate-500 text-lg">/ {quizScore.total}</span>
                    </div>
                    <span className="font-sans font-bold text-xs text-slate-400 mt-2 block">
                      {quizScore.score >= 4 ? '🎉 Fantástico! Excelente nota!' : '💪 Continue praticando! Você consegue!'}
                    </span>
                  </div>

                  {/* Call to action */}
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setQuizScore(null)}
                      className="w-full font-sans font-bold bg-indigo-600 hover:bg-indigo-500 text-white py-3.5 rounded-2xl shadow-lg transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Ir para Habilidades <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ) : mode === 'student' ? (
                /* STUDENT MAIN DASHBOARD */
                <motion.div
                  key="student"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <StudentDashboard
                    profile={profile}
                    onSelectHabilidade={handleSelectHabilidade}
                    onResetProgress={handleResetProgress}
                  />
                </motion.div>
              ) : (
                /* TEACHER MAIN DASHBOARD */
                <motion.div
                  key="teacher"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <TeacherDashboard
                    onBackToMain={() => setMode('student')}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* FOOTER */}
          <footer className="bg-[#0a0c10] border-t border-slate-850 py-6 px-8 text-center text-xs text-slate-500 font-sans print:hidden relative">
            <p>
              Simulador Paulista de Matemática • Currículo Paulista do Ensino Fundamental
            </p>
            <p className="mt-1 font-mono text-[10px] text-slate-600">
              Desenvolvido por AI Studio Build • Powered by Google Gemini 3.5
            </p>
          </footer>
        </>
      )}
    </div>
  );
}
