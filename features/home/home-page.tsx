'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Shield } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Section } from '@/components/ui/section';
import { fadeUp, stagger } from '@/lib/animations';
import { formatCurrency } from '@/lib/utils';
import { dishes } from './data';

const TacoScene = dynamic(() => import('./taco-scene').then((module) => module.TacoScene), {
  ssr: false,
  loading: () => <div className="h-full animate-pulse rounded-full bg-[#d6a84f]/10" />,
});

export function HomePage() {
  const router = useRouter();
  const [explodingTaco, setExplodingTaco] = useState(false);

  function startMenuTransition() {
    setExplodingTaco(true);
  }

  return (
    <main>
      <nav className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-black/45 backdrop-blur-xl">
        <Container className="flex h-20 items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight">RestaurantOS <span className="gold-text">X</span></Link>
          <div className="hidden gap-8 text-sm text-white/70 md:flex">
            <button onClick={startMenuTransition} className="transition hover:text-white">Menu</button>
            <a href="#about">About</a>
            <a href="#gallery">Gallery</a>
          </div>
          <Link href="/admin/login"><Button variant="secondary" size="sm">Admin</Button></Link>
        </Container>
      </nav>
      <Section spacing="lg" className="min-h-screen overflow-hidden pt-32">
        <Container className="grid items-center gap-10 md:grid-cols-2">
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.div variants={fadeUp}><Badge>v0.2 Cinematic Menu Transition</Badge></motion.div>
            <motion.h1 variants={fadeUp} className="mt-6 text-6xl font-semibold tracking-tight md:text-8xl">Luxury dining, engineered for scale.</motion.h1>
            <motion.p variants={fadeUp} className="mt-6 max-w-xl text-lg text-white/65">RestaurantOS X is a reusable platform foundation for multi-tenant restaurant sites, reservations, content, and analytics.</motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-4">
              <Button><Calendar className="mr-2" size={18} />Reserve Table</Button>
              <Button variant="secondary" onClick={startMenuTransition}>Explore Menu<ArrowRight className="ml-2" size={18} /></Button>
              <Link href="/admin/login"><Button variant="ghost"><Shield className="mr-2" size={18} />Admin</Button></Link>
            </motion.div>
          </motion.div>
          <div className="relative h-[420px] sm:h-[520px]">
            <div className="absolute inset-8 rounded-full bg-[#d6a84f]/20 blur-3xl" />
            <TacoScene exploded={explodingTaco} onExplodeComplete={() => router.push('/menu')} />
          </div>
        </Container>
      </Section>
      <Section id="menu">
        <Container>
          <Heading align="center">Featured dishes</Heading>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {dishes.map((dish) => (
              <Card key={dish.id} className="overflow-hidden" padding="none">
                <div className="relative h-64"><Image src={dish.image} alt={dish.name} fill className="object-cover" sizes="(min-width:768px) 33vw, 100vw" /></div>
                <div className="p-6"><Badge>{dish.badge}</Badge><h3 className="mt-4 text-2xl font-semibold">{dish.name}</h3><p className="mt-2 text-white/60">{dish.description}</p><p className="mt-4 gold-text text-xl font-semibold">{formatCurrency(dish.price)}</p></div>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
      <Section id="about"><Container className="grid gap-8 md:grid-cols-2"><Heading>A Michelin-grade digital operating layer.</Heading><p className="text-xl leading-9 text-white/62">Reusable components, strongly typed data models, animation primitives, Supabase auth scaffolding, and Cloudinary-ready media utilities create the base for hundreds of bespoke restaurant brands.</p></Container></Section>
      <Section id="gallery"><Container><div className="grid gap-4 md:grid-cols-4">{dishes.concat(dishes).map((dish, index) => <div key={`${dish.id}-${index}`} className="relative h-72 overflow-hidden rounded-3xl"><Image src={dish.image} alt="Restaurant gallery" fill className="object-cover transition duration-700 hover:scale-110" sizes="25vw" /></div>)}</div></Container></Section>
      <Section><Container><Card className="text-center"><Heading align="center">Ready for tonight?</Heading><p className="mx-auto mt-4 max-w-2xl text-white/60">Reserve the room, choreograph the service, and turn every guest touchpoint into a premium experience.</p><Button className="mt-8" size="lg">Reserve Table</Button></Card></Container></Section>
      <footer className="border-t border-white/10 py-10"><Container className="flex flex-col justify-between gap-4 text-white/50 md:flex-row"><p>© 2026 RestaurantOS X</p><p>Built for luxury hospitality groups.</p></Container></footer>
    </main>
  );
}
