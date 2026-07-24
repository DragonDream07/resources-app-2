import { Outlet } from 'react-router-dom';
import AdminRoute from '@/routes/AdminRoute';
import AdminSidebar from './AdminSidebar';

const AdminShell = () => {
  return (
    <AdminRoute>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-sm">
            <div className="px-6 py-4">
              <h1 className="text-lg font-semibold text-gray-800">Admin Panel</h1>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </AdminRoute>
  );
};

export default AdminShell;
