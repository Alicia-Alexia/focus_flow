import { useEffect, useState } from 'react';
import axios from 'axios';
import { Search } from 'lucide-react';

// Importando nossos novos componentes
import { Sidebar } from './components/Sidebar';
import { TaskInput } from './components/TaskInput';
import { TaskCard } from './components/TaskCard';

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

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function fetchTasks() {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (error) { console.error(error); }
  }

  async function handleCreateTask(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await api.post('/tasks', { title, description });
      setTitle(''); setDescription(''); fetchTasks();
    } catch (error) { console.error(error); }
  }

  async function handleUpdateTask(id: string) {
    try {
      await api.patch(`/tasks/${id}`, { title: editTitle, description: editDescription });
      setEditingId(null); fetchTasks();
    } catch (error) { alert("Erro ao salvar"); }
  }

  async function toggleTaskStatus(id: string, completed: boolean) {
    await api.patch(`/tasks/${id}`, { completed: !completed });
    fetchTasks();
  }

  async function deleteTask(id: string) {
    if (!confirm("Excluir?")) return;
    await api.delete(`/tasks/${id}`);
    fetchTasks();
  }

  function startEditing(task: any) {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
  }

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
            <p className="text-slate-500 font-medium">Terça-feira, 12 de Maio</p>
          </div>
          
          <div className="flex items-center gap-4 bg-[#161925] px-4 py-2 rounded-xl border border-slate-800 focus-within:border-slate-600 transition-colors">
            <Search size={18} className="text-slate-500" />
            <input
              className="bg-transparent outline-none text-sm placeholder:text-slate-600"
              placeholder="Buscar tarefas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        {currentTab === 'today' && (
          <TaskInput 
            title={title} setTitle={setTitle} 
            description={description} setDescription={setDescription} 
            handleCreateTask={handleCreateTask} 
          />
        )}

        <div className="grid gap-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <TaskCard 
                key={task.id}
                task={task}
                editingId={editingId}
                editTitle={editTitle}
                setEditTitle={setEditTitle}
                editDescription={editDescription}
                setEditDescription={setEditDescription}
                toggleTaskStatus={toggleTaskStatus}
                deleteTask={deleteTask}
                startEditing={startEditing}
                handleUpdateTask={handleUpdateTask}
                cancelEditing={() => setEditingId(null)}
              />
            ))
          ) : (
            <div className="text-center py-20 bg-[#161925] rounded-3xl border border-dashed border-slate-800 text-slate-600">
              Nenhuma tarefa encontrada.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}