'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Users, FolderTree, Gamepad2 } from 'lucide-react';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/users', label: 'Kullanıcılar', icon: Users },
  { href: '/categories', label: 'Kategoriler', icon: FolderTree },
  { href: '/games', label: 'Oyunlar', icon: Gamepad2 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className='w-64 bg-white border-r h-screen'>
      <div className='p-6'>
        <h1 className='text-xl font-bold'>Admin Panel</h1>
      </div>
      <nav className='px-3 py-2'>
        {menuItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900',
              pathname === href ? 'bg-gray-100 text-gray-900' : ''
            )}
          >
            <Icon className='h-5 w-5' />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
