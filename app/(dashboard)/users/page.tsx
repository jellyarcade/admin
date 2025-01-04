'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { UserModal } from '@/components/modals/user-modal';
import { Eye } from 'lucide-react';

interface User {
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
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin-token')}`,
          },
        });
        const data = await res.json();

        // API yanıtını kontrol et ve array'e dönüştür
        const userArray = Array.isArray(data) ? data : data.users || [];
        setUsers(userArray);

        console.log('API Response:', data); // Debug için
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!users.length) {
    return (
      <div>
        <h1 className='text-2xl font-bold mb-4'>Kullanıcılar</h1>
        <div className='bg-white rounded-lg shadow p-4'>
          Henüz kullanıcı bulunmuyor.
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>Kullanıcılar</h1>
      <div className='bg-white rounded-lg shadow'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>İsim</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Kayıt Tarihi</TableHead>
              <TableHead>İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                </TableCell>
                <TableCell>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => setSelectedUser(user)}
                  >
                    <Eye className='h-4 w-4' />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedUser && (
        <UserModal
          user={selectedUser}
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
}
