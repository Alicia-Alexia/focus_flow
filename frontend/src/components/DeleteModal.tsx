import { AlertTriangle, Trash2 } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  taskTitle: string;
}

export function DeleteModal({ isOpen, onConfirm, onCancel, taskTitle }: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#161925] border border-slate-800 p-6 rounded-3xl w-full max-w-sm shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex items-center gap-3 mb-4 text-red-500">
          <div className="p-2 bg-red-500/10 rounded-xl">
            <AlertTriangle size={24} />
          </div>
          <h2 className="text-xl font-bold text-white">Excluir tarefa?</h2>
        </div>
        
        <p className="text-slate-400 mb-6 leading-relaxed">
          Tem certeza que deseja apagar <span className="text-slate-200 font-semibold">"{taskTitle}"</span>? 
          Essa ação não pode ser desfeita.
        </p>

        <div className="flex gap-3">
          <button 
            onClick={onCancel}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-400 hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            className="flex-1 py-3 px-4 rounded-xl font-bold bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2"
          >
            <Trash2 size={18} />
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}