import React from 'react';
import { Compass, Palette, FolderHeart, BookOpen, Sparkles } from 'lucide-react';
import { useNav } from '../../App';

const NAV_ITEMS = [
  { id: 'discover', label: 'Discover', Icon: Compass },
  { id: 'explore', label: 'Explore', Icon: Palette },
  { id: 'my-studio', label: 'My Studio', Icon: FolderHeart },
  { id: 'learn', label: 'Learn', Icon: BookOpen },
  { id: 'chat', label: 'AI Chat', Icon: Sparkles },
];

export default function Navigation() {
  const { activeSection, navigate, setChatOpen } = useNav();

  const handleClick = (id) => {
    if (id === 'chat') {
      navigate('chat');
    } else {
      navigate(id);
    }
  };

  return (
    <>
      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 backdrop-blur-md bg-white/90 border-t border-plumage-border z-40 md:hidden">
        <div className="flex">
          {NAV_ITEMS.map(({ id, label, Icon }) => {
            const isActive = id === 'chat' ? false : activeSection === id;
            return (
              <button
                key={id}
                onClick={() => handleClick(id)}
                className={`flex-1 flex flex-col items-center py-2 px-1 transition-colors relative ${
                  isActive
                    ? 'text-plumage-primary'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {isActive && (
                  <span className="absolute top-1.5 w-1 h-1 rounded-full bg-plumage-primary" />
                )}
                <Icon className="w-5 h-5 mt-1" />
                <span className="text-[10px] mt-0.5 font-medium">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop top nav */}
      <nav className="hidden md:block backdrop-blur-md bg-white/80 border-b border-plumage-border/50 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 py-2">
            {NAV_ITEMS.map(({ id, label, Icon }) => {
              const isActive = id === 'chat' ? false : activeSection === id;
              return (
                <button
                  key={id}
                  onClick={() => handleClick(id)}
                  className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-plumage-primary font-semibold'
                      : id === 'chat'
                      ? 'text-plumage-accent hover:bg-amber-50 hover:text-amber-700'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-plumage-primary rounded-full"
                      style={{ animation: 'scaleIn 200ms ease-out', transformOrigin: 'left' }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </>
  );
}
