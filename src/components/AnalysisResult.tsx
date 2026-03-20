import React from 'react';
import { motion } from 'motion/react';
import { FoodAnalysis } from '../types';
import { Flame, Droplet, Activity, Wheat, HeartPulse, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface AnalysisResultProps {
  data: FoodAnalysis;
  onReset?: () => void;
}

export default function AnalysisResult({ data, onReset }: AnalysisResultProps) {
  const getRecommendationColor = () => {
    switch (data.recommendation) {
      case 'saludable': return 'text-emerald-500 bg-emerald-50 border-emerald-200';
      case 'moderado': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'poco saludable': return 'text-red-500 bg-red-50 border-red-200';
      default: return 'text-slate-500 bg-slate-50 border-slate-200';
    }
  };

  const getRecommendationIcon = () => {
    switch (data.recommendation) {
      case 'saludable': return <CheckCircle size={24} />;
      case 'moderado': return <AlertTriangle size={24} />;
      case 'poco saludable': return <XCircle size={24} />;
      default: return null;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-emerald-500';
    if (score >= 5) return 'text-yellow-500';
    return 'text-red-500';
  };

  const maxMacro = Math.max(data.protein, data.fat, data.carbs, 1); // Avoid division by zero

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto space-y-6 pb-24"
    >
      {/* Header Image & Title */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
        <div className="h-48 w-full relative">
          <img src={data.imageUrl} alt={data.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
            <h2 className="text-2xl font-bold text-white capitalize drop-shadow-md">{data.name}</h2>
            <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-full bg-white shadow-lg ${getScoreColor(data.healthScore)}`}>
              <span className="text-xl font-black leading-none">{data.healthScore}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">/10</span>
            </div>
          </div>
        </div>
        
        <div className="p-5">
          <div className={`flex items-center gap-3 p-4 rounded-2xl border ${getRecommendationColor()}`}>
            {getRecommendationIcon()}
            <div>
              <p className="text-sm font-bold uppercase tracking-wide opacity-80">Recomendación</p>
              <p className="text-lg font-semibold capitalize">{data.recommendation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Calories Card */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center">
            <Flame size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Calorías Estimadas</p>
            <p className="text-3xl font-bold text-slate-800">{data.calories} <span className="text-lg text-slate-400 font-normal">kcal</span></p>
          </div>
        </div>
      </div>

      {/* Macros Grid */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Macronutrientes</h3>
        <div className="space-y-5">
          
          {/* Protein */}
          <div>
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="flex items-center gap-2 text-blue-600"><Activity size={16} /> Proteínas</span>
              <span className="text-slate-700">{data.protein}g</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(data.protein / maxMacro) * 100}%` }}
                className="h-full bg-blue-500 rounded-full"
              />
            </div>
          </div>

          {/* Carbs */}
          <div>
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="flex items-center gap-2 text-amber-600"><Wheat size={16} /> Carbohidratos</span>
              <span className="text-slate-700">{data.carbs}g</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(data.carbs / maxMacro) * 100}%` }}
                className="h-full bg-amber-500 rounded-full"
              />
            </div>
          </div>

          {/* Fat */}
          <div>
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="flex items-center gap-2 text-rose-500"><Droplet size={16} /> Grasas</span>
              <span className="text-slate-700">{data.fat}g</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(data.fat / maxMacro) * 100}%` }}
                className="h-full bg-rose-500 rounded-full"
              />
            </div>
          </div>

          {/* Sugar */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="flex items-center gap-2 text-purple-600"><HeartPulse size={16} /> Azúcar</span>
              <span className="text-slate-700">{data.sugar}g</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((data.sugar / 50) * 100, 100)}%` }}
                className="h-full bg-purple-500 rounded-full"
              />
            </div>
          </div>

        </div>
      </div>

      {onReset && (
        <button 
          onClick={onReset}
          className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-semibold text-lg transition-colors"
        >
          Escanear Otro Alimento
        </button>
      )}
    </motion.div>
  );
}
