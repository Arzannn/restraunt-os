import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { AppProvider } from '@/providers/app-provider';
export const metadata: Metadata = { title: 'RestaurantOS X — Luxury SaaS for Restaurants', description: 'A production-ready SaaS foundation for luxury restaurant experiences.' };
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) { return <html lang="en"><body><AppProvider>{children}</AppProvider></body></html>; }
