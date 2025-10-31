import {  MeshPhysicalMaterial } from 'three';
import CustomShaderMaterial from 'three-custom-shader-material'

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
const mist=`// Misty Lake. Created by Reinder Nijhoff 2013
// Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
// @reindernijhoff
//
// https://www.shadertoy.com/view/MsB3WR
//

#define BUMPFACTOR 0.1
//#define EPSILON 0.1
#define BUMPDISTANCE 60.

#define time (iTime+285.)

// Noise functions by inigo quilez

float noise( const in vec2 x ) {
    vec2 p = floor(x);
    vec2 f = fract(x);
\tf = f*f*(3.0-2.0*f);

\tvec2 uv = (p.xy) + f.xy;
\treturn textureLod( iChannel0, (uv+ 0.5)/256.0, 0.0 ).x;
}

float noise( const in vec3 x ) {
    vec3 p = floor(x);
    vec3 f = fract(x);
\tf = f*f*(3.0-2.0*f);

\tvec2 uv = (p.xy+vec2(37.0,17.0)*p.z) + f.xy;
\tvec2 rg = textureLod( iChannel0, (uv+ 0.5)/256.0, 0.0 ).yx;
\treturn mix( rg.x, rg.y, f.z );
}

mat2 rot(const in float a) {
\treturn mat2(cos(a),sin(a),-sin(a),cos(a));
}

const mat2 m2 = mat2( 0.60, -0.80, 0.80, 0.60 );

const mat3 m3 = mat3( 0.00,  0.80,  0.60,
                     -0.80,  0.36, -0.48,
                     -0.60, -0.48,  0.64 );

float fbm( in vec3 p ) {
    float f = 0.0;
    f += 0.5000*noise( p ); p = m3*p*2.02;
    f += 0.2500*noise( p ); p = m3*p*2.03;
    f += 0.1250*noise( p ); p = m3*p*2.01;
    f += 0.0625*noise( p );
    return f/0.9375;
}

float hash( in float n ) {
    return fract(sin(n)*43758.5453);
}

// intersection functions

bool intersectPlane(const in vec3 ro, const in vec3 rd, const in float height, inout float dist) {
\tif (rd.y==0.0) {
\t\treturn false;
\t}

\tfloat d = -(ro.y - height)/rd.y;
\td = min(100000.0, d);
\tif( d > 0. && d < dist ) {
\t\tdist = d;
\t\treturn true;
    } else {
\t\treturn false;
\t}
}

// light direction

vec3 lig = normalize(vec3( 0.3,0.5, 0.6));

vec3 bgColor( const in vec3 rd ) {
\tfloat sun = clamp( dot(lig,rd), 0.0, 1.0 );
\tvec3 col = vec3(0.5, 0.52, 0.55) - rd.y*0.2*vec3(1.0,0.8,1.0) + 0.15*0.75;
\tcol += vec3(1.0,.6,0.1)*pow( sun, 8.0 );
\tcol *= 0.95;
\treturn col;
}

// coulds functions by inigo quilez

#define CLOUDSCALE (500./(64.*0.03))

float cloudMap( const in vec3 p, const in float ani ) {
\tvec3 r = p/CLOUDSCALE;

\tfloat den = -1.8+cos(r.y*5.-4.3);

\tfloat f;
\tvec3 q = 2.5*r*vec3(0.75,1.0,0.75)  + vec3(1.0,2.0,1.0)*ani*0.15;
    f  = 0.50000*noise( q ); q = q*2.02 - vec3(-1.0,1.0,-1.0)*ani*0.15;
    f += 0.25000*noise( q ); q = q*2.03 + vec3(1.0,-1.0,1.0)*ani*0.15;
    f += 0.12500*noise( q ); q = q*2.01 - vec3(1.0,1.0,-1.0)*ani*0.15;
    f += 0.06250*noise( q ); q = q*2.02 + vec3(1.0,1.0,1.0)*ani*0.15;
    f += 0.03125*noise( q );

\treturn 0.065*clamp( den + 4.4*f, 0.0, 1.0 );
}

vec3 raymarchClouds( const in vec3 ro, const in vec3 rd, const in vec3 bgc, const in vec3 fgc, const in float startdist, const in float maxdist, const in float ani ) {
    // dithering
\tfloat t = startdist+CLOUDSCALE*0.02*hash(rd.x+35.6987221*rd.y+time);//0.1*texture( iChannel0, fragCoord.xy/iChannelResolution[0].x ).x;

    // raymarch
\tvec4 sum = vec4( 0.0 );
\tfor( int i=0; i<64; i++ ) {
\t\tif( sum.a > 0.99 || t > maxdist ) continue;

\t\tvec3 pos = ro + t*rd;
\t\tfloat a = cloudMap( pos, ani );

        // lighting
\t\tfloat dif = clamp(0.1 + 0.8*(a - cloudMap( pos + lig*0.15*CLOUDSCALE, ani )), 0., 0.5);
\t\tvec4 col = vec4( (1.+dif)*fgc, a );
\t\t// fog
\t//\tcol.xyz = mix( col.xyz, fgc, 1.0-exp(-0.0000005*t*t) );

\t\tcol.rgb *= col.a;
\t\tsum = sum + col*(1.0 - sum.a);

        // advance ray with LOD
\t\tt += (0.03*CLOUDSCALE)+t*0.012;
\t}

    // blend with background
\tsum.xyz = mix( bgc, sum.xyz/(sum.w+0.0001), sum.w );

\treturn clamp( sum.xyz, 0.0, 1.0 );
}

// terrain functions
float terrainMap( const in vec3 p ) {
\treturn (textureLod( iChannel1, (-p.zx*m2)*0.000046, 0. ).x*600.) * smoothstep( 820., 1000., length(p.xz) ) - 2. + noise(p.xz*0.5)*15.;
}

vec3 raymarchTerrain( const in vec3 ro, const in vec3 rd, const in vec3 bgc, const in float startdist, inout float dist ) {
\tfloat t = startdist;

    // raymarch
\tvec4 sum = vec4( 0.0 );
\tbool hit = false;
\tvec3 col = bgc;

\tfor( int i=0; i<80; i++ ) {
\t\tif( hit ) break;

\t\tt += 8. + t/300.;
\t\tvec3 pos = ro + t*rd;

\t\tif( pos.y < terrainMap(pos) ) {
\t\t\thit = true;
\t\t}
\t}
\tif( hit ) {
\t\t// binary search for hit
\t\tfloat dt = 4.+t/400.;
\t\tt -= dt;

\t\tvec3 pos = ro + t*rd;
\t\tt += (0.5 - step( pos.y , terrainMap(pos) )) * dt;
\t\tfor( int j=0; j<2; j++ ) {
\t\t\tpos = ro + t*rd;
\t\t\tdt *= 0.5;
\t\t\tt += (0.5 - step( pos.y , terrainMap(pos) )) * dt;
\t\t}
\t\tpos = ro + t*rd;

\t\tvec3 dx = vec3( 100.*EPSILON, 0., 0. );
\t\tvec3 dz = vec3( 0., 0., 100.*EPSILON );

\t\tvec3 normal = vec3( 0., 0., 0. );
\t\tnormal.x = (terrainMap(pos + dx) - terrainMap(pos-dx) ) / (200. * EPSILON);
\t\tnormal.z = (terrainMap(pos + dz) - terrainMap(pos-dz) ) / (200. * EPSILON);
\t\tnormal.y = 1.;
\t\tnormal = normalize( normal );

\t\tcol = vec3(0.2) + 0.7*texture( iChannel2, pos.xz * 0.01 ).xyz *
\t\t\t\t   vec3(1.,.9,0.6);

\t\tfloat veg = 0.3*fbm(pos*0.2)+normal.y;

\t\tif( veg > 0.75 ) {
\t\t\tcol = vec3( 0.45, 0.6, 0.3 )*(0.5+0.5*fbm(pos*0.5))*0.6;
\t\t} else
\t\tif( veg > 0.66 ) {
\t\t\tcol = col*0.6+vec3( 0.4, 0.5, 0.3 )*(0.5+0.5*fbm(pos*0.25))*0.3;
\t\t}
\t\tcol *= vec3(0.5, 0.52, 0.65)*vec3(1.,.9,0.8);

\t\tvec3 brdf = col;

\t\tfloat diff = clamp( dot( normal, -lig ), 0., 1.);

\t\tcol = brdf*diff*vec3(1.0,.6,0.1);
\t\tcol += brdf*clamp( dot( normal, lig ), 0., 1.)*vec3(0.8,.6,0.5)*0.8;
\t\tcol += brdf*clamp( dot( normal, vec3(0.,1.,0.) ), 0., 1.)*vec3(0.8,.8,1.)*0.2;

\t\tdist = t;
\t\tt -= pos.y*3.5;
\t\tcol = mix( col, bgc, 1.0-exp(-0.0000005*t*t) );

\t}
\treturn col;
}

float waterMap( vec2 pos ) {
\tvec2 posm = pos * m2;

\treturn abs( fbm( vec3( 8.*posm, time ))-0.5 )* 0.1;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
\tvec2 q = fragCoord.xy / iResolution.xy;
    vec2 p = -1.0 + 2.0*q;
    p.x *= iResolution.x/ iResolution.y;

\t// camera parameters
\tvec3 ro = vec3(0.0, 0.5, 0.0);
\tvec3 ta = vec3(0.0, 0.45,1.0);
\tif (iMouse.z>=1.) {
\t\tta.xz *= rot( (iMouse.x/iResolution.x-.5)*7. );
\t}

\tta.xz *= rot( mod(iTime * 0.05, 6.2831852) );

\t// build ray
    vec3 ww = normalize( ta - ro);
    vec3 uu = normalize(cross( vec3(0.0,1.0,0.0), ww ));
    vec3 vv = normalize(cross(ww,uu));
    vec3 rd = normalize( p.x*uu + p.y*vv + 2.5*ww );

\tfloat fresnel, refldist = 5000., maxdist = 5000.;
\tbool reflected = false;
\tvec3 normal, col = bgColor( rd );
\tvec3 roo = ro, rdo = rd, bgc = col;

\tif( intersectPlane( ro, rd, 0., refldist ) && refldist < 200. ) {
\t\tro += refldist*rd;
\t\tvec2 coord = ro.xz;
\t\tfloat bumpfactor = BUMPFACTOR * (1. - smoothstep( 0., BUMPDISTANCE, refldist) );

\t\tvec2 dx = vec2( EPSILON, 0. );
\t\tvec2 dz = vec2( 0., EPSILON );

\t\tnormal = vec3( 0., 1., 0. );
\t\tnormal.x = -bumpfactor * (waterMap(coord + dx) - waterMap(coord-dx) ) / (2. * EPSILON);
\t\tnormal.z = -bumpfactor * (waterMap(coord + dz) - waterMap(coord-dz) ) / (2. * EPSILON);
\t\tnormal = normalize( normal );

\t\tfloat ndotr = dot(normal,rd);
\t\tfresnel = pow(1.0-abs(ndotr),5.);

\t\trd = reflect( rd, normal);

\t\treflected = true;
\t\tbgc = col = bgColor( rd );
\t}

\tcol = raymarchTerrain( ro, rd, col, reflected?(800.-refldist):800., maxdist );
    col = raymarchClouds( ro, rd, col, bgc, reflected?max(0.,min(150.,(150.-refldist))):150., maxdist, time*0.05 );

\tif( reflected ) {
\t\tcol = mix( col.xyz, bgc, 1.0-exp(-0.0000005*refldist*refldist) );
\t\tcol *= fresnel*0.9;
\t\tvec3 refr = refract( rdo, normal, 1./1.3330 );
\t\tintersectPlane( ro, refr, -2., refldist );
\t\tcol += mix( texture( iChannel2, (roo+refldist*refr).xz*1.3 ).xyz *
\t\t\t\t   vec3(1.,.9,0.6), vec3(1.,.9,0.8)*0.5, clamp( refldist / 3., 0., 1.) )
\t\t\t   * (1.-fresnel)*0.125;
\t}

\tcol = pow( col, vec3(0.7) );

\t// contrast, saturation and vignetting
\tcol = col*col*(3.0-2.0*col);
    col = mix( col, vec3(dot(col,vec3(0.33))), -0.5 );
 \tcol *= 0.25 + 0.75*pow( 16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y), 0.1 );

    fragColor = vec4( col, 1.0 );
}

`;

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
        if (materialRef.current) {
       //     materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
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
