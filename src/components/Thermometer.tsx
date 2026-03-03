
import React from 'react';

const Thermometer = ({ value }: { value: number }) => {
  const clampedValue = Math.max(-1, Math.min(1, value));
  const angle = clampedValue * 45;

  const getColor = () => {
    if (clampedValue > 0.3) return "#22c55e"; // Green
    if (clampedValue < -0.3) return "#ef4444"; // Red
    return "#eab308"; // Yellow
  };

  const getDescription = () => {
    if (clampedValue > 0.5) return "Muy Positivo";
    if (clampedValue > 0.2) return "Positivo";
    if (clampedValue > -0.2) return "Neutral";
    if (clampedValue > -0.5) return "Negativo";
    return "Muy Negativo";
  };

  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="120" viewBox="0 0 200 120" className="mb-2">
        {/* Gradient Definition */}
        <defs>
          <linearGradient id="thermometerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="50%" stopColor="#eab308" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>
        
        {/* Scale Base */}
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#e5e7eb" strokeWidth="20" />
        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#thermometerGradient)" strokeWidth="16" />
        
        {/* Ticks */}
        <line x1="20" y1="100" x2="20" y2="90" stroke="#9ca3af" strokeWidth="2" />
        <line x1="100" y1="20" x2="100" y2="30" stroke="#9ca3af" strokeWidth="2" />
        <line x1="180" y1="100" x2="180" y2="90" stroke="#9ca3af" strokeWidth="2" />

        {/* Needle */}
        <g transform={`rotate(${angle}, 100, 100)`}>
          <line x1="100" y1="100" x2="100" y2="40" stroke="#1f2937" strokeWidth="3" />
        </g>
        <circle cx="100" cy="100" r="8" fill="#1f2937" />
        <circle cx="100" cy="100" r="4" fill="#f9fafb" />
      </svg>
      <div className="text-center -mt-4">
        <p className="text-3xl font-bold mb-1" style={{ color: getColor() }}>
          {clampedValue.toFixed(2)}
        </p>
        <p className="text-md font-semibold text-gray-700">{getDescription()}</p>
        <p className="text-xs text-gray-500">Índice de Sentimiento</p>
      </div>
    </div>
  );
};

export default Thermometer;
