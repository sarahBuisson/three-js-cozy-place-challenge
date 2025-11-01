import { OrbitControls } from '@react-three/drei';

import { Smoke } from '../common/shader/smoke/Smoke.tsx';
import { Color, SphereGeometry, Vector3 } from 'three';
import { Canvas } from '@react-three/fiber';
import { GLBModel } from '../GLBModel.tsx';

export default function Candle(props: { position: Vector3, scale: number }) {

    return <>
        <group position={props.position} scale={props.scale}>
            <GLBModel modelPath={"models/candle_scented.glb"}
                      scale={30}></GLBModel>
            <pointLight
                position={[0, 350, -400]}
                intensity={5}
                distance={4000}
                decay={0.01} castShadow
                color="white"
            />
            <pointLight
                position={[0, 250, 200]}
                intensity={4}
                distance={4000}
                decay={0.01} castShadow
                color="yellow"
            />

            <Smoke color={new Color(0xffaa00)}
                   geometry={new SphereGeometry()}
                   position={new Vector3(0, 5, 0)}
                   scale={new Vector3(1, 10, 1)}></Smoke>

            <Smoke color={new Color(0xffff00)}
                   geometry={new SphereGeometry()}
                   position={new Vector3(0, 5.2, 0)}
                   scale={new Vector3(4, 10, 4)}></Smoke>

            <Smoke position={new Vector3(0, 6, 0)}
                   color={new Color("red")}
                   scale={new Vector3(4, 14, 4)}
            ></Smoke>

        </group>
    </>
}

export function CandleApp() {
    return (
        <div style={{width: '100vw', height: '100vh'}}>
            <Canvas
            >
                <directionalLight position={[5, 450, 5]} intensity={1} castShadow/>

                <Candle position={new Vector3(10, 0, 10)} scale={15}></Candle>
                <OrbitControls/>
            </Canvas>
        </div>
    )
}
