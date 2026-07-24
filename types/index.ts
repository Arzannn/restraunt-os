import type { LucideIcon } from 'lucide-react';
export type Dish = { id: string; name: string; description: string; price: number; image: string; badge: string };
export type Metric = { label: string; value: string; delta: string; icon: LucideIcon };
export type Activity = { id: string; title: string; time: string; detail: string };
