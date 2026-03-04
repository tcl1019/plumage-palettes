import React from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';

const BASE_TRANSFORMS = {
  up: 'translateY(24px)',
  down: 'translateY(-24px)',
  left: 'translateX(24px)',
  right: 'translateX(-24px)',
  scale: 'scale(0.95)',
};

export default function Reveal({ children, direction = 'up', delay = 0, className = '' }) {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : BASE_TRANSFORMS[direction] || BASE_TRANSFORMS.up,
        transition: `opacity 500ms ease-out ${delay}ms, transform 500ms ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
