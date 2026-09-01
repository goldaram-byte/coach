'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// План теперь живёт на главной странице — старые ссылки ведут туда.
export default function PlanRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/');
  }, [router]);
  return null;
}
