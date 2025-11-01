import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import './App.css'
import { useRef, useState } from 'react';
import musicFile from './assets/music.mp3'
import { SceneDemo } from './demo/SceneDemo.tsx';

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
            <Canvas
            >
                <color attach="background" args={["white"]}/>

                <ambientLight intensity={0.5}/>
                <directionalLight position={[5, 450, 5]} intensity={1} castShadow/>
                <pointLight position={[10, 10, 10]} intensity={1}/>
                <axesHelper args={[100]}/>
                <SceneDemo></SceneDemo>
                <OrbitControls/>
            </Canvas>
        </div>
    )
}

export default App
