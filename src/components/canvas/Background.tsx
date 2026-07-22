import { Stars } from '@react-three/drei'

export default function Background() {
  return <Stars radius={80} depth={40} count={2000} factor={3} fade speed={0.5} />
}
