'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/contexts/toast-context';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import { GameModal } from '@/components/modals/game-modal';
import { Game, Category } from '@/types';
import { SortableGameItem } from '@/components/sortable-game-item';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const toast = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    Promise.all([fetchGames(), fetchCategories()]).finally(() =>
      setLoading(false)
    );
  }, []);

  const fetchGames = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/games`);
      const data = await res.json();
      setGames(data);
    } catch (error) {
      toast.error('Oyunlar yüklenirken hata oluştu');
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      toast.error('Kategoriler yüklenirken hata oluştu');
    }
  };

  const fetchGameById = async (id: string) => {
    try {
      const token = localStorage.getItem('admin-token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/games/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setSelectedGame(data);
    } catch (error) {
      toast.error('Oyun detayları yüklenirken hata oluştu');
    }
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = games.findIndex(game => game._id === active.id);
    const newIndex = games.findIndex(game => game._id === over.id);

    const newGames = arrayMove(games, oldIndex, newIndex);
    setGames(newGames);

    try {
      const gameOrders = newGames.map((game, index) => ({
        gameId: game._id,
        order: index,
      }));

      const token = localStorage.getItem('admin-token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/games/order`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ gameOrders }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Sıralama güncellenemedi');
      }

      setGames(data);
      toast.success('Sıralama güncellendi');
    } catch (error) {
      setGames(games);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Sıralama güncellenirken hata oluştu'
      );
    }
  };

  const handleDelete = async (gameId: string) => {
    if (!confirm('Bu oyunu silmek istediğinize emin misiniz?')) return;

    try {
      const token = localStorage.getItem('admin-token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/games/${gameId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error('Oyun silinemedi');

      toast.success('Oyun başarıyla silindi');
      fetchGames();
    } catch (error) {
      toast.error('Oyun silinirken hata oluştu');
    }
  };

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div className='p-6'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Oyunlar</h1>
        <Button onClick={() => setIsModalOpen(true)}>Yeni Oyun</Button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Oyun</TableHead>
                <TableHead>Kategoriler</TableHead>
                <TableHead>Sıralama</TableHead>
                <TableHead className='text-right'>İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <SortableContext
                items={games.map(g => g._id)}
                strategy={verticalListSortingStrategy}
              >
                {games.map(game => (
                  <SortableGameItem
                    key={game._id}
                    game={game}
                    categories={categories}
                    onEdit={async () => {
                      setIsModalOpen(true);
                      await fetchGameById(game._id);
                    }}
                    onDelete={() => handleDelete(game._id)}
                  />
                ))}
              </SortableContext>
            </TableBody>
          </Table>
        </div>
      </DndContext>

      <GameModal
        game={selectedGame}
        categories={categories}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedGame(null);
        }}
        onSuccess={() => {
          setIsModalOpen(false);
          setSelectedGame(null);
          fetchGames();
        }}
      />
    </div>
  );
}
