/**
 * CelestialCycle.tsx
 * Cinematic day-night cycle overlay for the SUSA hero section.
 * 
 * This file exports two components to allow layering around the 3D scene:
 * 1. CelestialBackground: The bottom layers (background images, sky tint, river glow).
 * 2. CelestialInteractables: The top layers (draggable moon and sun).
 */

import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import { useThemeIntelligence } from "../hooks/useThemeIntelligence";

// ─── Constants ───────────────────────────────────────────────────────────────

/** Fraction of the cycle where moon is fully set (triggers day) */
const MOON_SET_THRESHOLD = 0.45;
/** Fraction of the cycle where sun is fully set (triggers night) */
const SUN_SET_THRESHOLD = 0.95;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeInOut = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * Returns the (x, y) position on a semi-circular arc.
 * Higher arc focused between headline and SUSA text.
 */
function arcPosition(t: number, containerW: number, containerH: number): { x: number; y: number } {
    const xPercent = lerp(85, 15, t);
    const arcDepth = 0.22; // Height swing
    const baseY = 32;      // Start position (32% from top)
    const yPercent = baseY - Math.sin(t * Math.PI) * arcDepth * 100;
    return { x: xPercent, y: yPercent };
}

function xToArcT(deltaX: number, containerW: number, startT: number): number {
    // 1.8x travel distance for "heavy/premium" feel
    const horizontalRange = containerW * 0.7 * 1.8;
    const deltaT = deltaX / horizontalRange;
    return clamp(startT + deltaT, 0, 1);
}

// ─── Shared State Hook ───────────────────────────────────────────────────────

/** 
 * We use a simple singleton-like pattern or just pass refs if they are in the same parent.
 * For simplicity within one file, we'll keep the logic in a way that can be shared.
 * But since they are siblings, we'll use a custom event or a shared observable if needed.
 * Actually, we can just keep the state in the parent (SUSAHero3D).
 */

// ─── Sky colour stages ────────────────────────────────────────────────────────

interface SkyStage { t: number; color: string; opacity: number; }
const SKY_STAGES: SkyStage[] = [
    { t: 0, color: "rgba(5,10,40,0)", opacity: 0 },
    { t: 0.3, color: "rgba(5,10,40,0.15)", opacity: 0.15 },
    { t: 0.45, color: "rgba(120,60,20,0.25)", opacity: 0.25 },
    { t: 0.55, color: "rgba(200,140,60,0.15)", opacity: 0.15 },
    { t: 0.7, color: "rgba(100,160,220,0.05)", opacity: 0.05 },
    { t: 0.85, color: "rgba(200,100,30,0.2)", opacity: 0.2 },
    { t: 0.95, color: "rgba(40,20,80,0.3)", opacity: 0.3 },
    { t: 1.0, color: "rgba(5,10,40,0)", opacity: 0 },
];

function interpolateSky(t: number): { color: string; opacity: number } {
    let lo = SKY_STAGES[0], hi = SKY_STAGES[SKY_STAGES.length - 1];
    for (let i = 0; i < SKY_STAGES.length - 1; i++) {
        if (t >= SKY_STAGES[i].t && t <= SKY_STAGES[i + 1].t) {
            lo = SKY_STAGES[i]; hi = SKY_STAGES[i + 1]; break;
        }
    }
    const range = hi.t - lo.t;
    const localT = range > 0 ? (t - lo.t) / range : 0;
    const ease = easeInOut(localT);
    const parseRgba = (s: string) => {
        const m = s.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (!m) return [0, 0, 0, 0];
        return [+m[1], +m[2], +m[3], m[4] !== undefined ? +m[4] : 1];
    };
    const [r1, g1, b1, a1] = parseRgba(lo.color);
    const [r2, g2, b2, a2] = parseRgba(hi.color);
    return {
        color: `rgba(${Math.round(lerp(r1, r2, ease))},${Math.round(lerp(g1, g2, ease))},${Math.round(lerp(b1, b2, ease))},${lerp(a1, a2, ease)})`,
        opacity: lerp(lo.opacity, hi.opacity, ease)
    };
}

function dayOpacity(t: number): number {
    if (t < 0.3) return 0;
    if (t < 0.55) return easeInOut((t - 0.3) / 0.25);
    if (t < 0.9) return 1;
    return easeInOut(1 - (t - 0.9) / 0.1);
}

function riverGlow(t: number): number {
    return clamp(Math.sin(t * Math.PI), 0, 1);
}

// ─── Main Components ─────────────────────────────────────────────────────────

export interface CelestialState {
    t: number;
    setT: (t: number) => void;
}

/** Bottom layer component */
export const CelestialBackground = ({ t }: { t: number }) => {
    const sky = useMemo(() => interpolateSky(t), [t]);
    const dOp = useMemo(() => dayOpacity(t), [t]);
    const gv = useMemo(() => riverGlow(t), [t]);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {/* Night BG */}
            <div style={{
                position: "absolute", inset: 0, backgroundImage: "url('/bg-night.png')",
                backgroundSize: "cover", backgroundPosition: "center center"
            }} />
            {/* Day BG */}
            <div style={{
                position: "absolute", inset: 0, backgroundImage: "url('/bg-day.png')",
                backgroundSize: "cover", backgroundPosition: "center center",
                opacity: dOp, transition: "opacity 0.2s linear"
            }} />
            {/* Sky Overlay */}
            <div style={{
                position: "absolute", inset: 0, background: sky.color,
                opacity: sky.opacity, mixBlendMode: "multiply"
            }} />
            {/* River Glow */}
            <div style={{
                position: "absolute", bottom: 0, left: "20%", right: "20%", height: "35%",
                background: "radial-gradient(ellipse at center bottom, rgba(200,220,255,0.6) 0%, transparent 70%)",
                opacity: gv * 0.4, mixBlendMode: "screen"
            }} />
            {/* Vignette */}
            <div style={{
                position: "absolute", inset: 0,
                background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.3) 100%)"
            }} />
        </div>
    );
};

