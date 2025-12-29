
import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { Splash } from './components/Splash';
import { About } from './components/About';
import { ScanningView } from './components/ScanningView';
import { AppState, AnalysisResult } from './types';
import { FoodLensService } from './services/geminiService';
import { AnalysisResultView } from './components/AnalysisResultView';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('SPLASH');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const serviceRef = useRef<FoodLensService | null>(null);

  useEffect(() => {
    // Load history from local storage
    const saved = localStorage.getItem('foodcheck_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }

    const timer = setTimeout(() => {
      setState('IDLE');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!serviceRef.current) {
    serviceRef.current = new FoodLensService();
  }

  const generateThumbnail = (dataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 100;
        const scale = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = dataUrl;
    });
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setState('ANALYZING');
    setError(null);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64 = e.target?.result as string;
      setPreviewUrl(base64);
      const pureBase64 = base64.split(',')[1];
      
      try {
        const thumbnail = await generateThumbnail(base64);
        const analysis = await serviceRef.current!.analyzeFoodLabel(pureBase64, file.type);
        const finalResult = { ...analysis, thumbnail };

        setResult(finalResult);
        
        // Update history
        setHistory(prev => {
          const newHistory = [finalResult, ...prev].slice(0, 20);
          localStorage.setItem('foodcheck_history', JSON.stringify(newHistory));
          return newHistory;
        });
        
        setState('RESULT');
      } catch (err) {
        console.error(err);
        setError('Failed to analyze label. Please ensure ingredients are clear and try again.');
        setState('ERROR');
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerUpload = () => fileInputRef.current?.click();
  const reset = () => { setState('IDLE'); setResult(null); setError(null); setPreviewUrl(null); };
  const clearHistory = () => { setHistory([]); localStorage.removeItem('foodcheck_history'); };
  const viewHistorical = (res: AnalysisResult) => { setResult(res); setState('RESULT'); };

  const getBadgeColor = (badge: string) => {
    const b = badge.toUpperCase();
    if (b.includes('HEALTHY') || b.includes('SAFE')) return 'bg-green-500';
    if (b.includes('OCCASIONAL') || b.includes('CAUTION')) return 'bg-amber-500';
    return 'bg-red-500';
  };

  if (state === 'SPLASH') return <Splash />;
  if (state === 'ABOUT') return <About onBack={reset} />;

  return (
    <div className="min-h-screen max-w-lg mx-auto bg-[#FAFAFA] flex flex-col font-sans">
      <Header onRefresh={reset} />
      
      <main className="flex-1 p-6 overflow-y-auto">
        {state === 'IDLE' && (
          <div className="animate-in fade-in duration-500 space-y-10">
            <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm flex flex-col items-center text-center space-y-6">
              <div 
                onClick={triggerUpload}
                className="w-24 h-24 bg-indigo-50 rounded-[30px] flex items-center justify-center cursor-pointer hover:bg-indigo-100 transition-all active:scale-95 group shadow-inner"
              >
                <div className="relative">
                  <svg className="w-10 h-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-indigo-600 rounded-lg border-2 border-white flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-black text-gray-900">Check Your Food</h2>
                <p className="text-gray-400 text-xs font-bold leading-relaxed px-4">Instantly decode ingredient labels to see what's actually inside your snacks.</p>
              </div>

              <button 
                onClick={triggerUpload}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-gray-200 active:scale-95 transition-transform"
              >
                Scan New Product
              </button>
            </div>

            {/* Recent Scans Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-[12px] font-black text-gray-400 uppercase tracking-widest">Recent Scans</h3>
                {history.length > 0 && (
                  <button onClick={clearHistory} className="text-[10px] font-black text-gray-400 hover:text-red-500 uppercase tracking-widest transition-colors">Clear All</button>
                )}
              </div>

              {history.length > 0 ? (
                <div className="space-y-3">
                  {history.map((item, idx) => (
                    <div 
                      key={idx}
                      onClick={() => viewHistorical(item)}
                      className="bg-white p-4 rounded-3xl border border-gray-50 shadow-sm flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-all hover:border-indigo-100 group"
                    >
                      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex-shrink-0 overflow-hidden border border-gray-100 group-hover:border-indigo-50">
                        {item.thumbnail ? (
                          <img src={item.thumbnail} className="w-full h-full object-cover" alt="Thumb" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-200">
                             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                              </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex flex-col min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                          <span className="text-sm font-bold text-gray-800 truncate pr-2">{item.productName}</span>
                          <span className={`w-2.5 h-2.5 rounded-full ${getBadgeColor(item.riskBadge)} flex-shrink-0`}></span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-tighter">
                            {item.scanDate} • {item.ingredients.length} Ingredients
                          </span>
                          <span className="text-[9px] font-black text-indigo-400 uppercase group-hover:translate-x-1 transition-transform">View →</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Privacy & Storage Note */}
                  <div className="p-4 bg-gray-100/50 rounded-2xl text-[10px] text-gray-400 font-bold uppercase tracking-widest text-center">
                    History is stored locally on this device and can be deleted anytime.
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-[40px] border border-dashed border-gray-200 animate-in fade-in zoom-in-95">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-200">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">No Scans Yet</p>
                  <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Your nutrition history will appear here.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {state === 'ANALYZING' && <ScanningView previewUrl={previewUrl} />}
        {state === 'RESULT' && result && <AnalysisResultView result={result} onReset={reset} />}

        {state === 'ERROR' && (
          <div className="pt-24 text-center space-y-6 animate-in zoom-in-95">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-4 rotate-12">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-2xl font-black text-gray-900">Analysis Error</h3>
            <p className="text-gray-400 font-bold px-6 text-sm leading-relaxed">{error}</p>
            <button 
              onClick={reset}
              className="bg-gray-900 text-white font-black px-12 py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
            >
              Try Again
            </button>
          </div>
        )}
      </main>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        capture="environment"
        className="hidden" 
      />

      <footer className="p-6 text-center text-gray-300 text-[10px] font-bold tracking-widest uppercase">
        FoodCheck AI • For Informational Purposes Only
      </footer>

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default App;
