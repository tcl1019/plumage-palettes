import { useState, useEffect, useCallback, createContext, useContext } from 'react';

const STORAGE_KEY = 'plumage_studio';

const defaultStudio = {
  version: 1,
  savedPalettes: [],
  projects: [],
  customPalettes: [],
  quizHistory: [],
  housePlans: [],
  aiApiKey: '',
};

function loadStudio() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Migrate old API key if it exists
      const oldKey = localStorage.getItem('plumage_api_key');
      if (oldKey) {
        const studio = { ...defaultStudio, aiApiKey: oldKey };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(studio));
        localStorage.removeItem('plumage_api_key');
        return studio;
      }
      return defaultStudio;
    }
    return { ...defaultStudio, ...JSON.parse(raw) };
  } catch {
    return defaultStudio;
  }
}

function saveStudio(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useStudio() {
  const [studio, setStudio] = useState(loadStudio);

  const update = useCallback((updater) => {
    setStudio(prev => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      saveStudio(next);
      return next;
    });
  }, []);

  // Palette saves
  const savePalette = useCallback((birdId) => {
    update(prev => ({
      ...prev,
      savedPalettes: prev.savedPalettes.includes(birdId)
        ? prev.savedPalettes
        : [...prev.savedPalettes, birdId],
    }));
  }, [update]);

  const unsavePalette = useCallback((birdId) => {
    update(prev => ({
      ...prev,
      savedPalettes: prev.savedPalettes.filter(id => id !== birdId),
    }));
  }, [update]);

  const toggleSave = useCallback((birdId) => {
    update(prev => ({
      ...prev,
      savedPalettes: prev.savedPalettes.includes(birdId)
        ? prev.savedPalettes.filter(id => id !== birdId)
        : [...prev.savedPalettes, birdId],
    }));
  }, [update]);

  const isSaved = useCallback((birdId) => {
    return studio.savedPalettes.includes(birdId);
  }, [studio.savedPalettes]);

  // Projects
  const createProject = useCallback((project) => {
    const newProject = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      notes: '',
      ...project,
    };
    update(prev => ({ ...prev, projects: [...prev.projects, newProject] }));
    return newProject.id;
  }, [update]);

  const updateProject = useCallback((id, partial) => {
    update(prev => ({
      ...prev,
      projects: prev.projects.map(p =>
        p.id === id ? { ...p, ...partial, updatedAt: Date.now() } : p
      ),
    }));
  }, [update]);

  const deleteProject = useCallback((id) => {
    update(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id),
    }));
  }, [update]);

  // Custom palettes
  const createCustomPalette = useCallback((palette) => {
    const newPalette = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      createdAt: Date.now(),
      ...palette,
    };
    update(prev => ({ ...prev, customPalettes: [...prev.customPalettes, newPalette] }));
    return newPalette.id;
  }, [update]);

  const deleteCustomPalette = useCallback((id) => {
    update(prev => ({
      ...prev,
      customPalettes: prev.customPalettes.filter(p => p.id !== id),
    }));
  }, [update]);

  // Quiz history
  const saveQuizResult = useCallback((result) => {
    update(prev => ({
      ...prev,
      quizHistory: [{ ...result, createdAt: Date.now() }, ...prev.quizHistory].slice(0, 3),
    }));
  }, [update]);

  // API key
  const setApiKey = useCallback((key) => {
    update(prev => ({ ...prev, aiApiKey: key }));
  }, [update]);

  // House Plans
  const createHousePlan = useCallback((name) => {
    const plan = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      rooms: [],
    };
    update(prev => ({ ...prev, housePlans: [...(prev.housePlans || []), plan] }));
    return plan.id;
  }, [update]);

  const deleteHousePlan = useCallback((id) => {
    update(prev => ({
      ...prev,
      housePlans: (prev.housePlans || []).filter(p => p.id !== id),
    }));
  }, [update]);

  const updateHousePlan = useCallback((id, partial) => {
    update(prev => ({
      ...prev,
      housePlans: (prev.housePlans || []).map(p =>
        p.id === id ? { ...p, ...partial, updatedAt: Date.now() } : p
      ),
    }));
  }, [update]);

  const addRoomToPlan = useCallback((planId, room) => {
    const newRoom = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      adjacentTo: [],
      ...room,
    };
    update(prev => ({
      ...prev,
      housePlans: (prev.housePlans || []).map(p =>
        p.id === planId ? { ...p, rooms: [...p.rooms, newRoom], updatedAt: Date.now() } : p
      ),
    }));
    return newRoom.id;
  }, [update]);

  const updateRoomInPlan = useCallback((planId, roomId, partial) => {
    update(prev => ({
      ...prev,
      housePlans: (prev.housePlans || []).map(p =>
        p.id === planId ? {
          ...p,
          rooms: p.rooms.map(r => r.id === roomId ? { ...r, ...partial } : r),
          updatedAt: Date.now(),
        } : p
      ),
    }));
  }, [update]);

  const removeRoomFromPlan = useCallback((planId, roomId) => {
    update(prev => ({
      ...prev,
      housePlans: (prev.housePlans || []).map(p =>
        p.id === planId ? {
          ...p,
          rooms: p.rooms
            .filter(r => r.id !== roomId)
            .map(r => ({ ...r, adjacentTo: (r.adjacentTo || []).filter(id => id !== roomId) })),
          updatedAt: Date.now(),
        } : p
      ),
    }));
  }, [update]);

  const toggleAdjacency = useCallback((planId, roomIdA, roomIdB) => {
    update(prev => ({
      ...prev,
      housePlans: (prev.housePlans || []).map(p => {
        if (p.id !== planId) return p;
        return {
          ...p,
          rooms: p.rooms.map(r => {
            if (r.id === roomIdA) {
              const adj = r.adjacentTo || [];
              return { ...r, adjacentTo: adj.includes(roomIdB) ? adj.filter(id => id !== roomIdB) : [...adj, roomIdB] };
            }
            if (r.id === roomIdB) {
              const adj = r.adjacentTo || [];
              return { ...r, adjacentTo: adj.includes(roomIdA) ? adj.filter(id => id !== roomIdA) : [...adj, roomIdA] };
            }
            return r;
          }),
          updatedAt: Date.now(),
        };
      }),
    }));
  }, [update]);

  return {
    studio,
    savePalette,
    unsavePalette,
    toggleSave,
    isSaved,
    createProject,
    updateProject,
    deleteProject,
    createCustomPalette,
    deleteCustomPalette,
    saveQuizResult,
    setApiKey,
    createHousePlan,
    deleteHousePlan,
    updateHousePlan,
    addRoomToPlan,
    updateRoomInPlan,
    removeRoomFromPlan,
    toggleAdjacency,
  };
}

// Context
export const StudioContext = createContext(null);

export function useStudioContext() {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error('useStudioContext must be used within StudioContext.Provider');
  return ctx;
}
