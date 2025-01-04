'use client';

import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth-context';
import { useRouter } from 'next/navigation';

export function Header() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className='border-b bg-white sticky top-0 z-10'>
      <div className='flex h-16 items-center justify-between px-6'>
        <div>Admin Panel</div>
        <Button variant='ghost' size='icon' onClick={handleLogout}>
          <LogOut className='h-5 w-5' />
        </Button>
      </div>
    </header>
  );
}
