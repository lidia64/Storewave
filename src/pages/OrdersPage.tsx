import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PackageCheck, PackageOpen } from 'lucide-react';
import { orderService } from '../services/order.service';
import type { Order } from '../types';
import Spinner from '../components/ui/Spinner';
import ErrorMessage from '../components/ui/ErrorMessage';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  PAID: 'bg-sky-100 text-sky-700',
  SHIPPED: 'bg-violet-100 text-violet-700',
  DELIVERED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-600',
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    orderService
      .getMyOrders()
      .then(({ data }) => setOrders(data.data))
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#a85432]">Your purchases</p>
          <h1 className="text-3xl font-black text-stone-900">My orders</h1>
        </div>

        {loading && <Spinner message="Loading orders..." />}
        {error && <ErrorMessage message={error} onRetry={load} />}

        {!loading && !error && orders.length === 0 && (
          <div className="rounded-lg border border-stone-200 bg-white py-20 text-center text-stone-500">
            <PackageOpen className="mx-auto mb-4 text-stone-300" size={48} />
            <p className="mb-4 text-lg font-semibold text-stone-700">No orders yet</p>
            <Link to="/products" className="font-semibold text-[#a85432] hover:underline">
              Start shopping
            </Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#a85432]/10 text-[#a85432]">
                      <PackageCheck size={20} />
                    </span>
                    <div>
                      <p className="font-mono text-xs text-stone-400">#{order.id.slice(-8).toUpperCase()}</p>
                      <p className="mt-0.5 text-sm text-stone-500">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_COLORS[order.status] ?? 'bg-stone-100 text-stone-600'}`}>
                    {order.status}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-4">
                  <p className="text-sm text-stone-600">{order.items?.length ?? 0} item(s)</p>
                  <p className="font-black text-[#a85432]">${order.total?.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
