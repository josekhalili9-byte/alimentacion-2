import React, { useState, useEffect } from 'react';
import { Camera, History as HistoryIcon, BookOpen, ShieldAlert, Loader2 } from 'lucide-react';
import CameraScanner from './components/CameraScanner';
import AnalysisResult from './components/AnalysisResult';
import HistoryView from './components/HistoryView';
import LearnView from './components/LearnView';
import AdminView from './components/AdminView';
import { FoodAnalysis } from './types';
import { analyzeFoodImage } from './lib/gemini';

type Tab = 'scan' | 'history' | 'learn' | 'admin';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('scan');
  const [history, setHistory] = useState<FoodAnalysis[]>([]);
  const [currentScan, setCurrentScan] = useState<FoodAnalysis | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load history from local storage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('foodscan_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to local storage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('foodscan_history', JSON.stringify(history));
    } catch (e) {
      if (e instanceof DOMException && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
        console.warn("LocalStorage quota exceeded, pruning history...");
        // Prune: Keep only the 10 most recent items if quota is hit
        if (history.length > 10) {
          const prunedHistory = history.slice(0, 10);
          setHistory(prunedHistory);
          try {
            localStorage.setItem('foodscan_history', JSON.stringify(prunedHistory));
          } catch (retryError) {
            console.error("Failed to save even pruned history", retryError);
          }
        }
      } else {
        console.error("Failed to save history", e);
      }
    }
  }, [history]);

  const handleCapture = async (base64Image: string, mimeType: string) => {
    setIsScanning(true);
    setError(null);
    try {
      const analysisData = await analyzeFoodImage(base64Image, mimeType);
      
      const newScan: FoodAnalysis = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        imageUrl: base64Image,
        ...analysisData
      };

      setCurrentScan(newScan);
      setHistory(prev => [newScan, ...prev]);
    } catch (err: any) {
      const errorMessage = err?.message || "Error desconocido";
      setError(`Hubo un error al analizar el alimento: ${errorMessage}. Por favor, intenta de nuevo.`);
      console.error(err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleResetScan = () => {
    setCurrentScan(null);
    setError(null);
  };

  const handleSelectHistoryItem = (item: FoodAnalysis) => {
    setCurrentScan(item);
    setActiveTab('scan');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-white px-6 py-4 shadow-sm sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Camera size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-blue-600">
            FoodScan AI
          </h1>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow p-4 md:p-6 max-w-2xl mx-auto w-full overflow-y-auto">
        {activeTab === 'scan' && (
          <>
            {isScanning ? (
              <div className="flex flex-col items-center justify-center h-[60vh]">
                <Loader2 size={48} className="text-emerald-500 animate-spin mb-4" />
                <h2 className="text-xl font-bold text-slate-800">Analizando alimento...</h2>
                <p className="text-slate-500 mt-2">Nuestra IA está calculando los nutrientes.</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
                <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
                  <ShieldAlert size={32} />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Oops!</h2>
                <p className="text-slate-600 mb-6">{error}</p>
                <button 
                  onClick={handleResetScan}
                  className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold"
                >
                  Intentar de nuevo
                </button>
              </div>
            ) : currentScan ? (
              <AnalysisResult data={currentScan} onReset={handleResetScan} />
            ) : (
              <CameraScanner onCapture={handleCapture} />
            )}
          </>
        )}

        {activeTab === 'history' && (
          <HistoryView history={history} onSelectItem={handleSelectHistoryItem} />
        )}

        {activeTab === 'learn' && (
          <LearnView />
        )}

        {activeTab === 'admin' && (
          <AdminView history={history} onUpdateHistory={setHistory} />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 pb-safe pt-2 px-6 flex justify-between items-center max-w-md left-1/2 -translate-x-1/2 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50">
        <button 
          onClick={() => setActiveTab('scan')}
          className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'scan' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <div className={`p-1.5 rounded-xl ${activeTab === 'scan' ? 'bg-emerald-50' : ''}`}>
            <Camera size={24} />
          </div>
          <span className="text-[10px] font-bold mt-1">Escanear</span>
        </button>
        
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'history' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <div className={`p-1.5 rounded-xl ${activeTab === 'history' ? 'bg-emerald-50' : ''}`}>
            <HistoryIcon size={24} />
          </div>
          <span className="text-[10px] font-bold mt-1">Historial</span>
        </button>

        <button 
          onClick={() => setActiveTab('learn')}
          className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'learn' ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <div className={`p-1.5 rounded-xl ${activeTab === 'learn' ? 'bg-emerald-50' : ''}`}>
            <BookOpen size={24} />
          </div>
          <span className="text-[10px] font-bold mt-1">Aprende</span>
        </button>

        <button 
          onClick={() => setActiveTab('admin')}
          className={`flex flex-col items-center p-2 transition-colors ${activeTab === 'admin' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <div className={`p-1.5 rounded-xl ${activeTab === 'admin' ? 'bg-slate-100' : ''}`}>
            <ShieldAlert size={24} />
          </div>
          <span className="text-[10px] font-bold mt-1">Admin</span>
        </button>
      </nav>
    </div>
  );
}
