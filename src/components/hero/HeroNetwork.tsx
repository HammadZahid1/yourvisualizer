import { useEffect, useRef } from 'react';
import './HeroNetwork.css';

interface HeroNode {
  word: string;
  x: number;
  y: number;
  z: number;
  phase: number;
  color: 'cyan' | 'violet' | 'blue';
  size: number;
}

interface HeroLink {
  a: number;
  b: number;
}

const WORDS = [
  'language',
  'pattern',
  'signal',
  'memory',
  'context',
  'structure',
  'network',
  'meaning',
  'frequency',
  'cluster',
  'thought',
  'relation',
  'vector',
  'phrase',
  'context',
];

/** Decorative, deterministic hero network rendered on Canvas 2D. */
export function HeroNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let nodes: HeroNode[] = [];
    let links: HeroLink[] = [];
    let motes: { x: number; y: number; r: number; a: number; s: number }[] = [];

    const palette = {
      cyan: '72, 221, 245',
      violet: '154, 123, 255',
      blue: '91, 140, 255',
    };

    const build = () => {
      // Seeded pseudo-random so the hero composition is stable across resizes.
      let seed = 20260218;
      const rand = () => {
        seed = (seed * 1664525 + 1013904223) % 4294967296;
        return seed / 4294967296;
      };

      nodes = WORDS.map((word, index) => {
        const angle = (index / WORDS.length) * Math.PI * 2 + rand() * 0.5;
        const radius = 0.18 + rand() * 0.3;
        return {
          word,
          x: 0.5 + Math.cos(angle) * radius * (width > height ? 1 : 0.85),
          y: 0.5 + Math.sin(angle) * radius * (width > height ? 0.86 : 1),
          z: 0.45 + rand() * 0.55,
          phase: rand() * Math.PI * 2,
          color: (['cyan', 'violet', 'blue'] as const)[index % 3] ?? 'cyan',
          size: 0.8 + rand() * 0.9,
        };
      });

      links = [];
      for (let i = 0; i < nodes.length; i += 1) {
        for (let j = i + 1; j < nodes.length; j += 1) {
          if (rand() > 0.7) links.push({ a: i, b: j });
        }
      }

      motes = Array.from({ length: 46 }, () => ({
        x: rand(),
        y: rand(),
        r: 0.5 + rand() * 1.3,
        a: 0.12 + rand() * 0.35,
        s: 0.2 + rand() * 0.7,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);
      const t = reduced ? 0 : time * 0.00016;

      for (const mote of motes) {
        const mx = (mote.x + (reduced ? 0 : t * mote.s * 0.06)) % 1;
        ctx.beginPath();
        ctx.arc(mx * width, mote.y * height, mote.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 210, 230, ${mote.a * 0.5})`;
        ctx.fill();
      }

      const positions = nodes.map((node) => {
        const drift = reduced ? 0 : Math.sin(t * 2.2 + node.phase) * 0.018;
        const driftY = reduced ? 0 : Math.cos(t * 1.7 + node.phase) * 0.02;
        const scale = 0.7 + node.z * 0.5;
        return {
          x: (node.x + drift) * width,
          y: (node.y + driftY) * height,
          scale,
        };
      });

      for (const link of links) {
        const a = positions[link.a];
        const b = positions[link.b];
        if (!a || !b) continue;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = 'rgba(120, 170, 210, 0.16)';
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      nodes.forEach((node, index) => {
        const pos = positions[index];
        if (!pos) return;
        const color = palette[node.color];
        const glow = 12 + node.z * 16;

        const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, glow);
        gradient.addColorStop(0, `rgba(${color}, 0.26)`);
        gradient.addColorStop(1, `rgba(${color}, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, glow, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 2.4 * node.size * pos.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, 0.95)`;
        ctx.fill();

        if (width > 520) {
          ctx.font = `${Math.round(10 * pos.scale)}px "IBM Plex Mono", monospace`;
          ctx.textAlign = 'center';
          ctx.fillStyle = `rgba(220, 232, 242, ${0.5 + node.z * 0.32})`;
          ctx.fillText(node.word, pos.x, pos.y - 11 * pos.scale);
        }
      });

      if (!reduced) frame = requestAnimationFrame(draw);
    };

    resize();
    frame = requestAnimationFrame(draw);
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-network" aria-hidden="true" />;
}
