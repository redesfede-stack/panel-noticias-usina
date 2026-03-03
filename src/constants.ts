
import { NewsItem, User } from './types';

export const PROVINCIAS = [
  "CABA", "Buenos Aires", "Catamarca", "Chaco", "Chubut", "Córdoba", "Corrientes", "Entre Ríos",
  "Formosa", "Jujuy", "La Pampa", "La Rioja", "Mendoza", "Misiones", "Neuquén", "Río Negro",
  "Salta", "San Juan", "San Luis", "Santa Cruz", "Santa Fe", "Santiago del Estero", "Tierra del Fuego", "Tucumán",
].sort();

export const AREAS_GOBIERNO = [
  "Agricultura y Ganadería", "Ambiente y Desarrollo Sostenible", "Andis", "Ciencia y Tecnología", "Congreso",
  "Cultura", "Defensa", "Desarrollo Social", "Economía", "Educación", "Elecciones", "Energía",
  "Industria y Comercio", "Interior", "Jefatura de Gabinete", "Justicia y Derechos Humanos", "Obras Públicas",
  "Presidente", "Relaciones Exteriores", "Salud", "Seguridad", "Trabajo", "Transporte", "Turismo", "Vivienda", "Voceria",
].sort();

export const SAMPLE_NEWS: NewsItem[] = [
    { id: 1, title: "Nueva inversión en infraestructura hospitalaria por $50 millones", url: "https://example.com/noticia1", medium: "Diario Nacional", province: "Buenos Aires", governmentArea: "Salud", rating: "positive", createdBy: "admin", date: new Date(2024, 6, 10), isPublished: true, publishedAt: new Date(2024, 6, 10, 14, 30), },
    { id: 2, title: "Recorte presupuestario del 15% en educación pública", url: "https://example.com/noticia2", medium: "Portal Educativo", province: "Córdoba", governmentArea: "Educación", rating: "negative", createdBy: "admin", date: new Date(2024, 6, 9), isPublished: false, },
    { id: 3, title: "Inauguración del Centro de Innovación Tecnológica más grande del país", url: "https://example.com/noticia3", medium: "Tech News Argentina", province: "Santa Fe", governmentArea: "Ciencia y Tecnología", rating: "positive", createdBy: "admin", date: new Date(2024, 6, 8), isPublished: true, publishedAt: new Date(2024, 6, 8, 16, 45), },
    { id: 4, title: "Debate parlamentario sobre reforma tributaria genera controversia", url: "https://example.com/noticia4", medium: "Económico Hoy", province: "CABA", governmentArea: "Economía", rating: "neutral", createdBy: "admin", date: new Date(2024, 6, 7), isPublished: false, },
    { id: 5, title: "Programa de viviendas sociales beneficiará a 10,000 familias", url: "https://example.com/noticia5", medium: "Social Today", province: "Mendoza", governmentArea: "Vivienda", rating: "positive", createdBy: "admin", date: new Date(2024, 6, 6), isPublished: true, publishedAt: new Date(2024, 6, 6, 10, 15), },
];

export const INITIAL_USERS: User[] = [
    { id: 1, username: "admin", password: "admin", isAdmin: true },
    { id: 2, username: "editor", password: "editor123", isAdmin: false },
];
