'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, login } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sayfa yüklendiğinde localStorage'dan token'ı kontrol et
    const storedToken = localStorage.getItem('admin-token');

    if (storedToken) {
      login(storedToken); // Token varsa context'e set et
    }

    if (!storedToken && pathname !== '/login') {
      router.push('/login');
    }

    setLoading(false);
  }, [pathname, router, login]);

  // Login sayfasındaysak ve token varsa ana sayfaya yönlendir
  useEffect(() => {
    if (token && pathname === '/login') {
      router.push('/');
    }
  }, [token, pathname, router]);

  if (loading) {
    return (
      <div className='h-screen w-screen flex items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    );
  }

  // Login sayfasında değilsek ve token yoksa null dön
  if (!token && pathname !== '/login') {
    return null;
  }

  return <>{children}</>;
}
