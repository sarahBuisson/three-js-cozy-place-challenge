import React, { Suspense, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { FlyControls } from '@react-three/drei';
import Loading3D from '../Loading3D.tsx';
import { Color, ShaderMaterial, Vector3 } from 'three';

import { generateComputeColorFunctionSimple, SpriteCustom } from '../common/SpriteCustom.tsx';
import { calculateCircularPositions } from '../../utils';

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



const CustomFogMaterial = () => {
    const materialRef = useRef<ShaderMaterial>(null);

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

    useFrame(() => {
        setTick(tick + 1);
    })

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

        <mesh>
            <boxGeometry args={[1, 2, 2]} />
            <CustomFogMaterial />
        </mesh>



    </>)

}
