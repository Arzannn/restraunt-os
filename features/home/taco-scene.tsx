'use client';

import { Environment, Float, PerspectiveCamera } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { Suspense, useEffect, useRef, type RefObject } from 'react';
import type { Group, Mesh, MeshBasicMaterial } from 'three';

export type TacoSceneProps = {
  exploded: boolean;
  onExplodeComplete?: () => void;
};

function usePointerParallax(group: RefObject<Group | null>, enabled: boolean) {
  useFrame(({ pointer }) => {
    if (!group.current || !enabled) return;
    group.current.rotation.y = pointer.x * 0.35;
    group.current.rotation.x = pointer.y * 0.15;
  });
}

function CinematicCamera({ exploded, onExplodeComplete }: TacoSceneProps) {
  const { camera } = useThree();

  useEffect(() => {
    if (!exploded) {
      gsap.to(camera.position, { x: 0, y: 0, z: 4.5, duration: 0.8, ease: 'power3.out' });
      return;
    }

    const timeline = gsap.timeline({ defaults: { ease: 'power3.inOut' }, onComplete: onExplodeComplete });
    timeline
      .to(camera.position, { x: 0.6, y: 0.25, z: 3.15, duration: 0.8 })
      .to(camera.position, { x: -0.55, y: 0.1, z: 2.15, duration: 0.85 })
      .to(camera.position, { x: 0, y: 0, z: 1.35, duration: 0.55 });

    return () => {
      timeline.kill();
    };
  }, [camera, exploded, onExplodeComplete]);

  return null;
}

function IngredientMeshes({ exploded }: { exploded: boolean }) {
  const group = useRef<Group>(null);
  const shell = useRef<Mesh>(null);
  const chicken = useRef<Mesh>(null);
  const cheese = useRef<Mesh>(null);
  const tomatoes = useRef<Mesh>(null);
  const onions = useRef<Mesh>(null);
  const lettuce = useRef<Mesh>(null);
  const sauce = useRef<Mesh>(null);

  usePointerParallax(group, !exploded);

  useFrame(({ clock }) => {
    if (!group.current || exploded) return;
    group.current.position.y = Math.sin(clock.elapsedTime * 1.2) * 0.08;
  });

  useEffect(() => {
    const meshes = [shell.current, chicken.current, cheese.current, tomatoes.current, onions.current, lettuce.current, sauce.current].filter((mesh): mesh is Mesh => Boolean(mesh));
    if (!exploded) {
      gsap.to(meshes.map((mesh) => mesh.position), { x: 0, y: 0, z: 0, duration: 0.7, stagger: 0.03, ease: 'power3.out' });
      gsap.to(meshes.map((mesh) => mesh.rotation), { x: 0, y: 0, z: 0, duration: 0.7, stagger: 0.03, ease: 'power3.out' });
      return;
    }

    const timeline = gsap.timeline({ defaults: { duration: 1.15, ease: 'expo.out' } });
    timeline
      .to(shell.current?.position ?? {}, { x: -1.65, y: -0.15, z: 0.1 }, 0)
      .to(chicken.current?.position ?? {}, { x: -0.9, y: 0.42, z: 0.55 }, 0.04)
      .to(cheese.current?.position ?? {}, { x: -0.25, y: 0.88, z: -0.2 }, 0.08)
      .to(tomatoes.current?.position ?? {}, { x: 0.38, y: 0.62, z: 0.45 }, 0.12)
      .to(onions.current?.position ?? {}, { x: 0.95, y: 0.28, z: -0.38 }, 0.16)
      .to(lettuce.current?.position ?? {}, { x: 1.48, y: -0.08, z: 0.25 }, 0.2)
      .to(sauce.current?.position ?? {}, { x: 0.15, y: -0.62, z: 0.75 }, 0.24)
      .to(meshes.map((mesh) => mesh.rotation), { x: 0.28, y: 0.9, z: -0.18, duration: 1.2, stagger: 0.05 }, 0);

    return () => {
      timeline.kill();
    };
  }, [exploded]);

  return (
    <group ref={group} scale={1.1}>
      <mesh ref={shell} rotation={[0, 0, 0.08]}>
        <torusGeometry args={[1.15, 0.34, 24, 80, Math.PI]} />
        <meshStandardMaterial color="#d59b42" roughness={0.55} metalness={0.05} />
      </mesh>
      <mesh ref={chicken} position={[-0.18, 0.05, 0.08]}>
        <dodecahedronGeometry args={[0.42, 1]} />
        <meshStandardMaterial color="#c77735" roughness={0.78} />
      </mesh>
      <mesh ref={cheese} position={[0.12, 0.23, 0.16]} rotation={[0.2, 0.1, 0.55]}>
        <boxGeometry args={[0.9, 0.08, 0.28]} />
        <meshStandardMaterial color="#ffd45a" roughness={0.44} />
      </mesh>
      <mesh ref={tomatoes} position={[0.35, 0.18, 0.18]}>
        <sphereGeometry args={[0.26, 24, 12]} />
        <meshStandardMaterial color="#b81f2b" roughness={0.6} />
      </mesh>
      <mesh ref={onions} position={[-0.4, 0.25, 0.18]} rotation={[0.4, 0.1, 0]}>
        <torusGeometry args={[0.22, 0.035, 12, 32]} />
        <meshStandardMaterial color="#efe6ff" roughness={0.38} />
      </mesh>
      <mesh ref={lettuce} position={[0, 0.08, 0]}>
        <sphereGeometry args={[0.72, 32, 12]} />
        <meshStandardMaterial color="#2f8f43" roughness={0.82} />
      </mesh>
      <mesh ref={sauce} position={[0.08, 0.35, 0.28]} rotation={[0.1, 0.3, 0.4]}>
        <torusGeometry args={[0.48, 0.045, 12, 48]} />
        <meshStandardMaterial color="#f4ead1" roughness={0.35} />
      </mesh>
    </group>
  );
}

function Steam() {
  const mesh = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    mesh.current.position.y = 1.4 + Math.sin(clock.elapsedTime) * 0.08;
    (mesh.current.material as MeshBasicMaterial).opacity = 0.18 + Math.sin(clock.elapsedTime * 1.7) * 0.06;
  });

  return (
    <mesh ref={mesh} position={[0, 1.45, 0]}>
      <sphereGeometry args={[0.7, 32, 16]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.16} />
    </mesh>
  );
}

export function TacoScene({ exploded, onExplodeComplete }: TacoSceneProps) {
  return (
    <Canvas dpr={[1, 1.5]} performance={{ min: 0.5 }} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
      <PerspectiveCamera makeDefault position={[0, 0, 4.5]} fov={42} />
      <CinematicCamera exploded={exploded} onExplodeComplete={onExplodeComplete} />
      <ambientLight intensity={1.2} />
      <spotLight position={[4, 4, 5]} angle={0.45} intensity={4} />
      <Suspense fallback={null}>
        <Float speed={1.6} rotationIntensity={0.5} floatIntensity={0.9}>
          <IngredientMeshes exploded={exploded} />
          <Steam />
        </Float>
        <Environment preset="city" />
      </Suspense>
    </Canvas>
  );
}
