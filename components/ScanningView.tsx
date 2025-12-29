
import React, { useState, useEffect } from 'react';

interface Props {
  previewUrl: string | null;
}

export const ScanningView: React.FC<Props> = ({ previewUrl }) => {
  const steps = [
    "Reading ingredient list...",
    "Normalizing chemical names...",
    "Querying health databases...",
    "Assessing safety levels...",
    "Finalizing health verdict..."
  ];
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center pt-10 space-y-12 animate-in fade-in duration-500">
      <div className="relative w-64 h-64">
        {/* Decorative background shape */}
        <div className="absolute inset-0 border border-dashed border-gray-200 rounded-[60px] rotate-12 scale-110"></div>
        <div className="absolute inset-0 border border-dashed border-gray-200 rounded-[60px] -rotate-6"></div>
        
        {/* Image Container with Squircle effect */}
        <div className="relative w-full h-full bg-white rounded-[60px] overflow-hidden shadow-xl border-4 border-white flex items-center justify-center">
          {previewUrl ? (
            <img src={previewUrl} className="w-full h-full object-cover blur-[2px] opacity-60" alt="Scanning" />
          ) : (
            <div className="w-full h-full bg-gray-50 flex items-center justify-center">
               <svg className="w-12 h-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Scanning line animation */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="w-full h-[2px] bg-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-[scan_2s_ease-in-out_infinite]"></div>
          </div>
        </div>
      </div>

      <div className="text-center space-y-4">
        <h3 className="text-2xl font-black text-[#2C2C2C] h-8">{steps[currentStep]}</h3>
        
        {/* Progress dots */}
        <div className="flex justify-center gap-2">
          {steps.map((_, idx) => (
            <div 
              key={idx}
              className={`w-3 h-1.5 rounded-full transition-all duration-300 ${idx === currentStep ? 'bg-indigo-600 w-8' : 'bg-gray-200'}`}
            ></div>
          ))}
        </div>

        <p className="text-sm text-gray-400 font-medium">This usually takes about 5 seconds...</p>
      </div>
    </div>
  );
};
