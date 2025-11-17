import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sky, Environment } from '@react-three/drei';
import * as THREE from 'three';

interface GameObject {
  id: number;
  name: string;
  type: 'Part' | 'SpawnLocation' | 'Model' | 'Script';
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
}

interface Game3DEngineProps {
  objects: GameObject[];
  selectedObject: number | null;
  onSelectObject: (id: number | null) => void;
  isPlaying: boolean;
  activeTool: 'select' | 'move' | 'scale' | 'rotate';
}

function Player({ spawnPosition }: { spawnPosition: [number, number, number] }) {
  const playerRef = useRef<THREE.Mesh>(null);
  const velocityRef = useRef(new THREE.Vector3(0, 0, 0));
  const [position, setPosition] = useState<[number, number, number]>(spawnPosition);
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const { camera } = useThree();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useFrame((state, delta) => {
    if (!playerRef.current) return;

    const speed = 10;
    const jumpForce = 8;
    const gravity = -25;
    
    const forward = new THREE.Vector3();
    const right = new THREE.Vector3();
    
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

    const movement = new THREE.Vector3(0, 0, 0);

    if (keysPressed.current['w']) movement.add(forward);
    if (keysPressed.current['s']) movement.sub(forward);
    if (keysPressed.current['a']) movement.sub(right);
    if (keysPressed.current['d']) movement.add(right);

    if (movement.length() > 0) {
      movement.normalize();
      velocityRef.current.x = movement.x * speed;
      velocityRef.current.z = movement.z * speed;
    } else {
      velocityRef.current.x *= 0.8;
      velocityRef.current.z *= 0.8;
    }

    velocityRef.current.y += gravity * delta;

    const newPosition: [number, number, number] = [
      position[0] + velocityRef.current.x * delta,
      position[1] + velocityRef.current.y * delta,
      position[2] + velocityRef.current.z * delta,
    ];

    if (newPosition[1] <= 2) {
      newPosition[1] = 2;
      velocityRef.current.y = 0;
      
      if (keysPressed.current[' ']) {
        velocityRef.current.y = jumpForce;
      }
    }

    setPosition(newPosition);
    playerRef.current.position.set(...newPosition);

    camera.position.set(
      newPosition[0],
      newPosition[1] + 5,
      newPosition[2] + 10
    );
    camera.lookAt(newPosition[0], newPosition[1] + 1, newPosition[2]);
  });

  return (
    <group ref={playerRef as any} position={position}>
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial color="#3b82f6" />
      </mesh>
      
      <mesh position={[0, 1.25, 0]} castShadow>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#60a5fa" />
      </mesh>

      <mesh position={[-0.3, 0, 0]} castShadow>
        <boxGeometry args={[0.3, 1.5, 0.3]} />
        <meshStandardMaterial color="#2563eb" />
      </mesh>
      <mesh position={[0.3, 0, 0]} castShadow>
        <boxGeometry args={[0.3, 1.5, 0.3]} />
        <meshStandardMaterial color="#2563eb" />
      </mesh>

      <mesh position={[-0.25, -0.75, 0]} castShadow>
        <boxGeometry args={[0.3, 1, 0.3]} />
        <meshStandardMaterial color="#1e40af" />
      </mesh>
      <mesh position={[0.25, -0.75, 0]} castShadow>
        <boxGeometry args={[0.3, 1, 0.3]} />
        <meshStandardMaterial color="#1e40af" />
      </mesh>
    </group>
  );
}

function GameObject3D({ 
  obj, 
  isSelected, 
  onClick, 
  isPlaying 
}: { 
  obj: GameObject; 
  isSelected: boolean; 
  onClick: () => void;
  isPlaying: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current && isSelected && !isPlaying) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  const isSpawn = obj.type === 'SpawnLocation';

  return (
    <mesh
      ref={meshRef}
      position={obj.position}
      rotation={obj.rotation}
      scale={obj.scale}
      onClick={(e) => {
        e.stopPropagation();
        if (!isPlaying) onClick();
      }}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={obj.color} 
        emissive={isSelected ? '#ffffff' : isSpawn ? '#3b82f6' : '#000000'}
        emissiveIntensity={isSelected ? 0.3 : isSpawn ? 0.2 : 0}
        opacity={isSpawn ? 0.8 : 1}
        transparent={isSpawn}
      />
      {isSelected && !isPlaying && (
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(1.02, 1.02, 1.02)]} />
          <lineBasicMaterial color="#00ffff" linewidth={2} />
        </lineSegments>
      )}
    </mesh>
  );
}

function Grid() {
  return (
    <>
      <gridHelper args={[100, 100, '#444444', '#222222']} position={[0, 0, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </>
  );
}

export default function Game3DEngine({ 
  objects, 
  selectedObject, 
  onSelectObject, 
  isPlaying,
  activeTool 
}: Game3DEngineProps) {
  const spawnLocation = objects.find(obj => obj.type === 'SpawnLocation');
  const spawnPosition: [number, number, number] = spawnLocation 
    ? [spawnLocation.position[0], spawnLocation.position[1] + 2, spawnLocation.position[2]]
    : [0, 2, 0];

  return (
    <Canvas
      shadows
      camera={{ position: [20, 15, 20], fov: 60 }}
      onPointerMissed={() => !isPlaying && onSelectObject(null)}
      style={{ background: 'linear-gradient(to bottom, #87ceeb 0%, #e0f6ff 100%)' }}
    >
      <Sky 
        distance={450000}
        sunPosition={[100, 20, 100]}
        inclination={0.6}
        azimuth={0.25}
      />
      
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[50, 50, 50]} 
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={200}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      
      <Grid />

      {objects.map((obj) => (
        <GameObject3D
          key={obj.id}
          obj={obj}
          isSelected={selectedObject === obj.id}
          onClick={() => onSelectObject(obj.id)}
          isPlaying={isPlaying}
        />
      ))}

      {isPlaying && <Player spawnPosition={spawnPosition} />}

      {!isPlaying && <OrbitControls makeDefault />}
      
      <Environment preset="sunset" />
    </Canvas>
  );
}
