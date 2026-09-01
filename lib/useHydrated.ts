'use client';

import { useEffect, useState } from 'react';

/**
 * Returns true after the first client render. Pages that show
 * store-driven data render a skeleton until then to avoid
 * SSR/localStorage hydration mismatches.
 */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}
