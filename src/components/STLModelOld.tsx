import { useEffect, useState } from 'react'
import { BufferGeometry } from 'three'
import { useLoader } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import Loading3D from './Loading3D.tsx';

interface GLBModelProps {
    modelPath: string
    scale?: number
    position?: [number, number, number]
    rotation?: [number, number, number]
    onGeometryLoad?: (geometry: BufferGeometry) => BufferGeometry
}

export function STLModelOld({
                             modelPath,
                             scale = 1,
                             position = [0, 0, 0],
                             rotation = [0, 0, 0],
                             onGeometryLoad
                         }: GLBModelProps) {
    const [geometry, setGeometry] = useState<BufferGeometry | null>(null);


    // Clone la scène pour chaque instance

    useEffect(() => {

        let geo = useLoader(STLLoader, modelPath)

        if (onGeometryLoad) setGeometry(onGeometryLoad(geo))
        else
            setGeometry(geo)
        // Parcourir tous les meshes et appliquer la transformation


    }, [onGeometryLoad])
if(geometry)
    return (


        <primitive
            object={geometry!!}
            scale={scale}
            position={position}
            rotation={rotation}
        />


    )
    else return <Loading3D/>
}
