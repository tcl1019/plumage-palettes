import React, { useState, useRef } from 'react';
import { Home, BedDouble, CookingPot, Bath } from 'lucide-react';
import { mapBirdToRoomColors, getBirdHighestRatedRoom } from '../../utils/paletteHelpers';
import { hexToRgb } from '../../utils/colorUtils';

const ROOM_OPTIONS = [
  { id: 'living-room', label: 'Living', Icon: Home },
  { id: 'bedroom', label: 'Bedroom', Icon: BedDouble },
  { id: 'kitchen', label: 'Kitchen', Icon: CookingPot },
  { id: 'bathroom', label: 'Bath', Icon: Bath },
];

/* ── Color helpers ──────────────────────────────────────── */

function lighten(hex, amt) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return '#' + [rgb.r, rgb.g, rgb.b]
    .map(v => Math.round(v + (255 - v) * amt).toString(16).padStart(2, '0'))
    .join('');
}

function darken(hex, amt) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return '#' + [rgb.r, rgb.g, rgb.b]
    .map(v => Math.round(v * (1 - amt)).toString(16).padStart(2, '0'))
    .join('');
}

/* ── One-point perspective geometry ─────────────────────── */
// Back wall rectangle defines the vanishing perspective
const BW = { l: 20, t: 8, r: 80, b: 56 }; // % of container

const CLIPS = {
  ceiling: `polygon(0% 0%, 100% 0%, ${BW.r}% ${BW.t}%, ${BW.l}% ${BW.t}%)`,
  floor:   `polygon(${BW.l}% ${BW.b}%, ${BW.r}% ${BW.b}%, 100% 100%, 0% 100%)`,
  leftW:   `polygon(0% 0%, ${BW.l}% ${BW.t}%, ${BW.l}% ${BW.b}%, 0% 100%)`,
  rightW:  `polygon(${BW.r}% ${BW.t}%, 100% 0%, 100% 100%, ${BW.r}% ${BW.b}%)`,
};

/* ── Interactive surface ────────────────────────────────── */

function Surface({ role, label, hex, clip, color, gradient, hovered, setHovered, style = {} }) {
  const isActive = hovered?.role === role && hovered?.label === label;
  const isDimmed = hovered && !isActive;
  return (
    <div
      onMouseEnter={() => setHovered({ role, label, hex })}
      className="absolute inset-0"
      style={{
        clipPath: clip,
        backgroundColor: color,
        backgroundImage: gradient || 'none',
        opacity: isDimmed ? 0.55 : 1,
        filter: isActive ? 'brightness(1.06)' : 'none',
        transition: 'opacity 200ms, filter 200ms, background-color 400ms',
        cursor: 'pointer',
        ...style,
      }}
    />
  );
}

/* ── Interactive furniture piece ─────────────────────────── */

