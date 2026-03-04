import React, { useState, useMemo, useEffect } from 'react';
import { birds } from '../../data/birds';
import { DESIGN_STYLES, MOODS } from '../../data/constants';
import BirdCard from '../shared/BirdCard';
import { useNav } from '../../App';

const ROOM_NAME_MAP = {
  'bedroom': 'Bedroom',
  'living-room': 'Living Room',
  'kitchen': 'Kitchen',
  'bathroom': 'Bathroom',
  'dining-room': 'Dining Room',
};

export default function Explore() {
  const { exploreFilters, setExploreFilters } = useNav();
  const [searchTerm, setSearchTerm] = useState('');
  const [conservationFilter, setConservationFilter] = useState('all');
  const [styleFilter, setStyleFilter] = useState('all');
  const [seasonFilter, setSeasonFilter] = useState('all');
  const [moodFilter, setMoodFilter] = useState('all');
  const [roomFilter, setRoomFilter] = useState('all');
  const [viewMode, setViewMode] = useState('gallery');

  // Apply external filters from Discover page
  useEffect(() => {
    if (exploreFilters) {
      if (exploreFilters.style) setStyleFilter(exploreFilters.style);
      if (exploreFilters.season) setSeasonFilter(exploreFilters.season);
      if (exploreFilters.room) setRoomFilter(exploreFilters.room);
      if (exploreFilters.mood) setMoodFilter(exploreFilters.mood);
      setExploreFilters(null);
    }
  }, [exploreFilters, setExploreFilters]);

  const filteredBirds = useMemo(() => {
    const roomName = roomFilter !== 'all' ? ROOM_NAME_MAP[roomFilter] : null;

    const filtered = birds.filter(bird => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm ||
        bird.name.toLowerCase().includes(searchLower) ||
        bird.scientific.toLowerCase().includes(searchLower) ||
        bird.description.toLowerCase().includes(searchLower) ||
        bird.colors.some(c => c.name.toLowerCase().includes(searchLower));
      const matchesStatus = conservationFilter === 'all' || bird.status === conservationFilter;
      const matchesStyle = styleFilter === 'all' || bird.styles.includes(styleFilter);
      const matchesSeason = seasonFilter === 'all' || bird.season === seasonFilter || bird.season === 'year-round';
      const matchesMood = moodFilter === 'all' || (bird.moods && bird.moods.includes(moodFilter));

      // Room-based filtering — only show palettes rated 4+ for the room
      let matchesRoom = true;
      if (roomName) {
        const roomEntry = bird.rooms?.find(r => r.room === roomName);
        matchesRoom = roomEntry && roomEntry.rating >= 4;
      }

      return matchesSearch && matchesStatus && matchesStyle && matchesSeason && matchesMood && matchesRoom;
    });

    // Sort by room rating (best first) when a room filter is active
    if (roomName) {
      filtered.sort((a, b) => {
        const rA = a.rooms?.find(r => r.room === roomName)?.rating || 0;
        const rB = b.rooms?.find(r => r.room === roomName)?.rating || 0;
        return rB - rA;
      });
    }

    return filtered;
  }, [searchTerm, conservationFilter, styleFilter, seasonFilter, moodFilter, roomFilter]);

  const hasActiveFilters = searchTerm || conservationFilter !== 'all' || styleFilter !== 'all' || seasonFilter !== 'all' || moodFilter !== 'all' || roomFilter !== 'all';

  const resetFilters = () => {
    setSearchTerm('');
    setConservationFilter('all');
    setStyleFilter('all');
    setSeasonFilter('all');
    setMoodFilter('all');
    setRoomFilter('all');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 section-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-display text-2xl text-gray-800 mb-1">Explore Palettes</h2>
          <p className="text-sm text-gray-500">{filteredBirds.length} of {birds.length} palettes</p>
        </div>
        {hasActiveFilters && (
          <button onClick={resetFilters} className="text-xs text-plumage-primary font-medium hover:underline">
            Clear filters
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-[10px] font-semibold text-gray-500 mb-1 uppercase tracking-wider">Search</label>
          <input
            type="text"
            placeholder="Bird or color..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-plumage-border rounded-xl focus:outline-none focus:ring-2 focus:ring-plumage-primary/30 focus:border-plumage-primary bg-white text-sm"
          />
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-gray-500 mb-1 uppercase tracking-wider">Room</label>
          <select
            value={roomFilter}
            onChange={(e) => setRoomFilter(e.target.value)}
            className="w-full px-3 py-2 border border-plumage-border rounded-xl focus:outline-none focus:ring-2 focus:ring-plumage-primary/30 bg-white text-sm"
          >
            <option value="all">All Rooms</option>
            {Object.entries(ROOM_NAME_MAP).map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-gray-500 mb-1 uppercase tracking-wider">Mood</label>
          <select
            value={moodFilter}
            onChange={(e) => setMoodFilter(e.target.value)}
            className="w-full px-3 py-2 border border-plumage-border rounded-xl focus:outline-none focus:ring-2 focus:ring-plumage-primary/30 bg-white text-sm"
          >
            <option value="all">All Moods</option>
            {MOODS.map(m => (
              <option key={m.id} value={m.id}>{m.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-gray-500 mb-1 uppercase tracking-wider">Style</label>
          <select
            value={styleFilter}
            onChange={(e) => setStyleFilter(e.target.value)}
            className="w-full px-3 py-2 border border-plumage-border rounded-xl focus:outline-none focus:ring-2 focus:ring-plumage-primary/30 bg-white text-sm"
          >
            <option value="all">All Styles</option>
            {DESIGN_STYLES.map(s => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-gray-500 mb-1 uppercase tracking-wider">Season</label>
          <select
            value={seasonFilter}
            onChange={(e) => setSeasonFilter(e.target.value)}
            className="w-full px-3 py-2 border border-plumage-border rounded-xl focus:outline-none focus:ring-2 focus:ring-plumage-primary/30 bg-white text-sm"
          >
            <option value="all">All Seasons</option>
            <option value="spring-summer">Spring / Summer</option>
            <option value="fall-winter">Fall / Winter</option>
            <option value="year-round">Year-Round</option>
          </select>
        </div>
        <div className="flex items-end">
          <div className="flex gap-1 w-full">
            <button
              onClick={() => setViewMode('gallery')}
              className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                viewMode === 'gallery' ? 'bg-plumage-primary text-white' : 'bg-white border border-plumage-border text-gray-500'
              }`}
            >Gallery</button>
            <button
              onClick={() => setViewMode('compact')}
              className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                viewMode === 'compact' ? 'bg-plumage-primary text-white' : 'bg-white border border-plumage-border text-gray-500'
              }`}
            >Compact</button>
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredBirds.length > 0 ? (
        <div className={`grid gap-4 ${viewMode === 'gallery' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'}`}>
          {filteredBirds.map(bird => (
            <BirdCard key={bird.id} bird={bird} compact={viewMode === 'compact'} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-gray-500 mb-4">No palettes match your filters.</p>
          <button onClick={resetFilters} className="px-6 py-2.5 bg-plumage-primary text-white rounded-xl hover:bg-plumage-primary-light transition-colors font-medium">
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
