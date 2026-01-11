
import React, { useState } from 'react';

interface StarRatingProps {
  rating: number;
  max?: number;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, max = 5, onRatingChange, interactive = false }) => {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const displayRating = hoveredRating !== null ? hoveredRating : rating;

  const getRatingLabel = (val: number) => {
    switch (val) {
      case 1: return 'Décevant';
      case 2: return 'Moyen';
      case 3: return 'Bien';
      case 4: return 'Très bien';
      case 5: return 'Excellent !';
      default: return '';
    }
  };

  return (
    <div className="flex flex-col items-center sm:items-start gap-2 md:gap-4">
      <div 
        className="flex items-center gap-1.5 md:gap-2"
        onMouseLeave={() => interactive && setHoveredRating(null)}
      >
        {Array.from({ length: max }).map((_, i) => {
          const starIndex = i + 1;
          const isFilled = starIndex <= displayRating;
          
          return (
            <button
              key={i}
              type="button"
              disabled={!interactive}
              onMouseEnter={() => interactive && setHoveredRating(starIndex)}
              onClick={() => onRatingChange?.(starIndex)}
              className={`relative group focus:outline-none transition-all duration-300 ${
                interactive ? 'cursor-pointer active:scale-90' : 'cursor-default'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className={`w-6 h-6 md:w-9 md:h-9 transition-all duration-500 transform ${
                  isFilled 
                    ? 'text-amber-400 drop-shadow-[0_2px_6px_rgba(251,191,36,0.3)]' 
                    : 'text-slate-200'
                } ${interactive && isFilled ? 'group-hover:scale-110' : ''}`}
              >
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
              </svg>
            </button>
          );
        })}
      </div>
      {interactive && (
        <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-amber-500 min-h-[1em] transition-opacity duration-300">
          {getRatingLabel(displayRating)}
        </span>
      )}
    </div>
  );
};

export default StarRating;
