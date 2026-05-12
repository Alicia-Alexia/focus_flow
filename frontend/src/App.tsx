import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Plus, Search, LayoutDashboard, Calendar,
  Settings, CheckCircle2, Circle, Trash2, MoreVertical
} from 'lucide-react';

const api = axios.create({ baseURL: 'http://localhost:3333' });

export function App() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function fetchTasks() {
    const res = await api.get('/tasks');
    setTasks(res.data);
  }

  async function handleCreateTask(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    await api.post('/tasks', { title });
    setTitle('');
    fetchTasks();
  }

  async function toggleTaskStatus(id: string, completed: boolean) {
    try {
      await api.patch(`/tasks/${id}`, { completed: !completed });
      await fetchTasks();
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
      alert("Não foi possível atualizar o status da tarefa.");
    }
  }

  async function deleteTask(id: string) {
    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;
    try {
      await api.delete(`/tasks/${id}`);
      await fetchTasks();
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
      alert("Houve um erro ao excluir a tarefa.");
    }
  }

  useEffect(() => { fetchTasks(); }, []);

  return (
    <div className="flex min-h-screen bg-[#0f111a] text-slate-300 font-sans">
      <aside className="w-64 bg-[#161925] border-r border-slate-800 p-6 flex flex-col gap-8">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20">
            <LayoutDashboard size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">FocusFlow</span>
        </div>

        <nav className="flex flex-col gap-2">
          <button className="flex items-center gap-3 px-3 py-2 bg-indigo-600/10 text-indigo-400 rounded-lg font-medium transition-colors">
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
          <form
            onSubmit={handleCreateTask}
            className="bg-[#1c2130] p-3 rounded-2xl border border-slate-800 shadow-2xl focus-within:border-indigo-500/40 focus-within:ring-1 focus-within:ring-indigo-500/40 transition-all duration-300"
          >
            <div className="flex items-center gap-2">
              <div className="bg-[#242938] p-3 rounded-xl ml-1">
                <Plus className="text-indigo-500" size={20} />
              </div>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="bg-transparent flex-1 outline-none px-2 text-base text-white placeholder:text-slate-600 tracking-wide"
                placeholder="Adicione uma nova tarefa para hoje..."
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-indigo-900/20 active:scale-95 whitespace-nowrap"
              >
                Criar Tarefa
              </button>
            </div>
          </form>
        </section>
        {filteredTasks.map(task => (
          <div key={task.id} className="group bg-[#161925] p-5 rounded-2xl border border-slate-800 flex items-center justify-between hover:border-indigo-500/30 hover:bg-[#1a1e2d] transition-all duration-300">
            <div className="flex items-center gap-5">
              <button onClick={() => toggleTaskStatus(task.id, task.completed)} className="transition-transform active:scale-90">
                {task.completed ? <CheckCircle2 className="text-indigo-500" size={26} /> : <Circle size={26} className="text-slate-700 group-hover:text-indigo-400 transition-colors" />}
              </button>
              <div>
                <h3 className={`text-lg font-semibold transition-all ${task.completed ? 'line-through text-slate-600' : 'text-slate-200'}`}>
                  {task.title}
                </h3>
                {/* Badge de prioridade fixa como exemplo do design */}
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-tighter font-black">Prioridade Baixa</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
              <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-slate-200 transition-colors"><MoreVertical size={20} /></button>
              <button onClick={() => deleteTask(task.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-slate-500 hover:text-red-500 transition-colors"><Trash2 size={20} /></button>
            </div>
          </div>
        ))}
      </main>
    </div>

  );
}

export default App;