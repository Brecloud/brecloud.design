import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { hexA } from '@/lib/color';

/* 电影取景器四角角标 */
export function CornerBrackets({
  color = 'rgba(255,255,255,0.35)',
  size = 16,
  thickness = 1.5,
  className = '',
}: {
  color?: string;
  size?: number;
  thickness?: number;
  className?: string;
}) {
  const base: CSSProperties = { position: 'absolute', width: size, height: size, pointerEvents: 'none' };
  return (
    <span className={className} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      <span style={{ ...base, top: 0, left: 0, borderTop: `${thickness}px solid ${color}`, borderLeft: `${thickness}px solid ${color}` }} />
      <span style={{ ...base, top: 0, right: 0, borderTop: `${thickness}px solid ${color}`, borderRight: `${thickness}px solid ${color}` }} />
      <span style={{ ...base, bottom: 0, left: 0, borderBottom: `${thickness}px solid ${color}`, borderLeft: `${thickness}px solid ${color}` }} />
      <span style={{ ...base, bottom: 0, right: 0, borderBottom: `${thickness}px solid ${color}`, borderRight: `${thickness}px solid ${color}` }} />
    </span>
  );
}

/* 十字准星 */
export function Crosshair({ color = 'rgba(255,255,255,0.25)', size = 10 }: { color?: string; size?: number }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: size, height: size, pointerEvents: 'none' }}>
      <span style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: color, transform: 'translateX(-50%)' }} />
      <span style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: color, transform: 'translateY(-50%)' }} />
    </span>
  );
}

/* REC 录制红点 */
export function RecDot({ color = '#ff3b30' }: { color?: string }) {
  return (
    <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.45)' }}>
      <span className="rec-dot inline-block rounded-full" style={{ width: 7, height: 7, background: color }} />
      REC
    </span>
  );
}

/* 背景呼吸光晕（保留备用，当前未启用） */
export function BreathingBackground({ color }: { color: string }) {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div
        className="breathe absolute rounded-full"
        style={{
          left: '50%', top: '44%', width: '130vmin', height: '130vmin',
          transform: 'translate(-50%,-50%)',
          background: `radial-gradient(circle, ${hexA(color, 0.09)} 0%, ${hexA(color, 0.03)} 45%, transparent 68%)`,
        }}
      />
    </div>
  );
}

type CursorMode = 'default' | 'green' | 'split';

/* 只有标记 data-cursor="split" 的元素才分裂四角；其余可交互元素仅变绿 */
const SPLIT_SEL = '[data-cursor="split"]';
const GREEN_SEL = 'a,button,img,canvas,input,textarea,[role="button"],[data-cursor="green"]';
const OUTSET = 9;       // 分裂角标与目标边框的外扩距离
const REST_GAP = 7;     // 常态四角离光标的半边长

/* 自定义光标：常态白方块（黑边）；普通可交互元素变绿；标记元素分裂四角框住内容 */
export function CursorFrame() {
  const dotRef = useRef<HTMLDivElement>(null);
  const cornerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const mouse = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0 });
  const cornerPos = useRef([
    { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 },
  ]);
  const rectRef = useRef<DOMRect | null>(null);
  const sizeRef = useRef(16);
  const modeRef = useRef<CursorMode>('default');
  const [mode, setMode] = useState<CursorMode>('default');

  useEffect(() => {
    if (!window.matchMedia('(pointer:fine)').matches) return;
    document.documentElement.classList.add('custom-cursor');

    const cx = mouse.current.x, cy = mouse.current.y;
    if (dotRef.current) dotRef.current.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
    cornerPos.current = [
      { x: cx, y: cy }, { x: cx, y: cy }, { x: cx, y: cy }, { x: cx, y: cy },
    ];

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px,${e.clientY}px) translate(-50%,-50%)`;
      }
      const t = (e.target as HTMLElement | null);
      const splitEl = t?.closest?.(SPLIT_SEL) as HTMLElement | null;
      let next: CursorMode;
      if (splitEl) {
        next = 'split';
        rectRef.current = splitEl.getBoundingClientRect();
      } else {
        rectRef.current = null;
        next = t?.closest?.(GREEN_SEL) ? 'green' : 'default';
      }
      if (next !== modeRef.current) {
        modeRef.current = next;
        setMode(next);
        if (next === 'split' && splitEl) {
          const r = splitEl.getBoundingClientRect();
          // 角标随目标短边缩放，保证两角不会重叠
          const size = Math.max(9, Math.min(26, Math.min(r.width, r.height) * 0.14));
          sizeRef.current = size;
          cornerRefs.current.forEach((el) => { if (el) { el.style.width = `${size}px`; el.style.height = `${size}px`; } });
        }
      }
    };

    window.addEventListener('mousemove', onMove);

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const m = mouse.current;
      const r = rectRef.current;
      let targets: { x: number; y: number }[];
      if (modeRef.current === 'split' && r) {
        targets = [
          { x: r.left - OUTSET, y: r.top - OUTSET },
          { x: r.right + OUTSET, y: r.top - OUTSET },
          { x: r.left - OUTSET, y: r.bottom + OUTSET },
          { x: r.right + OUTSET, y: r.bottom + OUTSET },
        ];
      } else {
        targets = [
          { x: m.x - REST_GAP, y: m.y - REST_GAP },
          { x: m.x + REST_GAP, y: m.y - REST_GAP },
          { x: m.x - REST_GAP, y: m.y + REST_GAP },
          { x: m.x + REST_GAP, y: m.y + REST_GAP },
        ];
      }
      const cs = sizeRef.current;
      const back = [[0, 0], [cs, 0], [0, cs], [cs, cs]];
      cornerRefs.current.forEach((el, i) => {
        if (!el) return;
        const cur = cornerPos.current[i];
        const k = modeRef.current === 'split' ? 0.3 : 0.55;
        cur.x += (targets[i].x - cur.x) * k;
        cur.y += (targets[i].y - cur.y) * k;
        el.style.transform = `translate(${cur.x - back[i][0]}px,${cur.y - back[i][1]}px)`;
      });
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      document.documentElement.classList.remove('custom-cursor');
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cf-dot-box" data-mode={mode} />
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          ref={(el) => { cornerRefs.current[i] = el; }}
          className={`cf-corner cf-c${i}`}
          data-mode={mode}
        />
      ))}
    </>
  );
}
