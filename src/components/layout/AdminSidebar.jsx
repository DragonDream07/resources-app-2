import { NavLink } from 'react-router-dom';
import packageIcon from '@/assets/icons/package.svg';
import editIcon from '@/assets/icons/edit.svg';
import userIcon from '@/assets/icons/user.svg';
import starIcon from '@/assets/icons/star.svg';
import checkIcon from '@/assets/icons/check.svg';
import externalLinkIcon from '@/assets/icons/external-link.svg';
import chartIcon from '@/assets/icons/star.svg';

const navItems = [
  {
    label: 'Dashboard',
    to: '/admin',
    icon: externalLinkIcon,
    end: true,
  },
  {
    label: 'Reports',
    to: '/admin/reports',
    icon: chartIcon,
  },
  {
    label: 'Orders',
    to: '/admin/orders',
    icon: packageIcon,
  },
  {
    label: 'Products',
    to: '/admin/catalogue/products',
    icon: editIcon,
  },
  {
    label: 'Categories',
    to: '/admin/catalogue/categories',
    icon: editIcon,
  },
  {
    label: 'Brands',
    to: '/admin/catalogue/brands',
    icon: starIcon,
  },
  {
    label: 'Promotions',
    to: '/admin/promotions',
    icon: checkIcon,
  },
  {
    label: 'Returns',
    to: '/admin/returns',
    icon: packageIcon,
  },
  {
    label: 'Users',
    to: '/admin/users',
    icon: userIcon,
  },
];

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-gray-900 text-gray-200 flex flex-col min-h-screen shrink-0">
      <div className="px-6 py-5 border-b border-gray-700">
        <span className="text-white font-bold text-lg tracking-wide">
          Admin
        </span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white',
              ].join(' ')
            }
          >
            <img src={item.icon} alt="" className="w-5 h-5 opacity-80" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="px-6 py-4 border-t border-gray-700 text-xs text-gray-500">
        Admin Panel
      </div>
    </aside>
  );
};

export default AdminSidebar;
