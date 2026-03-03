
import React, { useState, useMemo } from 'react';
import { NewsItem, User, Rating, ToastMessage } from '../types';
import { PROVINCIAS, AREAS_GOBIERNO } from '../constants';
import { Download, Edit, Save, X, Trash2 } from './icons';

interface DatabasePanelProps {
  newsItems: NewsItem[];
  updateNewsItem: (item: NewsItem) => void;
  deleteNewsItem: (id: number) => void;
  downloadDatabase: () => void;
  currentUser: User;
  showToast: (message: ToastMessage) => void;
}

const DatabasePanel: React.FC<DatabasePanelProps> = ({ newsItems, updateNewsItem, deleteNewsItem, downloadDatabase, showToast }) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedItem, setEditedItem] = useState<Partial<NewsItem> | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ rating: 'all', province: 'all', area: 'all', status: 'all' });

  const filteredItems = useMemo(() => {
    return newsItems.filter(item => {
      const searchLower = searchTerm.toLowerCase();
      return (
        (item.title.toLowerCase().includes(searchLower) || item.medium.toLowerCase().includes(searchLower)) &&
        (filters.rating === 'all' || item.rating === filters.rating) &&
        (filters.province === 'all' || item.province === filters.province) &&
        (filters.area === 'all' || item.governmentArea === filters.area) &&
        (filters.status === 'all' || (filters.status === 'published' && item.isPublished) || (filters.status === 'draft' && !item.isPublished))
      );
    });
  }, [newsItems, searchTerm, filters]);

  const handleEdit = (item: NewsItem) => {
    setEditingId(item.id);
    setEditedItem({ ...item });
  };
  const handleCancel = () => { setEditingId(null); setEditedItem(null); };

  const handleSave = () => {
    if (editedItem && editingId) {
      const originalItem = newsItems.find(i => i.id === editingId);
      if (originalItem) {
        updateNewsItem({ ...originalItem, ...editedItem } as NewsItem);
        handleCancel();
        showToast({ title: "✅ Noticia actualizada", description: "Los cambios han sido guardados.", variant: "success" });
      }
    }
  };
  
  const handlePublishToggle = (item: NewsItem) => {
    const isNowPublished = !item.isPublished;
    updateNewsItem({ ...item, isPublished: isNowPublished, publishedAt: isNowPublished ? new Date() : undefined });
    showToast({ title: isNowPublished ? "📢 Noticia publicada" : "📝 Noticia despublicada", description: `La noticia ahora está en estado de ${isNowPublished ? 'publicada' : 'borrador'}.`, variant: "info" });
  };
  
  const getRatingBadge = (rating: Rating) => ({
    positive: "bg-green-100 text-green-800", negative: "bg-red-100 text-red-800", neutral: "bg-yellow-100 text-yellow-800"
  })[rating];
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-bold text-gray-800">🗄️ Base de Datos ({filteredItems.length} de {newsItems.length})</h2>
        <button onClick={downloadDatabase} className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"><Download className="h-4 w-4" />Descargar Excel</button>
      </header>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <input type="text" placeholder="Buscar..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="lg:col-span-2 mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        <select value={filters.rating} onChange={e => setFilters({...filters, rating: e.target.value})} className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 rounded-md"><option value="all">Valoración</option><option value="positive">Positiva</option><option value="negative">Negativa</option><option value="neutral">Neutra</option></select>
        <select value={filters.province} onChange={e => setFilters({...filters, province: e.target.value})} className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 rounded-md"><option value="all">Provincia</option>{PROVINCIAS.map(p => <option key={p} value={p}>{p}</option>)}</select>
        <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})} className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 rounded-md"><option value="all">Estado</option><option value="published">Publicada</option><option value="draft">Borrador</option></select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prov / Área</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valoración</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredItems.map(item => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === item.id ? <input value={editedItem?.title || ''} onChange={e => setEditedItem({...editedItem, title: e.target.value})} className="w-full px-2 py-1 border rounded"/> : <div className="text-sm font-medium text-gray-900">{item.title}</div>}
                  <div className="text-sm text-gray-500">{item.medium}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.province}<br/>{item.governmentArea}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === item.id ? <select value={editedItem?.rating} onChange={e => setEditedItem({...editedItem, rating: e.target.value as Rating})} className="px-2 py-1 border rounded"><option value="positive">Positiva</option><option value="negative">Negativa</option><option value="neutral">Neutra</option></select> : <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRatingBadge(item.rating)}`}>{item.rating}</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.isPublished ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>{item.isPublished ? 'Publicada' : 'Borrador'}</span></td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    {editingId === item.id ? (
                      <>
                        <button onClick={handleSave} className="text-green-600 hover:text-green-900"><Save className="h-5 w-5"/></button>
                        <button onClick={handleCancel} className="text-gray-600 hover:text-gray-900"><X className="h-5 w-5"/></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEdit(item)} className="text-indigo-600 hover:text-indigo-900"><Edit className="h-5 w-5"/></button>
                        <button onClick={() => handlePublishToggle(item)} className="text-blue-600 hover:text-blue-900">{item.isPublished ? '📝' : '📢'}</button>
                        <button onClick={() => deleteNewsItem(item.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-5 w-5"/></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredItems.length === 0 && <div className="text-center py-12 text-gray-500">No se encontraron noticias.</div>}
    </div>
  );
};

export default DatabasePanel;
