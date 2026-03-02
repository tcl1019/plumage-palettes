import React from 'react';
import { Heart } from 'lucide-react';
import { useNav } from '../../App';

export default function Header() {
  const { navigate } = useNav();

  return (
    <header className="bg-plumage-primary-dark text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate('discover')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Heart className="w-5 h-5 text-rose-300" fill="currentColor" />
          <span className="font-bold text-lg tracking-tight">Plumage Palettes</span>
        </button>
        <p className="text-xs text-emerald-200 hidden sm:block">Nature-Inspired Interior Design</p>
      </div>
    </header>
  );
}
