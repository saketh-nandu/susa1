import React, { useEffect, useRef } from 'react';
import { useThemeIntelligence } from "@/hooks/useThemeIntelligence";

interface SyntaxRainProps {
    onComplete?: () => void;
    duration?: number;
}

const SyntaxRain: React.FC<SyntaxRainProps> = ({ onComplete, duration = 3000 }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { theme } = useThemeIntelligence();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const fontSize = 16;
        const columns = Math.floor(canvas.width / (fontSize * 1.5));
        const drops: number[] = new Array(columns).fill(1).map(() => Math.random() * -100);

        const draw = () => {
            ctx.fillStyle = theme === 'dark' ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = theme === 'dark' ? 'rgba(0, 255, 255, 0.3)' : 'rgba(0, 150, 200, 0.4)';
            ctx.lineWidth = 1;

            for (let i = 0; i < drops.length; i++) {
                const x = i * (fontSize * 1.5);
                const y = drops[i] * fontSize;

                // Draw vertical rain lines instead of snippets
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x, y + 10);
                ctx.stroke();

                if (y > canvas.height && Math.random() > 0.975) {
                    drops[i] = -2;
                }
                drops[i] += 1.5; // Faster rain
            }
        };

        const interval = setInterval(draw, 33);

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        const timer = setTimeout(() => {
            if (onComplete) onComplete();
        }, duration);

        return () => {
            clearInterval(interval);
            clearTimeout(timer);
            window.removeEventListener('resize', handleResize);
        };
    }, [onComplete, duration, theme]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 bg-background opacity-20 pointer-events-none z-[90]"
        />
    );
};

export default SyntaxRain;
