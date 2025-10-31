import { useTexture} from "@react-three/drei";
import { useFrame } from '@react-three/fiber';
import { shaders } from "./shader";
import { useMemo, useRef } from 'react';

export function ShaderMaterial(props: any) {

    // We create ref to access shaderMaterial's uniforms property later, in useFrame
    const ref = useRef<any | undefined>(null)

    // TODO: Ask Allen. Calling the line below in the parent component resulted in no texture loaded.
    const texture = useTexture(props.imageURL)


    // TODO: Ask Allen. Why did I need useMemo and useFrame? Couldn't make it work without.
    //useMemo: when no array is provided in the dependency, a new value is computed on every render.
    const uniforms = useMemo(() => {
        return (
            {
                uSampler: {
                    value: texture
                },
                brightness: {
                    value: 0.0
                },
                contrast: {
                    value: 1.0
                }
            }
        )
    }, [])

    //This hook calls you back every frame.
    useFrame(() => {
        ref.current.uniforms.brightness.value = props.brightness;
        ref.current.uniforms.contrast.value = props.contrast;
    });

    return (
        <shaderMaterial
            ref={ref}
            attach="material"
            vertexShader={shaders.vertexShader}
            fragmentShader={shaders.fragmentRipple}
            uniforms={uniforms}/>
    )
}
