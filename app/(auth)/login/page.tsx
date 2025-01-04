'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/contexts/toast-context';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log('Login Response:', data);

      if (res.ok && data.token) {
        localStorage.setItem('admin-token', data.token);
        console.log('Saved Token:', localStorage.getItem('admin-token'));
        router.push('/');
      } else {
        toast.error(data.message || 'Giriş başarısız');
      }
    } catch (error) {
      console.error('Login Error:', error);
      toast.error('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex h-screen w-screen items-center justify-center'>
      <div className='w-full max-w-md space-y-8 p-8'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold'>Admin Girişi</h2>
          <p className='text-muted-foreground'>Devam etmek için giriş yapın</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <Input
              type='email'
              placeholder='Email'
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className='space-y-2'>
            <Input
              type='password'
              placeholder='Şifre'
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type='submit' className='w-full' disabled={loading}>
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </Button>
        </form>
      </div>
    </div>
  );
}
