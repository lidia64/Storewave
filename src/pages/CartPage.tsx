import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCartStore } from '../stores/cartStore';
import { orderService } from '../services/order.service';
import Spinner from '../components/ui/Spinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { getProductImage } from '../lib/images';

export default function CartPage() {
  const { cart, isLoading, error, fetchCart, updateItem, removeItem, clearCart, cartTotal } =
    useCartStore();
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutMsg, setCheckoutMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const handleCheckout = async () => {
    setCheckingOut(true);
    setCheckoutMsg('');
    try {
      await orderService.placeFromCart();
      setCheckoutMsg('Order placed successfully.');
      await fetchCart();
      setTimeout(() => navigate('/orders'), 1500);
    } catch (err: any) {
      setCheckoutMsg(err.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setCheckingOut(false);
    }
  };

  if (isLoading) return <Spinner message="Loading cart..." />;
  if (error) return <ErrorMessage message={error} onRetry={fetchCart} />;

  const items = cart?.items ?? [];
  const checkoutSuccess = checkoutMsg === 'Order placed successfully.';

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#a85432]">Protected checkout</p>
          <h1 className="text-3xl font-black text-stone-900">Shopping cart</h1>
        </div>

        {items.length === 0 ? (
          <div className="rounded-lg border border-stone-200 bg-white py-20 text-center text-stone-500">
            <ShoppingBag className="mx-auto mb-4 text-stone-300" size={48} />
            <p className="mb-4 text-lg font-semibold text-stone-700">Your cart is empty</p>
            <Link to="/products" className="font-semibold text-[#a85432] hover:underline">
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {items.map((item) => {
                const price = item.variant?.price ?? item.product?.price ?? 0;
                const image = getProductImage(item.product);
                return (
                  <div key={item.id} className="flex gap-4 rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-stone-100 sm:h-28 sm:w-28">
                      <img src={image} alt={item.product?.name ?? 'Product'} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-stone-900">
                        {item.product?.name ?? 'Product'}
                      </p>
                      {item.variant && (
                        <p className="mt-1 text-xs text-stone-500">
                          {[item.variant.color, item.variant.size].filter(Boolean).join(' / ')}
                        </p>
                      )}
                      <p className="mt-2 text-sm font-black text-[#a85432]">${price.toFixed(2)}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                          className="grid h-8 w-8 place-items-center rounded-lg border border-stone-300 text-stone-600 hover:bg-stone-100"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-7 text-center text-sm font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateItem(item.id, item.quantity + 1)}
                          className="grid h-8 w-8 place-items-center rounded-lg border border-stone-300 text-stone-600 hover:bg-stone-100"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="hidden text-right sm:block">
                      <p className="font-black text-stone-900">${(price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                );
              })}

              <button
                onClick={clearCart}
                className="text-sm font-semibold text-stone-500 hover:text-red-600"
              >
                Clear cart
              </button>
            </div>

            <div className="h-fit rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-black text-stone-900">Order summary</h2>
              <div className="mb-2 flex justify-between text-sm text-stone-600">
                <span>Subtotal</span>
                <span>${cartTotal().toFixed(2)}</span>
              </div>
              <div className="mb-4 flex justify-between text-sm text-stone-600">
                <span>Shipping</span>
                <span className="font-semibold text-emerald-700">Free</span>
              </div>
              <div className="border-t border-stone-200 pt-4 flex justify-between font-black text-stone-900">
                <span>Total</span>
                <span>${cartTotal().toFixed(2)}</span>
              </div>

              {checkoutMsg && (
                <p className={`mt-4 inline-flex items-center gap-2 text-sm font-semibold ${checkoutSuccess ? 'text-emerald-700' : 'text-red-600'}`}>
                  {checkoutSuccess && <CheckCircle2 size={16} />}
                  {checkoutMsg}
                </p>
              )}

              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="mt-5 w-full rounded-lg bg-[#a85432] py-3 font-semibold text-white transition-colors hover:bg-[#8f4328] disabled:opacity-60"
              >
                {checkingOut ? 'Placing order...' : 'Checkout'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
