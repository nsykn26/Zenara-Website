'use strict';

class FluidSimulation {
  constructor(canvas) {
    this.canvas = canvas;
    this.canvas.width = canvas.clientWidth || 200;
    this.canvas.height = canvas.clientHeight || 200;

    this.config = {
      TEXTURE_DOWNSAMPLE: 1,
      DENSITY_DISSIPATION: 0.89,
      VELOCITY_DISSIPATION: 0.99,
      PRESSURE_DISSIPATION: 0,
      PRESSURE_ITERATIONS: 25,
      CURL: 2,
      SPLAT_RADIUS: 0.001,
      SPLAT_FORCE: 10,
      SHADING: true,
      TRANSPARENT: true,
      BLOOM: true,
      BLOOM_ITERATIONS: 8,
      BLOOM_RESOLUTION: 1024,
      BLOOM_INTENSITY: 0.8,
      BLOOM_THRESHOLD: 0.6,
      BLOOM_SOFT_KNEE: 0.7,
      SUNRAYS: false,
      SUNRAYS_RESOLUTION: 196,
      SUNRAYS_WEIGHT: 0.1,
    };

    this.pointers = [];
    this.splatStack = [];
    this.lastTime = Date.now();
    this.animationFrame = null;

    const pointerPrototype = {
      id: -1,
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      down: false,
      moved: false,
      color: [30, 0, 300],
    };
    this.pointers.push(Object.assign({}, pointerPrototype));

    const { gl, ext } = this.getWebGLContext(canvas);
    this.gl = gl;
    this.ext = ext;

    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    this.initFramebuffers();
    this.initShaders();
    this.initEventListeners();
    this.multipleSplats(parseInt(Math.random() * 20) + 5);
    this.update();
  }