/** Top layer component (Interactables) */
export const CelestialInteractables = ({ t, onDrag }: { t: number, onDrag: (newT: number) => void }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const dragging = useRef<boolean>(false);
    const dragStartX = useRef<number>(0);
    const dragStartT = useRef<number>(t);

    // Smooth transition refs
    const targetT = useRef(t);
    const currentT = useRef(t);
    const rafId = useRef<number | null>(null);

    const { setTheme } = useThemeIntelligence();
    const lastTheme = useRef<"dark" | "light" | null>(null);

    // Damping effect
    useEffect(() => {
        const smoothUpdate = () => {
            if (Math.abs(targetT.current - currentT.current) > 0.0001) {
                currentT.current = lerp(currentT.current, targetT.current, 0.08); // Cinematic damping
                onDrag(currentT.current);
            }
            rafId.current = requestAnimationFrame(smoothUpdate);
        };
        rafId.current = requestAnimationFrame(smoothUpdate);
        return () => { if (rafId.current) cancelAnimationFrame(rafId.current); };
    }, [onDrag]);

    // Sync theme based on T
    useEffect(() => {
        const targetTheme = (t > 0.48 && t < 0.92) ? 'light' : 'dark';
        if (targetTheme !== lastTheme.current) {
            lastTheme.current = targetTheme;
            setTheme(targetTheme);
        }
    }, [t, setTheme]);

    const handlePointerMove = useCallback((e: PointerEvent) => {
        if (!dragging.current || !containerRef.current) return;
        const w = containerRef.current.offsetWidth;
        const deltaX = dragStartX.current - e.clientX;
        targetT.current = xToArcT(deltaX, w, dragStartT.current);
    }, []);

    const handlePointerUp = useCallback(() => {
        dragging.current = false;

        // Looping logic: If we hit the end of the arc (sun sets or moon sets)
        // Reset to start of next phase for seamless handoff
        if (targetT.current > 0.98) {
            targetT.current = 0;
            currentT.current = 0;
            onDrag(0);
        }

        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
    }, [handlePointerMove, onDrag]);

    const startDrag = (e: React.PointerEvent) => {
        dragging.current = true;
        dragStartX.current = e.clientX;
        dragStartT.current = currentT.current;
        targetT.current = currentT.current;
        window.addEventListener("pointermove", handlePointerMove);
        window.addEventListener("pointerup", handlePointerUp);
    };

    const moonPos = arcPosition(clamp(t / 0.5, 0, 1), 100, 100);
    const sunPos = arcPosition(t < 0.45 ? 0 : clamp((t - 0.45) / 0.55, 0, 1), 100, 100);

    const moonVisible = (t < 0.5) ? 1 : Math.max(0, 1 - (t - 0.5) / 0.05);
    const sunVisible = (t > 0.45 && t < 0.95) ? 1 : 0;

    return (
        <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none z-[50]">
            {/* Moon */}
            <div
                onPointerDown={startDrag}
                style={{
                    position: "absolute", top: `${moonPos.y}%`, left: `${moonPos.x}%`,
                    width: 52, height: 52, transform: "translate(-50%, -50%)",
                    pointerEvents: moonVisible ? "auto" : "none", cursor: "grab", opacity: moonVisible,
                    transition: "opacity 0.2s"
                }}
            >
                <div style={{ position: "absolute", inset: -28, borderRadius: "50%", background: "radial-gradient(circle, rgba(200,220,255,0.2) 0%, transparent 70%)", filter: "blur(8px)" }} />
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 38% 38%, #e8eeff 0%, #b0c8f8 50%, #8aaae8 100%)", boxShadow: "0 0 20px 6px rgba(160,200,255,0.5), 0 0 60px 20px rgba(120,170,255,0.15)" }} />
            </div>

            {/* Sun */}
            <div
                onPointerDown={startDrag}
                style={{
                    position: "absolute", top: `${sunPos.y}%`, left: `${sunPos.x}%`,
                    width: 64, height: 64, transform: "translate(-50%, -50%)",
                    pointerEvents: sunVisible ? "auto" : "none", cursor: "grab", opacity: sunVisible,
                    transition: "opacity 0.2s"
                }}
            >
                <div style={{ position: "absolute", inset: -40, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,230,120,0.2) 0%, transparent 75%)", filter: "blur(12px)" }} />
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 42% 42%, #fffbe0 0%, #ffd440 45%, #ff9800 100%)", boxShadow: "0 0 30px 10px rgba(255,200,50,0.5), 0 0 80px 30px rgba(255,150,20,0.15)" }} />
            </div>
        </div>
    );
};

// Keep default export for backwards compatibility if needed, but we'll use the named ones.
const CelestialCycle = () => {
    const [t, setT] = useState(0);
    return (
        <>
            <CelestialBackground t={t} />
            <CelestialInteractables t={t} onDrag={setT} />
        </>
    );
};
export default CelestialCycle;
