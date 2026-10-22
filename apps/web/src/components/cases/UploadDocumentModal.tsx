import React, { useState } from 'react';
import { LegalDocument } from '@sigea/shared';
import { useCases } from '../../context/CasesContext';
import { X, UploadCloud, FileText, CheckCircle2 } from 'lucide-react';

interface UploadDocumentModalProps {
  caseId: string;
  caseNumber: string;
  isOpen: boolean;
  onClose: () => void;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  caseId,
  caseNumber,
  isOpen,
  onClose
}) => {
  const { addDocument } = useCases();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<LegalDocument['category']>('PETITION');
  const [isClientVisible, setIsClientVisible] = useState(true);
  const [fileSelected, setFileSelected] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulatedFileDrop = () => {
    const sampleFiles = [
      'Parecer_Tecnico_Juridico_Direito_Comercial.pdf',
      'Requerimento_Notificacao_Judicial_Avulsa.pdf',
      'Certidao_Negativa_Dividas_AGT.pdf',
      'Minuta_Recurso_Apelacao_Tribunal_Relacao.pdf'
    ];
    const picked = sampleFiles[Math.floor(Math.random() * sampleFiles.length)];
    setFileSelected(picked);
    if (!title) {
      setTitle(picked);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addDocument({
      caseId,
      title: title.trim().endsWith('.pdf') || title.trim().endsWith('.docx') ? title.trim() : `${title.trim()}.pdf`,
      category,
      isClientVisible,
      fileSize: Math.floor(800000 + Math.random() * 4500000),
      fileType: 'application/pdf',
      uploadedByName: 'Dr. Rui Falcão de Carvalho'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
        <div className="p-5 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Carregar Peça / Prova Documental</h2>
              <p className="text-xs text-slate-400">Proc. nº {caseNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Simulated Upload Dropzone */}
          <div
            onClick={handleSimulatedFileDrop}
            className="p-6 border-2 border-dashed border-slate-700 hover:border-blue-500/60 rounded-2xl bg-slate-850/60 text-center cursor-pointer transition-all space-y-2 group"
          >
            <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            {fileSelected ? (
              <div className="space-y-1">
                <span className="font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{fileSelected}</span>
                </span>
                <p className="text-[11px] text-slate-400">Clique para selecionar outro ficheiro</p>
              </div>
            ) : (
              <div>
                <p className="font-semibold text-white">Clique para selecionar ficheiro</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Suporta PDF, DOCX, Imagens (Até 50 MB)</p>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Título / Nome de Identificação *</label>
            <input
              type="text"
              placeholder="Ex: Parecer_Tecnico_Pericia_Informatica.pdf"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-300">Categoria da Peça</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            >
              <option value="PETITION">Petição / Articulado Forense</option>
              <option value="EVIDENCE">Prova Documental / Extratos</option>
              <option value="CONTRACT">Contrato / Instrumento Notarial</option>
              <option value="COURT_DECISION">Decisão / Despacho Judicial</option>
              <option value="POWER_OF_ATTORNEY">Procuração Forense OAA</option>
              <option value="RECEIPT">Recibo / Guia de Custas</option>
              <option value="OTHER">Outro Documento</option>
            </select>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-850 border border-slate-800">
            <input
              type="checkbox"
              id="clientVisCheck"
              checked={isClientVisible}
              onChange={(e) => setIsClientVisible(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700"
            />
            <label htmlFor="clientVisCheck" className="text-slate-300 cursor-pointer">
              Disponibilizar documento no Portal do Cliente (o cliente poderá descarregar)
            </label>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold shadow"
            >
              Anexar ao Dossier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
