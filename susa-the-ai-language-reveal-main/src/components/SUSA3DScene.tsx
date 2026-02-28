import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Float, Environment } from "@react-three/drei";
import { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useThemeIntelligence } from "@/hooks/useThemeIntelligence";

// Real-time window size hook
const useWindowSize = () => {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
};

type ActiveSection = "S1" | "U" | "S2" | "A" | null;

interface Letter3DProps {
  char: string;
  position: [number, number, number];
  letterKey: ActiveSection;
  activeSection: ActiveSection;
  onLetterClick: (letter: ActiveSection) => void;
  isZooming: boolean;
}

const getLetterPositions = (width: number): Record<string, [number, number, number]> => {
  if (width < 600) {
    return { S1: [-1.6, 0, 0], U: [-0.53, 0, 0], S2: [0.53, 0, 0], A: [1.6, 0, 0] };
  }
  if (width < 1024) {
    return { S1: [-3.0, 0, 0], U: [-1.0, 0, 0], S2: [1.0, 0, 0], A: [3.0, 0, 0] };
  }
  return { S1: [-4.5, 0, 0], U: [-1.5, 0, 0], S2: [1.5, 0, 0], A: [4.5, 0, 0] };
};

const FractureShard = ({ char, position, color, isBroken, dragPoint, isMobile }: {
  char: string,
  position: [number, number, number],
  color: string,
  isBroken: boolean,
  dragPoint: THREE.Vector3 | null,
  isMobile: boolean
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const velocity = useRef(new THREE.Vector3());
  const targetPos = useRef(new THREE.Vector3(...position));
  const currentPos = useRef(new THREE.Vector3(...position));

  const metalness = 0.95;
  const roughness = 0.05;

  const shardProps = useMemo(() => ({
    offset: new THREE.Vector3(
      (Math.random() - 0.5) * (isMobile ? 1.5 : 2.5),
      (Math.random() - 0.5) * (isMobile ? 2.0 : 3.5),
      (Math.random() - 0.5) * 0.2
    ),
    scale: 0.2 + Math.random() * 0.4,
    rotationSpeed: (Math.random() - 0.5) * 0.2
  }), [isMobile]);

  useEffect(() => {
    if (isBroken) {
      velocity.current.set(
        (Math.random() - 0.5) * 0.15,
        (Math.random() - 0.2) * 0.12,
        (Math.random() - 0.5) * 0.1
      );
    }
  }, [isBroken]);

  const prevDragPoint = useRef<THREE.Vector3 | null>(null);
  const isBack = useRef(true);

  useFrame(() => {
    if (!meshRef.current) return;

    if (isBroken) {
      isBack.current = false;
      velocity.current.y -= (0.006 + shardProps.rotationSpeed * 0.02);

      if (dragPoint) {
        if (!prevDragPoint.current) {
          prevDragPoint.current = new THREE.Vector3().copy(dragPoint);
        }

        const mouseVel = new THREE.Vector3().copy(dragPoint).sub(prevDragPoint.current);
        const dist = currentPos.current.distanceTo(dragPoint);
        const pushDist = isMobile ? 2.5 : 4.0;

        if (dist < pushDist) {
          const force = (1.0 - dist / pushDist) * 0.8;
          const impulseX = THREE.MathUtils.clamp(mouseVel.x * force, -0.1, 0.1);
          const impulseY = THREE.MathUtils.clamp(mouseVel.y * force, -0.1, 0.1);

          velocity.current.x += impulseX;
          velocity.current.y += impulseY;
          velocity.current.z += (Math.random() - 0.5) * 0.01;
        }

        prevDragPoint.current.copy(dragPoint);
      }

      velocity.current.multiplyScalar(0.92);
      currentPos.current.add(velocity.current);

      const floorY = -4.0;
      if (currentPos.current.y < floorY) {
        currentPos.current.y = floorY;
        velocity.current.y *= -0.1;
        velocity.current.x *= 0.7;
      }

      meshRef.current.rotation.x += velocity.current.y * 0.12 + shardProps.rotationSpeed;
      meshRef.current.rotation.y += velocity.current.x * 0.12 + shardProps.rotationSpeed;
    } else {
      prevDragPoint.current = null;
      currentPos.current.lerp(targetPos.current, 0.15);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, 0, 0.15);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, 0.15);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, 0, 0.15);
      velocity.current.set(0, 0, 0);

      if (currentPos.current.distanceTo(targetPos.current) < 0.45) {
        isBack.current = true;
      }
    }

    meshRef.current.position.copy(currentPos.current);
  });

  return (
    <group ref={meshRef} visible={isBroken || !isBack.current}>
      <mesh scale={isMobile ? shardProps.scale * 0.7 : shardProps.scale}>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={color}
          metalness={metalness}
          roughness={roughness}
          transparent
          opacity={0.9}
          emissive={color}
          emissiveIntensity={1.5}
        />
      </mesh>
    </group>
  );
};

