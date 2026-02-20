import { useEffect, useRef, useState } from 'react';

const FADE_DURATION = 30;

export default function VictoryVideo({ active, onClose }) {
  const videoRef = useRef(null);
  const rafRef = useRef(null);
  const startTimeRef = useRef(null);
  const [opacity, setOpacity] = useState(0);
  const [ended, setEnded] = useState(false);

  useEffect(() => {
    if (!active) {
      setOpacity(0);
      setEnded(false);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    video.volume = 0;
    video.play().then(() => {
      if (window.wordleAPI?.setSystemVolume) {
        window.wordleAPI.setSystemVolume(100);
      }
    }).catch(() => {});

    startTimeRef.current = performance.now();

    const tick = (now) => {
      const elapsed = (now - startTimeRef.current) / 1000;
      const t = Math.min(elapsed / FADE_DURATION, 1);
      const eased = t * t * (3 - 2 * t);

      setOpacity(eased);
      if (video) video.volume = eased;

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: `rgba(0,0,0,${opacity * 0.95})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
      }}
    >
      <video
        ref={videoRef}
        src="./victory.mp4"
        style={{
          maxWidth: '90%',
          maxHeight: '85vh',
          borderRadius: 8,
          opacity,
          transition: 'opacity 0.1s linear',
        }}
        onEnded={() => setEnded(true)}
        playsInline
      />

      {ended && (
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            width: 40,
            height: 40,
            borderRadius: '50%',
            border: '2px solid #818384',
            background: 'rgba(18,18,19,0.9)',
            color: '#d7dadc',
            fontSize: 20,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
          }}
          aria-label="Close"
        >
          ×
        </button>
      )}
    </div>
  );
}
