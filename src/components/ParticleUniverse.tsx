'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SHAPES } from '@/lib/shapes';

const MORPH_SPEED = 1.8;
const HOLD_TIME = 5;

/* ─── Vertex Shader: rhythmic beats + mouse repulsion + twinkle ─── */
const VERT = `
attribute float aSize;
attribute vec3 aColor;
attribute float aAlpha;
attribute float aRand;
uniform float uTime;
uniform float uDpr;
uniform vec3 uMouse3D;
uniform float uMouseActive;
varying vec3 vCol;
varying float vAlpha;

void main(){
  vec3 col = aColor;
  vec3 pos = position;

  // Simulated rhythmic beats (as if reacting to music)
  float beat1 = pow(max(sin(uTime * 3.14159), 0.0), 14.0);
  float beat2 = pow(max(sin(uTime * 1.5708), 0.0), 10.0);
  float pulse = beat1 * 0.1 + beat2 * 0.05;

  // Organic floating + beat expansion
  float r = aRand;
  pos.x += sin(uTime * 0.5 + r * 6.28) * 0.22;
  pos.y += cos(uTime * 0.35 + r * 3.14) * 0.18;
  pos.z += sin(uTime * 0.4 + r * 4.5) * 0.15;
  pos *= 1.0 + pulse;

  // Mouse repulsion
  vec3 toMouse = pos - uMouse3D;
  float mouseDist = length(toMouse);
  float repulseRadius = 5.5;
  if(mouseDist < repulseRadius && uMouseActive > 0.5) {
    float force = 1.0 - mouseDist / repulseRadius;
    force = force * force * 3.5;
    pos += normalize(toMouse + vec3(0.001)) * force;
    col = mix(col, vec3(0.7, 1.0, 1.0), force * 0.3);
  }

  // Twinkle + beat glow
  float twinkle = pow(max(sin(uTime * 2.5 + r * 789.0), 0.0), 25.0);
  float shimmer = sin(uTime * 3.0 + r * 123.0) * 0.5 + 0.5;
  vAlpha = aAlpha * (0.7 + shimmer * 0.2 + twinkle * 1.0 + beat1 * 0.25);
  vCol = col + vec3(twinkle * 0.3 + beat1 * 0.08);

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  float sizeMod = 1.0 + twinkle * 1.2 + beat1 * 0.4;

  // Depth fade
  float depth = clamp((-mv.z - 18.0) / 35.0, 0.0, 1.0);
  vAlpha *= 1.0 - depth * 0.35;

  gl_PointSize = aSize * sizeMod * uDpr * (150.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}`;

/* ─── Fragment Shader: balanced glow ─── */
const FRAG = `
varying vec3 vCol;
varying float vAlpha;

void main(){
  float d = length(gl_PointCoord - vec2(0.5));
  if(d > 0.5) discard;

  float core = exp(-d * 14.0);
  float glow = exp(-d * 4.5) * 0.3;
  vec3 col = vCol * (core + glow) + vec3(1.0) * core * 0.2;
  float alpha = vAlpha * (core + glow);

  gl_FragColor = vec4(col, alpha);
}`;

interface Props {
  onShapeChange?: (name: string) => void;
  audioEnabled?: boolean;
}