const FractureSystem = ({ char, hovered, color, isMobile, isBroken, dragPoint }: {
  char: string,
  hovered: boolean,
  color: string,
  isMobile: boolean,
  isBroken: boolean,
  dragPoint: THREE.Vector3 | null
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const shardCount = isMobile ? 15 : 24;

  const shardPositions = useMemo(() => {
    let points: [number, number, number][] = [];

    if (char === 'A') {
      points = [
        [0, 2.5, 0], [-0.5, 1.5, 0], [0.5, 1.5, 0],
        [-1, 0, 0], [1, 0, 0], [-1.5, -1.5, 0], [1.5, -1.5, 0],
        [-2, -3, 0], [2, -3, 0], [-0.5, -0.2, 0], [0.5, -0.2, 0], [0, -0.2, 0],
        [-0.8, 0.8, 0], [0.8, 0.8, 0],
      ];
    } else if (char === 'U') {
      points = [
        [-1.8, 2.5, 0], [1.8, 2.5, 0], [-1.8, 1, 0], [1.8, 1, 0],
        [-1.8, -0.5, 0], [1.8, -0.5, 0], [-1.5, -2, 0], [1.5, -2, 0],
        [-0.8, -2.8, 0], [0.8, -2.8, 0], [0, -3, 0],
      ];
    } else {
      points = [
        [0.8, 2.5, 0], [-0.8, 2.8, 0], [-1.8, 1.5, 0],
        [0, 0.2, 0], [0.8, 0.2, 0], [-0.8, 0.2, 0],
        [1.8, -1.2, 0], [0.8, -2.5, 0], [-0.8, -2.8, 0],
        [-1, 2, 0], [1, -2, 0],
      ];
    }

    const finalPoints = [];
    const spread = points.length;
    for (let i = 0; i < shardCount; i++) {
      const base = points[i % spread];
      finalPoints.push([
        base[0] + (Math.random() - 0.5) * 0.5,
        base[1] + (Math.random() - 0.5) * 0.5,
        base[2] + (Math.random() - 0.5) * 0.15,
      ] as [number, number, number]);
    }
    return finalPoints;
  }, [char, shardCount]);

  useFrame(() => {
    if (!groupRef.current) return;

    if (hovered && !isBroken) {
      groupRef.current.position.x = (Math.random() - 0.5) * 0.05;
      groupRef.current.position.y = (Math.random() - 0.5) * 0.05;
    } else {
      groupRef.current.position.set(0, 0, 0);
    }
  });

  return (
    <group ref={groupRef}>
      {hovered && !isBroken && (
        <group scale={1.02}>
          <Text
            fontSize={isMobile ? 2.5 : 4.0}
            fontWeight={700}
            letterSpacing={-0.05}
            anchorX="center"
            anchorY="middle"
          >
            {char}
            <meshStandardMaterial
              color="#ffffff"
              wireframe
              transparent
              opacity={0.4}
              emissive="#00ffff"
              emissiveIntensity={1.5}
            />
          </Text>
        </group>
      )}

      {shardPositions.map((pos, i) => (
        <FractureShard
          key={i}
          char={char}
          position={pos}
          color={color}
          isBroken={isBroken}
          dragPoint={dragPoint}
          isMobile={isMobile}
        />
      ))}
    </group>
  );
};

const Letter3D = ({ char, position, letterKey, activeSection, onLetterClick, isZooming }: Letter3DProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [isBroken, setIsBroken] = useState(false);
  const [dragPoint, setDragPoint] = useState<THREE.Vector3 | null>(null);
  const [reassembleGlow, setReassembleGlow] = useState(0);
  const reassembleTimer = useRef<NodeJS.Timeout | null>(null);
  const { viewport, mouse } = useThree();

  const isActive = activeSection === letterKey;
  const isMobile = window.innerWidth < 768;
  const shouldHide = activeSection && !isZooming;
  const letterColor = "#00e5ff";

  const handlePointerOver = (e: any) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
    setIsBroken(true);
    if (reassembleTimer.current) clearTimeout(reassembleTimer.current);
  };

  const handlePointerMove = (e: any) => {
    const x = (mouse.x * viewport.width) / 2 - position[0];
    const y = (mouse.y * viewport.height) / 2 - position[1];
    setDragPoint(new THREE.Vector3(x, y, 0));

    if (reassembleTimer.current) clearTimeout(reassembleTimer.current);
    reassembleTimer.current = setTimeout(() => {
      setIsBroken(false);
      setDragPoint(null);
      setReassembleGlow(1.0);
    }, 5000);
  };

  useFrame((state) => {
    if (!groupRef.current || !meshRef.current) return;

    if (reassembleGlow > 0) setReassembleGlow(prev => Math.max(0, prev - 0.05));

    if (shouldHide) {
      groupRef.current.visible = false;
      return;
    } else {
      groupRef.current.visible = true;
    }

    if (hovered && !isZooming && !isBroken) {
      const mouseX = (mouse.x * viewport.width) / 2;
      const mouseY = (mouse.y * viewport.height) / 2;
      const dx = (mouseX - position[0]) * 0.4;
      const dy = (mouseY - position[1]) * 0.4;

      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, dx, 0.1);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, dy, 0.1);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, (mouse.x * Math.PI) / 8, 0.1);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, -(mouse.y * Math.PI) / 8, 0.1);
    } else {
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, 0, 0.1);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0, 0.1);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, 0.1);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, 0, 0.1);
    }

    const breathing = Math.sin(state.clock.elapsedTime * 0.8) * 0.03;
    const baseScale = isMobile ? 1.0 : 1.35;
    const pulseScale = hovered ? Math.sin(state.clock.elapsedTime * 4) * 0.04 : 0;

    const targetScale = hovered && !isZooming && !isBroken
      ? baseScale * 1.1 + pulseScale
      : isActive ? baseScale * 1.2 : baseScale + breathing;

    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

    groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.02;
    groupRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 0.3) * 0.02;
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerOver={handlePointerOver}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
      onPointerMove={handlePointerMove}
      onClick={(e) => {
        e.stopPropagation();
        if (!isZooming && !isBroken) {
          onLetterClick(letterKey);
        }
      }}
    >
      <group ref={meshRef}>
        <FractureSystem
          char={char}
          hovered={hovered}
          color={letterColor}
          isMobile={isMobile}
          isBroken={isBroken}
          dragPoint={dragPoint}
        />

        <Text
          fontSize={isMobile ? 2.5 : 4.0}
          fontWeight={700}
          letterSpacing={-0.05}
          anchorX="center"
          anchorY="middle"
          visible={!isBroken || reassembleGlow > 0.05}
        >
          {char}
          <meshStandardMaterial
            color={isActive ? letterColor : "#f0f0f0"}
            emissive={isActive ? letterColor : "#ffffff"}
            emissiveIntensity={(isActive || hovered ? 4.0 : 0.5) + reassembleGlow * 8}
            metalness={0.9}
            roughness={0.1}
            transparent
            opacity={!isBroken ? 1 : reassembleGlow}
          />
        </Text>

        <Text
          fontSize={isMobile ? 2.5 : 4.0}
          fontWeight={700}
          letterSpacing={-0.05}
          anchorX="center"
          anchorY="middle"
          position={[0, 0, -0.4]}
        >
          {char}
          <meshBasicMaterial
            color={letterColor}
            transparent
            opacity={(isActive ? 0.8 : 0.2) * (isBroken ? 0 : 1)}
          />
        </Text>
      </group>

      <pointLight
        position={[0, 0, 3]}
        intensity={(hovered || isActive ? 30 : 5) * (isBroken ? 0.5 : 1)}
        color={letterColor}
        distance={15}
        decay={2}
      />
    </group>
  );
};

