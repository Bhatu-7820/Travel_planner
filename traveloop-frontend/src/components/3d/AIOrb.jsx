import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Siri-like voice wave displacement shader
const AIOrbShader = {
  vertexShader: `
    uniform float uTime;
    uniform float uHover;
    varying vec3 vNormal;
    varying vec3 vPosition;

    // Simple 3D noise approximation
    float noise(vec3 p) {
      return sin(p.x * 3.0 + uTime * 2.0) * cos(p.y * 3.0 + uTime * 1.5) * sin(p.z * 3.0 + uTime * 2.5);
    }

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      
      // Calculate wave displacement (faster and larger when hovered)
      float speed = 2.5 + uHover * 2.5;
      float amplitude = 0.11 + uHover * 0.08;
      
      float disp = noise(position * 2.0) * amplitude;
      vec3 newPosition = position + normal * disp;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uHover;
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      // Dynamic color shift between teal and indigo/purple
      vec3 colorTeal = vec3(0.08, 0.72, 0.65); // #14b8a6
      vec3 colorIndigo = vec3(0.39, 0.40, 0.95); // #6366f1
      
      float mixFactor = sin(uTime * 1.5) * 0.5 + 0.5;
      vec3 baseColor = mix(colorTeal, colorIndigo, mixFactor);
      
      // Add purple glowing edge highlights
      vec3 colorPurple = vec3(0.66, 0.33, 0.97); // #a855f7
      float edgeGlow = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 3.0);
      
      vec3 finalColor = mix(baseColor, colorPurple, edgeGlow * 0.6);
      
      // Adding a dynamic pulsing wave texture overlay
      float wave = sin(vPosition.y * 10.0 + uTime * 5.0) * 0.1 + 0.9;
      
      gl_FragColor = vec4(finalColor * wave, 0.9);
    }
  `
};

function PulsingMesh({ onClick }) {
  const meshRef = useRef(null);
  const [hovered, setHovered] = useState(false);

  // Maintain custom shader uniforms
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uHover: { value: 0 }
  }), []);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = elapsed * 0.4;
      meshRef.current.rotation.x = elapsed * 0.25;

      // Update uniforms
      meshRef.current.material.uniforms.uTime.value = elapsed;
      
      // Interpolate hover state multiplier
      const targetHover = hovered ? 1 : 0;
      meshRef.current.material.uniforms.uHover.value = THREE.MathUtils.lerp(
        meshRef.current.material.uniforms.uHover.value,
        targetHover,
        0.12
      );

      // Pulse scaling
      const baseScale = hovered ? 1.7 : 1.35;
      const pulse = Math.sin(elapsed * 4) * 0.05;
      meshRef.current.scale.setScalar(baseScale + pulse);
    }
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={onClick}
      className="cursor-pointer"
    >
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        vertexShader={AIOrbShader.vertexShader}
        fragmentShader={AIOrbShader.fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  );
}

export default function AIOrb({ onClick }) {
  return (
    <div className="w-20 h-20 sm:w-24 sm:h-24 select-none pointer-events-auto">
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={1.5} />
        <pointLight position={[5, 5, 5]} intensity={2.0} />
        <PulsingMesh onClick={onClick} />
      </Canvas>
    </div>
  );
}
