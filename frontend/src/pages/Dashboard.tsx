import { useEffect, useState, useMemo } from 'react';
import { Search, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { authService } from '../services/auth';

import { Sidebar } from '../components/Sidebar';
import { TaskInput } from '../components/TaskInput';
import { TaskCard } from '../components/TaskCard';
import { KanbanBoard } from '../components/KanbanBoard';
import { DeleteModal } from '../components/DeleteModal';

export function Dashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState<'today' | 'upcoming'>('today');

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<{ id: string, title: string } | null>(null);

  const user = authService.getUser();
  const navigate = useNavigate();

  function handleLogout() {
    authService.logout();
    navigate('/login');
  }

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      if (currentTab === 'today') {
        return matchesSearch && task.isPriority && !task.completed;
      }
      return matchesSearch;
    });
  }, [tasks, searchQuery, currentTab]);

  async function fetchTasks() {
    if (!user?.id) return;
    try {
      const res = await api.get(`/tasks?userId=${user.id}`);
      setTasks(res.data);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    }
  }

  async function handleCreateTask(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!title.trim() || !user?.id) return;
    const priorityStatus = currentTab === 'today';

    try {
      await api.post('/tasks', {
        title,
        description: description || "",
        isPriority: priorityStatus,
        userId: user.id
      });

      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
    }
  }

  async function handleUpdateTask(id: string) {
    if (!user?.id) return;
    try {
      await api.patch(`/tasks/${id}`, {
        title: editTitle,
        description: editDescription,
        userId: user.id
      });
      setEditingId(null);
      fetchTasks();
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    }
  }

  async function toggleTaskStatus(id: string, completed: boolean) {
    const task = tasks.find(t => t.id === id);
    if (!task || !user?.id) return;

    try {
      const basePayload = { userId: user.id };

      if (currentTab === 'upcoming') {
        if (!task.isDoing && !task.completed) {
          await api.patch(`/tasks/${id}`, { ...basePayload, isDoing: true });
        } else if (task.isDoing && !task.completed) {
          await api.patch(`/tasks/${id}`, { ...basePayload, isDoing: false, completed: true });
        } else if (task.completed) {
          await api.patch(`/tasks/${id}`, { ...basePayload, completed: false, isDoing: false });
        }
      } else {
        await api.patch(`/tasks/${id}`, { ...basePayload, completed: !completed });
      }
      await fetchTasks();
    } catch (error) {
      console.error("Erro ao transicionar status:", error);
    }
  }

  async function confirmDelete() {
    if (!taskToDelete || !user?.id) return;
    try {
      await api.delete(`/tasks/${taskToDelete.id}?userId=${user.id}`);
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
      fetchTasks();
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  }

  async function handleToggleDoing(id: string, currentIsDoing: boolean) {
    if (!user?.id) return;
    try {
      await api.patch(`/tasks/${id}`, { isDoing: !currentIsDoing, userId: user.id });
      await fetchTasks();
    } catch (error) {
      console.error("Erro ao mudar para progresso:", error);
    }
  }

  async function handleTogglePriority(id: string, currentPriority: boolean) {
    if (!user?.id) return;
    try {
      await api.patch(`/tasks/${id}`, { isPriority: !currentPriority, userId: user.id });
      await fetchTasks();
    } catch (error) {
      console.error("Erro ao atualizar prioridade:", error);
    }
  }

  function openDeleteModal(task: { id: string, title: string }) {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  }

  function startEditing(task: any) {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
  }

  const inputProps = {
    title, setTitle, description, setDescription, handleCreateTask
  };

  const cardProps = {
    editingId, editTitle, setEditTitle, editDescription, setEditDescription,
    toggleTaskStatus, startEditing, handleUpdateTask,
    cancelEditing: () => setEditingId(null),
    handleToggleDoing, handleTogglePriority,
    deleteTask: (id: string) => {
      const task = tasks.find(t => t.id === id);
      if (task) openDeleteModal({ id: task.id, title: task.title });
    },
  };

  useEffect(() => { fetchTasks(); }, []);

  return (
    <div className="flex min-h-screen bg-[#0f111a] text-slate-300 font-sans">
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-white mb-1">
              {currentTab === 'today' ? 'Hoje' : 'Próximos'}
            </h1>
            <p className="text-slate-500 font-medium tracking-tight">Terça-feira, 12 de Maio</p>
          </div>
          <div className="flex flex-col items-end gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-red-400 transition-all group"
            >
              <span className="opacity-0 group-hover:opacity-100 transition-opacity">Sair da conta</span>
              <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center gap-4 bg-[#161925] px-4 py-2 rounded-xl border border-slate-800 focus-within:border-slate-600 transition-colors">
              <Search size={18} className="text-slate-500" />
              <input
                className="bg-transparent outline-none text-sm placeholder:text-slate-600 w-full"
                placeholder="Buscar tarefas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </header>

        <div className={currentTab === 'upcoming' ? 'mb-12' : 'mb-6'}>
          <TaskInput {...inputProps} />
        </div>

        {currentTab === 'today' ? (
          <div className="grid gap-4">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Minhas Prioridades
              </span>
            </div>
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <TaskCard key={task.id} task={task} {...cardProps} />
              ))
            ) : (
              <div className="text-center py-20 bg-[#161925] rounded-3xl border border-dashed border-slate-800 text-slate-600">
                Nenhuma prioridade para hoje.
              </div>
            )}
          </div>
        ) : (
          <KanbanBoard tasks={filteredTasks} {...cardProps} />
        )}

        <DeleteModal
          isOpen={isDeleteModalOpen}
          taskTitle={taskToDelete?.title || ""}
          onConfirm={confirmDelete}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setTaskToDelete(null);
          }}
        />
      </main>
    </div>
  );
}