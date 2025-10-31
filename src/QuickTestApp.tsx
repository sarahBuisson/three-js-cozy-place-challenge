import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import './App.css'
import React, { useRef, useState } from 'react';
import musicFile from './assets/music.mp3'
import { SceneDemo } from './demo/SceneDemo.tsx';
import { ScenePumpkin } from './components/cozy/ScenePumpkin.tsx';
import { GLBModel } from './components';
import { Riddle } from './components/cozy/Riddle.tsx';

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
            <Canvas
            >
                <directionalLight position={[5, 450, 5]}
                                  intensity={100} castShadow/>

                <ambientLight intensity={10.5}/>
           <Riddle tick={5} scale={10}>
               <meshStandardMaterial color={"orange"}/>
           </Riddle>
                <OrbitControls  />
            </Canvas>
        </div>
    )
}

export default App
