'use client';

import { PropsWithChildren } from 'react';

export default function CartLayout({ children }: PropsWithChildren) {
  return (
    <div suppressHydrationWarning className="container mx-auto px-4 py-8">
      {children}
    </div>
  );
} 