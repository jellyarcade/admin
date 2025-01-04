'use client';

import * as React from 'react';
import { Check, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MultiSelectProps {
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = 'Seçiniz...',
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (value: string) => {
    let newSelected: string[];
    if (selected.includes(value)) {
      newSelected = selected.filter(s => s !== value);
    } else {
      newSelected = [...selected, value];
    }
    console.log('New Selected:', newSelected); // Debug için
    onChange(newSelected);
  };

  // Dışarı tıklandığında menüyü kapat
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (open && !(event.target as Element).closest('.multi-select')) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className='relative multi-select'>
      <div
        className='flex flex-wrap gap-1 p-2 border rounded-md cursor-pointer min-h-[40px]'
        onClick={() => setOpen(!open)}
      >
        {selected.map(value => {
          const option = options.find(o => o.value === value);
          if (!option) return null;
          return (
            <Badge
              key={value}
              variant='secondary'
              className='rounded-sm px-1 font-normal'
            >
              {option.label}
              <button
                className='ml-1'
                onClick={e => {
                  e.stopPropagation();
                  handleSelect(value);
                }}
              >
                <X className='h-3 w-3' />
              </button>
            </Badge>
          );
        })}
        {selected.length === 0 && (
          <span className='text-gray-500'>{placeholder}</span>
        )}
      </div>

      {open && (
        <div className='absolute w-full mt-1 bg-white border rounded-md shadow-lg z-50 max-h-60 overflow-auto'>
          {options.map(option => {
            const isSelected = selected.includes(option.value);
            return (
              <div
                key={option.value}
                className={`flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-gray-100 ${
                  isSelected ? 'bg-gray-50' : ''
                }`}
                onClick={() => {
                  handleSelect(option.value);
                  setOpen(false);
                }}
              >
                <Check
                  className={`h-4 w-4 ${
                    isSelected ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                <span>{option.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
