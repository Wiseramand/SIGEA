import React, { useState } from 'react';
import { MOCK_INTERNS } from '../../data/mockData';
import { GraduationCap, UserCheck, Plus, X } from 'lucide-react';
import { useCases } from '../../context/CasesContext';
import { InternProfile } from '@sigea/shared';

export const InternsManagement: React.FC = () => {
  const { showToast } = useCases();
  const [interns, setInterns] = useState<InternProfile[]>(MOCK_INTERNS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [oaaTraineeNumber, setOaaTraineeNumber] = useState('');
  const [supervisorName, setSupervisorName] = useState('Dr. Rui Falcão de Carvalho');
  const [evaluationScore, setEvaluationScore] = useState(16);

  const handleCreateIntern = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newIntern: InternProfile = {
      id: `intern-${Date.now()}`,
      organizationId: 'org-01',
      userId: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      oaaTraineeNumber: oaaTraineeNumber.trim() || `EST-OAA-${Math.floor(1000 + Math.random() * 9000)}`,
      supervisorLawyerId: 'user-001',
      supervisorName,
      stageProgressPercent: 10,
      assignedCasesCount: 1,
      completedTasksCount: 0,
      evaluationScore: Number(evaluationScore) || 15,
      startDate: new Date().toISOString().split('T')[0],
      expectedEndDate: '2028-10-22',
      status: 'ACTIVE'
    };

    setInterns([newIntern, ...interns]);
    setIsModalOpen(false);
    setName('');
    setEmail('');
    setOaaTraineeNumber('');
    showToast(`Advogado Estagiário ${newIntern.name} admitido com sucesso`, 'success');
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-emerald-400" />
            <span>Gestão de Advogados Estagiários (OAA)</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Supervisão de patronato, acompanhamento de peças e cumprimento das exigências da Ordem dos Advogados de Angola.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Admitir Estagiário</span>
        </button>
      </div>

      {/* Interns Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {interns.map((intern) => (
          <div
            key={intern.id}
            className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  {intern.oaaTraineeNumber}
                </span>
                <h3 className="text-base font-bold text-white mt-1.5">{intern.name}</h3>
                <p className="text-xs text-slate-400">{intern.email}</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-semibold text-slate-400">Nota de Avaliação</span>
                <div className="text-lg font-bold text-emerald-400">{intern.evaluationScore} / 20</div>
              </div>
            </div>

            {/* Supervisor Info */}
            <div className="p-3.5 rounded-xl bg-slate-850 border border-slate-750 flex items-center gap-3">
              <UserCheck className="w-4 h-4 text-blue-400 shrink-0" />
              <div className="text-xs">
                <span className="text-slate-400">Patrono / Advogado Supervisor:</span>
                <p className="font-semibold text-white">{intern.supervisorName}</p>
              </div>
            </div>

            {/* Stage Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Cumprimento do Estágio Forense</span>
                <span className="font-bold text-white">{intern.stageProgressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                  style={{ width: `${intern.stageProgressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Início: {intern.startDate}</span>
                <span>Previsão de Término: {intern.expectedEndDate}</span>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-700/50 text-xs">
              <div className="p-3 rounded-lg bg-slate-850">
                <span className="text-slate-400">Processos em Apoio</span>
                <div className="text-sm font-bold text-white mt-0.5">{intern.assignedCasesCount} processos</div>
              </div>
              <div className="p-3 rounded-lg bg-slate-850">
                <span className="text-slate-400">Minutas & Tarefas Validadas</span>
                <div className="text-sm font-bold text-white mt-0.5">{intern.completedTasksCount} peças aprovadas</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Admitir Estagiário */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">Admitir Novo Advogado Estagiário (OAA)</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateIntern} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nome Completo do Candidato *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Dr. António Manuel da Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Correio Eletrónico Institucional *</label>
                <input
                  type="email"
                  required
                  placeholder="ex: a.silva@falcaoadvogados.ao"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Cédula de Estágio OAA</label>
                  <input
                    type="text"
                    placeholder="ex: EST-OAA-8910"
                    value={oaaTraineeNumber}
                    onChange={(e) => setOaaTraineeNumber(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nota Inicial (0 - 20)</label>
                  <input
                    type="number"
                    min="10"
                    max="20"
                    value={evaluationScore}
                    onChange={(e) => setEvaluationScore(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Patrono / Advogado Supervisor</label>
                <select
                  value={supervisorName}
                  onChange={(e) => setSupervisorName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Dr. Rui Falcão de Carvalho">Dr. Rui Falcão de Carvalho (Sócio Titular • OAA 1420)</option>
                  <option value="Dra. Kieza dos Santos Manuel">Dra. Kieza dos Santos Manuel (Advogada Associada • OAA 2891)</option>
                  <option value="Dr. Manuel Van-Dúnem">Dr. Manuel Van-Dúnem (Advogado Sénior • OAA 1850)</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold shadow-lg shadow-emerald-600/20"
                >
                  Registar Estagiário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

