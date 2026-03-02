import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useStudioContext } from '../../hooks/useStudio';

export default function SaveButton({ birdId, size = 'w-5 h-5', className = '' }) {
  const { isSaved, toggleSave } = useStudioContext();
  const [animating, setAnimating] = useState(false);
  const saved = isSaved(birdId);

  const handleClick = (e) => {
    e.stopPropagation();
    toggleSave(birdId);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 150);
  };

  return (
    <button
      onClick={handleClick}
      className={`transition-colors ${className} ${animating ? 'save-pop' : ''}`}
      title={saved ? 'Remove from saved' : 'Save palette'}
    >
      <Heart
        className={`${size} transition-colors ${
          saved ? 'text-rose-500 fill-rose-500' : 'text-gray-300 hover:text-rose-400'
        }`}
      />
    </button>
  );
}
