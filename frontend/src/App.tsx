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
    </div>
  );
}

export default App;