import React from 'react';
import { useFrame } from '@react-three/fiber';
import { GLBModel } from '../components';


export function SceneDemo() {
    const [tick, setTick] = React.useState(0);
    const [tickCos, setTickCos] = React.useState(0);
    const [tickSin, setTickSin] = React.useState(0);

    useFrame(() => {
        setTick(tick + 1);
        setTickCos(Math.cos(tick * 0.1) * 10);
        setTickSin(Math.cos(tick * 0.1) * 10);
    })
    let capyColor = "#fcaf56";
    return (<>

            <GLBModel modelPath={"src/assets/models/meditCapy.glb"}></GLBModel>




       </>)

}
