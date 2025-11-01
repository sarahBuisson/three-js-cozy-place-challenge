import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import './App.css'
import { useRef, useState } from 'react';
import musicFile from './assets/music.mp3'
import { ScenePumpkin } from './components/cozy/ScenePumpkin.tsx';

function App() {
    const audioRef = useRef<HTMLAudioElement>(null)
    const [isPlaying, setIsPlaying] = useState(false)

    const handleClick = () => {
        if (audioRef.current && !isPlaying) {
            audioRef.current.volume = 0.3
            audioRef.current.play()
            setIsPlaying(true)
        }
    }

    return (
        <div style={{width: '100vw', height: '100vh'}} onClick={handleClick}>
            <audio ref={audioRef} src={musicFile} loop/>
            {!isPlaying && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 1000,
                    background: 'rgba(0,0,0,0.7)',
                    color: 'white',
                    padding: '20px 40px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '18px',
                    pointerEvents: 'none'
                }}>
                    🎵 Cliquez pour démarrer la musique
                </div>
            )}
            <Canvas camera={{position: [500, 200, 500],rotation:[2,1,3], fov: 50, far: 10000}}
            >
                <color attach="background" args={["black"]}/>
                <mesh key={"sky"} position={[0, 400, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <circleGeometry args={[1500, 64]}/>
                    <meshBasicMaterial color={"#ffccaa"} side={2}/>
                </mesh>
                eturn (
                <spotLight

                    position={[20, 500, 20]} // Position above the scene
                    angle={1} // Cone angle
                    penumbra={0.9} // Softness of edges
                    intensity={5} // Brightness
                    distance={3000} // Maximum range
                    decay={0.001} // Light fading rate
                    color="white" // Light color

                    castShadow // Enable shadows
                />

                <ScenePumpkin></ScenePumpkin>
                <OrbitControls  target={[40, -40, 40]}
                                minPolarAngle={Math.PI / 4}
                                maxPolarAngle={Math.PI / 2.5}/>
            </Canvas>
        </div>
    )
}

export default App
