
import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Mesh } from 'three';

// Hotel model component - renders a basic building
function HotelBuilding({ floors = 5, color = "#f4f4f4" }: { floors?: number, color?: string }) {
  const buildingRef = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (buildingRef.current) {
      // Gentle automatic rotation
      buildingRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group>
      {/* Main building structure */}
      <mesh ref={buildingRef} castShadow receiveShadow position={[0, floors/2, 0]}>
        <boxGeometry args={[6, floors, 6]} />
        <meshStandardMaterial color={color} />
      </mesh>
      
      {/* Roof */}
      <mesh castShadow position={[0, floors + 0.5, 0]}>
        <boxGeometry args={[7, 1, 7]} />
        <meshStandardMaterial color="#C14B36" />
      </mesh>
      
      {/* Ground */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#8EB943" />
      </mesh>
      
      {/* Windows */}
      {Array.from({ length: floors }).map((_, floorIndex) =>
        Array.from({ length: 4 }).map((_, windowIndex) => (
          <mesh 
            key={`${floorIndex}-${windowIndex}`} 
            position={[
              // Distribute windows on all 4 sides
              windowIndex === 0 ? -3 : windowIndex === 1 ? 3 : 0,
              floorIndex + 0.5,
              windowIndex === 2 ? -3 : windowIndex === 3 ? 3 : 0,
            ]}
            castShadow
          >
            <boxGeometry args={[
              windowIndex < 2 ? 0.8 : 6, 
              0.8, 
              windowIndex < 2 ? 6 : 0.8
            ]} />
            <meshStandardMaterial color="#87CEEB" />
          </mesh>
        ))
      )}
    </group>
  );
}

// Main 3D Viewer component
export function HotelModel3D({ projectName, floorCount = 5 }: { projectName: string, floorCount?: number }) {
  // Pick a color based on the first letter of the project name
  const projectColors = [
    "#ECECEC", // light gray
    "#D6E4FF", // light blue
    "#FFE8D6", // light peach
    "#E2F0CB", // light green
    "#F0D1E6", // light pink
    "#D4F1F9", // light cyan
  ];
  
  // Simple hash function to pick a consistent color based on project name
  const colorIndex = projectName.charCodeAt(0) % projectColors.length;
  const buildingColor = projectColors[colorIndex];

  return (
    <div className="w-full h-[400px]">
      <Canvas shadows>
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow 
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024} 
        />
        <PerspectiveCamera makeDefault position={[15, 8, 15]} />
        <HotelBuilding floors={floorCount} color={buildingColor} />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={10}
          maxDistance={25}
        />
      </Canvas>
    </div>
  );
}
