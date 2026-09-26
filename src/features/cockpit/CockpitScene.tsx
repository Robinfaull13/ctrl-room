"use client";
import { useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import type { Group } from "three";
import type { Section } from "@/lib/content/types";
import DirectoryRing from "./DirectoryRing";
import CameraRig from "./CameraRig";
import RoomGeometry from "./RoomGeometry";
import ScreenSurfaces from "./ScreenSurfaces";
type Props = {
  section: Section;
  onNavigate: (s: Section) => void;
  reducedMotion: boolean;
  onFailure: () => void;
  onReady: () => void;
};
function Room({
  section,
  onNavigate,
  reducedMotion,
  onFailure,
  onReady,
}: Props) {
  const ring = useRef<Group>(null);
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    const canvas = gl.domElement;
    function lost(e: Event) {
      e.preventDefault();
      onFailure();
    }
    canvas.addEventListener("webglcontextlost", lost);
    onReady();
    return () => canvas.removeEventListener("webglcontextlost", lost);
  }, [gl, onFailure, onReady]);
  return (
    <>
      <color attach="background" args={["#030203"]} />
      <ambientLight intensity={0.5} />
      <hemisphereLight args={["#908097", "#09060d", 0.7]} />
      <directionalLight position={[-4, 7, 5]} intensity={1.3} />
      <pointLight
        position={[0, 2.6, -2.7]}
        color="#fc3197"
        intensity={13}
        distance={9}
      />
      <RoomGeometry />
      <ScreenSurfaces />
      <DirectoryRing ring={ring} section={section} onNavigate={onNavigate} />
      <CameraRig ring={ring} section={section} reducedMotion={reducedMotion} />
    </>
  );
}
export default function CockpitScene(props: Props) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.5]}
      camera={{ fov: 62, near: 0.1, far: 40, position: [0, 3.02, 2.13] }}
      gl={{ antialias: true }}
      fallback={<span>3D room unavailable</span>}
    >
      <Room {...props} />
    </Canvas>
  );
}
