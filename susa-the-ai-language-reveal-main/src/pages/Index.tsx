import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SUSAHero3D from "@/components/SUSAHero3D";
import TerminalBoot from "@/components/TerminalBoot";
import SyntaxRain from "@/components/SyntaxRain";
import ParticleLogo from "@/components/ParticleLogo";
import { useThemeIntelligence } from "@/hooks/useThemeIntelligence";

type CinematicPhase = "BOOT" | "RAIN" | "PARTICLES" | "HERO";

const Index = () => {
  const [phase, setPhase] = useState<CinematicPhase>("BOOT");
  const { theme } = useThemeIntelligence();

  useEffect(() => {
    // Skip intro animations and go directly to hero
    setPhase("HERO");
    sessionStorage.setItem('susa_intro_played', 'true');
  }, []);

  // Force the viewport to reset every time we land on the home page.
  // This prevents any scroll state from sub-pages from bleeding back.
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.top = '0px';
    document.body.style.left = '0px';
    document.documentElement.style.top = '0px';
    
    return () => {
      // Don't reset on unmount - let other pages handle their own overflow
    };
  }, []);

  const handleBootComplete = () => {
    setPhase("RAIN");
  };

  const handleRainComplete = () => {
    setPhase("PARTICLES");
  };

  const handleParticlesComplete = () => {
    setPhase("HERO");
    sessionStorage.setItem('susa_intro_played', 'true');
  };

  return (
    <div className="fixed inset-0 bg-background" style={{ overflow: 'hidden', width: '100%', height: '100%' }}>
      <AnimatePresence mode="wait">
        {phase === "BOOT" && (
          <motion.div
            key="boot"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            transition={{ duration: 0.8 }}
          >
            <TerminalBoot onComplete={handleBootComplete} />
          </motion.div>
        )}

        {phase === "RAIN" && (
          <motion.div
            key="rain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-[100]"
          >
            <SyntaxRain duration={3000} onComplete={handleRainComplete} />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.2 }}
                className="text-9xl font-bold tracking-tighter text-cyan-500 font-mono blur-[2px]"
              >
                SUSA
              </motion.div>
            </div>
          </motion.div>
        )}

        {phase === "PARTICLES" && (
          <motion.div
            key="particles"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <ParticleLogo onComplete={handleParticlesComplete} />
          </motion.div>
        )}

        {phase === "HERO" && (
          <motion.div
            key="hero"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <SUSAHero3D />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
