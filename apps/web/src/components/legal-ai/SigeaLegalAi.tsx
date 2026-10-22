import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useCases } from '../../context/CasesContext';
import {
  getDemoResponse,
  AI_QUICK_SUGGESTIONS,
  AiDemoResponse,
  AiResponseSection,
  AiSuggestion
} from '../../data/legalAiDemoScenarios';
import {
  Bot,
  User,
  Send,
  Sparkles,
  FileText,
  Search,
  Mail,
  FilePlus,
  ListChecks,
  Users,
  Copy,
  Check,
  Edit3,
  AlertTriangle,
  ShieldCheck,
  Briefcase,
  ChevronDown,
  RotateCcw,
  Info,
  Zap,
  BookOpen,
  Shield
} from 'lucide-react';

// ─── Icon resolver ────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ReactNode> = {
  FileText: <FileText className="w-4 h-4" />,
  Search: <Search className="w-4 h-4" />,
  Mail: <Mail className="w-4 h-4" />,
  FilePlus: <FilePlus className="w-4 h-4" />,
  ListChecks: <ListChecks className="w-4 h-4" />,
  Users: <Users className="w-4 h-4" />
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  scenarioId?: string;
  response?: AiDemoResponse;
  isStreaming?: boolean;
}

interface SigeaLegalAiProps {
  onSelectCase?: (caseId: string) => void;
  initialCaseId?: string | null;
}

// ─── Source Badge Colors ──────────────────────────────────────────────────────

const SOURCE_STYLES: Record<string, { bg: string; border: string; text: string; icon: React.ReactNode }> = {
  CASE_DATA: { bg: 'bg-blue-500/10', border: 'border-blue-500/25', text: 'text-blue-300', icon: <Briefcase className="w-3 h-3" /> },
  ACTIVITY_LOG: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', text: 'text-emerald-300', icon: <BookOpen className="w-3 h-3" /> },
  MOCK_DOCUMENT: { bg: 'bg-violet-500/10', border: 'border-violet-500/25', text: 'text-violet-300', icon: <FileText className="w-3 h-3" /> },
  DEADLINE_DATA: { bg: 'bg-amber-500/10', border: 'border-amber-500/25', text: 'text-amber-300', icon: <AlertTriangle className="w-3 h-3" /> },
  FEE_DATA: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', text: 'text-emerald-300', icon: <Zap className="w-3 h-3" /> },
  AI_SUGGESTION: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/25', text: 'text-indigo-300', icon: <Sparkles className="w-3 h-3" /> }
};

// ─── Component ────────────────────────────────────────────────────────────────

