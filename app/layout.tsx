import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/auth-context';
import { ToastProvider } from '@/contexts/toast-context';
import { AuthGuard } from '@/components/auth-guard';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='tr'>
      <body className={inter.className}>
        <AuthProvider>
          <ToastProvider>
            <AuthGuard>{children}</AuthGuard>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
