
import React, { useState } from 'react';
import { Logo } from './Logo';

interface Props {
  onBack: () => void;
}

export const About: React.FC<Props> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<'INFO' | 'PRIVACY' | 'TERMS' | 'LEGAL'>('INFO');

  const SectionHeader = ({ title }: { title: string }) => (
    <h3 className="text-[12px] font-black text-gray-400 uppercase tracking-widest mb-4 border-b border-gray-100 pb-2">
      {title}
    </h3>
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col animate-in slide-in-from-bottom-4 duration-500">
      {/* Fixed Header in About */}
      <div className="p-6 border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors font-bold text-sm"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <div className="flex items-center gap-2">
           <Logo className="w-6 h-6" />
           <span className="font-black text-gray-900 text-sm">FoodCheck AI</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-12">
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto gap-2 no-scrollbar pb-2">
          {[
            { id: 'INFO', label: 'About' },
            { id: 'PRIVACY', label: 'Privacy' },
            { id: 'TERMS', label: 'Terms' },
            { id: 'LEGAL', label: 'Disclaimer' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                activeTab === tab.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                : 'bg-white text-gray-400 border border-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'INFO' && (
          <div className="animate-in fade-in duration-300 flex flex-col items-center">
            <Logo className="w-32 h-32 mb-4" />
            <h2 className="text-3xl font-black text-[#2C2C2C] mb-1">FoodCheck AI</h2>
            <p className="text-[#2ECC71] font-bold text-sm mb-8 tracking-tight italic">Know your food before you eat</p>
            
            <div className="w-full space-y-6 text-gray-600 leading-relaxed text-sm">
              <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                <p className="mb-4">
                  FoodCheck AI is your transparent companion for smarter grocery shopping. We use advanced computer vision to instantly decode complex ingredient labels.
                </p>
                <p>
                  Our goal is to bring clarity to packaged food by providing instant access to public health standards and regulatory data from global authorities.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                  <span className="block text-[10px] font-black text-indigo-400 uppercase mb-1">Status</span>
                  <span className="text-xs font-bold text-indigo-700">1.0.0 Public Beta</span>
                </div>
                <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100">
                  <span className="block text-[10px] font-black text-green-400 uppercase mb-1">Safety Data</span>
                  <span className="text-xs font-bold text-green-700">WHO, FDA, EFSA</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'PRIVACY' && (
          <div className="animate-in fade-in duration-300 space-y-6">
            <SectionHeader title="Privacy Policy" />
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-4 text-sm text-gray-600">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <p><strong>Image Processing:</strong> Images you scan are processed exclusively for the purpose of extracting ingredient lists and nutrition data. We do not use your photos for any other purpose.</p>
              </div>
              
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-green-50 text-green-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <p><strong>Your Data:</strong> We believe in transparency. We never sell your personal data to third parties. We do not build medical profiles of our users.</p>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <p><strong>Local Storage:</strong> Your scan history is stored locally on your device for your convenience. You have full control and can delete this history at any time from the home screen.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'TERMS' && (
          <div className="animate-in fade-in duration-300 space-y-6">
            <SectionHeader title="Terms of Use" />
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-6 text-sm text-gray-600">
              <div>
                <h4 className="font-black text-gray-900 uppercase text-[10px] tracking-widest mb-2">Purpose</h4>
                <p>FoodCheck AI is provided for educational and informational purposes only. It is designed to help you understand what's in your food, not to dictate what you should eat.</p>
              </div>

              <div>
                <h4 className="font-black text-gray-900 uppercase text-[10px] tracking-widest mb-2">No Professional Advice</h4>
                <p>The app does not provide medical, health, or dietary advice. Always consult with a qualified health professional regarding specific dietary needs, allergies, or health conditions.</p>
              </div>

              <div>
                <h4 className="font-black text-gray-900 uppercase text-[10px] tracking-widest mb-2">Responsibility</h4>
                <p>You are solely responsible for your food choices and purchases. FoodCheck AI is a tool to assist your decision-making, not a replacement for your own judgment or manufacturer label reading.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'LEGAL' && (
          <div className="animate-in fade-in duration-300 space-y-6">
            <SectionHeader title="Legal Disclaimer" />
            <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-6 text-sm text-gray-600">
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-amber-800 text-xs italic">
                Important: Please read this section carefully before using the analysis features.
              </div>

              <div className="space-y-4">
                <p><strong>AI-Based Analysis:</strong> Results are generated using AI-powered image analysis and public health databases. While we strive for extreme accuracy, mistakes can occur due to image quality, lighting, or complex packaging.</p>
                
                <p><strong>Data Currency:</strong> We rely on public data from organizations like the WHO, FDA, and EFSA. Food regulations and ingredient safety ratings change frequently; our results represent an informational snapshot and not a final legal or medical determination.</p>

                <p><strong>No Substitute:</strong> This app is not a substitute for professional medical advice, diagnosis, or treatment. Never disregard professional advice because of something you have read on this app.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-8 border-t border-gray-100 bg-white text-center">
        <span className="text-[10px] uppercase font-black text-gray-300 tracking-[0.2em]">FoodCheck AI • Transparent Nutrition</span>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};
