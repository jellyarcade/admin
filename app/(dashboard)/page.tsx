export default function DashboardPage() {
  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>Dashboard</h1>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <div className='p-6 bg-white rounded-lg shadow'>
          <h2 className='text-lg font-semibold'>Toplam Oyun</h2>
          <p className='text-3xl font-bold'>0</p>
        </div>
        <div className='p-6 bg-white rounded-lg shadow'>
          <h2 className='text-lg font-semibold'>Toplam Kategori</h2>
          <p className='text-3xl font-bold'>0</p>
        </div>
        <div className='p-6 bg-white rounded-lg shadow'>
          <h2 className='text-lg font-semibold'>Toplam Kullanıcı</h2>
          <p className='text-3xl font-bold'>0</p>
        </div>
        <div className='p-6 bg-white rounded-lg shadow'>
          <h2 className='text-lg font-semibold'>Toplam Oynanma</h2>
          <p className='text-3xl font-bold'>0</p>
        </div>
      </div>
    </div>
  );
}
