import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export interface RoomController {
  turn: (index: number) => void;
  dispose: () => void;
}

/** The WebGL architecture and HTML displays share one perspective camera. */
export async function createRoom(
  host: HTMLElement,
  displays: HTMLElement[],
  onReady: () => void,
  onFailure: () => void,
): Promise<RoomController> {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#050917');
  scene.fog = new THREE.FogExp2('#090e21', 0.027);
  const htmlScene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(62, 1, 0.1, 65);
  camera.position.set(0, 3.5, 0);
  camera.rotation.order = 'YXZ';

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 768 ? 1.25 : 1.6));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.domElement.className = 'room-canvas';
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.appendChild(renderer.domElement);

  const htmlLayer = document.createElement('div');
  htmlLayer.className = 'room-html';
  host.appendChild(htmlLayer);
  const origins = displays.map(display => display.parentElement!);
  const htmlDisplays: { object: THREE.Object3D; element: HTMLElement }[] = [];
  const screenFrames: THREE.Group[] = [];
  const animated: { object: THREE.Object3D; speed: number; y: number }[] = [];
  const environmentRoom = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(environmentRoom, 0.04);
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.65;
  environmentRoom.dispose();
  pmrem.dispose();
  RectAreaLightUniformsLib.init();
  const materials = new Set<THREE.Material>();
  const geometries = new Set<THREE.BufferGeometry>();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const colors = [0x48bfff, 0xb780ff, 0x42e8cf, 0xfa76c8];
  const metal = new THREE.MeshStandardMaterial({ color: 0x151c2b, metalness: 0.72, roughness: 0.36 });
  const darkMetal = new THREE.MeshStandardMaterial({ color: 0x080e19, metalness: 0.55, roughness: 0.46 });
  const silver = new THREE.MeshStandardMaterial({ color: 0x627386, metalness: 0.85, roughness: 0.28 });
  const glowMaterials = new Map<string, THREE.MeshBasicMaterial>();
  const glow = (color: number, strength = 3) => {
    const key = `${color}-${strength}`;
    if (!glowMaterials.has(key)) glowMaterials.set(key, new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(strength) }));
    return glowMaterials.get(key)!;
  };

  function box(parent: THREE.Object3D, size: number[], pos: number[], material: THREE.Material) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(size[0], size[1], size[2]), material);
    mesh.position.set(pos[0], pos[1], pos[2]);
    parent.add(mesh);
    return mesh;
  }

  function tube(parent: THREE.Object3D, points: number[][], color: number, radius = 0.026) {
    const curve = new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(...p)), false, 'centripetal');
    const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 36, radius, 6, false), glow(color));
    parent.add(mesh);
    return mesh;
  }

  scene.add(new THREE.HemisphereLight(0x7e9fd0, 0x0a0920, 1.6));
  const overhead = new THREE.PointLight(0xb4caff, 110, 22, 2);
  overhead.position.set(0, 7, 0);
  scene.add(overhead);

  // A real planar reflection anchors every luminous fixture to the floor.
  const reflection = new Reflector(new THREE.PlaneGeometry(18, 18), {
    color: 0x343c51,
    textureWidth: window.innerWidth < 768 ? 512 : 1024,
    textureHeight: window.innerWidth < 768 ? 512 : 1024,
    clipBias: 0.004,
    multisample: 0,
  });
  reflection.rotation.x = -Math.PI / 2;
  // An unmultisampled byte target avoids HDR resolve artifacts on integrated GPUs.
  reflection.getRenderTarget().texture.type = THREE.UnsignedByteType;
  scene.add(reflection);
  const updateReflection = reflection.onBeforeRender.bind(reflection) as (renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) => void;
  reflection.onBeforeRender = () => {};
  const floorTint = new THREE.Mesh(new THREE.PlaneGeometry(18, 18), new THREE.MeshBasicMaterial({ color: 0x050a15, transparent: true, opacity: 0.58, depthWrite: false }));
  floorTint.rotation.x = -Math.PI / 2;
  floorTint.position.y = 0.012;
  scene.add(floorTint);
  for (let line = -9; line <= 9; line += 1.5) {
    box(scene, [0.012, 0.012, 18], [line, 0.024, 0], metal);
    box(scene, [18, 0.012, 0.012], [0, 0.024, line], metal);
  }
  box(scene, [18, 0.15, 18], [0, 8.1, 0], darkMetal);

  // Repeated structural bays give a readable room during each quarter-turn.
  for (let side = 0; side < 4; side++) {
    const color = colors[side];
    const wall = new THREE.Group();
    wall.rotation.y = -side * Math.PI / 2;
    scene.add(wall);
    box(wall, [18, 8, 0.25], [0, 4, -9], darkMetal);
    for (let x = -8; x <= 8; x += 2) {
      box(wall, [1.94, 7.6, 0.09], [x, 4, -8.8], metal);
      box(wall, [0.025, 7.7, 0.05], [x + 0.97, 4, -8.69], darkMetal);
    }
    box(wall, [17.5, 0.08, 0.12], [0, 0.22, -8.6], glow(color, 2));
    box(wall, [17.5, 0.04, 0.12], [0, 7.7, -8.6], glow(color, 2));
    box(wall, [13, 0.34, 0.7], [0, 7.2, -8.25], darkMetal);
    box(wall, [11, 0.045, 0.55], [0, 7.02, -8.22], glow(color, 2));
    for (const x of [-8.15, 8.15]) {
      box(wall, [0.32, 8, 0.65], [x, 4, -8.45], silver);
      box(wall, [0.065, 6.8, 0.08], [x, 4, -8.08], glow(color, 3.5));
      tube(wall, [[x, 0.04, -8.2], [x, 0.04, -5.4], [x * 0.75, 0.04, -4.5]], color, 0.018);
    }
    const light = new THREE.PointLight(color, 85, 14, 2);
    light.position.set(0, 5.8, -7);
    wall.add(light);
    const wash = new THREE.RectAreaLight(color, 6, 12, 2);
    wash.position.set(0, 6.9, -6.5);
    wash.lookAt(0, 2, -8.8);
    wall.add(wash);

    const frame = new THREE.Group();
    frame.position.set(0, 3.65, -8.55);
    wall.add(frame);
    box(frame, [1, 1, 0.12], [0, 0, -0.1], darkMetal);
    box(frame, [1.015, 0.006, 0.035], [0, 0.505, 0], glow(color, 1.8));
    box(frame, [1.015, 0.006, 0.035], [0, -0.505, 0], glow(color, 1.8));
    box(frame, [0.003, 1, 0.035], [-0.51, 0, 0], glow(color, 1));
    box(frame, [0.003, 1, 0.035], [0.51, 0, 0], glow(color, 1));
    screenFrames.push(frame);

    const object = new THREE.Object3D();
    object.position.copy(new THREE.Vector3(0, 3.65, -8.44).applyAxisAngle(new THREE.Vector3(0, 1, 0), wall.rotation.y));
    object.rotation.y = wall.rotation.y;
    htmlScene.add(object);
    htmlDisplays.push({ object, element: displays[side] });
    htmlLayer.appendChild(displays[side]);

    // Server towers with individually inset drive bays and status lights.
    for (const x of [-6.95, 6.95]) {
      box(wall, [1.25, 2.9, 0.85], [x, 1.48, -7.75], darkMetal);
      box(wall, [1.38, 0.16, 1], [x, 0.1, -7.75], silver);
      for (let row = 0; row < 9; row++) {
        box(wall, [1.06, 0.23, 0.12], [x, 0.36 + row * 0.29, -7.26], metal);
        box(wall, [0.08, 0.035, 0.03], [x - 0.36, 0.36 + row * 0.29, -7.18], glow(row % 3 ? color : 0xefffff, 2));
        for (let vent = 0; vent < 5; vent++) box(wall, [0.035, 0.1, 0.02], [x + vent * 0.1, 0.36 + row * 0.29, -7.18], darkMetal);
      }
      tube(wall, [[x + 0.35, 2.9, -7.8], [x + 0.35, 3.5, -7.8], [x + 0.7, 4, -8.65]], color, 0.018);
    }

    // Each wall has its own small kinetic exhibit above a machined plinth.
    const sculpture = new THREE.Group();
    sculpture.position.set(6.8, 4.2, -7.35);
    wall.add(sculpture);
    const shape = side === 0 ? new THREE.IcosahedronGeometry(0.5, 0) : side === 1 ? new THREE.BoxGeometry(0.7, 0.7, 0.7) : side === 2 ? new THREE.TorusKnotGeometry(0.3, 0.085, 80, 12) : new THREE.OctahedronGeometry(0.55);
    sculpture.add(new THREE.Mesh(shape, new THREE.MeshStandardMaterial({ color, metalness: 0.85, roughness: 0.14, emissive: color, emissiveIntensity: 0.2 })));
    const edges = new THREE.LineSegments(new THREE.EdgesGeometry(shape), new THREE.LineBasicMaterial({ color: new THREE.Color(color).multiplyScalar(2) }));
    sculpture.add(edges);
    animated.push({ object: sculpture, speed: 0.23 + side * 0.06, y: 4.2 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.018, 8, 80), glow(color, 2));
    ring.rotation.x = Math.PI / 2;
    ring.position.set(6.8, 3.3, -7.35);
    wall.add(ring);

    // Light shafts: a soft analytic falloff, kept subtle enough to preserve text contrast.
    const shaftMaterial = new THREE.ShaderMaterial({
      uniforms: { tint: { value: new THREE.Color(color) } },
      vertexShader: 'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
      fragmentShader: 'varying vec2 vUv; uniform vec3 tint; void main(){float edge=pow(sin(vUv.x*3.14159265),3.0);float fade=pow(vUv.y,1.5)*(1.0-vUv.y);gl_FragColor=vec4(tint,edge*fade*0.035);}',
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    });
    for (const x of [-7.5, 7.5]) {
      const shaft = new THREE.Mesh(new THREE.ConeGeometry(1.4, 6.6, 24, 1, true), shaftMaterial);
      shaft.position.set(x, 3.7, -7.8);
      wall.add(shaft);
    }
  }

  // Ceiling aperture and concentric luminaire; visible in the peripheral view.
  for (const radius of [2.1, 2.3, 3.6]) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(radius, radius === 2.3 ? 0.12 : 0.025, 8, 100), radius === 2.3 ? metal : glow(0x90bbff, 2));
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 7.6;
    scene.add(ring);
  }

  // Deterministic, sparse dust. No random scene changes on resize or hydration.
  const positions = new Float32Array(210 * 3);
  for (let i = 0; i < 210; i++) {
    positions[i * 3] = Math.sin(i * 127.1) * 8.5;
    positions[i * 3 + 1] = ((i * 37) % 79) / 10 + 0.2;
    positions[i * 3 + 2] = Math.cos(i * 311.7) * 8.5;
  }
  const dustGeometry = new THREE.BufferGeometry();
  dustGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const dust = new THREE.Points(dustGeometry, new THREE.PointsMaterial({ color: 0x8badd1, size: 0.018, transparent: true, opacity: 0.4, depthWrite: false }));
  scene.add(dust);

  // Batch the static room by material. Keep resizable displays and kinetic
  // exhibits independent; hundreds of server details become a few draw calls.
  scene.updateMatrixWorld(true);
  const moving = new Set<THREE.Object3D>([...screenFrames, ...animated.map(item => item.object), reflection]);
  const batches = new Map<THREE.Material, THREE.Mesh[]>();
  scene.traverse(object => {
    if (!(object instanceof THREE.Mesh) || Array.isArray(object.material) || object.material.transparent) return;
    for (let parent: THREE.Object3D | null = object; parent; parent = parent.parent) if (moving.has(parent)) return;
    const batch = batches.get(object.material) ?? [];
    batch.push(object);
    batches.set(object.material, batch);
  });
  batches.forEach((meshes, material) => {
    if (meshes.length < 2) return;
    const parts = meshes.map(mesh => mesh.geometry.clone().applyMatrix4(mesh.matrixWorld));
    const geometry = mergeGeometries(parts);
    parts.forEach(part => part.dispose());
    if (!geometry) return;
    meshes.forEach(mesh => { geometries.add(mesh.geometry); mesh.removeFromParent(); });
    scene.add(new THREE.Mesh(geometry, material));
  });

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.55, 0.55, 0.95);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  let targetIndex = 0;
  let targetYaw = 0;
  let yaw = 0;
  let pointerX = 0;
  let pointerY = 0;
  let frameId = 0;
  let disposed = false;
  let lastTime = 0;
  let firstFrame = true;
  let intro = reducedMotion.matches ? 1 : 0;
  let elapsed = 0;
  let dirty = true;

  function resize() {
    dirty = true;
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    composer.setSize(width, height);
    const mobile = width < 760;
    const focal = height / (2 * Math.tan(THREE.MathUtils.degToRad(62 / 2)));
    const scale = 8.44 / focal;
    const panelWidth = Math.min(mobile ? width - 42 : Math.min(1100, width * 0.72), 12 / scale);
    const panelHeight = Math.min(mobile ? Math.max(200, height - 230) : Math.min(535, height * (height < 600 ? 0.50 : 0.60)), 6.2 / scale);
    htmlDisplays.forEach(({ object, element }, i) => {
      element.style.width = `${panelWidth}px`;
      element.style.height = `${panelHeight}px`;
      object.scale.setScalar(scale);
      screenFrames[i].scale.set(panelWidth * scale + 0.25, panelHeight * scale + 0.22, 1);
    });
  }

  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();
  function pointer(event: PointerEvent) {
    if (event.pointerType !== 'mouse' || reducedMotion.matches) return;
    pointerX = (event.clientX / window.innerWidth - 0.5) * 0.014;
    pointerY = (event.clientY / window.innerHeight - 0.5) * 0.009;
  }
  function resetPointer() { pointerX = 0; pointerY = 0; }
  window.addEventListener('pointermove', pointer, { passive: true });
  document.addEventListener('pointerleave', resetPointer);
  function contextLost(event: Event) { event.preventDefault(); onFailure(); }
  renderer.domElement.addEventListener('webglcontextlost', contextLost);
  function motionPreferenceChanged() { dirty = true; }
  reducedMotion.addEventListener('change', motionPreferenceChanged);

  const viewProjection = new THREE.Matrix4();
  const displayProjection = new THREE.Matrix4();
  function renderDisplays() {
    // Flatten the camera and wall transform into a single projected plane.
    // This preserves true perspective, text selection and native hit testing
    // without nested CSS3D scroll containers intercepting clicks on side walls.
    htmlScene.updateMatrixWorld();
    viewProjection.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    const w = host.clientWidth / 2;
    const h = host.clientHeight / 2;
    htmlDisplays.forEach(({ object, element }, i) => {
      const facing = Math.cos(yaw + i * Math.PI / 2);
      element.style.visibility = facing > 0.12 ? 'visible' : 'hidden';
      element.style.opacity = `${THREE.MathUtils.smoothstep(facing, 0.15, 0.8)}`;
      element.style.pointerEvents = i === targetIndex && facing > 0.98 ? 'auto' : 'none';
      if (facing <= 0.12) return;
      displayProjection.multiplyMatrices(viewProjection, object.matrixWorld);
      const e = displayProjection.elements;
      const halfW = element.offsetWidth / 2;
      const halfH = element.offsetHeight / 2;
      const cx = e[12] - e[0] * halfW + e[4] * halfH;
      const cy = e[13] - e[1] * halfW + e[5] * halfH;
      const cw = e[15] - e[3] * halfW + e[7] * halfH;
      const matrix = [
        (e[0] + e[3]) * w, (e[3] - e[1]) * h, 0, e[3],
        (-e[4] - e[7]) * w, (e[5] - e[7]) * h, 0, -e[7],
        0, 0, 1, 0,
        (cx + cw) * w, (cw - cy) * h, 0, cw,
      ].map(value => value / cw);
      element.style.transform = `matrix3d(${matrix.join(',')})`;
    });
  }

  function render(time: number) {
    if (disposed) return;
    frameId = requestAnimationFrame(render);
    if (document.hidden) { lastTime = time; return; }
    if (reducedMotion.matches && !dirty && !firstFrame) { lastTime = time; return; }
    dirty = false;
    const delta = Math.min((time - (lastTime || time)) / 1000, 0.05);
    lastTime = time;
    elapsed += delta;
    intro = Math.min(1, intro + delta * 0.65);
    const ease = 1 - Math.pow(1 - intro, 3);
    yaw = reducedMotion.matches ? targetYaw : THREE.MathUtils.damp(yaw, targetYaw, 4.2, delta);
    camera.rotation.y = yaw + (reducedMotion.matches ? 0 : pointerX);
    camera.rotation.x = reducedMotion.matches ? 0 : pointerY;
    camera.position.y = 3.5 - (1 - ease) * 0.25;
    camera.fov = 62 + (1 - ease) * 12;
    camera.updateProjectionMatrix();
    animated.forEach(({ object, speed, y }) => {
      if (!reducedMotion.matches) {
        object.rotation.y = elapsed * speed;
        object.rotation.z = Math.sin(elapsed * 0.3) * 0.12;
        object.position.y = y + Math.sin(elapsed * 0.8) * 0.08;
      }
    });
    if (!reducedMotion.matches) dust.rotation.y = elapsed * 0.008;
    try {
      scene.updateMatrixWorld();
      camera.updateMatrixWorld();
      updateReflection(renderer, scene, camera);
      composer.render();
      renderDisplays();
      if (firstFrame) { firstFrame = false; onReady(); }
    } catch {
      cancelAnimationFrame(frameId);
      onFailure();
    }
  }

  // Compile before fading the 2D splash; avoid showing an unlit first frame.
  try { await renderer.compileAsync(scene, camera); } catch { /* Synchronous render is the compatible fallback. */ }
  frameId = requestAnimationFrame(render);

  return {
    turn(index) {
      dirty = true;
      targetIndex = ((index % 4) + 4) % 4;
      const desired = -targetIndex * Math.PI / 2;
      const shortest = THREE.MathUtils.euclideanModulo(desired - targetYaw + Math.PI, Math.PI * 2) - Math.PI;
      targetYaw += shortest;
      if (reducedMotion.matches) yaw = targetYaw;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener('pointermove', pointer);
      document.removeEventListener('pointerleave', resetPointer);
      renderer.domElement.removeEventListener('webglcontextlost', contextLost);
      reducedMotion.removeEventListener('change', motionPreferenceChanged);
      displays.forEach((display, i) => {
        origins[i].appendChild(display);
        display.removeAttribute('style');
      });
      scene.traverse(object => {
        if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments || object instanceof THREE.Points) {
          geometries.add(object.geometry);
          (Array.isArray(object.material) ? object.material : [object.material]).forEach(material => materials.add(material));
        }
      });
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(material => material.dispose());
      environment.dispose();
      reflection.getRenderTarget().dispose();
      composer.passes.forEach(pass => pass.dispose());
      composer.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
      htmlLayer.remove();
    },
  };
}
