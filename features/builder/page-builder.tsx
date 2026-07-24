'use client';

import Image from 'next/image';
import { Clock, ImageIcon, Redo2, Save, Type, Undo2 } from 'lucide-react';
import { useEffect, useMemo, useState, type DragEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createBuilderVersion, saveBuilderPage } from '@/lib/settings';
import { cn } from '@/lib/utils';
import { useBuilderStore } from '@/store/use-builder-store';
import type { BuilderBlock, BuilderBlockType, BuilderVersion } from '@/types/database';

const blockPalette: Array<{ type: BuilderBlockType; label: string }> = [
  { type: 'section', label: 'Section' },
  { type: 'heading', label: 'Heading' },
  { type: 'paragraph', label: 'Text' },
  { type: 'image', label: 'Image' },
  { type: 'button', label: 'Button' },
  { type: 'spacer', label: 'Spacer' },
];

export function PageBuilder() {
  const { page, selectedBlockId, past, future, setSelectedBlockId, updateBlock, moveBlock, addBlock, undo, redo } = useBuilderStore();
  const [autosaveStatus, setAutosaveStatus] = useState('Autosave ready');
  const [versions, setVersions] = useState<BuilderVersion[]>([]);
  const selectedBlock = useMemo(() => page.blocks.find((block) => block.id === selectedBlockId) ?? page.blocks[0], [page.blocks, selectedBlockId]);

  useEffect(() => {
    const handle = window.setTimeout(() => {
      setAutosaveStatus('Autosaving draft...');
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        void saveBuilderPage(page).then(() => setAutosaveStatus('Autosaved to Supabase')).catch(() => setAutosaveStatus('Autosave failed'));
      } else {
        setAutosaveStatus('Autosaved locally. Configure Supabase to persist.');
      }
    }, 900);

    return () => window.clearTimeout(handle);
  }, [page]);

  async function saveVersion() {
    const version: BuilderVersion = {
      id: crypto.randomUUID(),
      page_id: page.id,
      version_number: versions.length + 1,
      title: `${page.title} v${versions.length + 1}`,
      blocks: page.blocks,
      created_by: null,
      created_at: new Date().toISOString(),
    };
    setVersions((current) => [version, ...current]);
    setAutosaveStatus('Version snapshot created.');

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      await createBuilderVersion(version);
    }
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const blockType = event.dataTransfer.getData('application/restaurantos-block') as BuilderBlockType;
    if (blockPalette.some((block) => block.type === blockType)) {
      addBlock(blockType);
      setAutosaveStatus(`${blockType} block added to canvas.`);
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-80px)] gap-6 xl:grid-cols-[280px_1fr_340px]">
      <Card className="h-fit">
        <Badge>Drag & Drop</Badge>
        <h2 className="mt-4 text-2xl font-semibold">Blocks</h2>
        <div className="mt-6 grid gap-3">
          {blockPalette.map((block) => (
            <button key={block.type} draggable onDragStart={(event) => event.dataTransfer.setData('application/restaurantos-block', block.type)} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-left hover:border-[#d6a84f]/60">
              <span>{block.label}</span>
              {block.type === 'image' ? <ImageIcon size={16} /> : <Type size={16} />}
            </button>
          ))}
        </div>
        <div className="mt-6 flex gap-2">
          <Button variant="secondary" size="sm" onClick={undo} disabled={past.length === 0}><Undo2 size={16} /></Button>
          <Button variant="secondary" size="sm" onClick={redo} disabled={future.length === 0}><Redo2 size={16} /></Button>
          <Button size="sm" onClick={() => void saveVersion()}><Save className="mr-2" size={16} />Version</Button>
        </div>
        <p className="mt-4 text-sm text-white/50">{autosaveStatus}</p>
      </Card>

      <Card className="min-h-[760px]" onDragOver={(event) => event.preventDefault()} onDrop={handleDrop}>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <Badge variant="glass">Live Preview</Badge>
            <h1 className="mt-3 text-3xl font-semibold">{page.title}</h1>
          </div>
          <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm text-emerald-200">{page.status}</span>
        </div>
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-2xl">
          {[...page.blocks].sort((a, b) => a.sort_order - b.sort_order).map((block) => (
            <BuilderBlockPreview key={block.id} block={block} selected={block.id === selectedBlock?.id} onSelect={() => setSelectedBlockId(block.id)} onMove={moveBlock} />
          ))}
        </div>
      </Card>

      <Card className="h-fit">
        <Badge>Inspector</Badge>
        <h2 className="mt-4 text-2xl font-semibold">Edit selected</h2>
        {selectedBlock ? <BlockInspector block={selectedBlock} onChange={(patch) => updateBlock(selectedBlock.id, patch)} /> : <p className="mt-4 text-white/55">Select a block to edit text, image, size, and alignment.</p>}
        <div className="mt-8 border-t border-white/10 pt-6">
          <h3 className="flex items-center gap-2 font-semibold"><Clock size={16} />Version history</h3>
          <div className="mt-4 space-y-3">
            {versions.length === 0 ? <p className="text-sm text-white/45">No snapshots yet.</p> : versions.map((version) => <div key={version.id} className="rounded-2xl bg-white/[0.04] p-3"><p className="font-medium">{version.title}</p><p className="text-xs text-white/45">{new Date(version.created_at).toLocaleString()}</p></div>)}
          </div>
        </div>
      </Card>
    </div>
  );
}

