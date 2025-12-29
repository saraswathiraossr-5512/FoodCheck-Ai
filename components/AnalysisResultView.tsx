
import React, { useState } from 'react';
import { AnalysisResult, RiskLevel } from '../types';
import { IngredientCard } from './IngredientCard';

interface Props {
  result: AnalysisResult;
  onReset: () => void;
}

export const AnalysisResultView: React.FC<Props> = ({ result, onReset }) => {
  const [filter, setFilter] = useState<'ALL' | RiskLevel>('ALL');
  const [isSharing, setIsSharing] = useState(false);

  const filteredIngredients = result.ingredients.filter(ing => 
    filter === 'ALL' || ing.riskLevel === filter
  );

  const getBadgeColor = (badge: string) => {
    const b = badge.toUpperCase();
    if (b.includes('HEALTHY') || b.includes('SAFE')) return 'bg-green-100 text-green-700';
    if (b.includes('OCCASIONAL') || b.includes('CAUTION')) return 'bg-amber-100 text-amber-700';
    return 'bg-red-100 text-red-700';
  };

  const handleShare = async () => {
    if (isSharing) return;
    setIsSharing(true);

    const productName = result.productName || "Packaged Food Product";
    
    // Determine Verdict based on score/badge for safe categories
    let verdict = "Consume Occasionally";
    if (result.overallScore >= 80 || result.riskBadge.toUpperCase().includes("HEALTHY")) {
      verdict = "Safe";
    } else if (result.overallScore < 50 || result.riskBadge.toUpperCase().includes("AVOID")) {
      verdict = "Not Recommended";
    }

    // Extract exactly 2 key factual insights
    const insights = result.ingredients
      .slice(0, 2)
      .map(ing => `- ${ing.normalizedName}: ${ing.usageReason.split('.')[0]}`)
      .join('\n');

    // Field 1: share_title
    const share_title = "FoodCheck AI - Food Scan Result";

    // Field 2: share_text (Text-only, no URLs, no Markdown, under 450 chars)
    const share_text = `Product: ${productName}
Verdict: ${verdict}

Insights:
${insights}

Disclaimer: Informational analysis based on detected ingredients. Not medical advice.

Scanned with FoodCheck AI – Know your food before you eat`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: share_title,
          text: share_text,
        });
      } else {
        await navigator.clipboard.writeText(`${share_title}\n\n${share_text}`);
        alert('Share content copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={onReset}
          className="flex items-center gap-1 text-gray-400 font-bold text-sm hover:text-gray-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleShare}
            className="flex items-center gap-1.5 bg-white border border-gray-100 px-3 py-1.5 rounded-full text-[10px] font-black text-indigo-600 uppercase tracking-widest shadow-sm hover:bg-indigo-50 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share
          </button>
          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
            Informational Analysis
          </span>
        </div>
      </div>

      {/* Regulatory Alert */}
      {result.alert && (
        <div className="bg-red-600 text-white p-4 rounded-xl mb-6 flex gap-3 shadow-lg">
          <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div className="text-xs font-bold leading-tight">
            <span className="uppercase block mb-1 tracking-wider text-[10px] opacity-80">Regulatory Health Alert</span>
            {result.alert}
          </div>
        </div>
      )}

      {/* Product Header Card */}
      <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-3xl font-black text-gray-900 leading-tight max-w-[70%]">{result.productName}</h2>
          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden border border-gray-100">
             {result.thumbnail ? (
               <img src={result.thumbnail} className="w-full h-full object-cover" alt="Product" />
             ) : (
               <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
             )}
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${getBadgeColor(result.riskBadge)}`}>
            {result.riskBadge}
          </span>
          <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
            AI Confidence: {result.confidenceScore}%
          </span>
        </div>

        <div className="text-gray-600 text-sm leading-relaxed mb-4">
          {result.detailedDescription}
        </div>
      </div>

      {/* Ingredient Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-[12px] font-black text-gray-400 uppercase tracking-widest">
            Ingredient Analysis ({result.ingredients.length})
          </h3>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="text-[10px] font-bold text-gray-500 bg-transparent border-none focus:ring-0 cursor-pointer uppercase"
          >
            <option value="ALL">All Levels</option>
            <option value={RiskLevel.SAFE}>Safe Only</option>
            <option value={RiskLevel.CAUTION}>Caution Only</option>
            <option value={RiskLevel.AVOID}>Avoid Only</option>
          </select>
        </div>

        <div className="space-y-2">
          {filteredIngredients.map((ing, idx) => (
            <IngredientCard key={idx} ingredient={ing} />
          ))}
        </div>
      </div>

      {/* Verification Links */}
      <div className="mt-8 space-y-6">
        <div>
          <h3 className="text-[12px] font-black text-gray-400 uppercase tracking-widest px-1 mb-3">
            Real-Time Verification Links
          </h3>
          <div className="grid grid-cols-1 gap-2">
            {result.verificationLinks.map((link, idx) => (
              <a 
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between group shadow-sm hover:border-blue-100 transition-colors"
              >
                <span className="text-sm font-bold text-blue-600 group-hover:underline">{link.title}</span>
                <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {result.knowledgeBases && result.knowledgeBases.length > 0 && (
          <div>
            <h3 className="text-[12px] font-black text-gray-400 uppercase tracking-widest px-1 mb-3">
              Static Knowledge Bases
            </h3>
            <div className="space-y-2">
              {result.knowledgeBases.map((kb, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm font-medium text-gray-600">
                  {kb.title}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
        <div className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-2 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Authoritative Disclaimer
        </div>
        <div className="text-[10px] text-indigo-600/70 leading-relaxed italic font-medium">
          {result.disclaimer}
        </div>
      </div>
    </div>
  );
};
