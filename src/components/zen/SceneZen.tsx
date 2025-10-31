import React, { Suspense, useMemo, useRef } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { FlyControls } from '@react-three/drei';
import Loading3D from '../Loading3D.tsx';
import { Color, TextureLoader, Vector3 } from 'three';

import { generateComputeColorFunctionSimple, SpriteCustom } from '../common/SpriteCustom.tsx';
import { calculateCircularPositions } from '../../utils';
import RippleFX from '../common/water/InteractiveFX/RippleFX.tsx';

import img1 from "../../assets/zen/capy.png";
import img2 from "../../assets/zen/capy.png";
import img3 from "../../assets/zen/capy.png";

let closeMountainsPosition = calculateCircularPositions(new Vector3(0, 0, 0), 4, 60).map(v => {
    v.x += Math.random();
    v.y = Math.random() - 0.5;
    return v
});
let farMountainsPosition = calculateCircularPositions(new Vector3(0, 0, 0), 5, 50).map(v => {
    v.x += Math.random();
    v.y = Math.random() - 0.5;
    ;
    return v
});

const FX_RENDER = (

    <RippleFX

        fadeout_speed={0.95}
    />

);




const CustomFogMaterial = () => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    useFrame(({ clock }) => {
        if (materialRef.current) {
            materialRef.current.uniforms.time.value = clock.getElapsedTime();
        }
    });

    return (
        <shaderMaterial
            ref={materialRef}
            attach="material"
            vertexShader={`
        varying vec3 vWorldPosition;
        void main() {
          vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `}
            fragmentShader={`
        uniform vec3 fogColor;
        uniform float time;
        varying vec3 vWorldPosition;

        void main() {
          float fogFactor = exp(-0.02 * length(vWorldPosition));
          vec3 color = mix(vec3(1.0, 0.5, 0.0), fogColor, fogFactor);
          gl_FragColor = vec4(color, 1.0);
        }
      `}
            uniforms={{
                fogColor: { value: new Color('#dfe9f3') },
                time: { value: 0 },
            }}
        />
    );
};
export function SceneZen() {
    const [tick, setTick] = React.useState(0);
    const [tickCos, setTickCos] = React.useState(0);
    const [tickSin, setTickSin] = React.useState(0);

    useFrame(() => {
        setTick(tick + 1);
        setTickCos(Math.cos(tick * 0.1) * 10);
        setTickSin(Math.cos(tick * 0.1) * 10);
    })
    const [texture1, texture2, dispTexture] = useLoader(TextureLoader, [
        img1,
        img2,
        img3
    ]);
    let woodTexture = useMemo(() => new TextureLoader().load('src/assets/woodTexture.jpg'), []);
    let capyColor = "#fcaf56";
    let closeMountains: any[] = closeMountainsPosition
        .map((pos) => (
            <SpriteCustom textureName={"zen/mountain.svg"}
                          position={pos}
                          scale={2}
                          key={"closeMountain" + pos.x}
                          computeColor={generateComputeColorFunctionSimple(new Color("#aaffaa"))}
            ></SpriteCustom>
        ));
    let farMountains: any[] = farMountainsPosition
        .map((pos) => (
            <SpriteCustom textureName={"zen/mountain.svg"}
                          position={pos}
                          scale={3}
                          computeColor={generateComputeColorFunctionSimple(new Color("#bbaaff"))}
                          key={"farMountain" + pos.x}></SpriteCustom>
        ));


    return (<>
        <ambientLight/>
        <FlyControls></FlyControls>
        <Suspense fallback={<Loading3D/>}>
            <SpriteCustom key="sleeping capy"
                          textureName={"zen/capy.png"}></SpriteCustom>

            <SpriteCustom position={new Vector3(1, 0, 1)} key="sleeping capy2"
                          textureName={"zen/capy.gif"}></SpriteCustom>
            {closeMountains}
            {farMountains}

        </Suspense>

        {/* Blue Cylinder */}
        <mesh position={[0, 0, 0]} rotation={[0, -Math.PI / 2, 0]} scale={[10, 0.01, 10]}>
            <cylinderGeometry/>
            <meshStandardMaterial color="blue" transparent={true} opacity={0.5}/>
        </mesh>
        <mesh position={[4, 0, 0]}>
            <cylinderGeometry/>
            <spriteMaterial
                map={"zen/capy.png"}
                depthTest={false}/>
        </mesh>

        <mesh>
            <boxGeometry args={[1, 2, 2]} />
            <CustomFogMaterial />
        </mesh>



    </>)

}
