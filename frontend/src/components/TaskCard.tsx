import { CheckCircle2, Circle, Settings, Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: any;
  editingId: string | null;
  editTitle: string;
  setEditTitle: (val: string) => void;
  editDescription: string;
  setEditDescription: (val: string) => void;
  toggleTaskStatus: (id: string, completed: boolean) => void;
  deleteTask: (id: string) => void;
  startEditing: (task: any) => void;
  handleUpdateTask: (id: string) => void;
  cancelEditing: () => void;
}

export function TaskCard({ 
  task, editingId, editTitle, setEditTitle, editDescription, 
  setEditDescription, toggleTaskStatus, deleteTask, 
  startEditing, handleUpdateTask, cancelEditing 
}: TaskCardProps) {
  
  const isEditing = editingId === task.id;

  return (
    <div className="group bg-[#161925] p-5 rounded-2xl border border-slate-800 transition-all hover:border-slate-700">
      {isEditing ? (
        <div className="flex flex-col gap-3 w-full">
          <input 
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            className="bg-[#1c2130] border border-indigo-500/50 rounded-lg p-2 text-white outline-none"
          />
          <textarea 
            value={editDescription}
            onChange={e => setEditDescription(e.target.value)}
            className="bg-[#1c2130] border border-slate-800 rounded-lg p-2 text-sm text-slate-400 outline-none h-20 resize-none"
          />
          <div className="flex justify-end gap-2">
            <button onClick={cancelEditing} className="text-slate-500 text-sm hover:text-white px-3 py-1">Cancelar</button>
            <button onClick={() => handleUpdateTask(task.id)} className="bg-indigo-600 text-white text-sm px-4 py-1 rounded-lg font-bold">Salvar</button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-5">
            <button onClick={() => toggleTaskStatus(task.id, task.completed)}>
              {task.completed ? <CheckCircle2 className="text-indigo-500" size={26} /> : <Circle size={26} className="text-slate-700" />}
            </button>
            <div>
              <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-slate-600' : 'text-slate-200'}`}>
                {task.title}
              </h3>
              {task.description && <p className="text-sm text-slate-500 mt-1">{task.description}</p>}
            </div>
          </div>
          <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all">
            <button onClick={() => startEditing(task)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-indigo-400">
              <Settings size={20} />
            </button>
            <button onClick={() => deleteTask(task.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-slate-500 hover:text-red-500">
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}