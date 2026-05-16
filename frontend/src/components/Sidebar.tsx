import { LayoutDashboard, Calendar, Settings } from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: 'today' | 'upcoming' | 'settings') => void;
}

export function Sidebar({ currentTab, setCurrentTab }: SidebarProps) {
  return (
    <aside className="w-64 bg-[#161925] border-r border-slate-800 p-6 flex flex-col gap-8">
      <div className="flex items-center gap-3 px-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
          <LayoutDashboard size={20} className="text-white" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">FocusFlow</span>
      </div>

      <nav className="flex flex-col gap-2 text-sm">
        
        <button 
          onClick={() => setCurrentTab('today')}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
            currentTab === 'today' ? 'bg-indigo-600/10 text-indigo-400' : 'text-slate-500 hover:text-slate-200'
          }`}
        >
          <LayoutDashboard size={18} /> Hoje
        </button>

        <button 
          onClick={() => setCurrentTab('upcoming')}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
            currentTab === 'upcoming' ? 'bg-indigo-600/10 text-indigo-400' : 'text-slate-500 hover:text-slate-200'
          }`}
        >
          <Calendar size={18} /> Próximos
        </button>

        <button 
          onClick={() => setCurrentTab('settings')} 
          className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all ${
            currentTab === 'settings' 
              ? 'bg-indigo-600/10 text-indigo-400' 
              : 'text-slate-500 hover:text-slate-200'
          }`}
        >
          <Settings size={18} /> Configurações
        </button>

      </nav>
    </aside>
  );
}