import { useState } from 'react';
import { Paintbrush, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

const themes = [
  { id: 'indigo', name: 'Roxo Produtivo', previewBg: 'bg-[#6366f1]' },
  { id: 'emerald', name: 'Verde Hacker', previewBg: 'bg-[#10b981]' },
  { id: 'cyan', name: 'Ciano Espacial', previewBg: 'bg-[#06b6d4]' },
  { id: 'rose', name: 'Rosa Cyberpunk', previewBg: 'bg-[#f43f5e]' },
];

export function SettingsView() {
  const [activeTheme, setActiveTheme] = useState(() => {
    return localStorage.getItem('@focusflow:theme') || 'indigo';
  });

  const handleThemeChange = (themeId: string) => {
    setActiveTheme(themeId);
    localStorage.setItem('@focusflow:theme', themeId);
    
    document.documentElement.setAttribute('data-theme', themeId);

    toast.success("Tema atualizado com sucesso!", {
      style: { background: '#161925', color: '#fff', border: '1px solid #1e293b' }
    });
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div className="bg-[#161925] border border-slate-800 p-8 rounded-3xl shadow-xl">
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Paintbrush className="text-slate-400" size={22} style={{ color: 'var(--primary)' }} />
          Aparência do Sistema
        </h3>
        <p className="text-slate-500 text-sm mb-6">
          Personalize a cor de destaque do seu painel do FocusFlow.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {themes.map((theme) => {
            const isSelected = activeTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => handleThemeChange(theme.id)}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                  isSelected 
                    ? 'border-slate-600 bg-[#1c2130]' 
                    : 'border-slate-800 bg-[#12141f] hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full ${theme.previewBg}`} />
                  <span className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                    {theme.name}
                  </span>
                </div>
                
                {isSelected && (
                  <div className="p-1 rounded-full text-emerald-400 bg-slate-800">
                    <Check size={14} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}