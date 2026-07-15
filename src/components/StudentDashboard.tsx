import React, { useState } from 'react';
import { Habilidade, StudentProfile, Grade, ThematicUnit } from '../types';
import { HABILIDADES } from '../data/habilidades';
import { 
  BookOpen, 
  Award, 
  Compass, 
  ChevronRight, 
  CheckCircle, 
  Percent, 
  Calendar,
  History,
  Trophy,
  Star,
  Sparkles
} from 'lucide-react';

interface StudentDashboardProps {
  profile: StudentProfile;
  onSelectHabilidade: (habilidade: Habilidade) => void;
  onResetProgress: () => void;
}

export default function StudentDashboard({ profile, onSelectHabilidade, onResetProgress }: StudentDashboardProps) {
  const [selectedGrade, setSelectedGrade] = useState<Grade>(profile.grade || '1');
  const [selectedUnit, setSelectedUnit] = useState<ThematicUnit | 'Todos'>('Todos');

  // Filter skills based on Year and Thematic Unit
  const filteredHabilidades = HABILIDADES.filter(h => {
    const matchGrade = h.grade === selectedGrade;
    const matchUnit = selectedUnit === 'Todos' || h.unit === selectedUnit;
    return matchGrade && matchUnit;
  });

  const grades: { value: Grade; label: string; desc: string }[] = [
    { value: '1', label: '1º Ano', desc: 'Contagem, Adição Básica, Localização' },
    { value: '2', label: '2º Ano', desc: 'Centenas, Dobro/Metade, Sequências' },
    { value: '3', label: '3º Ano', desc: 'Milhar, Multiplicação, Figuras Planas' },
    { value: '4', label: '4º Ano', desc: 'Frações, Algoritmos, Simetria, Gráficos' },
    { value: '5', label: '5º Ano', desc: 'Decimais, Porcentagem, Proporcionalidade' },
    { value: '6', label: '6º Ano', desc: 'Números Racionais, Prismas e Pirâmides' },
    { value: '7', label: '7º Ano', desc: 'Porcentagem, Acréscimos, Áreas de Triângulos' },
    { value: '8', label: '8º Ano', desc: 'Potenciação, Expoentes Inteiros, Equação Linear' },
    { value: '9', label: '9º Ano', desc: 'Funções, Variáveis, Equações de 2º Grau' },
    { value: 'EM1', label: '1º Ano EM', desc: 'Modelagem, Juros, Gráficos de Funções' },
    { value: 'EM2', label: '2º Ano EM', desc: 'IDH, Máximos/Mínimos, Otimização' },
    { value: 'EM3', label: '3º Ano EM', desc: 'Combinatória, Logaritmos, Probabilidade' }
  ];

  const units: (ThematicUnit | 'Todos')[] = [
    'Todos',
    'Números',
    'Álgebra',
    'Geometria',
    'Grandezas e Medidas',
    'Probabilidade e Estatística'
  ];

  // Helper to color thematic units tags nicely
  const getUnitColor = (unit: ThematicUnit) => {
    switch (unit) {
      case 'Números': return 'bg-orange-950/40 text-orange-400 border-orange-900/40';
      case 'Álgebra': return 'bg-sky-950/40 text-indigo-400 border-indigo-900/40';
      case 'Geometria': return 'bg-emerald-950/40 text-emerald-400 border-emerald-900/40';
      case 'Grandezas e Medidas': return 'bg-amber-950/40 text-amber-400 border-amber-900/40';
      case 'Probabilidade e Estatística': return 'bg-purple-950/40 text-purple-400 border-purple-900/40';
      default: return 'bg-slate-900 text-slate-400 border-slate-800';
    }
  };

  // Calculate statistics
  const historyCount = profile.history.length;
  const averageScore = historyCount > 0 
    ? Math.round((profile.history.reduce((sum, h) => sum + (h.score / h.total), 0) / historyCount) * 100)
    : 0;

  const totalMasters = Object.values(profile.progress).filter(p => p.status === 'Mestre').length;

  return (
    <div className="space-y-8 relative z-10">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0a0c10] via-[#13161c] to-indigo-950/30 border border-slate-800/85 rounded-3xl p-6 md:p-8 text-slate-100 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-[0.03] pointer-events-none translate-y-1/4 translate-x-1/4">
          <Trophy className="w-80 h-80 text-white" />
        </div>
        <div className="max-w-xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-indigo-600/15 border border-indigo-500/20 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide text-indigo-300">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Arena do Estudante
          </div>
          <h2 className="font-sans font-extrabold text-2xl md:text-3xl tracking-tight text-slate-100">
            Olá, {profile.name}! Pronto para treinar?
          </h2>
          <p className="font-sans text-slate-400 text-sm leading-relaxed">
            Selecione o seu ano escolar e escolha uma habilidade para praticar. A cada simulado completo, você ganha pontos e evolui rumo ao nível Mestre!
          </p>
        </div>
      </div>

      {/* Mini Achievements Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0a0c10] p-5 rounded-2xl border border-slate-850 shadow-md flex items-center gap-4">
          <div className="p-3 bg-indigo-950/50 text-indigo-400 border border-indigo-900/40 rounded-xl">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <span className="font-sans font-semibold text-xs text-slate-500 block">Simulados Feitos</span>
            <span className="font-mono font-extrabold text-xl text-slate-200">{historyCount}</span>
          </div>
        </div>
        <div className="bg-[#0a0c10] p-5 rounded-2xl border border-slate-850 shadow-md flex items-center gap-4">
          <div className="p-3 bg-emerald-950/50 text-emerald-400 border border-emerald-900/40 rounded-xl">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <span className="font-sans font-semibold text-xs text-slate-500 block">Precisão Média</span>
            <span className="font-mono font-extrabold text-xl text-slate-200">{averageScore}%</span>
          </div>
        </div>
        <div className="bg-[#0a0c10] p-5 rounded-2xl border border-slate-850 shadow-md flex items-center gap-4">
          <div className="p-3 bg-amber-950/50 text-amber-400 border border-amber-900/40 rounded-xl">
            <Star className="w-6 h-6 animate-pulse text-amber-400" />
          </div>
          <div>
            <span className="font-sans font-semibold text-xs text-slate-500 block">Habilidades Concluídas</span>
            <span className="font-mono font-extrabold text-xl text-slate-200">{totalMasters}</span>
          </div>
        </div>
      </div>

      {/* Grade Selector Grid */}
      <div className="space-y-4">
        <h3 className="font-sans font-bold text-slate-200 text-base flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          1. Escolha o seu Ano Escolar
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-4">
          {grades.map((grade) => {
            const isSelected = selectedGrade === grade.value;
            return (
              <button
                key={grade.value}
                onClick={() => setSelectedGrade(grade.value)}
                className={`p-4 rounded-2xl text-left border transition-all duration-200 cursor-pointer ${
                  isSelected 
                    ? 'border-indigo-500 bg-indigo-950/15 shadow-[0_0_15px_rgba(79,70,229,0.15)] ring-1 ring-indigo-500' 
                    : 'border-slate-850 bg-[#0a0c10]/80 hover:border-slate-700 hover:bg-slate-900/40'
                }`}
              >
                <span className={`px-2.5 h-8 rounded-xl font-sans font-extrabold text-xs flex items-center justify-center mb-3 w-fit ${
                  isSelected ? 'bg-indigo-600 text-slate-100 shadow-[0_0_15px_rgba(79,70,229,0.3)]' : 'bg-slate-900 text-slate-400'
                }`}>
                  {grade.value.startsWith('EM') ? `${grade.value.replace('EM', '')}º EM` : `${grade.value}º EF`}
                </span>
                <h4 className="font-sans font-bold text-slate-200 text-sm">{grade.label}</h4>
                <p className="font-sans text-[11px] text-slate-500 mt-1 leading-relaxed line-clamp-2">
                  {grade.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Thematic Unit Filters */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-sans font-bold text-slate-200 text-base flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-400" />
            2. Filtre por Área Temática
          </h3>
          {historyCount > 0 && (
            <button 
              onClick={onResetProgress}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 hover:underline cursor-pointer"
            >
              Zerar Progresso
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {units.map((unit) => {
            const isSelected = selectedUnit === unit;
            return (
              <button
                key={unit}
                onClick={() => setSelectedUnit(unit)}
                className={`px-4 py-2 rounded-full border text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.25)]'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {unit}
              </button>
            );
          })}
        </div>
      </div>

      {/* Habilidades Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-sans font-semibold text-xs text-slate-500">
            Mostrando {filteredHabilidades.length} habilidades alinhadas
          </span>
        </div>

        {filteredHabilidades.length === 0 ? (
          <div className="bg-[#0a0c10] rounded-2xl border border-dashed border-slate-800 p-12 text-center">
            <p className="font-sans text-slate-500 font-medium text-sm">
              Nenhuma habilidade cadastrada para esta combinação de filtros.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredHabilidades.map((hab) => {
              const progress = profile.progress[hab.id] || {
                habilidadeId: hab.id,
                resolvedCount: 0,
                correctCount: 0,
                lastScore: 0,
                status: 'Iniciante'
              };

              const percentProgress = progress.resolvedCount > 0 
                ? Math.round((progress.correctCount / (progress.resolvedCount * 5)) * 100) // Assumes 5 questions per practice session
                : 0;

              return (
                <div 
                  key={hab.id} 
                  className="bg-[#0a0c10] border border-slate-850 rounded-2xl p-5 hover:border-slate-700 hover:shadow-[0_0_20px_rgba(79,70,229,0.05)] transition-all duration-200 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-bold text-xs bg-indigo-950/40 text-indigo-300 px-2.5 py-0.5 rounded-lg border border-indigo-900/40">
                        {hab.id}
                      </span>
                      <span className={`font-sans font-semibold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md border ${getUnitColor(hab.unit)}`}>
                        {hab.unit}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="font-sans text-slate-200 text-sm font-medium leading-relaxed">
                      {hab.descricao}
                    </p>

                    {/* Objects of Knowledge summary */}
                    <div className="bg-[#111319] p-2.5 rounded-xl border border-slate-850">
                      <span className="font-sans text-[10px] text-slate-500 uppercase font-bold block mb-1">Objetos de Conhecimento</span>
                      <p className="font-sans text-[11px] text-slate-400 line-clamp-1">
                        {hab.objetosConhecimento.join(', ')}
                      </p>
                    </div>
                  </div>

                  {/* Progress & Practice Action */}
                  <div className="mt-5 pt-4 border-t border-slate-850 flex items-center justify-between gap-4">
                    {progress.resolvedCount > 0 ? (
                      <div className="flex items-center gap-2.5">
                        <CheckCircle className={`w-4 h-4 ${progress.status === 'Mestre' ? 'text-amber-500' : 'text-emerald-500'}`} />
                        <div>
                          <span className="font-sans font-bold text-xs text-slate-300 block">
                            Nível {progress.status}
                          </span>
                          <span className="font-sans text-[10px] text-slate-500">
                            {progress.correctCount} acertos de {progress.resolvedCount * 5}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="font-sans text-xs font-semibold text-slate-500">
                        Ainda não praticado
                      </span>
                    )}

                    <button
                      onClick={() => onSelectHabilidade(hab)}
                      className="font-sans font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-slate-100 pl-4 pr-3 py-2.5 rounded-xl inline-flex items-center gap-1 hover:translate-x-0.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(79,70,229,0.2)] hover:shadow-indigo-500/20"
                    >
                      Praticar <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* History Log Card */}
      {historyCount > 0 && (
        <div className="bg-[#0a0c10] border border-slate-850 rounded-2xl p-6 space-y-4">
          <h3 className="font-sans font-bold text-slate-200 text-base flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            Histórico Recente de Simulados
          </h3>
          <div className="overflow-hidden border border-slate-850 rounded-xl bg-slate-950/30 divide-y divide-slate-850">
            {profile.history.slice().reverse().map((entry, idx) => {
              const hab = HABILIDADES.find(h => h.id === entry.habilidadeId);
              const scorePercent = Math.round((entry.score / entry.total) * 100);
              
              return (
                <div key={idx} className="p-4 bg-transparent flex flex-wrap items-center justify-between gap-3 hover:bg-slate-900/40 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-xs bg-indigo-950/50 text-indigo-300 px-2 py-0.5 rounded border border-indigo-900/30">
                      {entry.habilidadeId}
                    </span>
                    <div>
                      <h4 className="font-sans font-semibold text-slate-200 text-xs truncate max-w-xs sm:max-w-md">
                        {hab?.descricao || 'Habilidade Geral'}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>{entry.date}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-mono font-extrabold text-sm text-slate-300">
                      {entry.score} / {entry.total}
                    </span>
                    <span className={`font-sans font-bold text-xs px-2.5 py-1 rounded-full ${
                      scorePercent >= 80 
                        ? 'bg-emerald-950/45 text-emerald-400 border border-emerald-900/40' 
                        : scorePercent >= 50 
                          ? 'bg-amber-950/45 text-amber-400 border border-amber-900/40' 
                          : 'bg-rose-950/45 text-rose-400 border border-rose-900/40'
                    }`}>
                      {scorePercent}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
