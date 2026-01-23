import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Particles({ count = 500 }) {
  const mesh = useRef<THREE.Points>(null);
  const positionRef = useRef<THREE.BufferAttribute>(null);
  const colorRef = useRef<THREE.BufferAttribute>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;
      
      // Gradient from primary to secondary color
      const t = Math.random();
      colors[i3] = 0.39 + t * 0.15; // R: primary to secondary
      colors[i3 + 1] = 0.4 - t * 0.1; // G
      colors[i3 + 2] = 0.95; // B
    }
    
    return { positions, colors };
  }, [count]);
  
  useEffect(() => {
    if (positionRef.current) {
      positionRef.current.needsUpdate = true;
    }
    if (colorRef.current) {
      colorRef.current.needsUpdate = true;
    }
  }, [particles]);
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.elapsedTime * 0.02;
      mesh.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });
  
  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          ref={positionRef}
          attach="attributes-position"
          args={[particles.positions, 3]}
        />
        <bufferAttribute
          ref={colorRef}
          attach="attributes-color"
          args={[particles.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export function ParticleField() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 2]}
      >
        <Particles count={800} />
      </Canvas>
    </div>
  );
}
