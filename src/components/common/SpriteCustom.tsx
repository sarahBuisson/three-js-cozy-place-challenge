import * as THREE from 'three';
import { Camera, Color, Sprite, Vector3 } from 'three';
import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei';
import { THREE_GetGifTexture } from "threejs-gif-texture";

export function generateComputeColorFunction(horizonDistance: number, horizonColor: Color, farDistance: number, color: Color, transparentDistance: number){
    function computeColor(camera: Camera, spriteRef: React.RefObject<Sprite>) {
        const distance = camera.position.distanceTo(spriteRef.current.position);
        if (distance > horizonDistance) {
            spriteRef.current.material.color = horizonColor;
        } else if (distance > farDistance) {

            const colorIntensity = Math.min(1, Math.max(0, 1 - (distance - farDistance) / (horizonDistance - farDistance))); // Adjust range as needed
            spriteRef.current.material.color = color.clone().lerp(horizonColor, colorIntensity); // Example: gradient from red to green

        } else if (distance <= transparentDistance) {

            const opacityIntensity = Math.min(1, Math.max(0, (transparentDistance - distance) / transparentDistance)); // Adjust range as needed
            spriteRef.current.material.color = color; // Example: gradient from red to green

            spriteRef.current.material.opacity = 1 - opacityIntensity; // Example: gradient from red to green

        } else {
            spriteRef.current.material.opacity = 1;
            spriteRef.current.material.color = color
        }
    }
    return  computeColor
}


export function generateComputeColorFunctionSimple(color:Color):(camera: Camera, sprite:React.RefObject<Sprite>)=> void {
    // @ts-ignore
    function computeColor(camera: Camera, spriteRef: React.RefObject<Sprite>) {
            spriteRef.current.material.color = color; 
    }
    return  computeColor
}
export const SpriteCustom = (props: {
    position?: Vector3,
    scale?: Vector3 | number,
    textureName: string,
    key?: string,
    computeColor?:(camera: Camera, sprite:React.RefObject<Sprite>)=> void | undefined;
}) => {
    const [texture, setTexture] = useState<any>()
    const textureSimple=useTexture(props.textureName!!)
    useEffect(() => {
            setTexture(props.textureName.endsWith("gif") ? THREE_GetGifTexture(props.textureName!!) : textureSimple)
        },
        [props.textureName]);
    const spriteRef = useRef<THREE.Sprite>(null!);

    useFrame(({camera}) => {
        if (spriteRef.current && !!props.computeColor) {


            props.computeColor(camera,spriteRef);

        }
    });
    return (

        <sprite ref={spriteRef}
                key={props.key} position={props.position} scale={props.scale}>
            <spriteMaterial map={texture} depthTest={false}/>

        </sprite>
    );
}
