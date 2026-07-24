import { create } from 'zustand';
import type { BuilderBlock, BuilderPage } from '@/types/database';

type BuilderState = {
  page: BuilderPage;
  selectedBlockId: string | null;
  past: BuilderPage[];
  future: BuilderPage[];
  setSelectedBlockId: (id: string | null) => void;
  updateBlock: (id: string, patch: Partial<BuilderBlock>) => void;
  moveBlock: (id: string, direction: -1 | 1) => void;
  addBlock: (type: BuilderBlock['type']) => void;
  undo: () => void;
  redo: () => void;
};

const initialPage: BuilderPage = {
  id: '20000000-0000-4000-8000-000000000001',
  restaurant_id: '00000000-0000-4000-8000-000000000001',
  slug: 'home',
  title: 'Homepage',
  status: 'draft',
  created_at: '',
  updated_at: '',
  blocks: [
    { id: 'block-hero', type: 'section', parent_id: null, sort_order: 0, content: 'An unforgettable private dining experience.', image_url: null, href: null, styles: { height: 420, align: 'center', tone: 'glass' } },
    { id: 'block-title', type: 'heading', parent_id: null, sort_order: 1, content: 'Michelin-level hospitality, composed visually.', image_url: null, href: null, styles: { align: 'center' } },
    { id: 'block-copy', type: 'paragraph', parent_id: null, sort_order: 2, content: 'Drag, edit, resize, preview, autosave, and restore every page without leaving RestaurantOS X.', image_url: null, href: null, styles: { align: 'center' } },
    { id: 'block-image', type: 'image', parent_id: null, sort_order: 3, content: 'Chef plating signature dish', image_url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0', href: null, styles: { height: 320 } },
  ],
};

function snapshot(state: BuilderState, page: BuilderPage): Pick<BuilderState, 'page' | 'past' | 'future'> {
  return { page, past: [state.page, ...state.past].slice(0, 30), future: [] };
}

export const useBuilderStore = create<BuilderState>((set) => ({
  page: initialPage,
  selectedBlockId: initialPage.blocks[0].id,
  past: [],
  future: [],
  setSelectedBlockId: (selectedBlockId) => set({ selectedBlockId }),
  updateBlock: (id, patch) => set((state) => snapshot(state, { ...state.page, blocks: state.page.blocks.map((block) => (block.id === id ? { ...block, ...patch, styles: { ...block.styles, ...patch.styles } } : block)) })),
  moveBlock: (id, direction) => set((state) => {
    const blocks = [...state.page.blocks].sort((a, b) => a.sort_order - b.sort_order);
    const index = blocks.findIndex((block) => block.id === id);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= blocks.length) return state;
    [blocks[index], blocks[nextIndex]] = [blocks[nextIndex], blocks[index]];
    return snapshot(state, { ...state.page, blocks: blocks.map((block, sort_order) => ({ ...block, sort_order })) });
  }),
  addBlock: (type) => set((state) => snapshot(state, { ...state.page, blocks: [{ id: crypto.randomUUID(), type, parent_id: null, sort_order: state.page.blocks.length, content: type === 'image' ? 'New image' : 'Edit this content', image_url: type === 'image' ? 'https://images.unsplash.com/photo-1551218808-94e220e084d2' : null, href: type === 'button' ? '#' : null, styles: { height: type === 'section' ? 280 : undefined, align: 'center', tone: type === 'section' ? 'glass' : undefined } }, ...state.page.blocks] })),
  undo: () => set((state) => state.past[0] ? { page: state.past[0], past: state.past.slice(1), future: [state.page, ...state.future] } : state),
  redo: () => set((state) => state.future[0] ? { page: state.future[0], future: state.future.slice(1), past: [state.page, ...state.past] } : state),
}));
