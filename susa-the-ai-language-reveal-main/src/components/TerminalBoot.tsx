import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeIntelligence } from "@/hooks/useThemeIntelligence";

interface TerminalBootProps {
  onComplete: () => void;
}

const TerminalBoot: React.FC<TerminalBootProps> = ({ onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [showGlitch, setShowGlitch] = useState(false);
  const { theme } = useThemeIntelligence();

  const fullLines = [
    "> Initializing SUSA Core...",
    "> Loading High-Speed Runtime...",
    "> Compiling UI Modules...",
    "> Performance Mode: ENABLED",
    "> Welcome to SUSA",
    ""
  ];

  const typeText = useCallback((text: string, index: number, callback: () => void) => {
    if (index < text.length) {
      setDisplayedText((prev) => prev + text[index]);
      const timeout = setTimeout(() => typeText(text, index + 1, callback), 30 + Math.random() * 40);
      return () => clearTimeout(timeout);
    } else {
      callback();
    }
  }, []);

  useEffect(() => {
    if (currentLineIndex < fullLines.length) {
      const line = fullLines[currentLineIndex];
      if (currentLineIndex === fullLines.length - 1) {
        // Last line, wait a bit then show immediately
        const timer = setTimeout(() => {
          setLines(prev => [...prev, line]);
          setIsFinished(true);
        }, 500);
        return () => clearTimeout(timer);
      } else {
        typeText(line, 0, () => {
          setLines((prev) => [...prev, line]);
          setDisplayedText('');
          setCurrentLineIndex((prev) => prev + 1);
        });
      }
    }
  }, [currentLineIndex, typeText]);

  // Glitch effect
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.97) {
        setShowGlitch(true);
        setTimeout(() => setShowGlitch(false), 200);
      }
    }, 1000);
    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <div
      className="fixed inset-0 bg-background text-primary font-mono p-8 cursor-pointer overflow-hidden z-[100]"
      onClick={onComplete}
    >
      <div className={`transition-all duration-75 ${showGlitch ? 'translate-x-1 skew-x-2 opacity-80' : ''}`}>
        <div className="max-w-2xl mx-auto mt-20 space-y-2">
          {lines.map((line, i) => (
            <div key={i} className="min-h-[1.5em]">
              {line}
            </div>
          ))}
          {!isFinished && (
            <div className="flex">
              <span>{displayedText}</span>
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="w-2 h-5 bg-primary ml-1"
              />
            </div>
          )}
          {isFinished && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="mt-8 text-primary/80 animate-pulse"
            >
              <span className="text-white/50">_</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Scanline effect - Dimmer in light mode */}
      <div className={`absolute inset-0 pointer-events-none z-50 ${theme === 'light' ? 'opacity-10' : 'opacity-30'} bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] bg-[length:100%_2px,3px_100%]`}></div>
    </div>
  );
};

export default TerminalBoot;
