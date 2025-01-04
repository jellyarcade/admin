'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Game, Category } from '@/types';
import Image from 'next/image';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SortableGameItemProps {
  game: Game;
  categories: Category[];
  onEdit: () => void;
  onDelete: () => void;
}

export function SortableGameItem({
  game,
  categories,
  onEdit,
  onDelete,
}: SortableGameItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: game._id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Game.categories artık doğrudan kategori objelerini içeriyor
  const gameCategories = game.categories as unknown as Category[];

  return (
    <TableRow ref={setNodeRef} style={style} className='cursor-move'>
      <TableCell>
        <div className='flex items-center gap-4'>
          <div {...attributes} {...listeners}>
            <GripVertical className='h-4 w-4 text-gray-400' />
          </div>
          <div className='w-16 h-16 relative'>
            <Image
              src={game.image}
              alt={game.title.tr}
              fill
              className='object-cover rounded'
            />
          </div>
          <div>
            <h3 className='font-medium'>{game.title.tr}</h3>
            <p className='text-sm text-gray-500'>{game.title.en}</p>
            <div className='flex items-center gap-2 mt-1'>
              {game.isNew && (
                <span className='px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded'>
                  Yeni
                </span>
              )}
              {game.isPopular && (
                <span className='px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded'>
                  Popüler
                </span>
              )}
              {!game.isActive && (
                <span className='px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded'>
                  Pasif
                </span>
              )}
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className='flex flex-wrap gap-1'>
          {gameCategories.map(category => (
            <span
              key={category._id}
              className={cn(
                'px-2 py-1 text-xs rounded',
                category.parent
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-gray-100 text-gray-800'
              )}
            >
              {category.name.tr}
            </span>
          ))}
        </div>
      </TableCell>
      <TableCell>
        <span className='text-gray-500'>#{game.order}</span>
      </TableCell>
      <TableCell className='text-right'>
        <Button
          variant='ghost'
          size='icon'
          onClick={onEdit}
          className='cursor-pointer'
        >
          <Pencil className='h-4 w-4' />
        </Button>
        <Button
          variant='ghost'
          size='icon'
          onClick={onDelete}
          className='cursor-pointer text-red-600 hover:text-red-700'
        >
          <Trash2 className='h-4 w-4' />
        </Button>
      </TableCell>
    </TableRow>
  );
}
