import React, { useState } from 'react';
import { NewsItem, User, ToastMessage } from '../types';
import FrontPanel from './FrontPanel';
import DatabasePanel from './DatabasePanel';
import AlertsPanel from './AlertsPanel';
import AdminPanel from './AdminPanel';

interface DashboardProps {
  currentUser: User;
  newsItems: NewsItem[];
  users: User[];
  onLogout: () => void;
  onAddNewsItem: (item: Omit<NewsItem, 'id' | 'date' | 'isPublished'>) => void;
  onUpdateNewsItem: (item: NewsItem) => void;
  onDeleteNewsItem: (id: number) => void;
  onDownloadDatabase: () => void;
  onAddUser: (user: Omit<User, 'id'>) => void;
  onDeleteUser: (id: number) => void;
  onBulkProcess: (file: File) => void;
  showToast: (message: ToastMessage) => void;
}

type Tab = 'front' | 'database' | 'alerts' | 'admin';

const Dashboard: React.FC<DashboardProps> = (props) => {
  const [activeTab, setActiveTab] = useState<Tab>('front');

  const tabs: { id: Tab; label: string; icon: string; adminOnly: boolean }[] = [
    { id: 'front', label: 'Panel Frontal', icon: '🏠', adminOnly: false },
    { id: 'database', label: 'Base de Datos', icon: '🗄️', adminOnly: false },
    { id: 'alerts', label: 'Alertas', icon: '🚨', adminOnly: false },
    { id: 'admin', label: 'Administración', icon: '👥', adminOnly: true },
  ];

  const { currentUser } = props;

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
            📊 Panel de Control
          </h1>
          <p className="text-gray-600 mt-2">Sistema de gestión y monitoreo de noticias.</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 font-medium hidden sm:inline">Bienvenido, {currentUser.username}</span>
          <button onClick={props.onLogout} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-4 sm:space-x-8" aria-label="Tabs">
            {tabs.filter(tab => !tab.adminOnly || currentUser.isAdmin).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                  ${activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === 'front' && <FrontPanel addNewsItem={props.onAddNewsItem} currentUser={currentUser} newsItems={props.newsItems} showToast={props.showToast} onBulkProcess={props.onBulkProcess} />}
          {activeTab === 'database' && <DatabasePanel {...props} />}
          {activeTab === 'alerts' && <AlertsPanel newsItems={props.newsItems} />}
          {activeTab === 'admin' && currentUser.isAdmin && <AdminPanel users={props.users} addUser={props.onAddUser} deleteUser={props.onDeleteUser} showToast={props.showToast} />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
