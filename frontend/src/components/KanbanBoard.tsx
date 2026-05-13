import { TaskCard } from './TaskCard';

interface KanbanBoardProps {
  tasks: any[];
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
  handleToggleDoing: (id: string, isDoing: boolean) => void;
}

export function KanbanBoard({
  tasks, handleToggleDoing, ...cardProps
}: KanbanBoardProps) {

  const columns = [
    { id: 'todo', title: 'A Fazer', filter: (t: any) => !t.isDoing && !t.completed },
    { id: 'doing', title: 'Em Progresso', filter: (t: any) => t.isDoing && !t.completed },
    { id: 'done', title: 'Concluído', filter: (t: any) => t.completed }
  ];

  return (
    <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
      {columns.map(column => (
        <div key={column.id} className="flex-1 min-w-[320px] flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
              {column.title}
            </h2>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
              {tasks.filter(column.filter).length}
            </span>
          </div>

          <div className="flex flex-col gap-3 min-h-[500px] p-2 bg-slate-900/20 rounded-3xl border border-slate-800/50">
            {tasks.filter(column.filter).map(task => (
              <div key={task.id} className="relative group">
                <TaskCard task={task} {...cardProps} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}