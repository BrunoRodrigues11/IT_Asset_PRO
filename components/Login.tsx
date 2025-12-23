import React, { useState } from 'react';
import { Laptop2, Lock, User, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (success: boolean) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple hardcoded credentials for demonstration
    // In a real scenario, this would check against a backend or encrypted storage
    if (username === 'admin' && password === 'admin') {
      onLogin(true);
    } else {
      setError('Usuário ou senha incorretos.');
      setTimeout(() => setError(''), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-slate-800 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 mb-4 shadow-lg">
            <Laptop2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Estoque TI</h1>
          <p className="text-slate-400 text-sm">Controle de Ativos e Periféricos</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Usuário</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 text-slate-900 outline-none transition"
                  placeholder="Digite seu usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 text-slate-900 outline-none transition"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm text-center font-medium animate-pulse">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-bold transition-all transform hover:scale-[1.02]"
            >
              Entrar no Sistema
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">
              Acesso padrão: <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-600">admin</span> / <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-600">admin</span>
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-slate-500 text-xs">
        &copy; {new Date().getFullYear()} Sistema de Gestão de Ativos de TI
      </div>
    </div>
  );
};