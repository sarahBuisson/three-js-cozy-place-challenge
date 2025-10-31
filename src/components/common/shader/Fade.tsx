import * as THREE from "three";
import { extend }  from '@react-three/fiber';

export default class Fade extends THREE.ShaderMaterial {
    constructor() {
        super({
            uniforms: {
                effectFactor: { type: "f", value: 1.2 },
                dispFactor: { type: "f", value: 0 },
                texture: { type: "t", value: undefined },
                texture2: { type: "t", value: undefined },
                disp: { type: "t", value: undefined }
            },
            vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }`,
            fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D texture;
        uniform sampler2D texture2;
        uniform sampler2D disp;
        uniform float _rot;
        uniform float dispFactor;
        uniform float effectFactor;
        void main() {
          vec2 uv = vUv;
          vec4 disp = texture2D(disp, uv);
          vec2 distortedPosition = vec2(uv.x, uv.y + dispFactor * (disp.r*effectFactor));
          vec2 distortedPosition2 = vec2(uv.x, uv.y - (1.0 - dispFactor) * (disp.r*effectFactor));
          vec4 _texture = texture2D(texture, distortedPosition);
          vec4 _texture2 = texture2D(texture2, distortedPosition2);
          vec4 finalTexture = mix(_texture, _texture2, dispFactor);
          gl_FragColor = finalTexture;
        }`
        });
    }

    get texture() {
        return this.uniforms.texture.value;
    }
    set texture(v) {
        this.uniforms.texture.value = v;
    }
    get texture2() {
        return this.uniforms.texture2.value;
    }
    set texture2(v) {
        this.uniforms.texture2.value = v;
    }
    get disp() {
        return this.uniforms.disp.value;
    }
    set disp(v) {
        this.uniforms.disp.value = v;
    }
    get dispFactor() {
        return this.uniforms.dispFactor.value;
    }
    set dispFactor(v) {
        this.uniforms.dispFactor.value = v;
    }
}


// register element in r3f (<fade />)

 export function nFade(props:{texture1:any, texture2:THREE.Texture, disp:THREE.Texture, attach:string}):Fade {
     let fade = new Fade();
     fade.texture = props.texture1;
     fade.texture2 = props.texture2;
     fade.disp = props.disp;
     return fade
 }

extend({ Fade , nFade});
