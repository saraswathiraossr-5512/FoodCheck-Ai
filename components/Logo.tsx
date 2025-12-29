
import React from 'react';

interface Props {
  className?: string;
}

export const Logo: React.FC<Props> = ({ className = "w-12 h-12" }) => {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Simplified Food Bag */}
        <path d="M25 35C25 32.2386 27.2386 30 30 30H70C72.7614 30 75 32.2386 75 35V80C75 82.7614 72.7614 85 70 85H30C27.2386 85 25 82.7614 25 80V35Z" fill="#2ECC71" />
        <path d="M25 40H75V50C75 50 65 45 50 45C35 45 25 50 25 50V40Z" fill="#27AE60" />
        <rect x="35" y="60" width="10" height="2" rx="1" fill="white" fillOpacity="0.5" />
        <rect x="35" y="66" width="15" height="2" rx="1" fill="white" fillOpacity="0.5" />
        
        {/* Magnifying Glass */}
        <circle cx="65" cy="45" r="22" fill="#FAFAFA" stroke="#2C3E50" strokeWidth="4" />
        <path d="M54 58L42 75" stroke="#2C3E50" strokeWidth="8" strokeLinecap="round" />
        
        {/* Checkmark inside Lens */}
        <path d="M57 45L62 50L73 39" stroke="#2ECC71" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="58" y="55" width="12" height="2" rx="1" fill="#2C3E50" fillOpacity="0.2" />
        <rect x="58" y="60" width="8" height="2" rx="1" fill="#2C3E50" fillOpacity="0.2" />
      </svg>
    </div>
  );
};
