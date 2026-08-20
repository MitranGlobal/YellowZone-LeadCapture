'use client';

import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, useTexture } from '@react-three/drei';
import * as THREE from 'three';

/**
 * A certification is, physically, a struck seal. So the hero object is the
 * Yellow Zone seal as an actual metal medallion: navy die face, gold milled
 * rim, and a specular highlight that travels across it as if a light were
 * being moved over an embossed award.
 */

const GOLD = '#E8A317';
const GOLD_DEEP = '#B9770E';

function Medallion({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const sweep = useRef<THREE.PointLight>(null);
  const { viewport } = useThree();

  const texture = useTexture('/seal.png');
  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    // Seal art is round on a square canvas; keep it centred on the die face.
    texture.center.set(0.5, 0.5);
  }, [texture]);

  const faceMaterials = useMemo(() => {
    const rim = new THREE.MeshStandardMaterial({
      color: GOLD,
      metalness: 0.95,
      roughness: 0.32,
    });
    const face = new THREE.MeshStandardMaterial({
      map: texture,
      metalness: 0.12,
      roughness: 0.52,
    });
    const back = new THREE.MeshStandardMaterial({
      color: GOLD_DEEP,
      metalness: 0.9,
      roughness: 0.45,
    });
    // CylinderGeometry material order: [side, top, bottom]
    return [rim, face, back];
  }, [texture]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!group.current) return;

    if (reduced) {
      group.current.rotation.set(-0.06, 0, 0);
      group.current.position.y = 0;
      return;
    }

    // Pointer parallax, damped, clamped so the die face never turns away.
    const px = (state.pointer.x * viewport.width) / 22;
    const py = (state.pointer.y * viewport.height) / 22;

    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      THREE.MathUtils.clamp(px, -0.34, 0.34) + Math.sin(t * 0.35) * 0.08,
      0.05,
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      THREE.MathUtils.clamp(-py, -0.26, 0.26) - 0.05,
      0.05,
    );
    group.current.position.y = Math.sin(t * 0.7) * 0.055;

    // The travelling highlight across the struck metal.
    if (sweep.current) {
      sweep.current.position.x = Math.cos(t * 0.55) * 3.4;
      sweep.current.position.y = Math.sin(t * 0.55) * 2.2 + 0.6;
    }
  });

  return (
    <group ref={group}>
      {/* Die body: face carries the seal artwork, side is milled gold */}
      <mesh castShadow material={faceMaterials} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.34, 1.34, 0.13, 160]} />
      </mesh>

      {/* Milled outer rim */}
      <mesh rotation={[0, 0, 0]}>
        <torusGeometry args={[1.35, 0.055, 20, 180]} />
        <meshStandardMaterial color={GOLD} metalness={1} roughness={0.24} />
      </mesh>

      {/* Fine inner bead, the detail that reads as "struck, not printed" */}
      <mesh position={[0, 0, 0.068]}>
        <torusGeometry args={[1.19, 0.012, 12, 180]} />
        <meshStandardMaterial
          color={GOLD_DEEP}
          metalness={0.9}
          roughness={0.4}
        />
      </mesh>

      <pointLight
        ref={sweep}
        position={[3, 2, 3]}
        intensity={26}
        distance={12}
        color="#FFF3D0"
      />
    </group>
  );
}

export default function SealMedallion() {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 0, 4.3], fov: 40 }}
      style={{ touchAction: 'pan-y' }}
    >
      <ambientLight intensity={0.85} />
      <directionalLight position={[-4, 5, 6]} intensity={2.1} color="#FFFFFF" />
      <directionalLight position={[5, -3, 2]} intensity={0.8} color="#E8A317" />
      <Suspense fallback={null}>
        <Medallion reduced={reduced} />
        <ContactShadows
          position={[0, -1.75, 0]}
          opacity={0.35}
          scale={7}
          blur={2.6}
          far={3}
          color="#041c33"
        />
      </Suspense>
    </Canvas>
  );
}
