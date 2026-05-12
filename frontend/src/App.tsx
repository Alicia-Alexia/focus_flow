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
      </main>
    </div>

  );
}

export default App;