import { useLoader } from '@react-three/fiber'
import { useEffect, useRef, useMemo } from 'react'
import { BufferGeometry, Mesh } from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'

interface STLModelProps {
  modelPath: string
  scale?: number|[number, number, number]
  position?: [number, number, number]
  rotation?: [number, number, number]
  onGeometryLoad?: (geometry: BufferGeometry) => BufferGeometry
  children?: any
}

export function STLModel({
  modelPath,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  onGeometryLoad,
  children
}: STLModelProps) {
  const geometry = useLoader(STLLoader, modelPath)
  
  // Clone la géométrie pour chaque instance et calcule les normales
  const clonedGeometry = useMemo(() => {
    const cloned = geometry.clone()
    cloned.computeVertexNormals()
    return cloned
  }, [geometry])
  
  const meshRef = useRef<Mesh>(null)

  useEffect(() => {
    if (meshRef.current && onGeometryLoad) {
      // Appliquer la transformation à la géométrie
      const transformedGeometry = onGeometryLoad(meshRef.current.geometry as BufferGeometry)
      transformedGeometry.computeVertexNormals()
      meshRef.current.geometry = transformedGeometry
    }
  }, [onGeometryLoad, clonedGeometry])

  // Ajouter 90 degrés (PI/2) de rotation sur l'axe X à la rotation fournie
  const finalRotation: [number, number, number] = [
    rotation[0] - Math.PI / 2,//Pour X raison tous ces models sont penchés
    rotation[1],
    rotation[2]
  ]

  return (
    <mesh
      ref={meshRef}
      geometry={clonedGeometry}
      scale={scale}
      position={position}
      rotation={finalRotation}
      castShadow
      receiveShadow
    >
      {children }
    </mesh>
  )
}

