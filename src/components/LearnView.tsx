import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Flame, Activity, Wheat, Droplet, Heart } from 'lucide-react';

export default function LearnView() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-24"
    >
      <div className="bg-emerald-500 text-white p-8 rounded-3xl shadow-md">
        <BookOpen size={40} className="mb-4 opacity-80" />
        <h2 className="text-3xl font-bold mb-2">Aprende sobre Nutrición</h2>
        <p className="text-emerald-50 opacity-90">Conoce los conceptos básicos para llevar una vida más saludable.</p>
      </div>

      <div className="space-y-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-orange-100 text-orange-500 rounded-xl"><Flame size={20} /></div>
            <h3 className="text-xl font-bold text-slate-800">¿Qué son las Calorías?</h3>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Las calorías son la energía que obtenemos de los alimentos. Tu cuerpo necesita esta energía para funcionar, desde respirar hasta correr. Consumir más calorías de las que quemas lleva al aumento de peso, mientras que consumir menos lleva a la pérdida de peso.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Los Macronutrientes</h3>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-xl h-fit"><Activity size={20} /></div>
              <div>
                <h4 className="font-bold text-slate-800">Proteínas</h4>
                <p className="text-sm text-slate-600 mt-1">Esenciales para construir y reparar tejidos, músculos y órganos. Se encuentran en carnes, huevos, legumbres y lácteos.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-xl h-fit"><Wheat size={20} /></div>
              <div>
                <h4 className="font-bold text-slate-800">Carbohidratos</h4>
                <p className="text-sm text-slate-600 mt-1">La principal fuente de energía del cuerpo. Prefiere los complejos (avena, arroz integral) sobre los simples (azúcar, dulces).</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-2 bg-rose-100 text-rose-500 rounded-xl h-fit"><Droplet size={20} /></div>
              <div>
                <h4 className="font-bold text-slate-800">Grasas</h4>
                <p className="text-sm text-slate-600 mt-1">Importantes para la salud cerebral y hormonal. Opta por grasas saludables presentes en aguacates, nueces y aceite de oliva.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl"><Heart size={20} /></div>
            <h3 className="text-xl font-bold text-blue-900">Consejos Rápidos</h3>
          </div>
          <ul className="space-y-2 text-blue-800 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              Bebe al menos 2 litros de agua al día.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              Llena la mitad de tu plato con vegetales.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              Evita los alimentos ultraprocesados.
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 font-bold">•</span>
              Come despacio y mastica bien tus alimentos.
            </li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
