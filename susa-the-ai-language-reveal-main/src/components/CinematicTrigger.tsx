import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CinematicTriggerProps {
  onTrigger: () => void;
  children: React.ReactNode;
}

const CinematicTrigger = ({ onTrigger, children }: CinematicTriggerProps) => {
  const [clickCount, setClickCount] = useState(0);
  const [showGlitch, setShowGlitch] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    // Show glitch effect on clicks 1-4
    if (newCount < 5) {
      setShowGlitch(true);
      setTimeout(() => setShowGlitch(false), 200);
    }

    // Reset counter after 2 seconds of inactivity
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setClickCount(0);
    }, 2000);

    // Trigger on 5th click
    if (newCount === 5) {
      setClickCount(0);
      onTrigger();
    }
  };

  return (
    <div className="relative inline-block">
      <motion.div
        onClick={handleClick}
        className="cursor-pointer select-none"
        animate={showGlitch ? {
          x: [0, -2, 2, -2, 0],
          opacity: [1, 0.8, 1, 0.8, 1],
        } : {}}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>

      {/* Click Progress Indicator (subtle) */}
      <AnimatePresence>
        {clickCount > 0 && clickCount < 5 && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1"
          >
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i < clickCount ? 'bg-blue-500 shadow-glow' : 'bg-gray-600'
                }`}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Glitch overlay */}
      <AnimatePresence>
        {showGlitch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
              mixBlendMode: 'screen'
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CinematicTrigger;
