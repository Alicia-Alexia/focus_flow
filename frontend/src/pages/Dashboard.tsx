import { useEffect, useState, useMemo, useCallback } from 'react';
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

  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);

const fetchTasks = useCallback(async () => {
  const storedData = authService.getUser();
  const userId = storedData?.id || storedData?.user?.id;
  if (!userId) {
    return;
  }

  try {
    const res = await api.get(`/tasks?userId=${userId}`);
  
    const data = Array.isArray(res.data) ? res.data : (res.data.tasks || []);
    setTasks(data);
    
  } catch (error) {
  }
}, []);
useEffect(() => {
  const userFromStorage = authService.getUser();
  const id = userFromStorage?.id || userFromStorage?._id;

  if (id) {
    setCurrentUser(userFromStorage);
    fetchTasks();
  } else {
    navigate('/login');
  }
}, [currentTab, fetchTasks, navigate]);

  useEffect(() => {
    const storedUser = authService.getUser();
    if (storedUser) {
      setCurrentUser(storedUser);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const id = currentUser?.id || currentUser?._id;
    if (id) {
      fetchTasks();
    }
  }, [currentUser?.id, currentUser?._id, currentTab])
  useEffect(() => {
    const storedUser = authService.getUser();
    if (storedUser) {
      setCurrentUser(storedUser);
      fetchTasks();
    } else {
      navigate('/login');
    }
  }, [navigate, fetchTasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (currentTab === 'today') {
        return matchesSearch && !task.completed;
      }
      return matchesSearch;
    });
  }, [tasks, searchQuery, currentTab]);

  const userId = currentUser?.id || currentUser?._id;

  function handleLogout() {
    authService.logout();
    navigate('/login');
  }

  async function handleCreateTask(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!title.trim() || !userId) return;

    try {
      await api.post('/tasks', {
        title,
        description: description || "",
        isPriority: currentTab === 'today',
        userId
      });

      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
    }
  }

  async function handleUpdateTask(id: string) {
    if (!userId) return;
    try {
      await api.patch(`/tasks/${id}`, {
        title: editTitle,
        description: editDescription,
        userId
      });
      setEditingId(null);
      fetchTasks();
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    }
  }

  async function toggleTaskStatus(id: string, completed: boolean) {
    const task = tasks.find(t => t.id === id);
    if (!task || !userId) return;

    try {
      if (currentTab === 'upcoming') {
        if (!task.isDoing && !task.completed) {
          await api.patch(`/tasks/${id}`, { userId, isDoing: true });
        } else if (task.isDoing && !task.completed) {
          await api.patch(`/tasks/${id}`, { userId, isDoing: false, completed: true });
        } else if (task.completed) {
          await api.patch(`/tasks/${id}`, { userId, completed: false, isDoing: false });
        }
      } else {
        await api.patch(`/tasks/${id}`, { userId, completed: !completed });
      }
      fetchTasks();
    } catch (error) {
      console.error("Erro ao transicionar status:", error);
    }
  }

  async function confirmDelete() {
    if (!taskToDelete || !userId) return;
    try {
      await api.delete(`/tasks/${taskToDelete.id}?userId=${userId}`);
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
      fetchTasks();
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  }

  const cardProps = {
    editingId, editTitle, setEditTitle, editDescription, setEditDescription,
    toggleTaskStatus, 
    startEditing: (task: any) => {
      setEditingId(task.id);
      setEditTitle(task.title);
      setEditDescription(task.description || '');
    },
    handleUpdateTask,
    cancelEditing: () => setEditingId(null),
    handleToggleDoing: async (id: string, currentIsDoing: boolean) => {
      if (!userId) return;
      await api.patch(`/tasks/${id}`, { isDoing: !currentIsDoing, userId });
      fetchTasks();
    },
    handleTogglePriority: async (id: string, currentPriority: boolean) => {
      if (!userId) return;
      await api.patch(`/tasks/${id}`, { isPriority: !currentPriority, userId });
      fetchTasks();
    },
    deleteTask: (id: string) => {
      const task = tasks.find(t => t.id === id);
      if (task) {
        setTaskToDelete({ id: task.id, title: task.title });
        setIsDeleteModalOpen(true);
      }
    },
  };

  if (!currentUser) return null;

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
          <TaskInput 
            title={title} setTitle={setTitle} 
            description={description} setDescription={setDescription} 
            handleCreateTask={handleCreateTask} 
          />
        </div>

        {currentTab === 'today' ? (
          <div className="grid gap-4">
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Minhas Tarefas
              </span>
            </div>
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <TaskCard key={task.id} task={task} {...cardProps} />
              ))
            ) : (
              <div className="text-center py-20 bg-[#161925] rounded-3xl border border-dashed border-slate-800 text-slate-600">
                Nenhuma tarefa pendente.
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