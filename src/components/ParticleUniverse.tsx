'use client';

import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { SHAPES } from '@/lib/shapes';

const COUNT = 3500;
const MORPH_SPEED = 2.5;
const HOLD_TIME = 8;

const VERT = `
attribute float aSize;
attribute vec3 aColor;
attribute float aAlpha;
attribute float aRand;
uniform float uTime;
uniform float uBass;
uniform float uMid;
uniform float uHigh;
uniform float uDpr;
varying vec3 vCol;
varying float vA;
void main(){
  vCol=aColor; vA=aAlpha;
  vec3 pos=position;
  float w=sin(uTime*0.5+aRand*6.28)*0.15*(1.0+uMid*2.0);
  float w2=cos(uTime*0.3+aRand*3.14)*0.1*(1.0+uHigh*2.0);
  pos.x+=w; pos.y+=w2; pos.z+=sin(uTime*0.4+aRand*4.0)*0.1;
  pos*=1.0+uBass*0.3;
  vec4 mv=modelViewMatrix*vec4(pos,1.0);
  float sm=1.0+uHigh*1.5+sin(uTime+aRand*10.0)*0.2;
  gl_PointSize=aSize*sm*uDpr*(200.0/-mv.z);
  gl_Position=projectionMatrix*mv;
}`;

const FRAG = `
varying vec3 vCol;
varying float vA;
void main(){
  float d=length(gl_PointCoord-vec2(0.5));
  if(d>0.5)discard;
  float g=pow(1.0-smoothstep(0.0,0.5,d),1.5);
  float c=1.0-smoothstep(0.0,0.15,d);
  gl_FragColor=vec4(vCol+c*0.5,vA*g);
}`;

interface Props {
  onShapeChange?: (name: string) => void;
  audioEnabled?: boolean;
}

