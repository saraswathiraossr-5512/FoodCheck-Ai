
import React from 'react';
import { Logo } from './Logo';

interface Props {
  onRefresh?: () => void;
}

export const Header: React.FC<Props> = ({ onRefresh }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#FAFAFA]/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
          <Logo className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-black text-gray-900 leading-none">FoodCheck AI</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Real ingredients. Real facts.</p>
        </div>
      </div>
      <button 
        onClick={onRefresh}
        className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-indigo-600 shadow-sm transition-all active:scale-90"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </header>
  );
};
