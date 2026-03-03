
import React, { useState, useCallback } from 'react';
import { NewsItem, User, Rating, ToastMessage } from '../types';
import { PROVINCIAS, AREAS_GOBIERNO } from '../constants';
import { PlusCircle, Upload } from './icons';
import Thermometer from './Thermometer';
import { analyzeSentiment } from '../services/geminiService';

interface FrontPanelProps {
  addNewsItem: (item: Omit<NewsItem, 'id' | 'date' | 'isPublished'>) => void;
  currentUser: User;
  newsItems: NewsItem[];
  showToast: (message: ToastMessage) => void;
  onBulkProcess: (file: File) => void;
}

const FrontPanel: React.FC<FrontPanelProps> = ({ addNewsItem, currentUser, newsItems, showToast, onBulkProcess }) => {
  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newMedium, setNewMedium] = useState("");
  const [newProvince, setNewProvince] = useState("");
  const [newGovernmentArea, setNewGovernmentArea] = useState("");
  const [newRating, setNewRating] = useState<Rating>("neutral");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const ratingCounts = React.useMemo(() => {
    return newsItems.reduce(
      (acc, item) => {
        acc[item.rating]++;
        return acc;
      },
      { positive: 0, negative: 0, neutral: 0 }
    );
  }, [newsItems]);

  const totalItems = newsItems.length;
  const sentimentScore = totalItems > 0 ? (ratingCounts.positive - ratingCounts.negative) / totalItems : 0;

  const clearForm = useCallback(() => {
    setNewTitle("");
    setNewUrl("");
    setNewMedium("");
    setNewProvince("");
    setNewGovernmentArea("");
    setNewRating("neutral");
  }, []);

  const handleAddNewsItem = () => {
    if (newTitle && newUrl && newMedium && newProvince && newGovernmentArea) {
      addNewsItem({
        title: newTitle,
        url: newUrl,
        medium: newMedium,
        province: newProvince,
        governmentArea: newGovernmentArea,
        rating: newRating,
        createdBy: currentUser.username,
      });
      clearForm();
    } else {
      showToast({ title: "❌ Error", description: "Por favor, complete todos los campos obligatorios.", variant: "destructive" });
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleProcessFile = () => {
    if (selectedFile) {
      onBulkProcess(selectedFile);
      setSelectedFile(null);
      // Clear the file input visually
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    } else {
      showToast({ title: "❌ No hay archivo", description: "Por favor, seleccione un archivo CSV para procesar.", variant: "destructive" });
    }
  };


  const handleAnalyzeSentiment = async () => {
    if (!newTitle) {
      showToast({ title: " Título requerido", description: "Por favor, ingrese un título para analizar.", variant: "info" });
      return;
    }
    setIsAnalyzing(true);
    const result = await analyzeSentiment(newTitle);
    if (result) {
      setNewRating(result);
      showToast({ title: "🤖 Análisis completo", description: `El sentimiento fue clasificado como '${result}'.`, variant: "success" });
    } else {
      showToast({ title: "❌ Error de análisis", description: "No se pudo analizar el sentimiento.", variant: "destructive" });
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      {/* Indicador Gráfico */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">📊 Indicador de Sentimiento General</h2>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex-shrink-0">
            <Thermometer value={sentimentScore} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            <div className="p-4 bg-green-50 rounded-xl border border-green-200 text-center"><p className="text-3xl font-bold text-green-600">{ratingCounts.positive}</p><p className="text-sm font-semibold text-green-700">Positivas</p></div>
            <div className="p-4 bg-red-50 rounded-xl border border-red-200 text-center"><p className="text-3xl font-bold text-red-600">{ratingCounts.negative}</p><p className="text-sm font-semibold text-red-700">Negativas</p></div>
            <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200 text-center"><p className="text-3xl font-bold text-yellow-600">{ratingCounts.neutral}</p><p className="text-sm font-semibold text-yellow-700">Neutras</p></div>
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-center"><p className="text-3xl font-bold text-blue-600">{totalItems}</p><p className="text-sm font-semibold text-blue-700">Total</p></div>
          </div>
        </div>
      </div>
      
      {/* Procesar Archivo */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">📋 Cargar y Valorar Noticias desde Archivo</h2>
          <div className="flex flex-col sm:flex-row items-end gap-4">
              <div className="flex-grow w-full">
                  <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">
                    Subir archivo CSV (con una URL por línea)
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileChange}
                    className="mt-1 block w-full text-sm text-gray-500
                               file:mr-4 file:py-2 file:px-4
                               file:rounded-md file:border-0
                               file:text-sm file:font-semibold
                               file:bg-indigo-50 file:text-indigo-700
                               hover:file:bg-indigo-100"
                  />
                  {selectedFile && <p className="text-xs text-gray-600 mt-2">Archivo seleccionado: {selectedFile.name}</p>}
              </div>
              <button onClick={handleProcessFile} className="w-full sm:w-auto flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                  <Upload className="mr-2 h-4 w-4" /> Procesar Archivo
              </button>
          </div>
      </div>


      {/* Agregar Nueva Noticia Manualmente */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">➕ Agregar Noticia Manualmente</h2>
        <div className="grid gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título *</label>
            <input id="title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Ingrese el título completo" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label htmlFor="url" className="block text-sm font-medium text-gray-700">URL *</label><input id="url" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="https://ejemplo.com/noticia" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/></div>
            <div><label htmlFor="medium" className="block text-sm font-medium text-gray-700">Medio *</label><input id="medium" value={newMedium} onChange={(e) => setNewMedium(e.target.value)} placeholder="Nombre del portal" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label htmlFor="province" className="block text-sm font-medium text-gray-700">Provincia *</label><select id="province" value={newProvince} onChange={(e) => setNewProvince(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"><option value="">Seleccionar provincia</option>{PROVINCIAS.map((p) => <option key={p} value={p}>{p}</option>)}</select></div>
            <div><label htmlFor="governmentArea" className="block text-sm font-medium text-gray-700">Área de Gobierno *</label><select id="governmentArea" value={newGovernmentArea} onChange={(e) => setNewGovernmentArea(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"><option value="">Seleccionar área</option>{AREAS_GOBIERNO.map((a) => <option key={a} value={a}>{a}</option>)}</select></div>
          </div>
          <div>
            <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Valoración *</label>
            <div className="flex items-center gap-2 mt-1">
              <select id="rating" value={newRating} onChange={(e) => setNewRating(e.target.value as Rating)} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                <option value="positive">✅ Positiva</option><option value="negative">❌ Negativa</option><option value="neutral">⚪ Neutra</option>
              </select>
              <button onClick={handleAnalyzeSentiment} disabled={isAnalyzing} className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 whitespace-nowrap">
                {isAnalyzing ? 'Analizando...' : 'Analizar con IA'}
              </button>
            </div>
          </div>
          <button onClick={handleAddNewsItem} className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"><PlusCircle className="mr-2 h-5 w-5" />Agregar Noticia</button>
        </div>
      </div>
    </div>
  );
};

export default FrontPanel;
