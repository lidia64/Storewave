import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const cartCount = useCartStore((s) => s.cartCount());
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-indigo-600 tracking-tight">
          Ecomus
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/products" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
            Products
          </Link>
          <Link to="/categories" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
            Categories
          </Link>

          {user ? (
            <>
              <Link
                to="/cart"
                className="relative text-sm text-gray-600 hover:text-indigo-600 transition-colors"
              >
                🛒
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
              <Link to="/orders" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                Orders
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-red-500 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
