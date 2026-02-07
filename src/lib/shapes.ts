/**
 * Mathematical shape generators for particle morphing.
 * Each returns Float32Array of [x,y,z, x,y,z, ...] positions.
 */

export function sphere(n: number, r = 10): Float32Array<ArrayBuffer> {
  const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const th = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);
    const d = r * Math.cbrt(Math.random());
    p[i * 3] = d * Math.sin(ph) * Math.cos(th);
    p[i * 3 + 1] = d * Math.sin(ph) * Math.sin(th);
    p[i * 3 + 2] = d * Math.cos(ph);
  }
  return p;
}

export function galaxy(n: number, r = 12): Float32Array<ArrayBuffer> {
  const p = new Float32Array(n * 3);
  const arms = 3;
  for (let i = 0; i < n; i++) {
    const arm = i % arms;
    const offset = (arm / arms) * Math.PI * 2;
    const t = Math.random();
    const radius = t * r;
    const angle = t * Math.PI * 5 + offset;
    const spread = 0.4 * t;
    p[i * 3] = radius * Math.cos(angle) + (Math.random() - 0.5) * spread * r;
    p[i * 3 + 1] = (Math.random() - 0.5) * 0.6 * (1 - t * 0.7);
    p[i * 3 + 2] = radius * Math.sin(angle) + (Math.random() - 0.5) * spread * r;
  }
  return p;
}

export function lorenz(n: number, s = 0.35): Float32Array<ArrayBuffer> {
  const p = new Float32Array(n * 3);
  let x = 0.1, y = 0, z = 0;
  const sigma = 10, rho = 28, beta = 8 / 3, dt = 0.005;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < 4; j++) {
      x += sigma * (y - x) * dt;
      y += (x * (rho - z) - y) * dt;
      z += (x * y - beta * z) * dt;
    }
    p[i * 3] = x * s;
    p[i * 3 + 1] = y * s - 2;
    p[i * 3 + 2] = (z - 25) * s;
  }
  return p;
}

export function heart(n: number, s = 0.55): Float32Array<ArrayBuffer> {
  const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2;
    const jitter = 0.85 + Math.random() * 0.3;
    p[i * 3] = 16 * Math.pow(Math.sin(t), 3) * s * jitter;
    p[i * 3 + 1] = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * s * jitter;
    p[i * 3 + 2] = (Math.random() - 0.5) * 3 * s;
  }
  return p;
}

export function torus(n: number, R = 6, r = 2.2): Float32Array<ArrayBuffer> {
  const p = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const u = Math.random() * Math.PI * 2;
    const v = Math.random() * Math.PI * 2;
    p[i * 3] = (R + r * Math.cos(v)) * Math.cos(u);
    p[i * 3 + 1] = r * Math.sin(v);
    p[i * 3 + 2] = (R + r * Math.cos(v)) * Math.sin(u);
  }
  return p;
}

export function menger(n: number, s = 9): Float32Array<ArrayBuffer> {
  const p = new Float32Array(n * 3);
  const check = (x: number, y: number, z: number): boolean => {
    for (let i = 0; i < 3; i++) {
      const cx = Math.floor(x * 3), cy = Math.floor(y * 3), cz = Math.floor(z * 3);
      if ((cx === 1 ? 1 : 0) + (cy === 1 ? 1 : 0) + (cz === 1 ? 1 : 0) >= 2) return false;
      x = x * 3 - cx; y = y * 3 - cy; z = z * 3 - cz;
    }
    return true;
  };
  let placed = 0;
  while (placed < n) {
    const x = Math.random(), y = Math.random(), z = Math.random();
    if (check(x, y, z)) {
      p[placed * 3] = (x - 0.5) * s;
      p[placed * 3 + 1] = (y - 0.5) * s;
      p[placed * 3 + 2] = (z - 0.5) * s;
      placed++;
    }
  }
  return p;
}

export function penrose(n: number, s = 7): Float32Array<ArrayBuffer> {
  const p = new Float32Array(n * 3);
  const verts = [[0, s * 0.85, 0], [-s * 0.75, -s * 0.42, 0], [s * 0.75, -s * 0.42, 0]];
  const thick = 0.7;
  for (let i = 0; i < n; i++) {
    const e = i % 3;
    const t = Math.random();
    const [x1, y1] = verts[e], [x2, y2] = verts[(e + 1) % 3];
    p[i * 3] = x1 + (x2 - x1) * t + (Math.random() - 0.5) * thick;
    p[i * 3 + 1] = y1 + (y2 - y1) * t + (Math.random() - 0.5) * thick;
    p[i * 3 + 2] = (Math.random() - 0.5) * thick + (e - 1) * 0.4;
  }
  return p;
}

export function fractalTree(n: number, s = 7): Float32Array<ArrayBuffer> {
  const p = new Float32Array(n * 3);
  const pts: [number, number, number, number][] = [];
  const grow = (x: number, y: number, z: number, a: number, l: number, d: number) => {
    if (d > 8 || l < 0.08) return;
    const ex = x + Math.cos(a) * l, ey = y + Math.sin(a) * l;
    const ez = z + (Math.random() - 0.5) * l * 0.25;
    pts.push([ex, ey, ez, d]);
    grow(ex, ey, ez, a + 0.45 + Math.random() * 0.15, l * 0.68, d + 1);
    grow(ex, ey, ez, a - 0.45 - Math.random() * 0.15, l * 0.68, d + 1);
  };
  grow(0, -s, 0, Math.PI / 2, s * 0.38, 0);
  for (let i = 0; i < n; i++) {
    const b = pts[i % pts.length];
    const spread = 0.08 * (b[3] + 1);
    p[i * 3] = b[0] + (Math.random() - 0.5) * spread;
    p[i * 3 + 1] = b[1] + (Math.random() - 0.5) * spread;
    p[i * 3 + 2] = b[2] + (Math.random() - 0.5) * spread;
  }
  return p;
}

export const SHAPES = [
  { name: 'Cosmos', fn: sphere },
  { name: 'Galaxy Spiral', fn: galaxy },
  { name: 'Lorenz Attractor', fn: lorenz },
  { name: 'Cardioid Heart', fn: heart },
  { name: 'Mobius Torus', fn: torus },
  { name: 'Menger Sponge', fn: menger },
  { name: 'Penrose Triangle', fn: penrose },
  { name: 'Fractal Tree', fn: fractalTree },
] as const;
