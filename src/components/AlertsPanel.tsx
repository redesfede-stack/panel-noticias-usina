
import React, { useState, useMemo } from 'react';
import { NewsItem, Rating } from '../types';
import { PROVINCIAS } from '../constants';

interface AlertsPanelProps {
  newsItems: NewsItem[];
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ newsItems }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState<string>("all");

  const publishedNews = useMemo(() => {
    return newsItems
      .filter(item => item.isPublished)
      .sort((a, b) => (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0))
      .filter(item => 
        (item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.medium.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterRating === 'all' || item.rating === filterRating)
      );
  }, [newsItems, searchTerm, filterRating]);

  const getRatingBadge = (rating: Rating) => ({
    positive: "border-green-500", negative: "border-red-500", neutral: "border-yellow-500"
  })[rating];

  const getTimeAgo = (date?: Date) => {
    if (!date) return '';
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `Hace ${Math.floor(interval)} años`;
    interval = seconds / 2592000;
    if (interval > 1) return `Hace ${Math.floor(interval)} meses`;
    interval = seconds / 86400;
    if (interval > 1) return `Hace ${Math.floor(interval)} días`;
    interval = seconds / 3600;
    if (interval > 1) return `Hace ${Math.floor(interval)} horas`;
    interval = seconds / 60;
    if (interval > 1) return `Hace ${Math.floor(interval)} minutos`;
    return "Recién";
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-bold text-gray-800 mb-4">🚨 Alertas de Noticias Publicadas ({publishedNews.length})</h2>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input type="text" placeholder="Buscar en alertas..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"/>
        <select value={filterRating} onChange={e => setFilterRating(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 rounded-md"><option value="all">Todas las valoraciones</option><option value="positive">✅ Positivas</option><option value="negative">❌ Negativas</option><option value="neutral">⚪ Neutras</option></select>
      </div>

      <div className="space-y-4">
        {publishedNews.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No hay alertas de noticias publicadas.</div>
        ) : (
          publishedNews.map(item => (
            <div key={item.id} className={`p-4 bg-white rounded-lg shadow-sm border-l-4 ${getRatingBadge(item.rating)}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 mt-1">
                    <span>{item.medium}</span>
                    <span className="text-gray-300">|</span>
                    <span>{item.province}</span>
                    <span className="text-gray-300">|</span>
                    <span>{item.governmentArea}</span>
                  </div>
                </div>
                <div className="text-right ml-4 flex-shrink-0">
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">Ver noticia</a>
                  <p className="text-xs text-gray-500 mt-1">{getTimeAgo(item.publishedAt)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertsPanel;
