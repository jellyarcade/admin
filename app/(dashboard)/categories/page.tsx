'use client';

import { useEffect, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableTableRow } from '@/components/sortable-table-row';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, FolderTree } from 'lucide-react';
import { CategoryModal } from '@/components/modals/category-modal';
import { useToast } from '@/contexts/toast-context';
import { DeleteConfirmationModal } from '@/components/modals/delete-confirmation-modal';

interface Category {
  _id: string;
  name: {
    tr: string;
    en: string;
  };
  slug: {
    tr: string;
    en: string;
  };
  description?: {
    tr: string;
    en: string;
  };
  keywords?: {
    tr: string[];
    en: string[];
  };
  parent: string | null;
  image?: string;
  order: number;
  isNewGames: boolean;
  isMostPlayed: boolean;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );
  const [deleteLoading, setDeleteLoading] = useState(false);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));
  const toast = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin-token')}`,
        },
      });
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryById = async (id: string) => {
    try {
      const token = localStorage.getItem('admin-token');
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setSelectedCategory(data);
    } catch (error) {
      toast.error('Kategori detayları yüklenirken hata oluştu');
    }
  };

  const handleDelete = async (category: Category) => {
    setCategoryToDelete(category);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    setDeleteLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryToDelete._id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('admin-token')}`,
          },
        }
      );

      if (!res.ok) throw new Error('Kategori silinemedi');

      toast.success('Kategori başarıyla silindi');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Kategori silinirken bir hata oluştu');
    } finally {
      setDeleteLoading(false);
      setDeleteModalOpen(false);
      setCategoryToDelete(null);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeCategory = categories.find(cat => cat._id === active.id);
    const overCategory = categories.find(cat => cat._id === over.id);

    if (!activeCategory || !overCategory) return;

    // Sadece aynı parent altındaki kategoriler arasında sıralama yapılabilir
    if (activeCategory.parent !== overCategory.parent) {
      toast.warning('Kategoriler sadece kendi grupları içinde sıralanabilir');
      return;
    }

    // Aynı parent altındaki kategorileri bul ve indexleri hesapla
    const siblingCategories = categories.filter(
      cat => cat.parent === activeCategory.parent
    );
    const oldIndex = siblingCategories.findIndex(cat => cat._id === active.id);
    const newIndex = siblingCategories.findIndex(cat => cat._id === over.id);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/categories/${active.id}/reorder`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('admin-token')}`,
          },
          body: JSON.stringify({
            newIndex,
            parentId: activeCategory.parent,
          }),
        }
      );

      if (!res.ok) {
        throw new Error('Sıralama güncellenemedi');
      }

      // Backend'den güncel listeyi al
      const updatedData = await res.json();
      setCategories(updatedData);
      toast.success('Sıralama güncellendi');
    } catch (error) {
      console.error('Reorder error:', error);
      toast.error('Sıralama güncellenirken bir hata oluştu');
    }
  };

  // Kategorileri hiyerarşik olarak render et
  const renderCategories = (
    parentId: string | null = null,
    level: number = 0
  ): JSX.Element[] => {
    const filteredCategories = categories
      .filter(cat => cat.parent === parentId)
      .sort((a, b) => a.order - b.order);

    return filteredCategories.flatMap(category => [
      // Ana kategoriyi render et
      <SortableTableRow
        key={category._id}
        id={category._id}
        category={category}
        onEdit={async () => {
          setIsModalOpen(true);
          await fetchCategoryById(category._id);
        }}
        onDelete={() => handleDelete(category)}
        categories={categories}
        depth={level}
      />,
      // Alt kategorileri recursive olarak render et
      ...renderCategories(category._id, level + 1),
    ]);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Kategoriler</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className='h-4 w-4 mr-2' />
          Yeni Kategori
        </Button>
      </div>

      <div className='bg-white rounded-lg shadow'>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='w-[50px]'></TableHead>
                <TableHead className='w-[100px]'>Görsel</TableHead>
                <TableHead>Türkçe İsim</TableHead>
                <TableHead>İngilizce İsim</TableHead>
                <TableHead>Üst Kategori</TableHead>
                <TableHead className='w-[80px]'>Sıra</TableHead>
                <TableHead className='w-[80px]'>Yeni</TableHead>
                <TableHead className='w-[80px]'>Popüler</TableHead>
                <TableHead className='text-right'>İşlemler</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <SortableContext
                items={categories.map(cat => cat._id)}
                strategy={verticalListSortingStrategy}
              >
                {renderCategories(null)}
              </SortableContext>
            </TableBody>
          </Table>
        </DndContext>
      </div>

      <CategoryModal
        category={selectedCategory}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategory(null);
        }}
        onSuccess={() => {
          setIsModalOpen(false);
          setSelectedCategory(null);
          fetchCategories();
        }}
        categories={categories}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setCategoryToDelete(null);
        }}
        onConfirm={confirmDelete}
        title='Kategoriyi Sil'
        description={`"${categoryToDelete?.name.tr}" kategorisini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`}
        loading={deleteLoading}
      />
    </div>
  );
}
