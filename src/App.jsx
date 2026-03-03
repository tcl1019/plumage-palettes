import React, { useState, useCallback, createContext, useContext } from 'react';
import { useStudio, StudioContext } from './hooks/useStudio';
import Navigation from './components/layout/Navigation';
import Header from './components/layout/Header';
import Discover from './components/sections/Discover';
import Explore from './components/sections/Explore';
import PaletteDetail from './components/sections/PaletteDetail';
import MyStudio from './components/sections/MyStudio';
import Learn from './components/sections/Learn';
import CollectionDetail from './components/sections/CollectionDetail';
import QuizFlow from './components/features/QuizFlow';
import ColorMatchFlow from './components/features/ColorMatchFlow';
import AIChatPanel from './components/features/AIChatPanel';

// Navigation context
export const NavContext = createContext(null);

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('useNav must be used within NavContext.Provider');
  return ctx;
}

export default function App() {
  const [activeSection, setActiveSection] = useState('discover');
  const [selectedBirdId, setSelectedBirdId] = useState(null);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const [colorMatchOpen, setColorMatchOpen] = useState(false);
  const [exploreFilters, setExploreFilters] = useState(null);
  const [previousSection, setPreviousSection] = useState(null);

  const studioHook = useStudio();

  const navigate = useCallback((section, options = {}) => {
    if (section === 'palette-detail' && options.birdId) {
      setPreviousSection(activeSection);
      setSelectedBirdId(options.birdId);
      setActiveSection('palette-detail');
    } else if (section === 'collection-detail' && options.collectionId) {
      setPreviousSection(activeSection);
      setSelectedCollectionId(options.collectionId);
      setActiveSection('collection-detail');
    } else if (section === 'explore' && options.filters) {
      setExploreFilters(options.filters);
      setActiveSection('explore');
    } else if (section === 'chat') {
      setChatContext(options.context || null);
      setChatOpen(true);
    } else if (section === 'quiz') {
      setQuizOpen(true);
    } else if (section === 'color-match') {
      setColorMatchOpen(true);
    } else {
      setActiveSection(section);
    }
    window.scrollTo(0, 0);
  }, [activeSection]);

  const goBack = useCallback(() => {
    if (previousSection) {
      setActiveSection(previousSection);
      setPreviousSection(null);
      setSelectedBirdId(null);
    } else {
      setActiveSection('discover');
    }
    window.scrollTo(0, 0);
  }, [previousSection]);

  const navValue = {
    activeSection,
    selectedBirdId,
    navigate,
    goBack,
    exploreFilters,
    setExploreFilters,
    chatOpen,
    setChatOpen,
    chatContext,
    setChatContext,
  };

  return (
    <StudioContext.Provider value={studioHook}>
      <NavContext.Provider value={navValue}>
        <div className="min-h-screen bg-plumage-surface pb-20 md:pb-0">
          <Header />

          <main className="section-fade-in" key={activeSection + (selectedBirdId || '')}>
            {activeSection === 'discover' && <Discover />}
            {activeSection === 'explore' && <Explore />}
            {activeSection === 'palette-detail' && selectedBirdId && (
              <PaletteDetail birdId={selectedBirdId} />
            )}
            {activeSection === 'collection-detail' && selectedCollectionId && (
              <CollectionDetail collectionId={selectedCollectionId} />
            )}
            {activeSection === 'my-studio' && <MyStudio />}
            {activeSection === 'learn' && <Learn />}
          </main>

          <Navigation />

          {/* Quiz overlay */}
          {quizOpen && (
            <QuizFlow onClose={() => setQuizOpen(false)} />
          )}

          {/* Color Match overlay */}
          {colorMatchOpen && (
            <ColorMatchFlow onClose={() => setColorMatchOpen(false)} />
          )}

          {/* AI Chat panel */}
          {chatOpen && (
            <AIChatPanel
              context={chatContext}
              onClose={() => { setChatOpen(false); setChatContext(null); }}
            />
          )}
        </div>
      </NavContext.Provider>
    </StudioContext.Provider>
  );
}