export default function ParticleUniverse({ onShapeChange }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({
    renderer: null as THREE.WebGLRenderer | null,
    count: 8000,
    cur: null as Float32Array | null,
    tgt: null as Float32Array | null,
    start: null as Float32Array | null,
    shapeIdx: 0,
    morphT: 1,
    morphing: false,
    lastSwap: 0,
    mouse: { x: 0, y: 0 },
    mouseActive: false,
    raf: 0,
    dead: false,
  });

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const s = stateRef.current;
    s.dead = false;

    const isMobile = window.innerWidth < 768;
    const count = isMobile ? 5000 : 8000;
    s.count = count;

    const tc = document.createElement('canvas');
    if (!tc.getContext('webgl') && !tc.getContext('experimental-webgl')) {
      el.classList.add('webgl-fallback');
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true }); }
    catch { el.classList.add('webgl-fallback'); return; }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);
    s.renderer = renderer;

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    cam.position.z = 32;

    const init = SHAPES[0].fn(count);
    s.cur = new Float32Array(init);
    s.tgt = new Float32Array(init);
    s.start = new Float32Array(init);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(s.cur, 3));

    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);
    const alphas = new Float32Array(count);
    const rands = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const isStar = Math.random() < 0.08;
      sizes[i] = isStar ? (1.6 + Math.random() * 1.8) : (0.5 + Math.random() * 1.0);
      alphas[i] = isStar ? (0.2 + Math.random() * 0.35) : (0.06 + Math.random() * 0.14);
      rands[i] = Math.random();

      const t = Math.random();
      if (t < 0.38) {
        colors[i * 3] = 0.05; colors[i * 3 + 1] = 0.7 + Math.random() * 0.3; colors[i * 3 + 2] = 0.95;
      } else if (t < 0.6) {
        colors[i * 3] = 0.15; colors[i * 3 + 1] = 0.5 + Math.random() * 0.3; colors[i * 3 + 2] = 0.9;
      } else if (t < 0.78) {
        colors[i * 3] = 0.5 + Math.random() * 0.15; colors[i * 3 + 1] = 0.35 + Math.random() * 0.15; colors[i * 3 + 2] = 0.88;
      } else if (t < 0.92) {
        colors[i * 3] = 0.9; colors[i * 3 + 1] = 0.92; colors[i * 3 + 2] = 0.97;
      } else {
        colors[i * 3] = 0.8 + Math.random() * 0.2; colors[i * 3 + 1] = 0.3; colors[i * 3 + 2] = 0.75;
      }
    }

    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1));
    geo.setAttribute('aRand', new THREE.BufferAttribute(rands, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uDpr: { value: renderer.getPixelRatio() },
        uMouse3D: { value: new THREE.Vector3(100, 100, 100) },
        uMouseActive: { value: 0.0 },
      },
    });

    const pts = new THREE.Points(geo, mat);
    scene.add(pts);

    const isTouchDevice = 'ontouchstart' in window;
    s.mouseActive = !isTouchDevice;

    const onMouse = (e: MouseEvent) => {
      s.mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      s.mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
      s.mouseActive = true;
    };
    const onTouch = (e: TouchEvent) => {
      const touch = e.touches[0];
      if (touch) {
        s.mouse.x = (touch.clientX / window.innerWidth - 0.5) * 2;
        s.mouse.y = -(touch.clientY / window.innerHeight - 0.5) * 2;
        s.mouseActive = true;
      }
    };
    const onTouchEnd = () => { s.mouseActive = false; };
    const onResize = () => {
      cam.aspect = window.innerWidth / window.innerHeight;
      cam.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    const triggerMorph = () => {
      if (s.morphing) return;
      const next = (s.shapeIdx + 1) % SHAPES.length;
      s.start = new Float32Array(s.cur!);
      s.tgt = SHAPES[next].fn(s.count);
      s.shapeIdx = next;
      s.morphing = true;
      s.morphT = 0;
      onShapeChange?.(SHAPES[next].name);
    };

    window.addEventListener('mousemove', onMouse);
    window.addEventListener('touchmove', onTouch, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('resize', onResize);
    window.addEventListener('particle:morph', triggerMorph);

    const ndcVec = new THREE.Vector3();
    const dirVec = new THREE.Vector3();
    const clock = new THREE.Clock();
    s.lastSwap = 0;

    const loop = () => {
      if (s.dead) return;
      s.raf = requestAnimationFrame(loop);
      const t = clock.getElapsedTime();
      const dt = Math.min(clock.getDelta(), 0.05);

      // Auto-cycle
      if (!s.morphing && t - s.lastSwap > HOLD_TIME) {
        const next = (s.shapeIdx + 1) % SHAPES.length;
        s.start = new Float32Array(s.cur!);
        s.tgt = SHAPES[next].fn(count);
        s.shapeIdx = next;
        s.morphing = true;
        s.morphT = 0;
        onShapeChange?.(SHAPES[next].name);
      }

      if (s.morphing) {
        s.morphT += dt / MORPH_SPEED;
        if (s.morphT >= 1) { s.morphT = 1; s.morphing = false; s.lastSwap = t; }
        const ease = s.morphT < 0.5
          ? 4 * s.morphT * s.morphT * s.morphT
          : 1 - Math.pow(-2 * s.morphT + 2, 3) / 2;
        const pos = pts.geometry.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < count * 3; i++) {
          s.cur![i] = s.start![i] + (s.tgt![i] - s.start![i]) * ease;
        }
        pos.needsUpdate = true;
      }

      // Project mouse to z=0 plane
      ndcVec.set(s.mouse.x, s.mouse.y, 0.5).unproject(cam);
      dirVec.subVectors(ndcVec, cam.position).normalize();
      const rayT = -cam.position.z / dirVec.z;
      mat.uniforms.uMouse3D.value.set(
        cam.position.x + dirVec.x * rayT,
        cam.position.y + dirVec.y * rayT,
        0,
      );

      mat.uniforms.uTime.value = t;
      mat.uniforms.uMouseActive.value = s.mouseActive ? 1.0 : 0.0;

      // Camera follows mouse
      cam.position.x += (s.mouse.x * 3 - cam.position.x) * 0.02;
      cam.position.y += (s.mouse.y * 2 - cam.position.y) * 0.02;
      cam.position.z = 32;
      cam.lookAt(0, 0, 0);

      pts.rotation.y += 0.0015;
      pts.rotation.x = Math.sin(t * 0.12) * 0.08;
      pts.rotation.z = Math.cos(t * 0.08) * 0.04;

      renderer.render(scene, cam);
    };
    loop();

    return () => {
      s.dead = true;
      cancelAnimationFrame(s.raf);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('touchmove', onTouch);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('particle:morph', triggerMorph);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [onShapeChange]);

  return <div ref={boxRef} className="fixed inset-0 z-0" style={{ pointerEvents: 'none' }} />;
}
