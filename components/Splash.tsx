
import React from 'react';
import { Logo } from './Logo';

export const Splash: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-[#FAFAFA] flex flex-col items-center justify-center animate-in fade-in duration-1000">
      <Logo className="w-32 h-32 mb-6" />
      <h1 className="text-3xl font-bold text-[#2C2C2C]">FoodCheck <span className="text-[#2ECC71]">AI</span></h1>
      <p className="text-gray-500 mt-2 font-light">Know your food before you eat</p>
    </div>
  );
};
