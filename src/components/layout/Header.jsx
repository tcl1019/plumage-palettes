import React from 'react';
import { Feather } from 'lucide-react';
import { useNav } from '../../App';

export default function Header() {
  const { navigate } = useNav();

  return (
    <header className="bg-gradient-to-r from-plumage-primary-dark via-plumage-primary-dark to-[#1a3d2e] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <button
          onClick={() => navigate('discover')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <Feather className="w-5 h-5 text-plumage-accent" />
          <span className="font-display text-lg tracking-tight">Ploom</span>
        </button>
        <p className="text-xs text-emerald-200/70 hidden sm:block tracking-wide">Nature-Inspired Interior Design</p>
      </div>
      <div className="h-px bg-gradient-to-r from-transparent via-plumage-accent/30 to-transparent" />
    </header>
  );
}
