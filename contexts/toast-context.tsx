'use client';

import { createContext, useContext, useState } from 'react';
import * as Toast from '@radix-ui/react-toast';
import { Check, AlertCircle, Info, AlertTriangle } from 'lucide-react';

interface ToastContextType {
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [toastData, setToastData] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  } | null>(null);

  const showToast = (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info'
  ) => {
    setToastData({ type, message });
    setOpen(true);
  };

  const icons = {
    success: <Check className='w-4 h-4 text-green-500' />,
    error: <AlertCircle className='w-4 h-4 text-red-500' />,
    warning: <AlertTriangle className='w-4 h-4 text-orange-500' />,
    info: <Info className='w-4 h-4 text-blue-500' />,
  };

  const styles = {
    success: 'bg-green-50 border border-green-200',
    error: 'bg-red-50 border border-red-200',
    warning: 'bg-orange-50 border border-orange-200',
    info: 'bg-blue-50 border border-blue-200',
  };

  const titles = {
    success: 'Başarılı',
    error: 'Hata',
    warning: 'Uyarı',
    info: 'Bilgi',
  };

  const success = (message: string) => showToast(message, 'success');
  const error = (message: string) => showToast(message, 'error');
  const warning = (message: string) => showToast(message, 'warning');
  const info = (message: string) => showToast(message, 'info');

  return (
    <Toast.Provider swipeDirection='right'>
      <ToastContext.Provider value={{ success, error, warning, info }}>
        {children}
      </ToastContext.Provider>

      <Toast.Root
        className={`${
          toastData ? styles[toastData.type] : ''
        } rounded-lg p-4 shadow-lg`}
        open={open}
        onOpenChange={setOpen}
      >
        {toastData && (
          <div className='flex items-center gap-2'>
            {icons[toastData.type]}
            <div>
              <Toast.Title className='font-medium'>
                {titles[toastData.type]}
              </Toast.Title>
              <Toast.Description className='text-sm text-gray-600'>
                {toastData.message}
              </Toast.Description>
            </div>
          </div>
        )}
      </Toast.Root>

      <Toast.Viewport className='fixed bottom-0 right-0 flex flex-col p-6 gap-2 w-full max-w-sm z-50' />
    </Toast.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
