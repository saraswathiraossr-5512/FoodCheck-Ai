
import React, { useState } from 'react';
import { Ingredient, RiskLevel } from '../types';

interface Props {
  ingredient: Ingredient;
}

export const IngredientCard: React.FC<Props> = ({ ingredient }) => {
  const [isOpen, setIsOpen] = useState(false);

  const getRiskLabel = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.SAFE: return 'SAFE';
      case RiskLevel.CAUTION: return 'CAUTION';
      case RiskLevel.AVOID: return 'AVOID';
      default: return '';
    }
  };

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.SAFE: return 'text-green-500';
      case RiskLevel.CAUTION: return 'text-amber-500';
      case RiskLevel.AVOID: return 'text-red-500';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden transition-all shadow-sm">
      <div 
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-800">{ingredient.normalizedName}</span>
            <span className={`text-[9px] font-black uppercase tracking-tighter ${getRiskColor(ingredient.riskLevel)}`}>
              {getRiskLabel(ingredient.riskLevel)}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 font-medium">
            {ingredient.originalName ? `Original: ${ingredient.originalName}` : ingredient.category}
          </span>
        </div>
        <svg 
          className={`w-5 h-5 text-gray-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="px-4 pb-4 animate-in slide-in-from-top-1 duration-200">
          <div className="pt-3 border-t border-gray-50 text-[12px] text-gray-500 leading-relaxed">
            <p className="mb-2">{ingredient.usageReason}</p>
            {ingredient.sideEffects && (
              <p className="p-3 bg-gray-50 rounded-lg italic text-gray-600 border-l-2 border-gray-200">
                {ingredient.sideEffects}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
