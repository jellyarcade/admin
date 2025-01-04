'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { GripVertical, Pencil, Trash2, FolderTree } from 'lucide-react';
import { Category } from '@/types/category';
import { Badge } from '@/components/ui/badge';

interface SortableTableRowProps {
  id: string;
  category: Category;
  onEdit: () => void;
  onDelete: (category: Category) => void;
  categories: Category[];
  depth?: number;
}

export function SortableTableRow({
  id,
  category,
  onEdit,
  onDelete,
  categories,
  depth = 0,
}: SortableTableRowProps) {
  const { attributes, listeners, transform, transition, setNodeRef } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell>
        <div style={{ paddingLeft: `${depth * 2}rem` }}>
          <Button
            variant='ghost'
            size='icon'
            className='cursor-grab'
            {...attributes}
            {...listeners}
          >
            <GripVertical className='h-4 w-4' />
          </Button>
        </div>
      </TableCell>
      <TableCell>
        {category.image ? (
          <img
            src={category.image}
            alt={category.name.tr}
            className='w-12 h-12 object-cover rounded'
          />
        ) : (
          <div className='w-12 h-12 bg-gray-100 rounded flex items-center justify-center'>
            <FolderTree className='w-6 h-6 text-gray-400' />
          </div>
        )}
      </TableCell>
      <TableCell>{category.name.tr}</TableCell>
      <TableCell>{category.name.en}</TableCell>
      <TableCell>
        {category.parent
          ? categories.find(c => c._id === category.parent)?.name.tr
          : '-'}
      </TableCell>
      <TableCell>{category.order}</TableCell>
      <TableCell>
        {category.isNewGames && (
          <Badge variant='secondary' className='bg-green-100 text-green-800'>
            Yeni
          </Badge>
        )}
      </TableCell>
      <TableCell>
        {category.isMostPlayed && (
          <Badge variant='secondary' className='bg-purple-100 text-purple-800'>
            Popüler
          </Badge>
        )}
      </TableCell>
      <TableCell className='space-x-2'>
        <Button variant='ghost' size='icon' onClick={onEdit}>
          <Pencil className='h-4 w-4' />
        </Button>
        <Button variant='ghost' size='icon' onClick={() => onDelete(category)}>
          <Trash2 className='h-4 w-4' />
        </Button>
      </TableCell>
    </TableRow>
  );
}
