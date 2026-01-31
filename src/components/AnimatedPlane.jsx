import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

/* ---------------- PLANE ---------------- */
function Plane({ progress, crashed }) {
  const ref = useRef();

  useFrame(() => {
    if (!ref.current || crashed) return;

    // Curve path (aviator-like)
    const x = progress * 8;
    const y = Math.pow(progress, 1.3) * 3;
    const z = 0;

    ref.current.position.set(x, y, z);
    ref.current.rotation.z = -0.3 + progress * 0.6;
  });

  return (
    <group ref={ref} scale={0.7}>
      {/* Body */}
      <mesh>
        <cylinderGeometry args={[0.15, 0.15, 2.2, 16]} />
        <meshStandardMaterial color="#dc2626" />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 1.2, 0]}>
        <coneGeometry args={[0.18, 0.4, 16]} />
        <meshStandardMaterial color="#ef4444" />
      </mesh>

      {/* Wings */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.08, 1.1, 0.02]} />
        <meshStandardMaterial color="#b91c1c" />
      </mesh>

      {/* Tail */}
      <mesh position={[0, -1, 0]}>
        <boxGeometry args={[0.12, 0.3, 0.02]} />
        <meshStandardMaterial color="#991b1b" />
      </mesh>
    </group>
  );
}

/* ---------------- SCENE ---------------- */
function Scene({ multiplier, crashPoint }) {
  const progress = Math.min(multiplier / crashPoint, 1);
  const crashed = multiplier >= crashPoint;

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} />

      <Plane progress={progress} crashed={crashed} />

      {/* Curve path (visual guide) */}
      <mesh rotation={[0, 0, 0]}>
        <tubeGeometry
          args={[
            new THREE.CatmullRomCurve3([
              new THREE.Vector3(0, 0, 0),
              new THREE.Vector3(3, 1.5, 0),
              new THREE.Vector3(6, 4, 0),
              new THREE.Vector3(8, 6, 0),
            ]),
            64,
            0.02,
            8,
            false,
          ]}
        />
        <meshStandardMaterial color="#dc2626" />
      </mesh>
    </>
  );
}

/* ---------------- MAIN ---------------- */
export default function Aviator3D({ crashPoint, isRunning }) {
  const [multiplier, setMultiplier] = useState(1);
  const startRef = useRef(null);

  useEffect(() => {
    if (!isRunning) {
      setMultiplier(1);
      startRef.current = null;
      return;
    }

    let raf;

    const animate = (t) => {
      if (!startRef.current) startRef.current = t;
      const elapsed = t - startRef.current;

      const value = Math.exp(0.0009 * elapsed);

      if (value >= crashPoint) {
        setMultiplier(crashPoint);
        return;
      }

      setMultiplier(value);
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [isRunning, crashPoint]);

  return (
    <div style={{ height: "60vh", background: "#020617" }}>
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 2, 10]} />
        <Scene multiplier={multiplier} crashPoint={crashPoint} />
      </Canvas>

      {/* Multiplier UI */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "4rem",
          fontWeight: 800,
          color: multiplier >= crashPoint ? "#dc2626" : "#e5e7eb",
          pointerEvents: "none",
        }}
      >
        {multiplier.toFixed(2)}x
      </div>
    </div>
  );
}