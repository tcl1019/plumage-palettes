import React from 'react';
import { HARMONY_COLORS, SEASON_STYLES, ROLE_LABELS } from '../../data/constants';

export function StatusBadge({ status }) {
  const colors = {
    'Least Concern': 'bg-green-100 text-green-800 border-green-300',
    'Near Threatened': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'Threatened': 'bg-red-100 text-red-800 border-red-300',
  };
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${colors[status] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
      {status}
    </span>
  );
}

export function HarmonyBadge({ type }) {
  const style = HARMONY_COLORS[type];
  if (!style) return null;
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${style.bg} ${style.text}`}>
      {type}
    </span>
  );
}

export function SeasonBadge({ season }) {
  const style = SEASON_STYLES[season];
  if (!style) return null;
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${style.bg} ${style.text}`}>
      {style.label}
    </span>
  );
}

export function RoleBadge({ role, compact = false }) {
  const style = ROLE_LABELS[role];
  if (!style) return null;
  const shortLabel = role === 'dominant' ? '60%' : role === 'secondary' ? '30%' : role === 'accent' ? '10%' : role === 'neutral' ? 'Trim' : 'Feature';
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${style.bg} ${style.text}`}>
      {compact ? shortLabel : style.label}
    </span>
  );
}
