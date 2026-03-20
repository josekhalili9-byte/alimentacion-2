import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FoodAnalysis } from '../types';
import { Lock, ShieldAlert, Trash2, Edit3, Save, X } from 'lucide-react';

interface AdminViewProps {
  history: FoodAnalysis[];
  onUpdateHistory: (newHistory: FoodAnalysis[]) => void;
}

export default function AdminView({ history, onUpdateHistory }: AdminViewProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [editingItem, setEditingItem] = useState<FoodAnalysis | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '8718') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Clave incorrecta. Acceso denegado.');
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar este registro?')) {
      const newHistory = history.filter(item => item.id !== id);
      onUpdateHistory(newHistory);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('¿Estás seguro de borrar TODO el historial? Esta acción no se puede deshacer.')) {
      onUpdateHistory([]);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      const newHistory = history.map(item => item.id === editingItem.id ? editingItem : item);
      onUpdateHistory(newHistory);
      setEditingItem(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center h-[60vh] px-6"
      >
        <div className="w-20 h-20 bg-slate-900 text-white rounded-3xl flex items-center justify-center mb-6 shadow-lg">
          <ShieldAlert size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Panel de Administrador</h2>
        <p className="text-slate-500 mb-8 text-center">Ingresa la clave de acceso para gestionar los datos de la aplicación.</p>
        
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Lock size={20} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Clave de acceso"
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-2 px-2">{error}</p>}
          </div>
          <button 
            type="submit"
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-colors"
          >
            Ingresar
          </button>
        </form>
      </motion.div>
    );
  }

  if (editingItem) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-24">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Editar Registro</h2>
          <button onClick={() => setEditingItem(null)} className="p-2 bg-slate-100 rounded-full text-slate-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSaveEdit} className="space-y-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre del Alimento</label>
            <input 
              type="text" 
              value={editingItem.name} 
              onChange={e => setEditingItem({...editingItem, name: e.target.value})}
              className="w-full p-3 border border-slate-200 rounded-xl"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Calorías</label>
              <input 
                type="number" 
                value={editingItem.calories} 
                onChange={e => setEditingItem({...editingItem, calories: Number(e.target.value)})}
                className="w-full p-3 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Puntuación (1-10)</label>
              <input 
                type="number" 
                min="1" max="10"
                value={editingItem.healthScore} 
                onChange={e => setEditingItem({...editingItem, healthScore: Number(e.target.value)})}
                className="w-full p-3 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Proteínas (g)</label>
              <input 
                type="number" 
                value={editingItem.protein} 
                onChange={e => setEditingItem({...editingItem, protein: Number(e.target.value)})}
                className="w-full p-3 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Grasas (g)</label>
              <input 
                type="number" 
                value={editingItem.fat} 
                onChange={e => setEditingItem({...editingItem, fat: Number(e.target.value)})}
                className="w-full p-3 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Carbohidratos (g)</label>
              <input 
                type="number" 
                value={editingItem.carbs} 
                onChange={e => setEditingItem({...editingItem, carbs: Number(e.target.value)})}
                className="w-full p-3 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Azúcar (g)</label>
              <input 
                type="number" 
                value={editingItem.sugar} 
                onChange={e => setEditingItem({...editingItem, sugar: Number(e.target.value)})}
                className="w-full p-3 border border-slate-200 rounded-xl"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Recomendación</label>
            <select 
              value={editingItem.recommendation}
              onChange={e => setEditingItem({...editingItem, recommendation: e.target.value as any})}
              className="w-full p-3 border border-slate-200 rounded-xl"
            >
              <option value="saludable">Saludable</option>
              <option value="moderado">Moderado</option>
              <option value="poco saludable">Poco Saludable</option>
            </select>
          </div>
          <button type="submit" className="w-full py-4 bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 mt-4">
            <Save size={20} /> Guardar Cambios
          </button>
        </form>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-24 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Gestión de Datos</h2>
        <button 
          onClick={handleClearAll}
          disabled={history.length === 0}
          className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm font-bold disabled:opacity-50"
        >
          Borrar Todo
        </button>
      </div>

      <div className="space-y-3">
        {history.length === 0 ? (
          <p className="text-slate-500 text-center py-8">No hay registros para gestionar.</p>
        ) : (
          history.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow">
                <h3 className="font-bold text-slate-800 capitalize">{item.name}</h3>
                <p className="text-xs text-slate-500">{item.calories} kcal • {new Date(item.date).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => setEditingItem(item)}
                  className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Edit3 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
