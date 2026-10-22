import React, { useState } from 'react';
import {
  Scale,
  Shield,
  Briefcase,
  Clock,
  BadgeDollarSign,
  Bot,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Lock,
  FileCheck,
  Award,
  BarChart3
} from 'lucide-react';
import { CURRENT_ORGANIZATION } from '../../data/mockData';

interface LandingPageProps {
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const [activeFeatureTab, setActiveFeatureTab] = useState<'dossier' | 'intelligence' | 'finance' | 'deadlines' | 'ai'>('dossier');

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Institutional Bar */}
      <div className="bg-[#0B1120] border-b border-slate-800/80 px-4 sm:px-8 py-2 text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-amber-400 font-medium">
            <Award className="w-3.5 h-3.5" />
            Em conformidade com a Ordem dos Advogados de Angola (OAA)
          </span>
          <span className="hidden md:inline text-slate-600">•</span>
          <span className="hidden md:inline text-slate-400">Lei de Protecção de Dados Pessoais (Lei n.º 22/11)</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span className="text-[11px] font-mono">Luanda • República de Angola</span>
          <button
            onClick={onEnterApp}
            className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
          >
            <span>Acesso Restrito</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-[#070B14]/90 backdrop-blur-md border-b border-slate-800/70 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-slate-900 border border-blue-500/30 flex items-center justify-center shadow-md">
              <Scale className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white font-serif">SIGEA</span>
                <span className="text-[10px] tracking-widest font-mono uppercase px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800/60 text-blue-400">
                  ERP JURÍDICO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Sistema Integrado de Gestão Estratégica da Advocacia
              </p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8 text-xs font-medium text-slate-300">
            <a href="#solucoes" className="hover:text-white transition-colors">Soluções</a>
            <a href="#dossier" className="hover:text-white transition-colors">Dossier 360°</a>
            <a href="#inteligencia" className="hover:text-white transition-colors">Inteligência & Rentabilidade</a>
            <a href="#seguranca" className="hover:text-white transition-colors">Segurança & OAA</a>
            <a href="#metricas" className="hover:text-white transition-colors">Impacto</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onEnterApp}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm hover:shadow-blue-600/20 transition-all flex items-center gap-2 border border-blue-500/40"
            >
              <span>Aceder à Demonstração</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-4 sm:px-8 overflow-hidden border-b border-slate-800/60">
        {/* Subtle executive background accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-blue-900/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -top-32 right-10 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs text-slate-300 mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="font-medium text-slate-200">Plataforma Desenvolvida para a Realidade Jurídica de Angola</span>
            <span className="text-slate-500">|</span>
            <span className="text-amber-400 font-mono text-[11px]">Luanda • Benguela • Huíla</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-serif">
            A precisão jurídica e a força de gestão que os escritórios de topo exigem.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            O SIGEA unifica o <strong className="text-slate-200 font-semibold">Dossier Eletrónico 360°</strong>, controlo infalível de prazos processuais perentórios, faturação em Kwanzas (AOA) com retenção na fonte e inteligência executiva para sociedades e advogados em Angola.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onEnterApp}
              className="px-6 py-3.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30 transition-all flex items-center gap-2.5 border border-blue-400/40 hover:-translate-y-0.5"
            >
              <Briefcase className="w-4 h-4" />
              <span>Entrar no Sistema (Visão Sócio Dr. Rui Falcão)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#solucoes"
              className="px-6 py-3.5 rounded-xl text-sm font-medium bg-slate-900/80 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-700/80 transition-all flex items-center gap-2"
            >
              <span>Explorar Arquitetura & Módulos</span>
            </a>
          </div>

          {/* Trust Badges */}
          <div className="mt-14 pt-10 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
              <div className="text-2xl font-bold font-mono text-white">1.480+</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Processos monitorizados em tempo real</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
              <div className="text-2xl font-bold font-mono text-amber-400">99.8%</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Cumprimento estrito de prazos perentórios</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
              <div className="text-2xl font-bold font-mono text-emerald-400">420M+ <span className="text-xs font-normal">AOA</span></div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Honorários & pagamentos auditados</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
              <div className="text-2xl font-bold font-mono text-blue-400">18</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Comarcas e Tribunais Superiores mapeados</div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive System Preview Strip */}
      <section className="py-16 px-4 sm:px-8 bg-[#090E1A] border-b border-slate-800/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[11px] font-mono uppercase tracking-widest text-blue-400 bg-blue-950/60 border border-blue-800/40 px-3 py-1 rounded-full">
              Visão Executiva do Escritório
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-3 font-serif">
              Como o escritório gerencia processos complexos no SIGEA
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl mx-auto">
              Simulação de ambiente real configurado para a sociedade <em>{CURRENT_ORGANIZATION.name}</em> em Luanda.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-700/80 bg-slate-950/80 overflow-hidden shadow-2xl">
            {/* Top Mock Window Bar */}
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-3 font-mono text-slate-300">sigea.ao/erp/executivo</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sessão Autenticada • Dr. Rui Falcão (Sócio OAA 1420)</span>
              </div>
            </div>

            {/* Quick Preview Content */}
            <div className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Taxa Global de Êxito</span>
                    <span className="text-emerald-400 font-semibold">+4.2%</span>
                  </div>
                  <div className="text-2xl font-bold text-white mt-2 font-mono">78.4%</div>
                  <div className="text-[11px] text-slate-500 mt-1">Acima da média dos escritórios corporativos</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Prazos Perentórios Críticos</span>
                    <span className="text-amber-400 font-semibold">1 Iminente</span>
                  </div>
                  <div className="text-2xl font-bold text-amber-400 mt-2 font-mono">3 Dias</div>
                  <div className="text-[11px] text-slate-500 mt-1">Alegações Finais • Proc. 0042/24.1TELU</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Honorários em Cobrança (AOA)</span>
                    <span className="text-blue-400 font-semibold">82% Regularizado</span>
                  </div>
                  <div className="text-2xl font-bold text-white mt-2 font-mono">68.500.000 <span className="text-xs text-slate-400">AOA</span></div>
                  <div className="text-[11px] text-slate-500 mt-1">Faturas emitidas com retenção na fonte AGT</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                    <Scale className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Pronto para testar a plataforma completa?</h4>
                    <p className="text-xs text-slate-400">Explore processos reais simulados, cálculos de rentabilidade e assistente com IA determinística.</p>
                  </div>
                </div>
                <button
                  onClick={onEnterApp}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-sm shrink-0"
                >
                  Abrir Painel Executivo do SIGEA
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions / Features Section */}
      <section id="solucoes" className="py-20 px-4 sm:px-8 border-b border-slate-800/60">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
              Módulos Especializados
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 font-serif">
              Construído para o rigor da advocacia em Angola
            </h2>
            <p className="text-sm text-slate-400 mt-3">
              Cada funcionalidade reflete as especificidades processuais dos tribunais angolanos, da relação com a Ordem dos Advogados e das normas fiscais em Kwanzas.
            </p>
          </div>

          {/* Module Selector Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            <button
              onClick={() => setActiveFeatureTab('dossier')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                activeFeatureTab === 'dossier'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Dossier Judicial 360°</span>
            </button>
            <button
              onClick={() => setActiveFeatureTab('intelligence')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                activeFeatureTab === 'intelligence'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Inteligência & Desempenho</span>
            </button>
            <button
              onClick={() => setActiveFeatureTab('finance')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                activeFeatureTab === 'finance'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <BadgeDollarSign className="w-3.5 h-3.5" />
              <span>Rentabilidade em AOA</span>
            </button>
            <button
              onClick={() => setActiveFeatureTab('deadlines')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                activeFeatureTab === 'deadlines'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Prazos & Agenda Judicial</span>
            </button>
            <button
              onClick={() => setActiveFeatureTab('ai')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
                activeFeatureTab === 'ai'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Assistente Legal AI</span>
            </button>
          </div>

          {/* Active Tab Showcase */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 sm:p-10">
            {activeFeatureTab === 'dossier' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 rounded bg-blue-950/80 border border-blue-800/60 text-blue-400 text-xs font-mono">
                    MÓDULO CENTRAL
                  </div>
                  <h3 className="text-2xl font-bold text-white font-serif">Dossier Judicial Eletrónico 360°</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Histórico completo e imutável de todas as peças processuais, despachos, notificações do cartório judicial, audiências marcadas e custas judiciais.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Classificação por Comarca (Luanda, Belas, Cacuaco, Benguela e Huíla)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Linha temporal de incidentes, recursos e trânsito em julgado</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Segregação estrita por advogado responsável e estagiário atribuído</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <button
                      onClick={onEnterApp}
                      className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5"
                    >
                      <span>Abrir lista de processos no sistema</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs space-y-3 font-mono">
                  <div className="text-slate-400 border-b border-slate-800 pb-2 flex justify-between">
                    <span>Proc. N.º 0042/24.1TELU</span>
                    <span className="text-blue-400">Em Instrução Contraditória</span>
                  </div>
                  <div className="space-y-1.5 text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tribunal:</span>
                      <span>Tribunal de Comarca de Luanda (1.ª Secção Crime)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Juiz / Magistrado:</span>
                      <span>Dr. Mateus Cristóvão</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Valor da Causa:</span>
                      <span className="text-emerald-400">145.000.000 AOA</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Advogada Titular:</span>
                      <span>Dra. Kieza Manuel (OAA 2891)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeFeatureTab === 'intelligence' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 rounded bg-blue-950/80 border border-blue-800/60 text-blue-400 text-xs font-mono">
                    GESTÃO ESTRATÉGICA
                  </div>
                  <h3 className="text-2xl font-bold text-white font-serif">Centro Executivo de Inteligência Jurídica</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Transforma dados brutos do escritório em decisões de sócios: taxa de sucesso por matéria judicial, produtividade da equipa e previsão de desfecho.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Diagnóstico de gargalos nos cartórios e secretarias judiciais</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Relatórios para assembleias de sócios e auditorias de gestão</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <button
                      onClick={onEnterApp}
                      className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5"
                    >
                      <span>Ver Centro de Inteligência</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs space-y-3 font-mono">
                  <div className="text-slate-400 border-b border-slate-800 pb-2">Desempenho por Matéria (2025/2026)</div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Direito Bancário & Cambial</span>
                        <span className="text-emerald-400">88% Êxito</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-[88%]" />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Contencioso Comercial</span>
                        <span className="text-blue-400">76% Êxito</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full w-[76%]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeFeatureTab === 'finance' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 rounded bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 text-xs font-mono">
                    GESTÃO FINANCEIRA
                  </div>
                  <h3 className="text-2xl font-bold text-white font-serif">Rentabilidade & Faturação em Kwanzas (AOA)</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Controlo preciso de honorários por processo, retenções na fonte de 6.5% para a AGT, custas de preparos judiciais e emissão de recibos conformes.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Honorários de sucesso e retenções contratuais transparentes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Alerta de saldos devedores de clientes corporativos</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <button
                      onClick={onEnterApp}
                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5"
                    >
                      <span>Aceder ao Módulo Financeiro</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs space-y-3 font-mono">
                  <div className="text-slate-400 border-b border-slate-800 pb-2">Balanço de Honorários Acumulado</div>
                  <div className="flex justify-between text-slate-300">
                    <span>Total Faturado:</span>
                    <span className="text-white">124.800.000 AOA</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Total Liquidado:</span>
                    <span className="text-emerald-400">102.300.000 AOA</span>
                  </div>
                  <div className="flex justify-between text-slate-300 border-t border-slate-800/60 pt-2">
                    <span>Retenção na Fonte (AGT):</span>
                    <span className="text-amber-400">6.649.500 AOA</span>
                  </div>
                </div>
              </div>
            )}

            {activeFeatureTab === 'deadlines' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 rounded bg-amber-950/80 border border-amber-800/60 text-amber-400 text-xs font-mono">
                    RIGOR PROCESSUAL
                  </div>
                  <h3 className="text-2xl font-bold text-white font-serif">Motor de Prazos Perentórios & Agenda</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Zero prazos perdidos. Cálculo automático segundo os artigos do Código de Processo Civil de Angola, considerando férias judiciais e feriados nacionais.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Alertas com antecedência de 15, 7, 3 e 1 dia para o patrono e estagiário</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Registo de protocolo de entrega física no cartório do tribunal</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <button
                      onClick={onEnterApp}
                      className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5"
                    >
                      <span>Ver Agenda de Prazos</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs space-y-2.5 font-mono">
                  <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">
                    <div className="font-bold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Prazo Crítico: 3 Dias Restantes</span>
                    </div>
                    <div className="text-[11px] text-amber-200/80 mt-1">Alegações Finais de Recurso de Apelação</div>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                    <div className="font-semibold text-slate-200">Prazo Ordinário: 12 Dias</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Contestação de Embargos de Executado</div>
                  </div>
                </div>
              </div>
            )}

            {activeFeatureTab === 'ai' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="inline-block px-3 py-1 rounded bg-blue-950/80 border border-blue-800/60 text-blue-400 text-xs font-mono">
                    TECNOLOGIA RESPONSÁVEL
                  </div>
                  <h3 className="text-2xl font-bold text-white font-serif">SIGEA Legal AI — Revisão Humana Obrigatória</h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Assistente concebido para agilizar sumários de dossiers complexos, organizar cronologias e propor minutas estruturadas sob estrita supervisão do advogado titular.
                  </p>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Sem partilha de segredos de justiça com servidores públicos externos</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Marca de água e aviso explícito de necessidade de validação técnica</span>
                    </li>
                  </ul>
                  <div className="pt-2">
                    <button
                      onClick={onEnterApp}
                      className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1.5"
                    >
                      <span>Testar assistente no sistema</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="p-5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs space-y-2.5 font-mono">
                  <div className="text-blue-400 font-semibold flex items-center gap-1.5">
                    <Bot className="w-3.5 h-3.5" />
                    <span>Síntese Processual Automatizada</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    "Identificados 4 incidentes de adiamento no Tribunal de Comarca de Belas. Sugere-se requerer certidão de dilação fundamentada no art. 145.º do CPC."
                  </p>
                  <div className="text-[10px] text-amber-400/90 pt-1 border-t border-slate-800">
                    ⚠️ Parecer indicativo para revisão privativa de advogado inscrito na OAA.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Security & Regulatory Section */}
      <section id="seguranca" className="py-20 px-4 sm:px-8 bg-[#090E1A] border-b border-slate-800/60">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-4">
                <Lock className="w-5 h-5 text-blue-400" />
              </div>
              <h4 className="text-base font-bold text-white font-serif">Sigilo Profissional Absoluto</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Estrutura de dados multi-tenant estritamente isolada. Nenhuma sociedade de advogados partilha ou tem visibilidade sobre dossiers de outro escritório.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <h4 className="text-base font-bold text-white font-serif">Conformidade com a OAA</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Desenvolvido respeitando os deveres deontológicos do Estatuto da Ordem dos Advogados de Angola e do Regulamento de Estágio de Advocacia.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="w-10 h-10 rounded-lg bg-amber-600/20 border border-amber-500/30 flex items-center justify-center mb-4">
                <FileCheck className="w-5 h-5 text-amber-400" />
              </div>
              <h4 className="text-base font-bold text-white font-serif">Auditoria & Rastreabilidade</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Registo perpétuo de todas as operações: quem visualizou, descarregou peças ou alterou minutas judiciais para garantia probatória interna.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action section */}
      <section className="py-20 px-4 sm:px-8 border-b border-slate-800/60 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif">
            Experimente o SIGEA no seu escritório hoje.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-4 max-w-2xl mx-auto leading-relaxed">
            Aceda à demonstração interativa completa com dados reais simulados de processos em tribunais de Luanda e comprove a eficácia do sistema.
          </p>
          <div className="mt-8 flex justify-center">
            <button
              onClick={onEnterApp}
              className="px-8 py-4 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-900/30 transition-all flex items-center gap-3 border border-blue-400/40 hover:scale-[1.02]"
            >
              <Scale className="w-5 h-5" />
              <span>Aceder Imediatamente à Plataforma SIGEA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#05080F] py-12 px-4 sm:px-8 text-xs text-slate-500 border-t border-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-900/40 border border-blue-700/40 flex items-center justify-center">
              <Scale className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <span className="font-bold text-slate-300 font-serif">SIGEA</span>
              <span className="text-slate-600 ml-2">© 2026 Todos os direitos reservados. República de Angola.</span>
            </div>
          </div>
          <div className="flex items-center gap-6 text-slate-400">
            <span>Luanda: Av. 4 de Fevereiro • Talatona</span>
            <span>Suporte: contacto@sigea.ao</span>
            <button
              onClick={onEnterApp}
              className="text-blue-400 hover:text-white font-semibold underline underline-offset-4"
            >
              Entrar no Sistema
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
