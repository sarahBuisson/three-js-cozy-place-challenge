import React, { Suspense, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBoxGeometry } from '@react-three/drei';

import { STLModel } from '../STLModel.tsx';
import { RippleSurface } from '../../demo';
import Loading3D from '../Loading3D.tsx';
import { GLBModel } from '../GLBModel.tsx';
import { TextureLoader } from 'three';

export function Scene() {
    const [tick, setTick] = React.useState(0);
    const [tickCos, setTickCos] = React.useState(0);
    const [tickSin, setTickSin] = React.useState(0);

    useFrame(() => {
        setTick(tick + 1);
        setTickCos(Math.cos(tick * 0.1) * 10);
        setTickSin(Math.cos(tick * 0.1) * 10);
    })
    let woodTexture = useMemo(() => new TextureLoader().load('src/assets/woodTexture.jpg'), []);
    let capyColor = "#996300";
    return (<>

        <Suspense fallback={<Loading3D/>}>
            <mesh scale={[10000, 0, 10000]} position={[0, -250, -0]}>
                <RoundedBoxGeometry></RoundedBoxGeometry>
                <meshBasicMaterial map={woodTexture}/>
            </mesh>
            <GLBModel modelPath={"src/assets/models/donut.glb"} scale={150} position={[10, -20, 10]}></GLBModel>
            <GLBModel modelPath={"src/assets/models/cream_pie_slice_gag.glb"} scale={150}
                      position={[400, -101, 400]}></GLBModel>
            <GLBModel modelPath={"src/assets/models/book_folded_and_unfolded.glb"} scale={1800}
                      position={[400, -150, 400]}
                      rotation={[0, -1, 0]}></GLBModel>
            <STLModel modelPath={"src/assets/models/Capybara.stl"} position={[1, -50 + tickCos * 0.5, 1]}
                      rotation={[tickCos * 0.02, 0, tick * 0.02]}
                      key={"capySwim"}>
                <meshStandardMaterial color={capyColor}/>
            </STLModel>

            <STLModel modelPath={"src/assets/models/Capybara.stl"} position={[150, -200, 600]}
                      rotation={[0, tickCos * 0.02, -4]}
                      scale={4}
                      key={"capyReed"}>
                <meshStandardMaterial color={capyColor}/>
            </STLModel>
            <STLModel modelPath={"src/assets/models/PumpkinMugV2.stl"}
                      position={[0, -250, 0]}
                      key={"bigP"}
                      scale={[5, 5, 3]}>
                <meshStandardMaterial color={"orange"}/>
            </STLModel>

            <GLBModel modelPath={"src/assets/models/candle.glb"} scale={500} position={[-200, -149, -300]}></GLBModel>
            <mesh position={[1, -49, 14]}>
                <boxGeometry scale={[100, 0, 100]}></boxGeometry>
                <meshBasicMaterial map={woodTexture}/>
            </mesh>
        </Suspense>

        <RippleSurface></RippleSurface>


       </>)

}
