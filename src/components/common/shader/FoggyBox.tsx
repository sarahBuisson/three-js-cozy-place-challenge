import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const FogShaderMaterial = () => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    useFrame(({camera}) => {
        if (materialRef.current) {
            materialRef.current.uniforms.cameraPosition.value = camera.position;
        }
    });

    return (
        <shaderMaterial
            ref={materialRef}
            attach="material"
            vertexShader={`
        varying vec3 vPosition;
        void main() {
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `}
            fragmentShader={`
        uniform vec3 cameraPosition;
        varying vec3 vPosition;

        void main() {
          float distance = length(cameraPosition - vPosition);
      //    float fogFactor = smoothstep(5.0, 15.0, distance);
          vec3 fogColor = vec3(0.5, 0.6, 0.7);
          gl_FragColor = vec4(mix(vec3(1.0), fogColor), 1.0);
        }
      `}
            uniforms={{
                cameraPosition: {value: new THREE.Vector3()},
            }}
        />
    );
};

const FoggyBox = () => {
    return (

        <mesh>
            <boxGeometry args={[5, 5, 5]}/>
            <FogShaderMaterial/>
        </mesh>

    );
};

export default FoggyBox;
