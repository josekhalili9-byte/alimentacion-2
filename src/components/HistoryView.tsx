import React from 'react';
import { motion } from 'motion/react';
import { FoodAnalysis } from '../types';
import { Clock, ChevronRight } from 'lucide-react';

interface HistoryViewProps {
  history: FoodAnalysis[];
  onSelectItem: (item: FoodAnalysis) => void;
}

export default function HistoryView({ history, onSelectItem }: HistoryViewProps) {
  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
        <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
          <Clock size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Historial Vacío</h2>
        <p className="text-slate-500">Aún no has escaneado ningún alimento. ¡Ve a la pestaña de escáner para empezar!</p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 pb-24"
    >
      <h2 className="text-2xl font-bold text-slate-800 mb-6 px-2">Tu Historial</h2>
      
      <div className="space-y-3">
        {history.map((item, index) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelectItem(item)}
            className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-grow">
              <h3 className="font-bold text-slate-800 capitalize truncate">{item.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-slate-500">{item.calories} kcal</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  item.recommendation === 'saludable' ? 'bg-emerald-100 text-emerald-700' :
                  item.recommendation === 'moderado' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {item.healthScore}/10
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {new Date(item.date).toLocaleDateString()}
              </p>
            </div>
            
            <div className="text-slate-300">
              <ChevronRight size={20} />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
