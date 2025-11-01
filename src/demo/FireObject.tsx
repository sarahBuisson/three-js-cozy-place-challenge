import {  MeshPhysicalMaterial } from 'three';
import CustomShaderMaterial from 'three-custom-shader-material'

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
const fire2=`
// Fire Flame shader

// procedural noise from IQ
vec2 hash( vec2 p )
{
\tp = vec2( dot(p,vec2(127.1,311.7)),
\t\t\t dot(p,vec2(269.5,183.3)) );
\treturn -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float noise( in vec2 p )
{
\tconst float K1 = 0.366025404; // (sqrt(3)-1)/2;
\tconst float K2 = 0.211324865; // (3-sqrt(3))/6;

\tvec2 i = floor( p + (p.x+p.y)*K1 );

\tvec2 a = p - i + (i.x+i.y)*K2;
\tvec2 o = (a.x>a.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
\tvec2 b = a - o + K2;
\tvec2 c = a - 1.0 + 2.0*K2;

\tvec3 h = max( 0.5-vec3(dot(a,a), dot(b,b), dot(c,c) ), 0.0 );

\tvec3 n = h*h*h*h*vec3( dot(a,hash(i+0.0)), dot(b,hash(i+o)), dot(c,hash(i+1.0)));

\treturn dot( n, vec3(70.0) );
}

float fbm(vec2 uv)
{
\tfloat f;
\tmat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
\tf  = 0.5000*noise( uv ); uv = m*uv;
\tf += 0.2500*noise( uv ); uv = m*uv;
\tf += 0.1250*noise( uv ); uv = m*uv;
\tf += 0.0625*noise( uv ); uv = m*uv;
\tf = 0.5 + 0.5*f;
\treturn f;
}

// no defines, standard redish flames
//#define BLUE_FLAME
//#define GREEN_FLAME


void mainImage( out vec4 fragColor, in vec2 fragCoord, in vec2 iResolution, in float iTime )
{
\tvec2 uv = fragCoord.xy / iResolution.xy;
\tvec2 q = uv;
\tq.x *= 5.;
\tq.y *= 2.;
\tfloat strength = floor(q.x+1.);
\tfloat T3 = max(3.,1.25*strength)*iTime;
\tq.x = mod(q.x,1.)-0.5;
\tq.y -= 0.25;
\tfloat n = fbm(strength*q - vec2(0,T3));
\tfloat c = 1. - 16. * pow( max( 0., length(q*vec2(1.8+q.y*1.5,.75) ) - n * max( 0., q.y+.25 ) ),1.2 );
//\tfloat c1 = n * c * (1.5-pow(1.25*uv.y,4.));
\tfloat c1 = n * c * (1.5-pow(2.50*uv.y,4.));
\tc1=clamp(c1,0.,1.);

\tvec3 col = vec3(1.5*c1, 1.5*c1*c1*c1, c1*c1*c1*c1*c1*c1);

#ifdef BLUE_FLAME
\tcol = col.zyx;
#endif
#ifdef GREEN_FLAME
\tcol = 0.85*col.yxz;
#endif

\tfloat a = c * (1.-pow(uv.y,3.));
\tfragColor = vec4( mix(vec3(0.),col,a), 1.0);
}
`;
export function FireObject() {




    const materialRef = useRef<any>(null)

    useFrame((state) => {
        if (state && materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
        }
    })

    return (
        <mesh>
            <cylinderGeometry />
            <CustomShaderMaterial
                ref={materialRef}
                baseMaterial={MeshPhysicalMaterial}
                // Your vertex Shader
                fragmentShader={fire2.replaceAll("iResolution","resolution").replaceAll("iTime","uTime")} // Your fragment Shader
                // Your Uniforms
                uniforms={{
                    uTime: { value: 0 },
                    iResolution: { value: { x: 512, y: 512 }  },
                   resolution: { value: { x: 512, y: 512 }  },

                }}

                // Base material properties


            />
        </mesh>
    );
}
