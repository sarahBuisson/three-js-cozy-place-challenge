import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import CustomShaderMaterial from 'three-custom-shader-material';
import { OrbitControls } from '@react-three/drei';

export function MistMaterial() {
    const materialRef = useRef<any>(null);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
        }
    });
    return <CustomShaderMaterial
        ref={materialRef}
        baseMaterial={THREE.MeshPhysicalMaterial}
        vertexShader={`
          varying vec3 vPosition;
          void main() {
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          varying vec3 vPosition;
          uniform vec3 uMistColor;
          uniform float uMistDensity;
          uniform vec3 uBoxDimensions;

          void main() {
            vec3 boxCenter = uBoxDimensions * 0.5;
            float distance = length(vPosition - boxCenter);
            float mistFactor = exp(-uMistDensity * distance);
            mistFactor = clamp(mistFactor, 0.0, 1.0);

            vec3 baseColor = vec3(1.0, 0.0, 0.0); // Base red color
            vec3 mistedColor = mix(uMistColor, baseColor, mistFactor);

            gl_FragColor = vec4(mistedColor, 1.0);
          }
        `}
        uniforms={{
            uMistColor: {value: new THREE.Color(0xff0000)},
            uMistDensity: {value: 0.5},
            uBoxDimensions: {value: new THREE.Vector3(5, 5, 5)},
            uTime: {value: 0},
        }}
    />;
}

const RedMistBox = () => {


    return (
        <mesh>
            <boxGeometry args={[5, 5, 5]}/>
            {MistMaterial()}
        </mesh>
    );
};

export  function MistApp() {
    return (
        <Canvas>
            <ambientLight />
            <RedMistBox />
            <OrbitControls/>
        </Canvas>
    );
}
