import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services/product.service';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import type { Product, Variant } from '../types';
import Spinner from '../components/ui/Spinner';
import ErrorMessage from '../components/ui/ErrorMessage';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [qty, setQty] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMsg, setCartMsg] = useState('');

  const { addItem } = useCartStore();
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    productService
      .getById(id)
      .then(({ data }) => {
        setProduct(data.data.product);
        setAvgRating(data.data.avgRating);
        if (data.data.product.variants?.length) {
          setSelectedVariant(data.data.product.variants[0]);
        }
      })
      .catch(() => setError('Product not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!token) { navigate('/login'); return; }
    if (!product) return;
    if (product.variants?.length && !selectedVariant) {
      setCartMsg('Please select a variant.');
      return;
    }
    setAddingToCart(true);
    setCartMsg('');
    try {
      await addItem(product.id, selectedVariant?.id ?? '', qty);
      setCartMsg('Added to cart! 🛒');
    } catch (err: any) {
      setCartMsg(err.response?.data?.message || 'Failed to add to cart.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <Spinner message="Loading product…" />;
  if (error || !product) return <ErrorMessage message={error || 'Product not found.'} />;

  const displayPrice = selectedVariant?.price ?? product.price;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <button onClick={() => navigate(-1)} className="text-sm text-indigo-600 hover:underline mb-6 block">
        ← Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Images */}
        <div className="space-y-3">
          <div className="aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
            {product.images?.[0]?.url ? (
              <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300 text-7xl">🛍️</div>
            )}
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.slice(1).map((img, i) => (
                <img key={i} src={img.url} alt="" className="w-16 h-16 object-cover rounded-lg border border-gray-200 flex-shrink-0" />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {product.category?.name && (
            <span className="text-xs text-indigo-500 font-medium uppercase tracking-wide">
              {product.category.name}
            </span>
          )}
          <h1 className="text-2xl font-bold text-gray-800 mt-1">{product.name}</h1>
          {product.brand && <p className="text-sm text-gray-400 mt-1">{product.brand}</p>}

          {avgRating !== null && avgRating > 0 && (
            <p className="text-sm text-yellow-500 mt-1">★ {avgRating.toFixed(1)}</p>
          )}

          <p className="text-3xl font-bold text-indigo-600 mt-4">${displayPrice.toFixed(2)}</p>

          {product.description && (
            <p className="text-gray-600 text-sm mt-4 leading-relaxed">{product.description}</p>
          )}

          {/* Variants */}
          {product.variants && product.variants.length > 0 && (
            <div className="mt-5">
              <p className="text-sm font-medium text-gray-700 mb-2">Select Variant</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                      selectedVariant?.id === v.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-gray-300 text-gray-600 hover:border-indigo-400'
                    }`}
                  >
                    {[v.color, v.size].filter(Boolean).join(' / ') || v.sku || v.id.slice(-6)}
                    {v.price && ` — $${v.price.toFixed(2)}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mt-5 flex items-center gap-3">
            <p className="text-sm font-medium text-gray-700">Qty</p>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-1.5 text-gray-600 hover:bg-gray-100"
              >−</button>
              <span className="px-4 py-1.5 text-sm font-medium">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                className="px-3 py-1.5 text-gray-600 hover:bg-gray-100"
              >+</button>
            </div>
            <span className="text-xs text-gray-400">{product.stock} in stock</span>
          </div>

          {cartMsg && (
            <p className={`text-sm mt-3 ${cartMsg.includes('🛒') ? 'text-green-600' : 'text-red-500'}`}>
              {cartMsg}
            </p>
          )}

          <button
            onClick={handleAddToCart}
            disabled={addingToCart || product.stock === 0}
            className="mt-5 w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-60 transition-colors"
          >
            {product.stock === 0 ? 'Out of Stock' : addingToCart ? 'Adding…' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
