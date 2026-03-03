export type Rating = "positive" | "negative" | "neutral";

export type NewsItem = {
  id: number;
  title: string;
  url: string;
  medium: string;
  province: string; // Eje central: "Mendoza", "Córdoba", o "Nacional" 📍
  governmentArea: string; // Ministerio o área principal detectada 🏛️
  rating: Rating;
  ratingValue: number; // Escala Cuántica: -2 a +2 ⚖️
  createdBy: string;
  date: Date;
  isPublished: boolean;
  publishedAt?: Date;

  // --- Nuevos campos para Antigravity & Autoreparación ---
  secondaryTags?: string[]; // Otros ministerios o temas (ej: ["Salud", "Educación"]) 🏷️
  analysisNotes?: string;   // Razonamiento de la IA sobre la clasificación 🧠
  requiresReview: boolean;  // Flag para auditoría humana si hubo dudas o errores ⚠️
};

export type User = {
  id: number;
  username: string;
  password: string;
  isAdmin: boolean;
};

export type ToastMessage = {
  title: string;
  description: string;
  variant: 'success' | 'destructive' | 'info';
};