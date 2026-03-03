import React, { useState } from 'react';
import { Heart, FolderPlus, Palette, ArrowLeftRight, Plus, Trash2, Home, Sparkles, LayoutGrid } from 'lucide-react';
import { birds } from '../../data/birds';
import PaletteStrip from '../shared/PaletteStrip';
import SaveButton from '../shared/SaveButton';
import PaletteMixer from '../features/PaletteMixer';
import CompareView from '../features/CompareView';
import RoomVisualizer from '../features/RoomVisualizer';
import RoomPlanner from '../features/RoomPlanner';
import { useStudioContext } from '../../hooks/useStudio';
import { useNav } from '../../App';

const TABS = [
  { id: 'saved', label: 'Saved', Icon: Heart },
  { id: 'projects', label: 'Projects', Icon: FolderPlus },
  { id: 'planner', label: 'Room Planner', Icon: LayoutGrid },
  { id: 'mixer', label: 'Mixer', Icon: Palette },
  { id: 'compare', label: 'Compare', Icon: ArrowLeftRight },
];

function SavedPalettes() {
  const { studio } = useStudioContext();
  const { navigate } = useNav();

  const savedBirds = studio.savedPalettes
    .map(id => birds.find(b => b.id === id))
    .filter(Boolean);

  if (savedBirds.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="w-10 h-10 text-gray-200 mx-auto mb-3" />
        <p className="text-gray-500 text-sm mb-2">No saved palettes yet</p>
        <p className="text-xs text-gray-400 mb-4">Tap the heart icon on any palette to save it here.</p>
        <button
          onClick={() => navigate('explore')}
          className="px-4 py-2 bg-plumage-primary text-white rounded-xl text-sm font-medium hover:bg-plumage-primary-light transition-colors"
        >
          Explore Palettes
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {savedBirds.map(bird => (
        <div
          key={bird.id}
          className="bg-white rounded-xl border border-plumage-border p-4 cursor-pointer hover:shadow-md transition-all"
          onClick={() => navigate('palette-detail', { birdId: bird.id })}
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-display text-sm text-gray-800">{bird.name}</p>
              <p className="text-[10px] text-gray-400 italic">{bird.scientific}</p>
            </div>
            <SaveButton birdId={bird.id} size="w-5 h-5" />
          </div>
          <PaletteStrip colors={bird.colors} height="h-8" clickable={false} />
        </div>
      ))}
    </div>
  );
}

function ProjectsList() {
  const { studio, createProject, deleteProject } = useStudioContext();
  const { navigate } = useNav();
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRoom, setNewRoom] = useState('living-room');

  const handleCreate = () => {
    if (!newName.trim()) return;
    createProject({ name: newName.trim(), roomType: newRoom });
    setNewName('');
    setShowNew(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{studio.projects.length} project{studio.projects.length !== 1 ? 's' : ''}</p>
        <button
          onClick={() => setShowNew(!showNew)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-plumage-primary text-white rounded-lg text-xs font-medium hover:bg-plumage-primary-light transition-colors"
        >
          <Plus className="w-3 h-3" /> New Project
        </button>
      </div>

      {showNew && (
        <div className="bg-plumage-surface-alt rounded-xl p-4 mb-4">
          <input
            type="text"
            placeholder="Project name..."
            value={newName}
            onChange={e => setNewName(e.target.value)}
            className="w-full px-3 py-2 border border-plumage-border rounded-xl text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-plumage-primary/30"
            autoFocus
          />
          <div className="flex items-center gap-2 mb-3">
            <label className="text-xs text-gray-500">Room:</label>
            <select
              value={newRoom}
              onChange={e => setNewRoom(e.target.value)}
              className="px-2 py-1 border border-plumage-border rounded-lg text-xs"
            >
              <option value="living-room">Living Room</option>
              <option value="bedroom">Bedroom</option>
              <option value="kitchen">Kitchen</option>
              <option value="bathroom">Bathroom</option>
              <option value="dining-room">Dining Room</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={handleCreate} className="px-3 py-1.5 bg-plumage-primary text-white rounded-lg text-xs font-medium">Create</button>
            <button onClick={() => setShowNew(false)} className="px-3 py-1.5 text-gray-500 text-xs">Cancel</button>
          </div>
        </div>
      )}

      {studio.projects.length === 0 && !showNew ? (
        <div className="text-center py-12">
          <FolderPlus className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 text-sm mb-2">No projects yet</p>
          <p className="text-xs text-gray-400">Create a project to track your room palette plans.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {studio.projects.map(project => {
            const bird = project.paletteId ? birds.find(b => b.id === project.paletteId) : null;
            return (
              <div key={project.id} className="bg-white rounded-xl border border-plumage-border p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{project.name}</p>
                    <p className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Home className="w-3 h-3" /> {project.roomType?.replace('-', ' ') || 'Room'}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="p-1 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-gray-300 hover:text-red-400" />
                  </button>
                </div>
                {bird && (
                  <div className="mb-2">
                    <p className="text-xs text-gray-500 mb-1">{bird.name}</p>
                    <PaletteStrip colors={bird.colors} height="h-6" clickable={false} />
                  </div>
                )}
                {!bird && (
                  <button
                    onClick={() => navigate('explore')}
                    className="text-xs text-plumage-primary font-medium hover:underline"
                  >
                    Choose a palette
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CustomPalettesList() {
  const { studio, deleteCustomPalette } = useStudioContext();

  if (studio.customPalettes.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">My Custom Palettes</h3>
      <div className="space-y-2">
        {studio.customPalettes.map(palette => (
          <div key={palette.id} className="bg-white rounded-xl border border-plumage-border p-3 flex items-center gap-3">
            <div className="flex rounded-lg overflow-hidden h-8 flex-1">
              {palette.colors.map((c, i) => (
                <div key={i} className="flex-1" style={{ backgroundColor: c.hex }} />
              ))}
            </div>
            <p className="text-xs font-medium text-gray-700 w-24 truncate">{palette.name}</p>
            <button onClick={() => deleteCustomPalette(palette.id)} className="p-1 hover:bg-red-50 rounded-lg">
              <Trash2 className="w-3 h-3 text-gray-300 hover:text-red-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MyStudio() {
  const [activeTab, setActiveTab] = useState('saved');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 section-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-2xl text-gray-800 mb-1">My Studio</h1>
        <p className="text-sm text-gray-500">Your saved palettes, projects, and custom mixes</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1 scrollbar-hide">
        {TABS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === id
                ? 'bg-plumage-primary text-white'
                : 'bg-white text-gray-500 border border-plumage-border hover:text-gray-700'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'saved' && (
        <>
          <SavedPalettes />
          <CustomPalettesList />
        </>
      )}
      {activeTab === 'projects' && <ProjectsList />}
      {activeTab === 'planner' && <RoomPlanner />}
      {activeTab === 'mixer' && <PaletteMixer />}
      {activeTab === 'compare' && <CompareView />}
    </div>
  );
}
