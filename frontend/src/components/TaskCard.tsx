import { CheckCircle2, Circle, PencilLine, Trash2, PlayCircle, Star } from 'lucide-react';

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
  handleToggleDoing?: (id: string, isDoing: boolean) => void;
  handleTogglePriority?: (id: string, isPriority: boolean) => void;
}

export function TaskCard({
  task, editingId, editTitle, setEditTitle, editDescription,
  setEditDescription, toggleTaskStatus, deleteTask,
  startEditing, handleUpdateTask, cancelEditing, handleTogglePriority
}: TaskCardProps) {

  const isEditing = editingId === task.id;

  return (
    <div className="group bg-[#161925] p-5 rounded-r-2xl rounded-l-lg border-y border-r border-l-0 border-slate-800 border-l-4 border-l-indigo-500 transition-all hover:border-indigo-500/30 hover:border-l-indigo-500 hover:bg-[#1a1e2d] relative overflow-hidden shadow-sm hover:shadow-[0_8px_30px_rgb(var(--color-target),0.04)]">
      {isEditing ? (
        <div className="flex flex-col gap-3 w-full">
          <input
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            className="bg-[#1c2130] border border-indigo-500/50 rounded-lg p-2 text-white outline-none focus:ring-1 focus:ring-indigo-500"
            placeholder="Título da tarefa"
          />
          <textarea
            value={editDescription}
            onChange={e => setEditDescription(e.target.value)}
            className="bg-[#1c2130] border border-slate-800 rounded-lg p-2 text-sm text-slate-400 outline-none h-20 resize-none focus:border-slate-600"
            placeholder="Descrição"
          />
          <div className="flex justify-end gap-2">
            <button onClick={cancelEditing} className="text-slate-500 text-sm hover:text-white px-3 py-1 transition-colors">Cancelar</button>
            <button onClick={() => handleUpdateTask(task.id)} className="bg-indigo-600 text-white text-sm px-4 py-1 rounded-lg font-bold hover:bg-indigo-500 transition-all">Salvar</button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-4 w-full">
          <button onClick={() => toggleTaskStatus(task.id, task.completed)}>
            {task.completed ? (
              <CheckCircle2 className="text-indigo-500" size={24} />
            ) : task.isDoing ? (
              <PlayCircle className="text-yellow-500 animate-pulse" size={24} />
            ) : (
              <Circle size={24} className="text-slate-700" />
            )}
          </button>

          <div className="flex-1 min-w-0 flex flex-col">
            <h3 className={`text-lg font-bold leading-tight transition-all ${task.completed ? 'line-through text-slate-600' : 'text-slate-200'}`}>
              {task.title}
            </h3>

            {task.isPriority && (
              <div className="flex items-center gap-1.5 mt-2 self-start px-2 py-0.5 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                <span className="text-[10px] font-black text-yellow-500 uppercase tracking-wider">Prioridade</span>
              </div>
            )}

            {task.description && (
              <p className="text-sm text-slate-500 mt-2 leading-relaxed line-clamp-3">
                {task.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">

            <button
              onClick={() => handleTogglePriority && handleTogglePriority(task.id, task.isPriority)}
              className={`p-2 rounded-lg transition-colors ${task.isPriority
                  ? 'text-yellow-500 bg-yellow-500/10'
                  : 'text-slate-500 hover:text-yellow-500 hover:bg-yellow-500/10'
                }`}
              title={task.isPriority ? "Remover de Hoje" : "Adicionar a Hoje"}
            >
              <Star size={18} fill={task.isPriority ? "currentColor" : "none"} />
            </button>



            <button
              onClick={() => startEditing(task)}
              className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <PencilLine size={18} />
            </button>

            <button
              onClick={() => deleteTask(task.id)}
              className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}