export default function ParticleUniverse({ onShapeChange, audioEnabled = false }: Props) {
  const boxRef = useRef<HTMLDivElement>(null);
  const state = useRef({
    renderer: null as THREE.WebGLRenderer | null,
    scene: null as THREE.Scene | null,
    camera: null as THREE.PerspectiveCamera | null,
    points: null as THREE.Points | null,
    mat: null as THREE.ShaderMaterial | null,
    cur: new Float32Array(COUNT * 3),
    tgt: new Float32Array(COUNT * 3),
    start: new Float32Array(COUNT * 3),
    shapeIdx: 0,
    morphT: 1,
    morphing: false,
    lastSwap: 0,
    mouse: { x: 0, y: 0 },
    raf: 0,
    ctx: null as AudioContext | null,
    analyser: null as AnalyserNode | null,
    freqData: new Uint8Array(64) as Uint8Array<ArrayBuffer>,
    audioOn: false,
    dead: false,
  });

  const bootAudio = useCallback(() => {
    const s = state.current;
    if (s.ctx || !audioEnabled) return;
    try {
      const ctx = new AudioContext();
      const an = ctx.createAnalyser();
      an.fftSize = 128;
      an.smoothingTimeConstant = 0.8;
      const makeOsc = (f: number, t: OscillatorType, g: number) => {
        const o = ctx.createOscillator();
        const gn = ctx.createGain();
        const lfo = ctx.createOscillator();
        const lg = ctx.createGain();
        o.type = t; o.frequency.value = f;
        lfo.type = 'sine'; lfo.frequency.value = 0.08 + Math.random() * 0.15;
        lg.gain.value = g * 0.3;
        lfo.connect(lg); lg.connect(gn.gain);
        gn.gain.value = g; o.connect(gn); gn.connect(an); an.connect(ctx.destination);
        o.start(); lfo.start();
      };
      makeOsc(65, 'sine', 0.035);
      makeOsc(130, 'sine', 0.02);
      makeOsc(195, 'triangle', 0.012);
      makeOsc(260, 'sine', 0.008);
      s.ctx = ctx; s.analyser = an;
      s.freqData = new Uint8Array(an.frequencyBinCount) as Uint8Array<ArrayBuffer>;
      s.audioOn = true;
    } catch { /* silent */ }
  }, [audioEnabled]);

  useEffect(() => {
    if (audioEnabled) bootAudio();
    else {
      const s = state.current;
      if (s.ctx) { s.ctx.close(); s.ctx = null; s.analyser = null; s.audioOn = false; }
    }
  }, [audioEnabled, bootAudio]);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const s = state.current;
    s.dead = false;

    // WebGL check
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
    cam.position.z = 30;
    s.scene = scene; s.camera = cam;

    // Init particles
    const init = SHAPES[0].fn(COUNT);
    s.cur = new Float32Array(init);
    s.tgt = new Float32Array(init);
    s.start = new Float32Array(init);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(s.cur, 3));

    const sizes = new Float32Array(COUNT);
    const colors = new Float32Array(COUNT * 3);
    const alphas = new Float32Array(COUNT);
    const rands = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      sizes[i] = 0.8 + Math.random() * 1.8;
      alphas[i] = 0.12 + Math.random() * 0.35;
      rands[i] = Math.random();
      // Unified cool cyan-blue palette only
      const t = Math.random();
      if (t < 0.5) { colors[i*3]=0.0; colors[i*3+1]=0.6+Math.random()*0.3; colors[i*3+2]=0.8+Math.random()*0.2; }
      else if (t < 0.8) { colors[i*3]=0.15+Math.random()*0.15; colors[i*3+1]=0.45+Math.random()*0.2; colors[i*3+2]=0.85+Math.random()*0.15; }
      else { colors[i*3]=0.55+Math.random()*0.15; colors[i*3+1]=0.7+Math.random()*0.15; colors[i*3+2]=0.85+Math.random()*0.15; }
    }
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1));
    geo.setAttribute('aRand', new THREE.BufferAttribute(rands, 1));

    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT, fragmentShader: FRAG,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 }, uBass: { value: 0 }, uMid: { value: 0 }, uHigh: { value: 0 },
        uDpr: { value: renderer.getPixelRatio() },
      },
    });
    s.mat = mat;
    const pts = new THREE.Points(geo, mat);
    scene.add(pts); s.points = pts;

    const onMouse = (e: MouseEvent) => {
      s.mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      s.mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onResize = () => {
      cam.aspect = window.innerWidth / window.innerHeight;
      cam.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('mousemove', onMouse);
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    s.lastSwap = 0;

    const loop = () => {
      if (s.dead) return;
      s.raf = requestAnimationFrame(loop);
      const t = clock.getElapsedTime();
      const dt = Math.min(clock.getDelta(), 0.05);

      // Audio
      let bass = 0, mid = 0, high = 0;
      if (s.analyser && s.audioOn) {
        s.analyser.getByteFrequencyData(s.freqData);
        const len = s.freqData.length, third = Math.floor(len / 3);
        for (let i = 0; i < third; i++) bass += s.freqData[i];
        for (let i = third; i < third * 2; i++) mid += s.freqData[i];
        for (let i = third * 2; i < len; i++) high += s.freqData[i];
        bass /= third * 255; mid /= third * 255; high /= (len - third * 2) * 255;
      }

      // Shape auto-cycle
      if (!s.morphing && t - s.lastSwap > HOLD_TIME) {
        const next = (s.shapeIdx + 1) % SHAPES.length;
        s.start = new Float32Array(s.cur);
        s.tgt = SHAPES[next].fn(COUNT);
        s.shapeIdx = next; s.morphing = true; s.morphT = 0;
        onShapeChange?.(SHAPES[next].name);
      }

      if (s.morphing) {
        s.morphT += dt / MORPH_SPEED;
        if (s.morphT >= 1) { s.morphT = 1; s.morphing = false; s.lastSwap = t; }
        const e = s.morphT < 0.5
          ? 4 * s.morphT * s.morphT * s.morphT
          : 1 - Math.pow(-2 * s.morphT + 2, 3) / 2;
        const pos = s.points!.geometry.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < COUNT * 3; i++) s.cur[i] = s.start[i] + (s.tgt[i] - s.start[i]) * e;
        pos.needsUpdate = true;
      }

      mat.uniforms.uTime.value = t;
      mat.uniforms.uBass.value += (bass - mat.uniforms.uBass.value) * 0.1;
      mat.uniforms.uMid.value += (mid - mat.uniforms.uMid.value) * 0.1;
      mat.uniforms.uHigh.value += (high - mat.uniforms.uHigh.value) * 0.1;

      cam.position.x += (s.mouse.x * 2 - cam.position.x) * 0.02;
      cam.position.y += (s.mouse.y * 1.5 - cam.position.y) * 0.02;
      cam.lookAt(0, 0, 0);

      if (s.points) { s.points.rotation.y += 0.0012; s.points.rotation.x = Math.sin(t * 0.1) * 0.08; }
      renderer.render(scene, cam);
    };
    loop();

    return () => {
      s.dead = true;
      cancelAnimationFrame(s.raf);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      geo.dispose(); mat.dispose(); renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [onShapeChange]);

  return <div ref={boxRef} className="fixed inset-0 z-0" style={{ pointerEvents: 'none' }} />;
}
