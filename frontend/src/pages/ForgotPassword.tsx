import { Mail, ArrowLeft, Send } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export function ForgotPassword() {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-[#0f111a] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#161925] border border-slate-800 p-8 rounded-3xl shadow-2xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Recuperar senha</h2>
          <p className="text-slate-500 text-sm">
            Digite seu e-mail para receber as instruções de recuperação.
          </p>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-400 ml-1">E-mail</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input
                type="email"
                placeholder="seu@exemplo.com"
                className="w-full bg-[#1c2130] border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-indigo-500/50 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <button className="w-full bg-indigo-500 hover:bg-indigo-400 text-[#0f111a] font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2">
            <Send size={18} />
            Enviar Instruções
          </button>
        </form>

        <Link
          to="/login"
          className="mt-6 flex items-center justify-center gap-2 w-full text-sm font-bold text-slate-500 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar para o login
        </Link>
      </div>
    </div>
  );
}