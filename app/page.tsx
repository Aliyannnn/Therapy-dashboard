'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getUserType } from '@/lib/api';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      const userType = getUserType();
      if (userType === 'admin') {
        router.push('/admin/dashboard');
      } else if (userType === 'user') {
        router.push('/user/dashboard');
      } else {
        router.push('/login');
      }
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-black">
      <div className="text-white text-xl">Loading...</div>
    </div>
  );
}
