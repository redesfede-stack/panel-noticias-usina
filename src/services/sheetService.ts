import { NewsItem } from '../types';
import { SAMPLE_NEWS } from '../constants';

// --- Simulación de una Base de Datos (Google Sheet) ---
// En una aplicación real, estas funciones harían llamadas `fetch` a tu API backend.
// El backend se encargaría de interactuar con la API de Google Sheets.

let newsDatabase: NewsItem[] = [...SAMPLE_NEWS];

// Simula la latencia de la red
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getNews = async (): Promise<NewsItem[]> => {
    console.log("SERVICE: Obteniendo todas las noticias...");
    await delay(500);
    // Devuelve una copia ordenada por fecha, la más reciente primero
    return [...newsDatabase].sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const addNews = async (newItemData: Omit<NewsItem, 'id' | 'date' | 'isPublished'>): Promise<NewsItem | null> => {
    console.log("SERVICE: Agregando nueva noticia...", newItemData);
    await delay(300);
    const newItem: NewsItem = {
        ...newItemData,
        id: Date.now(),
        date: new Date(),
        isPublished: false,
    };
    newsDatabase.unshift(newItem); // Agrega al principio
    return newItem;
};

export const updateNews = async (updatedItem: NewsItem): Promise<boolean> => {
    console.log("SERVICE: Actualizando noticia con ID:", updatedItem.id);
    await delay(300);
    const index = newsDatabase.findIndex(item => item.id === updatedItem.id);
    if (index !== -1) {
        newsDatabase[index] = updatedItem;
        return true;
    }
    return false;
};

export const deleteNews = async (id: number): Promise<boolean> => {
    console.log("SERVICE: Eliminando noticia con ID:", id);
    await delay(300);
    const initialLength = newsDatabase.length;
    newsDatabase = newsDatabase.filter(item => item.id !== id);
    return newsDatabase.length < initialLength;
};
