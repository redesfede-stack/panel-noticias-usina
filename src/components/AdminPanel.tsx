
import React, { useState } from 'react';
import { User, ToastMessage } from '../types';
import { Trash2 } from './icons';

interface AdminPanelProps {
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  deleteUser: (id: number) => void;
  showToast: (message: ToastMessage) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ users, addUser, deleteUser, showToast }) => {
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newIsAdmin, setNewIsAdmin] = useState(false);

  const handleAddUser = () => {
    if (!newUsername || !newPassword) {
      showToast({ title: "❌ Campos requeridos", description: "Por favor, complete todos los campos.", variant: "destructive" });
      return;
    }
    if (users.some(u => u.username === newUsername)) {
        showToast({ title: "❌ Usuario existente", description: "Ya existe un usuario con ese nombre.", variant: "destructive" });
        return;
    }
    addUser({ username: newUsername, password: newPassword, isAdmin: newIsAdmin });
    setNewUsername('');
    setNewPassword('');
    setNewIsAdmin(false);
    showToast({ title: "✅ Usuario agregado", description: "El nuevo usuario ha sido creado.", variant: "success" });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-6">👥 Panel de Administración</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add User Form */}
        <div className="lg:col-span-1 space-y-4 p-6 bg-gray-50 rounded-lg border">
          <h3 className="text-lg font-semibold">Agregar Nuevo Usuario</h3>
          <div><label className="block text-sm font-medium text-gray-700">Nombre de Usuario *</label><input type="text" value={newUsername} onChange={e => setNewUsername(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"/></div>
          <div><label className="block text-sm font-medium text-gray-700">Contraseña *</label><input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"/></div>
          <div className="flex items-center"><input type="checkbox" id="isAdmin" checked={newIsAdmin} onChange={e => setNewIsAdmin(e.target.checked)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded"/><label htmlFor="isAdmin" className="ml-2 block text-sm text-gray-900">Otorgar privilegios de administrador</label></div>
          <button onClick={handleAddUser} className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Crear Usuario</button>
        </div>
        
        {/* Users List */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Usuarios Existentes ({users.length})</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>{user.isAdmin ? 'Administrador' : 'Editor'}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.username !== 'admin' ? 
                        <button onClick={() => deleteUser(user.id)} className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm"><Trash2 className="h-4 w-4"/>Eliminar</button> :
                        <span className="text-xs text-gray-500">Protegido</span>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
