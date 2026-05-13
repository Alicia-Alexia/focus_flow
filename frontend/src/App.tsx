import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { TaskInput } from './components/TaskInput';
import { TaskCard } from './components/TaskCard';
import { KanbanBoard } from './components/KanbanBoard';
import { DeleteModal } from './components/DeleteModal';

const api = axios.create({ baseURL: 'http://localhost:3333' });

export function App() {
  
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
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    }
  }

  async function handleCreateTask(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const priorityStatus = currentTab === 'today';

    try {
      await api.post('/tasks', { 
        title, 
        description: description || "",
        isPriority: priorityStatus 
      });
      
      setTitle('');
      setDescription('');
      fetchTasks();
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
    }
  }

  async function handleUpdateTask(id: string) {
    try {
      await api.patch(`/tasks/${id}`, { 
        title: editTitle, 
        description: editDescription 
      });
      setEditingId(null);
      fetchTasks();
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    }
  }

  async function toggleTaskStatus(id: string, completed: boolean) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      if (currentTab === 'upcoming') {
        if (!task.isDoing && !task.completed) {
          await api.patch(`/tasks/${id}`, { isDoing: true });
        } else if (task.isDoing && !task.completed) {
          await api.patch(`/tasks/${id}`, { isDoing: false, completed: true });
        } else if (task.completed) {
          await api.patch(`/tasks/${id}`, { completed: false, isDoing: false });
        }
      } else {
        await api.patch(`/tasks/${id}`, { completed: !completed });
      }
      await fetchTasks();
    } catch (error) {
      console.error("Erro ao transicionar status:", error);
    }
  }

  function openDeleteModal(task: { id: string, title: string }) {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  }

  async function confirmDelete() {
    if (!taskToDelete) return;
    try {
      await api.delete(`/tasks/${taskToDelete.id}`);
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
      fetchTasks();
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  }

  function startEditing(task: any) {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
  }

  async function handleToggleDoing(id: string, currentIsDoing: boolean) {
    try {
      await api.patch(`/tasks/${id}`, { isDoing: !currentIsDoing });
      await fetchTasks();
    } catch (error) {
      console.error("Erro ao mudar para progresso:", error);
    }
  }

  async function handleTogglePriority(id: string, currentPriority: boolean) {
    try {
      await api.patch(`/tasks/${id}`, { isPriority: !currentPriority });
      await fetchTasks();
    } catch (error) {
      console.error("Erro ao atualizar prioridade:", error);
    }
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

          <div className="flex items-center gap-4 bg-[#161925] px-4 py-2 rounded-xl border border-slate-800 focus-within:border-slate-600 transition-colors">
            <Search size={18} className="text-slate-500" />
            <input
              className="bg-transparent outline-none text-sm placeholder:text-slate-600 w-full"
              placeholder="Buscar tarefas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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