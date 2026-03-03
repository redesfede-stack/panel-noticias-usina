
import React, { useState } from 'react';

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (username && password) {
      setIsLoading(true);
      setTimeout(() => {
        onLogin(username, password);
        setIsLoading(false);
      }, 500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleLogin();
    }
  };
  
  const fillAdminCredentials = () => {
    setUsername("admin");
    setPassword("admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 space-y-6 border border-gray-200">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-white text-3xl">📊</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Panel de Control</h2>
          <p className="text-gray-600 mt-2">Sistema de Gestión de Noticias</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="text-sm font-semibold text-gray-700">Nombre de Usuario</label>
            <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} onKeyPress={handleKeyPress} placeholder="Ingrese su usuario" disabled={isLoading}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-semibold text-gray-700">Contraseña</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyPress={handleKeyPress} placeholder="Ingrese su contraseña" disabled={isLoading}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <button onClick={handleLogin} disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Credenciales de prueba</span></div>
        </div>

        <div className="text-center">
            <button onClick={fillAdminCredentials} disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100"
            >
              👑 Usar credenciales de Administrador
            </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