function BuilderBlockPreview({ block, selected, onSelect, onMove }: { block: BuilderBlock; selected: boolean; onSelect: () => void; onMove: (id: string, direction: -1 | 1) => void }) {
  const shell = cn('group relative cursor-pointer border-2 border-transparent p-6 transition', selected && 'border-[#d6a84f] bg-[#d6a84f]/5');
  const controls = <div className="absolute right-4 top-4 hidden gap-2 group-hover:flex"><button className="rounded-full bg-black/70 px-2 py-1 text-xs" onClick={(event) => { event.stopPropagation(); onMove(block.id, -1); }}>Up</button><button className="rounded-full bg-black/70 px-2 py-1 text-xs" onClick={(event) => { event.stopPropagation(); onMove(block.id, 1); }}>Down</button></div>;

  if (block.type === 'image' && block.image_url) {
    return <section className={shell} onClick={onSelect} style={{ minHeight: block.styles.height ?? 280 }}>{controls}<Image src={block.image_url} alt={block.content} fill className="object-cover opacity-80" sizes="70vw" /><div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" /><p className="absolute bottom-6 left-6 text-lg font-medium">{block.content}</p></section>;
  }

  if (block.type === 'heading') return <h2 className={cn(shell, 'text-4xl font-semibold')} onClick={onSelect}>{controls}{block.content}</h2>;
  if (block.type === 'paragraph') return <p className={cn(shell, 'text-lg leading-8 text-white/65')} onClick={onSelect}>{controls}{block.content}</p>;
  if (block.type === 'button') return <div className={shell} onClick={onSelect}>{controls}<Button>{block.content}</Button></div>;
  if (block.type === 'spacer') return <div className={shell} onClick={onSelect} style={{ height: block.styles.height ?? 80 }}>{controls}<span className="text-xs text-white/30">Spacer</span></div>;

  return <section className={cn(shell, block.styles.tone === 'glass' && 'glass', block.styles.tone === 'gold' && 'bg-[#d6a84f] text-black')} onClick={onSelect} style={{ minHeight: block.styles.height ?? 320 }}>{controls}<div className="grid h-full place-items-center text-center text-3xl font-semibold">{block.content}</div></section>;
}

function BlockInspector({ block, onChange }: { block: BuilderBlock; onChange: (patch: Partial<BuilderBlock>) => void }) {
  return (
    <div className="mt-6 space-y-4">
      <Textarea value={block.content} onChange={(event) => onChange({ content: event.target.value })} placeholder="Editable text" />
      {(block.type === 'image') && <Input value={block.image_url ?? ''} onChange={(event) => onChange({ image_url: event.target.value })} placeholder="Image URL" />}
      <Input value={block.href ?? ''} onChange={(event) => onChange({ href: event.target.value })} placeholder="Link URL" />
      <label className="block text-sm text-white/60">Section height</label>
      <Input type="range" min="60" max="720" value={block.styles.height ?? 240} onChange={(event) => onChange({ styles: { height: Number(event.target.value) } })} />
      <select className="w-full rounded-2xl border border-white/15 bg-black/70 px-4 py-3 text-white" value={block.styles.align ?? 'center'} onChange={(event) => onChange({ styles: { align: event.target.value as BuilderBlock['styles']['align'] } })}>
        <option value="left">Left</option>
        <option value="center">Center</option>
        <option value="right">Right</option>
      </select>
    </div>
  );
}