interface CameraControllerProps {
  activeSection: ActiveSection;
  isZooming: boolean;
  setIsZooming: (v: boolean) => void;
  letterPositions: Record<string, [number, number, number]>;
  initialZoomOut: boolean;
}

const CameraController = ({ activeSection, isZooming, setIsZooming, letterPositions, initialZoomOut }: CameraControllerProps) => {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3(0, 0, 14));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  const adaptiveDistance = useMemo(() => {
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;
    const aspect = screenW / screenH;
    const targetWidth = 15;
    const fovRad = (camera as THREE.PerspectiveCamera).fov * (Math.PI / 180);
    const distanceForWidth = (targetWidth / aspect) / (2 * Math.tan(fovRad / 2));
    return Math.max(12, distanceForWidth);
  }, [camera]);

  useEffect(() => {
    if (initialZoomOut) {
      camera.position.set(0, 0, 2);
      targetPosition.current.set(0, 0, adaptiveDistance);
    }
  }, [initialZoomOut, camera, adaptiveDistance]);

  useEffect(() => {
    if (activeSection) {
      setIsZooming(true);
      const letterPos = letterPositions[activeSection];
      targetPosition.current.set(letterPos[0], letterPos[1], -2);
      targetLookAt.current.set(letterPos[0], letterPos[1], -10);
    } else {
      setIsZooming(true);
      targetPosition.current.set(0, 0, adaptiveDistance);
      targetLookAt.current.set(0, 0, 0);
    }

    const timer = setTimeout(() => setIsZooming(false), 1200);
    return () => clearTimeout(timer);
  }, [activeSection, setIsZooming, letterPositions, adaptiveDistance]);

  useFrame(() => {
    camera.position.lerp(targetPosition.current, 0.05);
    currentLookAt.current.lerp(targetLookAt.current, 0.05);
    camera.lookAt(currentLookAt.current);
  });

  return null;
};

