import type { Variants } from 'framer-motion';
export const fadeUp: Variants = { hidden:{opacity:0,y:24}, visible:{opacity:1,y:0,transition:{duration:.7,ease:[.22,1,.36,1]}} };
export const stagger: Variants = { hidden:{}, visible:{transition:{staggerChildren:.12}} };
export const pageTransition = { duration:.8, ease:'power3.out' } as const;
