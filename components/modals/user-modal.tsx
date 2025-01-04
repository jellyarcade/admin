'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

interface UserModalProps {
  user: {
    _id: string;
    name: string;
    email: string;
    role: string;
    avatar: string;
    favorites: string[];
    favoriteCategories: string[];
    recentlyPlayed: Array<{
      game: string;
      playedAt: string;
    }>;
    createdAt: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function UserModal({ user, isOpen, onClose }: UserModalProps) {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const handlePasswordChange = async () => {
    if (!password) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Yeni şifre giriniz',
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user._id}/password`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('admin-token')}`,
          },
          body: JSON.stringify({ password }),
        }
      );

      if (!res.ok) throw new Error('Şifre güncellenemedi');

      toast({
        title: 'Başarılı',
        description: 'Şifre güncellendi',
      });
      setPassword('');
      onClose();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Hata',
        description: 'Şifre güncellenirken bir hata oluştu',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Kullanıcı Detayları</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <label className='font-medium'>İsim</label>
            <Input value={user.name} disabled />
          </div>
          <div className='grid gap-2'>
            <label className='font-medium'>Email</label>
            <Input value={user.email} disabled />
          </div>
          <div className='grid gap-2'>
            <label className='font-medium'>Rol</label>
            <Input value={user.role} disabled />
          </div>
          <div className='grid gap-2'>
            <label className='font-medium'>Kayıt Tarihi</label>
            <Input
              value={new Date(user.createdAt).toLocaleDateString('tr-TR')}
              disabled
            />
          </div>
          <div className='grid gap-2'>
            <label className='font-medium'>Favori Oyun Sayısı</label>
            <Input value={user.favorites.length} disabled />
          </div>
          <div className='grid gap-2'>
            <label className='font-medium'>Son Oynanan Oyun Sayısı</label>
            <Input value={user.recentlyPlayed.length} disabled />
          </div>
          <div className='grid gap-2'>
            <label className='font-medium'>Yeni Şifre</label>
            <Input
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder='Yeni şifre'
            />
          </div>
        </div>
        <div className='flex justify-end gap-3'>
          <Button variant='outline' onClick={onClose}>
            İptal
          </Button>
          <Button onClick={handlePasswordChange} disabled={loading}>
            {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
