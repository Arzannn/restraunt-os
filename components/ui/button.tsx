import { cva, type VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
export const buttonVariants = cva('inline-flex items-center justify-center rounded-full font-medium transition focus:outline-none focus:ring-2 focus:ring-[#d6a84f] disabled:opacity-50', { variants:{ variant:{primary:'bg-[#d6a84f] text-black hover:bg-[#f0c76b]',secondary:'glass text-white hover:border-[#d6a84f]/70',ghost:'text-white hover:bg-white/10'}, size:{sm:'h-9 px-4 text-sm',md:'h-11 px-6',lg:'h-14 px-8 text-lg'}}, defaultVariants:{variant:'primary',size:'md'}});
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>;
export function Button({ className, variant, size, ...props }: ButtonProps) { return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />; }
