import { motion } from "framer-motion";
import { ReactNode } from "react";

interface LetterPortalProps {
  letter: string;
  children: ReactNode;
  isActive: boolean;
  onClose: () => void;
}

const LetterPortal = ({ letter, children, isActive, onClose }: LetterPortalProps) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: isActive ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ pointerEvents: isActive ? "auto" : "none" }}
    >
      {/* Background blur overlay */}
      <motion.div
        className="absolute inset-0 bg-background/90 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        onClick={onClose}
      />

      {/* Letter mask container */}
      <motion.div
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ 
          scale: isActive ? 1 : 0.3, 
          opacity: isActive ? 1 : 0 
        }}
        transition={{ 
          duration: 0.8, 
          ease: [0.22, 1, 0.36, 1],
          delay: isActive ? 0.1 : 0
        }}
      >
        {/* SVG mask with letter cutout */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <mask id={`letter-mask-${letter}`}>
              <rect width="100" height="100" fill="white" />
              <text
                x="50"
                y="58"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="45"
                fontWeight="700"
                fontFamily="Space Grotesk, sans-serif"
                fill="black"
              >
                {letter}
              </text>
            </mask>
          </defs>
          
          {/* Dark overlay with letter cutout */}
          <rect
            width="100"
            height="100"
            fill="hsl(220 20% 4% / 0.95)"
            mask={`url(#letter-mask-${letter})`}
          />
        </svg>

        {/* Content visible through the letter */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: isActive ? 1 : 0,
            y: isActive ? 0 : 20
          }}
          transition={{ 
            duration: 0.6, 
            delay: isActive ? 0.4 : 0,
            ease: [0.22, 1, 0.36, 1]
          }}
        >
          <div className="relative z-10 w-full max-w-4xl mx-auto">
            {children}
          </div>
        </motion.div>

        {/* Glowing letter outline */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid slice"
        >
          <text
            x="50"
            y="58"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="45"
            fontWeight="700"
            fontFamily="Space Grotesk, sans-serif"
            fill="none"
            stroke="hsl(190 90% 50% / 0.6)"
            strokeWidth="0.15"
            className="animate-pulse-glow"
          >
            {letter}
          </text>
        </svg>
      </motion.div>

      {/* Close button */}
      <motion.button
        className="absolute top-8 right-8 z-60 p-4 text-susa-text-secondary hover:text-primary transition-colors duration-300"
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: isActive ? 1 : 0,
          y: isActive ? 0 : -20
        }}
        transition={{ delay: 0.5 }}
        onClick={onClose}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </motion.button>
    </motion.div>
  );
};

export default LetterPortal;
