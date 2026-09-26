import type { ThreeElements } from "@react-three/fiber";
export function Box({
  size,
  color = "#151016",
  ...props
}: { size: [number, number, number]; color?: string } & ThreeElements["mesh"]) {
  return (
    <mesh {...props}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.5} metalness={0.65} />
    </mesh>
  );
}
export default function RoomGeometry() {
  return (
    <group>
      <Box size={[9, 0.2, 3.3]} position={[0, 0.47, -2.15]} />
      <Box
        size={[5.25, 0.16, 1.76]}
        position={[0, 0.65, -2.26]}
        color="#080609"
      />
      {Array.from({ length: 4 }, (_, r) =>
        Array.from({ length: 14 }, (_, c) => (
          <group
            key={r + "-" + c}
            position={[-2.18 + c * 0.335, 0.8, -2.89 + r * 0.3]}
          >
            <mesh>
              <boxGeometry args={[0.3, 0.03, 0.26]} />
              <meshStandardMaterial
                color="#aa2866"
                emissive="#ff168b"
                emissiveIntensity={1.4}
              />
            </mesh>
            <Box
              size={[0.28, 0.07, 0.24]}
              position={[0, 0.02, 0]}
              color="#100810"
            />
          </group>
        )),
      )}
      <Box
        size={[1.76, 0.08, 0.26]}
        position={[0, 0.81, -1.65]}
        color="#60203f"
      />
      {[-1, 1].map((side) => (
        <Box
          key={side}
          size={[0.7, 0.08, 0.26]}
          position={[side * 1.6, 0.81, -1.65]}
          color="#56203c"
        />
      ))}
      <Box size={[0.5, 0.55, 0.5]} position={[0, 0.55, -4]} />
      <Box size={[3.2, 0.13, 1.2]} position={[0, 0.24, -3.8]} />
    </group>
  );
}
