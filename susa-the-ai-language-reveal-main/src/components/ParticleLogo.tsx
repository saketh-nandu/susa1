import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Float, PointMaterial, Points } from '@react-three/drei';
import * as THREE from 'three';
import { useThemeIntelligence } from "@/hooks/useThemeIntelligence";

const ParticleLetter = ({ char, position, delay }: { char: string, position: [number, number, number], delay: number }) => {
    const pointsRef = useRef<THREE.Points>(null);
    const [gathered, setGathered] = useState(false);

    const count = 1500;

    const [positions, initialPositions] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const initial = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            // Random start positions in a cloud around the letter area
            const x = (Math.random() - 0.5) * 15;
            const y = (Math.random() - 0.5) * 15 + 5;
            const z = (Math.random() - 0.5) * 10;

            pos[i * 3] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;

            initial[i * 3] = x;
            initial[i * 3 + 1] = y;
            initial[i * 3 + 2] = z;
        }
        return [pos, initial];
    }, [count]);

    useEffect(() => {
        const timer = setTimeout(() => setGathered(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    useFrame((state) => {
        if (!pointsRef.current) return;

        const attr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
        const time = state.clock.elapsedTime;

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            if (gathered) {
                // Calculate a target "jiggle" point near center
                const tx = Math.sin(time * 2 + i) * 0.2;
                const ty = Math.cos(time * 2 + i) * 0.2;
                const tz = Math.sin(time * 1.5 + i) * 0.2;

                attr.array[i3] += (tx - attr.array[i3]) * 0.04;
                attr.array[i3 + 1] += (ty - attr.array[i3 + 1]) * 0.04;
                attr.array[i3 + 2] += (tz - attr.array[i3 + 2]) * 0.04;
            } else {
                // Swirl / Fall effect
                attr.array[i3 + 1] -= 0.05;
                attr.array[i3] += Math.sin(time + i) * 0.02;

                if (attr.array[i3 + 1] < -10) {
                    attr.array[i3 + 1] = 10;
                }
            }
        }
        attr.needsUpdate = true;
    });

    return (
        <group position={position}>
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={count}
                        array={positions}
                        itemSize={3}
                    />
                </bufferGeometry>
                <pointsMaterial
                    transparent
                    color="#00ffff"
                    size={0.15}
                    sizeAttenuation={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </points>

            {gathered && (
                <Float speed={3} rotationIntensity={0.3} floatIntensity={0.6}>
                    <Text
                        fontSize={4.5}
                        anchorX="center"
                        anchorY="middle"
                    >
                        {char}
                        <meshStandardMaterial
                            color="#00ffff"
                            emissive="#00ffff"
                            emissiveIntensity={2}
                            transparent
                            opacity={0.9}
                        />
                    </Text>
                </Float>
            )}
        </group>
    );
};

interface ParticleLogoProps {
    onComplete: () => void;
}

const ParticleLogo: React.FC<ParticleLogoProps> = ({ onComplete }) => {
    const { theme } = useThemeIntelligence();
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 7000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    const bgColor = theme === 'dark' ? "#000000" : "#f8f9fa";

    return (
        <div className="fixed inset-0 bg-background z-[80]">
            <Canvas camera={{ position: [0, 0, 18], fov: 45 }}>
                <color attach="background" args={[bgColor]} />
                <ambientLight intensity={1} />
                <pointLight position={[10, 10, 10]} intensity={2} color="#00ffff" />

                <group scale={1.2}>
                    <ParticleLetter char="S" position={[-7.5, 0, 0]} delay={800} />
                    <ParticleLetter char="U" position={[-2.5, 0, 0]} delay={1400} />
                    <ParticleLetter char="S" position={[2.5, 0, 0]} delay={2000} />
                    <ParticleLetter char="A" position={[7.5, 0, 0]} delay={2600} />
                </group>
            </Canvas>

            {/* HUD line */}
            <div className="absolute bottom-10 left-0 right-0 flex justify-center opacity-30">
                <div className="w-1/3 h-[1px] bg-primary animate-pulse" />
            </div>
        </div>
    );
};

export default ParticleLogo;
