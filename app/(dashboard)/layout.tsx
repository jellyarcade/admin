import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { AuthGuard } from '@/components/auth-guard';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className='flex min-h-screen'>
        <Sidebar />
        <div className='flex-1'>
          <Header />
          <main className='p-6'>{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
