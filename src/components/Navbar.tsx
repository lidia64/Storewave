import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, PackageSearch, ShoppingBag, ShoppingCart, UserPlus } from 'lucide-react';
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
    <nav className="sticky top-0 z-50 bg-white/95 border-b border-stone-200 shadow-sm backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 flex items-center justify-between gap-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-xl font-black tracking-tight text-[#a85432]">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#a85432] text-white">
            <ShoppingBag size={20} />
          </span>
          StoreWave
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link to="/products" className="text-sm font-medium text-stone-600 hover:text-[#a85432] transition-colors">
            Products
          </Link>
          <Link to="/categories" className="text-sm font-medium text-stone-600 hover:text-[#a85432] transition-colors">
            Categories
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {user ? (
            <>
              <Link
                to="/cart"
                className="relative grid h-10 w-10 place-items-center rounded-lg border border-stone-200 text-stone-700 hover:border-[#a85432] hover:text-[#a85432] transition-colors"
                aria-label="Cart"
              >
                <ShoppingCart size={19} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#a85432] text-white text-xs rounded-full min-w-5 h-5 px-1 flex items-center justify-center">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Link>
              <Link to="/orders" className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-[#a85432] transition-colors">
                <PackageSearch size={17} />
                Orders
              </Link>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-red-600 transition-colors"
              >
                <LogOut size={17} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-stone-600 hover:text-[#a85432] transition-colors">
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 text-sm bg-[#a85432] text-white px-4 py-2 rounded-lg hover:bg-[#8f4328] transition-colors"
              >
                <UserPlus size={16} />
                Sign up
              </Link>
            </>
          )}
          <Link to="/products" className="grid h-10 w-10 place-items-center rounded-lg border border-stone-200 text-stone-700 md:hidden" aria-label="Browse products">
            <Menu size={19} />
          </Link>
        </div>
      </div>
    </nav>
  );
}
