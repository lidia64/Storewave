import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../stores/cartStore';
import { orderService } from '../services/order.service';
import Spinner from '../components/ui/Spinner';
import ErrorMessage from '../components/ui/ErrorMessage';

export default function CartPage() {
  const { cart, isLoading, error, fetchCart, updateItem, removeItem, clearCart, cartTotal } =
    useCartStore();
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutMsg, setCheckoutMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchCart(); }, []);

  const handleCheckout = async () => {
    setCheckingOut(true);
    setCheckoutMsg('');
    try {
      const { data } = await orderService.placeFromCart();
      setCheckoutMsg('Order placed successfully! 🎉');
      await fetchCart();
      setTimeout(() => navigate('/orders'), 1500);
    } catch (err: any) {
      setCheckoutMsg(err.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setCheckingOut(false);
    }
  };

  if (isLoading) return <Spinner message="Loading cart…" />;
  if (error) return <ErrorMessage message={error} onRetry={fetchCart} />;

  const items = cart?.items ?? [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🛒</p>
          <p className="text-lg mb-4">Your cart is empty</p>
          <Link to="/products" className="text-indigo-600 hover:underline font-medium">
            Continue shopping →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const price = item.variant?.price ?? item.product?.price ?? 0;
              const image = item.product?.images?.[0]?.url;
              return (
                <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 shadow-sm">
                  <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                    {image ? (
                      <img src={image} alt={item.product?.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl text-gray-300">🛍️</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">
                      {item.product?.name ?? 'Product'}
                    </p>
                    {item.variant && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {[item.variant.color, item.variant.size].filter(Boolean).join(' / ')}
                      </p>
                    )}
                    <p className="text-indigo-600 font-semibold text-sm mt-1">${price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                        className="w-7 h-7 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 text-sm"
                      >−</button>
                      <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateItem(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 text-sm"
                      >+</button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto text-xs text-red-400 hover:text-red-600"
                      >Remove</button>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gray-800">${(price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              );
            })}

            <button
              onClick={clearCart}
              className="text-sm text-gray-400 hover:text-red-500 underline"
            >
              Clear cart
            </button>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-fit">
            <h2 className="font-bold text-gray-800 mb-4">Order Summary</h2>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Subtotal</span>
              <span>${cartTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-gray-800">
              <span>Total</span>
              <span>${cartTotal().toFixed(2)}</span>
            </div>

            {checkoutMsg && (
              <p className={`text-sm mt-3 ${checkoutMsg.includes('🎉') ? 'text-green-600' : 'text-red-500'}`}>
                {checkoutMsg}
              </p>
            )}

            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="mt-5 w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-60 transition-colors"
            >
              {checkingOut ? 'Placing order…' : 'Checkout'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
