import { useState, useEffect, useRef, useCallback } from 'react';
import { SECTIONS, PROJECTS, OTHER_PAGES, AI_PAGE } from '@/data/projects';
import DiceCube from '@/components/DiceCube';
import AboutContent from '@/components/AboutContent';
import { CursorFrame, CornerBrackets, RecDot, Crosshair } from '@/components/Viewfinder';
import { hexA } from '@/lib/color';

interface IRect { x: number; y: number; w: number; h: number; }
interface IZoom { src: string; origin: IRect; }

export default function HomePage() {
  const [section, setSection] = useState(0);
  const [projPages, setProjPages] = useState<Record<string, number>>({});
  const [zoom, setZoom] = useState<IZoom | null>(null);
  const [zoomPhase, setZoomPhase] = useState<'from' | 'to' | 'back'>('from');
  const wheelLock = useRef(false);
  const aboutScrollRef = useRef<HTMLDivElement>(null);
  const current = SECTIONS[section];

  const setPage = (pid: string, p: number) =>
    setProjPages((prev) => ({ ...prev, [pid]: p }));

  /* FLIP 放大/缩小 */
  const openZoom = useCallback((src: string, rect: IRect) => {
    setZoom({ src, origin: rect });
    setZoomPhase('from');
    requestAnimationFrame(() => requestAnimationFrame(() => setZoomPhase('to')));
  }, []);
  const closeZoom = useCallback(() => {
    setZoomPhase('back');
    setTimeout(() => { setZoom(null); setZoomPhase('from'); }, 400);
  }, []);

  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (wheelLock.current) return;
      if (zoom) { closeZoom(); return; }

      if (current.type === 'about') {
        const el = aboutScrollRef.current;
        if (el) {
          const atTop = el.scrollTop <= 0;
          const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
          if (e.deltaY < 0 && !atTop) return;
          if (e.deltaY > 0 && !atBottom) return;
        }
        if (e.deltaY < 0) { setSection((s) => Math.max(s - 1, 0)); wheelLock.current = true; setTimeout(() => (wheelLock.current = false), 700); }
        return;
      }

      if (current.type === 'project' && current.projectId) {
        const proj = PROJECTS.find((p) => p.id === current.projectId)!;
        const pg = projPages[current.projectId] ?? 0;
        const canNext = pg < proj.pages.length - 1;
        const canPrev = pg > 0;
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
          if (e.deltaX > 0 && canNext) { setPage(current.projectId, pg + 1); return; }
          if (e.deltaX < 0 && canPrev) { setPage(current.projectId, pg - 1); return; }
        }
        if (e.deltaY > 0 && !canNext) { setSection((s) => Math.min(s + 1, SECTIONS.length - 1)); wheelLock.current = true; setTimeout(() => (wheelLock.current = false), 700); return; }
        if (e.deltaY < 0 && !canPrev) { setSection((s) => Math.max(s - 1, 0)); wheelLock.current = true; setTimeout(() => (wheelLock.current = false), 700); return; }
        if (e.deltaY > 0 && canNext) { setPage(current.projectId, pg + 1); return; }
        if (e.deltaY < 0 && canPrev) { setPage(current.projectId, pg - 1); return; }
        return;
      }
      if (Math.abs(e.deltaY) < 10) return;
      wheelLock.current = true;
      if (e.deltaY > 0) setSection((s) => Math.min(s + 1, SECTIONS.length - 1));
      else setSection((s) => Math.max(s - 1, 0));
      setTimeout(() => (wheelLock.current = false), 700);
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [section, current, projPages, zoom, closeZoom]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (zoom) { if (e.key === 'Escape') closeZoom(); return; }
      const next = () => {
        if (current.type === 'project' && current.projectId) {
          const proj = PROJECTS.find((p) => p.id === current.projectId)!;
          const pg = projPages[current.projectId] ?? 0;
          if (pg < proj.pages.length - 1) setPage(current.projectId, pg + 1);
          else setSection((s) => Math.min(s + 1, SECTIONS.length - 1));
        } else setSection((s) => Math.min(s + 1, SECTIONS.length - 1));
      };
      const prev = () => {
        if (current.type === 'project' && current.projectId) {
          const pg = projPages[current.projectId] ?? 0;
          if (pg > 0) setPage(current.projectId, pg - 1);
          else setSection((s) => Math.max(s - 1, 0));
        } else setSection((s) => Math.max(s - 1, 0));
      };
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next();
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [section, current, projPages, zoom, closeZoom]);

  const goSection = useCallback((i: number) => setSection(i), []);
  const handleDiceFace = useCallback((face: number) => goSection(face + 1), [goSection]);

  const accentColor = current.type === 'project' && current.projectId
    ? PROJECTS.find((p) => p.id === current.projectId)!.color
    : '#B2F2BB';

  const proj = current.type === 'project' && current.projectId
    ? PROJECTS.find((p) => p.id === current.projectId)!
    : null;
  const curPage = proj ? (projPages[proj.id] ?? 0) : 0;
  const progress = proj ? (curPage + 1) / proj.pages.length : 0;

  // 大图目标框（视口居中）
  const target: IRect = {
    x: typeof window !== 'undefined' ? window.innerWidth * 0.08 : 0,
    y: typeof window !== 'undefined' ? window.innerHeight * 0.08 : 0,
    w: typeof window !== 'undefined' ? window.innerWidth * 0.84 : 0,
    h: typeof window !== 'undefined' ? window.innerHeight * 0.84 : 0,
  };
  const box = zoom ? (zoomPhase === 'to' ? target : zoom.origin) : target;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#0a0a0a] text-[#e8e8e8]">
      <CursorFrame />

      {/* 左侧竖向指示器 */}
      <nav className="fixed left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {SECTIONS.map((s, i) => (
          <button key={s.id} onClick={() => goSection(i)} className="group flex items-center gap-2" aria-label={s.label}>
            <span className="block transition-all duration-500" style={{ width: i === section ? 24 : 8, height: 2, background: i === section ? accentColor : '#333' }} />
            <span className="opacity-0 group-hover:opacity-60 transition-opacity text-[10px] font-mono tracking-widest text-white">{s.en}</span>
          </button>
        ))}
      </nav>

      <div className="relative z-10 h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.6,0.05,0.01,0.9)]" style={{ transform: `translateY(-${section * 100}%)` }}>
        {SECTIONS.map((s, idx) => (
          <section key={s.id} className="h-screen w-full relative">
            {idx === 0 && <HomeHero onDice={handleDiceFace} />}
            {s.type === 'project' && s.projectId && (
              <ProjectView project={PROJECTS.find((p) => p.id === s.projectId)!} page={projPages[s.projectId] ?? 0} />
            )}
            {s.type === 'other' && <OtherView onZoom={openZoom} />}
            {s.type === 'about' && (
              <div ref={aboutScrollRef} className="h-full overflow-y-auto">
                <AboutContent />
              </div>
            )}
          </section>
        ))}
      </div>

      {proj && (
        <div className="fixed bottom-0 left-0 right-0 z-50 h-[4.5px] bg-[#1a1a1a]">
          <div className="h-full transition-all duration-500" style={{ width: `${progress * 100}%`, background: proj.color }} />
        </div>
      )}

      {/* Other 大图 FLIP 形变 */}
      {zoom && (
        <div className="fixed inset-0 z-[100]" data-cursor="green" onClick={closeZoom}>
          <div className="absolute inset-0 bg-black/92 transition-opacity duration-[400ms]" style={{ opacity: zoomPhase === 'from' ? 0 : 1 }} />
          <div
            className="fixed"
            style={{
              left: box.x, top: box.y, width: box.w, height: box.h,
              transition: 'left .4s cubic-bezier(0.6,0.05,0.01,0.9),top .4s cubic-bezier(0.6,0.05,0.01,0.9),width .4s cubic-bezier(0.6,0.05,0.01,0.9),height .4s cubic-bezier(0.6,0.05,0.01,0.9)',
            }}
            onClick={closeZoom}
          >
            <img src={zoom.src} className="w-full h-full object-contain cursor-zoom-out" alt="放大查看" />
            <CornerBrackets color="#B2F2BB" size={22} />
          </div>
          <span className="fixed bottom-8 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.3em] text-[#555] pointer-events-none">CLICK OR ESC TO CLOSE</span>
        </div>
      )}
    </div>
  );
}

