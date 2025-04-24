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
import { Switch } from '@/components/ui/switch';
import { Upload } from 'lucide-react';
import { MultiSelect } from '@/components/ui/multi-select';

interface Category {
  _id: string;
  name: {
    tr: string;
    en: string;
  };
}

interface Game {
  _id: string;
  title: {
    tr: string;
    en: string;
  };
  description: {
    tr: string;
    en: string;
  };
  keywords: {
    tr: string[];
    en: string[];
  };
  categories: string[] | Category[];
  instantLink: string;
  isNew: boolean;
  isPopular: boolean;
  isActive: boolean;
  playCount: number;
  image: string;
  orientation: 'horizontal' | 'vertical';
  isShowcased: boolean;
  showcasedCategories: string[];
  isHomePageShowcased: boolean;
  devices?: string[];
}

interface GameModalProps {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categories: Category[];
}

export function GameModal({
  game,
  isOpen,
  onClose,
  onSuccess,
  categories,
}: GameModalProps) {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  console.log('Modal Props:', { isOpen, game });
	
  const initialState: Partial<Game> = {
    title: { tr: '', en: '' },
    description: { tr: '', en: '' },
    keywords: { tr: [], en: [] },
    categories: [],
    instantLink: '',
    isNew: false,
    isPopular: false,
    isActive: true,
    playCount: 0,
    orientation: 'horizontal',
    image: '',
    isShowcased: false,
    showcasedCategories: [],
    isHomePageShowcased: false,
	devices: ['all'],
  };

  const [formData, setFormData] = useState<Partial<Game>>(initialState);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialState);
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (game) {
      const formattedGame = {
        title: {
          tr: game.title?.tr || '',
          en: game.title?.en || '',
        },
        description: {
          tr: game.description?.tr || '',
          en: game.description?.en || '',
        },
        keywords: {
          tr: game.keywords?.tr || [],
          en: game.keywords?.en || [],
        },
        categories: game.categories.map((cat: any) =>
          typeof cat === 'object' ? cat.$oid || cat._id : cat
        ),
        instantLink: game.instantLink || '',
        isNew: game.isNew || false,
        isPopular: game.isPopular || false,
        isActive: game.isActive !== undefined ? game.isActive : true,
        playCount: game.playCount || 0,
        orientation: game.orientation || 'horizontal',
        image: game.image || '',
        _id: game._id,
        isShowcased: game.isShowcased || false,
        showcasedCategories: game.showcasedCategories || [],
        isHomePageShowcased: game.isHomePageShowcased || false,
		devices: game.devices || ['all']
      };

      setFormData(formattedGame);
    } else {
      setFormData(initialState);
    }
  }, [game]);

  const handleSubmit = async () => {
    // Form validasyonları
    const errors = [];

    if (!formData.title?.tr || !formData.title?.en) {
      errors.push('Oyun adı zorunludur');
    }

    if (!formData.categories?.length) {
      errors.push('Kategori seçimi zorunludur');
    }

    // URL validasyonu
    if (!formData.instantLink) {
      errors.push('iframe URL zorunludur');
    } else {
      try {
        const url = new URL(formData.instantLink);
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
          errors.push('URL http:// veya https:// ile başlamalıdır');
        }
      } catch {
        errors.push('Geçerli bir URL giriniz');
      }
    }

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('admin-token');
      if (!token) {
        toast.error('Oturum süresi dolmuş');
        return;
      }

      const formDataToSend = new FormData();

      // Temel bilgiler
      formDataToSend.append('title.tr', formData.title?.tr || '');
      formDataToSend.append('title.en', formData.title?.en || '');
      formDataToSend.append('description.tr', formData.description?.tr || '');
      formDataToSend.append('description.en', formData.description?.en || '');
      formDataToSend.append('instantLink', formData.instantLink || '');
      formDataToSend.append(
        'orientation',
        formData.orientation || 'horizontal'
      );

      // Kategorileri tek tek ekle
      if (formData.categories && formData.categories.length > 0) {
        // Kategorileri tek bir array olarak gönder
        formDataToSend.append(
          'categories',
          JSON.stringify(formData.categories)
        );
      } else {
        throw new Error('En az bir kategori seçilmelidir');
      }
		
		formDataToSend.append('devices', JSON.stringify(formData.devices || ['all']));
		
      // Anahtar kelimeler
      formDataToSend.append(
        'keywords.tr',
        JSON.stringify(formData.keywords?.tr || [])
      );
      formDataToSend.append(
        'keywords.en',
        JSON.stringify(formData.keywords?.en || [])
      );

      // Durum bilgileri
      formDataToSend.append('isNew', formData.isNew?.toString() || 'false');
      formDataToSend.append(
        'isPopular',
        formData.isPopular?.toString() || 'false'
      );
      formDataToSend.append(
        'isActive',
        formData.isActive?.toString() || 'true'
      );
      formDataToSend.append('playCount', formData.playCount?.toString() || '0');

      // Görsel
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      // Manşet alanlarını ekle
      formDataToSend.append(
        'isShowcased',
        formData.isShowcased?.toString() || 'false'
      );
      formDataToSend.append(
        'showcasedCategories',
        JSON.stringify(formData.showcasedCategories || [])
      );

      // Anasayfa manşet alanını ekle
      formDataToSend.append(
        'isHomePageShowcased',
        formData.isHomePageShowcased?.toString() || 'false'
      );

      // FormData içeriğini kontrol et
      Array.from(formDataToSend.entries()).forEach(([key, value]) => {
        console.log(`${key}: ${value}`);
      });

      const url = game
        ? `${process.env.NEXT_PUBLIC_API_URL}/games/${game._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/games`;

      const res = await fetch(url, {
        method: game ? 'PUT' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      const data = await res.json();
      console.log('Response:', data);

      if (!res.ok) {
        if (data.errors) {
          data.errors.forEach((err: any) => toast.error(err.msg));
          return;
        }
        throw new Error(data.message || 'İşlem başarısız');
      }

      toast.success(game ? 'Oyun güncellendi' : 'Yeni oyun oluşturuldu');
      onSuccess();
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = categories.map(cat => ({
    value: cat._id,
    label: cat.name.tr,
  }));
  
  const deviceOptions = [
  { value: 'all', label: 'Tüm Cihazlar' },
  { value: 'ios', label: 'iOS (iPhone/iPad)' },
  { value: 'android', label: 'Android' },
  { value: 'web', label: 'Web (Masaüstü)' },
];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[800px] max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>{game ? 'Oyun Düzenle' : 'Yeni Oyun'}</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='grid gap-2'>
              <label className='font-medium'>Türkçe İsim</label>
              <Input
                value={formData.title?.tr || ''}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    title: { ...prev.title!, tr: e.target.value },
                  }))
                }
              />
            </div>
            <div className='grid gap-2'>
              <label className='font-medium'>İngilizce İsim</label>
              <Input
                value={formData.title?.en}
                onChange={e =>
                  setFormData(prev => ({
                    ...prev,
                    title: { ...prev.title!, en: e.target.value },
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

          <div className='grid gap-2'>
            <label className='font-medium'>Kategoriler</label>
            <MultiSelect
              options={categoryOptions}
              selected={(formData.categories || []).map(cat =>
                typeof cat === 'string' ? cat : cat._id
              )}
              onChange={values => {
                setFormData(prev => ({
                  ...prev,
                  categories: values,
                }));
              }}
              placeholder='Kategorileri seçin'
            />
          </div>

          <div className='grid gap-2'>
            <label className='font-medium'>iframe URL</label>
            <Input
              value={formData.instantLink}
              onChange={e => {
                let url = e.target.value;
                // URL'nin başında http:// veya https:// yoksa ekle
                if (url && !url.match(/^https?:\/\//)) {
                  url = `https://${url}`;
                }
                setFormData(prev => ({ ...prev, instantLink: url }));
              }}
              placeholder='https://example.com/game-iframe'
            />
          </div>

          <div className='grid gap-2'>
            <label className='font-medium'>Oyun Görseli</label>
            <div className='flex items-center gap-4'>
              {(formData.image || imageFile) && (
                <img
                  src={
                    imageFile ? URL.createObjectURL(imageFile) : formData.image
                  }
                  alt='Oyun görseli'
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
                <label className='font-medium'>Yeni Oyun</label>
                <p className='text-sm text-gray-500'>
                  Bu oyun yeni oyunlar bölümünde gösterilsin
                </p>
              </div>
              <Switch
                checked={formData.isNew || false}
                onCheckedChange={checked =>
                  setFormData(prev => ({ ...prev, isNew: checked }))
                }
              />
            </div>

            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <label className='font-medium'>Popüler Oyun</label>
                <p className='text-sm text-gray-500'>
                  Bu oyun popüler oyunlar bölümünde gösterilsin
                </p>
              </div>
              <Switch
                checked={formData.isPopular || false}
                onCheckedChange={checked =>
                  setFormData(prev => ({ ...prev, isPopular: checked }))
                }
              />
            </div>

            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <label className='font-medium'>Aktif</label>
                <p className='text-sm text-gray-500'>
                  Bu oyun sitede gösterilsin
                </p>
              </div>
              <Switch
                checked={formData.isActive || false}
                onCheckedChange={checked =>
                  setFormData(prev => ({ ...prev, isActive: checked }))
                }
              />
            </div>

            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <label className='font-medium'>Manşette Göster</label>
                <p className='text-sm text-gray-500'>
                  Bu oyun manşet bölümünde gösterilsin
                </p>
              </div>
              <Switch
                checked={formData.isShowcased || false}
                onCheckedChange={checked =>
                  setFormData(prev => ({ ...prev, isShowcased: checked }))
                }
              />
            </div>

            {formData.isShowcased && (
              <div className='grid gap-2'>
                <label className='font-medium'>Manşet Kategorileri</label>
                <MultiSelect
                  options={categoryOptions}
                  selected={formData.showcasedCategories || []}
                  onChange={values => {
                    setFormData(prev => ({
                      ...prev,
                      showcasedCategories: values,
                    }));
                  }}
                  placeholder='Manşet kategorilerini seçin'
                />
              </div>
            )}

            <div className='flex items-center justify-between'>
              <div className='space-y-0.5'>
                <label className='font-medium'>Anasayfa Manşet</label>
                <p className='text-sm text-gray-500'>
                  Bu oyun anasayfa manşetinde gösterilsin
                </p>
              </div>
              <Switch
                checked={formData.isHomePageShowcased || false}
                onCheckedChange={checked =>
                  setFormData(prev => ({
                    ...prev,
                    isHomePageShowcased: checked,
                  }))
                }
              />
            </div>
          </div>
		  
		  <div className='grid gap-2'>
          <label className='font-medium'>Gösterilecek Cihazlar</label>
          <MultiSelect
            options={deviceOptions}
            selected={formData.devices || ['all']}
            onChange={values => {
              // Eğer 'all' seçiliyse diğer seçimleri temizle
              const hasAll = values.includes('all');
              const newValues = hasAll ? ['all'] : values;
              
              setFormData(prev => ({
                ...prev,
                devices: newValues,
              }));
            }}
            placeholder='Cihazları seçin'
          />
          <p className='text-sm text-gray-500'>
            Bu oyunun hangi cihazlarda görüneceğini seçin. "Tüm Cihazlar" seçiliyse diğer seçimler geçersiz olur.
          </p>
        </div>

          <div className='grid gap-4'>
            <h3 className='font-medium'>SEO Bilgileri</h3>

            <div className='grid grid-cols-2 gap-4'>
              <div className='grid gap-2'>
                <label className='font-medium'>Anahtar Kelimeler (TR)</label>
                <Input
                  value={formData.keywords?.tr?.join(', ')}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      keywords: {
                        ...prev.keywords!,
                        tr: e.target.value.split(',').map(k => k.trim()),
                      },
                    }))
                  }
                  placeholder='kelime1, kelime2, kelime3'
                />
              </div>
              <div className='grid gap-2'>
                <label className='font-medium'>Anahtar Kelimeler (EN)</label>
                <Input
                  value={formData.keywords?.en?.join(', ')}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      keywords: {
                        ...prev.keywords!,
                        en: e.target.value.split(',').map(k => k.trim()),
                      },
                    }))
                  }
                  placeholder='keyword1, keyword2, keyword3'
                />
              </div>
            </div>
          </div>

          <div className='grid gap-2'>
            <label className='font-medium'>Oyun Yönü</label>
            <Select
              value={formData.orientation}
              onValueChange={value =>
                setFormData(prev => ({
                  ...prev,
                  orientation: value as 'horizontal' | 'vertical',
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='Oyun yönünü seçin' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='horizontal'>Yatay</SelectItem>
                <SelectItem value='vertical'>Dikey</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className='flex justify-end gap-3'>
          <Button variant='outline' onClick={onClose}>
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
