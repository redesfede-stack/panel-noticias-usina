import { NewsItem } from '../types';

/**
 * Motor de Cálculo y Aprendizaje de USINA
 * Este archivo centraliza la lógica de valoración, el estado del termómetro y el diagnóstico de rendimiento.
 */

export interface TermometroStatus {
    label: string;
    color: string;
}

export interface TermometroData {
    valor: string;
    porcentaje: number;
    status: TermometroStatus;
}

interface FeedbackEntry {
    noticiaId: number;
    valorOriginal: number;
    valorHumano: number;
    timestamp: Date;
}

interface PerformanceLog {
    noticiaId?: number;
    operacion: string;
    duracionMs: number;
    timestamp: Date;
}

const UsinaCerebro = {
    // Historial de correcciones para optimizar futuras valoraciones
    feedbackLoop: [] as FeedbackEntry[],

    // Registro de rendimiento para auditoría de la Skill Test Analyst
    performanceLogs: [] as PerformanceLog[],

    /**
     * Registra una corrección humana para perfeccionar la IA
     */
    aprenderDeCorreccion: function (noticiaId: number, valorOriginal: number, valorHumano: number): void {
        this.feedbackLoop.push({
            noticiaId,
            valorOriginal,
            valorHumano,
            timestamp: new Date()
        });
        console.log(`🧠 Sistema optimizado: Aprendiendo de la diferencia ${valorOriginal} -> ${valorHumano}`);
    },

    /**
     * Registra métricas de tiempo para detectar cuellos de botella
     */
    registrarRendimiento: function (operacion: string, duracionMs: number, noticiaId?: number): void {
        this.performanceLogs.push({
            noticiaId,
            operacion,
            duracionMs,
            timestamp: new Date()
        });
    },

    /**
     * Transforma el promedio (-2 a 2) en un porcentaje (0 a 100) para la aguja
     */
    calcularPorcentaje: function (promedio: number | string): number {
        const valor = typeof promedio === 'string' ? parseFloat(promedio) : promedio;
        const normalizado = valor + 2; // De [-2, 2] a [0, 4]
        const porcentaje = normalizado * 25; // De [0, 4] a [0, 100]

        // Asegurar que el valor esté entre 0 y 100
        return Math.max(0, Math.min(100, porcentaje));
    },

    /**
     * Calcula el estado completo del Termómetro a partir de una lista de UMIs
     */
    calcularTermometro: function (newsList: NewsItem[]): TermometroData {
        if (!newsList || newsList.length === 0) {
            return {
                valor: "0.00",
                porcentaje: 50,
                status: this.obtenerClasificacion(0)
            };
        }

        const suma = newsList.reduce((acc, umi) => acc + (umi.ratingValue || 0), 0);
        const promedio = suma / newsList.length;

        return {
            valor: promedio.toFixed(2),
            porcentaje: this.calcularPorcentaje(promedio),
            status: this.obtenerClasificacion(promedio)
        };
    },

    /**
     * Define la etiqueta y el color según el puntaje obtenido
     */
    obtenerClasificacion: function (promedio: number): TermometroStatus {
        if (promedio >= 1) return { label: 'Positivo', color: '#10b981' };
        if (promedio <= -1) return { label: 'Negativo', color: '#f87171' };
        return { label: 'Neutro', color: '#9ca3af' };
    },

    /**
     * Exporta el estado completo para que la Skill "Test Analyst" genere el informe
     */
    exportarResultadosPrueba: function (newsList: NewsItem[]) {
        const stats = this.calcularTermometro(newsList);
        return {
            timestamp: new Date().toISOString(),
            metrics: stats,
            performance: this.performanceLogs,
            feedbackLoopSize: this.feedbackLoop.length,
            history: this.feedbackLoop,
            config: {
                version: "2.1-QA",
                rango: "[-2, 2]",
                formula: "(x + 2) * 25"
            }
        };
    }
};

export default UsinaCerebro;