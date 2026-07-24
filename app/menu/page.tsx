import type { Metadata } from 'next';
import { CinematicMenuPage } from '@/features/menu/cinematic-menu-page';

export const metadata: Metadata = {
  title: 'Menu — RestaurantOS X',
  description: 'A cinematic menu experience assembled from taco ingredients.',
};

export default function MenuPage() {
  return <CinematicMenuPage />;
}