export const SigeaLegalAi: React.FC<SigeaLegalAiProps> = ({
  initialCaseId
}) => {
  const { cases } = useCases();

  const [selectedCaseId, setSelectedCaseId] = useState<string>(initialCaseId || cases[0]?.id || '');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [showCaseSelector, setShowCaseSelector] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const caseSelectorRef = useRef<HTMLDivElement>(null);

  const selectedCase = cases.find(c => c.id === selectedCaseId);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Close case selector on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (caseSelectorRef.current && !caseSelectorRef.current.contains(e.target as Node)) {
        setShowCaseSelector(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ─── Demo Response Streaming Effect ───────────────────────────────────────

  const streamResponse = useCallback((response: AiDemoResponse, scenarioId: string) => {
    setIsTyping(true);

    // Simulate progressive "thinking" delay (visual only)
    const thinkingDelay = 800 + Math.random() * 1200;

    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: response.title,
        timestamp: new Date(),
        scenarioId,
        response,
        isStreaming: true
      };

      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);

      // Remove streaming flag after a brief animation
      setTimeout(() => {
        setMessages(prev =>
          prev.map(m => m.id === assistantMsg.id ? { ...m, isStreaming: false } : m)
        );
      }, 600);
    }, thinkingDelay);
  }, []);

  // ─── Handle Scenario Selection ────────────────────────────────────────────

  const handleScenario = useCallback((suggestion: AiSuggestion) => {
    if (isTyping) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: suggestion.label,
      timestamp: new Date(),
      scenarioId: suggestion.id
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    const response = getDemoResponse(suggestion.id, selectedCaseId);
    if (response) {
      streamResponse(response, suggestion.id);
    }
  }, [isTyping, selectedCaseId, streamResponse]);

  // ─── Handle Free-Text Input ───────────────────────────────────────────────

  const handleSendMessage = useCallback(() => {
    const trimmed = inputText.trim();
    if (!trimmed || isTyping) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: trimmed,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    // Try to match to a scenario by keyword
    const lower = trimmed.toLowerCase();
    let matchedScenario: string | null = null;

    if (lower.includes('resum') || lower.includes('síntese') || lower.includes('estado')) {
      matchedScenario = 'summary';
    } else if (lower.includes('document') || lower.includes('análise') || lower.includes('analise') || lower.includes('analisar')) {
      matchedScenario = 'doc-analysis';
    } else if (lower.includes('client') || lower.includes('comunicação') || lower.includes('comunicacao') || lower.includes('carta') || lower.includes('email')) {
      matchedScenario = 'draft-client';
    } else if (lower.includes('requerimento') || lower.includes('petição') || lower.includes('peticao') || lower.includes('modelo') || lower.includes('minuta')) {
      matchedScenario = 'draft-petition';
    } else if (lower.includes('tarefa') || lower.includes('organiz') || lower.includes('pendente') || lower.includes('lista')) {
      matchedScenario = 'work-tasks';
    } else if (lower.includes('reunião') || lower.includes('reuniao') || lower.includes('meeting') || lower.includes('briefing') || lower.includes('preparar')) {
      matchedScenario = 'meeting-prep';
    }

    if (matchedScenario) {
      const response = getDemoResponse(matchedScenario, selectedCaseId);
      if (response) {
        streamResponse(response, matchedScenario);
        return;
      }
    }

    // No match — show fallback
    setIsTyping(true);
    setTimeout(() => {
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: 'Cenário não suportado',
        timestamp: new Date(),
        response: {
          scenarioId: 'fallback',
          title: 'Modo de Demonstração',
          category: 'SUMMARY',
          sections: [{
            title: 'Cenário Demonstrativo',
            content: `Obrigado pela sua questão. No modo de demonstração, o assistente SIGEA Legal AI reconhece as seguintes acções:\n\n• **Resumir o Processo** — síntese dos factos e próximos passos\n• **Analisar Documentos** — revisão dos documentos juntados\n• **Rascunho para Cliente** — preparar comunicação ao cliente\n• **Modelo de Requerimento** — estruturar peça processual\n• **Organizar Tarefas** — listar pendências e sugestões\n• **Preparar Reunião** — briefing executivo e questões\n\nSeleccione uma das opções acima ou reformule a sua pergunta utilizando termos como "resumo", "documentos", "tarefa", "reunião" ou "rascunho".\n\nEm produção, o SIGEA Legal AI utilizará processamento de linguagem natural para compreender pedidos em formato livre — com revisão humana obrigatória.`,
            sourceLabel: 'Sistema SIGEA (demonstração)',
            sourceType: 'AI_SUGGESTION'
          }],
          disclaimers: ['Funcionalidade em modo de demonstração.', 'Nenhuma informação foi enviada para serviços externos.']
        }
      };
      setMessages(prev => [...prev, fallbackMsg]);
      setIsTyping(false);
    }, 600);
  }, [inputText, isTyping, selectedCaseId, streamResponse]);

  // ─── Keyboard Handler ─────────────────────────────────────────────────────

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ─── Copy to Clipboard ────────────────────────────────────────────────────

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // ─── Clear Conversation ───────────────────────────────────────────────────

  const handleClearChat = () => {
    setMessages([]);
    setEditingId(null);
    setEditText('');
  };

  // ─── Render Section Content (simple markdown-ish) ─────────────────────────

  const renderContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      // Bold
      const boldLine = line.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>');
      // Checkboxes
      const withCheckboxes = boldLine
        .replace(/- \[ \]/g, '<span class="inline-flex items-center gap-1"><span class="w-3.5 h-3.5 border border-slate-600 rounded inline-block"></span></span>')
        .replace(/- \[x\]/g, '<span class="inline-flex items-center gap-1"><span class="w-3.5 h-3.5 bg-emerald-500 border border-emerald-400 rounded inline-block text-center text-white text-[9px] leading-[14px]">✓</span></span>');

      if (line.startsWith('| ')) {
        // Table row
        const cells = line.split('|').filter(c => c.trim() !== '');
        if (cells.every(c => /^[\s-]+$/.test(c))) {
          return null; // Skip separator row
        }
        const isHeader = i > 0 && lines[i + 1]?.includes('---');
        return (
          <div key={i} className={`grid gap-2 text-[11px] py-1.5 px-2 border-b border-slate-800/50 ${isHeader ? 'font-bold text-slate-200' : 'text-slate-300'}`}
            style={{ gridTemplateColumns: `repeat(${cells.length}, minmax(0, 1fr))` }}>
            {cells.map((cell, ci) => (
              <span key={ci} className="truncate" dangerouslySetInnerHTML={{ __html: cell.trim().replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            ))}
          </div>
        );
      }

      if (line.startsWith('---')) {
        return <div key={i} className="border-t border-slate-700/50 my-3" />;
      }

      if (line.trim() === '') {
        return <div key={i} className="h-2" />;
      }

      return (
        <p key={i} className="text-[13px] leading-relaxed text-slate-300" dangerouslySetInnerHTML={{ __html: withCheckboxes }} />
      );
    });
  };

  // ─── Render a Single Response Section ─────────────────────────────────────

  const renderSection = (section: AiResponseSection, msgId: string, sectionIdx: number) => {
    const style = SOURCE_STYLES[section.sourceType] || SOURCE_STYLES.AI_SUGGESTION;
    const sectionId = `${msgId}-s${sectionIdx}`;
    const isEditing = editingId === sectionId;

    return (
      <div key={sectionIdx} className={`rounded-xl border ${section.needsHumanReview ? 'border-amber-500/20 bg-amber-500/[0.03]' : 'border-slate-800/60 bg-slate-900/40'} overflow-hidden`}>
        {/* Section Header */}
        <div className="px-4 py-2.5 flex items-center justify-between border-b border-slate-800/40">
          <h4 className="text-xs font-bold text-white flex items-center gap-2">
            {section.needsHumanReview && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
            {section.title}
          </h4>
          <div className="flex items-center gap-1.5">
            {/* Source badge */}
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${style.bg} ${style.border} ${style.text}`}>
              {style.icon}
              {section.sourceLabel}
            </span>
          </div>
        </div>

        {/* Section Content */}
        <div className="px-4 py-3">
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editText}
                onChange={e => setEditText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-[13px] text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50 resize-y min-h-[120px]"
                rows={8}
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setEditingId(null)}
                  className="px-3 py-1 text-[11px] text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    handleCopy(editText, sectionId);
                    setEditingId(null);
                  }}
                  className="px-3 py-1 text-[11px] text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  Copiar Editado
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {renderContent(section.content)}
            </div>
          )}
        </div>

        {/* Section Actions */}
        {!isEditing && (
          <div className="px-4 py-2 border-t border-slate-800/30 flex items-center gap-2">
            <button
              onClick={() => handleCopy(section.content, sectionId)}
              className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg transition-colors"
              title="Copiar conteúdo"
            >
              {copiedId === sectionId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedId === sectionId ? 'Copiado!' : 'Copiar'}
            </button>
            {(section.isActionable || section.needsHumanReview) && (
              <button
                onClick={() => { setEditingId(sectionId); setEditText(section.content); }}
                className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg transition-colors"
                title="Editar e reutilizar"
              >
                <Edit3 className="w-3 h-3" />
                Editar
              </button>
            )}
            {section.needsHumanReview && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full ml-auto">
                <ShieldCheck className="w-3 h-3" />
                Requer revisão do advogado
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="h-full flex flex-col bg-slate-950/60">
      {/* ── Top Bar ─────────────────────────────────────────────────────────── */}
      <div className="shrink-0 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm px-6 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 via-violet-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white flex items-center gap-2">
                SIGEA Legal AI
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30 uppercase tracking-wider">
                  Demonstração
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Assistente jurídico inteligente • Motor determinístico • Sem chamadas externas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Case Selector */}
            <div className="relative" ref={caseSelectorRef}>
              <button
                onClick={() => setShowCaseSelector(!showCaseSelector)}
                className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs text-slate-200 transition-colors max-w-[280px]"
              >
                <Briefcase className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="truncate font-semibold">
                  {selectedCase ? `${selectedCase.caseNumber} — ${selectedCase.clientName}` : 'Seleccionar processo'}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${showCaseSelector ? 'rotate-180' : ''}`} />
              </button>

              {showCaseSelector && (
                <div className="absolute right-0 top-full mt-1.5 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-20 overflow-hidden">
                  <div className="p-2 border-b border-slate-800">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2">
                      Contexto do Processo
                    </p>
                  </div>
                  <div className="max-h-64 overflow-y-auto p-1.5">
                    {cases.map(c => (
                      <button
                        key={c.id}
                        onClick={() => { setSelectedCaseId(c.id); setShowCaseSelector(false); }}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition-colors ${
                          selectedCaseId === c.id
                            ? 'bg-blue-600/15 text-white border border-blue-500/30'
                            : 'text-slate-300 hover:bg-slate-800 border border-transparent'
                        }`}
                      >
                        <div className="font-bold">{c.caseNumber}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5 truncate">{c.subject}</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{c.clientName}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {messages.length > 0 && (
              <button
                onClick={handleClearChat}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                title="Limpar conversa"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Chat Area ───────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        {messages.length === 0 ? (
          // ── Welcome Screen ──────────────────────────────────────────────
          <div className="max-w-3xl mx-auto">
            {/* Hero */}
            <div className="text-center mb-8 pt-8">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500/20 via-violet-500/20 to-purple-500/20 border border-indigo-500/25 flex items-center justify-center mb-4">
                <Bot className="w-8 h-8 text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                Assistente Jurídico SIGEA
              </h2>
              <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
                Analise processos, prepare documentos e organize o trabalho jurídico.
                Seleccione um processo acima e escolha uma acção demonstrativa abaixo.
              </p>
            </div>

            {/* Process Context Card */}
            {selectedCase && (
              <div className="mb-8 p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-blue-400">
                        Proc. nº {selectedCase.caseNumber}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                        selectedCase.priority === 'CRITICAL'
                          ? 'bg-red-500/15 text-red-400 border border-red-500/25'
                          : selectedCase.priority === 'HIGH'
                            ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25'
                            : 'bg-slate-700/60 text-slate-300 border border-slate-600/40'
                      }`}>
                        {selectedCase.priority}
                      </span>
                    </div>
                    <p className="text-xs text-white font-semibold mt-1 truncate">{selectedCase.subject}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{selectedCase.clientName} • {selectedCase.courtName}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {AI_QUICK_SUGGESTIONS.map(suggestion => (
                <button
                  key={suggestion.id}
                  onClick={() => handleScenario(suggestion)}
                  disabled={isTyping}
                  className="group p-4 bg-slate-900/50 hover:bg-slate-800/70 border border-slate-800 hover:border-indigo-500/30 rounded-xl text-left transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                      {ICON_MAP[suggestion.icon] || <Sparkles className="w-4 h-4" />}
                    </div>
                    <span className="text-xs font-bold text-white">{suggestion.label}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{suggestion.description}</p>
                </button>
              ))}
            </div>

            {/* Disclaimers */}
            <div className="mt-8 p-4 bg-slate-900/40 border border-slate-800 rounded-xl">
              <div className="flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-[11px] text-slate-400 space-y-1">
                  <p className="font-semibold text-slate-300">Aviso de Demonstração</p>
                  <p>O conteúdo gerado é demonstrativo e baseado em dados fictícios. Rascunhos e sugestões requerem revisão do advogado e não constituem aconselhamento jurídico. O protótipo não verifica automaticamente a legislação em vigor. Nenhuma informação é enviada para serviços externos.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // ── Messages ────────────────────────────────────────────────────
          <div className="max-w-4xl mx-auto space-y-5">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'assistant' && (
                  <div className="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/25 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-indigo-400" />
                  </div>
                )}

                <div className={`${msg.role === 'user' ? 'max-w-md' : 'max-w-3xl flex-1'}`}>
                  {msg.role === 'user' ? (
                    <div className="px-4 py-3 bg-blue-600/20 border border-blue-500/25 rounded-2xl rounded-tr-md">
                      <p className="text-[13px] text-white">{msg.content}</p>
                      <p className="text-[10px] text-blue-300/50 mt-1 text-right">
                        {msg.timestamp.toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  ) : msg.response ? (
                    <div className={`space-y-3 ${msg.isStreaming ? 'animate-fade-in' : ''}`}>
                      {/* Response Title */}
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xs font-bold text-indigo-300">{msg.response.title}</h3>
                        <span className="text-[10px] text-slate-500">
                          {msg.timestamp.toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      {/* Sections */}
                      {msg.response.sections.map((section, idx) => renderSection(section, msg.id, idx))}

                      {/* Disclaimers */}
                      {msg.response.disclaimers.length > 0 && (
                        <div className="p-3 bg-slate-900/30 border border-slate-800/40 rounded-lg flex items-start gap-2">
                          <Info className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                          <div className="text-[10px] text-slate-500 space-y-0.5">
                            {msg.response.disclaimers.map((d, i) => (
                              <p key={i}>• {d}</p>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Quick Follow-up Actions */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {AI_QUICK_SUGGESTIONS
                          .filter(s => s.id !== msg.scenarioId)
                          .slice(0, 3)
                          .map(s => (
                            <button
                              key={s.id}
                              onClick={() => handleScenario(s)}
                              disabled={isTyping}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-medium text-slate-300 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-indigo-500/30 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {ICON_MAP[s.icon] ? React.cloneElement(ICON_MAP[s.icon] as React.ReactElement, { className: 'w-3 h-3' }) : <Sparkles className="w-3 h-3" />}
                              {s.label}
                            </button>
                          ))}
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-2xl rounded-tl-md">
                      <p className="text-[13px] text-slate-300">{msg.content}</p>
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="shrink-0 w-8 h-8 rounded-xl bg-blue-600/15 border border-blue-500/25 flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-400" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex gap-3">
                <div className="shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/25 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-indigo-400" />
                </div>
                <div className="px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-2xl rounded-tl-md">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                    <span className="text-[11px] text-slate-400">A analisar o processo...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* ── Input Area ──────────────────────────────────────────────────────── */}
      <div className="shrink-0 border-t border-slate-800 bg-slate-900/80 backdrop-blur-sm px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto">
          {/* Input Field */}
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={selectedCase
                  ? `Perguntar sobre o Proc. ${selectedCase.caseNumber}... (ex: "resumo do processo", "preparar reunião")`
                  : 'Seleccione um processo para começar...'
                }
                disabled={isTyping || !selectedCaseId}
                rows={1}
                className="w-full bg-slate-800/80 border border-slate-700 focus:border-indigo-500/50 rounded-xl px-4 py-3 pr-12 text-[13px] text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{ minHeight: '44px', maxHeight: '120px' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isTyping}
                className="absolute right-2 bottom-2 p-1.5 text-indigo-400 hover:text-white hover:bg-indigo-600/30 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Footer disclaimer */}
          <div className="flex items-center justify-between mt-2.5">
            <p className="text-[10px] text-slate-500 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              <span>Motor determinístico de demonstração — sem IA real — dados fictícios</span>
            </p>
            <p className="text-[10px] text-slate-500">
              Enter para enviar • Shift+Enter para nova linha
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
