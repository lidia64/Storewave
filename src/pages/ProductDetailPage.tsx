import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Minus, Plus, ShoppingCart, Star } from 'lucide-react';
import { productService } from '../services/product.service';
import { useCartStore } from '../stores/cartStore';
import { useAuthStore } from '../stores/authStore';
import type { Product, Variant } from '../types';
import Spinner from '../components/ui/Spinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { getProductImage } from '../lib/images';

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
      setCartMsg('Added to cart.');
    } catch (err: any) {
      setCartMsg(err.response?.data?.message || 'Failed to add to cart.');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <Spinner message="Loading product..." />;
  if (error || !product) return <ErrorMessage message={error || 'Product not found.'} />;

  const displayPrice = selectedVariant?.price ?? product.price;
  const mainImage = getProductImage(product);
  const isSuccess = cartMsg === 'Added to cart.';

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-[#a85432] hover:underline"
        >
          <ArrowLeft size={17} />
          Back
        </button>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="space-y-3">
            <div className="aspect-square overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
              <img src={mainImage} alt={product.name} className="h-full w-full object-cover" />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <img key={`${img.url}-${i}`} src={img.url} alt="" className="h-20 w-20 flex-shrink-0 rounded-lg border border-stone-200 object-cover" />
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm sm:p-7">
            {product.category?.name && (
              <span className="text-xs font-bold uppercase tracking-wide text-[#a85432]">
                {product.category.name}
              </span>
            )}
            <h1 className="mt-2 text-3xl font-black text-stone-900">{product.name}</h1>
            {product.brand && <p className="mt-1 text-sm text-stone-500">{product.brand}</p>}

            {avgRating !== null && avgRating > 0 && (
              <p className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-amber-600">
                <Star size={16} fill="currentColor" />
                {avgRating.toFixed(1)}
              </p>
            )}

            <p className="mt-5 text-4xl font-black text-[#a85432]">${displayPrice.toFixed(2)}</p>

            {product.description && (
              <p className="mt-5 text-sm leading-7 text-stone-600">{product.description}</p>
            )}

            {product.variants && product.variants.length > 0 && (
              <div className="mt-6">
                <p className="mb-2 text-sm font-bold text-stone-800">Select variant</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-colors ${
                        selectedVariant?.id === v.id
                          ? 'border-[#a85432] bg-[#a85432]/10 text-[#a85432]'
                          : 'border-stone-300 text-stone-600 hover:border-[#a85432]/50'
                      }`}
                    >
                      {[v.color, v.size].filter(Boolean).join(' / ') || v.sku || v.id.slice(-6)}
                      {v.price && ` - $${v.price.toFixed(2)}`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <p className="text-sm font-bold text-stone-800">Qty</p>
              <div className="flex h-11 items-center overflow-hidden rounded-lg border border-stone-300">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="grid h-11 w-11 place-items-center text-stone-600 hover:bg-stone-100"
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="w-11 text-center text-sm font-bold">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="grid h-11 w-11 place-items-center text-stone-600 hover:bg-stone-100"
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
              <span className="text-xs font-medium text-stone-500">{product.stock} in stock</span>
            </div>

            {cartMsg && (
              <p className={`mt-4 inline-flex items-center gap-2 text-sm font-semibold ${isSuccess ? 'text-emerald-700' : 'text-red-600'}`}>
                {isSuccess && <CheckCircle2 size={16} />}
                {cartMsg}
              </p>
            )}

            <button
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock === 0}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#a85432] py-3 font-semibold text-white transition-colors hover:bg-[#8f4328] disabled:opacity-60"
            >
              <ShoppingCart size={19} />
              {product.stock === 0 ? 'Out of stock' : addingToCart ? 'Adding...' : 'Add to cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