function HomeHero({ onDice }: { onDice: (face: number) => void }) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center relative z-10">
      <div className="mb-8 h-4"><RecDot /></div>
      <div className="relative p-6">
        <div className="w-[260px] h-[260px] md:w-[340px] md:h-[340px]">
          <DiceCube onFaceClick={onDice} />
        </div>
        <CornerBrackets color="rgba(255,255,255,0.28)" size={26} />
        {/* 四角外侧十字准星 */}
        <span className="absolute -top-1 -left-1 -translate-x-1/2 -translate-y-1/2"><Crosshair color="rgba(255,255,255,0.3)" /></span>
        <span className="absolute -top-1 -right-1 translate-x-1/2 -translate-y-1/2"><Crosshair color="rgba(255,255,255,0.3)" /></span>
        <span className="absolute -bottom-1 -left-1 -translate-x-1/2 translate-y-1/2"><Crosshair color="rgba(255,255,255,0.3)" /></span>
        <span className="absolute -bottom-1 -right-1 translate-x-1/2 translate-y-1/2"><Crosshair color="rgba(255,255,255,0.3)" /></span>
      </div>
      <div className="mt-8 font-mono text-[11px] tracking-[0.25em] text-[#666]"><BeijingClock /></div>
    </div>
  );
}

/* 实时北京时间（UTC+8），精确到秒，无中文 */
function BeijingClock() {
  const [label, setLabel] = useState('');
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Shanghai', hour12: false,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
    const tick = () => {
      const p = fmt.formatToParts(new Date());
      const g = (t: string) => p.find((x) => x.type === t)?.value ?? '';
      setLabel(`BEIJING ${g('year')}.${g('month')}.${g('day')}  ${g('hour')}:${g('minute')}:${g('second')}`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return <span>{label}</span>;
}

function ProjectView({ project, page }: { project: typeof PROJECTS[0]; page: number }) {
  return (
    <div className="h-full w-full flex items-center gap-8 md:gap-16 px-20 md:px-28 relative z-10">
      <div className="w-64 md:w-72 shrink-0 z-10">
        <div className="text-[11px] font-mono tracking-widest" style={{ color: project.color }}>
          PROJ.{String(PROJECTS.indexOf(project) + 1).padStart(2, '0')}
        </div>
        <h2 className="mt-3 text-3xl md:text-4xl font-bold">{project.name}</h2>
        <p className="mt-1 text-sm text-[#777]">{project.title}</p>
        <p className="mt-4 text-xs text-[#999] leading-relaxed">{project.description}</p>
        <p className="mt-4 text-[10px] font-mono text-[#555]">{project.role}</p>
      </div>
      <div className="flex-1 relative h-[70vh]">
        <div className="h-full overflow-hidden">
          <div className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.6,0.05,0.01,0.9)]"
            style={{ transform: `translateX(-${page * 100}%)` }}>
            {project.pages.map((p, i) => (
              <div key={i} className="w-full h-full shrink-0 flex items-center justify-center">
                <img src={p} className="max-w-full max-h-full object-contain rounded-sm" alt={`${project.name} page ${i + 1}`} />
              </div>
            ))}
          </div>
        </div>
        <CornerBrackets color={hexA(project.color, 0.55)} size={18} />
      </div>
    </div>
  );
}

