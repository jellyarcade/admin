export function Footer() {
  return (
    <footer className="border-t bg-white py-4 px-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          © 2024 Admin Dashboard. Tüm hakları saklıdır.
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <a href="#" className="hover:text-gray-900">Gizlilik Politikası</a>
          <a href="#" className="hover:text-gray-900">Kullanım Şartları</a>
        </div>
      </div>
    </footer>
  );
}