function Piece({ role, label, hex, hovered, setHovered, className = '', style = {}, children }) {
  const isActive = hovered?.role === role && hovered?.label === label;
  const isDimmed = hovered && !isActive;
  return (
    <div
      onMouseEnter={() => setHovered({ role, label, hex })}
      className={`absolute ${className}`}
      style={{
        opacity: isDimmed ? 0.45 : 1,
        filter: isActive ? 'brightness(1.06)' : 'none',
        transition: 'opacity 200ms, filter 200ms, background-color 400ms',
        cursor: 'pointer',
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* ── Room shell (shared perspective geometry) ───────────── */

function RoomShell({ colors, hovered, setHovered, floorGradient, children }) {
  return (
    <>
      {/* Ceiling */}
      <Surface
        role="ceiling" label="Ceiling" hex={colors.ceiling}
        clip={CLIPS.ceiling} color={colors.ceiling}
        gradient={`linear-gradient(180deg, ${lighten(colors.ceiling, 0.03)} 0%, ${darken(colors.ceiling, 0.02)} 100%)`}
        hovered={hovered} setHovered={setHovered}
      />

      {/* Left wall (shadow side) */}
      <Surface
        role="walls" label="Walls" hex={colors.walls}
        clip={CLIPS.leftW} color={darken(colors.walls, 0.07)}
        gradient={`linear-gradient(90deg, ${darken(colors.walls, 0.12)} 0%, ${darken(colors.walls, 0.04)} 100%)`}
        hovered={hovered} setHovered={setHovered}
      />

      {/* Right wall (light side) */}
      <Surface
        role="walls" label="Walls" hex={colors.walls}
        clip={CLIPS.rightW} color={lighten(colors.walls, 0.02)}
        gradient={`linear-gradient(270deg, ${lighten(colors.walls, 0.04)} 0%, ${colors.walls} 100%)`}
        hovered={hovered} setHovered={setHovered}
      />

      {/* Floor */}
      <Surface
        role="floor" label="Floor" hex={colors.floor}
        clip={CLIPS.floor} color={colors.floor}
        gradient={floorGradient || `linear-gradient(180deg, ${darken(colors.floor, 0.04)} 0%, ${colors.floor} 40%, ${lighten(colors.floor, 0.03)} 100%)`}
        hovered={hovered} setHovered={setHovered}
      />

      {/* Back wall */}
      <Surface
        role="walls" label="Walls" hex={colors.walls}
        clip={`inset(${BW.t}% ${100 - BW.r}% ${100 - BW.b}% ${BW.l}%)`}
        color={colors.walls}
        gradient={`linear-gradient(180deg, ${lighten(colors.walls, 0.03)} 0%, ${colors.walls} 60%, ${darken(colors.walls, 0.02)} 100%)`}
        hovered={hovered} setHovered={setHovered}
      />

      {/* Baseboard trim — thin strip at back wall bottom */}
      <Piece role="trim" label="Trim" hex={colors.trim} hovered={hovered} setHovered={setHovered}
        style={{
          left: `${BW.l}%`, top: `${BW.b - 1.2}%`,
          width: `${BW.r - BW.l}%`, height: '1.5%',
          backgroundColor: colors.trim,
        }}
      />

      {/* Floor edge shadow */}
      <div className="absolute pointer-events-none" style={{
        left: `${BW.l}%`, top: `${BW.b}%`,
        width: `${BW.r - BW.l}%`, height: '3%',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.08) 0%, transparent 100%)',
      }} />

      {/* Corner shadow — left wall meets back wall */}
      <div className="absolute pointer-events-none" style={{
        left: `${BW.l}%`, top: `${BW.t}%`,
        width: '1.5%', height: `${BW.b - BW.t}%`,
        background: 'linear-gradient(90deg, rgba(0,0,0,0.06) 0%, transparent 100%)',
      }} />

      {children}
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   LIVING ROOM
   ════════════════════════════════════════════════════════════ */

function LivingRoom({ colors, hovered, setHovered }) {
  return (
    <RoomShell colors={colors} hovered={hovered} setHovered={setHovered}>
      {/* ── Window on back wall ── */}
      <div className="absolute pointer-events-none" style={{
        left: '26%', top: '14%', width: '14%', height: '26%',
        border: `3px solid ${colors.trim}`,
        borderRadius: '2px',
        backgroundColor: '#D8E6F0',
      }}>
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-[2px] p-[2px]">
          {[0,1,2,3].map(i => (
            <div key={i} style={{ backgroundColor: i % 2 === 0 ? '#DCE8F2' : '#D0DFEC', borderRadius: '1px' }} />
          ))}
        </div>
      </div>

      {/* ── Curtains ── */}
      <Piece role="textiles" label="Curtains" hex={colors.textiles} hovered={hovered} setHovered={setHovered}>
        <div className="absolute" style={{
          left: '22.5%', top: '12%', width: '3.5%', height: '32%',
          backgroundColor: colors.textiles, borderRadius: '2px',
          boxShadow: `inset -4px 0 8px ${darken(colors.textiles, 0.08)}`,
        }} />
        <div className="absolute" style={{
          left: '39%', top: '12%', width: '3.5%', height: '32%',
          backgroundColor: colors.textiles, borderRadius: '2px',
          boxShadow: `inset 4px 0 8px ${darken(colors.textiles, 0.08)}`,
        }} />
        {/* Curtain rod */}
        <div className="absolute" style={{
          left: '22%', top: '11.5%', width: '21%', height: '0.6%',
          backgroundColor: darken(colors.trim, 0.3), borderRadius: '2px',
        }} />
      </Piece>

      {/* ── Wall art ── */}
      <Piece role="accents" label="Wall Art" hex={colors.accents} hovered={hovered} setHovered={setHovered}
        style={{
          left: '48%', top: '15%', width: '16%', height: '20%',
          backgroundColor: lighten(colors.walls, 0.06),
          border: `3px solid ${colors.accents}`,
          borderRadius: '3px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <div className="absolute inset-2 overflow-hidden rounded-sm" style={{ backgroundColor: lighten(colors.walls, 0.1) }}>
          <div className="absolute" style={{
            left: '20%', top: '25%', width: '35%', height: '35%',
            borderRadius: '50%', backgroundColor: colors.accents, opacity: 0.3,
          }} />
          <div className="absolute" style={{
            left: '45%', top: '45%', width: '25%', height: '25%',
            borderRadius: '50%', backgroundColor: lighten(colors.accents, 0.2), opacity: 0.4,
          }} />
        </div>
      </Piece>

      {/* ── Area rug (on floor) ── */}
      <Piece role="textiles" label="Rug" hex={colors.textiles} hovered={hovered} setHovered={setHovered}
        style={{
          left: '22%', top: '62%', width: '56%', height: '24%',
          backgroundColor: lighten(colors.textiles, 0.15),
          borderRadius: '4px',
          opacity: 0.55,
        }}
      >
        <div className="absolute inset-[6%] rounded" style={{
          border: `1px solid ${colors.textiles}`,
          opacity: 0.4,
        }} />
      </Piece>

      {/* ── Sofa — back cushions ── */}
      <Piece role="textiles" label="Sofa" hex={colors.textiles} hovered={hovered} setHovered={setHovered}>
        {/* Back */}
        <div className="absolute" style={{
          left: '28%', top: '38%', width: '44%', height: '12%',
          backgroundColor: colors.textiles,
          borderRadius: '8px 8px 0 0',
          boxShadow: `0 -2px 6px ${darken(colors.textiles, 0.1)}30`,
        }}>
          {/* Cushion dividers */}
          <div className="absolute" style={{ left: '33%', top: '8%', width: '1px', height: '84%', backgroundColor: darken(colors.textiles, 0.06) }} />
          <div className="absolute" style={{ left: '66%', top: '8%', width: '1px', height: '84%', backgroundColor: darken(colors.textiles, 0.06) }} />
        </div>
        {/* Seat */}
        <div className="absolute" style={{
          left: '26%', top: '49%', width: '48%', height: '8%',
          backgroundColor: darken(colors.textiles, 0.04),
          borderRadius: '0 0 5px 5px',
          boxShadow: `0 4px 12px rgba(0,0,0,0.12)`,
        }} />
        {/* Left arm */}
        <div className="absolute" style={{
          left: '25%', top: '40%', width: '4%', height: '17%',
          backgroundColor: darken(colors.textiles, 0.1),
          borderRadius: '6px 0 4px 4px',
        }} />
        {/* Right arm */}
        <div className="absolute" style={{
          left: '71%', top: '40%', width: '4%', height: '17%',
          backgroundColor: darken(colors.textiles, 0.1),
          borderRadius: '0 6px 4px 4px',
        }} />
      </Piece>

      {/* ── Throw pillows ── */}
      <Piece role="accents" label="Throw Pillows" hex={colors.accents} hovered={hovered} setHovered={setHovered}>
        <div className="absolute" style={{
          left: '32%', top: '39%', width: '7%', height: '8%',
          backgroundColor: colors.accents, borderRadius: '30%',
          transform: 'rotate(-6deg)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }} />
        <div className="absolute" style={{
          left: '61%', top: '39%', width: '7%', height: '8%',
          backgroundColor: colors.accents, borderRadius: '30%',
          transform: 'rotate(6deg)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }} />
        <div className="absolute" style={{
          left: '47%', top: '40%', width: '6%', height: '7%',
          backgroundColor: lighten(colors.accents, 0.15), borderRadius: '30%',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }} />
      </Piece>

      {/* ── Coffee table ── */}
      <Piece role="feature" label="Coffee Table" hex={colors.feature} hovered={hovered} setHovered={setHovered}>
        <div className="absolute" style={{
          left: '35%', top: '62%', width: '30%', height: '3%',
          backgroundColor: colors.feature, borderRadius: '3px',
          boxShadow: '0 3px 8px rgba(0,0,0,0.12)',
        }} />
        {/* Legs */}
        <div className="absolute" style={{ left: '37%', top: '65%', width: '1%', height: '4%', backgroundColor: darken(colors.feature, 0.2) }} />
        <div className="absolute" style={{ left: '62%', top: '65%', width: '1%', height: '4%', backgroundColor: darken(colors.feature, 0.2) }} />
      </Piece>

      {/* ── Floor lamp ── */}
      <div className="absolute pointer-events-none" style={{
        left: '74%', top: '22%', width: '0.5%', height: '30%',
        backgroundColor: darken(colors.feature, 0.25),
      }} />
      <div className="absolute pointer-events-none" style={{
        left: '71.5%', top: '20%', width: '6%', height: '4%',
        backgroundColor: lighten(colors.textiles, 0.3),
        borderRadius: '50%', opacity: 0.7,
      }} />
    </RoomShell>
  );
}

/* ════════════════════════════════════════════════════════════
   BEDROOM
   ════════════════════════════════════════════════════════════ */

function Bedroom({ colors, hovered, setHovered }) {
  return (
    <RoomShell colors={colors} hovered={hovered} setHovered={setHovered}>
      {/* ── Window on back wall ── */}
      <div className="absolute pointer-events-none" style={{
        left: '58%', top: '13%', width: '14%', height: '24%',
        border: `3px solid ${colors.trim}`, borderRadius: '2px',
        backgroundColor: '#D8E6F0',
      }}>
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-[2px] p-[2px]">
          {[0,1,2,3].map(i => (
            <div key={i} style={{ backgroundColor: i % 2 === 0 ? '#DCE8F2' : '#D0DFEC', borderRadius: '1px' }} />
          ))}
        </div>
      </div>

      {/* ── Curtains ── */}
      <Piece role="textiles" label="Curtains" hex={colors.textiles} hovered={hovered} setHovered={setHovered}>
        <div className="absolute" style={{
          left: '55%', top: '11%', width: '3.5%', height: '30%',
          backgroundColor: colors.textiles, borderRadius: '2px',
          boxShadow: `inset -3px 0 6px ${darken(colors.textiles, 0.08)}`,
        }} />
        <div className="absolute" style={{
          left: '71.5%', top: '11%', width: '3.5%', height: '30%',
          backgroundColor: colors.textiles, borderRadius: '2px',
          boxShadow: `inset 3px 0 6px ${darken(colors.textiles, 0.08)}`,
        }} />
        <div className="absolute" style={{
          left: '54.5%', top: '10.5%', width: '21%', height: '0.6%',
          backgroundColor: darken(colors.trim, 0.3), borderRadius: '2px',
        }} />
      </Piece>

      {/* ── Headboard ── */}
      <Piece role="feature" label="Headboard" hex={colors.feature} hovered={hovered} setHovered={setHovered}
        style={{
          left: '28%', top: '26%', width: '35%', height: '18%',
          backgroundColor: colors.feature,
          borderRadius: '6px 6px 0 0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        {/* Upholstery tufting */}
        <div className="absolute" style={{ left: '33%', top: '10%', width: '1px', height: '80%', backgroundColor: darken(colors.feature, 0.06), opacity: 0.5 }} />
        <div className="absolute" style={{ left: '66%', top: '10%', width: '1px', height: '80%', backgroundColor: darken(colors.feature, 0.06), opacity: 0.5 }} />
      </Piece>

      {/* ── Bedding ── */}
      <Piece role="textiles" label="Bedding" hex={colors.textiles} hovered={hovered} setHovered={setHovered}>
        {/* Duvet */}
        <div className="absolute" style={{
          left: '26%', top: '43%', width: '39%', height: '14%',
          backgroundColor: colors.textiles,
          borderRadius: '0 0 4px 4px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}>
          {/* Fold line */}
          <div className="absolute" style={{
            left: 0, right: 0, top: '18%', height: '2px',
            backgroundColor: darken(colors.textiles, 0.05), opacity: 0.4,
          }} />
        </div>
        {/* Bed frame */}
        <div className="absolute" style={{
          left: '25%', top: '56.5%', width: '41%', height: '1.5%',
          backgroundColor: darken(colors.feature, 0.15),
          borderRadius: '0 0 3px 3px',
        }} />
      </Piece>

      {/* ── Pillows ── */}
      <Piece role="accents" label="Pillows" hex={colors.accents} hovered={hovered} setHovered={setHovered}>
        <div className="absolute" style={{
          left: '30%', top: '38%', width: '10%', height: '6%',
          backgroundColor: colors.accents, borderRadius: '25%',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }} />
        <div className="absolute" style={{
          left: '41%', top: '38%', width: '10%', height: '6%',
          backgroundColor: lighten(colors.accents, 0.1), borderRadius: '25%',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }} />
        <div className="absolute" style={{
          left: '52%', top: '38%', width: '10%', height: '6%',
          backgroundColor: colors.accents, borderRadius: '25%',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }} />
      </Piece>

      {/* ── Nightstand left ── */}
      <Piece role="feature" label="Nightstand" hex={colors.feature} hovered={hovered} setHovered={setHovered}>
        <div className="absolute" style={{
          left: '22%', top: '42%', width: '6%', height: '10%',
          backgroundColor: colors.feature, borderRadius: '3px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        }}>
          <div className="absolute" style={{ left: '15%', top: '40%', width: '70%', height: '1px', backgroundColor: darken(colors.feature, 0.08) }} />
          <div className="absolute" style={{ left: '35%', top: '55%', width: '30%', height: '6%', backgroundColor: lighten(colors.feature, 0.15), borderRadius: '1px' }} />
        </div>
      </Piece>

      {/* ── Table lamp ── */}
      <div className="absolute pointer-events-none" style={{
        left: '23.5%', top: '37%', width: '3%', height: '2.5%',
        backgroundColor: lighten(colors.textiles, 0.3),
        borderRadius: '50%', opacity: 0.7,
      }} />
      <div className="absolute pointer-events-none" style={{
        left: '24.5%', top: '39%', width: '1%', height: '3%',
        backgroundColor: darken(colors.feature, 0.25),
      }} />

      {/* ── Area rug ── */}
      <Piece role="textiles" label="Rug" hex={colors.textiles} hovered={hovered} setHovered={setHovered}
        style={{
          left: '24%', top: '63%', width: '46%', height: '22%',
          backgroundColor: lighten(colors.textiles, 0.18),
          borderRadius: '4px', opacity: 0.5,
        }}
      />
    </RoomShell>
  );
}

/* ════════════════════════════════════════════════════════════
   KITCHEN
   ════════════════════════════════════════════════════════════ */

function Kitchen({ colors, hovered, setHovered }) {
  const tileGradient = `
    linear-gradient(180deg, ${darken(colors.floor, 0.03)} 0%, ${colors.floor} 50%, ${lighten(colors.floor, 0.02)} 100%),
    repeating-linear-gradient(90deg, transparent, transparent 48px, rgba(0,0,0,0.03) 48px, rgba(0,0,0,0.03) 50px),
    repeating-linear-gradient(180deg, transparent, transparent 48px, rgba(0,0,0,0.03) 48px, rgba(0,0,0,0.03) 50px)
  `;
  return (
    <RoomShell colors={colors} hovered={hovered} setHovered={setHovered} floorGradient={tileGradient}>
      {/* ── Upper cabinets ── */}
      <Piece role="feature" label="Upper Cabinets" hex={colors.feature} hovered={hovered} setHovered={setHovered}>
        {[0, 1, 2].map(i => (
          <div key={i} className="absolute" style={{
            left: `${24 + i * 17}%`, top: '12%', width: '15%', height: '16%',
            backgroundColor: colors.feature, borderRadius: '3px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          }}>
            <div className="absolute inset-[6%] rounded-sm" style={{
              backgroundColor: darken(colors.feature, 0.03),
            }} />
            <div className="absolute" style={{
              left: '40%', top: '45%', width: '20%', height: '4%',
              backgroundColor: lighten(colors.feature, 0.2), borderRadius: '1px',
            }} />
          </div>
        ))}
      </Piece>

      {/* ── Backsplash ── */}
      <Piece role="accents" label="Backsplash" hex={colors.accents} hovered={hovered} setHovered={setHovered}
        style={{
          left: `${BW.l + 2}%`, top: '29%', width: `${BW.r - BW.l - 4}%`, height: '9%',
          backgroundColor: colors.accents,
        }}
      >
        {/* Tile lines */}
        {[0,1,2,3,4,5,6,7,8].map(i => (
          <div key={i} className="absolute" style={{
            left: `${i * 12}%`, top: 0, width: '1px', height: '100%',
            backgroundColor: lighten(colors.accents, 0.12),
          }} />
        ))}
        <div className="absolute" style={{ left: 0, top: '50%', width: '100%', height: '1px', backgroundColor: lighten(colors.accents, 0.12) }} />
      </Piece>

      {/* ── Countertop ── */}
      <Piece role="trim" label="Countertop" hex={colors.trim} hovered={hovered} setHovered={setHovered}
        style={{
          left: `${BW.l + 1}%`, top: '37.5%', width: `${BW.r - BW.l - 2}%`, height: '2.5%',
          backgroundColor: colors.trim, borderRadius: '1px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
        }}
      />

      {/* ── Lower cabinets ── */}
      <Piece role="feature" label="Lower Cabinets" hex={colors.feature} hovered={hovered} setHovered={setHovered}>
        {[0, 1, 2].map(i => (
          <div key={i} className="absolute" style={{
            left: `${24 + i * 17}%`, top: '40%', width: '15%', height: '14%',
            backgroundColor: colors.feature, borderRadius: '3px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
          }}>
            <div className="absolute" style={{ left: '8%', top: '8%', width: '38%', height: '84%', backgroundColor: darken(colors.feature, 0.03), borderRadius: '2px' }} />
            <div className="absolute" style={{ left: '54%', top: '8%', width: '38%', height: '84%', backgroundColor: darken(colors.feature, 0.03), borderRadius: '2px' }} />
            <div className="absolute" style={{ left: '38%', top: '42%', width: '10%', height: '5%', backgroundColor: lighten(colors.feature, 0.2), borderRadius: '1px' }} />
            <div className="absolute" style={{ left: '62%', top: '42%', width: '10%', height: '5%', backgroundColor: lighten(colors.feature, 0.2), borderRadius: '1px' }} />
          </div>
        ))}
      </Piece>

      {/* ── Kitchen island ── */}
      <Piece role="feature" label="Island" hex={colors.feature} hovered={hovered} setHovered={setHovered}>
        <div className="absolute" style={{
          left: '28%', top: '65%', width: '44%', height: '8%',
          backgroundColor: darken(colors.feature, 0.04), borderRadius: '4px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }} />
        <div className="absolute" style={{
          left: '28%', top: '63.5%', width: '44%', height: '2.5%',
          backgroundColor: colors.trim, borderRadius: '3px 3px 0 0',
        }} />
      </Piece>

      {/* ── Bar stools ── */}
      <Piece role="textiles" label="Seating" hex={colors.textiles} hovered={hovered} setHovered={setHovered}>
        {[38, 55].map(x => (
          <div key={x}>
            <div className="absolute" style={{
              left: `${x}%`, top: '74%', width: '5%', height: '3.5%',
              backgroundColor: colors.textiles, borderRadius: '30%',
              boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
            }} />
            <div className="absolute" style={{
              left: `${x + 2}%`, top: '77.5%', width: '1%', height: '8%',
              backgroundColor: darken(colors.feature, 0.2),
            }} />
          </div>
        ))}
      </Piece>

      {/* ── Pendant lights ── */}
      <div className="absolute pointer-events-none">
        {[38, 56].map(x => (
          <div key={x}>
            <div className="absolute" style={{
              left: `${x}%`, top: `${BW.t}%`, width: '0.3%', height: '6%',
              backgroundColor: darken(colors.trim, 0.2),
            }} />
            <div className="absolute" style={{
              left: `${x - 1.5}%`, top: `${BW.t + 5.5}%`, width: '3.5%', height: '2.5%',
              backgroundColor: lighten(colors.accents, 0.3), borderRadius: '50%', opacity: 0.7,
            }} />
          </div>
        ))}
      </div>
    </RoomShell>
  );
}

/* ════════════════════════════════════════════════════════════
   BATHROOM
   ════════════════════════════════════════════════════════════ */

function Bathroom({ colors, hovered, setHovered }) {
  const tileFloor = `
    linear-gradient(180deg, ${darken(colors.floor, 0.02)} 0%, ${colors.floor} 50%),
    repeating-linear-gradient(90deg, transparent, transparent 36px, rgba(0,0,0,0.04) 36px, rgba(0,0,0,0.04) 38px),
    repeating-linear-gradient(180deg, transparent, transparent 36px, rgba(0,0,0,0.04) 36px, rgba(0,0,0,0.04) 38px)
  `;
  return (
    <RoomShell colors={colors} hovered={hovered} setHovered={setHovered} floorGradient={tileFloor}>
      {/* ── Tile wainscoting (lower back wall) ── */}
      <Piece role="accents" label="Accent Tile" hex={colors.accents} hovered={hovered} setHovered={setHovered}>
        <div className="absolute" style={{
          left: `${BW.l}%`, top: '34%', width: `${BW.r - BW.l}%`, height: `${BW.b - 34}%`,
          backgroundColor: lighten(colors.accents, 0.2),
        }}>
          {/* Tile grid */}
          {Array.from({ length: 16 }, (_, i) => (
            <div key={`v${i}`} className="absolute" style={{
              left: `${i * 6.5}%`, top: 0, width: '1px', height: '100%',
              backgroundColor: lighten(colors.accents, 0.3),
            }} />
          ))}
          {[0, 1, 2].map(i => (
            <div key={`h${i}`} className="absolute" style={{
              left: 0, top: `${(i + 1) * 25}%`, width: '100%', height: '1px',
              backgroundColor: lighten(colors.accents, 0.3),
            }} />
          ))}
        </div>
        {/* Accent border strip */}
        <div className="absolute" style={{
          left: `${BW.l}%`, top: '33%', width: `${BW.r - BW.l}%`, height: '1.2%',
          backgroundColor: colors.accents,
        }} />
      </Piece>

      {/* ── Vanity cabinet ── */}
      <Piece role="feature" label="Vanity" hex={colors.feature} hovered={hovered} setHovered={setHovered}>
        <div className="absolute" style={{
          left: '30%', top: '36%', width: '26%', height: '16%',
          backgroundColor: colors.feature, borderRadius: '3px',
          boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
        }}>
          <div className="absolute" style={{ left: '5%', top: '8%', width: '42%', height: '84%', backgroundColor: darken(colors.feature, 0.04), borderRadius: '2px' }} />
          <div className="absolute" style={{ left: '53%', top: '8%', width: '42%', height: '84%', backgroundColor: darken(colors.feature, 0.04), borderRadius: '2px' }} />
          <div className="absolute" style={{ left: '42%', top: '42%', width: '6%', height: '8%', backgroundColor: lighten(colors.feature, 0.2), borderRadius: '1px' }} />
          <div className="absolute" style={{ left: '56%', top: '42%', width: '6%', height: '8%', backgroundColor: lighten(colors.feature, 0.2), borderRadius: '1px' }} />
        </div>
        {/* Countertop */}
        <div className="absolute" style={{
          left: '29%', top: '34.5%', width: '28%', height: '2%',
          backgroundColor: colors.trim, borderRadius: '2px',
        }} />
        {/* Sink */}
        <div className="absolute" style={{
          left: '38%', top: '35%', width: '10%', height: '1%',
          backgroundColor: darken(colors.trim, 0.08), borderRadius: '50%',
        }} />
      </Piece>

      {/* ── Mirror ── */}
      <div className="absolute" style={{
        left: '33%', top: '14%', width: '20%', height: '18%',
        backgroundColor: lighten(colors.walls, 0.12),
        border: `2px solid ${colors.trim}`, borderRadius: '4px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
        opacity: hovered ? 0.5 : 1,
        transition: 'opacity 200ms',
      }}>
        <div className="absolute" style={{
          left: '8%', top: '12%', width: '20%', height: '50%',
          backgroundColor: 'white', opacity: 0.06, borderRadius: '2px',
        }} />
      </div>

      {/* ── Towel rack + towels ── */}
      <Piece role="textiles" label="Towels" hex={colors.textiles} hovered={hovered} setHovered={setHovered}>
        <div className="absolute" style={{
          left: '63%', top: '22%', width: '10%', height: '0.5%',
          backgroundColor: darken(colors.trim, 0.2), borderRadius: '1px',
        }} />
        <div className="absolute" style={{
          left: '64%', top: '22.5%', width: '4%', height: '12%',
          backgroundColor: colors.textiles, borderRadius: '2px',
          boxShadow: `inset -2px 0 4px ${darken(colors.textiles, 0.06)}`,
        }} />
        <div className="absolute" style={{
          left: '68.5%', top: '22.5%', width: '4%', height: '10%',
          backgroundColor: lighten(colors.textiles, 0.08), borderRadius: '2px',
        }} />
      </Piece>

      {/* ── Bathtub ── */}
      <div className="absolute" style={{
        left: '60%', top: '60%', width: '22%', height: '14%',
        backgroundColor: lighten(colors.trim, 0.12),
        borderRadius: '8px',
        boxShadow: '0 3px 8px rgba(0,0,0,0.08)',
        opacity: hovered ? 0.5 : 1,
        transition: 'opacity 200ms',
      }}>
        <div className="absolute inset-[8%] rounded-md" style={{
          backgroundColor: lighten(colors.trim, 0.2),
        }} />
      </div>

      {/* ── Faucet ── */}
      <div className="absolute pointer-events-none" style={{
        left: '42%', top: '31%', width: '2%', height: '4%',
        backgroundColor: darken(colors.trim, 0.3), borderRadius: '1px 1px 0 0',
      }} />
    </RoomShell>
  );
}

/* ── Room map ───────────────────────────────────────────── */

const ROOM_SCENES = {
  'living-room': LivingRoom,
  'bedroom': Bedroom,
  'kitchen': Kitchen,
  'bathroom': Bathroom,
};

/* ── Color legend ───────────────────────────────────────── */

const LEGEND = [
  { key: 'walls', label: 'Walls', pct: '60%' },
  { key: 'textiles', label: 'Textiles', pct: '30%' },
  { key: 'accents', label: 'Accents', pct: '10%' },
  { key: 'feature', label: 'Feature' },
  { key: 'floor', label: 'Floor' },
];

function ColorLegend({ colors, hovered }) {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
      {LEGEND.map(({ key, label, pct }) => {
        const isActive = hovered?.role === key;
        const isDimmed = hovered && !isActive;
        return (
          <div key={key} className="flex items-center gap-1.5 transition-opacity duration-200"
            style={{ opacity: isDimmed ? 0.35 : 1 }}
          >
            <span className="w-3 h-3 rounded-sm border border-black/10 shrink-0"
              style={{
                backgroundColor: colors[key],
                boxShadow: isActive ? `0 0 0 2px ${colors[key]}40` : 'none',
                transition: 'box-shadow 200ms',
              }}
            />
            <span className={`text-xs ${isActive ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>
              {label}
            </span>
            {pct && <span className="text-[10px] text-gray-300">{pct}</span>}
          </div>
        );
      })}
    </div>
  );
}

/* ── Hover tooltip ──────────────────────────────────────── */

function Tooltip({ hovered, mousePos }) {
  if (!hovered) return null;
  return (
    <div
      className="absolute pointer-events-none z-20 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-900/90 text-white text-xs shadow-lg backdrop-blur-sm whitespace-nowrap"
      style={{
        left: Math.min(mousePos.x, window.innerWidth > 640 ? 280 : 200),
        top: Math.max(mousePos.y - 40, 8),
        transform: 'translateX(-50%)',
      }}
    >
      <span className="w-3 h-3 rounded-sm border border-white/20 shrink-0"
        style={{ backgroundColor: hovered.hex }}
      />
      <span className="font-medium">{hovered.label}</span>
      <span className="font-mono text-white/50">{hovered.hex}</span>
    </div>
  );
}

/* ── Compact (for CompareView thumbnails) ───────────────── */

function CompactRoom({ colors }) {
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-md border border-plumage-border/60 aspect-[16/9]">
      <div className="absolute inset-0">
        {/* Ceiling */}
        <div className="absolute inset-0" style={{ clipPath: CLIPS.ceiling, backgroundColor: colors.ceiling }} />
        {/* Walls */}
        <div className="absolute inset-0" style={{ clipPath: CLIPS.leftW, backgroundColor: darken(colors.walls, 0.06) }} />
        <div className="absolute inset-0" style={{ clipPath: CLIPS.rightW, backgroundColor: lighten(colors.walls, 0.02) }} />
        <div className="absolute inset-0" style={{
          clipPath: `inset(${BW.t}% ${100 - BW.r}% ${100 - BW.b}% ${BW.l}%)`,
          backgroundColor: colors.walls,
        }} />
        {/* Floor */}
        <div className="absolute inset-0" style={{ clipPath: CLIPS.floor, backgroundColor: colors.floor }} />
        {/* Baseboard */}
        <div className="absolute" style={{
          left: `${BW.l}%`, top: `${BW.b - 1}%`,
          width: `${BW.r - BW.l}%`, height: '1.2%',
          backgroundColor: colors.trim,
        }} />
        {/* Sofa silhouette */}
        <div className="absolute" style={{
          left: '30%', top: '40%', width: '40%', height: '10%',
          backgroundColor: colors.textiles, borderRadius: '6px 6px 0 0',
        }} />
        <div className="absolute" style={{
          left: '28%', top: '49%', width: '44%', height: '7%',
          backgroundColor: darken(colors.textiles, 0.04), borderRadius: '0 0 3px 3px',
        }} />
        {/* Pillows */}
        <div className="absolute" style={{
          left: '34%', top: '41%', width: '5%', height: '5%',
          backgroundColor: colors.accents, borderRadius: '25%',
        }} />
        <div className="absolute" style={{
          left: '61%', top: '41%', width: '5%', height: '5%',
          backgroundColor: colors.accents, borderRadius: '25%',
        }} />
        {/* Table */}
        <div className="absolute" style={{
          left: '36%', top: '62%', width: '28%', height: '2.5%',
          backgroundColor: colors.feature, borderRadius: '2px',
        }} />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════ */

export default function RoomVisualizer({ bird, defaultRoom, compact = false, colors: colorsProp }) {
  const bestRoom = defaultRoom || getBirdHighestRatedRoom(bird);
  const [activeRoom, setActiveRoom] = useState(bestRoom);
  const [hovered, setHovered] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const colors = colorsProp || mapBirdToRoomColors(bird);
  const RoomScene = ROOM_SCENES[activeRoom] || ROOM_SCENES['living-room'];

  if (compact) {
    return <CompactRoom colors={colors} />;
  }

  return (
    <div>
      {/* Room selector */}
      <div className="flex gap-1 mb-3">
        {ROOM_OPTIONS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => { setActiveRoom(id); setHovered(null); }}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeRoom === id
                ? 'bg-plumage-primary text-white shadow-sm'
                : 'bg-plumage-surface-alt text-gray-500 hover:text-gray-700 hover:bg-plumage-surface-alt/80'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Room scene */}
      <div
        ref={containerRef}
        className="relative rounded-2xl overflow-hidden shadow-md border border-plumage-border/60 aspect-[16/9] bg-gray-100"
        onMouseMove={(e) => {
          const rect = containerRef.current?.getBoundingClientRect();
          if (rect) setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        }}
        onMouseLeave={() => setHovered(null)}
      >
        <RoomScene colors={colors} hovered={hovered} setHovered={setHovered} />
        <Tooltip hovered={hovered} mousePos={mousePos} />
      </div>

      {/* Color legend */}
      <ColorLegend colors={colors} hovered={hovered} />
    </div>
  );
}
