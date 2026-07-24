import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logoSrc from '@/assets/images/logo.svg';
import searchIcon from '@/assets/icons/search.svg';
import cartIcon from '@/assets/icons/cart.svg';
import userIcon from '@/assets/icons/user.svg';
import bellIcon from '@/assets/icons/bell.svg';
import chevronDownIcon from '@/assets/icons/chevron-down.svg';
import menuIcon from '@/assets/icons/menu.svg';
import closeIcon from '@/assets/icons/close.svg';

const Header = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);

  const cartItemCount = useSelector((state) =>
    state.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0
  );
  const notificationCount = useSelector(
    (state) => state.notifications?.unreadCount ?? 0
  );
  const isAuthenticated = useSelector((state) => !!state.auth?.token);
  const user = useSelector((state) => state.auth?.user);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={logoSrc} alt="Logo" className="h-8 w-auto" />
          </Link>

          {/* Search bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 mx-8"
          >
            <div className="relative w-full max-w-xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products…"
                className="w-full border border-gray-300 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                aria-label="Search"
              >
                <img src={searchIcon} alt="" className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Right icons */}
          <div className="flex items-center gap-4">
            {/* Notification bell */}
            {isAuthenticated && (
              <Link
                to="/account/notifications"
                className="relative hidden md:block"
                aria-label="Notifications"
              >
                <img src={bellIcon} alt="" className="w-6 h-6" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative hidden md:block"
              aria-label="Cart"
            >
              <img src={cartIcon} alt="" className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </Link>

            {/* Account menu */}
            <div className="relative hidden md:block" ref={accountMenuRef}>
              <button
                onClick={() => setAccountMenuOpen((prev) => !prev)}
                className="flex items-center gap-1 text-sm text-gray-700 hover:text-indigo-600"
                aria-haspopup="true"
                aria-expanded={accountMenuOpen}
                aria-label="Account menu"
              >
                <img src={userIcon} alt="" className="w-6 h-6" />
                <span className="max-w-[80px] truncate">
                  {isAuthenticated ? user?.firstName ?? 'Account' : 'Sign In'}
                </span>
                <img src={chevronDownIcon} alt="" className="w-4 h-4" />
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <nav className="py-1">
                    {isAuthenticated ? (
                      <>
                        <Link
                          to="/account"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setAccountMenuOpen(false)}
                        >
                          My Account
                        </Link>
                        <Link
                          to="/account/orders"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setAccountMenuOpen(false)}
                        >
                          Orders
                        </Link>
                        <Link
                          to="/account/addresses"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setAccountMenuOpen(false)}
                        >
                          Addresses
                        </Link>
                        <hr className="my-1" />
                        <button
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          onClick={() => {
                            setAccountMenuOpen(false);
                            navigate('/logout');
                          }}
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/auth/login"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setAccountMenuOpen(false)}
                        >
                          Sign In
                        </Link>
                        <Link
                          to="/auth/register"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setAccountMenuOpen(false)}
                        >
                          Create Account
                        </Link>
                      </>
                    )}
                  </nav>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <img
                src={mobileMenuOpen ? closeIcon : menuIcon}
                alt=""
                className="w-6 h-6"
              />
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <form onSubmit={handleSearchSubmit} className="md:hidden pb-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products…"
              className="w-full border border-gray-300 rounded-full py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2"
              aria-label="Search"
            >
              <img src={searchIcon} alt="" className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-2">
          <Link
            to="/cart"
            className="flex items-center gap-2 text-sm text-gray-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img src={cartIcon} alt="" className="w-5 h-5" />
            Cart
            {cartItemCount > 0 && (
              <span className="bg-indigo-600 text-white text-xs rounded-full px-1.5">
                {cartItemCount}
              </span>
            )}
          </Link>
          {isAuthenticated ? (
            <>
              <Link
                to="/account/notifications"
                className="flex items-center gap-2 text-sm text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <img src={bellIcon} alt="" className="w-5 h-5" />
                Notifications
                {notificationCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full px-1.5">
                    {notificationCount}
                  </span>
                )}
              </Link>
              <Link
                to="/account"
                className="block text-sm text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Account
              </Link>
              <Link
                to="/account/orders"
                className="block text-sm text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Orders
              </Link>
              <button
                className="block text-sm text-red-600"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/logout');
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth/login"
                className="block text-sm text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/auth/register"
                className="block text-sm text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
