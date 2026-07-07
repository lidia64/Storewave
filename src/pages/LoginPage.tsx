import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { authImage } from '../lib/images';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch {}
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-stone-50 px-4 py-8 sm:py-12">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm md:grid-cols-2">
        <div className="hidden min-h-[560px] bg-stone-900 md:block">
          <img src={authImage} alt="Curated retail shelves" className="h-full w-full object-cover opacity-90" />
        </div>
        <div className="flex items-center p-6 sm:p-10">
          <div className="w-full">
            <p className="text-sm font-semibold uppercase tracking-wide text-[#a85432]">StoreWave account</p>
            <h1 className="mt-2 text-3xl font-black text-stone-900">Welcome back</h1>
            <p className="mt-2 text-sm text-stone-500">Sign in to manage your cart, orders, and saved shopping flow.</p>

            {error && (
              <div className="mt-6 flex justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
                <button onClick={clearError} className="ml-2 font-bold" aria-label="Dismiss error">x</button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-lg border border-stone-300 py-3 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#a85432]/30"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-lg border border-stone-300 py-3 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#a85432]/30"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-lg bg-[#a85432] py-3 font-semibold text-white transition-colors hover:bg-[#8f4328] disabled:opacity-60"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-stone-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-[#a85432] hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
