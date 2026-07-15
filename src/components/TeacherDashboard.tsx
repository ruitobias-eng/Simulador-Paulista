import React, { useState } from 'react';
import { Habilidade, GeneratedExam, LessonPlan, Grade, ThematicUnit } from '../types';
import { HABILIDADES } from '../data/habilidades';
import { generateExam, generateLessonPlan } from '../lib/gemini';
import { 
  BookOpen, 
  FileText, 
  Sparkles, 
  Printer, 
  ClipboardCopy, 
  Search, 
  Plus, 
  Check, 
  HelpCircle, 
  Settings, 
  FileCheck,
  ChevronDown,
  ChevronUp,
  Brain,
  Layers,
  MapPin,
  Clock,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

interface TeacherDashboardProps {
  onBackToMain: () => void;
}

export default function TeacherDashboard({ onBackToMain }: TeacherDashboardProps) {
  const [activeTab, setActiveTab] = useState<'reference' | 'exam' | 'lesson'>('reference');
  
  // States for Curriculum Reference Guide
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<Grade | 'Todos'>('Todos');
  const [expandedHabId, setExpandedHabId] = useState<string | null>(null);

  // States for Exam Generator
  const [examGrade, setExamGrade] = useState<Grade>('1');
  const [selectedHabsForExam, setSelectedHabsForExam] = useState<string[]>([]);
  const [examQuestionsCount, setExamQuestionsCount] = useState<number>(5);
  const [examFormat, setExamFormat] = useState<'multiple' | 'open' | 'mix'>('mix');
  const [examTitle, setExamTitle] = useState('');
  const [generatingExam, setGeneratingExam] = useState(false);
  const [generatedExam, setGeneratedExam] = useState<GeneratedExam | null>(null);
  const [showAnswerKey, setShowAnswerKey] = useState(false);

  // States for Lesson Planner
  const [selectedHabForLesson, setSelectedHabForLesson] = useState<string>('EF01MA01');
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<LessonPlan | null>(null);

  // Filter skills for Curriculum Reference Guide
  const filteredHabilidades = HABILIDADES.filter(h => {
    const matchGrade = gradeFilter === 'Todos' || h.grade === gradeFilter;
    const matchSearch = h.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        h.descricao.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        h.unit.toLowerCase().includes(searchQuery.toLowerCase());
    return matchGrade && matchSearch;
  });

  const getUnitBadgeColor = (unit: ThematicUnit) => {
    switch (unit) {
      case 'Números': return 'bg-orange-950/40 text-orange-400 border-orange-900/40';
      case 'Álgebra': return 'bg-sky-950/40 text-indigo-400 border-indigo-900/40';
      case 'Geometria': return 'bg-emerald-950/40 text-emerald-400 border-emerald-900/40';
      case 'Grandezas e Medidas': return 'bg-amber-950/40 text-amber-400 border-amber-900/40';
      case 'Probabilidade e Estatística': return 'bg-purple-950/40 text-purple-400 border-purple-900/40';
      default: return 'bg-slate-900 text-slate-400 border-slate-800';
    }
  };

  const handleToggleHabForExam = (habId: string) => {
    setSelectedHabsForExam(prev => {
      if (prev.includes(habId)) {
        return prev.filter(id => id !== habId);
      } else {
        return [...prev, habId];
      }
    });
  };

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedHabsForExam.length === 0) return;
    
    setGeneratingExam(true);
    setGeneratedExam(null);
    try {
      const exam = await generateExam(
        examGrade,
        selectedHabsForExam,
        examQuestionsCount,
        examFormat
      );
      if (examTitle.trim()) {
        exam.title = examTitle.trim();
      }
      setGeneratedExam(exam);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingExam(false);
    }
  };

  const handleCreateLessonPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratingPlan(true);
    setGeneratedPlan(null);
    try {
      const plan = await generateLessonPlan(selectedHabForLesson);
      setGeneratedPlan(plan);
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingPlan(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 print:space-y-0 print:bg-white relative z-10">
      {/* Welcome & Navigation Header */}
      <div className="bg-gradient-to-r from-[#0a0c10] via-[#13161c] to-indigo-950/30 border border-slate-800/85 rounded-3xl p-6 md:p-8 text-slate-100 shadow-2xl relative overflow-hidden print:hidden">
        <div className="max-w-xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-indigo-600/15 border border-indigo-500/20 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide text-indigo-300">
            <Settings className="w-4 h-4 text-indigo-400" />
            Painel Pedagógico do Professor
          </div>
          <h2 className="font-sans font-extrabold text-2xl md:text-3xl tracking-tight text-slate-100">
            Ferramentas do Educador
          </h2>
          <p className="font-sans text-slate-400 text-sm leading-relaxed">
            Consulte as habilidades, crie avaliações diagnósticas estruturadas para impressão ou elabore planos de aula interativos alinhados ao Currículo Paulista.
          </p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-800/80 gap-1 overflow-x-auto pb-px print:hidden">
        <button
          onClick={() => setActiveTab('reference')}
          className={`py-3 px-5 border-b-2 font-sans font-bold text-sm whitespace-nowrap cursor-pointer transition-all ${
            activeTab === 'reference'
              ? 'border-indigo-500 text-indigo-450 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <span className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Guia do Currículo
          </span>
        </button>
        <button
          onClick={() => setActiveTab('exam')}
          className={`py-3 px-5 border-b-2 font-sans font-bold text-sm whitespace-nowrap cursor-pointer transition-all ${
            activeTab === 'exam'
              ? 'border-indigo-500 text-indigo-450 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <span className="flex items-center gap-2">
            <FileText className="w-4 h-4" /> Gerador de Avaliações
          </span>
        </button>
        <button
          onClick={() => setActiveTab('lesson')}
          className={`py-3 px-5 border-b-2 font-sans font-bold text-sm whitespace-nowrap cursor-pointer transition-all ${
            activeTab === 'lesson'
              ? 'border-indigo-500 text-indigo-450 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-300'
          }`}
        >
          <span className="flex items-center gap-2">
            <Brain className="w-4 h-4" /> Planos de Aula
          </span>
        </button>
      </div>

      {/* TAB 1: CURRICULUM REFERENCE GUIDE */}
      {activeTab === 'reference' && (
        <div className="space-y-6 print:hidden">
          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="w-4.5 h-4.5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar por habilidade, descrição ou unidade (Ex: Adição, EF01...)"
                className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl font-sans text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm"
              />
            </div>
            {/* Year Selector */}
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value as Grade | 'Todos')}
              className="px-4 py-3 bg-slate-900 border border-slate-800 text-slate-300 rounded-2xl font-sans text-sm font-semibold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm cursor-pointer"
            >
              <option value="Todos">Todos os Anos</option>
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

          {/* List of Skills */}
          <div className="grid grid-cols-1 gap-4">
            {filteredHabilidades.map((hab) => {
              const isExpanded = expandedHabId === hab.id;
              return (
                <div 
                  key={hab.id} 
                  className="bg-[#0a0c10] border border-slate-850 rounded-2xl hover:border-slate-700 transition-all overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedHabId(isExpanded ? null : hab.id)}
                    className="w-full text-left p-5 flex items-start justify-between gap-4 cursor-pointer"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold text-xs bg-indigo-950/50 text-indigo-300 px-2 py-0.5 rounded border border-indigo-900/40">
                          {hab.id}
                        </span>
                        <span className="font-sans font-semibold text-xs text-slate-600">•</span>
                        <span className="font-sans font-bold text-xs text-slate-400">
                          {hab.grade}º Ano
                        </span>
                        <span className="font-sans font-semibold text-xs text-slate-600">•</span>
                        <span className={`font-sans font-semibold text-[10px] uppercase px-2 py-0.5 rounded-md border ${getUnitBadgeColor(hab.unit)}`}>
                          {hab.unit}
                        </span>
                      </div>
                      <p className="font-sans font-semibold text-slate-200 text-sm leading-relaxed line-clamp-2 md:line-clamp-none">
                        {hab.descricao}
                      </p>
                    </div>
                    <div className="shrink-0 mt-1 text-slate-500">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {/* Expanded Detail Panel */}
                  {isExpanded && (
                    <div className="bg-slate-950 border-t border-slate-850 p-5 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-sans block mb-1">
                            Objetos de Conhecimento
                          </span>
                          <ul className="list-disc pl-5 font-sans text-slate-400 text-xs space-y-1.5">
                            {hab.objetosConhecimento.map((o, idx) => (
                              <li key={idx}>{o}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-sans block mb-1">
                            Ações Sugeridas de Aprendizagem
                          </span>
                          <p className="font-sans text-slate-400 text-xs leading-relaxed">
                            Propor atividades práticas de {hab.unit.toLowerCase()} utilizando material manipulável relevante, jogos pedagógicos em grupo e situações baseadas em resolução de problemas lúdicos do cotidiano escolar.
                          </p>
                        </div>
                      </div>

                      {/* Quick action buttons inside expanded panel */}
                      <div className="pt-3 border-t border-slate-850 flex gap-2">
                        <button
                          onClick={() => {
                            setExamGrade(hab.grade);
                            setSelectedHabsForExam([hab.id]);
                            setActiveTab('exam');
                          }}
                          className="font-sans font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(79,70,229,0.2)]"
                        >
                          <Plus className="w-3.5 h-3.5" /> Avaliar esta habilidade
                        </button>
                        <button
                          onClick={() => {
                            setSelectedHabForLesson(hab.id);
                            setActiveTab('lesson');
                          }}
                          className="font-sans font-semibold text-xs border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-slate-100 bg-[#0a0c10] px-3.5 py-2 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Brain className="w-3.5 h-3.5" /> Elaborar plano de aula
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: EXAM GENERATOR */}
      {activeTab === 'exam' && (
        <div className="space-y-8">
          {/* Creator form, hide during print */}
          <div className="bg-[#0a0c10] border border-slate-850 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl print:hidden">
            <h3 className="font-sans font-extrabold text-slate-100 text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-450" />
              Configure a sua Avaliação Diagnóstica
            </h3>

            <form onSubmit={handleCreateExam} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Year/Grade Selection */}
                <div className="space-y-2">
                  <label className="font-sans font-bold text-xs text-slate-400 block">Ano Escolar</label>
                  <select
                    value={examGrade}
                    onChange={(e) => {
                      setExamGrade(e.target.value as Grade);
                      setSelectedHabsForExam([]); // clear selected skills as they are grade-specific
                    }}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 text-slate-200 rounded-2xl font-sans text-sm font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
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

                {/* Number of Questions */}
                <div className="space-y-2">
                  <label className="font-sans font-bold text-xs text-slate-400 block">Número de Questões</label>
                  <select
                    value={examQuestionsCount}
                    onChange={(e) => setExamQuestionsCount(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 text-slate-200 rounded-2xl font-sans text-sm font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="3">3 Questões</option>
                    <option value="5">5 Questões</option>
                    <option value="8">8 Questões</option>
                    <option value="10">10 Questões</option>
                  </select>
                </div>

                {/* Question Format */}
                <div className="space-y-2">
                  <label className="font-sans font-bold text-xs text-slate-400 block">Formato das Questões</label>
                  <select
                    value={examFormat}
                    onChange={(e) => setExamFormat(e.target.value as any)}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-800 text-slate-200 rounded-2xl font-sans text-sm font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="mix">Formato Misto (Escolha & Aberta)</option>
                    <option value="multiple">Apenas Múltipla Escolha</option>
                    <option value="open">Apenas Questões Abertas</option>
                  </select>
                </div>
              </div>

              {/* Title input */}
              <div className="space-y-2">
                <label className="font-sans font-bold text-xs text-slate-400 block">Título Personalizado (Opcional)</label>
                <input
                  type="text"
                  value={examTitle}
                  onChange={(e) => setExamTitle(e.target.value)}
                  placeholder={`Ex: Avaliação Diagnóstica de Matemática — ${examGrade}º Ano`}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 text-slate-200 placeholder-slate-600 rounded-2xl font-sans text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Checkboxes of Skills */}
              <div className="space-y-3">
                <label className="font-sans font-bold text-xs text-slate-400 block">
                  Selecione as Habilidades do Currículo Paulista para avaliar (Mínimo 1):
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1 border border-slate-800 rounded-xl bg-slate-950/40">
                  {HABILIDADES.filter(h => h.grade === examGrade).map((hab) => {
                    const isChecked = selectedHabsForExam.includes(hab.id);
                    return (
                      <button
                        type="button"
                        key={hab.id}
                        onClick={() => handleToggleHabForExam(hab.id)}
                        className={`flex items-start text-left p-3 border rounded-xl transition-all cursor-pointer ${
                          isChecked 
                            ? 'bg-indigo-950/20 border-indigo-500 shadow-md ring-1 ring-indigo-500' 
                            : 'bg-slate-900 border-slate-850 hover:border-slate-700'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded mt-0.5 mr-2.5 border flex items-center justify-center shrink-0 ${
                          isChecked ? 'bg-indigo-600 border-indigo-600 text-white shadow-[0_0_10px_rgba(79,70,229,0.3)]' : 'border-slate-700 bg-slate-950'
                        }`}>
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <div className="space-y-1">
                          <span className="font-mono font-bold text-[10px] text-indigo-300 bg-indigo-950/50 border border-indigo-900/40 px-1.5 py-0.5 rounded">
                            {hab.id}
                          </span>
                          <p className="font-sans font-medium text-slate-350 text-xs leading-relaxed line-clamp-2">
                            {hab.descricao}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit button */}
              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  disabled={selectedHabsForExam.length === 0 || generatingExam}
                  className="font-sans font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-indigo-500/20 transition-all inline-flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Gerar Avaliação Completa
                </button>
              </div>
            </form>
          </div>

          {/* Generator Loading State */}
          {generatingExam && (
            <div className="bg-[#0a0c10] rounded-3xl border border-slate-850 p-12 text-center flex flex-col items-center justify-center shadow-2xl min-h-[300px]">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-slate-900" />
                <div className="absolute inset-0 rounded-full border-4 border-indigo-400 border-t-transparent animate-spin" />
              </div>
              <p className="font-sans font-semibold text-slate-100 text-lg">Gerando Avaliação...</p>
              <p className="font-sans text-slate-500 text-sm mt-2 max-w-sm">
                Gemini está elaborando questões contextualizadas e gerando gabaritos diagnósticos para as habilidades do Currículo Paulista selecionadas.
              </p>
            </div>
          )}

          {/* Print Ready Display Sheet */}
          {generatedExam && (
            <div className="space-y-6">
              {/* Action Toolbar on screen, hidden on print */}
              <div className="bg-[#0a0c10] border border-slate-850 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-md print:hidden">
                <span className="font-sans text-xs font-semibold text-slate-500">
                  ✓ Avaliação gerada em {generatedExam.createdAt}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAnswerKey(!showAnswerKey)}
                    className="font-sans font-semibold text-xs border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-slate-155 px-4 py-2.5 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer bg-slate-950/50"
                  >
                    {showAnswerKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showAnswerKey ? 'Ocultar Gabarito' : 'Visualizar Gabarito'}
                  </button>
                  <button
                    onClick={handlePrint}
                    className="font-sans font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-slate-100 px-5 py-2.5 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(79,70,229,0.25)]"
                  >
                    <Printer className="w-4 h-4" /> Imprimir / PDF
                  </button>
                </div>
              </div>

              {/* Physical Sheet Layout */}
              <div className="bg-white p-12 md:p-16 border border-slate-200 rounded-3xl shadow-sm space-y-8 max-w-4xl mx-auto print:border-0 print:p-0 print:shadow-none print:max-w-none">
                {/* School Header Block */}
                <div className="border-b-2 border-slate-800 pb-6 text-center space-y-2">
                  <h4 className="font-sans font-extrabold text-[11px] uppercase tracking-widest text-slate-400">SECRETARIA DA EDUCAÇÃO DO ESTADO DE SÃO PAULO</h4>
                  <h2 className="font-sans font-black text-slate-800 text-xl md:text-2xl tracking-tight">
                    {generatedExam.title}
                  </h2>
                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto pt-4 text-left font-sans text-xs text-slate-500 print:grid-cols-2">
                    <div className="border-b border-slate-300 pb-1">
                      <span className="font-bold text-slate-600">Estudante:</span>
                    </div>
                    <div className="border-b border-slate-300 pb-1">
                      <span className="font-bold text-slate-600">Turma:</span>
                    </div>
                    <div className="border-b border-slate-300 pb-1">
                      <span className="font-bold text-slate-600">Escola:</span>
                    </div>
                    <div className="border-b border-slate-300 pb-1">
                      <span className="font-bold text-slate-600">Data:</span> ____/____/20___
                    </div>
                  </div>
                </div>

                {/* Habilidades Aligned Glossary Block */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 font-sans text-xs text-slate-500 space-y-2 print:bg-slate-50/20">
                  <span className="font-bold uppercase tracking-wider block text-[10px] text-slate-400">Habilidades Avaliadas</span>
                  <div className="flex flex-col gap-1.5">
                    {generatedExam.habilidades.map(id => {
                      const hab = HABILIDADES.find(h => h.id === id);
                      return (
                        <div key={id} className="flex gap-2">
                          <span className="font-mono font-bold text-slate-700 shrink-0">{id}:</span>
                          <span>{hab?.descricao}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Test Questions Block */}
                <div className="space-y-8 pt-4">
                  {generatedExam.questions.map((q, qIdx) => (
                    <div key={qIdx} className="space-y-4 break-inside-avoid">
                      <div className="flex items-start gap-2.5">
                        <span className="font-sans font-extrabold text-slate-800 text-sm mt-0.5">{qIdx + 1}.</span>
                        <div className="space-y-3 flex-1">
                          <p className="font-sans font-semibold text-slate-800 text-sm leading-relaxed">
                            {q.text}
                          </p>
                          <span className="font-mono text-[9px] uppercase tracking-wider font-bold text-slate-400 block print:hidden">
                            Habilidade Avaliada: {q.habilidadeId}
                          </span>
                        </div>
                      </div>

                      {/* Options */}
                      {q.type === 'multiple' && q.options && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-6 font-sans text-xs">
                          {q.options.map((opt, oIdx) => (
                            <div key={oIdx} className="flex items-center gap-2 border border-slate-200 rounded-lg p-2.5 bg-slate-50/20">
                              <span className="w-5 h-5 rounded-md font-mono font-bold bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                                {OPTION_LETTERS[oIdx]}
                              </span>
                              <span className="text-slate-700">{opt}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Open-ended answer box */}
                      {q.type === 'open' && (
                        <div className="h-20 border border-slate-200 rounded-xl bg-slate-50/10 ml-6 relative">
                          <span className="absolute right-3 bottom-2 font-mono text-[9px] text-slate-300 print:hidden">Espaço para resposta</span>
                        </div>
                      )}

                      {/* Answer Key inside questions if showAnswerKey is on */}
                      {showAnswerKey && (
                        <div className="ml-6 p-4 border border-emerald-100 bg-emerald-50/30 rounded-xl space-y-2 font-sans text-xs text-emerald-800 break-inside-avoid">
                          <div className="flex items-center gap-1.5 font-bold text-emerald-700">
                            <FileCheck className="w-4 h-4" />
                            Gabarito Comentado (Questão {qIdx + 1})
                          </div>
                          <div>
                            <span className="font-bold text-slate-700">Resposta Correta:</span> {q.answer}
                          </div>
                          <div>
                            <span className="font-bold text-slate-700">Justificativa Pedagógica:</span> {q.explanation}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Footer sheet page numbering info */}
                <div className="border-t border-slate-200 pt-6 text-center text-[10px] font-sans text-slate-400">
                  Avaliação Gerada pelo Simulador de Matemática • Alinhada ao Currículo Paulista
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: LESSON PLANNER */}
      {activeTab === 'lesson' && (
        <div className="space-y-6">
          {/* Planner Selector Input, hide on print */}
          <div className="bg-[#0a0c10] border border-slate-850 rounded-3xl p-6 md:p-8 space-y-4 shadow-2xl print:hidden">
            <h3 className="font-sans font-bold text-slate-100 text-base flex items-center gap-2">
              <Brain className="w-5 h-5 text-indigo-405" />
              Selecione a Habilidade para o seu Planejamento
            </h3>

            <form onSubmit={handleCreateLessonPlan} className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2 w-full">
                <label className="font-sans font-bold text-xs text-slate-400 block">Habilidade do Currículo Paulista</label>
                <select
                  value={selectedHabForLesson}
                  onChange={(e) => setSelectedHabForLesson(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-800 text-slate-200 rounded-2xl font-sans text-sm font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {HABILIDADES.map(h => (
                    <option key={h.id} value={h.id}>{h.id} — {h.descricao.substring(0, 70)}...</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={generatingPlan}
                className="font-sans font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl shadow-lg transition-all inline-flex items-center gap-1.5 disabled:opacity-50 w-full sm:w-auto justify-center cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" /> Gerar Plano com AI
              </button>
            </form>
          </div>

          {/* Generator Loading State */}
          {generatingPlan && (
            <div className="bg-[#0a0c10] rounded-3xl border border-slate-850 p-12 text-center flex flex-col items-center justify-center shadow-2xl min-h-[300px]">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-slate-900" />
                <div className="absolute inset-0 rounded-full border-4 border-indigo-450 border-t-transparent animate-spin" />
              </div>
              <p className="font-sans font-semibold text-slate-100 text-lg">Estruturando Plano de Aula...</p>
              <p className="font-sans text-slate-500 text-sm mt-2 max-w-sm">
                Gemini está elaborando uma proposta pedagógica completa contendo materiais concretos, metodologias ativas, divisão de tempos e avaliações formativas.
              </p>
            </div>
          )}

          {/* Lesson Plan Result View */}
          {generatedPlan && (
            <div className="space-y-6">
              {/* Action Toolbar */}
              <div className="bg-[#0a0c10] border border-slate-850 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-md print:hidden">
                <span className="font-sans text-xs font-semibold text-indigo-400 bg-indigo-950/40 border border-indigo-900/30 px-3 py-1 rounded-full">
                  ✓ Plano de Aula Alinhado à Habilidade {generatedPlan.habilidadeId}
                </span>

                <button
                  onClick={handlePrint}
                  className="font-sans font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-slate-100 px-5 py-2.5 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(79,70,229,0.25)]"
                >
                  <Printer className="w-4 h-4" /> Imprimir Plano
                </button>
              </div>

              {/* Lesson Plan Document Sheet */}
              <div className="bg-white p-12 md:p-16 border border-slate-200 rounded-3xl shadow-sm space-y-8 max-w-4xl mx-auto print:border-0 print:p-0 print:shadow-none print:max-w-none">
                {/* Header */}
                <div className="border-b-2 border-indigo-600 pb-6 space-y-3">
                  <span className="font-mono text-xs bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded border border-indigo-100 font-bold inline-block">
                    Plano de Aula Pedagógico
                  </span>
                  <h2 className="font-sans font-black text-slate-800 text-xl md:text-2xl leading-tight">
                    {generatedPlan.title}
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-3 pt-2 text-xs font-sans text-slate-500">
                    <div>
                      <span className="font-bold text-slate-700">Habilidade Foco:</span> {generatedPlan.habilidadeId}
                    </div>
                    <span className="hidden sm:inline text-slate-300">|</span>
                    <div>
                      <span className="font-bold text-slate-700">Público-Alvo:</span> Ensino Fundamental
                    </div>
                  </div>
                </div>

                {/* Section: Objective */}
                <div className="space-y-2">
                  <h4 className="font-sans font-black text-xs text-indigo-700 uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle className="w-4.5 h-4.5" /> Objetivos Pedagógicos
                  </h4>
                  <p className="font-sans text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                    {generatedPlan.objective}
                  </p>
                </div>

                {/* Section: Objects of Knowledge */}
                <div className="space-y-2">
                  <h4 className="font-sans font-black text-xs text-indigo-700 uppercase tracking-wider flex items-center gap-2">
                    <Layers className="w-4.5 h-4.5" /> Objetos de Conhecimento
                  </h4>
                  <p className="font-sans text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                    {generatedPlan.objectsOfKnowledge}
                  </p>
                </div>

                {/* Section: Resources */}
                <div className="space-y-2">
                  <h4 className="font-sans font-black text-xs text-indigo-700 uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-4.5 h-4.5" /> Recursos e Materiais Necessários
                  </h4>
                  <ul className="list-disc pl-5 font-sans text-slate-600 text-sm space-y-1.5">
                    {generatedPlan.resources.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Section: Methodology */}
                <div className="space-y-4">
                  <h4 className="font-sans font-black text-xs text-indigo-700 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4.5 h-4.5" /> Procedimento Metodológico
                  </h4>
                  
                  <div className="space-y-4 pl-4 border-l-2 border-slate-200">
                    <div className="space-y-1">
                      <span className="font-sans font-bold text-xs text-slate-800 block">1. Introdução / Mobilização</span>
                      <p className="font-sans text-slate-600 text-sm leading-relaxed">
                        {generatedPlan.methodology.introduction}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="font-sans font-bold text-xs text-slate-800 block">2. Desenvolvimento / Atividade Prática</span>
                      <p className="font-sans text-slate-600 text-sm leading-relaxed">
                        {generatedPlan.methodology.development}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="font-sans font-bold text-xs text-slate-800 block">3. Conclusão / Sistematização</span>
                      <p className="font-sans text-slate-600 text-sm leading-relaxed">
                        {generatedPlan.methodology.conclusion}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section: Assessment */}
                <div className="space-y-2">
                  <h4 className="font-sans font-black text-xs text-indigo-700 uppercase tracking-wider flex items-center gap-2">
                    <FileCheck className="w-4.5 h-4.5" /> Proposta de Avaliação Formativa
                  </h4>
                  <p className="font-sans text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                    {generatedPlan.assessment}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
