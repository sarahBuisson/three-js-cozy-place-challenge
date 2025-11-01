import React from 'react';
import { useFrame } from '@react-three/fiber';
import { GLBModel } from '../components';


export function SceneDemo() {
    const [tick, setTick] = React.useState(0);
    // @ts-ignore
    const [tickCos, setTickCos] = React.useState(0);
    // @ts-ignore
    const [tickSin, setTickSin] = React.useState(0);

    useFrame(() => {
        setTick(tick + 1);
        setTickCos(Math.cos(tick * 0.1) * 10);
        setTickSin(Math.cos(tick * 0.1) * 10);
    })
    return (<>

            <GLBModel modelPath={"models/meditCapy.glb"}></GLBModel>




       </>)

}
