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
  BarChart3,
  Quote
} from 'lucide-react';
import { CURRENT_ORGANIZATION } from '../../data/mockData';

interface LandingPageProps {
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const [activeFeatureTab, setActiveFeatureTab] = useState<'dossier' | 'intelligence' | 'finance' | 'deadlines' | 'ai'>('dossier');

  return (
    <div className="min-h-screen bg-[#060911] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white antialiased">
      {/* Top Institutional Bar */}
      <div className="bg-[#0A0F1D] border-b border-slate-800/80 px-4 sm:px-8 py-2 text-xs text-slate-400 flex items-center justify-between z-20 relative">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-amber-400 font-medium">
            <Award className="w-3.5 h-3.5" />
            Conforme com o Estatuto da Ordem dos Advogados de Angola (OAA)
          </span>
          <span className="hidden md:inline text-slate-600">•</span>
          <span className="hidden md:inline text-slate-400">Lei de Protecção de Dados Pessoais de Angola (Lei n.º 22/11)</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span className="text-[11px] font-mono">Luanda • República de Angola</span>
          <button
            onClick={onEnterApp}
            className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition-colors"
          >
            <span>Acesso Restrito ao Escritório</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-[#060911]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-slate-900 border border-blue-500/40 flex items-center justify-center shadow-lg">
              <Scale className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white font-serif">SIGEA</span>
                <span className="text-[9px] tracking-widest font-mono uppercase px-2 py-0.5 rounded bg-blue-950/80 border border-blue-800/60 text-blue-400 font-semibold">
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
            <a href="#governanca" className="hover:text-white transition-colors">Governança & Sócios</a>
            <a href="#dossier" className="hover:text-white transition-colors">Dossier 360°</a>
            <a href="#inteligencia" className="hover:text-white transition-colors">Inteligência & Finanças</a>
            <a href="#seguranca" className="hover:text-white transition-colors">Segurança & OAA</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onEnterApp}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-900/30 transition-all flex items-center gap-2 border border-blue-400/40"
            >
              <span>Aceder à Demonstração</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section with Cinematic Law Firm Photo Background */}
      <section className="relative min-h-[640px] lg:min-h-[720px] flex items-center justify-center px-4 sm:px-8 py-20 overflow-hidden border-b border-slate-800/80">
        {/* Background Image: Executive Partner Office in Luanda overlooking the Bay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-1000"
          style={{ backgroundImage: "url('/images/law_firm_hero_bg.jpg')" }}
        />
        
        {/* Deep, Prestigious Lawyer Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#060911] via-[#060911]/90 to-[#060911]/75 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060911] via-transparent to-transparent" />

        {/* Hero Content */}
        <div className="max-w-5xl mx-auto text-center relative z-10 pt-4 pb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs text-slate-300 mb-8 shadow-xl backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="font-medium text-slate-200">Plataforma Desenvolvida para a Realidade Jurídica de Angola</span>
            <span className="text-slate-500">|</span>
            <span className="text-amber-400 font-mono text-[11px]">Luanda • Benguela • Huíla</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-serif drop-shadow-sm">
            A precisão jurídica e a força de gestão que os escritórios líderes exigem.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed drop-shadow-sm font-normal">
            O SIGEA unifica o <strong className="text-white font-semibold">Dossier Eletrónico 360°</strong>, controlo infalível de prazos processuais perentórios segundo o CPC angolano, faturação de honorários em Kwanzas (AOA) com retenção na fonte da AGT e inteligência executiva para sociedades de advogados.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onEnterApp}
              className="px-6 py-3.5 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-900/40 transition-all flex items-center gap-2.5 border border-blue-400/40 hover:-translate-y-0.5"
            >
              <Briefcase className="w-4 h-4" />
              <span>Entrar no Sistema (Visão Dr. Rui Falcão • Sócio OAA)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#solucoes"
              className="px-6 py-3.5 rounded-xl text-sm font-medium bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 transition-all flex items-center gap-2 backdrop-blur-md"
            >
              <span>Explorar Arquitetura & Módulos</span>
            </a>
          </div>

          {/* Key Metrics Bar */}
          <div className="mt-16 pt-8 border-t border-slate-800/90 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-left">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-md">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-white">1.480+</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Processos judiciais acompanhados</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-md">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400">99.8%</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Cumprimento estrito de prazos perentórios</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-md">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">420M+ <span className="text-xs font-normal">AOA</span></div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Honorários & recebimentos auditados</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-md">
              <div className="text-2xl sm:text-3xl font-bold font-mono text-blue-400">18</div>
              <div className="text-xs text-slate-400 mt-1 font-medium">Comarcas e Tribunais Superiores mapeados</div>
            </div>
          </div>
        </div>
      </section>

      {/* Real Law Firm Governance & Board Section (With Board Meeting Photo) */}
      <section id="governanca" className="py-20 px-4 sm:px-8 bg-[#090E19] border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Visual Column: Executive Board Meeting */}
            <div className="lg:col-span-6 relative">
              <div className="rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl relative group">
                <img
                  src="/images/law_firm_meeting.jpg"
                  alt="Reunião de Sócios da Sociedade de Advogados em Luanda"
                  className="w-full h-auto object-cover transform group-hover:scale-102 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1D] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-700/70 text-xs">
                  <div className="flex items-center justify-between text-slate-300 font-mono">
                    <span className="font-semibold text-white">Conselho de Sócios • Falcão & Associados</span>
                    <span className="text-amber-400 text-[10px]">Luanda Bay Towers</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Análise executiva trimestral de rentabilidade por processo, distribuição de estagiários OAA e previsão de desfechos judiciais.
                  </p>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-blue-400 bg-blue-950/80 border border-blue-800/50 px-3 py-1 rounded-full">
                  Governança & Tomada de Decisão
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-3 font-serif leading-tight">
                  Desenvolvido para os sócios que conduzem o contencioso e o direito corporativo.
                </h2>
                <p className="text-sm text-slate-300 mt-3 leading-relaxed">
                  Gerir uma sociedade de advogados em Angola exige mais do que uma folha de cálculo. O SIGEA fornece aos sócios uma visão clara da rentabilidade por cliente, dos riscos de prescrição e da produtividade de cada mandatário judicial.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="p-2 rounded-lg bg-blue-950 border border-blue-800/60 text-blue-400 shrink-0 mt-0.5">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Centralização Total do Dossier 360°</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Todas as peças, articulados, incidentes, notificações dos cartórios judiciais e recursos organizados numa linha temporal cronológica.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="p-2 rounded-lg bg-emerald-950 border border-emerald-800/60 text-emerald-400 shrink-0 mt-0.5">
                    <BadgeDollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Rentabilidade Real em Kwanzas (AOA)</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Cruzamento entre horas trabalhadas, honorários acordados, retenção na fonte da AGT e despesas judiciais para identificar clientes verdadeiramente lucrativos.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="p-2 rounded-lg bg-amber-950 border border-amber-800/60 text-amber-400 shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Supervisão de Estagiários e Patrono</h4>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Distribuição de tarefas processuais em estrita conformidade com o Regulamento de Estágio da OAA, com validação obrigatória das minutas pelo patrono titular.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <button
                  onClick={onEnterApp}
                  className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md flex items-center gap-2"
                >
                  <span>Ver Painel dos Sócios no Sistema</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive System Mockup Strip */}
      <section className="py-16 px-4 sm:px-8 bg-[#060911] border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full">
              Ambiente de Trabalho Real
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-3 font-serif">
              Interface Executiva do SIGEA
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl mx-auto">
              Ambiente configurado para a sociedade <em>{CURRENT_ORGANIZATION.name}</em> em Luanda.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-700/80 bg-slate-950 overflow-hidden shadow-2xl">
            {/* Top Mock Window Bar */}
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-3 font-mono text-slate-300 text-[11px]">sigea.ao/painel-executivo</span>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Dr. Rui Falcão (Sócio OAA 1420) • Sessão Segura</span>
              </div>
            </div>

            {/* Quick Preview Content */}
            <div className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Taxa Global de Êxito</span>
                    <span className="text-emerald-400 font-semibold font-mono">+4.2%</span>
                  </div>
                  <div className="text-2xl font-bold text-white mt-2 font-mono">78.4%</div>
                  <div className="text-[11px] text-slate-500 mt-1">Tribunais de Comarca e Tribunais de Relação</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Prazos Perentórios Críticos</span>
                    <span className="text-amber-400 font-semibold font-mono">1 Iminente</span>
                  </div>
                  <div className="text-2xl font-bold text-amber-400 mt-2 font-mono">2 Dias</div>
                  <div className="text-[11px] text-slate-500 mt-1">Rol de Testemunhas • Proc. 0284/24-C</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Faturação Liquidada (AOA)</span>
                    <span className="text-emerald-400 font-semibold font-mono">72% Recebido</span>
                  </div>
                  <div className="text-2xl font-bold text-white mt-2 font-mono">18.600.000 <span className="text-xs text-slate-400">Kz</span></div>
                  <div className="text-[11px] text-slate-500 mt-1">Honorários auditados com retenção de 6.5% AGT</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-950 border border-blue-800/60 flex items-center justify-center">
                    <Scale className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white">Aceda à demonstração interativa completa</h4>
                    <p className="text-xs text-slate-400">Navegue por dossiers judiciais, recibos de clientes e assistente legal simulado.</p>
                  </div>
                </div>
                <button
                  onClick={onEnterApp}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-sm shrink-0"
                >
                  Abrir Sistema Agora
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions / Features Section */}
      <section id="solucoes" className="py-20 px-4 sm:px-8 border-b border-slate-800/80 bg-[#090E19]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 bg-blue-950/80 border border-blue-800/50 px-3 py-1 rounded-full">
              Módulos Especializados
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3 font-serif">
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
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-xl">
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
                      <span>Prazo Crítico: 2 Dias Restantes</span>
                    </div>
                    <div className="text-[11px] text-amber-200/80 mt-1">Apresentação de Rol de Testemunhas e Requerimento Pericial</div>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                    <div className="font-semibold text-slate-200">Prazo Ordinário: 6 Dias</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Alegações Finais Escritas em Processo de Trabalho</div>
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

      {/* Tradition & Scales of Justice Section (With Scales Photo) */}
      <section className="relative py-24 px-4 sm:px-8 overflow-hidden border-b border-slate-800/80">
        {/* Background Image: Classical Brass Scales of Justice and Law Library */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/justice_scales_books.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#060911]/95 via-[#060911]/85 to-[#060911]/90 backdrop-blur-[2px]" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 bg-amber-950/80 border border-amber-800/50 px-3 py-1 rounded-full">
                Tradição Forense & Sigilo Inviolável
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white font-serif leading-tight">
                A dignidade da advocacia angolana protegida pela tecnologia certa.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                O sigilo profissional do advogado é inviolável nos termos da Constituição e do Estatuto da OAA. O SIGEA foi concebido desde a raiz com segregação criptográfica entre escritórios, histórico imutável de acessos e respeito escrupuloso ao segredo de justiça.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 backdrop-blur-md">
                  <div className="flex items-center gap-2 text-white font-semibold text-xs">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <span>Lei 22/11 (LPDP Angola)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Tratamento de dados pessoais em conformidade estrita com a Agência de Proteção de Dados.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 backdrop-blur-md">
                  <div className="flex items-center gap-2 text-white font-semibold text-xs">
                    <FileCheck className="w-4 h-4 text-blue-400" />
                    <span>Validade Probatória</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Assinatura digital e rasto de auditoria de cada documento e peça processual submetida.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-950/90 border border-slate-700/80 backdrop-blur-md shadow-2xl">
              <Quote className="w-8 h-8 text-amber-400/40 mb-3" />
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "O SIGEA transformou a forma como o nosso escritório gere o contencioso bancário e comercial em Luanda. Deixámos de correr riscos com prazos e os nossos clientes corporativos têm total clareza dos honorários."
              </p>
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-900/60 border border-blue-700/60 flex items-center justify-center text-xs font-bold text-blue-300">
                  RF
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Dr. Rui Falcão de Carvalho</div>
                  <div className="text-[10px] text-amber-400/90 font-mono">Sócio Fundador • OAA 1420</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Regulatory Cards */}
      <section id="seguranca" className="py-20 px-4 sm:px-8 bg-[#090E19] border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-blue-950 border border-blue-800/60 flex items-center justify-center mb-4">
                <Lock className="w-5 h-5 text-blue-400" />
              </div>
              <h4 className="text-base font-bold text-white font-serif">Sigilo Profissional Absoluto</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Estrutura de dados multi-tenant estritamente isolada. Nenhuma sociedade de advogados partilha ou tem visibilidade sobre dossiers de outro escritório.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-emerald-950 border border-emerald-800/60 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <h4 className="text-base font-bold text-white font-serif">Conformidade com a OAA</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Desenvolvido respeitando os deveres deontológicos do Estatuto da Ordem dos Advogados de Angola e do Regulamento de Estágio de Advocacia.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-amber-950 border border-amber-800/60 flex items-center justify-center mb-4">
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

      {/* Call to Action Final Section */}
      <section className="py-20 px-4 sm:px-8 border-b border-slate-800/80 bg-[#060911] text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-blue-950 border border-blue-800/60 flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Scale className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-serif">
            Experimente o SIGEA no seu escritório hoje.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-4 leading-relaxed">
            Aceda à demonstração interativa completa com dados reais simulados de processos em tribunais de Luanda e comprove a eficácia do sistema.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onEnterApp}
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-900/40 transition-all flex items-center justify-center gap-3 border border-blue-400/40 hover:scale-[1.02]"
            >
              <Scale className="w-5 h-5" />
              <span>Aceder Imediatamente à Plataforma SIGEA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Institutional Footer */}
      <footer className="bg-[#04060C] py-12 px-4 sm:px-8 text-xs text-slate-500 border-t border-slate-900">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-blue-950 border border-blue-800/60 flex items-center justify-center">
              <Scale className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <span className="font-bold text-slate-300 font-serif">SIGEA Angola</span>
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
