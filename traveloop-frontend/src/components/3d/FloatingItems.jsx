import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 1. Procedural 3D Suitcase
export function Suitcase({ position = [0, 0, 0], scale = 0.6 }) {
  const ref = useRef(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      // Float
      ref.current.position.y = position[1] + Math.sin(t * 1.4) * 0.12;
      // Rotation + Mouse react
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, state.pointer.y * 0.4, 0.08);
      ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, state.pointer.x * 0.4 + t * 0.15, 0.08);
      ref.current.rotation.z = Math.sin(t * 0.4) * 0.05;
    }
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      {/* Main Body */}
      <mesh castShadow>
        <boxGeometry args={[1.5, 1.1, 0.5]} />
        <meshStandardMaterial color="#312e81" roughness={0.4} metalness={0.2} />
      </mesh>
      {/* Corner protectors */}
      {[-0.76, 0.76].map((x, idx) => 
        [-0.56, 0.56].map((y, idy) => (
          <mesh key={`${idx}-${idy}`} position={[x, y, 0]}>
            <boxGeometry args={[0.2, 0.2, 0.54]} />
            <meshStandardMaterial color="#14b8a6" metalness={0.8} roughness={0.2} />
          </mesh>
        ))
      )}
      {/* Handle */}
      <mesh position={[0, 0.65, 0]}>
        <torusGeometry args={[0.25, 0.06, 8, 24, Math.PI]} />
        <meshStandardMaterial color="#14b8a6" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Straps */}
      {[-0.4, 0.4].map((x, idx) => (
        <mesh key={`strap-${idx}`} position={[x, 0, 0.01]}>
          <boxGeometry args={[0.12, 1.12, 0.52]} />
          <meshStandardMaterial color="#0f172a" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

// 2. Procedural 3D Passport
export function Passport({ position = [0, 0, 0], scale = 0.5 }) {
  const ref = useRef(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(t * 1.1 + 1) * 0.15;
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, state.pointer.y * 0.5 + 0.2, 0.08);
      ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, state.pointer.x * 0.3 - t * 0.1, 0.08);
      ref.current.rotation.z = Math.cos(t * 0.3) * 0.08;
    }
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      {/* Cover */}
      <mesh castShadow>
        <boxGeometry args={[0.9, 1.3, 0.08]} />
        <meshStandardMaterial color="#991b1b" roughness={0.7} />
      </mesh>
      {/* Gold Emblem details */}
      <mesh position={[0, 0.1, 0.05]}>
        <torusGeometry args={[0.18, 0.02, 8, 24]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, 0.1, 0.05]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.9} roughness={0.1} />
      </mesh>
      {/* Pages edge */}
      <mesh position={[-0.43, 0, 0]}>
        <boxGeometry args={[0.04, 1.26, 0.07]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.5} />
      </mesh>
    </group>
  );
}

// 3. Procedural 3D Compass
export function Compass({ position = [0, 0, 0], scale = 0.5 }) {
  const ref = useRef(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(t * 1.5 + 2) * 0.1;
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, 0.4 + state.pointer.y * 0.3, 0.08);
      ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, t * 0.08 + state.pointer.x * 0.3, 0.08);
    }
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      {/* Outer Rim */}
      <mesh castShadow>
        <cylinderGeometry args={[0.7, 0.7, 0.15, 32]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Golden Inner Dial */}
      <mesh position={[0, 0.08, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.02, 32]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Compass Needle */}
      <group position={[0, 0.1, 0]}>
        <mesh castShadow>
          <coneGeometry args={[0.08, 0.5, 4]} />
          <meshStandardMaterial color="#ef4444" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh castShadow position={[0, 0, 0]} rotation={[0, 0, Math.PI]}>
          <coneGeometry args={[0.08, 0.5, 4]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
      {/* Center cap */}
      <mesh position={[0, 0.12, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}

// 4. Procedural 3D Tickets
export function Tickets({ position = [0, 0, 0], scale = 0.5 }) {
  const ref = useRef(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(t * 1.3 - 1) * 0.14;
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, 0.3 + state.pointer.y * 0.4, 0.08);
      ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, state.pointer.x * 0.4 - t * 0.2, 0.08);
      ref.current.rotation.z = Math.sin(t * 0.2) * 0.15;
    }
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      {/* Ticket 1 (Teal) */}
      <group position={[-0.1, 0, -0.05]} rotation={[0, 0, 0.1]}>
        <mesh castShadow>
          <boxGeometry args={[1.2, 0.6, 0.02]} />
          <meshStandardMaterial color="#14b8a6" roughness={0.5} />
        </mesh>
        {/* Ticket notch details */}
        {[-0.56, 0.56].map((x, idx) => (
          <mesh key={idx} position={[x, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
        ))}
      </group>

      {/* Ticket 2 (Indigo) */}
      <group position={[0.1, -0.1, 0.05]} rotation={[0, 0, -0.15]}>
        <mesh castShadow>
          <boxGeometry args={[1.2, 0.6, 0.02]} />
          <meshStandardMaterial color="#6366f1" roughness={0.5} />
        </mesh>
        {/* Ticket notch details */}
        {[-0.56, 0.56].map((x, idx) => (
          <mesh key={idx} position={[x, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// 5. Procedural 3D Airplane
export function Airplane({ position = [0, 0, 0], scale = 0.5 }) {
  const ref = useRef(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(t * 1.8) * 0.18;
      // Banking effect on mouse move
      ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, state.pointer.y * 0.5, 0.08);
      ref.current.rotation.z = THREE.MathUtils.lerp(ref.current.rotation.z, -state.pointer.x * 0.6, 0.08);
      ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, t * 0.3, 0.08);
    }
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      {/* Fuselage (Main Body) */}
      <mesh castShadow rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.1, 1.4, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.1} />
      </mesh>
      {/* Cockpit Nose */}
      <mesh position={[0, 0.7, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>
      {/* Main Wings */}
      <mesh position={[0, 0.1, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1.5, 0.04, 0.35]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>
      {/* Wing Tips (Teal) */}
      {[-0.75, 0.75].map((x, idx) => (
        <mesh key={idx} position={[x, 0.05, 0]} rotation={[0, 0, x > 0 ? 0.3 : -0.3]}>
          <boxGeometry args={[0.06, 0.12, 0.25]} />
          <meshStandardMaterial color="#14b8a6" metalness={0.5} />
        </mesh>
      ))}
      {/* Tail Wings */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[0.5, 0.03, 0.18]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.3} />
      </mesh>
      {/* Vertical Stabilizer (Fin) */}
      <mesh position={[0, -0.48, 0.12]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.03, 0.24, 0.2]} />
        <meshStandardMaterial color="#14b8a6" roughness={0.3} />
      </mesh>
    </group>
  );
}

// Parent component grouping all items
export default function FloatingItems() {
  return (
    <group>
      {/* Distributed down the page layout coordinates */}
      <Airplane position={[-2.2, -3.8, 0.5]} scale={0.7} />
      <Suitcase position={[-2.4, -4.8, 0]} scale={0.65} />
      <Passport position={[2.3, -7.5, 0.8]} scale={0.6} />
      <Compass position={[2.5, -8.6, 0.2]} scale={0.62} />
      <Tickets position={[-2.2, -10.5, 0.6]} scale={0.7} />
    </group>
  );
}
