import { Mail, Lock, User, UserPlus, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
export function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  return (
    <div className="min-h-screen bg-[#0f111a] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#161925] border border-slate-800 p-8 rounded-3xl shadow-2xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Criar conta</h2>
          <p className="text-slate-500 text-sm font-medium">Comece sua jornada de produtividade hoje.</p>
        </div>

        <form className="space-y-5">
          {/* Campo Nome */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-400 ml-1">Nome Completo</label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Como quer ser chamado?"
                className="w-full bg-[#1c2130] border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-indigo-500/50 transition-all"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          {/* Campo E-mail */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-400 ml-1">E-mail</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input
                type="email"
                placeholder="seu@exemplo.com"
                className="w-full bg-[#1c2130] border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-indigo-500/50 transition-all"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          {/* Campo Senha */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-400 ml-1">Senha</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input
                type="password"
                placeholder="Crie uma senha forte"
                className="w-full bg-[#1c2130] border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-indigo-500/50 transition-all"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button className="w-full bg-indigo-500 hover:bg-indigo-400 text-[#0f111a] font-black py-4 rounded-2xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 mt-4">
            <UserPlus size={20} />
            Criar conta agora
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link
          to="/login"
          className="mt-6 flex items-center justify-center gap-2 w-full text-sm font-bold text-slate-500 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar para o login
        </Link>
        </div>
      </div>
    </div>
  );
}