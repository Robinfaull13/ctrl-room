/* eslint-disable react-hooks/immutability -- Three.js objects are intentionally mutated by effects and the render loop. */
import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { Group } from "three";
import type { Section } from "@/lib/content/types";
import { nearestTargetAngle, motionProgress, sectionAngle } from "./motion";
export default function CameraRig({
  ring,
  section,
  reducedMotion,
}: {
  ring: React.RefObject<Group | null>;
  section: Section;
  reducedMotion: boolean;
}) {
  const { camera, invalidate, gl } = useThree();
  const initialSection = useRef(section);
  const motion = useRef({
    from: sectionAngle(section),
    target: sectionAngle(section),
    started: 0,
  });
  useEffect(() => {
    camera.position.set(0, 3.02, 2.13);
    camera.lookAt(0, 2.94, -3.55);
    if (ring.current)
      ring.current.rotation.y = sectionAngle(initialSection.current);
    invalidate();
  }, [camera, invalidate, ring]);
  useEffect(() => {
    const current = ring.current?.rotation.y ?? sectionAngle(section);
    motion.current = {
      from: current,
      target: nearestTargetAngle(current, section),
      started: performance.now(),
    };
    gl.domElement.dataset.ringSection = section;
    gl.domElement.dataset.motion =
      !reducedMotion && Math.abs(motion.current.target - current) > 0.0001
        ? "moving"
        : "idle";
    invalidate();
  }, [section, reducedMotion, ring, gl, invalidate]);
  useFrame(() => {
    const m = motion.current;
    const progress = motionProgress(
      (performance.now() - m.started) / 1000,
      reducedMotion,
    );
    if (ring.current)
      ring.current.rotation.y = m.from + (m.target - m.from) * progress;
    const moving = progress < 1 && Math.abs(m.target - m.from) > 0.0001;
    camera.lookAt(
      0,
      2.94 +
        (moving && !reducedMotion ? Math.sin(progress * Math.PI) * 0.12 : 0),
      -3.55,
    );
    gl.domElement.dataset.motion = moving ? "moving" : "idle";
    if (moving) invalidate();
  });
  return null;
}