function OtherView({ onZoom }: { onZoom: (src: string, rect: IRect) => void }) {
  const pages = [...OTHER_PAGES, AI_PAGE];
  return (
    <div className="h-full w-full flex items-center gap-8 md:gap-16 px-20 md:px-28 relative z-10">
      <div className="w-64 md:w-72 shrink-0 z-10">
        <div className="text-[11px] font-mono tracking-widest text-[#B2F2BB]">OTHER</div>
        <h2 className="mt-3 text-3xl md:text-4xl font-bold">更多作品</h2>
        <p className="mt-4 text-xs text-[#999] leading-relaxed">工业设计 · 文创 · 导视 · 平面 · AI Practice</p>
        <p className="mt-4 text-[10px] font-mono text-[#555]">CLICK TO ZOOM</p>
      </div>
      <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
        {pages.map((p, i) => (
          <button
            key={i}
            aria-label={`放大查看作品 ${i + 1}`}
            data-cursor="split"
            onClick={(e) => { const r = (e.currentTarget as HTMLElement).getBoundingClientRect(); onZoom(p, { x: r.left, y: r.top, w: r.width, h: r.height }); }}
            className="relative group w-full aspect-video overflow-hidden rounded-sm"
          >
            <img src={p} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={`Other work ${i + 1}`} />
            <CornerBrackets color="rgba(178,242,187,0.45)" size={14} />
          </button>
        ))}
      </div>
    </div>
  );
}
