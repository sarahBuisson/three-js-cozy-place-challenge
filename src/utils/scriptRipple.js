
document.addEventListener("DOMContentLoaded", () => {
    const scene = new THREE.Scene();
    const simScene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById("threeCanvas"),
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const mouse = new THREE.Vector2();
    let frame = 0;

    const width = window.innerWidth * window.devicePixelRatio;
    const height = window.innerHeight * window.devicePixelRatio;
    const options = {
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        stencilBuffer: false,
        depthBuffer: false,
    };
    let rtA = new THREE.WebGLRenderTarget(width, height, options);
    let rtB = new THREE.WebGLRenderTarget(width, height, options);

    const simMaterial = new THREE.ShaderMaterial({
        uniforms: {
            textureA: { value: null },
            mouse: { value: mouse },
            resolution: { value: new THREE.Vector2(width, height) },
            time: { value: 0 },
            frame: { value: 0 },
        },
        vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
        fragmentShader: `
      uniform sampler2D textureA;
      uniform vec2 mouse;
      uniform vec2 resolution;
      uniform float time;
      uniform int frame;
      varying vec2 vUv;

      const float delta = 1.4;

      void main() {
        vec2 uv = vUv;
        if (frame == 0) {
            gl_FragColor = vec4(0.0);
            return;
        }
        
        vec4 data = texture2D(textureA, uv);
        float pressure = data.x;
        float pVel = data.y;
        
        vec2 texelSize = 1.0 / resolution;
        float p_right = texture2D(textureA, uv + vec2(texelSize.x, 0.0)).x;
        float p_left = texture2D(textureA, uv + vec2(-texelSize.x, 0.0)).x;
        float p_up = texture2D(textureA, uv + vec2(0.0, texelSize.y)).x;
        float p_down = texture2D(textureA, uv + vec2(0.0, -texelSize.y)).x;
        
        pVel += delta * (-2.0 * pressure + p_right + p_left) / 4.0;
        pVel += delta * (-2.0 * pressure + p_up + p_down) / 4.0;
        
        pressure += delta * pVel;
        pVel -= 0.005 * delta * pressure;
        pVel *= 1.0 - 0.002 * delta;
        pressure *= 0.999;
        
        vec2 mouseUV = mouse / resolution;
        if(mouse.x > 0.0) {
            float dist = distance(uv, mouseUV);
            if(dist <= 0.02) {
                pressure += 2.0 * (1.0 - dist / 0.02);
            }
        }
        
        gl_FragColor = vec4(pressure, pVel, 
            (p_right - p_left) / 2.0, 
            (p_up - p_down) / 2.0);
      }
    `,
    });

    const renderMaterial = new THREE.ShaderMaterial({
        uniforms: {
            textureA: { value: null },
            textureB: { value: null },
        },
        vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
        fragmentShader: `
      uniform sampler2D textureA;
      uniform sampler2D textureB;
      varying vec2 vUv;

      void main() {
        vec4 data = texture2D(textureA, vUv);
        vec2 distortion = 0.3 * data.zw;
        vec4 textColor = texture2D(textureB, vUv + distortion);
        gl_FragColor = textColor;
      }
    `,
        transparent: true,
    });

    const plane = new THREE.PlaneGeometry(2, 2);
    const simQuad = new THREE.Mesh(plane, simMaterial);
    const renderQuad = new THREE.Mesh(plane, renderMaterial);

    simScene.add(simQuad);
    scene.add(renderQuad);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { alpha: true });

    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, width, height);

    const fontSize = Math.round(350 * window.devicePixelRatio);
    ctx.fillStyle = "white";
    ctx.font = `bold italic ${fontSize}px Poppins`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("supreme", width / 2, height / 2);

    const textTexture = new THREE.CanvasTexture(canvas);
    textTexture.minFilter = THREE.LinearFilter;
    textTexture.magFilter = THREE.LinearFilter;
    textTexture.format = THREE.RGBAFormat;

    window.addEventListener("resize", () => {
        const newWidth = window.innerWidth * window.devicePixelRatio;
        const newHeight = window.innerHeight * window.devicePixelRatio;

        renderer.setSize(window.innerWidth, window.innerHeight);
        rtA.setSize(newWidth, newHeight);
        rtB.setSize(newWidth, newHeight);
        simMaterial.uniforms.resolution.value.set(newWidth, newHeight);

        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, newWidth, newHeight);

        const newFontSize = Math.round(350 * window.devicePixelRatio);
        ctx.fillStyle = "white";
        ctx.font = `bold italic ${newFontSize}px Poppins`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("supreme", newWidth / 2, newHeight / 2);

        textTexture.needsUpdate = true;
    });

    renderer.domElement.addEventListener("mousemove", (e) => {
        mouse.x = e.clientX * window.devicePixelRatio;
        mouse.y = (window.innerHeight - e.clientY) * window.devicePixelRatio;
    });

    renderer.domElement.addEventListener("mouseleave", () => {
        mouse.set(0, 0);
    });

    const animate = () => {
        simMaterial.uniforms.frame.value = frame++;
        simMaterial.uniforms.time.value = performance.now() / 1000;

        simMaterial.uniforms.textureA.value = rtA.texture;
        renderer.setRenderTarget(rtB);
        renderer.render(simScene, camera);

        renderMaterial.uniforms.textureA.value = rtB.texture;
        renderMaterial.uniforms.textureB.value = textTexture;
        renderer.setRenderTarget(null);
        renderer.render(scene, camera);

        const temp = rtA;
        rtA = rtB;
        rtB = temp;

        requestAnimationFrame(animate);
    };

    animate();
});
