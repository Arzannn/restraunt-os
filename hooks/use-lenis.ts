'use client';
import Lenis from 'lenis';
import { useEffect } from 'react';
export function useLenis(): void { useEffect(() => { const lenis = new Lenis({ lerp: .08 }); let frame = 0; const raf = (time: number) => { lenis.raf(time); frame = requestAnimationFrame(raf); }; frame = requestAnimationFrame(raf); return () => { cancelAnimationFrame(frame); lenis.destroy(); }; }, []); }
