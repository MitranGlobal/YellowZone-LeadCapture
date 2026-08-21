'use client';

import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * A certification is, physically, a struck seal. So the hero object is the
 * Yellow Zone seal as an actual metal medallion: navy die face, gold milled
 * rim, and a specular highlight that travels across it as if a light were
 * being moved over an embossed award.
 *
 * Deliberately built on three.js and R3F core only — no drei. The two helpers
 * we needed (a texture loader and a contact shadow) are a few lines each, and
 * skipping drei keeps `three-mesh-bvh` and its deprecation warning out of the
 * dependency tree entirely.
 */

const GOLD = '#E8A317';
const GOLD_DEEP = '#B9770E';

/** Die body edge is at 1.34; the seal art fills 91.6% of the texture. */
const DIE_RADIUS = 1.34;
const FACE_RADIUS = DIE_RADIUS / 0.916;

function Medallion({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const sweep = useRef<THREE.PointLight>(null);
  const { viewport } = useThree();

  const texture = useLoader(THREE.TextureLoader, '/seal.png');

  useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
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
      {/* Milled gold die body. The artwork does NOT go on the cylinder cap:
          three.js maps cap UVs from local Z→u and local X→v, which lands the
          texture on its side. The face below uses planar UVs instead. */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.34, 1.34, 0.13, 160]} />
        <meshStandardMaterial color={GOLD_DEEP} metalness={0.92} roughness={0.36} />
      </mesh>

      {/* Die face. circleGeometry has standard planar UVs (x→u, y→v), so the
          seal reads upright. Radius is FACE_RADIUS because the artwork fills
          91.6% of the texture's half-width — this lands its outer ring exactly
          on the 1.34 edge of the die body. alphaTest discards the transparent
          corners so they never occlude the rim behind them. */}
      <mesh position={[0, 0, 0.066]}>
        <circleGeometry args={[FACE_RADIUS, 160]} />
        <meshStandardMaterial
          map={texture}
          transparent
          alphaTest={0.5}
          metalness={0.12}
          roughness={0.52}
        />
      </mesh>

      {/* Milled outer rim */}
      <mesh>
        <torusGeometry args={[1.35, 0.055, 20, 180]} />
        <meshStandardMaterial color={GOLD} metalness={1} roughness={0.24} />
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
      </Suspense>
    </Canvas>
  );
}
