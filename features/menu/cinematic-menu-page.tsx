'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Heading } from '@/components/ui/heading';
import { Section } from '@/components/ui/section';
import { dishes } from '@/features/home/data';
import { fadeUp, stagger } from '@/lib/animations';
import { formatCurrency } from '@/lib/utils';

const ingredients = ['Shell', 'Chicken', 'Cheese', 'Tomatoes', 'Onions', 'Lettuce', 'Sauce'];

export function CinematicMenuPage() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Section spacing="lg" className="pt-16">
        <Container>
          <Link href="/" className="text-sm text-white/55">← Back to cinematic hero</Link>
          <motion.div variants={stagger} initial="hidden" animate="visible" className="mt-16 text-center">
            <motion.div variants={fadeUp}><Badge>Assembled from the taco flight</Badge></motion.div>
            <motion.h1 variants={fadeUp} className="mx-auto mt-6 max-w-5xl text-6xl font-semibold tracking-tight md:text-8xl">The ingredients become the interface.</motion.h1>
            <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-2xl text-lg text-white/60">After the camera passes through the separated taco layers, each ingredient lands as a menu system element with motion that feels composed, premium, and performant.</motion.p>
          </motion.div>
          <motion.div variants={stagger} initial="hidden" animate="visible" className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
            {ingredients.map((ingredient) => <motion.div variants={fadeUp} key={ingredient} className="glass rounded-2xl px-4 py-5 text-center text-sm font-semibold uppercase tracking-[0.2em] text-[#f7d98b]">{ingredient}</motion.div>)}
          </motion.div>
        </Container>
      </Section>
      <Section>
        <Container>
          <Heading align="center">Menu assembled</Heading>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {dishes.map((dish, index) => (
              <motion.div key={dish.id} initial={{ opacity: 0, y: 48, rotateX: 12 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ delay: index * 0.12, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}>
                <Card className="overflow-hidden" padding="none">
                  <div className="relative h-72">
                    <Image src={dish.image} alt={dish.name} fill className="object-cover" sizes="(min-width:768px) 33vw, 100vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                  </div>
                  <div className="p-6">
                    <Badge>{dish.badge}</Badge>
                    <h2 className="mt-4 text-2xl font-semibold">{dish.name}</h2>
                    <p className="mt-2 text-white/60">{dish.description}</p>
                    <div className="mt-6 flex items-center justify-between"><span className="gold-text text-xl font-semibold">{formatCurrency(dish.price)}</span><Button size="sm">Reserve</Button></div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}
