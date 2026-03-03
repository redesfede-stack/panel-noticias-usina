import React, { useState, useEffect } from 'react';
import { NewsItem, User, ToastMessage, Rating } from './types';
import { INITIAL_USERS } from './constants';
import * as sheetService from './services/sheetService';
import { analyzeSentiment } from './services/geminiService';
import UsinaCerebro from './services/usinaEngine';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import Termometro from './components/Termometro';
import Toast from './components/Toast';

export default function App() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadNews() {
      setIsLoading(true);
      const items = await sheetService.getNews();
      setNewsItems(items);
      setIsLoading(false);
    }
    loadNews();
  }, []);

  const showToast = (message: ToastMessage) => {
    setToast(message);
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const addNewsItem = async (newItemData: Omit<NewsItem, 'id' | 'date' | 'isPublished'>) => {
    const newItem = await sheetService.addNews(newItemData);
    if (newItem) {
      setNewsItems(prevItems => [newItem, ...prevItems]);
      showToast({ title: "✅ Noticia agregada", description: "La noticia ha sido guardada.", variant: "success" });
    } else {
      showToast({ title: "❌ Error", description: "No se pudo guardar la noticia.", variant: "destructive" });
    }
  };

  const handleBulkProcess = async (file: File) => {
    showToast({ title: "Procesando archivo...", description: "Analizando noticias, por favor espere.", variant: "info" });
    const text = await file.text();
    const urls = text.split('\n').map(line => line.trim()).filter(line => line.startsWith('http'));

    if (urls.length === 0) {
      showToast({ title: "❌ Archivo inválido", description: "No se encontraron URLs válidas en el archivo.", variant: "destructive" });
      return;
    }

    let processedCount = 0;

    for (const url of urls) {
      try {
        const mockTitle = `Noticia desde ${new URL(url).hostname}`;

        // ⏱️ Inicio del cronómetro para la Skill Test Analyst
        const t0 = performance.now();

        const sentiment = await analyzeSentiment(mockTitle);

        // 🏁 Fin del cronómetro y cálculo de duración
        const t1 = performance.now();
        const duracion = t1 - t0;

        if (sentiment) {
          const newItemData = {
            title: mockTitle,
            url: url,
            medium: new URL(url).hostname,
            province: "A definir",
            governmentArea: "A definir",
            rating: sentiment as Rating,
            ratingValue: sentiment === 'positive' ? 1.5 : (sentiment === 'negative' ? -1.5 : 0),
            createdBy: currentUser!.username,
            requiresReview: true,
          };

          const addedItem = await sheetService.addNews(newItemData);

          if (addedItem) {
            // 📝 Registro de rendimiento en el motor UsinaCerebro
            UsinaCerebro.registrarRendimiento("Análisis Gemini", duracion, addedItem.id);

            setNewsItems(prev => [addedItem, ...prev]);
            processedCount++;
          }
        }
      } catch (error) {
        console.error(`Error procesando URL ${url}:`, error);
      }
    }

    showToast({ title: "✅ Proceso completado", description: `Se procesaron y agregaron ${processedCount} de ${urls.length} noticias.`, variant: "success" });
  };

  const updateNewsItem = async (updatedItem: NewsItem) => {
    const success = await sheetService.updateNews(updatedItem);
    if (success) {
      setNewsItems(newsItems.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
    }
  };

  const deleteNewsItem = async (id: number) => {
    const success = await sheetService.deleteNews(id);
    if (success) {
      setNewsItems(newsItems.filter((item) => item.id !== id));
    }
  };

  const addUser = (newUser: Omit<User, 'id'>) => {
    const fullNewUser: User = { ...newUser, id: Date.now() };
    setUsers([...users, fullNewUser]);
  };

  const deleteUser = (userId: number) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  const downloadDatabase = () => {
    try {
      const BOM = "\uFEFF";
      const headers = ["Título", "Link", "Medio", "Provincia", "Área de Gobierno", "Valoración", "Fecha Creación", "Publicado"];
      const csvRows = newsItems.map((item) => [
        `"${item.title.replace(/"/g, '""')}"`,
        item.url,
        `"${item.medium.replace(/"/g, '""')}"`,
        item.province,
        item.governmentArea,
        item.rating,
        item.date.toISOString(),
        item.isPublished ? 'Sí' : 'No'
      ]);
      const csvContent = BOM + [headers.join(","), ...csvRows.map((row) => row.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      const timestamp = new Date().toISOString().split("T")[0];
      link.setAttribute("href", url);
      link.setAttribute("download", `Base_Datos_Noticias_${timestamp}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast({ title: "📊 Base de datos descargada", description: `Archivo CSV generado con ${newsItems.length} noticias.`, variant: "success" });
    } catch (error) {
      showToast({ title: "❌ Error en la descarga", description: "No se pudo generar el archivo.", variant: "destructive" });
    }
  };

  const handleLogin = (username: string, password: string) => {
    const user = users.find((u) => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      showToast({ title: "✅ Inicio de sesión exitoso", description: `¡Bienvenido al sistema, ${user.username}!`, variant: "success" });
    } else {
      showToast({ title: "❌ Error de autenticación", description: "Credenciales incorrectas.", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    showToast({ title: "👋 Sesión cerrada", description: "Has cerrado sesión exitosamente.", variant: "info" });
  };

  if (!currentUser) {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando datos...</div>
  }

  // Cálculo de los datos del termómetro basados en la lista real de noticias
  const datosTermometro = UsinaCerebro.calcularTermometro(newsItems);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-7xl px-4 py-8 space-y-8">
        {/* Termómetro de Agenda */}
        <div className="flex justify-center">
          <Termometro
            promedio={Number(datosTermometro.valor)}
            porcentaje={datosTermometro.porcentaje}
            status={datosTermometro.status}
          />
        </div>

        <Dashboard
          currentUser={currentUser}
          newsItems={newsItems}
          users={users}
          onLogout={handleLogout}
          onAddNewsItem={addNewsItem}
          onUpdateNewsItem={updateNewsItem}
          onDeleteNewsItem={deleteNewsItem}
          onDownloadDatabase={downloadDatabase}
          onAddUser={addUser}
          onDeleteUser={deleteUser}
          onBulkProcess={handleBulkProcess}
          showToast={showToast}
        />
      </div>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}