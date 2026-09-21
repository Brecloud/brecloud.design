import { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

interface DiceCubeProps {
  onFaceClick: (index: number) => void;
}

const FACES = [
  { color: '#7FB069', label: 'XIAO' },
  { color: '#e63946', label: 'AVA' },
  { color: '#e8833a', label: 'NOOK' },
  { color: '#E32B00', label: 'TOMO' },
  { color: '#555555', label: 'OTHER' },
  { color: '#B2F2BB', label: 'ABOUT' },
];

function makeFaceTexture(color: string, label: string, isDark: boolean): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 512, 512);
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)';
  ctx.lineWidth = 4;
  ctx.strokeRect(24, 24, 464, 464);
  ctx.fillStyle = isDark ? '#ffffff' : '#0a0a0a';
  ctx.font = '600 72px Gilroy, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, 256, 256);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export default function DiceCube({ onFaceClick }: DiceCubeProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const velocity = useRef({ x: 0, y: 0.003 });
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const moved = useRef(0);
  const onFaceClickRef = useRef(onFaceClick);

  useEffect(() => { onFaceClickRef.current = onFaceClick; }, [onFaceClick]);

  const onPointerDown = useCallback((e: PointerEvent) => {
    dragging.current = true;
    moved.current = 0;
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onPointerMove = useCallback((e: PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    moved.current += Math.abs(dx) + Math.abs(dy);
    lastPos.current = { x: e.clientX, y: e.clientY };
    const el = mountRef.current;
    if (!el) return;
    const mesh = (el as any)._cube as THREE.Mesh | undefined;
    if (mesh) {
      mesh.rotation.y += dx * 0.01;
      mesh.rotation.x += dy * 0.01;
      velocity.current = { x: dy * 0.01, y: dx * 0.01 };
    }
  }, []);

  const onPointerUp = useCallback(() => { dragging.current = false; }, []);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const size = () => {
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
    };
    size();
    window.addEventListener('resize', size);

    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(5, 5, 5);
    scene.add(dir);

    const geo = new RoundedBoxGeometry(2, 2, 2, 4, 0.12);
    const materials = FACES.map((f) => {
      const isDark = ['#e63946', '#e8833a', '#E32B00'].includes(f.color);
      return new THREE.MeshBasicMaterial({ map: makeFaceTexture(f.color, f.label, isDark) });
    });
    const cube = new THREE.Mesh(geo, materials);
    (mount as any)._cube = cube;
    scene.add(cube);

    cube.rotation.x = 0.3;
    cube.rotation.y = 0.5;

    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (!dragging.current) {
        cube.rotation.y += velocity.current.y;
        cube.rotation.x += velocity.current.x;
        velocity.current.x *= 0.96;
        velocity.current.y *= 0.96;
        if (Math.abs(velocity.current.y) < 0.001) velocity.current.y = 0.002;
      }
      renderer.render(scene, camera);
    };
    animate();

    mount.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // raycaster：点击命中哪个面就跳哪个项目
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const onClick = (e: MouseEvent) => {
      if (moved.current >= 5) return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObject(cube);
      if (hits.length > 0 && hits[0].face) {
        onFaceClickRef.current(hits[0].face.materialIndex ?? 0);
      }
    };
    renderer.domElement.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', size);
      mount.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('click', onClick);
      geo.dispose();
      materials.forEach((m) => { m.map?.dispose(); m.dispose(); });
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
      delete (mount as any)._cube;
    };
  }, [onPointerDown, onPointerMove, onPointerUp]);

  return (
    <div ref={mountRef}
      className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
      aria-label="3D 项目骰子，拖拽旋转，点击进入" />
  );
}
