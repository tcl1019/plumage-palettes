import React, { useRef, useEffect, useState } from 'react';
import { hexToRgb, rgbToHsl, hslToWheelCoord } from '../../utils/colorUtils';

const ROLE_SIZES = { dominant: 14, secondary: 11, accent: 8, highlight: 8 };

export default function HarmonyWheel({ colors, harmonyType, size = 280 }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const colorDotsRef = useRef([]);

  // Convert colors to HSL with position data
  const colorData = (colors || []).map(c => {
    if (!c || !c.hex) return null;
    const rgb = hexToRgb(c.hex);
    if (!rgb) return null;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return { ...c, hsl, rgb };
  }).filter(Boolean);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const outerR = size / 2 - 20;
    const innerR = outerR * 0.7;
    const midR = (outerR + innerR) / 2;

    // Clear
    ctx.clearRect(0, 0, size, size);

    // Draw HSL wheel ring
    for (let angle = 0; angle < 360; angle++) {
      const startRad = ((angle - 0.5) - 90) * Math.PI / 180;
      const endRad = ((angle + 0.5) - 90) * Math.PI / 180;
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerR, startRad, endRad);
      ctx.arc(centerX, centerY, innerR, endRad, startRad, true);
      ctx.closePath();
      ctx.fillStyle = `hsl(${angle}, 75%, 55%)`;
      ctx.fill();
    }

    // Draw inner circle background
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerR - 1, 0, Math.PI * 2);
    ctx.fillStyle = '#fafafa';
    ctx.fill();

    // Draw harmony connection lines
    if (colorData.length >= 2) {
      ctx.save();
      ctx.setLineDash([4, 3]);
      ctx.strokeStyle = 'rgba(120, 120, 120, 0.4)';
      ctx.lineWidth = 1.5;

      const dots = colorData.map(c => hslToWheelCoord(c.hsl.h, centerX, centerY, midR));

      if (harmonyType === 'complementary' && dots.length >= 2) {
        ctx.beginPath();
        ctx.moveTo(dots[0].x, dots[0].y);
        ctx.lineTo(dots[1].x, dots[1].y);
        ctx.stroke();
      } else if (harmonyType === 'triadic' && dots.length >= 3) {
        ctx.beginPath();
        ctx.moveTo(dots[0].x, dots[0].y);
        ctx.lineTo(dots[1].x, dots[1].y);
        ctx.lineTo(dots[2].x, dots[2].y);
        ctx.closePath();
        ctx.stroke();
      } else if (harmonyType === 'split-complementary' && dots.length >= 3) {
        ctx.beginPath();
        ctx.moveTo(dots[0].x, dots[0].y);
        ctx.lineTo(dots[1].x, dots[1].y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(dots[0].x, dots[0].y);
        ctx.lineTo(dots[2].x, dots[2].y);
        ctx.stroke();
      } else if (harmonyType === 'analogous') {
        // Draw arc connecting adjacent colors
        const hues = colorData.map(c => c.hsl.h).sort((a, b) => a - b);
        if (hues.length >= 2) {
          const startAngle = (hues[0] - 90) * Math.PI / 180;
          const endAngle = (hues[hues.length - 1] - 90) * Math.PI / 180;
          ctx.beginPath();
          ctx.arc(centerX, centerY, midR, startAngle, endAngle);
          ctx.stroke();
        }
      } else {
        // Default: connect all dots in order
        if (dots.length >= 2) {
          ctx.beginPath();
          ctx.moveTo(dots[0].x, dots[0].y);
          for (let i = 1; i < dots.length; i++) {
            ctx.lineTo(dots[i].x, dots[i].y);
          }
          if (dots.length > 2) ctx.closePath();
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    // Animate color dots from center outward
    const dotPositions = [];
    let animFrame;
    let progress = 0;

    const animateDots = () => {
      progress = Math.min(progress + 0.04, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic

      // Clear inner circle for dot rendering
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerR - 1, 0, Math.PI * 2);
      ctx.fillStyle = '#fafafa';
      ctx.fill();

      // Re-draw connection lines (so dots appear on top)
      if (progress >= 1 && colorData.length >= 2) {
        ctx.save();
        ctx.setLineDash([4, 3]);
        ctx.strokeStyle = 'rgba(120, 120, 120, 0.4)';
        ctx.lineWidth = 1.5;
        const finalDots = colorData.map(c => hslToWheelCoord(c.hsl.h, centerX, centerY, midR));
        if (harmonyType === 'complementary' && finalDots.length >= 2) {
          ctx.beginPath();
          ctx.moveTo(finalDots[0].x, finalDots[0].y);
          ctx.lineTo(finalDots[1].x, finalDots[1].y);
          ctx.stroke();
        } else if (harmonyType === 'triadic' && finalDots.length >= 3) {
          ctx.beginPath();
          ctx.moveTo(finalDots[0].x, finalDots[0].y);
          ctx.lineTo(finalDots[1].x, finalDots[1].y);
          ctx.lineTo(finalDots[2].x, finalDots[2].y);
          ctx.closePath();
          ctx.stroke();
        } else if (harmonyType === 'split-complementary' && finalDots.length >= 3) {
          ctx.beginPath();
          ctx.moveTo(finalDots[0].x, finalDots[0].y);
          ctx.lineTo(finalDots[1].x, finalDots[1].y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(finalDots[0].x, finalDots[0].y);
          ctx.lineTo(finalDots[2].x, finalDots[2].y);
          ctx.stroke();
        } else if (harmonyType === 'analogous') {
          const hues = colorData.map(c => c.hsl.h).sort((a, b) => a - b);
          if (hues.length >= 2) {
            ctx.beginPath();
            ctx.arc(centerX, centerY, midR, (hues[0] - 90) * Math.PI / 180, (hues[hues.length - 1] - 90) * Math.PI / 180);
            ctx.stroke();
          }
        } else if (finalDots.length >= 2) {
          ctx.beginPath();
          ctx.moveTo(finalDots[0].x, finalDots[0].y);
          for (let i = 1; i < finalDots.length; i++) ctx.lineTo(finalDots[i].x, finalDots[i].y);
          if (finalDots.length > 2) ctx.closePath();
          ctx.stroke();
        }
        ctx.restore();
      }

      dotPositions.length = 0;
      colorData.forEach((c) => {
        const target = hslToWheelCoord(c.hsl.h, centerX, centerY, midR);
        const x = centerX + (target.x - centerX) * eased;
        const y = centerY + (target.y - centerY) * eased;
        const dotSize = ROLE_SIZES[c.role] || 8;

        // Shadow
        ctx.beginPath();
        ctx.arc(x, y, dotSize / 2 + 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fill();

        // Dot
        ctx.beginPath();
        ctx.arc(x, y, dotSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = c.hex;
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        dotPositions.push({ x, y, color: c, radius: dotSize / 2 });
      });

      colorDotsRef.current = dotPositions;

      if (progress < 1) {
        animFrame = requestAnimationFrame(animateDots);
      }
    };

    animateDots();
    return () => cancelAnimationFrame(animFrame);
  }, [colors, harmonyType, size]);

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const hovered = colorDotsRef.current.find(d => {
      const dist = Math.sqrt((mx - d.x) ** 2 + (my - d.y) ** 2);
      return dist < d.radius + 8;
    });

    if (hovered) {
      setTooltip({
        x: hovered.x,
        y: hovered.y - 30,
        name: hovered.color.name,
        hex: hovered.color.hex,
        role: hovered.color.role,
      });
    } else {
      setTooltip(null);
    }
  };

  return (
    <div ref={containerRef} className="relative inline-block" onMouseLeave={() => setTooltip(null)}>
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        className="cursor-crosshair"
        style={{ width: size, height: size }}
      />
      {tooltip && (
        <div
          className="absolute pointer-events-none bg-gray-800 text-white text-[10px] rounded-lg px-2.5 py-1.5 shadow-lg z-10 whitespace-nowrap"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <span className="font-medium">{tooltip.name}</span>
          <span className="text-gray-400 ml-1.5">{tooltip.hex}</span>
          <span className="text-gray-500 ml-1.5 capitalize">{tooltip.role}</span>
        </div>
      )}
    </div>
  );
}
