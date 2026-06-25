import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Convert Lat/Lng to 3D Cartesian coordinates
export function latLngToVector3(lat, lng, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.sin(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.cos(theta);
  return new THREE.Vector3(x, y, z);
}

// Procedural Earth Landmass Canvas Texture Generator
function createEarthCanvasTexture(isDark) {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Fill ocean color
  ctx.fillStyle = isDark ? '#080b11' : '#f1f5f9';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Polygon list of stylized continent coordinates (0 to 2048, 0 to 1024)
  const continents = {
    greenland: [
      [650, 150], [730, 100], [780, 130], [720, 240], [640, 200]
    ],
    northAmerica: [
      [100, 150], [300, 100], [450, 110], [550, 130], [580, 250],
      [610, 320], [640, 390], [610, 440], [550, 450], [520, 520],
      [500, 560], [440, 490], [380, 420], [330, 320], [280, 240],
      [150, 180]
    ],
    southAmerica: [
      [500, 560], [560, 550], [620, 570], [660, 600], [720, 640],
      [740, 680], [670, 780], [610, 880], [550, 930], [520, 900],
      [525, 780], [495, 680], [480, 600]
    ],
    africa: [
      [920, 440], [980, 420], [1060, 430], [1120, 440], [1140, 440],
      [1155, 470], [1180, 510], [1230, 550], [1220, 650], [1210, 750],
      [1170, 840], [1140, 880], [1120, 900], [1060, 800], [1040, 700],
      [1000, 650], [930, 620], [890, 580], [870, 520], [890, 470]
    ],
    madagascar: [
      [1230, 720], [1260, 750], [1240, 810], [1210, 770]
    ],
    eurasia: [
      [890, 410], [880, 380], [850, 350], [840, 280], [880, 260],
      [920, 240], [950, 180], [990, 160], [1020, 180], [990, 230],
      [980, 280], [1100, 150], [1300, 140], [1500, 130], [1700, 150],
      [1900, 170], [1950, 180], [1960, 220], [1920, 280], [1880, 350],
      [1830, 420], [1780, 480], [1730, 560], [1680, 620], [1540, 580],
      [1520, 620], [1500, 650], [1480, 620], [1460, 570], [1280, 530],
      [1310, 560], [1340, 580], [1330, 530], [1260, 490], [1200, 470],
      [1160, 450]
    ],
    australia: [
      [1680, 780], [1740, 740], [1800, 760], [1830, 800], [1850, 860],
      [1820, 920], [1740, 930], [1680, 900], [1670, 840]
    ],
    newZealand: [
      [1930, 920], [1960, 950], [1950, 980], [1910, 940]
    ]
  };

  // Draw landmass shapes filled with white
  ctx.fillStyle = '#ffffff';
  Object.values(continents).forEach((poly) => {
    ctx.beginPath();
    ctx.moveTo(poly[0][0], poly[0][1]);
    for (let i = 1; i < poly.length; i++) {
      ctx.lineTo(poly[i][0], poly[i][1]);
    }
    ctx.closePath();
    ctx.fill();
  });

  // Convert to cyber-grid matrix using source-in compositing
  ctx.globalCompositeOperation = 'source-in';
  
  // Fill land with glowing grid/dots pattern
  ctx.fillStyle = isDark ? '#14b8a6' : '#0d9488';
  for (let y = 0; y < canvas.height; y += 8) {
    for (let x = 0; x < canvas.width; x += 8) {
      ctx.fillRect(x, y, 3, 3);
    }
  }

  // Draw backing fill for continents using destination-over
  ctx.globalCompositeOperation = 'destination-over';
  ctx.fillStyle = isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.1)';
  Object.values(continents).forEach((poly) => {
    ctx.beginPath();
    ctx.moveTo(poly[0][0], poly[0][1]);
    for (let i = 1; i < poly.length; i++) {
      ctx.lineTo(poly[i][0], poly[i][1]);
    }
    ctx.closePath();
    ctx.fill();
  });

  // Draw glowing stroke outlines on top using source-over
  ctx.globalCompositeOperation = 'source-over';
  ctx.strokeStyle = isDark ? 'rgba(20, 184, 166, 0.7)' : 'rgba(13, 148, 136, 0.5)';
  ctx.lineWidth = 2.5;
  Object.values(continents).forEach((poly) => {
    ctx.beginPath();
    ctx.moveTo(poly[0][0], poly[0][1]);
    for (let i = 1; i < poly.length; i++) {
      ctx.lineTo(poly[i][0], poly[i][1]);
    }
    ctx.closePath();
    ctx.stroke();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// Custom atmosphere glowing shader
const AtmosphereShader = {
  vertexShader: `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    void main() {
      float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
      gl_FragColor = vec4(0.08, 0.72, 0.65, 1.0) * intensity;
    }
  `
};

// Flight Path Curved Line
function FlightPath({ startCoords, endCoords, radius, color }) {
  const points = useMemo(() => {
    const startVec = latLngToVector3(startCoords.lat, startCoords.lng, radius);
    const endVec = latLngToVector3(endCoords.lat, endCoords.lng, radius);
    
    // Calculate control point for curved arc
    const midPoint = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
    const distance = startVec.distanceTo(endVec);
    const height = radius + distance * 0.25;
    const controlPoint = midPoint.clone().normalize().multiplyScalar(height);

    const curve = new THREE.QuadraticBezierCurve3(startVec, controlPoint, endVec);
    return curve.getPoints(40);
  }, [startCoords, endCoords, radius]);

  const lineRef = useRef(null);
  useFrame((state) => {
    if (lineRef.current && lineRef.current.material) {
      lineRef.current.material.dashOffset -= 0.012;
    }
  });

  return (
    <group>
      <Line
        ref={lineRef}
        points={points}
        color={color || '#6366f1'}
        lineWidth={1.5}
        dashed
        dashScale={6}
        dashSize={0.4}
        dashGap={0.3}
      />
      <Line
        points={points}
        color={color || '#14b8a6'}
        lineWidth={0.5}
        opacity={0.35}
        transparent
      />
    </group>
  );
}

// Sample global destination routes
const DEFAULT_FLIGHT_ROUTES = [
  { start: { lat: 20.5937, lng: 78.9629 }, end: { lat: 48.8566, lng: 2.3522 }, color: '#14b8a6' }, // India to Paris
  { start: { lat: 35.6762, lng: 139.6503 }, end: { lat: -8.4095, lng: 115.1889 }, color: '#6366f1' }, // Tokyo to Bali
  { start: { lat: 40.7128, lng: -74.0060 }, end: { lat: 48.8566, lng: 2.3522 }, color: '#f59e0b' }, // NY to Paris
  { start: { lat: -22.9068, lng: -43.1729 }, end: { lat: 40.7128, lng: -74.0060 }, color: '#ec4899' }, // Rio to NY
  { start: { lat: 35.6762, lng: 139.6503 }, end: { lat: 40.7128, lng: -74.0060 }, color: '#10b981' } // Tokyo to NY
];

export default function TravelGlobe({ isDark = true }) {
  const globeGroupRef = useRef(null);
  const cloudsRef = useRef(null);

  const texture = useMemo(() => createEarthCanvasTexture(isDark), [isDark]);

  // Handle slow drift/auto-rotation
  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (globeGroupRef.current) {
      globeGroupRef.current.rotation.y = elapsed * 0.045;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = elapsed * 0.058;
      cloudsRef.current.rotation.x = Math.sin(elapsed * 0.01) * 0.05;
    }
  });

  return (
    <group>
      {/* Dynamic Starfield */}
      <Stars radius={120} depth={40} count={2200} factor={4} saturation={0.5} fade speed={1.2} />

      {/* Main globe container */}
      <group ref={globeGroupRef}>
        
        {/* Glowing Atmosphere layer */}
        <mesh>
          <sphereGeometry args={[2.07, 32, 32]} />
          <shaderMaterial
            vertexShader={AtmosphereShader.vertexShader}
            fragmentShader={AtmosphereShader.fragmentShader}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            transparent
            depthWrite={false}
          />
        </mesh>

        {/* Earth Mesh */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[2, 64, 64]} />
          <meshStandardMaterial
            map={texture}
            roughness={0.7}
            metalness={isDark ? 0.35 : 0.15}
            bumpScale={0.05}
          />
        </mesh>

        {/* Abstract Clouds Layer */}
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[2.025, 32, 32]} />
          <meshStandardMaterial
            color={isDark ? '#e2e8f0' : '#ffffff'}
            opacity={0.14}
            transparent
            wireframe
          />
        </mesh>

        {/* Flight Path Arcs */}
        {DEFAULT_FLIGHT_ROUTES.map((route, idx) => (
          <FlightPath
            key={idx}
            startCoords={route.start}
            endCoords={route.end}
            radius={2}
            color={route.color}
          />
        ))}

        {/* Destination Pins on Globe */}
        {DEFAULT_FLIGHT_ROUTES.map((route, idx) => {
          const pinPos = latLngToVector3(route.end.lat, route.end.lng, 2.015);
          return (
            <mesh key={`pin-${idx}`} position={pinPos}>
              <sphereGeometry args={[0.022, 16, 16]} />
              <meshBasicMaterial color="#14b8a6" />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}
