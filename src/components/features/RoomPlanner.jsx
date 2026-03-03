import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Home, Link, Unlink, BarChart3, Search, X, Check } from 'lucide-react';
import { birds } from '../../data/birds';
import { checkHouseFlow } from '../../utils/flowCheck';
import { useStudioContext } from '../../hooks/useStudio';
import PaletteStrip from '../shared/PaletteStrip';

const ROOM_TYPES = [
  'Living Room', 'Bedroom', 'Kitchen', 'Bathroom',
  'Dining Room', 'Office', 'Hallway', 'Entryway', 'Nursery', 'Guest Room',
];

function ProjectList({ onSelect }) {
  const { studio, createHousePlan, deleteHousePlan } = useStudioContext();
  const [newName, setNewName] = useState('');
  const [showNew, setShowNew] = useState(false);
  const plans = studio.housePlans || [];

  const handleCreate = () => {
    if (!newName.trim()) return;
    const id = createHousePlan(newName.trim());
    setNewName('');
    setShowNew(false);
    onSelect(id);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{plans.length} project{plans.length !== 1 ? 's' : ''}</p>
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
            placeholder="Project name (e.g., Our Home, Kitchen Reno)"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            className="w-full px-3 py-2 border border-plumage-border rounded-xl text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-plumage-primary/30"
            autoFocus
          />
          <div className="flex gap-2">
            <button onClick={handleCreate} className="px-3 py-1.5 bg-plumage-primary text-white rounded-lg text-xs font-medium">Create</button>
            <button onClick={() => setShowNew(false)} className="px-3 py-1.5 text-gray-500 text-xs">Cancel</button>
          </div>
        </div>
      )}

      {plans.length === 0 && !showNew ? (
        <div className="text-center py-12">
          <Home className="w-10 h-10 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 text-sm mb-2">No projects yet</p>
          <p className="text-xs text-gray-400">Create a project to plan palettes across your rooms.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {plans.map(plan => (
            <div
              key={plan.id}
              className="bg-white rounded-xl border border-plumage-border p-4 cursor-pointer hover:shadow-md transition-all"
              onClick={() => onSelect(plan.id)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{plan.name}</p>
                  <p className="text-[10px] text-gray-400">{plan.rooms.length} room{plan.rooms.length !== 1 ? 's' : ''}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteHousePlan(plan.id); }}
                  className="p-1 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5 text-gray-300 hover:text-red-400" />
                </button>
              </div>
              {plan.rooms.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {plan.rooms.map(r => {
                    const bird = r.paletteId ? birds.find(b => b.id === r.paletteId) : null;
                    return (
                      <span key={r.id} className="px-2 py-0.5 bg-plumage-surface-alt text-gray-600 rounded-full text-[10px] font-medium">
                        {r.name}{bird ? ` · ${bird.name}` : ''}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PaletteSearch({ onSelect, onClose }) {
  const [query, setQuery] = useState('');
  const results = useMemo(() => {
    if (!query.trim()) return birds.slice(0, 12);
    const q = query.toLowerCase();
    return birds.filter(b =>
      b.name.toLowerCase().includes(q) ||
      b.scientific.toLowerCase().includes(q)
    ).slice(0, 12);
  }, [query]);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[70vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-plumage-border">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search palettes..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 text-sm focus:outline-none"
              autoFocus
            />
            <button onClick={onClose} className="p-1">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
        <div className="overflow-y-auto p-2 flex-1">
          {results.map(bird => (
            <div
              key={bird.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-plumage-surface-alt cursor-pointer"
              onClick={() => { onSelect(bird.id); onClose(); }}
            >
              <div className="flex rounded overflow-hidden h-6 w-20 flex-shrink-0">
                {bird.colors.map((c, i) => (
                  <div key={i} className="flex-1" style={{ backgroundColor: c.hex }} />
                ))}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{bird.name}</p>
                <p className="text-[10px] text-gray-400 truncate">{bird.scientific}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProjectDetail({ planId, onBack }) {
  const { studio, addRoomToPlan, updateRoomInPlan, removeRoomFromPlan, toggleAdjacency } = useStudioContext();
  const plan = (studio.housePlans || []).find(p => p.id === planId);

  const [addingRoom, setAddingRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('Living Room');
  const [assigningRoom, setAssigningRoom] = useState(null);
  const [linkMode, setLinkMode] = useState(null);
  const [showFlow, setShowFlow] = useState(false);

  const flowResult = useMemo(() => {
    if (!showFlow || !plan) return null;
    return checkHouseFlow(plan);
  }, [showFlow, plan]);

  if (!plan) return <div className="text-center py-12 text-gray-500">Project not found.</div>;

  const handleAddRoom = () => {
    addRoomToPlan(planId, { name: newRoomName, roomType: newRoomName.toLowerCase().replace(/\s+/g, '-') });
    setAddingRoom(false);
    setNewRoomName('Living Room');
  };

  const handleLink = (roomId) => {
    if (!linkMode) {
      setLinkMode(roomId);
    } else if (linkMode === roomId) {
      setLinkMode(null);
    } else {
      toggleAdjacency(planId, linkMode, roomId);
      setLinkMode(null);
    }
  };

  const assignedCount = plan.rooms.filter(r => r.paletteId).length;
  const adjacencyCount = plan.rooms.reduce((sum, r) => sum + (r.adjacentTo?.length || 0), 0) / 2;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={onBack} className="text-sm text-gray-500 hover:text-plumage-primary transition-colors">
          &larr; All Projects
        </button>
        <div className="flex gap-2">
          {plan.rooms.length >= 2 && adjacencyCount > 0 && (
            <button
              onClick={() => setShowFlow(!showFlow)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                showFlow ? 'bg-plumage-primary text-white' : 'bg-plumage-surface-alt text-gray-600 hover:text-gray-800'
              }`}
            >
              <BarChart3 className="w-3 h-3" /> Flow Check
            </button>
          )}
        </div>
      </div>

      <h2 className="font-display text-xl text-gray-800 mb-1">{plan.name}</h2>
      <p className="text-xs text-gray-400 mb-4">
        {plan.rooms.length} room{plan.rooms.length !== 1 ? 's' : ''} · {assignedCount} with palettes{adjacencyCount > 0 ? ` · ${adjacencyCount} adjacencies` : ''}
      </p>

      {/* Flow Results */}
      {showFlow && flowResult && (
        <div className="bg-white rounded-xl border border-plumage-border p-4 mb-4">
          {flowResult.pairs.length === 0 ? (
            <p className="text-sm text-gray-500">Assign palettes and mark adjacencies to check flow.</p>
          ) : (
            <>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Color Flow Analysis</span>
                {flowResult.overallRating && (
                  <span className={`text-xs font-semibold ${flowResult.overallRating.color}`}>
                    Overall: {flowResult.overallRating.label} ({flowResult.overallScore})
                  </span>
                )}
              </div>
              <div className="space-y-3">
                {flowResult.pairs.map((pair, i) => (
                  <div key={i} className={`rounded-lg p-3 ${pair.overallRating.bg}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        {pair.roomA.name} &harr; {pair.roomB.name}
                      </span>
                      <span className={`text-xs font-semibold ${pair.overallRating.color}`}>
                        {pair.overallRating.label}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {pair.details.map((d, j) => (
                        <div key={j} className="flex items-center gap-1.5">
                          <div className="flex gap-0.5">
                            <div className="w-3 h-3 rounded-sm border border-gray-200" style={{ backgroundColor: d.hexA }} />
                            <div className="w-3 h-3 rounded-sm border border-gray-200" style={{ backgroundColor: d.hexB }} />
                          </div>
                          <span className="text-[10px] text-gray-500">{d.surface}</span>
                          <span className={`text-[10px] font-medium ${d.rating.color}`}>{d.deltaE}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1">{pair.overallRating.description}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Room Cards */}
      <div className="space-y-3 mb-4">
        {plan.rooms.map(room => {
          const bird = room.paletteId ? birds.find(b => b.id === room.paletteId) : null;
          const isLinking = linkMode === room.id;
          const isLinkTarget = linkMode && linkMode !== room.id;
          const isAdjacent = linkMode && room.adjacentTo?.includes(linkMode);

          return (
            <div
              key={room.id}
              className={`bg-white rounded-xl border p-4 transition-all ${
                isLinking ? 'border-plumage-primary ring-2 ring-plumage-primary/20' :
                isLinkTarget ? 'border-blue-300 cursor-pointer hover:border-blue-400' :
                'border-plumage-border'
              }`}
              onClick={() => isLinkTarget && handleLink(room.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{room.name}</p>
                  {bird && <p className="text-[10px] text-gray-400">{bird.name}</p>}
                </div>
                <div className="flex items-center gap-1">
                  {room.adjacentTo?.length > 0 && (
                    <span className="text-[9px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded">
                      {room.adjacentTo.length} link{room.adjacentTo.length !== 1 ? 's' : ''}
                    </span>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleLink(room.id); }}
                    className={`p-1 rounded-lg transition-colors ${
                      isLinking ? 'bg-plumage-primary/10 text-plumage-primary' :
                      isAdjacent ? 'bg-blue-100 text-blue-500' :
                      'hover:bg-gray-100 text-gray-400'
                    }`}
                    title={isLinking ? 'Click another room to link' : isAdjacent ? 'Already linked' : 'Link to adjacent room'}
                  >
                    {isAdjacent ? <Unlink className="w-3.5 h-3.5" /> : <Link className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeRoomFromPlan(planId, room.id); }}
                    className="p-1 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-gray-300 hover:text-red-400" />
                  </button>
                </div>
              </div>
              {bird ? (
                <PaletteStrip colors={bird.colors} height="h-6" clickable={false} />
              ) : (
                <button
                  onClick={(e) => { e.stopPropagation(); setAssigningRoom(room.id); }}
                  className="text-xs text-plumage-primary font-medium hover:underline"
                >
                  Assign palette
                </button>
              )}
              {bird && (
                <button
                  onClick={(e) => { e.stopPropagation(); setAssigningRoom(room.id); }}
                  className="text-[10px] text-gray-400 hover:text-plumage-primary mt-1 inline-block"
                >
                  Change palette
                </button>
              )}
            </div>
          );
        })}
      </div>

      {linkMode && (
        <p className="text-xs text-plumage-primary bg-plumage-primary/5 rounded-lg px-3 py-2 mb-4 text-center">
          Click another room to {plan.rooms.find(r => r.id === linkMode)?.adjacentTo?.length ? 'toggle' : 'create'} an adjacency link
          <button onClick={() => setLinkMode(null)} className="ml-2 underline">Cancel</button>
        </p>
      )}

      {/* Add Room */}
      {addingRoom ? (
        <div className="bg-plumage-surface-alt rounded-xl p-4 mb-4">
          <select
            value={newRoomName}
            onChange={e => setNewRoomName(e.target.value)}
            className="w-full px-3 py-2 border border-plumage-border rounded-xl text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-plumage-primary/30"
          >
            {ROOM_TYPES.map(rt => <option key={rt} value={rt}>{rt}</option>)}
          </select>
          <div className="flex gap-2">
            <button onClick={handleAddRoom} className="px-3 py-1.5 bg-plumage-primary text-white rounded-lg text-xs font-medium">Add Room</button>
            <button onClick={() => setAddingRoom(false)} className="px-3 py-1.5 text-gray-500 text-xs">Cancel</button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAddingRoom(true)}
          className="w-full flex items-center justify-center gap-1.5 px-4 py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-400 hover:border-plumage-primary hover:text-plumage-primary transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Room
        </button>
      )}

      {/* Palette Search Modal */}
      {assigningRoom && (
        <PaletteSearch
          onSelect={(paletteId) => updateRoomInPlan(planId, assigningRoom, { paletteId })}
          onClose={() => setAssigningRoom(null)}
        />
      )}
    </div>
  );
}

export default function RoomPlanner() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  if (selectedPlan) {
    return <ProjectDetail planId={selectedPlan} onBack={() => setSelectedPlan(null)} />;
  }

  return <ProjectList onSelect={setSelectedPlan} />;
}
