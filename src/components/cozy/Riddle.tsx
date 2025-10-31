import type { Vector3 } from 'three';

export function Riddle(props: { tick: number, scale:number,position?:Vector3,children?: React.ReactNode; }) {


    return <group scale={props.scale} position={props.position}>
        <mesh scale={(5 + props.tick) % 50}

        rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[5, 1, 10]}
            ></torusGeometry>
            {props.children}
        </mesh>
        <mesh scale={(25 + props.tick) % 50}
              rotation={[Math.PI / 2, 0, 0]}
              position={[0, 0,0]}>
            <torusGeometry args={[5, 1, 10]}
            ></torusGeometry>
            {props.children}
        </mesh>
        <mesh scale={(50 + props.tick) % 50}
              rotation={[Math.PI / 2, 0, 0]}
              position={[0, 0,0]}>
            <torusGeometry args={[5, 1, 10]}
            ></torusGeometry>
            {props.children}
        </mesh>
    </group>
}
