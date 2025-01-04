'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/contexts/toast-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gamepad2, FolderTree, PlayCircle, Users } from 'lucide-react';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { useAuth } from '@/contexts/auth-context';

interface Stats {
  totalGames: number;
  totalCategories: number;
  totalPlays: number;
  activeGames: number;
  totalUsers: number;
}

export default function HomePage() {
  const auth = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalGames: 0,
    totalCategories: 0,
    totalPlays: 0,
    activeGames: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('admin-token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [gamesRes, categoriesRes, usersRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/games`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, { headers }),
      ]);

      const games = await gamesRes.json();
      const categories = await categoriesRes.json();
      const users = await usersRes.json();

      if (!gamesRes.ok) throw new Error('Oyunlar yüklenemedi');
      if (!categoriesRes.ok) throw new Error('Kategoriler yüklenemedi');
      if (!usersRes.ok)
        throw new Error(users.message || 'Kullanıcılar yüklenemedi');

      const totalPlays = games.reduce(
        (sum: number, game: any) => sum + (game.playCount || 0),
        0
      );
      const activeGames = games.filter((game: any) => game.isActive).length;

      setStats({
        totalGames: games.length,
        totalCategories: categories.length,
        totalPlays,
        activeGames,
        totalUsers: users.length,
      });
    } catch (error) {
      console.error('Stats Error:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'İstatistikler yüklenirken hata oluştu'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='p-6'>
        <div className='text-center'>Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen'>
      <Sidebar />
      <div className='flex-1'>
        <Header />
        <main className='p-6'>
          <h1 className='text-2xl font-bold mb-6'>Dashboard</h1>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Toplam Oyun
                </CardTitle>
                <Gamepad2 className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{stats.totalGames}</div>
                <p className='text-xs text-muted-foreground'>
                  {stats.activeGames} aktif oyun
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Toplam Kategori
                </CardTitle>
                <FolderTree className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {stats.totalCategories}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Toplam Oynanma
                </CardTitle>
                <PlayCircle className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{stats.totalPlays}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Toplam Kullanıcı
                </CardTitle>
                <Users className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{stats.totalUsers}</div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
