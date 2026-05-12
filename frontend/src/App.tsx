import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Plus, Search, LayoutDashboard, Calendar,
  Settings, CheckCircle2, Circle, Trash2
} from 'lucide-react';

const api = axios.create({ baseURL: 'http://localhost:3333' });

export function App() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  

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
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
    }
  }

  async function handleCreateTask(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      await api.post('/tasks', { 
        title, 
        description 
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
      console.log("Enviando para atualização:", { title: editTitle, description: editDescription });

    await api.patch(`/tasks/${id}`, { 
      title: editTitle, 
      description: editDescription 
    });

    setEditingId(null); 
    await fetchTasks(); 
  } catch (error) {
    console.error("Erro ao atualizar:", error);
    alert("Erro ao salvar alterações.");
  }
}

  async function toggleTaskStatus(id: string, completed: boolean) {
    try {
      await api.patch(`/tasks/${id}`, { completed: !completed });
      fetchTasks();
    } catch (error) {
      console.error("Erro ao mudar status:", error);
    }
  }

  async function deleteTask(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;
    try {
      await api.delete(`/tasks/${id}`);
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

  useEffect(() => { fetchTasks(); }, []);

  return (
    <div className="flex min-h-screen bg-[#0f111a] text-slate-300 font-sans">
      <aside className="w-64 bg-[#161925] border-r border-slate-800 p-6 flex flex-col gap-8">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
            <LayoutDashboard size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">FocusFlow</span>
        </div>

        <nav className="flex flex-col gap-2 text-sm">
          <button className="flex items-center gap-3 px-3 py-2 bg-indigo-600/10 text-indigo-400 rounded-lg font-medium">
            <LayoutDashboard size={18} /> Hoje
          </button>
          <button className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-lg transition-all text-slate-500 hover:text-slate-200">
            <Calendar size={18} /> Próximos
          </button>
          <button className="flex items-center gap-3 px-3 py-2 hover:bg-slate-800 rounded-lg transition-all text-slate-500 hover:text-slate-200">
            <Settings size={18} /> Configurações
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-white mb-1">Hoje</h1>
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

        <div className="grid gap-4">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              {searchQuery ? 'Resultado da Busca' : 'Tarefas Ativas'}
            </span>
          </div>

          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <div key={task.id} className="group bg-[#161925] p-5 rounded-2xl border border-slate-800 transition-all hover:border-slate-700">
                {editingId === task.id ? (
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
                      <button onClick={() => setEditingId(null)} className="text-slate-500 text-sm hover:text-white px-3 py-1">Cancelar</button>
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
                        {task.description && (
                          <p className="text-sm text-slate-500 mt-1">{task.description}</p>
                        )}
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
            ))
          ) : (
            <div className="text-center py-20 bg-[#161925] rounded-3xl border border-dashed border-slate-800">
              <p className="text-slate-600 font-medium">Nenhuma tarefa encontrada.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;