  getWebGLContext(canvas) {
    const params = { alpha: true, depth: false, stencil: false, antialias: true };
    let gl = canvas.getContext('webgl2', params);
    const isWebGL2 = !!gl;

    if (!isWebGL2) {
      gl = canvas.getContext('webgl', params) || canvas.getContext('experimental-webgl', params);
    }

    let halfFloat;
    let supportLinearFiltering;

    if (isWebGL2) {
      gl.getExtension('EXT_color_buffer_float');
      supportLinearFiltering = gl.getExtension('OES_texture_float_linear');
    } else {
      halfFloat = gl.getExtension('OES_texture_half_float');
      supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear');
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    const halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : halfFloat.HALF_FLOAT_OES;
    let formatRGBA;
    let formatRG;
    let formatR;

    if (isWebGL2) {
      formatRGBA = this.getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType);
      formatRG = this.getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType);
      formatR = this.getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType);
    } else {
      formatRGBA = this.getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
      formatRG = this.getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
      formatR = this.getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
    }

    return {
      gl,
      ext: {
        formatRGBA,
        formatRG,
        formatR,
        halfFloatTexType,
        supportLinearFiltering,
      },
    };
  }

  getSupportedFormat(gl, internalFormat, format, type) {
    if (!this.supportRenderTextureFormat(gl, internalFormat, format, type)) {
      switch (internalFormat) {
        case gl.R16F:
          return this.getSupportedFormat(gl, gl.RG16F, gl.RG, type);
        case gl.RG16F:
          return this.getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
        default:
          return null;
      }
    }
    return { internalFormat, format };
  }

  supportRenderTextureFormat(gl, internalFormat, format, type) {
    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);

    let fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (status !== gl.FRAMEBUFFER_COMPLETE) return false;

    return true;
  }

  compileShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      throw this.gl.getShaderInfoLog(shader);
    }
    return shader;
  }

  initShaders() {
    const baseVertexShader = this.compileShader(
      this.gl.VERTEX_SHADER,
      `
      precision highp float;
      precision mediump sampler2D;
      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;
      void main () {
          vUv = aPosition * 0.5 + 0.5;
          vL = vUv - vec2(texelSize.x, 0.0);
          vR = vUv + vec2(texelSize.x, 0.0);
          vT = vUv + vec2(0.0, texelSize.y);
          vB = vUv - vec2(0.0, texelSize.y);
          gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `
    );

    const clearShader = this.compileShader(
      this.gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision mediump sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;
      void main () {
          gl_FragColor = value * texture2D(uTexture, vUv);
      }
    `
    );

    const displayShader = this.compileShader(
      this.gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision mediump sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTexture;
      void main () {
          gl_FragColor = texture2D(uTexture, vUv);
      }
    `
    );

    const splatShader = this.compileShader(
      this.gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision mediump sampler2D;
      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;
      void main () {
          vec2 p = vUv - point.xy;
          p.x *= aspectRatio;
          vec3 splat = exp(-dot(p, p) / radius) * color;
          vec3 base = texture2D(uTarget, vUv).xyz;
          gl_FragColor = vec4(base + splat, 1.0);
      }
    `
    );

    const advectionManualFilteringShader = this.compileShader(
      this.gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision mediump sampler2D;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform float dt;
      uniform float dissipation;
      vec4 bilerp (in sampler2D sam, in vec2 p) {
          vec4 st;
          st.xy = floor(p - 0.5) + 0.5;
          st.zw = st.xy + 1.0;
          vec4 uv = st * texelSize.xyxy;
          vec4 a = texture2D(sam, uv.xy);
          vec4 b = texture2D(sam, uv.zy);
          vec4 c = texture2D(sam, uv.xw);
          vec4 d = texture2D(sam, uv.zw);
          vec2 f = p - st.xy;
          return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }
      void main () {
          vec2 coord = gl_FragCoord.xy - dt * texture2D(uVelocity, vUv).xy;
          gl_FragColor = dissipation * bilerp(uSource, coord);
          gl_FragColor.a = 1.0;
      }
    `
    );

    const advectionShader = this.compileShader(
      this.gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision mediump sampler2D;
      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform float dt;
      uniform float dissipation;
      void main () {
          vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
          gl_FragColor = dissipation * texture2D(uSource, coord);
          gl_FragColor.a = 1.0;
      }
    `
    );

    const divergenceShader = this.compileShader(
      this.gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision mediump sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      vec2 sampleVelocity (in vec2 uv) {
          vec2 multiplier = vec2(1.0, 1.0);
          if (uv.x < 0.0) { uv.x = 0.0; multiplier.x = -1.0; }
          if (uv.x > 1.0) { uv.x = 1.0; multiplier.x = -1.0; }
          if (uv.y < 0.0) { uv.y = 0.0; multiplier.y = -1.0; }
          if (uv.y > 1.0) { uv.y = 1.0; multiplier.y = -1.0; }
          return multiplier * texture2D(uVelocity, uv).xy;
      }
      void main () {
          float L = sampleVelocity(vL).x;
          float R = sampleVelocity(vR).x;
          float T = sampleVelocity(vT).y;
          float B = sampleVelocity(vB).y;
          float div = 0.5 * (R - L + T - B);
          gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `
    );

    const curlShader = this.compileShader(
      this.gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision mediump sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      void main () {
          float L = texture2D(uVelocity, vL).y;
          float R = texture2D(uVelocity, vR).y;
          float T = texture2D(uVelocity, vT).x;
          float B = texture2D(uVelocity, vB).x;
          float vorticity = R - L - T + B;
          gl_FragColor = vec4(vorticity, 0.0, 0.0, 1.0);
      }
    `
    );

    const vorticityShader = this.compileShader(
      this.gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision mediump sampler2D;
      varying vec2 vUv;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;
      void main () {
          float T = texture2D(uCurl, vT).x;
          float B = texture2D(uCurl, vB).x;
          float C = texture2D(uCurl, vUv).x;
          vec2 force = vec2(abs(T) - abs(B), 0.0);
          force *= 1.0 / length(force + 0.00001) * curl * C;
          vec2 vel = texture2D(uVelocity, vUv).xy;
          gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);
      }
    `
    );

    const pressureShader = this.compileShader(
      this.gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision mediump sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;
      vec2 boundary (in vec2 uv) {
          uv = min(max(uv, 0.0), 1.0);
          return uv;
      }
      void main () {
          float L = texture2D(uPressure, boundary(vL)).x;
          float R = texture2D(uPressure, boundary(vR)).x;
          float T = texture2D(uPressure, boundary(vT)).x;
          float B = texture2D(uPressure, boundary(vB)).x;
          float C = texture2D(uPressure, vUv).x;
          float divergence = texture2D(uDivergence, vUv).x;
          float pressure = (L + R + B + T - divergence) * 0.25;
          gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `
    );

    const gradientSubtractShader = this.compileShader(
      this.gl.FRAGMENT_SHADER,
      `
      precision highp float;
      precision mediump sampler2D;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;
      vec2 boundary (in vec2 uv) {
          uv = min(max(uv, 0.0), 1.0);
          return uv;
      }
      void main () {
          float L = texture2D(uPressure, boundary(vL)).x;
          float R = texture2D(uPressure, boundary(vR)).x;
          float T = texture2D(uPressure, boundary(vT)).x;
          float B = texture2D(uPressure, boundary(vB)).x;
          vec2 velocity = texture2D(uVelocity, vUv).xy;
          velocity.xy -= vec2(R - L, T - B);
          gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `
    );

    this.clearProgram = new GLProgram(this.gl, baseVertexShader, clearShader);
    this.displayProgram = new GLProgram(this.gl, baseVertexShader, displayShader);
    this.splatProgram = new GLProgram(this.gl, baseVertexShader, splatShader);
    this.advectionProgram = new GLProgram(
      this.gl,
      baseVertexShader,
      this.ext.supportLinearFiltering ? advectionShader : advectionManualFilteringShader
    );
    this.divergenceProgram = new GLProgram(this.gl, baseVertexShader, divergenceShader);
    this.curlProgram = new GLProgram(this.gl, baseVertexShader, curlShader);
    this.vorticityProgram = new GLProgram(this.gl, baseVertexShader, vorticityShader);
    this.pressureProgram = new GLProgram(this.gl, baseVertexShader, pressureShader);
    this.gradientSubtractProgram = new GLProgram(this.gl, baseVertexShader, gradientSubtractShader);
  }

  initFramebuffers() {
    this.textureWidth = this.gl.drawingBufferWidth >> this.config.TEXTURE_DOWNSAMPLE;
    this.textureHeight = this.gl.drawingBufferHeight >> this.config.TEXTURE_DOWNSAMPLE;

    const texType = this.ext.halfFloatTexType;
    const rgba = this.ext.formatRGBA;
    const rg = this.ext.formatRG;
    const r = this.ext.formatR;

    this.density = this.createDoubleFBO(
      2,
      this.textureWidth,
      this.textureHeight,
      rgba.internalFormat,
      rgba.format,
      texType,
      this.ext.supportLinearFiltering ? this.gl.LINEAR : this.gl.NEAREST
    );

    this.velocity = this.createDoubleFBO(
      0,
      this.textureWidth,
      this.textureHeight,
      rg.internalFormat,
      rg.format,
      texType,
      this.ext.supportLinearFiltering ? this.gl.LINEAR : this.gl.NEAREST
    );

    this.divergence = this.createFBO(
      4,
      this.textureWidth,
      this.textureHeight,
      r.internalFormat,
      r.format,
      texType,
      this.gl.NEAREST
    );

    this.curl = this.createFBO(
      5,
      this.textureWidth,
      this.textureHeight,
      r.internalFormat,
      r.format,
      texType,
      this.gl.NEAREST
    );

    this.pressure = this.createDoubleFBO(
      6,
      this.textureWidth,
      this.textureHeight,
      r.internalFormat,
      r.format,
      texType,
      this.gl.NEAREST
    );
  }

  createFBO(texId, w, h, internalFormat, format, type, param) {
    this.gl.activeTexture(this.gl.TEXTURE0 + texId);
    let texture = this.gl.createTexture();
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, param);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, param);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
    this.gl.texImage2D(this.gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

    let fbo = this.gl.createFramebuffer();
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fbo);
    this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, texture, 0);

    this.gl.viewport(0, 0, w, h);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    return [texture, fbo, texId];
  }

  createDoubleFBO(texId, w, h, internalFormat, format, type, param) {
    let fbo1 = this.createFBO(texId, w, h, internalFormat, format, type, param);
    let fbo2 = this.createFBO(texId + 1, w, h, internalFormat, format, type, param);

    return {
      get read() {
        return fbo1;
      },
      get write() {
        return fbo2;
      },
      swap() {
        let temp = fbo1;
        fbo1 = fbo2;
        fbo2 = temp;
      },
    };
  }

  initBlit() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.gl.createBuffer());
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
      this.gl.STATIC_DRAW
    );
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.gl.createBuffer());
    this.gl.bufferData(
      this.gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array([0, 1, 2, 0, 2, 3]),
      this.gl.STATIC_DRAW
    );
    this.gl.vertexAttribPointer(0, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(0);

    this.blit = (destination) => {
      this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, destination);
      this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);
    };
  }

  initEventListeners() {
    const handleMouseMove = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;

      const pointer = this.pointers[0];
      pointer.moved = pointer.down;
      pointer.dx = (x - pointer.x) * 10.0;
      pointer.dy = (y - pointer.y) * 10.0;
      pointer.x = x;
      pointer.y = y;
    };

    const handleMouseDown = () => {
      const pointer = this.pointers[0];
      pointer.down = true;
      pointer.color = [Math.random() + 0.2, Math.random() + 0.2, Math.random() + 0.2];
    };

    const handleMouseUp = () => {
      this.pointers[0].down = false;
    };

    this.canvas.addEventListener('mousemove', handleMouseMove);
    this.canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    this.removeEventListeners = () => {
      this.canvas.removeEventListener('mousemove', handleMouseMove);
      this.canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }

  resizeCanvas() {
    if (this.canvas.width !== this.canvas.clientWidth || this.canvas.height !== this.canvas.clientHeight) {
      this.canvas.width = this.canvas.clientWidth;
      this.canvas.height = this.canvas.clientHeight;
      this.initFramebuffers();
    }
  }

  splat(x, y, dx, dy, color) {
    this.splatProgram.bind();
    this.gl.uniform1i(this.splatProgram.uniforms.uTarget, this.velocity.read[2]);
    this.gl.uniform1f(this.splatProgram.uniforms.aspectRatio, this.canvas.width / this.canvas.height);
    this.gl.uniform2f(this.splatProgram.uniforms.point, x, y);
    this.gl.uniform3f(this.splatProgram.uniforms.color, dx, -dy, 1.0);
    this.gl.uniform1f(this.splatProgram.uniforms.radius, this.config.SPLAT_RADIUS);
    this.blit(this.velocity.write[1]);
    this.velocity.swap();

    this.gl.uniform1i(this.splatProgram.uniforms.uTarget, this.density.read[2]);
    this.gl.uniform3f(this.splatProgram.uniforms.color, color[0] * 0.3, color[1] * 0.3, color[2] * 0.3);
    this.blit(this.density.write[1]);
    this.density.swap();
  }

  multipleSplats(amount) {
    for (let i = 0; i < amount; i++) {
      const color = [Math.random() * 10, Math.random() * 10, Math.random() * 10];
      const x = Math.random();
      const y = Math.random();
      const dx = 1000 * (Math.random() - 0.5);
      const dy = 1000 * (Math.random() - 0.5);
      this.splat(x, y, dx, dy, color);
    }
  }

  update() {
    this.resizeCanvas();

    const dt = Math.min((Date.now() - this.lastTime) / 1000, 0.016);
    this.lastTime = Date.now();

    this.gl.viewport(0, 0, this.textureWidth, this.textureHeight);

    if (this.splatStack.length > 0) {
      this.multipleSplats(this.splatStack.pop());
    }

    // Advection
    this.advectionProgram.bind();
    this.gl.uniform2f(this.advectionProgram.uniforms.texelSize, 1.0 / this.textureWidth, 1.0 / this.textureHeight);
    this.gl.uniform1i(this.advectionProgram.uniforms.uVelocity, this.velocity.read[2]);
    this.gl.uniform1i(this.advectionProgram.uniforms.uSource, this.velocity.read[2]);
    this.gl.uniform1f(this.advectionProgram.uniforms.dt, dt);
    this.gl.uniform1f(this.advectionProgram.uniforms.dissipation, this.config.VELOCITY_DISSIPATION);
    this.blit(this.velocity.write[1]);
    this.velocity.swap();

    this.gl.uniform1i(this.advectionProgram.uniforms.uVelocity, this.velocity.read[2]);
    this.gl.uniform1i(this.advectionProgram.uniforms.uSource, this.density.read[2]);
    this.gl.uniform1f(this.advectionProgram.uniforms.dissipation, this.config.DENSITY_DISSIPATION);
    this.blit(this.density.write[1]);
    this.density.swap();

    // Splat from pointers
    for (let i = 0; i < this.pointers.length; i++) {
      const pointer = this.pointers[i];
      if (pointer.moved) {
        this.splat(pointer.x, pointer.y, pointer.dx, pointer.dy, pointer.color);
        pointer.moved = false;
      }
    }

    // Curl
    this.curlProgram.bind();
    this.gl.uniform2f(this.curlProgram.uniforms.texelSize, 1.0 / this.textureWidth, 1.0 / this.textureHeight);
    this.gl.uniform1i(this.curlProgram.uniforms.uVelocity, this.velocity.read[2]);
    this.blit(this.curl[1]);

    // Vorticity
    this.vorticityProgram.bind();
    this.gl.uniform2f(this.vorticityProgram.uniforms.texelSize, 1.0 / this.textureWidth, 1.0 / this.textureHeight);
    this.gl.uniform1i(this.vorticityProgram.uniforms.uVelocity, this.velocity.read[2]);
    this.gl.uniform1i(this.vorticityProgram.uniforms.uCurl, this.curl[2]);
    this.gl.uniform1f(this.vorticityProgram.uniforms.curl, this.config.CURL);
    this.gl.uniform1f(this.vorticityProgram.uniforms.dt, dt);
    this.blit(this.velocity.write[1]);
    this.velocity.swap();

    // Divergence
    this.divergenceProgram.bind();
    this.gl.uniform2f(this.divergenceProgram.uniforms.texelSize, 1.0 / this.textureWidth, 1.0 / this.textureHeight);
    this.gl.uniform1i(this.divergenceProgram.uniforms.uVelocity, this.velocity.read[2]);
    this.blit(this.divergence[1]);

    // Clear pressure
    this.clearProgram.bind();
    let pressureTexId = this.pressure.read[2];
    this.gl.activeTexture(this.gl.TEXTURE0 + pressureTexId);
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.pressure.read[0]);
    this.gl.uniform1i(this.clearProgram.uniforms.uTexture, pressureTexId);
    this.gl.uniform1f(this.clearProgram.uniforms.value, this.config.PRESSURE_DISSIPATION);
    this.blit(this.pressure.write[1]);
    this.pressure.swap();

    // Pressure
    this.pressureProgram.bind();
    this.gl.uniform2f(this.pressureProgram.uniforms.texelSize, 1.0 / this.textureWidth, 1.0 / this.textureHeight);
    this.gl.uniform1i(this.pressureProgram.uniforms.uDivergence, this.divergence[2]);
    pressureTexId = this.pressure.read[2];
    this.gl.uniform1i(this.pressureProgram.uniforms.uPressure, pressureTexId);
    this.gl.activeTexture(this.gl.TEXTURE0 + pressureTexId);

    for (let i = 0; i < this.config.PRESSURE_ITERATIONS; i++) {
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.pressure.read[0]);
      this.blit(this.pressure.write[1]);
      this.pressure.swap();
    }

    // Gradient subtract
    this.gradientSubtractProgram.bind();
    this.gl.uniform2f(this.gradientSubtractProgram.uniforms.texelSize, 1.0 / this.textureWidth, 1.0 / this.textureHeight);
    this.gl.uniform1i(this.gradientSubtractProgram.uniforms.uPressure, this.pressure.read[2]);
    this.gl.uniform1i(this.gradientSubtractProgram.uniforms.uVelocity, this.velocity.read[2]);
    this.blit(this.velocity.write[1]);
    this.velocity.swap();

    // Display
    this.gl.viewport(0, 0, this.gl.drawingBufferWidth, this.gl.drawingBufferHeight);
    this.displayProgram.bind();
    this.gl.uniform1i(this.displayProgram.uniforms.uTexture, this.density.read[2]);
    this.blit(null);

    this.animationFrame = requestAnimationFrame(() => this.update());
  }

  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    if (this.removeEventListeners) {
      this.removeEventListeners();
    }
  }
}

class GLProgram {
  constructor(gl, vertexShader, fragmentShader) {
    this.gl = gl;
    this.uniforms = {};
    this.program = gl.createProgram();
    gl.attachShader(this.program, vertexShader);
    gl.attachShader(this.program, fragmentShader);
    gl.linkProgram(this.program);

    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      throw gl.getProgramInfoLog(this.program);
    }

    const uniformCount = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCount; i++) {
      const uniformName = gl.getActiveUniform(this.program, i).name;
      this.uniforms[uniformName] = gl.getUniformLocation(this.program, uniformName);
    }
  }

  bind() {
    this.gl.useProgram(this.program);
  }
}

export default FluidSimulation;
