import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback, Suspense, lazy, useEffect, memo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CinematicTrigger from "./CinematicTrigger";
import SUSAStudio from "./SUSAStudio";
import { CelestialBackground, CelestialInteractables } from "./CelestialCycle";

// Lazy load the 3D scene with preload
const SUSA3DScene = lazy(() => import("./SUSA3DScene"));

type ActiveSection = "S1" | "U" | "S2" | "A" | null;

interface ButtonConfig {
  letter: ActiveSection;
  label: string;
  displayLetter: string;
}

const buttons: ButtonConfig[] = [
  { letter: "S1", label: "Try Online", displayLetter: "S" },
  { letter: "U", label: "About SUSA", displayLetter: "U" },
  { letter: "S2", label: "Examples & Modules", displayLetter: "S" },
  { letter: "A", label: "Download", displayLetter: "A" },
];

const LoadingScreen = memo(() => (
  <div className="absolute inset-0 flex items-center justify-center bg-background">
    <motion.div
      className="text-4xl font-bold text-primary"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 1, repeat: Infinity }}
    >
      SUSA
    </motion.div>
  </div>
));

const SUSAHero3D = () => {
  const [activeSection, setActiveSection] = useState<ActiveSection>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSUSAStudio, setShowSUSAStudio] = useState(false);
  const [cinematicTransition, setCinematicTransition] = useState(false);
  const [celestialT, setCelestialT] = useState(0); // Sync state for backgrounds and interactables
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we're returning from another page (for zoom out animation)
  const [shouldZoomOut, setShouldZoomOut] = useState(false);

  const handleCinematicTrigger = () => {
    setCinematicTransition(true);
    setTimeout(() => {
      setShowSUSAStudio(true);
      setCinematicTransition(false);
    }, 2000);
  };

  useEffect(() => {
    // Check if we have a state indicating we came from another page
    if (location.state?.fromPage) {
      setShouldZoomOut(true);
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setShouldZoomOut(false);
        setIsAnimating(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const handleButtonClick = useCallback((section: ActiveSection) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setActiveSection(section);

    // Zoom in animation, then navigate
    setTimeout(() => {
      let targetPath = '/';
      switch (section) {
        case 'S1':
          targetPath = '/try-online';
          break;
        case 'U':
          targetPath = '/about';
          break;
        case 'S2':
          targetPath = '/modules';
          break;
        case 'A':
          targetPath = '/download';
          break;
      }
      navigate(targetPath);
      setIsAnimating(false);
    }, 800);
  }, [isAnimating, navigate]);

  const handleLetterClick = useCallback((section: ActiveSection) => {
    if (isAnimating) return;

    setIsAnimating(true);
    setActiveSection(section);

    // Zoom in animation, then navigate
    setTimeout(() => {
      let targetPath = '/';
      switch (section) {
        case 'S1':
          targetPath = '/try-online';
          break;
        case 'U':
          targetPath = '/about';
          break;
        case 'S2':
          targetPath = '/modules';
          break;
        case 'A':
          targetPath = '/download';
          break;
      }
      navigate(targetPath);
      setIsAnimating(false);
    }, 800);
  }, [isAnimating, navigate]);

  const handleClose = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveSection(null);
    setTimeout(() => setIsAnimating(false), 800);
  }, [isAnimating]);

  return (
    <div
      className="fixed inset-0 z-[10]"
      style={{ overflow: 'hidden', width: '100%', height: '100%', background: 'transparent' }}
    >
      {/* ── Layer 0: Atmospheric background ── */}
      <CelestialBackground t={celestialT} />

      {/* ── Layer 1: 3D Scene ── */}
      <Suspense fallback={<LoadingScreen />}>
        <SUSA3DScene
          activeSection={activeSection}
          setActiveSection={handleLetterClick}
          initialZoomOut={shouldZoomOut}
        />
      </Suspense>

      {/* ── Layer 2: Draggable Moon/Sun (Above letters but below HTML UI) ── */}
      <CelestialInteractables t={celestialT} onDrag={setCelestialT} />

      {/* Overlay UI */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top header */}
        <motion.div
          className="absolute top-4 sm:top-8 left-0 right-0 flex flex-col items-center pointer-events-auto px-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{
            opacity: activeSection || cinematicTransition ? 0 : 1,
            y: activeSection || cinematicTransition ? -40 : 0,
            scale: cinematicTransition ? 1.3 : 1,
            filter: cinematicTransition ? 'blur(20px)' : 'blur(0px)'
          }}
          transition={{ duration: cinematicTransition ? 2 : 0.5 }}
        >
          <CinematicTrigger onTrigger={handleCinematicTrigger}>
            <div className="text-center">
              <p className="text-slate-500 dark:text-susa-text-secondary text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-1 sm:mb-2">
                introducing
              </p>
              <p className="text-slate-900 dark:text-susa-text-secondary text-sm sm:text-base md:text-lg font-bold tracking-wide px-2">
                first AI made programming language
              </p>
            </div>
          </CinematicTrigger>
        </motion.div>

        {/* Navigation buttons */}
        <motion.div
          className="absolute bottom-6 sm:bottom-12 left-0 right-0 flex justify-center pointer-events-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{
            opacity: activeSection ? 0.3 : 1,
            y: activeSection ? 20 : 0
          }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-6 px-2 sm:px-4 max-w-full">
            {buttons.map((button, index) => (
              <motion.button
                key={button.letter}
                onClick={() => handleButtonClick(button.letter)}
                disabled={isAnimating}
                className={`
                  group relative px-3 py-2 sm:px-5 sm:py-3 md:px-8 md:py-4 
                  border rounded-lg text-xs sm:text-sm md:text-base font-medium 
                  transition-all duration-300 backdrop-blur-md min-w-0 flex-shrink-0
                  ${activeSection === button.letter
                    ? 'border-primary bg-primary/20 text-primary'
                    : 'border-border/50 bg-background/30 text-susa-text-secondary hover:border-primary hover:text-primary'
                  }
                `}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 flex items-center gap-1 sm:gap-2">
                  <span className="text-xs text-primary font-bold">{button.displayLetter}</span>
                  <span className="hidden sm:inline">{button.label}</span>
                  <span className="sm:hidden text-xs">{button.label.split(' ')[0]}</span>
                </span>

                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-primary/10 to-accent/10" />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Click instruction */}
        <motion.p
          className="absolute bottom-16 sm:bottom-32 md:bottom-28 left-0 right-0 text-center text-muted-foreground text-xs pointer-events-none px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: activeSection ? 0 : 0.6 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <span className="hidden sm:inline">Click on the buttons to explore</span>
          <span className="sm:hidden">Tap buttons to explore</span>
        </motion.p>
      </div>

      {/* Content Panel - Removed since we navigate to separate pages */}
      {/* ESC key handler */}
      <EscapeKeyHandler activeSection={activeSection} onClose={handleClose} />

      {/* Launch Theater */}
      <AnimatePresence>
        {showSUSAStudio && (
          <SUSAStudio onClose={() => setShowSUSAStudio(false)} />
        )}
      </AnimatePresence>

      {/* Cinematic Transition Overlay */}
      <AnimatePresence>
        {cinematicTransition && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] bg-black flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <motion.div className="text-6xl md:text-8xl font-bold tracking-wider text-white mb-6">
                {['S', 'U', 'S', 'A'].map((letter, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="inline-block mx-2"
                    style={{
                      textShadow: '0 0 30px rgba(59, 130, 246, 0.8)'
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-3xl text-blue-400 tracking-widest"
              >
                TO WORLD
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div >
  );
};

// Handle ESC key press as a proper React component with useEffect
const EscapeKeyHandler = ({
  activeSection,
  onClose
}: {
  activeSection: ActiveSection;
  onClose: () => void
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeSection) {
        onClose();
      }
    };

    if (activeSection) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [activeSection, onClose]);

  return null;
};

export default SUSAHero3D;
