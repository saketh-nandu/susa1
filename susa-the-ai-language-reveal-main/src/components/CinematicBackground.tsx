import { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, animate, PanInfo } from 'framer-motion';

type Theme = 'night' | 'day';

const CinematicBackground = () => {
  const [theme, setTheme] = useState<Theme>('night');
  const [celestialBody, setCelestialBody] = useState<'moon' | 'sun'>('moon');
  const [isDragging, setIsDragging] = useState(false);
  
  const celestialX = useMotionValue(0);
  const celestialY = useMotionValue(0);
  
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize position on mount
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      // Start at 80% from left (right mountain)
      celestialX.set(rect.width * 0.8);
      celestialY.set(rect.height * 0.15);
    }
  }, [celestialX, celestialY]);

  // Calculate orbital arc position
  const calculateArcY = (x: number, containerWidth: number, containerHeight: number) => {
    const centerX = containerWidth * 0.5;
    const centerY = containerHeight * 0.5;
    const radius = containerWidth * 0.35;
    
    const normalizedX = x - centerX;
    const yOffset = Math.sqrt(Math.max(0, radius * radius - normalizedX * normalizedX));
    return centerY - yOffset + containerHeight * 0.1;
  };

  // Update theme based on position
  useEffect(() => {
    const unsubscribe = celestialX.on('change', (x) => {
      if (!containerRef.current) return;
      const width = containerRef.current.getBoundingClientRect().width;
      const progress = 1 - (x / width);
      
      if (celestialBody === 'moon') {
        if (progress > 0.5) setTheme('night');
      } else {
        if (progress < 0.5) setTheme('day');
        else setTheme('night');
      }
    });
    return () => unsubscribe();
  }, [celestialX, celestialBody]);

  // Handle drag
  const handleDrag = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    const newX = Math.max(rect.width * 0.2, Math.min(rect.width * 0.8, celestialX.get() + info.delta.x));
    const arcY = calculateArcY(newX, rect.width, rect.height);
    
    celestialX.set(newX);
    celestialY.set(arcY);
  };

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = celestialX.get();
    const progress = 1 - (currentX / rect.width);
    
    if (progress > 0.7) {
      // Reached left side, switch celestial body
      animate(celestialX, rect.width * 0.2, {
        duration: 0.5,
        onComplete: () => {
          setTimeout(() => {
            if (celestialBody === 'moon') {
              setCelestialBody('sun');
              setTheme('day');
            } else {
              setCelestialBody('moon');
              setTheme('night');
            }
            celestialX.set(rect.width * 0.8);
            celestialY.set(rect.height * 0.15);
          }, 300);
        }
      });
    } else {
      // Snap back to start
      animate(celestialX, rect.width * 0.8, { duration: 1, ease: 'easeOut' });
      animate(celestialY, rect.height * 0.15, { duration: 1, ease: 'easeOut' });
    }
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 1 }}
    >
      {/* Background Image - Day Theme */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAyNCIgaGVpZ2h0PSI1NzYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJza3kiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNGZhY2ZlO3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iNTAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMDBmMmZlO3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I2U4ZjRmODtzdG9wLW9wYWNpdHk6MSIgLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0ibW91bnRhaW4iIHgxPSIwJSIgeTE9IjEwMCUiIHgyPSIxMDAlIiB5Mj0iMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM1YTdkOWE7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMzZDVhNzM7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMmM0MzU2O3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJyaXZlciIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM2NGI0ZmY7c3RvcC1vcGFjaXR5OjAuNiIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMzMjc4Yzg7c3RvcC1vcGFjaXR5OjAuOCIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAyNCIgaGVpZ2h0PSI1NzYiIGZpbGw9InVybCgjc2t5KSIvPjxwYXRoIGQ9Ik0gMCA1NzYgTCAwIDI1MCBRIDEwMCAyMDAsIDIwMCAxNTAgUSAzMDAgMTIwLCA0MDAgMjAwIEwgNDAwIDU3NiBaIiBmaWxsPSJ1cmwoI21vdW50YWluKSIgb3BhY2l0eT0iMC45NSIvPjxwYXRoIGQ9Ik0gMTAyNCA1NzYgTCAxMDI0IDI1MCBRIDkyNCAyMDAsIDgyNCAxNTAgUSA3MjQgMTIwLCA2MjQgMjAwIEwgNjI0IDU3NiBaIiBmaWxsPSJ1cmwoI21vdW50YWluKSIgb3BhY2l0eT0iMC45NSIvPjxwYXRoIGQ9Ik0gMCA1NzYgTCAwIDQ1MCBRIDUxMiA0MDAsIDEwMjQgNDUwIEwgMTAyNCA1NzYgWiIgZmlsbD0idXJsKCNyaXZlcikiLz48L3N2Zz4=')`
        }}
        animate={{ opacity: theme === 'day' ? 1 : 0 }}
        transition={{ duration: 2 }}
      />

      {/* Background Image - Night Theme */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAyNCIgaGVpZ2h0PSI1NzYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJza3kiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMGEwZTI3O3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iNTAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMWExZjNhO3N0b3Atb3BhY2l0eToxIiAvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6IzBmMTQxOTtzdG9wLW9wYWNpdHk6MSIgLz48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0ibW91bnRhaW4iIHgxPSIwJSIgeTE9IjEwMCUiIHgyPSIxMDAlIiB5Mj0iMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMxYTFmM2E7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSI1MCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwZjE0MTk7c3RvcC1vcGFjaXR5OjEiIC8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMDUwYTEyO3N0b3Atb3BhY2l0eToxIiAvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJyaXZlciIgeDE9IjAlIiB5MT0iMCUiIHgyPSIwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwYTE0Mjg7c3RvcC1vcGFjaXR5OjAuNiIgLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiMwNTBhMTQ7c3RvcC1vcGFjaXR5OjAuOCIgLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAyNCIgaGVpZ2h0PSI1NzYiIGZpbGw9InVybCgjc2t5KSIvPjxwYXRoIGQ9Ik0gMCA1NzYgTCAwIDI1MCBRIDEwMCAyMDAsIDIwMCAxNTAgUSAzMDAgMTIwLCA0MDAgMjAwIEwgNDAwIDU3NiBaIiBmaWxsPSJ1cmwoI21vdW50YWluKSIgb3BhY2l0eT0iMC45NSIvPjxwYXRoIGQ9Ik0gMTAyNCA1NzYgTCAxMDI0IDI1MCBRIDkyNCAyMDAsIDgyNCAxNTAgUSA3MjQgMTIwLCA2MjQgMjAwIEwgNjI0IDU3NiBaIiBmaWxsPSJ1cmwoI21vdW50YWluKSIgb3BhY2l0eT0iMC45NSIvPjxwYXRoIGQ9Ik0gMCA1NzYgTCAwIDQ1MCBRIDUxMiA0MDAsIDEwMjQgNDUwIEwgMTAyNCA1NzYgWiIgZmlsbD0idXJsKCNyaXZlcikiLz48L3N2Zz4=')`
        }}
        animate={{ opacity: theme === 'night' ? 1 : 0 }}
        transition={{ duration: 2 }}
      />

      {/* Stars (only visible at night) */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: theme === 'night' ? 1 : 0 }}
        transition={{ duration: 1.5 }}
      >
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
            }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 2
            }}
          />
        ))}
      </motion.div>

      {/* Draggable Celestial Body */}
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0}
        dragConstraints={containerRef}
        onDrag={handleDrag}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        style={{
          x: celestialX,
          y: celestialY,
          position: 'absolute',
          left: 0,
          top: 0,
          cursor: isDragging ? 'grabbing' : 'grab',
          zIndex: 15
        }}
        className="pointer-events-auto"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {celestialBody === 'moon' ? (
          <motion.div
            className="relative -translate-x-1/2 -translate-y-1/2"
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
          >
            <div
              className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-gray-200 to-gray-400"
              style={{
                boxShadow: '0 0 60px rgba(200, 200, 255, 0.8), inset -10px -10px 20px rgba(0, 0, 0, 0.3)'
              }}
            />
            <div className="absolute top-2 left-3 w-3 h-3 rounded-full bg-gray-500 opacity-40" />
            <div className="absolute bottom-4 right-4 w-4 h-4 rounded-full bg-gray-500 opacity-30" />
          </motion.div>
        ) : (
          <motion.div
            className="relative -translate-x-1/2 -translate-y-1/2"
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          >
            <div
              className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-500"
              style={{
                boxShadow: '0 0 80px rgba(255, 200, 0, 0.9), 0 0 120px rgba(255, 150, 0, 0.6)'
              }}
            />
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 bg-yellow-300 left-1/2 top-1/2 -translate-x-1/2"
                style={{
                  height: '20px',
                  transformOrigin: 'top center',
                  transform: `rotate(${i * 30}deg) translateY(-35px)`,
                  opacity: 0.6
                }}
                animate={{
                  height: ['20px', '28px', '20px'],
                  opacity: [0.6, 0.9, 0.6]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: 'easeInOut'
                }}
              />
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Ambient Light Overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: celestialBody === 'moon'
            ? `radial-gradient(circle at ${celestialX.get()}px ${celestialY.get()}px, rgba(200, 200, 255, 0.15), transparent 40%)`
            : `radial-gradient(circle at ${celestialX.get()}px ${celestialY.get()}px, rgba(255, 200, 100, 0.2), transparent 40%)`,
          zIndex: 2
        }}
      />
    </div>
  );
};

export default CinematicBackground;
