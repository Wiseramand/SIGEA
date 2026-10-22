import React, { useState } from 'react';
import { Jurisdiction, CaseStatus, LegalParty } from '@sigea/shared';
import { ANGOLA_COURTS } from '@sigea/shared';
import { MOCK_CLIENTS, MOCK_USERS } from '../../data/mockData';
import { useCases } from '../../context/CasesContext';
import { X, Briefcase, Scale, Shield, AlertCircle } from 'lucide-react';

interface NewCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCaseCreated?: (caseId: string) => void;
}

export const NewCaseModal: React.FC<NewCaseModalProps> = ({
  isOpen,
  onClose,
  onCaseCreated
}) => {
  const { addCase } = useCases();

  const currentYear = new Date().getFullYear().toString().slice(-2);
  const randomNum = Math.floor(100 + Math.random() * 900);

  const [caseNumber, setCaseNumber] = useState(`0${randomNum}/${currentYear}-C`);
  const [subject, setSubject] = useState('');
  const [clientId, setClientId] = useState(MOCK_CLIENTS[0]?.id || '');
  const [courtName, setCourtName] = useState(ANGOLA_COURTS[6] || 'Tribunal da Comarca de Luanda (Cível e Comercial)');
  const [section, setSection] = useState('1ª Secção do Cível');
  const [jurisdiction, setJurisdiction] = useState<Jurisdiction>(Jurisdiction.COMMERCIAL);
  const [responsibleLawyerId, setResponsibleLawyerId] = useState(MOCK_USERS[0]?.id || 'user-01');
  const [priority, setPriority] = useState<'NORMAL' | 'HIGH' | 'CRITICAL'>('NORMAL');
  const [claimValueAoa, setClaimValueAoa] = useState<number>(25000000);
  const [provisionedValueAoa, setProvisionedValueAoa] = useState<number>(25000000);
  const [defendantName, setDefendantName] = useState('');
  const [defendantLawyer, setDefendantLawyer] = useState('');
  const [isConfidential, setIsConfidential] = useState(false);
  const [description, setDescription] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      setErrorMsg('Por favor informe o objeto / pedido da causa.');
      return;
    }

    const selectedClient = MOCK_CLIENTS.find((c) => c.id === clientId) || MOCK_CLIENTS[0];
    const selectedLawyer = MOCK_USERS.find((u) => u.id === responsibleLawyerId) || MOCK_USERS[0];

    const parties: LegalParty[] = [
      {
        id: 'p-req-' + Date.now(),
        name: selectedClient.name,
        role: 'CLAIMANT',
        lawyerName: selectedLawyer.name,
        oaaNumber: selectedLawyer.oaaNumber
      }
    ];

    if (defendantName.trim()) {
      parties.push({
        id: 'p-reu-' + Date.now(),
        name: defendantName.trim(),
        role: 'DEFENDANT' as const,
        lawyerName: defendantLawyer.trim() || undefined,
        oaaNumber: undefined
      });
    }

    const newCase = addCase({
      caseNumber: caseNumber.trim(),
      subject: subject.trim(),
      courtName,
      section,
      jurisdiction,
      status: CaseStatus.DISTRIBUTED,
      clientId: selectedClient.id,
      clientName: selectedClient.name,
      responsibleLawyerId: selectedLawyer.id,
      responsibleLawyerName: selectedLawyer.name,
      parties,
      claimValueAoa: Number(claimValueAoa),
      provisionedValueAoa: Number(provisionedValueAoa),
      priority,
      isConfidential,
      description: description.trim() || 'Ação autuada e distribuída perante a jurisdição competente em Angola.'
    });

    if (onCaseCreated) {
      onCaseCreated(newCase.id);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Autuação de Novo Processo Judicial
              </h2>
              <p className="text-xs text-slate-400">
                Registo de ação e abertura do Dossier 360° com enquadramento nos Tribunais de Angola.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Case Number */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Número do Processo (Registo do Tribunal)</label>
              <input
                type="text"
                value={caseNumber}
                onChange={(e) => setCaseNumber(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Jurisdiction */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Jurisdição / Natureza da Ação</label>
              <select
                value={jurisdiction}
                onChange={(e) => setJurisdiction(e.target.value as Jurisdiction)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value={Jurisdiction.COMMERCIAL}>Comercial</option>
                <option value={Jurisdiction.CIVIL}>Cível e Obrigações</option>
                <option value={Jurisdiction.LABOR}>Trabalho e Emprego</option>
                <option value={Jurisdiction.FAMILY_SUCCESSION}>Família e Menores / Sucessões</option>
                <option value={Jurisdiction.ADMINISTRATIVE_TAX}>Contencioso Administrativo e Fiscal</option>
                <option value={Jurisdiction.CRIMINAL}>Penal</option>
              </select>
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Objeto da Causa / Pedido Principal *</label>
            <input
              type="text"
              placeholder="Ex: Ação Declarativa de Cumprimento de Contrato c/c Indemnização"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Court and Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-blue-400" />
                <span>Tribunal de Competência</span>
              </label>
              <select
                value={courtName}
                onChange={(e) => setCourtName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
              >
                {ANGOLA_COURTS.map((court) => (
                  <option key={court} value={court}>
                    {court}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Secção / Cartório Judicial</label>
              <input
                type="text"
                placeholder="Ex: 2ª Secção da Sala do Cível"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Client & Responsible Lawyer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Cliente Mandante (Autor / Requerente)</label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
              >
                {MOCK_CLIENTS.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} ({client.type === 'COMPANY' ? 'Pessoa Coletiva' : 'Singular'} - NIF: {client.nif})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Advogado Responsável (Patrono)</label>
              <select
                value={responsibleLawyerId}
                onChange={(e) => setResponsibleLawyerId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
              >
                {MOCK_USERS.filter((u) => u.role === 'PARTNER' || u.role === 'LAWYER').map((lawyer) => (
                  <option key={lawyer.id} value={lawyer.id}>
                    {lawyer.name} ({lawyer.oaaNumber})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Defendant Info */}
          <div className="p-4 rounded-xl bg-slate-850 border border-slate-800 space-y-3">
            <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
              Parte Contrária (Réu / Demandado)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Nome da Parte Contrária</label>
                <input
                  type="text"
                  placeholder="Ex: Banco Comercial Atlântico SA"
                  value={defendantName}
                  onChange={(e) => setDefendantName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Advogado da Contraparte (opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Dr. Silvestre Pedro (OAA 0984)"
                  value={defendantLawyer}
                  onChange={(e) => setDefendantLawyer(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Values in Kwanzas & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Valor da Causa (AOA / Kz)</label>
              <input
                type="number"
                step="100000"
                value={claimValueAoa}
                onChange={(e) => setClaimValueAoa(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Valor Provisionado (AOA)</label>
              <input
                type="number"
                step="100000"
                value={provisionedValueAoa}
                onChange={(e) => setProvisionedValueAoa(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-300">Grau de Prioridade</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
              >
                <option value="NORMAL">Normal</option>
                <option value="HIGH">Alta Prioridade</option>
                <option value="CRITICAL">Crítica / Urgente</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Resumo Fáctico & Fundamentação Jurídica</label>
            <textarea
              rows={3}
              placeholder="Descreva brevemente os factos essenciais e a pretensão deduzida em juízo..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Confidential toggle */}
          <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-850 border border-slate-800">
            <input
              type="checkbox"
              id="confidentialCheck"
              checked={isConfidential}
              onChange={(e) => setIsConfidential(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 focus:ring-0 bg-slate-800 border-slate-700"
            />
            <label htmlFor="confidentialCheck" className="text-slate-300 cursor-pointer flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Processo Confidencial (Segredo de Justiça / Acesso restrito a advogados designados)</span>
            </label>
          </div>

          {/* Submit buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              <Briefcase className="w-4 h-4" />
              <span>Autuar Processo & Abrir Dossier</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
