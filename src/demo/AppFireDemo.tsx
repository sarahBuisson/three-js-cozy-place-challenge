import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRef, useState } from 'react';
import { SceneDemo } from './SceneDemo';
import { FireObject } from './FireObject';

function AppFireDemo() {
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

                <FireObject ></FireObject>
                <OrbitControls   />
            </Canvas>
        </div>
    )
}

export default AppFireDemo
