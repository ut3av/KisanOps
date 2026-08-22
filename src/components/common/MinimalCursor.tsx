import React, { useEffect, useState, useRef } from 'react';

export const MinimalCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const ringRef = useRef<HTMLDivElement>(null);
  const targetPos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Check if device is touch-primary
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsTouchDevice(true);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      setPosition({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check hoverable elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = target.closest('button, a, input, select, textarea, [role="button"], [data-interactive="true"], .card-interactive');
        setIsHovered(!!isInteractive);
      }
    };

    const onMouseDown = () => setIsClicked(true);
    const onMouseUp = () => setIsClicked(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Smooth lerp trailing animation for outer ring
    let animationFrameId: number;
    const animateRing = () => {
      const ease = 0.18;
      currentPos.current.x += (targetPos.current.x - currentPos.current.y !== undefined ? targetPos.current.x - currentPos.current.x : 0) * ease;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * ease;

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(animateRing);
    };

    animationFrameId = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (isTouchDevice || !isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden transition-opacity duration-300">
      {/* Inner Crisp Dot */}
      <div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-emerald-600 transition-transform duration-75 ease-out shadow-sm"
        style={{
          transform: `translate3d(${position.x - 4}px, ${position.y - 4}px, 0) scale(${isClicked ? 0.75 : isHovered ? 1.5 : 1})`,
        }}
      />

      {/* Outer Minimal Smooth Ring */}
      <div
        ref={ringRef}
        className={`fixed top-0 left-0 -ml-4 -mt-4 rounded-full border transition-[width,height,border-color,background-color] duration-200 ease-out flex items-center justify-center ${
          isHovered
            ? 'w-10 h-10 -ml-5 -mt-5 border-emerald-500/80 bg-emerald-500/10'
            : isClicked
            ? 'w-7 h-7 -ml-3.5 -mt-3.5 border-emerald-600/70 bg-emerald-600/15'
            : 'w-8 h-8 border-stone-400/50 bg-stone-500/5'
        }`}
      />
    </div>
  );
};
