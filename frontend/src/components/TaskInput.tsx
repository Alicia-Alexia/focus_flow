import { Plus } from 'lucide-react';

interface TaskInputProps {
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  handleCreateTask: (e: React.SyntheticEvent) => void;
}

export function TaskInput({ title, setTitle, description, setDescription, handleCreateTask }: TaskInputProps) {
  return (
    <section className="mb-10">
      <form onSubmit={handleCreateTask} className="bg-[#1c2130] p-4 rounded-2xl border border-slate-800 shadow-2xl transition-all">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#242938] p-3 rounded-xl">
              <Plus className="text-indigo-500" size={20} />
            </div>
            <input 
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="bg-transparent flex-1 outline-none text-lg text-white placeholder:text-slate-600" 
              placeholder="Título da tarefa..." 
            />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl font-bold transition-all active:scale-95">
              Criar Tarefa
            </button>
          </div>
          <textarea 
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="bg-[#161925] p-3 rounded-xl border border-slate-800 text-sm text-slate-400 outline-none focus:border-indigo-500/30 transition-all resize-none h-20"
            placeholder="Adicione uma descrição opcional..."
          />
        </div>
      </form>
    </section>
  );
}