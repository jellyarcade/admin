'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/contexts/toast-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

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

interface CategoryModalProps {
  category: Category | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categories: Category[];
}

export function CategoryModal({
  category,
  isOpen,
  onClose,
  onSuccess,
  categories,
}: CategoryModalProps) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || { tr: '', en: '' },
        parent: category.parent,
        isNewGames: category.isNewGames,
        isMostPlayed: category.isMostPlayed,
      });
    } else {
      setFormData({
        name: { tr: '', en: '' },
        description: { tr: '', en: '' },
        parent: null,
        isNewGames: false,
        isMostPlayed: false,
      });
    }
  }, [category]);

  const initialState: Partial<Category> = {
    name: { tr: '', en: '' },
    description: { tr: '', en: '' },
    keywords: { tr: [], en: [] },
    parent: null,
    order: 0,
    isNewGames: false,
    isMostPlayed: false,
  };

  const [formData, setFormData] = useState<Partial<Category>>(
    category || initialState
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setFormData(category || initialState);
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isOpen, category]);

  const handleSubmit = async () => {
    if (!formData.name?.tr || !formData.name?.en) {
      toast.error('Kategori adı zorunludur');
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();

      // Her bir field'ı ayrı ayrı ekle
      formDataToSend.append('name[tr]', formData.name.tr);
      formDataToSend.append('name[en]', formData.name.en);

      if (formData.description?.tr) {
        formDataToSend.append('description[tr]', formData.description.tr);
      }
      if (formData.description?.en) {
        formDataToSend.append('description[en]', formData.description.en);
      }

      if (formData.parent) {
        formDataToSend.append('parent', formData.parent);
      }

      formDataToSend.append(
        'isNewGames',
        formData.isNewGames?.toString() || 'false'
      );
      formDataToSend.append(
        'isMostPlayed',
        formData.isMostPlayed?.toString() || 'false'
      );

      // Eğer yeni resim seçildiyse ekle
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      const url = category
        ? `${process.env.NEXT_PUBLIC_API_URL}/categories/${category._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/categories`;

      const res = await fetch(url, {
        method: category ? 'PUT' : 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('admin-token')}`,
        },
        body: formDataToSend,
      });

      if (!res.ok) throw new Error('İşlem başarısız');

      toast.success(
        category ? 'Kategori güncellendi' : 'Yeni kategori oluşturuldu'
      );
      onSuccess();
    } catch (error) {
      toast.error('Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData(category || initialState);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className='sm:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>
            {category ? 'Kategori Düzenle' : 'Yeni Kategori'}
          </DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='grid gap-2'>
              <label className='font-medium'>Türkçe İsim</label>
              <Input
                value={formData.name?.tr}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    name: { ...prev.name!, tr: e.target.value },
                  }))
                }
              />
            </div>
            <div className='grid gap-2'>
              <label className='font-medium'>İngilizce İsim</label>
              <Input
                value={formData.name?.en}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    name: { ...prev.name!, en: e.target.value },
                  }))
                }
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='grid gap-2'>
              <label className='font-medium'>Türkçe Açıklama</label>
              <Textarea
                value={formData.description?.tr}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    description: { ...prev.description!, tr: e.target.value },
                  }))
                }
              />
            </div>
            <div className='grid gap-2'>
              <label className='font-medium'>İngilizce Açıklama</label>
              <Textarea
                value={formData.description?.en}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    description: { ...prev.description!, en: e.target.value },
                  }))
                }
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='grid gap-2'>
              <label className='font-medium'>Üst Kategori</label>
              <Select
                value={formData.parent?.toString()}
                onValueChange={value =>
                  setFormData(prev => ({
                    ...prev,
                    parent: value === 'null' ? null : value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder='Üst kategori seçin' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='null'>Yok</SelectItem>
                  {categories
                    .filter(c => c._id !== category?._id)
                    .map(c => (
                      <SelectItem key={c._id} value={c._id}>
                        {c.name.tr}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className='grid gap-2'>
            <label className='font-medium'>Kategori Görseli</label>
            <div className='flex items-center gap-4'>
              {(formData.image || imageFile) && (
                <img
                  src={
                    imageFile ? URL.createObjectURL(imageFile) : formData.image
                  }
                  alt='Kategori görseli'
                  className='w-20 h-20 object-cover rounded'
                />
              )}
              <input
                type='file'
                accept='image/*'
                className='hidden'
                ref={fileInputRef}
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) setImageFile(file);
                }}
              />
              <Button
                type='button'
                variant='outline'
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className='h-4 w-4 mr-2' />
                Görsel Seç
              </Button>
            </div>
          </div>

          <div className='flex flex-col gap-4'>
            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <label className='font-medium'>Yeni Oyunlar</label>
                <p className='text-sm text-gray-500'>
                  Bu kategori yeni oyunlar bölümünde gösterilsin
                </p>
              </div>
              <Switch
                checked={formData.isNewGames}
                onCheckedChange={checked =>
                  setFormData(prev => ({ ...prev, isNewGames: checked }))
                }
              />
            </div>

            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <label className='font-medium'>En Çok Oynananlar</label>
                <p className='text-sm text-gray-500'>
                  Bu kategori en çok oynananlar bölümünde gösterilsin
                </p>
              </div>
              <Switch
                checked={formData.isMostPlayed}
                onCheckedChange={checked =>
                  setFormData(prev => ({ ...prev, isMostPlayed: checked }))
                }
              />
            </div>
          </div>
        </div>
        <div className='flex justify-end gap-3'>
          <Button variant='outline' onClick={handleClose}>
            İptal
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
