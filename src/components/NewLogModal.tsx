import React, { useState } from 'react';
import { EngineeringLog } from '../types';
import { Clock, X, Check, Terminal } from 'lucide-react';

interface NewLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLog: (log: Omit<EngineeringLog, 'id'>) => void;
}

export const NewLogModal: React.FC<NewLogModalProps> = ({ isOpen, onClose, onAddLog }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('Dra. Carolina Mendes');
  const [category, setCategory] = useState<EngineeringLog['category']>('STA');
  const [severity, setSeverity] = useState<EngineeringLog['severity']>('info');
  const [description, setDescription] = useState('');
  const [hash, setHash] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onAddLog({
      title: title.trim(),
      author: author.trim(),
      category,
      severity,
      description: description.trim(),
      timestamp: 'Agora mesmo',
      hash: hash.trim() ? hash.trim() : `run#${Math.floor(1000 + Math.random() * 9000)}`,
    });

    setTitle('');
    setDescription('');
    setHash('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0c0e14] border border-[#2b354d] rounded-xl max-w-lg w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-[#1c2230]">
          <h3 className="text-base font-bold text-white flex items-center gap-2 font-tech tracking-wide">
            <Terminal className="h-4 w-4 text-emerald-400" />
            REGISTRAR ENTRADA NO DIÁRIO DE SILÍCIO
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-[#181d29] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs font-mono">
          <div>
            <label className="block text-slate-300 font-medium mb-1 text-[11px]">TÍTULO DO EVENTO / BUILD</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Fechamento de timing no canal de DMA..."
              className="w-full bg-[#08090d] border border-[#22293b] rounded p-2 text-slate-200 focus:outline-none focus:border-amber-400 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1 text-[11px]">DISCIPLINA TÉCNICA</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EngineeringLog['category'])}
                className="w-full bg-[#08090d] border border-[#22293b] rounded p-2 text-slate-200 focus:outline-none focus:border-amber-400 text-xs"
              >
                <option value="STA">STA (Timing)</option>
                <option value="Verificação">Verificação UVM</option>
                <option value="DRC/LVS">DRC / LVS</option>
                <option value="Síntese">Síntese & DFT</option>
                <option value="RTL">Design RTL</option>
                <option value="Foundry">Foundry TSMC</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1 text-[11px]">SEVERIDADE / STATUS</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as EngineeringLog['severity'])}
                className="w-full bg-[#08090d] border border-[#22293b] rounded p-2 text-slate-200 focus:outline-none focus:border-amber-400 text-xs"
              >
                <option value="info">Info / Telemetria Geral</option>
                <option value="success">Sucesso / Pass</option>
                <option value="warning">Aviso / Warning</option>
                <option value="critical">Crítico / Violação</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1 text-[11px]">ENGENHEIRO AUTOR</label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-[#08090d] border border-[#22293b] rounded p-2 text-slate-200 focus:outline-none focus:border-amber-400 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1 text-[11px]">HASH / RUN ID (OPCIONAL)</label>
              <input
                type="text"
                value={hash}
                onChange={(e) => setHash(e.target.value)}
                placeholder="Ex: syn-run#8210"
                className="w-full bg-[#08090d] border border-[#22293b] rounded p-2 text-slate-200 focus:outline-none focus:border-amber-400 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1 text-[11px]">DESCRITIVO TÉCNICO & EVIDÊNCIAS</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalhes sobre convergência física, parâmetros de síntese, bibliotecas .db ou assertivas..."
              className="w-full bg-[#08090d] border border-[#22293b] rounded p-2.5 text-slate-200 focus:outline-none focus:border-amber-400 text-xs"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1c2230]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-[0_0_10px_rgba(245,158,11,0.3)] flex items-center gap-1.5"
            >
              <Check className="h-4 w-4" />
              Publicar no Diário
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