const ParticleField = ({ count = 200 }: { count?: number }) => {
  const points = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40 - 10;

      const intensity = Math.random();
      col[i * 3] = 0.3 + intensity * 0.7;
      col[i * 3 + 1] = 0.7 + intensity * 0.3;
      col[i * 3 + 2] = 1;
    }

    return [pos, col];
  }, [count]);

  useFrame((state) => {
    if (!points.current) return;
    if (state.clock.elapsedTime % 0.1 < 0.016) {
      points.current.rotation.y = state.clock.elapsedTime * 0.01;
      points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.005) * 0.05;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors transparent opacity={0.5} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  );
};


interface SUSA3DSceneProps {
  activeSection: ActiveSection;
  setActiveSection: (section: ActiveSection) => void;
  initialZoomOut?: boolean;
}

const SUSA3DScene = ({ activeSection, setActiveSection, initialZoomOut = false }: SUSA3DSceneProps) => {
  const [isZooming, setIsZooming] = useState(false);
  const { theme } = useThemeIntelligence();
  const { width } = useWindowSize();

  const handleLetterClick = (letter: ActiveSection) => {
    if (isZooming) return;
    setActiveSection(letter);
  };

  const isMobile = width < 768;
  const cameraFov = width < 600 ? 70 : width < 1024 ? 60 : 50;
  const cameraPosition: [number, number, number] = [0, 0, 14];
  const letterPositions = getLetterPositions(width);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      margin: 0,
      padding: 0,
      overflow: 'hidden',
      pointerEvents: 'auto'
    }}>
      <Canvas
        key="susa-3d-canvas"
        camera={{ position: cameraPosition, fov: cameraFov }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
        dpr={[1, Math.min(window.devicePixelRatio, 2)]}
        performance={{ min: 0.8 }}
        style={{
          position: 'absolute',
          inset: 0,
          margin: 0,
          padding: 0,
          display: 'block'
        }}
      >
        {/* No fog — background images handle the atmosphere */}
        <ambientLight intensity={theme === 'dark' ? 0.4 : 0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.2} color="#ffffff" />
        <directionalLight position={[-10, 5, -5]} intensity={0.6} color={theme === 'dark' ? "#00d4ff" : "#ffcc88"} />

        <CameraController
          activeSection={activeSection}
          isZooming={isZooming}
          setIsZooming={setIsZooming}
          letterPositions={letterPositions}
          initialZoomOut={initialZoomOut}
        />

        <ParticleField count={150} />

        <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.2}>
          <group>
            <Letter3D char="S" position={letterPositions.S1} letterKey="S1" activeSection={activeSection} onLetterClick={handleLetterClick} isZooming={isZooming} />
            <Letter3D char="U" position={letterPositions.U} letterKey="U" activeSection={activeSection} onLetterClick={handleLetterClick} isZooming={isZooming} />
            <Letter3D char="S" position={letterPositions.S2} letterKey="S2" activeSection={activeSection} onLetterClick={handleLetterClick} isZooming={isZooming} />
            <Letter3D char="A" position={letterPositions.A} letterKey="A" activeSection={activeSection} onLetterClick={handleLetterClick} isZooming={isZooming} />
          </group>
        </Float>

        <Environment preset="city" />
      </Canvas>
    </div>
  );
};

export default SUSA3DScene;
