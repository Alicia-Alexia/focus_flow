import { Mail, Lock, LogIn } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import { api } from '../services/api';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function handleLogin(e: React.SyntheticEvent) {
    e.preventDefault();
    try {
      const response = await api.post('/sessions', { email, password });
      authService.saveUser(response.data.user);
      navigate('/dashboard');
    } catch (error: any) {
      alert(error.response?.data?.message || "Erro ao conectar com o servidor");
    }
  }

  return (
    <div className="min-h-screen bg-[#0f111a] flex flex-col items-center justify-center p-4 font-sans">
      {/* Header do Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="grid grid-cols-3 gap-0.5">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            ))}
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">FocusFlow</h1>
        </div>
        <p className="text-slate-500 text-sm font-medium">Sua jornada de alta performance começa aqui.</p>
      </div>

      {/* Card de Login */}
      <div className="w-full max-w-md bg-[#161925] border border-slate-800 p-8 rounded-3xl shadow-2xl">
        <form onSubmit={handleLogin}>
          {/* Campo E-mail */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-400 ml-1">E-mail</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input
                type="email"
                placeholder="seu@exemplo.com"
                className="w-full bg-[#1c2130] border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all placeholder:text-slate-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Campo Senha */}
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-sm font-semibold text-slate-400">Senha</label>
              <Link
                to="/forgot-password"
                className="text-xs font-bold text-slate-500 hover:text-indigo-400 transition-colors"
              >
                Esqueceu a senha?
              </Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-[#1c2130] border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all placeholder:text-slate-700"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* Botão de Entrar */}
          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-400 text-[#0f111a] font-black py-4 rounded-2xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <LogIn size={20} />
            Entrar na Conta
          </button>
        </form>
      </div>

      {/* Footer */}
      <p className="mt-8 text-slate-500 text-sm font-medium">
        Não tem uma conta?{' '}
        <Link to="/register" className="text-indigo-400 font-bold hover:underline transition-all">
          Criar conta agora
        </Link>
      </p>
    </div>
  );
}