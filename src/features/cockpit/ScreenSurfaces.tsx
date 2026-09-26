import { Box } from "./RoomGeometry";
export default function ScreenSurfaces() {
  return (
    <group>
      <Box size={[6.6, 3.93, 0.55]} position={[0, 2.67, -4.08]} />
      <Box
        size={[6.38, 3.73, 0.07]}
        position={[0, 2.67, -3.775]}
        color="#030203"
      />
      {[-1, 1].map((side) => (
        <group
          key={side}
          position={[side * 4.48, 2.65, -3.12]}
          rotation={[0, -side * 0.29, 0]}
        >
          <Box size={[2.47, 3.84, 0.21]} />
          <Box
            size={[2.32, 3.61, 0.02]}
            position={[0, 0, 0.12]}
            color="#030203"
          />
        </group>
      ))}
    </group>
  );
}
