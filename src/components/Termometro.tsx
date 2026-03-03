import React from 'react';

// Definimos qué datos necesita recibir el componente
interface TermometroProps {
    promedio: number | string;
    porcentaje: number;
    status: {
        label: string;
        color: string;
    };
}

const Termometro: React.FC<TermometroProps> = ({ promedio, porcentaje, status }) => {
    return (
        <div className="bg-[#1e1e1e] p-6 rounded-xl shadow-lg border border-gray-800 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-400 text-sm font-medium">Termómetro de Agenda</h3>
                <span className="text-xs font-mono px-2 py-1 bg-black rounded text-gray-300">
                    {Number(promedio) > 0 ? '+' : ''}{promedio}
                </span>
            </div>

            {/* Contenedor de la barra */}
            <div className="relative h-4 w-full bg-gradient-to-r from-red-500 via-gray-400 to-emerald-500 rounded-full mb-6">
                {/* Aguja indicadora */}
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-1.5 h-8 bg-white border border-black shadow-xl transition-all duration-700 ease-out rounded-full"
                    style={{ left: `${porcentaje}%`, transform: 'translate(-50%, -50%)' }}
                />
            </div>

            {/* Estado e Insight */}
            <div className="text-center">
                <p className="text-lg font-bold uppercase tracking-wider" style={{ color: status.color }}>
                    {status.label}
                </p>
                <p className="text-gray-500 text-xs mt-1 italic">
                    Basado en el análisis de UMIs personalizadas
                </p>
            </div>
        </div>
    );
};

export default Termometro;
