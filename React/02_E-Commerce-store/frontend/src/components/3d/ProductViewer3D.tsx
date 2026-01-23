import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  PresentationControls,
  Environment,
  Float,
  ContactShadows,
  Html,
  useProgress
} from '@react-three/drei';
import * as THREE from 'three';

// Loading component
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="text-white text-center">
        <div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-dark-400">{progress.toFixed(0)}% loaded</p>
      </div>
    </Html>
  );
}

// Floating product box (placeholder for actual 3D model)
function ProductBox({ color = '#6366f1' }: { color?: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });
  
  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={1}
    >
      <mesh ref={meshRef} castShadow>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial 
          color={color} 
          metalness={0.8}
          roughness={0.2}
          envMapIntensity={1}
        />
      </mesh>
    </Float>
  );
}

// Glowing ring around product
function GlowRing() {
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.5;
    }
  });
  
  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <torusGeometry args={[2.5, 0.05, 16, 100]} />
      <meshBasicMaterial color="#6366f1" transparent opacity={0.6} />
    </mesh>
  );
}

interface ProductViewer3DProps {
  className?: string;
  productColor?: string;
  showControls?: boolean;
  autoRotate?: boolean;
}

export function ProductViewer3D({
  className = '',
  productColor = '#6366f1',
  showControls = true,
  autoRotate = true,
}: ProductViewer3DProps) {
  return (
    <div className={`w-full h-[400px] md:h-[500px] ${className}`}>
      <Canvas
        shadows
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 2]}
      >
        <Suspense fallback={<Loader />}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={1}
            castShadow
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
          
          {/* Environment for reflections */}
          <Environment preset="city" />
          
          {/* Product with presentation controls */}
          <PresentationControls
            global
            snap
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 3, Math.PI / 3]}
            azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
          >
            <ProductBox color={productColor} />
          </PresentationControls>
          
          <GlowRing />
          
          {/* Shadow */}
          <ContactShadows
            position={[0, -2.5, 0]}
            opacity={0.5}
            scale={10}
            blur={2}
            far={4}
          />
          
          {/* Controls */}
          {showControls && (
            <OrbitControls
              enableZoom={false}
              autoRotate={autoRotate}
              autoRotateSpeed={2}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={Math.PI / 1.5}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}

// Simpler floating product for cards
interface FloatingProduct3DProps {
  className?: string;
}

export function FloatingProduct3D({ className = '' }: FloatingProduct3DProps) {
  return (
    <div className={`w-full h-[200px] ${className}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Float speed={3} floatIntensity={2}>
          <mesh>
            <boxGeometry args={[1.5, 1.5, 1.5]} />
            <meshStandardMaterial
              color="#6366f1"
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
        </Float>
      </Canvas>
    </div>
  );
}
