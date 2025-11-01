import React, { Suspense, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshReflectorMaterial, RoundedBoxGeometry } from '@react-three/drei';

import { STLModel } from '../STLModel.tsx';
import Loading3D from '../Loading3D.tsx';
import { GLBModel } from '../GLBModel.tsx';
import { TextureLoader, Vector3 } from 'three';
import Candle from './Candle.tsx';
import { Riddle } from './Riddle.tsx';
export function ScenePumpkin() {
    const [tick, setTick] = React.useState(0);
    const [tickCos, setTickCos] = React.useState(0);

    useFrame(() => {
        setTick(tick + 1);
        setTickCos(Math.cos(tick * 0.1) * 10);
    })
    let woodTexture = useMemo(() => new TextureLoader().load('woodTexture.jpg'), []);
    return (<>
        <Candle scale={50} position={new Vector3(0, -200, -400)}></Candle>
        <ambientLight/>
        <Suspense fallback={<Loading3D/>}>
            <mesh scale={[10000, 0, 10000]} position={[0, -250, -0]}>
                <RoundedBoxGeometry></RoundedBoxGeometry>
                <meshBasicMaterial map={woodTexture}/>
            </mesh>
            <GLBModel modelPath={"models/donut.glb"}
                      scale={40} position={[10, -40, 10]}></GLBModel>
            <GLBModel modelPath={"models/cream_pie_slice_gag.glb"} scale={150}
                      position={[400, -101, 400]}></GLBModel>
            <GLBModel modelPath={"models/book_folded_and_unfolded.glb"}
                      scale={1800}
                      position={[400, -150, 400]}
                      rotation={[0, -1, 0]}></GLBModel>
            <GLBModel modelPath={"models/meditCapy.glb"}
                      key={"capyFloat"}
                      scale={40}
                      position={[0, 0, 20]}/>

            <GLBModel modelPath={"models/meditCapy.glb"}
                      position={[300, -150, 900]}
                      rotation={[0, 4 + tickCos * 0.02, 0]}
                      scale={100}
                      key={"capyRead"}>
            </GLBModel>
            <GLBModel modelPath={"models/cushion.glb"}
                      position={[300, -250, 900]}

                      scale={800}
                      key={"cushion1"}>
            </GLBModel>
            <GLBModel modelPath={"models/cushion.glb"}
                      position={[300, -200, -400]}
color={"yellow"}
                      scale={800}
                      key={"cushion2"}>
            </GLBModel>

            <GLBModel modelPath={"models/meditCapy.glb"}
                      rotation={[0, 0, -1]}
                      position={[300, -150, -400]}
                      scale={100}
                      color={"#ff0000"}
                      key={"capySleepy2"}>

            </GLBModel>

            <STLModel modelPath={"models/PumpkinMugV2.stl"}
                      position={[0, -250, 0]}
                      key={"bigP"}
                      scale={[5, 5, 3]}>
                <meshStandardMaterial color={"#8B4000"}/>
            </STLModel>


            <mesh position={[1, -49, 14]}>
                <boxGeometry scale={[100, 0, 100]}></boxGeometry>
                <meshStandardMaterial map={woodTexture} />
            </mesh>
        </Suspense>
        {/*
        <WaterSurfaceSimple waterColor={0xffffff}

                            distortionScale={0.7}
                            fxDistortionFactor={0.05}
                            fxDisplayColorAlpha={0.0}
                            fxMixColor={0x3f3f3f}

                            position={[0, -25, 0]}>

            {FX_RENDER}
        </WaterSurfaceSimple>*/}
        <mesh  position={[0, -25, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[190, 190]}
      />
            <MeshReflectorMaterial mirror={2}/>    </mesh>
        <Riddle tick={tick}
                scale={0.5}
                position={new Vector3(10, -40, 10)}>
            <MeshReflectorMaterial color={"white"}/>
        </Riddle>


    </>)

}
